import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";

export default function LegalArticle({
  children,
}: {
  headings: string[];
  children: ReactNode;
}) {
  let index = 0;
  return (
    <article className="mx-auto w-full max-w-[720px] space-y-6 text-[15px] leading-[1.6] text-muted [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_strong]:text-ink">
      {Children.map(children, (c) => {
        if (isValidElement(c) && c.type === "section") {
          index++;
          return cloneElement(
            c as ReactElement<{ id?: string; className?: string }>,
            { id: "bagian-" + index, className: "scroll-mt-28" },
          );
        }
        return c;
      })}
    </article>
  );
}
