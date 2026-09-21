"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";

import { cn } from "@/lib/utils";

// Animated select-style dropdown (from the emerald-ui AnimatedDropdown), reworked as a controlled
// listbox: it picks a value instead of navigating, uses this project's theme tokens, and supports
// the keyboard (arrows, Home/End, Enter/Space, Escape).

export interface DropdownOption {
  value: string;
  label: string;
}

interface AnimatedDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name of the control; the visible text is the selected option. */
  ariaLabel: string;
  icon?: ReactNode;
  /** Which edge of the trigger the list lines up with. */
  align?: "left" | "right";
  className?: string;
}

export default function AnimatedDropdown({
  options,
  value,
  onChange,
  ariaLabel,
  icon,
  align = "left",
  className,
}: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  // A value that is not (yet) among the options, e.g. a ?category= from the URL before the list loads.
  const triggerLabel = options[selectedIndex]?.label ?? value;

  const openMenu = useCallback(() => {
    setActiveIndex(Math.max(0, selectedIndex));
    setIsOpen(true);
  }, [selectedIndex]);

  const closeMenu = useCallback((refocus = false) => {
    setIsOpen(false);
    if (refocus) buttonRef.current?.focus();
  }, []);

  function choose(option: DropdownOption) {
    onChange(option.value);
    closeMenu(true);
  }

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  function handleKeyDown(event: KeyboardEvent) {
    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        closeMenu(true);
        break;
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (options[activeIndex]) choose(options[activeIndex]);
        break;
      case "Tab":
        closeMenu();
        break;
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div ref={wrapperRef} data-state={isOpen ? "open" : "closed"} className={cn("relative", className)} onKeyDown={handleKeyDown}>
        <button
          ref={buttonRef}
          type="button"
          role="combobox"
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listId : undefined}
          aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
          // detail === 0 means the click came from the keyboard, which handleKeyDown already handled.
          onClick={(event) => {
            if (event.detail === 0) return;
            if (isOpen) closeMenu();
            else openMenu();
          }}
          className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-foreground/20 bg-surface px-4 py-3 text-[14px] font-medium text-foreground transition-colors hover:border-foreground/40 focus-visible:border-foreground/40 focus-visible:outline-none"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {icon}
            <span className="truncate">{triggerLabel}</span>
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex shrink-0 text-foreground/50"
          >
            <ChevronDown size={18} />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id={listId}
              role="listbox"
              aria-label={ariaLabel}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={cn(
                "absolute top-[calc(100%+0.5rem)] z-50 max-h-72 w-max min-w-full max-w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-foreground/20 bg-surface p-1",
                align === "right" ? "right-0" : "left-0"
              )}
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
              >
                {options.map((option, index) => {
                  const selected = index === selectedIndex;
                  return (
                    <motion.div
                      key={option.value}
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={selected}
                      variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                      onClick={() => choose(option)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors duration-150",
                        selected ? "font-semibold text-foreground" : "font-medium text-foreground/70",
                        index === activeIndex && "bg-foreground/10 text-foreground"
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {selected && <Check size={15} className="shrink-0 text-primary" />}
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
