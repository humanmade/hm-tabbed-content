# HM Tabbed Content

A tabbed content block for WordPress where each tab reveals an associated image or video alongside its content.

## Blocks

- **humanmade/tabbed-content** — Parent container. Lays out a heading/description column on the left and a media preview column on the right.
- **humanmade/tabbed-content-item** — Child tab. Each item has a title, an associated image or video, and inner content (paragraphs, buttons, lists). Clicking the title reveals the item's content and switches the media preview.

## Development

```bash
npm install
npm run start   # watch mode
npm run build   # production build
```

Block source lives in `src/blocks/`. The wp-scripts build outputs to `build/blocks/`, which is what PHP registers.

## Requires

- WordPress 6.7+
- PHP 8.0+
