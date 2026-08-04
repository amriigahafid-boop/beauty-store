# 💄 Beauty Store — E-Commerce Platform

A modern, responsive beauty products e-commerce store built with HTML, CSS, and JavaScript.

---

## ✨ Features

- 🛍️ Product catalog with filtering & search
- 🛒 Shopping cart with real-time updates
- 💳 Checkout flow with order summary
- 👤 User authentication & account management
- 📱 Fully responsive design (mobile-first)
- 🎨 Modern UI with smooth animations
- ⭐ Product reviews & ratings
- ❤️ Wishlist functionality
- 🔍 Advanced product search & filtering

---

## 📁 Project Structure

```
beauty-store/
├── public/                    # Static assets served directly
│   ├── images/
│   │   ├── products/          # Product images
│   │   ├── banners/           # Hero & promotional banners
│   │   └── icons/             # App icons & favicons
│   └── fonts/                 # Self-hosted fonts
│
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── common/            # Buttons, inputs, modals, badges
│   │   ├── layout/            # Header, footer, navigation, sidebar
│   │   ├── product/           # Product cards, galleries, reviews
│   │   ├── cart/              # Cart drawer, cart items, cart summary
│   │   ├── checkout/          # Checkout steps, payment, shipping
│   │   ├── auth/              # Login, register, forgot password
│   │   └── account/           # Profile, orders, wishlist
│   │
│   ├── pages/                 # Page-level HTML files
│   ├── hooks/                 # Custom JS utilities / hooks
│   ├── context/               # Global state management
│   ├── utils/                 # Helper functions & formatters
│   ├── services/              # API calls & data fetching
│   ├── styles/                # Global CSS, variables, themes
│   └── assets/                # Images, icons used in components
│
├── tests/                     # Unit & integration tests
├── docs/                      # Project documentation
├── .github/
│   └── workflows/             # GitHub Actions CI/CD pipelines
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ (for dev tools)
- A modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/beauty-store.git
cd beauty-store

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Markup      | HTML5 (Semantic)          |
| Styling     | Vanilla CSS3 + Custom Properties |
| Logic       | JavaScript (ES2022+)      |
| Fonts       | Google Fonts              |
| Icons       | Feather Icons / Lucide    |
| CI/CD       | GitHub Actions            |
| Hosting     | Vercel / Netlify (planned)|

---

## 📋 Roadmap

- [ ] Home / Landing Page
- [ ] Product Listing Page with filters
- [ ] Product Detail Page
- [ ] Shopping Cart
- [ ] Checkout Flow
- [ ] User Authentication
- [ ] Order History & Tracking
- [ ] Wishlist
- [ ] Search with autocomplete
- [ ] Admin dashboard

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

> Made with ❤️ and good taste.
