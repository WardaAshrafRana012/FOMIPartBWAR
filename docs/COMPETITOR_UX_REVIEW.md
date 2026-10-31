# Video creation UX review and Continuity roadmap

Reviewed 31 October 2026, Asia/Karachi. This is desk research of public product documentation, interface examples and selected user reports. It is not a signed-in usability test or representative user study. Features and availability can vary by plan, device, region and model.

“Gvideo” is provisionally interpreted as Google Vids. Kimi is included as an adjacent planning/agent interface; its overview does not establish it as a direct dedicated video editor. Kling is included separately because it is an important video-specific comparison. Meta is separated into Edits and Vibes.

## Competitor patterns and what to learn

The product descriptions below are documented facts. The friction and proposed response columns are design hypotheses, except where explicitly marked as reported evidence. A hypothesis does not establish that a competitor lacks the proposed feature.

| Product          | Documented workflow / UI pattern                                                        | Friction to investigate                                                                                                            | Continuity response                                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Google Flow      | Prompt plus ingredients/frames; historical versions; saved frames; Scenebuilder         | Reconstructing which direction and references produced a selected clip; reported failed-generation uncertainty                     | Visible submitted request, reference snapshots, readable DNA changes, stage-based jobs and actionable failure states           |
| Google Vids      | Prompt/documents to outline, scenes, media, script and voiceover                        | A first draft can still require substantial human editorial decisions; a professional needs to see each shot’s purpose             | Keep brief and story beat attached to each shot; provide an explicit editable plan before any mock generation                  |
| Krea             | Multiple video models and output comparison; agent preview panel with a timeline editor | Comparing output and model settings can impose decision load; a conversational request can obscure what was actually submitted     | Prioritize intent and a human-readable settings difference; keep explicit editing controls and saved requests                  |
| CapCut           | Clip editing and export; premium materials can trigger export restrictions              | Documented late export gating; user report of discovering the restriction after hours of work                                      | Export-readiness checklist with direct links to unresolved shots; disclose the actual JSON deliverable throughout              |
| Meta Edits       | Mobile creation, clip-level timeline editing and publishing-oriented workflow           | Touch precision, crowded tools and context switching are design risks to test, not established defects                             | Phone-specific Preview / Direction / Sequence navigation, reachable primary action, generous targets and expandable inspectors |
| Meta Vibes       | Feed discovery, video remix and social sharing                                          | Feed-led exploration can divert a professional from a defined campaign                                                             | Keep inspiration in an optional reference drawer; open directly into the existing campaign                                     |
| MiniMax / Hailuo | Multimodal references, motion guidance and generation/editing capabilities              | Users must understand the role of each input and the active model’s supported options                                              | Name references by role: product, style, composition, start frame; show supported settings before submission                   |
| Kling            | Multi-shot narrative controls and element references                                    | Multi-shot complexity makes it important to distinguish a plan from a committed result                                             | Explicit shot order, per-shot directions, separate preview/chosen take states and a sequence review                            |
| Runway           | Uploaded/saved references with names and prompt mentions                                | Documentation distinguishes temporary session references from saved reusable references; users need predictable lifetime and scope | Persist named references by default locally and state project scope, storage location and removal behavior                     |
| Adobe Firefly    | Start/end frames plus camera controls and model selection                               | Frame roles and interacting settings can be difficult to understand without immediate feedback                                     | Visual start/end slots, small camera diagrams and readable request preview; no claim that mock pixels respond                  |
| Kimi             | Chat/agent planning, multimodal understanding and task execution                        | A conversation can bury durable decisions and leave users reconstructing the plan                                                  | Carry useful planning into editable shot cards and explicit decisions; do not add a decorative chatbot                         |

## Evidence-backed problems

1. **Late export surprises.** CapCut’s own help explains that premium assets/settings can require a subscription when exporting. A public user report describes discovering this after hours of editing. This establishes a real failure mode, not its prevalence. Continuity should surface missing selections, planned-versus-actual timing and export format before the final download action.
2. **Failure without enough explanation.** A Flow user describes repeated failed requests despite simplifying prompts and references, and uncertainty about whether the input or service is responsible. Do not diagnose the service from this anecdote. The product lesson is to preserve the request, say what is known, avoid invented explanations and offer a deliberate retry.
3. **Unclear asset persistence.** Runway explicitly documents temporary and saved references. The lesson is to make lifetime and reuse scope visible. Our current browser-local persistence is already disclosed; a reference library must preserve that clarity.

## Design hypotheses to test

- Users may struggle to remember the reason behind a chosen alternative after returning to a project.
- A long prompt is difficult to compare against another long prompt; field-level differences may make changes easier to see.
- A full editing timeline may distract from this assessment’s shot-direction workflow; a compact sequence dock plus review mode may be sufficient.
- Users may confuse a previewed take with the version included in the sequence; explicit commit behavior should remain.
- Simultaneously showing models, camera settings, references, history and notes can overwhelm the stage; contextual disclosure should reduce that load.

These hypotheses require observation and task testing before any claim of improved usability.

## Priority implementation list

### P0 — first impression and core usability

1. **Cinematic, distinct media.** Replace repetitive bottle motion with four coherent editorial beats and matching thumbnails. Keep assets local, small and licensed. Acceptance: each shot has an identifiable visual purpose, source attribution and working fallback.
2. **Stage-first layout.** Remove the redundant outer rail; use one collapsible storyboard, a larger central stage, a contextual inspector and a compact sequence dock. Acceptance: stage, generation action and sequence context fit a typical 1440 × 900 viewport without clipping.
3. **Readable typography.** Use approximately 13–14 px for normal controls, larger essential labels, fewer tiny uppercase captions and stronger hierarchy. Acceptance: essential actions and state are readable at desktop and 390 px mobile widths.
4. **Mobile work modes.** Use Preview / Direction / Sequence with a shot-picker sheet. Acceptance: core workflow works by touch and keyboard; generation preserves selected-shot context and no page overflow occurs.

### P1 — differentiating interaction

5. **Visual DNA and reference library.** Product/style references, palette swatches and explicit reference roles. Acceptance: project references persist, shot overrides are clear, and exported requests record the exact reference identity. Mock influence remains honestly labeled.
6. **Take-level direction difference.** Show changed DNA fields, overrides and prompt changes rather than only “Earlier DNA.” Acceptance: changing lighting never rewrites old takes; a readable old/new comparison is available.
7. **Decision-centered comparison.** Matched transport controls, prompt/settings differences and take-specific selection notes/history. Acceptance: preview never changes the sequence, and choosing a take records the decision without losing prior versions.
8. **Continuity review.** List missing selections, differing requested aspect ratios, changed direction snapshots and unresolved decisions. Acceptance: every warning has a direct navigation action; checks are metadata-based and never presented as AI footage analysis.

### P2 — reliability and depth

9. **Undo/redo and recoverable deletion.** Include shot operations and selections; define history limits and exclude asynchronous job stages. Acceptance: undo preserves stable IDs and correctly restores sequence choices.
10. **Validated package import.** Preview the project before importing it as a separate project. Acceptance: malformed data cannot replace existing work; fixture paths are allowlisted and errors are associated with fields.
11. **Persistent job/decision activity.** Retain submitted request and cancellation/failure/completion events. Acceptance: reload behavior is explicit; no fake remote resumption, percentages or invented backend diagnoses.
12. **Precise media interaction.** Accessible custom playback, frame capture, keyboard shortcuts and distraction-free preview. Acceptance: shortcuts respect text inputs, playback errors remain usable and reduced motion is respected.

Do not add payment, authentication, real model integrations, social feeds, decorative analytics or a nonfunctional MP4-rendering action. The priorities remain inside the assessment’s frontend scope.

## Proposed desktop arrangement

- Compact header: project, accurate local save state, undo/redo, review, export.
- Left: collapsible ordered storyboard with readable names, thumbnails and states.
- Center: cinematic stage; take strip immediately below; preview and chosen states unmistakable.
- Right: Direction / References / History inspector with advanced settings disclosed on demand.
- Bottom: sequence dock in the same shot order, missing-selection indicators and planned duration.

## Distinctive product argument

Continuity should demonstrate **the connection between creative intention and an editorial decision**: brief → visual DNA → exact shot request → take provenance → comparison → choice with a reason → reviewed sequence → portable package. The model’s actual consistency cannot be guaranteed by this interface. The connection between requests and saved decisions can be made explicit and verifiable.

## Sources

- [Google Flow creation and references](https://support.google.com/flow/answer/16353334?hl=en)
- [Google Flow editing, versions and scenes](https://support.google.com/flow/answer/16935718?hl=en-1)
- [Google Vids storyboard planning](https://support.google.com/docs/answer/15067819?hl=en)
- [Krea video generation and model comparison](https://www.krea.ai/features/ai-video-generator)
- [Krea agent timeline editor and UI example](https://www.krea.ai/blog/how-to-edit-video-with-krea-agent)
- [CapCut export restrictions](https://www.capcut.com/help/join-capcut-pro-for-exporting)
- [CapCut user export report — anecdotal](https://www.reddit.com/r/CapCut/comments/1vtt0vb/cant_export/)
- [Flow user failure report — anecdotal](https://www.reddit.com/r/GoogleFlow/comments/1vu2kpu/google_flow_repeatedly_fails_at_34_with/)
- [Meta Edits workflow](https://about.fb.com/news/2025/04/introducing-edits-streamlined-video-creation-app/amp/)
- [Meta Vibes remix workflow](https://about.fb.com/news/2025/09/introducing-vibes-ai-videos/?swcfpc=1)
- [MiniMax H3 multimodal references](https://www.minimax.io/blog/minimax-h3)
- [Kling multi-shot model guide](https://kling.ai/quickstart/klingai-video-3-model-user-guide)
- [Runway reference lifetime and reuse](https://help.runwayml.com/hc/en-us/articles/52963720640275-Using-reference-media-to-guide-your-generations)
- [Adobe Firefly frames and camera controls](https://helpx.adobe.com/firefly/mobile/work-with-audio-and-video/work-with-video/generate-videos-using-images.html)
- [Kimi overview and scope](https://www.kimi.ai/help/getting-started/overview)

## Redesign implementation status

The subsequent implementation delivers the prioritized stage-first layout, phone work modes, cinematic fixtures, visual DNA, reference upload/frame capture, take-level direction differences, comparison controls/notes, continuity metadata review, session undo/redo, safe package import and persistent recent activity. See `ASSESSMENT_CHECKLIST.md` for actual verification and limits. This implementation status does not turn the desk-research hypotheses above into validated user outcomes.
