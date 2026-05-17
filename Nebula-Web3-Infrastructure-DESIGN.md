---
version: "alpha"
name: "Nebula | Web3 Infrastructure"
description: "Nebula Web3 Login Section is designed for authenticating users through a focused access flow. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for authentication screens in web products."
colors:
  primary: "#E11D48"
  secondary: "#4338CA"
  tertiary: "#F97316"
  neutral: "#000000"
  background: "#000000"
  surface: "#FFFFFF"
  text-primary: "#FFFFFF"
  text-secondary: "#000000"
  border: "#FFFFFF"
  accent: "#E11D48"
typography:
  display-lg:
    fontFamily: "System Font"
    fontSize: "72px"
    fontWeight: 600
    lineHeight: "72px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "System Font"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label-md:
    fontFamily: "System Font"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
rounded:
  md: "0px"
  full: "9999px"
spacing:
  base: "6px"
  sm: "6px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  gap: "6px"
  section-padding: "32px"
components:
  button-primary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "10px"
  button-link:
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "0px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Bounded
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses dark mode with #E11D48 as the main accent and #000000 as the neutral foundation.

- **Primary (#E11D48):** Main accent and emphasis color.
- **Secondary (#4338CA):** Supporting accent for secondary emphasis.
- **Tertiary (#F97316):** Reserved accent for supporting contrast moments.
- **Neutral (#000000):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #000000; Surface: #FFFFFF; Text Primary: #FFFFFF; Text Secondary: #000000; Border: #FFFFFF; Accent: #E11D48

- **Gradients:** bg-gradient-to-b from-[#f0f0f0] to-[#707070] via-[#c0c0c0], bg-gradient-to-tr from-transparent to-transparent via-white/20

## Typography

Typography relies on System Font across display, body, and utility text.

- **Display (`display-lg`):** System Font, 72px, weight 600, line-height 72px, letter-spacing -0.025em.
- **Body (`body-md`):** System Font, 16px, weight 400, line-height 24px.
- **Labels (`label-md`):** System Font, 12px, weight 500, line-height 16px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, bounded structural frame before changing ornament or component styling. Use 6px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / bounded composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Bounded
- **Base unit:** 6px
- **Scale:** 6px, 10px, 12px, 16px, 20px, 24px, 32px, 40px
- **Section padding:** 32px, 65.33px
- **Gaps:** 6px, 8px, 24px, 32px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #FFFFFF
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.15) 0px 0px 50px 0px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.2) 0px 0px 20px 0px
- **Blur:** 12px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 0px padding and a 0px radius. Drive the shell with linear-gradient(rgba(255, 255, 255, 0.03) 1px, rgba(0, 0, 0, 0) 1px) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 2px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 2px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Primary:** background #FFFFFF, text #000000, radius 9999px, padding 10px, border 0px solid rgb(229, 231, 235).
- **Links:** text #FFFFFF, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 6px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 2px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected expressive motion intensity without a deliberate reason.

## Motion

Motion feels expressive but remains focused on interface, text, and layout transitions. Timing clusters around 1000ms and 150ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on text and color changes.

**Motion Level:** expressive

**Durations:** 1000ms, 150ms, 200ms, 300ms, 8000ms, 12000ms

**Easings:** ease, cubic-bezier(0.4, 0, 1), 0.2, 0.6

**Hover Patterns:** text, color, opacity, transform
