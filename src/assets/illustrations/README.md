# Illustrations

| File                               | What                                    | Status |
| ---------------------------------- | --------------------------------------- | ------ |
| `map.svg`                          | Africa, Kenya highlighted in AV orange  | Used on the homepage ("Made in Nairobi") |
| `nairobi-skyline.svg`              | Nairobi skyline in AV oranges           | No longer used — replaced by the line-art skyline drawn in code (`src/lib/nairobiSkyline.ts`) |
| `Blank_Map-Africa.svg`             | Original map (unedited)                 | Source, kept for re-styling |
| `Nairobi_skyline_illustration.svg` | Original skyline in Kenyan flag colours | Source, kept for re-styling |
| `film-branch.svg`                  | Branching film strip, off-white         | Used on the Studio page (the process) |
| `Schroedingers_cat_film.svg`       | Original film-strip drawing             | Source, kept for re-styling |
| `balance-scale.svg`                | Scale with camera and microphone        | Used on the Studio page intro |
| `Balanced_justice_scale_silhouette,_small.svg` | Original scale             | Source |
| `vintage-camera-filming-svgrepo-com.svg` | Original camera icon              | Source |
| `Microphone_(315790)_-_The_Noun_Project.svg` | Original microphone icon     | Source |

## Credits & licences (all free for commercial use; only the scale needs a credit)

- **Map** — "Blank Map-Africa.svg" by Andreas 06, Wikimedia Commons — public domain.
  Cleaned: scale bar, labels and editor metadata removed; restyled for the dark navy panel.
  Note: the source map predates 2011, so South Sudan is drawn as part of Sudan.
- **Skyline** — "Nairobi skyline illustration.svg" by Francis Akuka for the Wikimedia Foundation, Wikimedia Commons — CC0.
  Recoloured: blue → `#f58a07`, green → `#c96f00`, red → `#ffa53a`, outlines → `#7a4300`.
- **Film strip** — "Schroedingers cat film.svg" by Christian Schirm, Wikimedia Commons — CC0.
  Cleaned: cat, box, hammer, radiation sign, skulls, shadows and frosted panels removed; recoloured off-white.
  The film icons in the frames are drawn in code (`src/lib/filmFrames.ts`).
- **Balance scale** — "Balanced justice scale silhouette, small.svg" by HTGS, Wikimedia Commons — **CC BY-SA 4.0: credit required**.
  Modified: recoloured, split into stand / beam / pans, camera and microphone added. Our `balance-scale.svg` is therefore
  also CC BY-SA 4.0. Credit it on the site (e.g. footer credits page): "Scale illustration by HTGS, CC BY-SA 4.0, modified".
- **Camera** — "Vintage camera filming", SVG Repo. **Licence to confirm** on its SVG Repo page (should be CC0 / PD).
- **Microphone** — "Microphone (315790)" by Mani Bharathi, The Noun Project, via Wikimedia Commons — CC0.

## Notes

- The homepage skyline is our own line drawing, made in code (`src/lib/nairobiSkyline.ts`): one roofline with
  each real landmark once (simplified shapes, not traced). Its soundwave follows the same roofline, so editing a
  building there updates the wave too.
- Only add drawings you made, public-domain/CC0 files, or stock licensed for commercial use. Record any required credit here.
