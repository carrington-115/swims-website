# Figma → code workflow

Designs are built in Figma and translated by hand (with MCP assistance) into
components that follow [COMPONENTS.md](./COMPONENTS.md). The MCP server is a
source of *design data* — measurements, variables, exported assets — not a code
generator whose output ships as-is.

## Connecting the server

The repo ships `.mcp.json` at the root pointing at Figma's **local** Dev Mode
server:

```json
{ "mcpServers": { "figma": { "type": "http", "url": "http://127.0.0.1:3845/mcp" } } }
```

1. Open the Figma **desktop** app (the browser version does not expose the
   server) on a Dev or Full seat.
2. Figma menu → **Preferences → Enable local MCP server**. It confirms the
   server is running on `127.0.0.1:3845`.
3. Start Claude Code from the repo root and approve the project MCP server when
   prompted. Check with `/mcp` — `figma` should be listed as connected.
4. Select a frame in Figma, or copy its link (**right-click → Copy link to
   selection**) and paste it into the prompt.

Prefer the remote server (`https://mcp.figma.com/mcp`, OAuth, no desktop app)?
Swap the `url` in `.mcp.json`; the workflow below is unchanged.

## Working a frame into components

1. **Pull the design data.** Ask for the selected frame's code and variables.
   Read the variable definitions first — they tell you which token each colour,
   radius and spacing value maps to.
2. **Reconcile tokens.** Every Figma variable must resolve to a token in
   `app/globals.css`. If a design introduces a genuinely new value, add it to
   `@theme` with a name matching the Figma variable, then use it. Never inline
   the hex the MCP output returns.
3. **Decompose before writing.** Identify which parts are `ui` primitives,
   which are a page section, and which already exist. Reuse beats regenerate —
   a "Button/Primary" node becomes `<Button variant="primary">`, not a new
   styled `<div>`.
4. **Rewrite the generated markup.** MCP output is absolutely positioned,
   pixel-pinned and single-breakpoint. Convert it to flex/grid, mobile-first,
   with the token utilities. Discard the generated class names.
5. **Assets.** Images exported from Figma go to
   `assets/figma-images/<page>/`, then into `assets/images.ts` with alt text —
   see [IMAGES.md](./IMAGES.md). Never reference a `localhost:3845` asset URL
   from committed code; those URLs die with the session.
6. **Check the frame's responsive variants.** If the design only has a desktop
   frame, ask for the mobile behaviour rather than inventing it; record the
   decision in the section's file if you must assume.
7. **Verify against the definition of done** in COMPONENTS.md.

## Prompts that work well

- "Get the code for the selected frame, then list which of our tokens each
  colour maps to before writing anything."
- "Get the variable definitions for this frame and tell me which ones are
  missing from `app/globals.css`."
- "Rebuild this frame as a section in `components/sections/`, reusing `Button`,
  `Container` and `Section`."

## What not to do

- Do not paste MCP-generated code into `app/` untouched.
- Do not create a new component for a node that maps to an existing primitive.
- Do not let Figma's absolute layout survive into the codebase.
- Do not hardcode a colour because "it is what Figma said" — add the token.
