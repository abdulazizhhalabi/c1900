# CLAUDE.md — Charter1900 (Astro Study Site)

## Project
Charter1900 (short form C1900) is a CFA Level I study site: static study materials per topic plus
interactive revision questions (multiple choice, A/B/C, with explanations).
Stack: Astro + React islands + Tailwind CSS, TypeScript strict.
Content lives in Astro content collections. This is a multi-file framework
project — NOT a single HTML file.

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend or UI
  code, every session, no exceptions.
- Skim the existing project structure (`src/`, `astro.config.*`,
  `tailwind.config.*`) before adding code, so new work matches conventions.

## Design Approach
- No reference image: design from scratch with high craft (see guardrails).
- If a reference image is ever provided: match layout, spacing, typography,
  and color exactly; use placeholder content (`https://placehold.co/`); do not
  improve or add to it.
- Screenshot your output, review it critically against the intended design,
  fix mismatches, re-screenshot. Do at least 2 review rounds per screen.
  Stop only when no visible issues remain or the user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the Astro dev server in the background: `npm run dev`
  (Astro serves at `http://localhost:4321` by default — confirm the port
  from the dev server output, as it may differ).
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Take screenshots from the running localhost dev server, not static files.
- Use the project's available browser/screenshot tooling (e.g. Playwright or
  Puppeteer). If no screenshot script exists yet, set one up once and reuse it;
  do not hardcode machine-specific absolute paths — resolve paths relative to
  the project root.
- Save screenshots to `./temporary-screenshots/` with auto-incremented names
  (never overwrite). Optionally append a label suffix for clarity.
- After screenshotting, read the PNG back and analyze it directly.
- When reviewing, be specific: "heading is 32px but should be ~24px",
  "card gap is 16px but should be 24px".
- Check: spacing/padding, font size/weight/line-height, colors (exact hex),
  alignment, border-radius, shadows, image sizing, responsive breakpoints.

## Styling & Output
- Use Tailwind via the Astro Tailwind integration (configured in the project),
  NOT the CDN script. Prefer component-scoped styles and Tailwind utilities.
- Build pages and UI as Astro components; use React islands ONLY where genuine
  interactivity is needed (the quiz engine, progress tracking).
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`.
- Mobile-first responsive.

## Brand Assets
- Check the `brand_assets/` folder before designing. It may contain logos,
  color guides, style guides, or images.
- If assets exist there, use them — do not use placeholders where real assets
  are available. If a palette is defined, use those exact values; do not invent
  brand colors. If a logo is present, use it.

## Anti-Generic Guardrails
- **Colors:** Never use the default Tailwind palette (indigo-500, blue-600,
  etc.). Pick a custom brand color and derive a scale from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows
  with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a
  display/serif with a clean sans. Tight tracking (`-0.03em`) on large
  headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via an SVG
  noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never
  `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible,
  and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a
  color treatment layer with `mix-blend-multiply` where appropriate.
- **Spacing:** Use intentional, consistent spacing tokens — not random
  Tailwind steps.
- **Depth:** Surfaces should follow a layering system (base → elevated →
  floating), not all sit at the same z-plane.

## Hard Rules
- This is an Astro project — do not collapse it into a single HTML file or
  load Tailwind via CDN.
- Do not use `transition-all`.
- Do not use default Tailwind blue/indigo as the primary color.
- Do not "improve" or add scope beyond what the current task asks for.
- Do not stop after a single screenshot pass.
- Do not hardcode machine-specific absolute file paths.
