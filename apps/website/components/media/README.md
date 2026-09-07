# components/media

Everything that renders an image, video or icon. `SiteImage` is the only
component in the site allowed to call `next/image` directly -- every other
component goes through it so alt text, blur placeholders and focal crops stay
consistent.

See ../../docs/IMAGES.md.
