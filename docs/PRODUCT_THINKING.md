# Fomi — Continuity / Product thinking

**Category: Video Generation Workspace.** This is a frontend assessment with original motion fixtures, not an AI generation service. No user research or production validation was conducted.

## Problem and user

Generating a clip is easier than maintaining a creative intention across a film. A returning professional creative director needs to remember what each shot contributes, compare alternatives, and recover why a version was chosen. The starting point is an existing fragrance campaign, because resuming work exposes those relationships better than an empty prompt box.

## Three most important UX decisions

1. **A shared direction with explicit exceptions.** Creative DNA establishes five project rules. Blank per-shot overrides inherit them; entered overrides replace only that rule. Effective direction exposes the actual merged request. Every take retains its submitted snapshot and shows “Earlier DNA” when the project DNA differs. This is transparent provenance, not a promise about model consistency.
2. **Previewing and choosing are separate actions.** Clicking a take changes the stage; “Choose this take” changes the sequence. New generations append alternatives without displacing an editorial decision. Comparison exposes saved requests and a short shot-level decision note preserves the reasoning. The trade-off is an extra intentional click before committing a take.
3. **The sequence remains in view.** The storyboard and sequence use the same shot order. Keyboard move buttons avoid requiring drag precision. The large stage receives the most space, while overrides and technical details are disclosed on demand. On phones the storyboard becomes a compact collapsible strip and direction moves below the stage; the desktop arrangement is not squeezed into miniature columns.

## Deliberate omissions

No auth, payments, real models, cloud collaboration, database or renderer: none helps assess the central decision workflow. No timeline trimming, transitions or audio: consecutive clip review tests the story without implying a video editor. No package import or undo: both need stronger schema migration/history UX than the assessment warrants. Destructive actions instead require confirmation. Four original reusable fixture studies keep the project small, self-contained and legally clear; they sacrifice photographic realism and truly varied results.

## Inspiration and critique

Premiere Pro and DaVinci Resolve informed the distinction between reviewing source material and committing a sequence. Their strength is keeping editorial context close to media; the opportunity here is exposing the creative rationale without requiring a full editing timeline. Figma's shared styles inspired project defaults with local exceptions; this implementation adds a visible effective request and historical snapshot because generation outputs cannot be updated like live component instances. These are conceptual influences, not copied interface layouts or claims of feature parity. A charcoal/olive editorial composition, shot-based navigation and explicit decision notes give Continuity its own emphasis.

## Another month

First, observe creative directors resuming real multi-shot work and test whether DNA fields and notes reduce reconstruction effort. Then add take-specific decision history, package import with migration, robust IndexedDB storage with conflict handling, and usable undo. Test screen readers and touch devices with actual users. If real model integration were later authorized, measure controllability empirically; never infer consistency from the existence of a shared prompt. Better original footage and proxy management would improve review realism before adding configuration complexity.

## The differentiating workflow

**Brief → shared Creative DNA → inherited/overridden shot request → frozen take provenance → deliberate selection with a reason → ordered review → portable project package.** The workspace preserves how a sequence was decided, not just the clips it contains. Its effect is inspectable in submitted and exported metadata today.
