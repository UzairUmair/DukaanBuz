# DukaanSaz instructor demonstration

DukaanSaz gives Pakistani sellers a public catalog, product management and WhatsApp inquiries. Sellers authenticate using JWT. Every store and product operation is scoped to the verified seller.

## Deployment prerequisites

Deploy the backend appearance schema and endpoint before publishing the new frontend. Configure a reachable production MONGODB_URI privately. Set DEMO_EMAIL and DEMO_PASSWORD through local environment variables, then run node scripts/seedDemoStore.js from backend. Use a fresh designated email and a password of at least 12 characters. The script refuses unrelated slug ownership and inserts missing demo products without deleting records.

Production seeding has not succeeded in this workspace because its configured local MongoDB server is unavailable. The seed and appearance persistence were verified against an isolated MongoDB database. Dedicated banner and logo uploads remain unavailable. Product images supply the hero.

## Walkthrough

1. Open /demo. Mitti Studio is explicitly marked as a demo. Prices and stock are illustrative. Show six products, search, categories and a product detail.
2. Explain that Mongoose stores products with the store ObjectId in MongoDB. Repeating the seed does not duplicate products.
3. Sign in using the designated demo seller credentials privately. Show inventory, create a disposable item, upload a photo, edit its price and delete that disposable item.
4. Open Customize store in the sidebar. Select Editorial Cream, adjust primary color and product cards, then select mobile preview.
5. Use Reset unsaved changes to explain draft behavior. Make changes again and click Save & Publish.
6. Open the public store in another tab and refresh to show persistence.
7. Explain that public browsing needs no account. Publishing needs JWT authentication and the endpoint resolves ownership from the token.

## Likely questions

- Where is the design stored? In the store's validated appearance subdocument.
- Can sellers edit other stores? The appearance endpoint looks up only the store owned by the authenticated user.
- Is preview separate from the published renderer? Both use PublicStore and ThemeSurface.
- Does changing theme affect stock or prices? Appearance has its own allowlisted fields.
- Can visitors contact the fictional seller? Demo contact actions are disabled.
- Are sample products real customer inventory? They are designated demonstration records.
