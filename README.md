# Naresh Jewellers — Website

A modern e-commerce website for **Naresh Jewellers**, a physical jewellery store selling gold, silver, diamond, and South-East Asian style jewellery.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript (Vite) |
| Backend | Python / Django + Django REST Framework |
| Database | SQLite (dev) / PostgreSQL (production) |
| Styling | Tailwind CSS v4 |
| Testing | Playwright (API + E2E) |

---

## Project Structure

```
naresh-project/
├── backend/          # Django project
│   ├── config/       # Settings, URLs
│   ├── products/     # Products & Categories app
│   ├── core/         # Seed data management command
│   └── manage.py
├── frontend/         # React + TypeScript app
│   └── src/
│       ├── components/   # Header, Footer, ProductCard, etc.
│       ├── pages/        # Home, Shop, ProductDetail
│       ├── services/     # API calls (axios)
│       └── types/        # TypeScript interfaces
├── e2e/              # All tests (Playwright)
│   ├── api/          # API tests (no browser, fast)
│   ├── ui/           # E2E browser tests
│   └── fixtures/     # Shared auth helpers
├── playwright.config.ts
└── README.md
```

---

## Prerequisites

Make sure you have these installed:

- **Python 3.10+** — [python.org](https://www.python.org/downloads/)
- **Node.js 20+** — [nodejs.org](https://nodejs.org/)
- **Git** — [git-scm.com](https://git-scm.com/)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/antwan1/Naresh-Gold-Store.git
cd Naresh-Gold-Store
```

### 2. Backend setup

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create the backend `.env` file:

```bash
# Copy the example and edit it
cp .env.example backend/.env
```

The default `.env` works out of the box for local development (uses SQLite, no external services needed).

Run database migrations:

```bash
cd backend
py -3 manage.py migrate
```

Seed the database with test products and users:

```bash
py -3 manage.py seed_test_data
```

This creates:
- 4 categories: Gold, Silver, Diamond, South-East Asian
- 16 products (including some "Price on Request" items)
- Admin user: `admin@nareshjewellers.co.uk` / `AdminPassword123!`
- Test customer: `testcustomer@example.com` / `TestPassword123!`

### 3. Frontend setup

```bash
cd frontend
npm install
```

### 4. Install Playwright browsers (for testing)

```bash
# From project root
npx playwright install chromium
```

---

## Running the Project

You need **two terminals** running simultaneously.

**Terminal 1 — Backend (Django):**

```bash
cd backend
py -3 manage.py runserver
```

The API will be available at `http://localhost:8000`

**Terminal 2 — Frontend (React):**

```bash
cd frontend
npm run dev
```

The website will be available at `http://localhost:5173`

---

## Admin Panel

Visit `http://localhost:8000/admin` and log in with:

- **Email:** `admin@nareshjewellers.co.uk`
- **Password:** `AdminPassword123!`

From here you can add/edit/delete products, manage categories, and upload images.

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/products/` | List all products (paginated, 24/page) |
| GET | `/api/products/<slug>/` | Single product detail |
| GET | `/api/categories/` | List all categories |

**Query parameters for `/api/products/`:**

| Param | Example | Description |
|-------|---------|-------------|
| `category` | `?category=gold` | Filter by category slug |
| `metal_type` | `?metal_type=silver` | Filter by metal type |
| `price_min` | `?price_min=100` | Minimum price |
| `price_max` | `?price_max=500` | Maximum price |
| `is_featured` | `?is_featured=true` | Featured products only |
| `ordering` | `?ordering=price` | Sort (price, -price, name, -created_at) |
| `search` | `?search=bangle` | Search by name/description/SKU |
| `page` | `?page=2` | Pagination |

---

## Running Tests

Tests are written with Playwright. API tests run without a browser (fast), UI tests open a real browser.

**API tests only** (run these constantly during backend development — takes ~2 seconds):

```bash
# Backend must be running first (py -3 manage.py runserver)
PLAYWRIGHT_PROJECT=api npx playwright test --project=api
```

Or use the npm script:

```bash
npm run test:api
```

**All tests** (requires both backend and frontend running):

```bash
npx playwright test
```

**Interactive UI mode** (best for debugging):

```bash
npx playwright test --ui
```

**View HTML test report:**

```bash
npx playwright show-report
```

---

## Build Phases

The project is built in phases. Current status:

- [x] **Phase 1** — Foundation: Django backend, product catalogue, React frontend (Home, Shop, Product Detail pages)
- [ ] **Phase 2** — E-Commerce: Cart, checkout, Stripe + PayPal payments, customer accounts
- [ ] **Phase 3** — Communication: Enquiry forms, appointment booking, WhatsApp integration, email notifications
- [ ] **Phase 4** — Social & Trust: Reviews, wishlist, live gold/silver price ticker
- [ ] **Phase 5** — Internationalisation: English, Hindi, Punjabi language support

---

## Environment Variables

Copy `.env.example` to `backend/.env` and fill in values as needed:

```bash
# Required for all phases
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Phase 2 — Payments (use test keys)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Phase 3 — Email notifications
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Phase 3 — WhatsApp
WHATSAPP_NUMBER=44xxxxxxxxxx
```

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nareshjewellers.co.uk | AdminPassword123! |
| Customer | testcustomer@example.com | TestPassword123! |

> These are only for local development. **Never use these in production.**

---

## Deployment

The project is designed to deploy on [Railway](https://railway.app). See the full spec (`naresh-jewellers-spec.md`) for detailed deployment instructions.
