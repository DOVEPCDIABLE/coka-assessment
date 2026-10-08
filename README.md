# Crystal Kizor

A responsive personal-brand landing page for the Stage 1 web developer assessment. Crystal’s initiatives are grouped into spaces and objects, ideas and learning, and people and possibility. Her writing and research sit within the personal brand.

## Preview

Open `http://localhost/coka/` through XAMPP, or run:

```sh
npm run dev
```

Then visit `http://localhost:5173`. Python 3 is required for this optional development server. The website itself only requires a static web server.

## Build

```sh
npm run check
npm run build
```

`dist/` contains the deployable website. No framework, npm packages, API keys or runtime server are required. The build script requires Node.js 18 or later.

## Files

- `index.html`: content, page structure and accessible navigation.
- `styles.css`: visual system, desktop/mobile layouts and reduced-motion styles.
- `app.js`: initiative filtering, mobile navigation, native project/initiative dialogs and message drafting.
- `motion.js`: section reveals, staggered transitions and an adapted ThreeUI topographic shader.
- `assets/`: optimised supplied imagery and local fonts.
- `SUBMISSION.txt`: design note, AI proposal, analytics response and source notes.

## Deployment

Publish the contents of `dist/` to a static host such as GitHub Pages, Netlify or your existing web server. Set the build command to `npm run build` and publish directory to `dist` where applicable. All asset paths are relative so the site also works in a subdirectory.

Source code: [DOVEPCDIABLE/coka-assessment](https://github.com/DOVEPCDIABLE/coka-assessment). Public website deployment is pending. Replace the pending live website link in `SUBMISSION.txt` after deployment. Do not publish the original supplied asset folders unless you intend to distribute them; the build includes only the optimised assets used by the website.

## Content and contact behaviour

The assessment brief is authoritative. Public research verified Studio COKA and Crystal’s LinkedIn destinations. Other initiatives have informative dialogs and a route to contact Crystal rather than guessed external links. Project renders are identified as design concepts. The initiative typography is a proposed treatment, not an official logo recreation. The first-person positioning copy should receive brand-owner review before becoming an official personal website.

Contact dialogs let a visitor draft and copy an introduction, then open Crystal’s LinkedIn profile. No form submission is simulated, no message is automatically sent, and no personal data or analytics are stored. Clipboard access requires a secure context; if unavailable, the message is selected for manual copying. A production enquiry form would need a real delivery service, spam controls, privacy notice and server-confirmed analytics events.

## Accessibility and performance

Semantic landmarks and heading hierarchy, a skip link, visible focus rings, announced filter results, Escape-to-close native modal dialogs with focus return, mobile navigation state and reduced-motion styles are included. Fonts are local; the hero image is prioritised; later images are lazy-loaded. Images are compressed WebP derivatives of the supplied originals.

Fonts: DM Sans and Italiana, distributed under the SIL Open Font License. License notices are included in `assets/`.

## Motion and ThreeUI attribution

The ecosystem background adapts the WebGL shader from ThreeUI Community’s **Topo Field**, distributed in `@designcodeio/threeui` version 1.2.0. [Upstream source](https://github.com/MengTo/threeui). Copyright (c) 2026 Meng To; the MIT notice is included in `assets/licenses/ThreeUI-MIT.txt`. The shader is adapted directly to this static site; no React or Three.js runtime is required. Changes include a transparent sage palette, bounded resolution, a 30 fps limit and suspension when outside the viewport or when the tab is hidden.

Hero introductions, one-time section/card reveals, filter transitions and dialog entrances use browser-native animations. Visitors can pause motion beside the ecosystem heading. Reduced-motion preferences disable animation and leave a static contour field. Content remains visible if JavaScript or WebGL is unavailable.
