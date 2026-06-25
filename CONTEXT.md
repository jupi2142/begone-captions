# Begone Captions

A Firefox extension that hides post text on X/Twitter video posts behind a 10-click gate, forcing deliberate effort to read.

## Language

**Post**:
A status/tweet on X that contains a video attachment.
_Avoid_: Tweet, status, video tweet

**Post Text**:
The written body content of a Post — the content that gets hidden.
_Avoid_: Caption, subtitles, description, body

**Timeline**:
Any X page with a stream of Posts — the home feed, a Post's detail page, search results, or a list.
_Avoid_: Feed, stream, page

**Reveal**:
The 10-click progressive disclosure action that makes hidden Post Text visible. Each click increments a counter; the text appears only on the 10th click.

**Click Counter**:
Per-Post state tracking how many clicks toward the 10-click Reveal threshold. Resets when another Post is Revealed or on page navigation.

**Gate**:
The state where a Post's text is hidden behind a button showing the Click Counter. A Post can be Gated (hidden) or Revealed (visible).
