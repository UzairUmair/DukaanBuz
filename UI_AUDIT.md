# DukaanSaz UI audit

The baseline is the existing React application at localhost:5173 using its configured production API and the designated Uzair Fashion seller. Screenshots cover the first 900 vertical pixels at widths 375, 768, 1280, 1440 and 1920. The onboarding capture uses a browser override for the single current-store read so the existing seller can inspect first-time setup. It does not verify production registration or store creation.

| Route | Baseline observation | Decision |
|---|---|---|
| / | Split headline and photographic example remain legible when stacked. | Preserve. |
| /example | Labeled lookbook has a clear path to registration. | Preserve. |
| /demo | Destination displays storefront-not-found instead of merchandise. | Send the discovery link to the existing populated test shop. |
| /login | Form hierarchy and password control are clear. | Preserve. |
| /register | Long form scrolls naturally on mobile. | Preserve. |
| /app | Session redirect has no distinct visual surface. | Verify destination. |
| /onboarding | Identity form and address preview separate cleanly at desktop width. | Preserve. |
| /dashboard | Public-store tile leaves most of its image area blank and provides no direct design action. | Use a full-width crop and link to Customize storefront. |
| /dashboard/products | The count and heading repeat above the filters. Filter bar looks detached from its controls. | Name and join the filter toolbar. |
| /dashboard/products/new | The image upload and customer preview have equally prominent headings. | Give the preview a smaller label and clearer panel edge. |
| /dashboard/products/:id/edit | Same editor issue with an existing image. | Apply the shared editor correction. |
| /dashboard/store | Preview shows what will publish but provides no path to change its design. | Add an appearance shortcut. |
| /dashboard/store/design | A long column of controls separates the mobile user from the preview. | Group controls into keyboard-operable disclosures. |
| /s/:slug | The catalog can keep showing its updating state without user input. The default empty preview array changes identity on every render and retriggers fetching. | Stabilize the dependency and tighten catalog navigation spacing. |
| /s/:slug/p/:id | Seller information runs into the inquiry explanation. Desktop imagery takes up excess width. | Add a seller panel and constrain the detail spread. |
| Unknown path | A small message sits at the corner of a nearly blank page. | Center the recovery action in a bounded surface. |

Baseline images are in docs/ui-audit/before. Matching filenames in docs/ui-audit/after identify the same route and viewport. URLs for individual items use the real inventory IDs returned by the API.
