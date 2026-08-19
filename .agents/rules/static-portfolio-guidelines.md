# Static Portfolio & Serverless Web Guidelines

## 1. Serverless Contact Forms (Web3Forms / Formspree)
- **Asynchronous Dispatch**: Use `fetch()` with JSON payload for static sites (GitHub Pages, Vercel, Netlify) to avoid full-page reloads or third-party redirect screens.
- **Anti-Spam**: Include an invisible honeypot field (`<input type="checkbox" name="botcheck" class="hidden" style="display:none;">`) to catch automated bots without annoying human visitors with CAPTCHAs.
- **Client-Side Validation**: Validate field lengths (e.g. name >= 2 chars, message >= 8 chars) and email regex before submission; display inline errors that clear dynamically on user input.
- **Dynamic UX States**:
  - **In-flight**: Disable the submit button and display an animated SVG spinner (`@keyframes spin`).
  - **Success**: Display a glowing emerald status banner and reset form inputs.
  - **Error / Fallback**: Provide an informative error banner with a one-click `mailto:` fallback link containing prefilled subject and message.

## 2. Cohesive Monogram & Favicon Branding
- When creating or updating a website logo or monogram, synchronously generate and link a matching vector `favicon.svg` in `<head>` alongside the header navigation badge:
  ```html
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="alternate icon" href="favicon.svg">
  ```
- Use scalable vector SVG paths with high-contrast gradient strokes (`#38bdf8` cyan to `#10b981` emerald) so the monogram remains sharp and vibrant on both dark and light browser tabs.

## 3. Semantic Iconography
- Align tech stack pills and badges with standard semantic vector iconography (e.g., multi-tier layered stack icon for "Full Stack", neural graph for "LLM Agents", aperture/crosshair for "Computer Vision", database cylinders for data stores).
