# Naresh Jewellers — Website

A full-stack e-commerce website for **Naresh Jewellers**, a physical jewellery store in Birmingham selling gold, silver, diamond, and South-East Asian style jewellery.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript (Vite) |
| Styling | Tailwind CSS v4 |
| Backend | Django 6 + Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | SQLite (dev) / PostgreSQL (production) |
| Testing | Playwright (API + E2E) |
| Admin | Django Jazzmin |

---

## Features

- Product catalogue with search, filters (category, metal, price), and sorting
- Customer accounts — register, login, order history, wishlist, profile
- Shopping cart and checkout (cash on collection, bank transfer)
- Book appointments, submit enquiries, contact form
- Sell gold / buyback form with live gold price display
- Bespoke jewellery commission enquiries
- Product reviews
- Live gold price ticker
- Multilingual — English, Hindi, Punjabi
- Ring and bangle size guide
- SEO — meta tags and JSON-LD on all pages
- Custom admin dashboard with store stats

---

## Project Structure

```
naresh-project/
├── backend/
│   ├── config/           # Settings, URLs, WSGI
│   ├── products/         # Products & Categories
│   ├── customers/        # Customer profiles
│   ├── orders/           # Cart & Orders
│   ├── enquiries/        # Contact / product enquiries
│   ├── appointments/     # Appointment booking
│   ├── reviews/          # Product reviews
│   ├── wishlist/         # Wishlisted products
│   ├── buyback/          # Sell gold / gold buyback
│   ├── custom_orders/    # Bespoke jewellery commissions
│   ├── core/             # Seed data, admin stats dashboard
│   └── manage.py
├── frontend/
│   └── src/
│       ├── components/   # Header, Footer, ProductCard, GoldTicker, SizeGuideModal…
│       ├── pages/        # All page components
│       ├── context/      # AuthContext, CartContext
│       ├── services/     # API calls (axios)
│       ├── i18n/         # EN / HI / PA translations
│       └── types/        # TypeScript interfaces
├── e2e/
│   ├── api/              # API tests (no browser, fast)
│   └── ui/               # Full browser E2E tests
├── playwright.config.ts
└── README.md
```

---

## Prerequisites

- **Python 3.10+** — [python.org](https://www.python.org/downloads/)
- **Node.js 20+** — [nodejs.org](https://nodejs.org/)
- **Git** — [git-scm.com](https://git-scm.com/)

> **Windows note:** Use the `py -3` launcher instead of `python` or `python3`.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/antwan1/Naresh-Gold-Store.git
cd Naresh-Gold-Store
```

### 2. Backend

Install Python dependencies (from the project root):

```bash
pip install -r requirements.txt
```

Create `backend/.env` — copy the block below into a new file called `.env` inside the `backend/` folder. The defaults work out of the box for local dev:

```env
SECRET_KEY=django-insecure-dev-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email — leave as console backend for dev (prints to terminal)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# For production SMTP (e.g. Gmail):
# EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=your@gmail.com
# EMAIL_HOST_PASSWORD=your-app-password

DEFAULT_FROM_EMAIL=Naresh Jewellers <noreply@nareshjewellers.co.uk>
SHOP_EMAIL=info@nareshjewellers.co.uk
```

Run migrations and seed the database:

```bash
cd backend
py -3 manage.py migrate
py -3 manage.py seed_test_data
```

The seed creates:
- 4 categories: Gold, Silver, Diamond, South-East Asian
- 16 sample products
- Admin user and test customer (see credentials below)

### 3. Frontend

```bash
cd frontend
npm install
```

### 4. Playwright (for tests)

```bash
# From the project root
npx playwright install chromium
```

---

## Running Locally

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
py -3 manage.py runserver
```
API available at `http://localhost:8000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Site available at `http://localhost:5173`

---

## Admin Panel

Go to `http://localhost:8000/admin` and log in with:

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `AdminPassword123!` |

> Note: Django admin uses **username**, not email address.

From here you can manage products, images, prices, orders, enquiries, appointments, reviews, buyback requests, and bespoke order enquiries.

### Adding products

1. Go to **Products → Products → Add Product**
2. Fill in name, category, metal type, purity, weight, price (or tick "Price on Request")
3. Save, then go to **Product Images** to upload photos
4. Tick **Is Featured** to show the product on the homepage

### Custom admin stats dashboard

Visit `http://localhost:8000/admin/stats/` for a live overview of orders, revenue, enquiries, and stock.

---

## Test Credentials

| Role | Username / Email | Password |
|------|-------|----------|
| Admin | `admin` | `AdminPassword123!` |
| Customer | `testcustomer@example.com` | `TestPassword123!` |

> For local development only. Never use these in production.

---

## API Reference

All endpoints are prefixed with `/api/`.

### Products

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/products/` | Paginated product list (24/page) |
| GET | `/products/<slug>/` | Product detail |
| GET | `/categories/` | All categories |

**Filters for `/products/`:**

| Param | Example | Description |
|-------|---------|-------------|
| `category` | `?category=gold` | Filter by category slug |
| `metal_type` | `?metal_type=silver` | Filter by metal |
| `price_min` | `?price_min=100` | Min price |
| `price_max` | `?price_max=500` | Max price |
| `ordering` | `?ordering=-price` | Sort (price, -price, name, -created_at) |
| `search` | `?search=bangle` | Search name / description / SKU |
| `page` | `?page=2` | Page number |

### Auth

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/auth/register/` | Create account |
| POST | `/auth/login/` | Login — returns JWT tokens |
| GET/PUT | `/auth/profile/` | Get or update profile |

### Cart & Orders

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/cart/` | View cart |
| POST | `/cart/add/` | Add item |
| PATCH | `/cart/items/<id>/` | Update quantity |
| DELETE | `/cart/items/<id>/` | Remove item |
| POST | `/orders/place/` | Place order |
| GET | `/orders/` | Order history |

### Other

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/enquiries/` | Submit product/general enquiry |
| POST | `/appointments/` | Book an appointment |
| GET/POST | `/wishlist/` | View / toggle wishlist |
| POST | `/reviews/` | Submit a review |
| GET | `/gold-prices/` | Live gold prices (per gram) |
| POST | `/buyback/` | Sell gold / buyback request |
| POST | `/custom-orders/` | Bespoke jewellery commission |

---

## Running Tests

**API tests** (fast, ~5 seconds — backend must be running):

```bash
PLAYWRIGHT_PROJECT=api npx playwright test --project=api
```

**All tests** (requires both backend and frontend running):

```bash
npx playwright test
```

**Interactive UI mode:**

```bash
npx playwright test --ui
```

**View HTML report:**

```bash
npx playwright show-report
```

---

## Deployment

Designed to deploy on [Railway](https://railway.app). Set the following environment variables in production:

```env
SECRET_KEY=<strong-random-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=<postgres-connection-string>
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=Naresh Jewellers <noreply@yourdomain.com>
SHOP_EMAIL=info@yourdomain.com
```

Run on deployment:
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```
