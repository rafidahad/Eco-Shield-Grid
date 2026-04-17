# Design System: Tactical Precision & The Monolith

## 1. Overview & Creative North Star
**The Creative North Star: "The Brutalist Observatory"**

This design system moves away from the friendly, rounded "SaaS-standard" and embraces the uncompromising authority of a mission-critical command center. The aesthetic is inspired by high-end tactical equipment and brutalist architecture: heavy, monolithic, and precise. 

We break the "template" look through **Extreme Hardness**. By utilizing a `0px` radius scale, we communicate stability and professional-grade reliability. The layout follows a high-density "information-first" philosophy, where the beauty is found in the organization of complex data rather than decorative flourishes. This is not a dashboard; it is a specialized tool for environmental defense.

## 2. Colors: The Zinc & Slate Spectrum
The palette is built on a foundation of Zinc and Slate, utilizing deep, desaturated tones to reduce eye strain during long-term monitoring while maintaining high-contrast "hotspots" for critical alerts.

- **Primary (`#c6c6c7`):** This is our "Active State" color. It mimics the sheen of brushed aluminum. Use it for critical interactive elements and primary indicators.
- **Secondary (`#909fb4`):** A cool, slate-tinted neutral used for secondary data streams and non-critical navigation.
- **Tertiary (`#c5ffc9`):** The "Eco" signal. This vibrant green is reserved exclusively for "System Healthy" states or successful ecological shield activations.

### The Rules of Surface & Interaction
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Structural definition must be achieved through background shifts. Place a `surface-container-high` (`#1f1f24`) module directly onto the `background` (`#0e0e10`). The eye will perceive the boundary through the tonal shift.
*   **Surface Hierarchy & Nesting:** Treat the UI as a series of recessed or extruded metal plates. 
    *   **Level 0 (Base):** `surface`
    *   **Level 1 (Modules):** `surface-container-low`
    *   **Level 2 (In-module widgets):** `surface-container-high`
*   **The "Glass & Gradient" Rule:** To avoid a "flat" appearance, use a subtle linear gradient on primary CTAs: `primary` (`#c6c6c7`) to `primary-container` (`#454748`) at a 145-degree angle. This creates a tactile, metallic feel.

## 3. Typography: Tactical Clarity
We use a dual-font strategy to balance industrial character with high-speed legibility.

*   **Display & Headlines (Space Grotesk):** A font with a "tech-brutalist" skeleton. Its idiosyncratic terminals feel like precision-cut parts. Use `display-lg` for macro-metrics (e.g., total energy yield) and `headline-sm` for section headers.
*   **Body & Labels (Inter):** The workhorse. Inter is used for all high-density data tables, status logs, and technical readouts. Its neutrality allows the data to be the focus.
*   **Visual Hierarchy:** Use `label-sm` in `all-caps` with 0.05em tracking for metadata or "System ID" tags. This mimics military hardware labels.

## 4. Elevation & Depth: Tonal Layering
In a command center, traditional "soft" shadows are too whimsical. Depth must be architectural.

*   **The Layering Principle:** Rather than shadows, use "recessed" layering. A `surface-container-lowest` (`#000000`) area should be used for data feeds that require "infinite depth," making the text appear as if it is projected from beneath a glass panel.
*   **Ambient Shadows:** If an element must float (e.g., a critical override modal), use a long, sharp shadow using a 10% opacity version of `on-surface`. Avoid blur; think "offset" to maintain the brutalist edge.
*   **The "Ghost Border" Fallback:** For high-density data grids where tonal shifts aren't enough, use `outline-variant` at 15% opacity. This creates a "hairline" guide that is felt rather than seen.
*   **Glassmorphism:** Use `surface-bright` (`#2b2c32`) at 60% opacity with a `20px` backdrop blur for floating HUD elements. This allows the high-density grid to remain visible beneath the active overlay.

## 5. Components: Precision Modules

### Buttons (The "Key-Cap" Aesthetic)
*   **Primary:** Rectangular, `0px` radius. Background: `primary`. Text: `on-primary`. Hover state: Subtle `surface-tint` overlay.
*   **Tertiary (Ghost):** No background. `label-md` text in `primary`. Interaction is signaled by a subtle `outline-variant` appearing on hover.

### Data Chips
*   **Status Chips:** High-density, no padding on the horizontal axis when used in tables. Use `tertiary-container` for "Active" and `error-container` for "Breach."

### Input Fields (Tactical Entry)
*   **Text Inputs:** No bottom border. Instead, use a solid `surface-container-highest` background. When focused, the left-hand edge gains a 2px `primary` accent bar. 

### Cards & Lists (The Grid System)
*   **Rule:** Forbid divider lines. Use `surface-container-low` for the card body and `surface-container-high` for the header of the card. This creates a "tabbed" appearance that feels integrated into the command console.

### Specialized Components
*   **The "Status Bar":** A persistent 4px strip at the very top of the screen using the `tertiary` color to indicate "Global Shield Integrity."
*   **High-Density Data Grid:** Table rows should alternate between `surface` and `surface-container-low`. No cell borders.

## 6. Do’s and Don’ts

### Do:
*   **DO** use monochromatic icons. Only use color (Red/Green) for state changes.
*   **DO** embrace high information density. Junior designers often fear "clutter," but in a Command Center, "clutter" is "context."
*   **DO** use monospace-style alignment for numbers (Inter naturally handles tabular lining).

### Don't:
*   **DON'T** use rounded corners. Even a 2px radius breaks the industrial "Shield" metaphor.
*   **DON'T** use vibrant blue for "information." Use the Slate (`secondary`) palette to ensure the eye isn't distracted by non-critical elements.
*   **DON'T** use standard "Drop Shadows." They feel too much like a consumer mobile app. Use tonal shifts to define depth.