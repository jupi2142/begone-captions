# AGENTS.md — begone-captions

A raw Firefox extension (Manifest V3) that hides post text on X/Twitter video posts behind a 10-click gate.

## File structure

```
manifest.json    # Firefox MV3, content script runs on *://x.com/* and *://twitter.com/*
content.js       # IIFE, no build step, no deps
CONTEXT.md       # Domain glossary from domain-modeling skill
icon.svg         # Browser action icon
```

No test runner, formatter, linter, or build tooling.

## How it works

- `content.js` injects via Manifest content_scripts (no `web_accessible_resources` needed)
- MutationObserver on `document.body` watches for `<article>` elements
- Posts with `<video>` + `[data-testid="tweetText"]` get their text hidden (opacity/height/overflow) and a blue button inserted
- 10 clicks to reveal per post; reset on revealing another post or page nav
- `WeakMap<article, state>` for per-post state; single `activePost` tracker

## Key constraints

- No frameworks, no bundler, no npm — this is a hand-rolled raw extension
- Do NOT add build tooling unless user asks
- DOM selectors (`data-testid="tweetText"`, `video`, `article`) are X-specific and fragile — X changes these without notice
- Firefox-only (uses `browser_specific_settings.gecko` in manifest)
- No storage, no background script, no permissions beyond host matching
