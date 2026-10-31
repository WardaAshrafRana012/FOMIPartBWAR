# Media provenance and generation prompts

The current campaign has four original AI-created stills prepared with the built-in image-generation tool. They were then turned into eight small browser-canvas motion studies (push-in and slower pull-back variants). The app never calls an image or video model. These are prepared fixtures, not videos generated from the visitor's prompt.

No third-party stock footage, film, photos, model weights or external media URLs were downloaded. The fictional AFTER HOURS fragrance and visual world are assessment content. Actual bottle details can vary between prepared stills; Creative DNA does not guarantee pixel-level consistency.

## Files and method

- `public/demo/invitation.webp`: atmospheric evening establishing shot.
- `public/demo/material.webp`: macro amber-glass detail.
- `public/demo/ritual.webp`: hand reaching for fragrance, an intimate ritual.
- `public/demo/signature.webp`: final product portrait.
- `amber`, `veil`, `ritual`, `signature` each have `.webm` and `-alt.webm` clips. Resolution 960 × 540, approximately five seconds, silent VP9 WebM. Total video size about 5.4 MB; posters about 0.32 MB.
- `scripts/create-cinematic-media.js` reproduces the local motion studies from the checked-in WebP posters using installed Google Chrome and MediaRecorder. The movement is a canvas pan/scale, not subject animation or AI motion synthesis.
- Full generated PNGs are saved locally in `output/media-originals/` and excluded from Git to keep the submission compact. Optimized project-bound WebP assets are checked in. Image generation used the built-in tool, not a paid API integration in this repository.
- Original SVG references remain for compatibility with old packages. `scripts/create-media.js` is the older vector-fixture authoring script and should not be run to recreate the current cinematic clips.

Videos preload metadata; thumbnails do not autoplay. One player normally pauses other players; comparison explicitly allows two videos. Shared playback starts are approximate. Media errors have an accessible fallback. Real Safari/iOS playback compatibility remains unverified.

## Prompt set

All four calls used this common specification:

> Use case: ads-marketing. Create ONE original photorealistic cinematic frame for a fictional fragrance campaign used as local fixture media in a video workspace. Landscape 16:9 composition. [SCENE] Coherent campaign palette: warm amber, tobacco, ivory, near black. Editorial luxury photography, 35mm film texture, subtle grain, realistic glass. No interface, no collage, no watermarks, no extra typography outside the physical product label. No real brand logos. Save a project asset.

Scene 1 / Invitation:

> A wide atmospheric establishing frame: a smoked amber rectangular perfume bottle with black cylindrical cap and small ivory AFTER HOURS label on the right third of dark walnut table in an intimate Paris apartment at blue hour. Warm light from a partly open door cuts through a subtle haze. Heavy dark curtains, abstract city bokeh. Bottle fills one quarter frame. Beautiful chiaroscuro and abundant dark negative space.

Scene 2 / Material:

> Extreme macro cinematic product photography of smoked amber perfume glass, liquid refraction and the edge of an ivory paper label reading AFTER HOURS. The bottle curves fill the right half of frame, tiny condensation, a thin golden highlight. Dark brown stone background, shallow focus. Focus on sensuous physical material and luminous amber refractions, not full bottle.

Scene 3 / Ritual:

> Intimate cinematic close shot of an elegant adult hand gently reaching for a rectangular amber perfume bottle with black cylindrical cap and small ivory AFTER HOURS label on a dark walnut table, ivory silk sleeve, blurred warm lamp and dark apartment beyond. Luxurious editorial mood, natural skin texture. Hand and bottle on right of center. Human ritual not an ad poster.

Scene 4 / Signature:

> Minimal final fragrance campaign product portrait: one rectangular smoked amber perfume bottle, black cylindrical cap, ivory paper label reading AFTER HOURS with smaller EAU DE PARFUM, on a dark travertine plinth. Low warm side light, deep rich charcoal and tobacco shadows, beautiful glass reflections. A single softly folded ivory silk fabric behind and to the left, bottle centered slightly right. Sophisticated photographic realism.

## Licensing

See `public/demo/LICENSE.txt`: project-created material is dedicated under CC0 1.0 to the extent rights exist. This does not assert exclusive copyright in AI-generated material or apply to third-party software. Lucide retains its separate ISC license. Reference uploads are browser-local user-provided material and are not covered by the fixture dedication.

## Supplied sample footage — 31 October 2026
The user supplied two WhatsApp-named MP4 files for this assessment. Local copies:
- supplied-01.mp4: 720 x 1280, 17.066667 seconds, 2,253,330 bytes. Product film with a visible Lucky Tender / Sea of Perfumes label.
- supplied-02.mp4: 720 x 1280, 10.005011 seconds, 1,769,313 bytes. Fragrance ingredient imagery.
Matching WebP posters are extracted from the actual clips using scripts/inspect-supplied-media.js. No alteration of brand labels or claim of original authorship is made. The user authorized inclusion; independent ownership/licensing documentation has not been provided. These files and extracted posters are excluded from the CC0 dedication for project-created fixtures. Confirm redistribution rights before public publication.

The first shot previews these as its first two sample alternatives. Existing selections remain intact. The mocked route returns these prepared examples for the first shot, with a frozen illustrative request and supplied-footage provenance. They are not generated by the app, not evidence of Creative DNA consistency, and not matching views of one identical product. Full source durations and portrait ratios appear in take metadata; the planned sequence duration is a planning value, not a rendered runtime. Other shots retain the original coherent campaign motion studies.

## Matched storyboard revision
The selected four-shot campaign now uses frames and silent four-second excerpts from supplied-01.mp4, at approximately 1s, 5s, 8s and 11s. The posters, Creative DNA reference, storyboard, chosen takes and sequence therefore show the same source product. Shot names: The product reveal, The crafted detail, Light and silhouette, The signature. Both complete supplied films remain available as alternatives in the first shot. Repeated alternatives for other shots reuse an excerpt; they are not distinct model outputs.

Assets: study-reveal, study-texture, study-ritual and study-signature, each .webp and .webm. Recreate using scripts/create-supplied-storyboard.js. These derivatives retain the source footage rights and are excluded from the project CC0 dedication. A one-time migration changes only bundled take IDs and default references/names, preserving custom takes, choices and notes. Earlier saved take request snapshots remain historical metadata and may be flagged as earlier DNA.
