# Begone Captions

A raw Firefox extension (Manifest V3) that hides post text on X/Twitter video posts behind a 10-click gate.

## How it works

- Visits `x.com` or `twitter.com` → detects posts with video content
- Hides the post text (opacity/height/overflow) and inserts a blue `(0/10) Reveal text` button
- Each click increments the counter — on the 10th click, the text is revealed
- Only one post can be revealed at a time — revealing another resets the first
- No persistence — refreshing or leaving the page resets everything

## Install (temporary)

1. Open `about:debugging#/runtime/this-firefox` in Firefox
2. Click **Load Temporary Add-on**
3. Select `manifest.json`

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Firefox MV3 manifest, content script on `x.com` + `twitter.com` |
| `content.js` | MutationObserver + 10-click gate logic, no dependencies |
| `icon.svg` | Browser action icon |
| `AGENTS.md` | Instructions for AI coding agents |
| `CONTEXT.md` | Domain glossary |

## Caveats

- DOM selectors (`[data-testid="tweetText"]`, `video`, `article`) are X-specific and may break if X updates their markup
- Firefox-only — Chrome would need a different `manifest.json`
- No build step, no npm, no frameworks
