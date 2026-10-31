# Fomi — Continuity

Part B · **Video Generation Workspace**

A director's workspace for returning to an existing fragrance campaign. A brief becomes project-level Creative DNA, explicit shot directions, reviewed alternatives, and a chosen sequence with remembered editorial decisions.

This is a complete **interactive frontend assessment**, with a real local mock API. It does not run an AI video model. Four original AI-created campaign stills have been prepared as eight small local camera-motion fixtures. Submitted prompts, settings and references are real saved metadata; they do not alter fixture pixels.

## Run

Node.js 20.9+ (tested with Node 24), npm, no keys or accounts.

```sh
npm ci
npm run dev -- --port 3101
```

Open **http://localhost:3101**. This avoids the existing AI Video Studio on port 3000 and the earlier Continuity preview on 3100. On Windows use `npm.cmd` if PowerShell blocks npm.ps1.

```sh
npm run build
npm run start -- --port 3101
```

## The complete workflow

1. Resume **AFTER HOURS — Fragrance Campaign**, with four planned shots, eight takes and a chosen sequence.
2. Read the creative brief. Edit the visual Creative DNA board: subject, style, lighting, palette and camera principles.
3. Direct a shot; expand Effective direction to see the combined request. Overrides replace specific defaults. Edit shot details to rename a shot or change its story beat.
4. In References, upload JPG/PNG/WebP, name its role, inherit project references or make a shot-specific selection. Pause a clip and Save frame to create a composition reference.
5. Generate two prepared alternatives. Follow queued/generating/completed status while reviewing another shot. Cancellation, retry and an explicit failure demonstration work.
6. Compare two takes with shared start/pause controls and request differences. Choose a version and keep a note with that take. New generations never silently replace the chosen version.
7. Open Take details or History to see exactly which DNA fields changed since a take was created. History retains submitted requests, notes and recent generation/choice events.
8. Review continuity metadata, navigate to unresolved shots and play the chosen clips consecutively.
9. Export the current JSON package. Import it later as a separate validated project. Original projects are never replaced.

Desktop uses one storyboard, a cinematic stage, contextual inspector and docked sequence. Mobile has Preview / Direction / Sequence modes and a shot-picker sheet. **Project tools** exposes all project actions on every screen size, including accurate local save status, undo/redo, brief, import and continuity review.

## Architecture

- `app/`: App Router entry, metadata/icon, error/loading boundaries, `api/generate/route.js`, `studio.css`.
- `components/workspace/`: workspace composition, storyboard, direction/reference/history inspector, custom accessible video controls, takes, comparison, sequence and project dialogs.
- `components/ui/Dialog.js`: native modal with title, focus management, Tab wrapping and Escape support.
- `hooks/useProject.js`: versioned persistence, 500 ms debounce, synchronous state reference and grouped session undo/redo.
- `hooks/useGeneration.js`: independent per-shot simulated jobs, AbortController cancellation, timers and activity events.
- `lib/project.js`: request snapshots, validation, shot operations, schema recovery and export.
- `lib/editor.js`: migration/default enrichment, historical direction differences, continuity checks, safe import and editorial-history restoration.
- `data/seed.js`: believable creative brief, DNA, references and existing decisions.
- `public/demo/`: local WebP posters, eight VP9 WebM fixtures and retained legacy SVG references. About 5.4 MB of video and 0.32 MB of posters.
- `tests/`: focused transformations and recovery/import tests. `scripts/verify-*.js`: isolated Chrome integration workflows and responsive screenshots.

JavaScript only, ordinary CSS, Next.js/React and Lucide icons. Playwright, Prettier and PDFKit are development tools. No external fonts, runtime media downloads, authentication, database or secrets.

## Mock generation

`POST /api/generate` rejects malformed JSON, oversized requests, invalid prompts, unsupported durations/ratios, incomplete direction and unsafe references. A shot fixture index and prompt hash choose two deterministic camera studies of the same prepared scene. IDs and timestamps are real; no inference is performed. The submitted prompt, inherited rules, overrides, references, duration and ratio are snapshotted on each result.

The client simulates stages over about four seconds without invented progress percentages. One active request is permitted per shot. A valid response can deliberately fail for demonstration. New takes append to the original project and shot even if the user switches context. Abort flags prevent cancelled jobs from adding results. Timers/controllers clean up on unmount.

**Reload cancels unfinished simulations.** Completed edits persist; pending outputs do not appear later. The next opening records an interruption in the activity history when a queued event lacked a terminal result. There is no server queue or automatic remote resumption.

## Persistence, references and undo

`localStorage['fomi-continuity-v1']` holds `{version:1, active, projects}`. Projects contain brief, DNA, reference library, ordered shots, selected shot, requests/takes, chosen versions, take-specific notes and up to 60 recent activity events. Legacy version-1 projects gain reference/history defaults on opening. Malformed or incompatible data safely recovers to the seed with a notice. Reads and writes can fail; storage/quota failures remain visible on mobile and desktop. Browser-local means independent origins, profiles and devices. Last writer wins between tabs.

Reference uploads accept JPG/PNG/WebP up to 4 MB, resize to at most 720 px and store a compact WebP thumbnail below 350 KB. Captures save a 640 px frame. Up to 12 references are allowed. Requests keep reference snapshots, so removing/renaming the current library does not rewrite old takes. Uploaded thumbnails may consume browser storage quickly; export before quota is reached.

Undo/redo retains up to 25 grouped editorial edits **in memory for the session**, not across reloads. It covers shot edits, order, deletion, references and take choices. Completed generation results are merged into restored editorial snapshots rather than discarded. Project creation/import and reset do not enter this history. Reset is confirmed and clears history and job state.

Import accepts a valid Fomi package up to 5 MB, previews it, allowlists media paths and reference data, and gives the project, shots and takes fresh identities. Historical reference IDs remain provenance of the source request. Package export uses the current state even while a local save is pending.

## Media provenance

The four cinematic stills were created for this project with the built-in image-generation tool, using fictional product prompts. The app never calls that tool. Canvas movement converts those stills into short fixture clips; no human/product animation or model-generated motion is claimed. Two camera studies exist per scene. Source prompts and production method are documented in `docs/MEDIA.md`. Rebuild checked-in clips with `node scripts/create-cinematic-media.js` (installed Chrome required).

No third-party film or stock footage was downloaded. The fictional product and imagery are sample campaign content. `public/demo/LICENSE.txt` dedicates project-created material to CC0 to the extent rights exist. Lucide retains its ISC license. Legacy vector references are retained for older packages. No external media URLs are required at runtime.

## Verification

```sh
npm test
# Start the production or development app at port 3101 first:
node scripts/verify-browser.js
node scripts/verify-edge-cases.js
npm run build
```

Tests require installed Google Chrome and use disposable isolated profiles. For another port, set `BASE_URL` before running the browser scripts. See `docs/ASSESSMENT_CHECKLIST.md` for final results, known limits and manual verification. No Lighthouse score is claimed.

## Vercel and GitHub

Use this assessment folder as the repository root. The existing AI Video Studio source is untouched.

1. Create an empty GitHub repository in your intended account; add it as `origin` and push `main`.
2. Import it into your intended Vercel account. Framework: Next.js. Root: this folder. Build: `npm run build`. No environment variables or custom backend.
3. Open and verify the resulting HTTPS URL. Use the Next.js runtime, not static export: the POST route is required.
4. Update `docs/submission-links.json`, then run `node scripts/create-submission.js` to regenerate the submission PDF. Pending links are explicit; no live deployment has been invented.

Framework references: [route handlers](https://nextjs.org/docs/app/getting-started/route-handlers), [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).

## Honest boundaries

This is a working frontend demonstration, not a static design and not a real AI service. Camera-motion fixtures repeat, approximate five seconds and remain landscape. Entered timing, ratios, prompts and references are request metadata. Continuity review compares metadata and decisions; it does not inspect footage. Shared comparison playback is approximate browser playback, not frame synchronization. Sequence review does not trim or render a film. JSON includes fixture paths and reference thumbnails, not embedded videos; clips can be downloaded individually. No cloud backup, cross-tab conflict resolution, payments, auth, collaboration or actual image/video generation. Sudden crashes can lose edits within the debounce window. Real Safari/iOS and assistive-technology user testing remain unverified.

### Unified atelier update
The workspace now combines an ivory storyboard and Creative DNA ribbon with a dark director stage and an ordered sequence dock. Desktop Storyboard expands the shot rail into a visual contact sheet; Director restores the direction inspector; Sequence opens consecutive playback. Mobile retains its dedicated Preview / Direction / Sequence navigation. No billing or generation limits were introduced.

Hover zoom, sequence lift, press feedback, focus treatments and dialog entrance transitions respect reduced-motion preferences. Verify this update with `node scripts/verify-atelier.js` (defaults to port 3102; accepts BASE_URL). The submission PDF includes the newer design and supplied footage.

### Supplied video examples
The first shot now offers two user-supplied portrait sample films, with actual extracted posters, original audio (muted initially), full playback and individual downloads. Existing chosen takes are preserved. The simulated first-shot generation returns these prepared examples and labels them as supplied, not app-generated. The 17.1s and 10.0s source clips are longer than the shot plan; there is no implicit trimming. See docs/MEDIA.md for provenance and rights status.

### Matched storyboard
The selected sequence and its shot images now use four extracted product-film moments, with matching silent four-second portrait excerpts. Both full supplied films remain sample alternatives. The second branded product is not mixed into the default chosen sequence. Run `node scripts/create-supplied-storyboard.js` to rebuild the matched media. Alternate mock outputs may repeat an excerpt; this is disclosed in provenance.
