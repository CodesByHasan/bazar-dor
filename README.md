# 🛒 বাজার দর (BazarDor)

বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।

BazarDor is a responsive web app built with Next.js that shows daily essential grocery prices in Bangladesh. Users can browse products and categories, sort by price, check price changes, and view market-wise prices after signing in.

## 🌐 Live Demo

- **Live Website:** https://bazar-dor-umber.vercel.app/
- **GitHub Repository:** https://github.com/CodesByHasan/bazar-dor

## ✨ Key Features

- **Price Ticker:** an infinite scrolling marquee showing each product's price and ▲/▼ change.
- **Price Risers & Fallers:** home page sections for products whose prices went up or down today.
- **Product Cards:** Bengali-digit prices with green, red, and gray change badges.
- **Product Details (Protected):** min, max, and average price plus market-wise prices, available only after login.
- **Category Pages with Sorting:** sort by default, price low to high, or price high to low, using numeric values.
- **Authentication:** email/password sign up and sign in, plus Google and GitHub login with Better Auth.
- **Update Profile:** logged-in users can update their name from the My Profile page.
- **Toast Notifications:** feedback for sign in, sign up, sign out, and errors using react-hot-toast.
- **Loading & Empty States:** skeleton loaders and friendly empty and error messages.
- **Custom 404 Page:** a friendly page with a button back to home.
- **Fully Responsive:** works on mobile, tablet, and desktop.

## 🛠️ Technologies Used

| Technology | Purpose |
| --- | --- |
| Next.js (App Router) | Framework and routing |
| React | UI components |
| JavaScript (JSX) | Application logic |
| Tailwind CSS v4 | Styling and responsive layout |
| daisyUI v5 | UI components |
| Better Auth | Authentication and sessions |
| MongoDB | Auth data storage |
| react-hot-toast | Toast notifications |
| Vercel | Deployment |

## 📡 API

Product and category data comes from the BazarDor API:

- Base URL: `https://api.abcz.workers.dev/api/bazardor`
- Backup URL: `https://api.api-store.workers.dev/api/bazardor`

Endpoints used: `/products`, `/products/:id`, `/categories`.

## 📁 Project Structure

```text
bazar-dor/
├── public/
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/route.js
│   │   ├── category/[categoryId]/page.jsx
│   │   ├── product/[id]/page.jsx
│   │   ├── profile/
│   │   │   ├── page.jsx
│   │   │   └── update/page.js
│   │   ├── signin/page.jsx
│   │   ├── signup/page.jsx
│   │   ├── layout.js
│   │   ├── loading.jsx
│   │   ├── not-found.jsx
│   │   └── page.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── HomeClient.jsx
│   │   ├── PriceMarquee.jsx
│   │   ├── ProductCard.jsx
│   │   └── SortedProducts.jsx
│   ├── lib/
│   │   ├── auth.js
│   │   ├── auth-client.js
│   │   └── products.js
│   └── proxy.js
├── package.json
└── README.md
```


## 👨‍💻 Author

**Hasan Mehedi**: [GitHub](https://github.com/CodesByHasan)