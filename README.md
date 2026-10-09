BazarDor 🛍️

BazarDor is a responsive product discovery and shopping web application built with Next.js. Users can explore products, browse categories, sort products by price, view product details, and manage their accounts through authentication.

🌐 Live Demo

- Live Website: https://bazar-dor-umber.vercel.app/
- GitHub Repository: https://github.com/CodesByHasan/bazar-dor

✨ Features

- Responsive Design: Optimized for mobile, tablet, and desktop devices.
- Product Discovery: Browse products fetched from the BazarDor REST API.
- Category Browsing: Explore products by category.
- Product Sorting: Sort products by price where supported.
- Product Details: View individual product information on dedicated pages.
- Protected Routes: Restrict product details and account features to authenticated users where configured.
- Authentication: Sign up and sign in using email and password.
- Social Login: Google and GitHub authentication through Better Auth.
- User Profile: Access profile information and account features.
- Loading States: Display loading indicators while data is being fetched.
- Empty States: Provide feedback when no matching products are available.
- Custom Error Pages: Handle missing pages with a 404 page.
- Toast Notifications: Display feedback for user actions and errors.
- Dynamic Routing: Use Next.js App Router for product, category, and authentication pages.

🛠️ Technologies Used

Technology| Purpose
Next.js| React framework and application routing
React| User interface development
JavaScript (JSX)| Application logic and components
Tailwind CSS v4| Styling and responsive layouts
daisyUI v5| UI components and themes
Better Auth| Authentication and session management
MongoDB| Authentication data storage
REST API| Product and category data
React Toastify| Toast notifications
Vercel| Deployment and hosting
Git & GitHub| Version control

📡 API Integration

BazarDor retrieves product and category data from the BazarDor API.

Primary API base URL:

https://api.api-store.workers.dev/api/bazardor

Alternative API base URL:

https://api.abcz.workers.dev/api/bazardor

The application uses the API to retrieve product listings, category information, and individual product details. The exact endpoint paths and response structures depend on the API implementation.

📁 Project Structure

bazar-dor/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── route.js
│   │   ├── category/
│   │   │   └── [categoryId]/
│   │   ├── product/
│   │   │   └── [slug]/
│   │   ├── signin/
│   │   ├── signup/
│   │   ├── profile/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── not-found.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── HomeClient.jsx
│   │   └── ProductCard.jsx
│   └── lib/
│       ├── auth.js
│       ├── auth-client.js
│       └── products.js
├── .env.example
├── .gitignore
├── package.json
└── README.md

Note: The structure above summarizes the main application areas. Individual filenames may differ in your current repository.
.

👨‍💻 Author

Hasan Mehedi

- GitHub: https://github.com/CodesByHasan

📄 License
This project is intended for educational and portfolio purposes. Add a license file if you plan to distribute it under a specific open-source license.