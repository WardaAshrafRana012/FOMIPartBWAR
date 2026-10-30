# Assessment checklist

Verification date: 31 October 2026 (Asia/Karachi). This project is isolated in `fomi-continuity`; no existing AI Video Studio source was accessed or changed.

## Assessment mapping

| Area                      | Implemented evidence                                                                                                                                                  | Trade-off / limitation                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Product thinking          | Existing four-shot campaign, brief, Creative DNA, merged direction, saved provenance, deliberate choice and decision notes                                            | Concept reasoning, not user research; no evidence of actual model consistency                         |
| Frontend engineering      | Next.js App Router; JavaScript; real validated POST handler; independent cancellable jobs; JSON download; versioned local persistence and visible save failures       | Simulated jobs run in browser; no server queue or durable server state                                |
| Code architecture         | Separate seed, pure state/request/export utilities, persistence hook, generation hook, storyboard, direction panel, media, review and dialog components               | Workspace owns composition and supporting dialog content; no external state framework                 |
| UX and interaction        | Resume, project create/rename/switch, shot add/duplicate/delete/reorder, overrides, compare, choose, notes, ordered review and export                                 | No undo or import; destructive actions require confirmation; notes are per shot                       |
| Visual polish             | Warm charcoal/olive workspace, original amber motion studies, large stage, editorial type hierarchy, responsive storyboard, focus/hover/disabled/loading/error states | Stylized vector motion fixtures rather than photographic campaign footage                             |
| Originality               | Direction inheritance made inspectable, historical snapshots, separate preview/sequence choices, decision rationale                                                   | Shared defaults and editorial sequence are established patterns combined for this particular workflow |
| Product-thinking document | `PRODUCT_THINKING.md` answers problem, user, three UX decisions, omissions, influences, critiques, next month and differentiator                                      | No invented research, outcomes or model capability claims                                             |
| Submission                | Three-page rendered and visually inspected PDF; verified desktop/mobile screenshots; explicit pending link fields                                                     | GitHub publication and Vercel deployment require the intended account                                 |

## Passed verification

`npm test`: **6/6 tests pass**. Covers independent duplication identities, inheritance and frozen historical snapshots, ordered sequence export, malformed/versioned data recovery, request validation, and current notes/brief in exports.

`node scripts/verify-browser.js`: **passes against the production server in isolated headless Google Chrome**.

- Seeded project, eight initial takes, local clip playback.
- Prompt and Creative DNA edits survive reload; earlier-DNA indication appears.
- Add, duplicate, move and confirmed delete update the shot list.
- Invalid generation input is rejected, queued/generating/completed stages occur, and successful results preserve chosen takes.
- Cancel, explicit failure and retry work.
- Two-take comparison, chosen version and decision-note persistence work.
- Dialog focus stays inside, Escape closes, and focus returns to the opener.
- Sequence playback advances to the next selected clip.
- Downloaded JSON contains current brief/DNA/shot data, choices and notes; missing-selection explanation appears.
- Corrupt local data recovers with a visible notice.
- Route returns 422 for invalid fields and 400 for malformed JSON.
- No uncaught page errors or unexpected console errors in the final run. Expected 422 validation is deliberately excluded from console-error failure checks.
- No document-level horizontal overflow at 360, 390, 430, 768, 1024, 1280, 1440 or 1920 pixels. Screenshots saved in `docs/screenshots/`.

`node scripts/verify-edge-cases.js`: **passes against the production server**. Checks mobile brief access, keyboard selection, active-shot restoration, generation targeting and override snapshots while another shot is reviewed, reload cancellation, project creation/switching/renaming, reset cancellation and storage-failure feedback.

`npm run build`: **passes**, producing the page, icon and dynamic `/api/generate` route. Production server runs successfully at `http://localhost:3100`.

Dependency install after upgrading to patched Next.js 16.4.3 reports **0 vulnerabilities**. This is an npm advisory result, not a security audit or a performance score.

## Visual inspection

Desktop and mobile screenshots were opened and inspected directly. The desktop stage remains prominent; the mobile layout stacks direction beneath media and contains shot/take/sequence scrolling within their strips. The creative brief and project rename remain accessible on mobile. All three final PDF pages were rendered to PNG with PyMuPDF and inspected for legibility, alignment, clipping and page breaks.

The native desktop-browser handoff timed out. This did not prevent isolated Playwright Chrome verification or screenshots. No personal browser profile or existing AI Video Studio tab was modified.

## Known limitations and unverified items

- Four original deterministic motion fixtures repeat across requests. Actual clip pixels, timing and aspect do not change with metadata. UI and documentation disclose this.
- Browser-local persistence only; 500 ms debounce and pagehide flush. A sudden crash can lose recent edits. No cross-tab conflict resolution, import, migration beyond safe version recovery, or cloud backup.
- Reload cancels unfinished simulations without adding incomplete takes. Jobs do not resume on the server.
- “Earlier DNA” compares saved project DNA strings, not video content or semantic consistency.
- Sequence playback uses selected clips consecutively with browser handoffs; no frame-accurate editing, seamlessness or MP4 rendering.
- JSON includes fixture paths and provenance, not embedded video files. Individual fixture downloads are available in Take details.
- Keyboard forms, selection, native dialog behavior and move controls are implemented; no screen-reader user study or exhaustive assistive-technology audit was performed.
- No real iOS/Safari/Firefox, physical tablet/touch, zoom/OS text scaling, high contrast, or slow-device testing. WebM failure has an explicit fallback.
- Contrast and focus were visually reviewed; no formal WCAG conformance or Lighthouse performance claim.
- No live deployment or GitHub remote exists. Create/push the intended repository, import into the intended Vercel account, check the deployed URL, update `submission-links.json`, and regenerate the PDF. The draft contains explicit placeholders.
