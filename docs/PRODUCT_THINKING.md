# Fomi — Continuity / Product thinking

**Part B category: Video Generation Workspace.** An interactive frontend assessment with a real mock route handler and prepared cinematic fixtures. No interviews, usability study or measured product outcomes are claimed.

## What problem were you solving?

Generating an individual clip is only one part of making a film. A director returning to a campaign must recover its intention, understand how shots relate, compare alternatives and remember why one version was chosen. Continuity keeps that reasoning attached to the sequence instead of leaving it scattered across prompts and downloads.

## Who is the user?

A professional creative director working on a short fragrance campaign over several sessions. They already have a brief, planned shots and usable takes. The seeded AFTER HOURS campaign opens in that realistic state; it does not start with an empty dashboard.

## Three most important UX decisions

1. **A visible creative thread, with explicit exceptions.** The visual Creative DNA board combines a campaign mood reference, a palette and five editable rules. Shots inherit defaults and references; explicit overrides replace individual fields or reference selections. Effective direction shows the exact request. Each take retains its original prompt/rules/references, while a readable Previous/Current comparison identifies changed direction. This makes provenance inspectable without claiming the interface guarantees model consistency.

2. **Separate exploration from commitment, then preserve the reason.** Previewing changes the stage; choosing changes the sequence. Generation appends alternatives without displacing a selected take. Comparison offers shared playback starts, settings differences and take-specific notes. Choosing a version brings its note into the sequence. History preserves alternatives and recent events. The extra commitment step is intentional protection against accidental editorial changes.

3. **Keep the film in view while adapting the working surface.** Desktop has one storyboard, a large stage, contextual Direction/References/History inspector and a docked sequence. Advanced settings are disclosed on demand. Mobile uses Preview/Direction/Sequence modes with a shot-picker sheet, rather than squeezing three desktop columns onto a phone. Project tools keeps import, undo/redo, brief and continuity review reachable at every width. Metadata checks navigate directly to missing selections, changed direction or differing requested formats. They support human judgment rather than inventing an AI consistency score.

## Which features did you leave out, and why?

No authentication, payments, cloud database, collaboration server or real model API: these add infrastructure rather than clarify the assessment workflow. No trimming, audio mixing, rendered MP4 or full editing timeline: sequential clip review is sufficient to assess story assembly without pretending to be an NLE. Prepared still-based camera studies keep the demo local and small but sacrifice actual subject motion and varied model output. Undo is bounded session history, not a permanent revision system. Export/import provides portability without claiming cloud sync.

## Which products inspired the thinking? What would you improve?

Google Flow's references, saved frames and scene assembly informed the connection between inputs and output. Krea's output comparison and integrated editing informed the immediate transition from generation to review. Runway's distinction between temporary and saved references reinforced the need to state persistence and scope. CapCut's documented export gating and public failure reports motivated early export clarity; Flow failure reports motivated actionable state feedback. These are desk-research signals, not proof that every user has the same issue or that a competitor lacks similar solutions.

Premiere Pro and DaVinci Resolve inspired deliberate source review versus sequence commitment. Figma's shared styles informed defaults with explicit local exceptions. Meta Edits informed phone-specific interaction rather than a miniature desktop. MiniMax/Hailuo, Kling and Firefly reinforced the value of reference roles and readable camera/frame controls. Kimi is an adjacent planning reference rather than a directly equivalent video editor.

What I would improve across the workflow is the visibility of the actual submitted request, a selected take's rationale, reference lifetime and export consequences. The implemented response is explicit snapshots, take-specific notes, local-storage disclosure, request differences and a JSON-package export that says what it contains. It is not a claim to outperform those products. Sources and evidence distinctions are in `COMPETITOR_UX_REVIEW.md`.

## What would you improve with another month?

Observe directors resuming genuine projects and test whether they can recover intention and decisions without help. Measure task completion and errors before claiming an improvement. Test screen readers, touch devices, zoom and real Safari/iOS. Move reference/media storage to IndexedDB with migration, quota management and cross-tab conflict handling. Develop more robust revision history and recoverable deletion across sessions, then improve the realism and variety of the prepared campaign media. Real inference, if separately authorized, would require empirical controllability tests and honest per-model capability handling.

## What single workflow differentiates it?

**Brief → visual DNA and references → explicit shot request → frozen take provenance → comparison → selection with a reason → continuity review → portable, restorable project package.** The interface preserves the relationship between an intention and an editorial decision, not only a list of clips.
