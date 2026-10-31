# Assessment checklist — redesigned Continuity

Verified 31 October 2026, Asia/Karachi. Assessment project: `fomi-continuity`. Existing AI Video Studio source remains untouched.

## Scope

The supplied brief selects **Video Generation Workspace** and explicitly requests a frontend demonstration with a real local mocked API, deterministic fixture footage and no model/API-key/GPU dependency. Supporting reference images are not a standalone image generator. This interpretation has not been checked against a separate employer PDF or URL; see `ASSESSMENT_SCOPE.md`.

## Assessment mapping

| Area                      | Implementation                                                                                                                                                                | Limit / trade-off                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Product thinking          | Returning director, realistic four-shot campaign, visible intention-to-decision workflow                                                                                      | Desk research and design hypotheses, not a user study                                      |
| Frontend engineering      | Next.js App Router, JavaScript, validated POST, cancellable independent jobs, storage recovery, undo/redo, JSON import/export                                                 | Client simulation, no real model or server queue                                           |
| Architecture              | Separate request/editor transformations, persistence/generation hooks, storyboard, inspector, references, custom media controls, comparison, sequence, take strip and dialogs | Global CSS; no additional state framework                                                  |
| UX / interaction          | Exact inherited direction, references by role, frame capture, frozen requests, Previous/Current changes, take-specific notes, continuity navigation                           | Metadata checks do not analyze footage                                                     |
| Visual polish             | Original cinematic stills, eight camera studies, restrained charcoal/olive palette, stage-led desktop, docked sequence, phone work modes                                      | Camera movement is prepared canvas pan/scale, not real subject animation                   |
| Originality               | Explicit relationship between brief, shared rules, submitted take provenance, choice and reason                                                                               | Informed by established patterns; not a claim of feature uniqueness across all competitors |
| Product-thinking document | Specific implemented decisions, omissions, source influences, critique, next month and differentiator                                                                         | No invented validation results                                                             |
| Deliverables              | Runnable source, lockfile, README, scope/research/media notes, screenshots, PDF and source ZIP                                                                                | Live Vercel/GitHub links await intended accounts                                           |

## Automated verification

### State / transformation tests

`npm test`: **14 / 14 pass**.

- Reference inheritance, explicit none and independent snapshots.
- Historical direction differences without rewriting old takes.
- Metadata review for selections, formats, direction changes and decisions.
- Undo retains newly completed takes and restores editorial choices.
- Import produces independent project/shot/take identities and rejects unsafe media.
- Malformed reference selections, note data, storage JSON and unsupported schemas recover safely.
- An unfinished queued event is marked interrupted once on reopening.
- Duplicated shot/take identities are independent.
- Shot ordering drives sequence/export ordering.
- Prompt, ratio, timing and direction validation.
- Current brief, settings and decision notes are present in export.

### Main Chrome workflow

`node scripts/verify-browser.js`: **passes against the production server** using an isolated disposable Chrome profile.

- Seeded four-shot project, reference library, playable local fixture and initially visible sequence dock.
- Prompt, Creative DNA, camera override and explicit reference selections survive reload.
- Previous/Current DNA differences explain earlier takes.
- Add, rename, duplicate, move, delete, undo and redo shot changes.
- Invalid generation fails validation; queued/generating/completed states occur.
- Submitted references/overrides are recorded, and results remain attached to the original shot while another shot is reviewed.
- New results do not replace a chosen take.
- Cancellation, deliberate failure and successful retry.
- Both comparison clips play; pause, take-specific note and sequence choice work.
- Frame capture and local reference upload persist.
- Dialog Tab wrapping, Escape and opener focus restoration.
- Sequential playback advances to the next selected shot.
- Continuity review links to the unresolved shot.
- Downloaded JSON includes current shots, references, notes and choices.
- Invalid import is safe; valid import creates a separate project with independent identities.
- Route returns 400 for malformed JSON and 422 for invalid fields.
- **No uncaught page errors or unexpected console errors in the final run.** The intentional 422 validation response is excluded from console-error assertions.

### Responsive / recovery Chrome checks

`node scripts/verify-edge-cases.js`: **passes against the production server**.

- No document-level horizontal overflow at **360, 390, 430, 768, 1024, 1280, 1440 and 1920 px**.
- Mobile shot-picker keyboard selection, work-mode navigation, brief, generation, references and explicit camera override.
- Reviewing a different shot while generation runs preserves destination and submitted settings.
- Reload retains selected shot and cancels unfinished generation without adding takes.
- Mobile project tools expose undo/redo, create, rename, switch and reset confirmation.
- Undo after completion restores duration while retaining newly finished alternatives.
- Confirmed reset restores the seed and clears job state.
- Invalid local data recovers with a notice.
- Save failure remains visible on mobile.
- No uncaught errors in the edge-case run.

### Build and running server

`npm run build`: **passes**. Routes: `/`, `/icon.svg`, `/api/generate` and standard not-found page. Production server verified locally at **http://localhost:3101**. Next.js 16.4.3; JavaScript source only. Earlier dependency installation reported zero npm advisories; no new dependencies were added for the redesign. This is not a security audit or performance score.

## Visual QA

Actual browser screenshots were opened and inspected. The main stage uses original cinematic imagery; one storyboard and a contextual inspector replace the redundant outer rail. The sequence is docked within the desktop viewport. Mobile has focused Preview / Direction / Sequence surfaces and a shot-picker sheet. Status notices occupy layout space instead of covering controls. Reference content can scroll clear of the generation footer.

Screenshots are in `docs/screenshots/`: `studio-desktop`, `studio-comparison`, `studio-direction-diff`, `studio-references`, mobile views and all target widths. The refreshed submission PDF includes current verified screenshots. Its rendered pages are visually inspected before delivery.

The native browser integration was unavailable/timed out in the earlier session. Verification uses isolated Playwright Chrome and actual captured screenshots; no personal Chrome profile or existing app tab is modified.

## Known limitations / unverified checks

- Prepared AI-created stills and canvas camera studies repeat. Settings/references affect stored requests, not fixture pixels. Actual clips remain landscape and approximately five seconds.
- Reference thumbnails and request snapshots consume localStorage. Quota failure is surfaced. No IndexedDB, cloud backup or cross-tab merge; last writer wins. Crash can lose edits inside the 500 ms debounce window.
- Undo is bounded in-memory session history, not persistent revision history. Creation/import/reset are outside undo. Completed takes are retained when restoring editorial snapshots.
- Imported media is allowlisted to bundled fixtures; arbitrary external videos are not supported. Historical reference identities remain source-request provenance.
- Shared comparison starts are approximate browser playback. Sequence has no frame-accurate cuts, seamlessness, audio mix, trimming or MP4 rendering. JSON contains fixture paths rather than embedded videos; individual clip downloads are available.
- Keyboard workflows and focus are tested, but there is no screen-reader user study or full assistive-technology/WCAG audit.
- No real Safari/iOS/Firefox, physical touch devices, OS text scaling, high-contrast mode or measured slow-device performance testing. Media errors have a fallback. No Lighthouse score is claimed.
- No GitHub remote or Vercel deployment is configured. Publish to the intended accounts, verify the deployed URL, update `submission-links.json` and regenerate the PDF. Draft links remain explicitly pending.

## Supplied-media and unified-layout update
- Ivory editorial storyboard and Creative DNA ribbon frame the dark director preview. Storyboard expands to a contact sheet; Director restores the inspector; Sequence opens consecutive review.
- Both supplied portrait MP4s play locally, with extracted posters, visible provenance and actual duration/ratio metadata. Full files are played without silent trimming or cropping. Their differing products are not presented as model consistency.
- Existing project edits and choices survive a one-time sample-library migration.
- Verified `node scripts/verify-supplied-media.js`: decode, source metadata, playback, reload/selection, sequence advancement, mobile overflow and no page errors.
- Supplied files have no independently verified redistribution license; they are excluded from the project fixture CC0 dedication.

Matched storyboard update: four actual source frames and matching four-second portrait excerpts now populate the default selected shots and visual references. The separate second film remains an alternative. This replaces the earlier default still-animation sequence; earlier assets remain available for legacy imported packages.
