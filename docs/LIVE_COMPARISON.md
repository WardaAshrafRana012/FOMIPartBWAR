# Live comparison: Fomi Mockup and Fomi WAR
Reviewed 1 November 2026 using isolated Chrome at 1440x900 and 390x844. This is an expert inspection, not a user study or full accessibility audit.

## Recommendation
Use WAR as the primary Part B Video Generation Workspace submission. Include the mockup as an earlier exploration, not as a second competing submission. Its simpler image-generation gallery serves a different task.

## Observed differences
- Mockup opens on Image mode, an image gallery, a history strip and creation controls. Its Video view offers a prompt, simulated duration/ratio, reference input, prepared sample and local-video upload. Projects opens a creation empty state. These are observed views, not proof that other capabilities are absent everywhere.
- WAR opens directly into an existing four-shot campaign. Shared DNA, inherited direction, references, comparison, notes, chosen takes, sequence and package export form a connected project workflow.
- Mockup's restrained peach/ivory treatment is lighter and simpler for casual creation. Desktop text/controls appear small, image history competes with results at the top, and image controls remain visible in the Video view. Labels such as 'Model: Name' and 'Advance' feel unfinished.
- WAR has a stronger stage/controls hierarchy, coherent supplied product frames, self-hosted typography and tactile ivory/sage styling. Clay shadows are a visual preference, not measured usability evidence.

## Confusion and trade-offs in WAR
- At 1440x900, the take strip begins near the lower edge of the independently scrolling stage column. A reviewer must scroll to inspect takes and notes; this is discoverable but less immediately obvious.
- Several metadata labels are small and muted. Improving readability at 100% zoom is more valuable than adding more decorative effects.
- Initial preview is the 17.1s full sample while the sequence contains a 4s excerpt; the UI distinguishes preview from choice and source from planned duration, but first-time users must learn both distinctions together.
- Both complete supplied films remain alternatives and show different products. The default selected storyboard uses one product, but the second alternative should be explained as a separate supplied example, not a consistent take of the same subject.
- Two bundled takes for a shot can reuse one excerpt. This tests comparison mechanics, not distinct model output quality.
- The header's WAR name and the Continuity review action refer to different things; a more explicit 'Check sequence' action label could reduce ambiguity in a future iteration.
- Home/mobile layout checks found no page-level horizontal overflow on either app at 390px. Initial navigation produced no uncaught page errors. This does not establish WCAG compliance or every workflow's correctness.

## Evidence and limits
WAR's production build, 14 state tests, full live workflow suite, source MP4 playback and responsive checks were verified during implementation. Both live landing pages and the mockup Video/Projects views were inspected for this review. The mockup was not subjected to WAR's automated workflow suite and its source code was not audited. No rankings, user preference results, performance scores or conversion metrics are claimed.

## Source locations for follow-up (WAR)
- components/workspace/Workspace.js: stage, navigation and preview/choice composition.
- app/typography.css: small metadata and hierarchy trade-offs; next refinement should prioritize labels.
- app/studio.css: independent preview/inspector scrollports and stage sizing.
- lib/storyboard-media.js: repeated excerpt fixtures and supplied-footage provenance.

Live apps: https://fomia-mockup.vercel.app/ and https://fomi-part-b-war.vercel.app/.
Assessment interpretation is based on the requirements supplied in chat; no separate original employer PDF or URL was supplied.
