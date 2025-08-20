# Changelog

All notable changes to this project are documented in this file.
This project follows a lightweight, date-based changelog for local development.

## [Unreleased] - 2025-08-20

### Added
- Distinct dynamic backgrounds with motion gating and fallbacks:
  - Vaporwave/Outrun: perspective neon grid, rising horizon sun bands, aurora drift, shooting stars, diagonal glare sweep, VHS scanlines; static fallback in Lite/Reduced Motion.
  - Cyberdeck HUD: volumetric fog, scanner rings, HUD lines, subtle code rain, diagonal scan sweep, readability veil.
- CRT overlay for Cyberdeck: scanlines, phosphor triads, gentle flicker, curvature/vignette illusion.
- Full-screen AI Takeover overlay (fear mode) with terminal banner, glitch bars, breach progress, and a single “Enable Firewall” CTA; honors Reduced Motion.
- Backgrounds toggle and theme toggle wired into the mobile drawer; accent palette moved there too.
- Gyroscope tilt for InteractiveCard on mobile (coarse pointer) with iOS permission flow, throttled DeviceOrientation, and cleanup.

### Changed
- Projects section cards restyled to use the glass variant (away from “dark”), maintaining the Glow overlay.
- Top bar/hamburger rethemed to match both themes; sweeping title underline animation gated by motion/lite.
- Normalized z-index stacks; root container made transparent; only a single background renders at a time.
- Mobile ergonomics pass: viewport-fit=cover, dvh/svh sizing, softened scroll snap, overscroll containment, iOS momentum scrolling, safe-area paddings, scrollable mobile drawer.
- Terminal-style breach banner moved to a global high-z overlay above the top bar.

### Fixed
- JSX structural issues from initial mobile gyroscope insertion; repaired component return/handlers and ensured provider wrappers close correctly.
- Hidden/stacked overlay issues: ensured AI takeover overlay and banner appear above UI; scroll is locked while active and restored on exit.
- Vaporwave perspective looked vertical; rebuilt using an SVG vanishing-point grid with animated rows.

### Notes
- Motion-heavy effects auto-disable in Lite Mode and when the user prefers reduced motion.
- Consider extracting large components (backgrounds, overlays, InteractiveCard) into separate files for maintenance.

## [Unreleased] - 2025-08-16

### Added
- Lite Mode toggle (persisted to `localStorage`) to disable heavy animations and particles for better performance on mobile / low-power devices.
- `LazyMount` pattern to lazily mount heavy sections when they enter the viewport (reduces initial render cost).
- `SectionBlock` wrapper (changed to a `div` wrapper to avoid nested section id collisions).
- Back-to-top button appears when leaving the `hero` section.

### Changed
- Accent handling:
  - Centralized `ACCENTS` array and wired auto-accent observer to use these values.
  - `--accent-soft` is now derived from the active accent for consistent visuals.
  - IntersectionObserver now watches direct children of `<main>` and sets accents by section id.
- Rounding and design tokenization:
  - Introduced CSS variable `--radius` in `src/index.css` and replaced hard-coded `rounded-*` usages with variable-based rounding (`rounded-[var(--radius)]` and scaled `calc()` forms).
- Performance & mobile:
  - Hides `FloatingParticles` on touch devices / reduced-motion / lite mode.
  - Interactive 3D cards (spring transforms) respect `prefers-reduced-motion`, touch detection, and `liteMode`.
  - Reduced heavy blur/shadow on mobile and limited hover shadows to hover-capable pointers via CSS media queries.
- UI polish:
  - New `.btn-primary`, improved input focus styles, `.top-bar`, `.dock`, and `.back-to-top` styles in `src/index.css`.
  - Microsoft Office tools (Word, Excel, PowerPoint, OneNote) added to Tools & Design tags.
  - Applied reusable Glow overlay to more cards/sections (Skills categories, Certifications, Education, About, Contact, Leadership). Wrapped affected `Glass` cards with `group` and added `relative overflow-hidden` for proper effect.

### Fixed
- Resolved the blank-screen/syntax issues in `src/PortfolioApp.jsx` by repairing malformed JSX and adding missing wrapper components.
- Fixed accent auto-carousel bug by:
  - Making the observer target top-level section wrappers (`main > [id]`).
  - Deriving section→accent mapping from the `ACCENTS` array so no color is omitted.
  - Added runtime diagnostics (`console.debug`) to help trace accent selection during development.
- Fixed hover-shadow behavior being applied on touch devices (moved hover shadow to `@media (hover: hover) and (pointer: fine)`).

### Removed
- Removed nested section observation to prevent accidental id collisions (see observer selector change above).

### Files changed (key)
- `src/PortfolioApp.jsx` — main app file; added LiteContext, LazyMount, SectionBlock, observer logging, accent mapping changes, UI tweaks and many component updates.
- `src/index.css` — added design tokens (`--radius`, `--glass-contrast`, etc.), mobile optimizations, new utilities (`.btn-primary`, `.back-to-top`), and hover-media query rules.
- `README.md` — (unchanged) used as source for feature list.

### How to test
1. Install and run dev server:
```powershell
npm install
npm run dev
```
2. Open the local dev URL (Vite will pick a port, commonly `http://localhost:3001/`).
3. Enable Auto Accent mode:
   - Click the "A" button in the AccentPicker (top-right) or remove `accentLocked` from localStorage.
4. Scroll through the sections (Hero → About → Projects → Skills → Credentials → Leadership → Education → Contact).
   - Watch browser console for `[AccentObserver] section= <id> accent= <hex>` messages (diagnostic logs) and confirm the site accent changes.
5. Toggle Lite Mode in the top bar and confirm particles and heavy motion are suppressed.
6. Inspect mobile behavior or use responsive emulator to confirm blur/shadow reductions and tappable hit targets.
7. Hover or focus the updated cards (e.g., Skills categories, Education, About) and verify the subtle accent glow appears without layout shift.

### Notes & Next steps
- Tailwind purge: If you build for production and notice styles like `rounded-[var(--radius)]` missing, add them to `safelist` in `tailwind.config.js`.
- Remove or disable the `console.debug` diagnostic logs before shipping to production.
- Consider splitting `src/PortfolioApp.jsx` into smaller component files for maintainability.
- Optional: add icons for Office tags and more granular toggles in a settings panel (particles vs. card transforms).

