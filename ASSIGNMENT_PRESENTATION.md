# DukaanSaz — SMIT presentation notes

## 1. Introduction
DukaanSaz (دکان ساز) is a digital catalog platform for Pakistani small businesses. **Apni Dukaan. Apni Pehchaan.** Sellers create a store, add products and share its public link.

**Roman Urdu:** DukaanSaz se seller apni online dukaan aur products ka link customers ko bhej sakta hai.

## 2. Problem
Many small businesses sell through messages but need a simple, organized catalog. Sending the same product photos and prices repeatedly takes time.

## 3. Solution
One seller account creates one storefront. The seller manages products, stock and prices in a dashboard. Customers browse without an account and ask about a product on WhatsApp.

## 4. Frontend
React builds the screens, Vite runs and bundles the app, Material UI supplies accessible UI primitives, React Router handles pages, Axios calls the API, and Lucide supplies icons.

## 5. Backend
Node.js runs an Express REST API. Routes validate requests, authenticate sellers and return JSON. The frontend uses `VITE_API_URL` to call it.

## 6. Database
MongoDB stores data through Mongoose models. A User owns a Store; a Store owns Products. The stored ObjectId relationships let the backend scope queries to a seller.

## 7. Authentication
The password is hashed with bcrypt. Login returns a signed JWT. The frontend sends it as a Bearer token on protected requests. The server verifies it before every seller action.

## 8. CRUD
`GET` reads products, `POST` creates one, `PUT` updates one, and `DELETE` removes one. The server checks ownership for each protected product operation.

## 9. Images
The seller first creates the product, then sends an image to `POST /api/products/:id/image` as `FormData` with field name `image`. Multer checks JPEG, PNG and WebP content and size. Locally images are files; on Vercel the backend uses MongoDB GridFS. The returned relative image URL is resolved against the backend origin.

## 10. Admin panel
The dashboard shows real counts and recent products. The seller can search, filter, add, edit and delete products and update the store profile.

## 11. Multi-tenancy
Each seller's JWT identifies the owner. Backend queries use that owner to find their store and products. Public routes resolve a store slug and return only that store's active products.

## 12. Live demo order
1. Open the landing page and explain the product.
2. Register a designated test seller, then log in.
3. Create a store and copy its link.
4. Add a test product, price, stock and image.
5. Show dashboard counts and product search.
6. Edit stock and price, then refresh to show persistence.
7. Open the public storefront and product page.
8. Open the WhatsApp inquiry link and explain the prefilled message.
9. Return to the dashboard, delete the test product and log out.

## 13. Likely teacher questions

1. **Why React?** It makes the interface from reusable components and updates it when data changes.
2. **Why Vite?** It provides a fast development server and production build for React.
3. **What is an API?** A set of HTTP routes through which frontend and backend exchange data.
4. **What is REST?** A route pattern that uses HTTP methods for resources such as products.
5. **What is MongoDB?** A document database that stores users, stores and products.
6. **What is Mongoose?** It defines schemas and helps Node.js query MongoDB.
7. **Why hash passwords?** To avoid storing readable passwords in the database.
8. **What is JWT?** A signed token the server can verify to identify a logged-in seller.
9. **Is a protected React route enough security?** No. The Express middleware and ownership queries enforce security.
10. **What is multi-tenancy?** Multiple sellers use one platform while their store data stays separate.
11. **How is a product linked to a seller?** Product references Store; Store references owner User.
12. **Why upload in two steps?** The image route needs a saved product ID before attaching its image.
13. **What is FormData?** Browser format for sending an image file in multipart HTTP.
14. **What is GridFS?** MongoDB file storage used by the Vercel backend for persistent product images.
15. **What happens if stock is zero?** The interface marks the item out of stock; public visibility also depends on its active status.
16. **What is CORS?** Browser protection that requires the backend to allow the frontend's origin.
17. **Why an environment variable?** It lets the same frontend code point to the correct backend per deployment.
18. **How does WhatsApp inquiry work?** The app builds a `wa.me` URL with the seller's number and product details.
