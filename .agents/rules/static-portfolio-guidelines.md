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

## 4. Single-File Theme Architecture & Anti-FOUC
- **Single Canonical Document**: Never duplicate HTML files for alternate themes (e.g. avoid `index.html` + `light.html`). Keep a single source of truth and toggle themes dynamically in-place.
- **Anti-FOUC Synchronous Head Initializer**: Place a blocking 3-line inline script at the top of `<head>` before stylesheets or body render to check `localStorage` and OS `prefers-color-scheme`, eliminating split-second theme flashing:
  ```html
  <script>
    (function() {
      try {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'light' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)) {
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      } catch (e) {}
    })();
  </script>
  ```
- **Scoped CSS Custom Properties**: Scope base theme variables under `:root` (dark default) and light overrides under `[data-theme="light"]`.
- **Dual-Icon Minimalist Toggle**:
  - Display both Sun ☀️ and Moon 🌙 icons simultaneously inside a pill track without text labels.
  - Implement fluid spring physics (`cubic-bezier(0.34, 1.56, 0.64, 1)`), elastic thumb morphing (`scale(1.25, 0.85)`), and active icon spin animation on click.

## 5. Clean Project Structure
- Organize static projects into clean, dedicated directories:
  ```text
  portfolio/
  ├── index.html
  ├── css/ (style.css, light.css)
  ├── js/ (script.js)
  ├── assets/ (images, icons, docs)
  └── README.md
  ```

