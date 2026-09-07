/**
 * The People route and the profile sheet that overlays it.
 *
 * `modal` is a parallel slot filled by `@modal/(.)[slug]`, which intercepts
 * `/people/<slug>` on a client-side navigation and renders it as a popup over
 * this page. On a hard load of that URL the intercept does not apply: the slot
 * falls back to `@modal/default.tsx` (nothing) and `children` renders the
 * standalone profile page instead.
 */
export default function PeopleLayout({ children, modal }: LayoutProps<"/people">) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
