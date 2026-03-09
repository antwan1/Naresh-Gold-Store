# Naresh Jewellers — Website Project Spec (Beginner-Friendly)

> **For use with Claude Code** — feed this file as context when building the project.
> Run: `claude "Read naresh-jewellers-spec.md and start building Phase 1"`

---

## Project Overview

Build a modern e-commerce website for **Naresh Jewellers**, a physical jewelry store selling gold, silver, diamond/gemstone, and South-East Asian style jewelry. Keep it simple — admin manages products, customers browse and buy or send enquiries.

**This is a first project** — prioritise working software over perfection. Build in phases, get each phase working before moving on.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + TypeScript (Vite) | Type safety, better DX, catches bugs early |
| Backend | Python / Django + Django REST Framework | Batteries-included, great admin panel |
| Database | PostgreSQL | Industry standard SQL — great for learning |
| Payments | Stripe + PayPal | Phase 2 — don't worry about this initially |
| Styling | Tailwind CSS | Utility-first, fast to style |
| Auth | Django built-in auth (admin) + `djangorestframework-simplejwt` (customer API) |

---

## Branding & Design

### Logo
The provided logo says "NARESH JEWELLLERS" (3 L's — typo). **Fix spelling to "JEWELLERS" everywhere on the site.** The logo file itself will need to be corrected in Canva separately.

### Colours (extracted from logo)
| Name | Hex | Usage |
|------|-----|-------|
| Navy Blue | `#1A1F3A` | Primary background, header, footer |
| Deep Navy | `#0F1328` | Darker variant, overlays, hero sections |
| Gold | `#C9A84C` | Primary accents, CTA buttons, highlights, borders, icons |
| Light Gold | `#D4B96B` | Hover states, secondary accents, subtle borders |
| Pale Gold | `#E8D5A3` | Decorative elements, light gold tints |
| Cream/Off-White | `#FAF9F6` | Page backgrounds, card backgrounds |
| Warm White | `#F5F0E8` | Alternating section backgrounds (warmer than cream) |
| White | `#FFFFFF` | Text on dark backgrounds, clean sections |
| Charcoal | `#2C2C2C` | Body text on light backgrounds |
| Medium Grey | `#6B7280` | Secondary text, captions, metadata |
| Light Grey | `#E5E7EB` | Borders, dividers, input borders |
| Success | `#16A34A` | In-stock indicators, success messages |
| Error | `#DC2626` | Validation errors, out-of-stock |

### Typography
- **Display / Hero**: Playfair Display (serif) — for hero headings and large feature text only
- **Headings**: Cormorant Garamond (serif) — elegant, lighter weight than Playfair, use for section headings and product names
- **Body**: Lato (sans-serif) — clean, highly readable at small sizes
- **UI / Buttons / Labels**: Lato Semi-Bold — for navigation, buttons, and form labels
- Import all from Google Fonts

### Tailwind Config
```typescript
// tailwind.config.ts — custom brand tokens
export default {
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1A1F3A', dark: '#0F1328' },
        gold: { DEFAULT: '#C9A84C', light: '#D4B96B', pale: '#E8D5A3' },
        cream: '#FAF9F6',
        'warm-white': '#F5F0E8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Lato', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(26, 31, 58, 0.08)',
        'card-hover': '0 8px 30px rgba(26, 31, 58, 0.12)',
        'gold-glow': '0 0 20px rgba(201, 168, 76, 0.15)',
      },
    },
  },
}
```

### Design Tone: "Refined Luxury"
The site should feel like walking into a high-end jewellery boutique — not loud or flashy, but quietly luxurious. Think Tiffany & Co. meets a warm South-Asian jewellery store.

**Key principles:**
- **Generous whitespace** — let the jewellery breathe, don't cram
- **Photography-first** — large, beautiful product images are the hero, not text
- **Subtle gold accents** — thin gold borders, gold icons, gold hover effects — never garish
- **Smooth micro-interactions** — gentle hover lifts on cards, smooth fade-ins on scroll, subtle shimmer on gold elements
- **Dark sections for contrast** — alternate cream/white sections with navy sections to create visual rhythm
- **Ornamental touches** — thin gold divider lines, subtle corner flourishes inspired by the logo's decorative frame

---

## UI/UX Design — Page by Page

### Global Elements

#### Header
- **Sticky**, slim, navy background with gold logo and white nav text
- Desktop: Logo left | Nav centre (Home, Shop, About, Contact, Appointments) | Icons right (search, wishlist heart, cart with badge, account)
- Mobile: Logo left | Hamburger right → full-screen navy overlay menu with gold accent links
- Gold price ticker sits ABOVE the header as a slim bar (navy-dark background, gold text, scrolling ticker style)
- Active nav link has a thin gold underline
- On scroll: header gets a subtle `backdrop-blur` + slight shadow

#### Footer
- Full-width navy-dark background
- 4 columns: About (store blurb + logo), Quick Links, Contact Info (address, phone, email, hours), Newsletter signup
- Thin gold divider line at top
- Social media icons in gold
- Copyright at bottom in medium grey
- Decorative gold corner flourishes from the logo's style (subtle, small)

#### WhatsApp Button
- Fixed bottom-right, green WhatsApp icon on a navy circular button with gold border
- Gentle pulse animation on first load to draw attention
- Hover: slight scale-up

---

### Home Page

**Layout — full narrative flow, not a generic template:**

1. **Hero Section** (full viewport height)
   - Full-bleed background: deep navy with a subtle radial gradient towards centre
   - Large hero image of a signature jewellery piece (or the logo with ornamental frame)
   - Playfair Display heading: "Exquisite Jewellery, Crafted with Love"
   - Subheading in Lato: "Gold, Silver & Diamond Collections — Handcrafted in the South-East Asian Tradition"
   - Gold CTA button: "Explore Our Collection"
   - Subtle downward scroll indicator (animated gold chevron)

2. **Categories Showcase** (cream background)
   - Section heading with gold divider line above and below
   - 4 cards in a row (Gold | Silver | Diamond | South-East Asian)
   - Each card: large square image, category name overlaid at bottom with a dark gradient, hover effect lifts card with gold border glow
   - Staggered fade-in animation on scroll

3. **Featured Products** (white background)
   - "Featured Pieces" heading
   - 4-column grid of ProductCards (2 columns on mobile)
   - "View All" gold-outlined button below

4. **Store Story / About Strip** (navy background, white text)
   - Split layout: image of the store (or craftwork) on left, text on right
   - Short paragraph about Naresh Jewellers' heritage
   - Gold "Learn More" link

5. **Testimonials** (warm-white background)
   - Carousel or 3-column grid
   - Each: gold star rating, quote in italics (Cormorant Garamond), customer name, "Verified Buyer" badge
   - Decorative gold quotation marks

6. **Store Visit CTA** (full-width, navy overlay on background image of the store)
   - "Visit Our Store" heading
   - Address, opening hours
   - Gold "Book an Appointment" button + "Get Directions" outlined button

---

### Shop Page

**Layout:**
- Cream background
- Left sidebar (desktop) with filters, right content area with product grid
- Mobile: filters collapse into a "Filters" button that opens a slide-in drawer from left

**Filters sidebar:**
- Category checkboxes (with product count)
- Metal Type checkboxes
- Price range slider (min-max)
- Sort dropdown (Price Low-High, Price High-Low, Newest, Popular)
- "Clear Filters" link
- Each filter section has a thin gold divider

**Product Grid:**
- 3 columns desktop, 2 tablet, 1-2 mobile
- Product count shown: "Showing 24 of 87 products"
- Pagination at bottom (numbered, not infinite scroll)

**ProductCard Design:**
- White card with subtle shadow (`shadow-card`)
- Product image fills top 65% of card (object-fit: cover, aspect-ratio: 3/4)
- Hover: image zooms slightly (scale 1.05), card lifts with `shadow-card-hover`, thin gold border appears
- Wishlist heart icon top-right of image (outline when not saved, filled gold when saved)
- Below image: product name (Cormorant Garamond, 1 line, truncate), metal type badge (small, gold-outlined pill), price in bold OR "Price on Request" in italic gold
- "Quick View" overlay on image hover (semi-transparent navy) — optional nice-to-have

---

### Product Detail Page

**Layout:**
- Two-column: image gallery left (55%), product info right (45%)
- Mobile: stacks — images on top, info below

**Image Gallery:**
- Large main image (aspect-ratio: 1/1, rounded corners, subtle shadow)
- Thumbnail row below main image (4-5 thumbs, click to swap main)
- Main image supports click-to-zoom (lightbox overlay)
- Subtle gold border on selected thumbnail

**Product Info Panel:**
- Product name (Cormorant Garamond, large)
- Star rating + review count link (e.g. "★★★★☆ (23 reviews)")
- Price large and bold, OR "Price on Request" in gold italic
- Thin gold divider
- Metal type, weight, purity in a small specs grid (2-column: label | value)
- Description paragraph (Lato, regular weight, medium grey)
- Thin gold divider
- Quantity selector (- / number / +) + "Add to Cart" gold button (full width)
- "Send Enquiry" navy-outlined button below (full width)
- Wishlist heart link: "Add to Wishlist"
- SKU shown small at bottom in grey

**Below the fold:**
- Tabbed section: "Reviews" | "Shipping & Returns" | "Enquire"
- Related products carousel: "You May Also Like" — horizontal scroll of ProductCards

---

### Cart Page

- Clean, minimal layout on cream background
- Table-style layout (desktop): Image | Name + specs | Quantity (- / num / +) | Price | Remove (×)
- Mobile: card-style stack per item
- Right sidebar (desktop) or bottom section (mobile): Order Summary — subtotal, estimated shipping, total, "Proceed to Checkout" gold button
- Empty state: illustration or icon, "Your cart is empty", "Continue Shopping" button
- "Continue Shopping" link at top

---

### Checkout Page

- Two-column: form left (65%), order summary right (35%)
- Mobile: order summary collapses into an expandable accordion at top
- Step progress: Shipping → Payment → Confirmation (horizontal step indicator with gold active dot)
- Shipping form: clean inputs with gold focus-border, clear labels
- Payment: tab-style toggle between "Card" (Stripe Elements) and "PayPal"
- Stripe Elements: styled to match brand (navy text, gold focus border)
- "Place Order" button: large, gold, prominent
- Order summary sidebar: line items with small images, quantities, subtotal, tax, total

---

### Contact / Enquiry Page

- Split layout: form left, store info + map right
- Form fields: name, email, phone, subject dropdown, message textarea
- Navy section with embedded Google Map (full width, ~300px height)
- Store info card overlaying the map (white card, positioned bottom-left): address, phone, email, hours
- If arriving from a product enquiry: the product name and image show at the top of the form as context

---

### Appointment Booking Page

- Clean, single-column centered form (max-width: 600px)
- Heading: "Book a Visit" with gold divider
- Date picker: calendar-style, gold highlight on selected date, grey out past dates
- Time slots: grid of pill-shaped buttons (e.g. "10:00", "10:30"), gold fill on selected
- Purpose: dropdown or radio buttons with icons
- Contact details: name, email, phone
- "Book Appointment" gold button
- Confirmation state: green checkmark, details summary, "You'll receive a confirmation email"

---

### Account Pages

- Left sidebar nav (desktop): Profile, Orders, Wishlist, Reviews, Logout
- Mobile: top horizontal tab bar

**Orders:** Table with order number, date, status badge (colour-coded pill), total, "View Details" link
**Wishlist:** ProductCard grid with "Move to Cart" and "Remove" actions
**Profile:** Simple form — name, email, phone, address, "Save Changes" button

---

### Component Styling Reference

**Buttons:**
- Primary (gold): `bg-gold text-navy-dark font-semibold px-6 py-3 rounded hover:bg-gold-light transition`
- Secondary (outlined): `border-2 border-navy text-navy font-semibold px-6 py-3 rounded hover:bg-navy hover:text-white transition`
- Ghost (text): `text-gold font-semibold hover:underline`

**Inputs:**
- `border border-light-grey rounded px-4 py-3 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition`
- Labels: Lato semi-bold, charcoal, small margin-bottom

**Badges / Pills:**
- Metal type: `border border-gold text-gold text-xs px-2 py-0.5 rounded-full`
- Status: colour-coded (green for confirmed, amber for pending, grey for cancelled)

**Cards:**
- `bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300`

**Gold Dividers:**
- `<div class="w-16 h-0.5 bg-gold mx-auto my-8"></div>` — centred short accent line
- Used between section headings and content

**Scroll Animations (use sparingly):**
- Fade-in on scroll (IntersectionObserver or a lightweight library)
- Staggered card entrance (delay each card by 100ms)
- Gold shimmer on hover (CSS `background-position` animation on a gradient)

---

## Supported Languages (Phase 5 — do last)

Eventually support 3 languages with a header switcher:
1. **English** (default)
2. **Hindi** (हिन्दी)
3. **Punjabi** (ਪੰਜਾਬੀ)

**For now**: Build everything in English first. Structure translatable text with i18next from the start so adding languages later is easy, but don't worry about translations until Phase 5.

---

## Phase 1 — Foundation (Start Here)

**Goal**: Django backend + React frontend talking to each other, products displaying on screen.

### Backend Setup
1. Create Django project: `naresh_jewellers`
2. Install: `djangorestframework`, `django-cors-headers`, `psycopg2-binary`, `Pillow`, `django-filter`
3. Configure PostgreSQL database
4. Create these Django apps:

#### `products` app — Models:
```python
Category:
  - name (CharField)
  - slug (SlugField, auto-generated)
  - description (TextField, blank)
  - image (ImageField, blank)
  - is_active (BooleanField, default=True)

Product:
  - name (CharField)
  - slug (SlugField, auto-generated)
  - description (TextField)
  - category (ForeignKey → Category)
  - metal_type (CharField, choices: gold/silver/diamond/platinum/other)
  - weight_grams (DecimalField)
  - purity (CharField, e.g. "22K", "925 Sterling")
  - price (DecimalField)
  - is_price_on_request (BooleanField, default=False)
  - sku (CharField, unique)
  - stock_quantity (PositiveIntegerField)
  - is_featured (BooleanField, default=False)
  - is_active (BooleanField, default=True)
  - created_at (DateTimeField, auto)
  - updated_at (DateTimeField, auto)

ProductImage:
  - product (ForeignKey → Product)
  - image (ImageField)
  - alt_text (CharField, blank)
  - is_primary (BooleanField, default=False)
  - sort_order (PositiveIntegerField, default=0)
```

#### API Endpoints (Phase 1):
- `GET /api/products/` — List products (filterable by category, metal_type, price range)
- `GET /api/products/<slug>/` — Product detail (includes images)
- `GET /api/categories/` — List categories

#### Admin Panel:
- Register all models in Django admin
- Install `django-jazzmin` for a nicer admin UI
- Admin should be able to add/edit/delete products, upload images, manage categories

### Frontend Setup
1. Create React + TypeScript app with Vite: `npm create vite@latest frontend -- --template react-ts`
2. Install: `tailwindcss`, `react-router-dom`, `axios`
3. Set up Tailwind with the brand colours in `tailwind.config.ts`

#### Pages to build (Phase 1):
- **Home Page**: Hero banner, featured products grid, categories showcase
- **Shop Page**: Product grid with filters (category, metal type) and sort options
- **Product Detail Page**: Image gallery, product info, price (or "Price on Request")
- **Basic Layout**: Header with nav (logo, links), footer with store info

#### Components to build:
- `Header` — Logo, navigation links, (placeholder for cart icon and language switcher)
- `Footer` — Store name, address, phone, basic links
- `ProductCard` — Image, name, price, "View" link
- `ProductGrid` — Grid of ProductCards with loading state
- `CategoryCard` — Category image and name
- `HeroSection` — Full-width banner with call-to-action

---

## Phase 2 — E-Commerce (Cart + Checkout + Payments)

**Goal**: Customers can add items to cart and pay.

### Backend additions:
```python
# customers app
Customer:
  - user (OneToOneField → Django User)
  - phone (CharField)
  - address_line1, address_line2, city, postcode (CharFields)

# orders app
Cart / CartItem:
  - session-based for guests, DB-based for logged-in users

Order:
  - customer (ForeignKey)
  - status (choices: pending/confirmed/shipped/delivered/cancelled)
  - total_amount, tax_amount (DecimalFields)
  - payment_method (CharField: stripe/paypal)
  - payment_id (CharField — Stripe/PayPal reference)
  - shipping address fields
  - created_at

OrderItem:
  - order (ForeignKey)
  - product (ForeignKey)
  - quantity, unit_price, total_price
```

### New API Endpoints:
- `POST /api/auth/register/` + `POST /api/auth/login/` (JWT)
- Cart CRUD: `GET/POST/PUT/DELETE /api/cart/`
- `POST /api/orders/` — Place order
- `GET /api/orders/` — Order history
- `POST /api/payments/stripe/create-intent/`
- `POST /api/payments/paypal/create-order/`

### Frontend additions:
- Customer registration + login pages
- Cart page (add/remove items, update quantities)
- Checkout page (address form → payment selection → confirm)
- Stripe Elements integration (card form)
- PayPal button integration
- Order confirmation page
- Account page with order history

### Payment Setup:
- **Stripe**: Use test/sandbox keys. Stripe Elements for card input. PaymentIntent flow.
- **PayPal**: Use sandbox. PayPal JS SDK buttons.
- Both configured via environment variables — never hardcode keys.

---

## Phase 3 — Communication (Enquiries, Appointments, WhatsApp)

**Goal**: Customers can contact the store and book appointments.

### Backend additions:
```python
# enquiries app
Enquiry:
  - name, email, phone, message (CharFields/TextField)
  - product (ForeignKey, nullable — for product-specific enquiries)
  - status (choices: new/responded/resolved)
  - created_at

Appointment:
  - name, email, phone
  - date (DateField)
  - time_slot (CharField, e.g. "10:00")
  - purpose (CharField, choices: consultation/repair/valuation/general)
  - status (choices: pending/confirmed/cancelled)
  - created_at
```

### Frontend additions:
- **Contact/Enquiry page**: Form with name, email, phone, message. Product enquiry auto-fills product info.
- **Appointment booking page**: Date picker, time slot selection, purpose dropdown
- **WhatsApp floating button**: Bottom-right corner, links to `https://wa.me/<number>?text=Hi,%20I'm%20interested%20in%20Naresh%20Jewellers%20products!`
- **Store info section**: Address, phone, email, opening hours, embedded Google Map
- **"Send Enquiry" button** on product detail page (alongside "Add to Cart")

### Email Notifications (use Django email backend):
- Order confirmation → customer
- New order alert → admin
- Enquiry received → admin
- Appointment booked → customer + admin

---

## Phase 4 — Social & Trust (Reviews, Wishlist, Gold Prices)

**Goal**: Build customer trust and engagement.

### Backend additions:
```python
# reviews app
Review:
  - product (ForeignKey)
  - customer (ForeignKey)
  - rating (IntegerField, 1-5)
  - title, text (CharField/TextField)
  - is_verified_purchase (BooleanField)
  - is_approved (BooleanField, default=False)
  - admin_reply (TextField, blank)
  - created_at

# wishlist app
WishlistItem:
  - customer (ForeignKey)
  - product (ForeignKey)
  - created_at
```

### Frontend additions:
- **Reviews section** on product detail page (star rating, text, verified badge)
- **Leave a review** form (only for logged-in customers who bought the product)
- **Wishlist**: Heart icon on product cards, "My Wishlist" account page
- **Gold/Silver price ticker**: Slim bar at top of page showing live prices in £
  - Source from a free metals API (e.g. GoldAPI.io)
  - Refresh every 15 minutes
  - Show 24K, 22K, 18K gold and silver per gram

### Admin additions:
- Moderate reviews (approve/reject)
- Reply to reviews
- View wishlist analytics (optional)

---

## Phase 5 — Internationalisation & Polish

**Goal**: Add Hindi and Punjabi, polish the whole site.

- Set up `react-i18next` with translation JSON files for EN, HI, PA
- Add language switcher dropdown in header
- Translate all static UI text
- Add translatable fields to Product model (`name_hi`, `name_pa`, `description_hi`, `description_pa`) — or use a JSON field approach
- SEO: meta tags, Open Graph, JSON-LD structured data for products
- Performance: image optimisation (WebP), lazy loading, caching
- Accessibility: alt text, keyboard navigation, ARIA labels
- Admin dashboard stats: total orders, revenue, low stock alerts

---

## Project Structure

```
naresh-jewellers/
├── backend/
│   ├── manage.py
│   ├── config/              # Django settings, urls, wsgi
│   │   ├── settings.py
│   │   └── urls.py
│   ├── products/            # Product & Category models, serializers, views
│   ├── orders/              # Cart, Order models
│   ├── customers/           # Auth, profile
│   ├── enquiries/           # Enquiry & Appointment
│   ├── reviews/             # Reviews
│   ├── payments/            # Stripe & PayPal
│   ├── wishlist/            # Wishlist
│   ├── core/                # Store settings, gold price utility, seed_test_data command
│   ├── media/               # Uploaded images (gitignored)
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI (Header, Footer, ProductCard, etc.)
│   │   ├── pages/           # Page components (Home, Shop, ProductDetail, etc.)
│   │   ├── services/        # API calls (api.ts using axios)
│   │   ├── context/         # React context (AuthContext, CartContext)
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript interfaces & types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── e2e/                     # ALL tests live here (Playwright)
│   ├── api/                 # API tests (no browser, fast)
│   │   ├── products.api.spec.ts
│   │   ├── auth.api.spec.ts
│   │   ├── cart.api.spec.ts
│   │   ├── orders.api.spec.ts
│   │   ├── enquiries.api.spec.ts
│   │   ├── appointments.api.spec.ts
│   │   ├── reviews.api.spec.ts
│   │   └── wishlist.api.spec.ts
│   ├── ui/                  # E2E browser tests (full user journeys)
│   │   ├── product-browsing.spec.ts
│   │   ├── cart-and-checkout.spec.ts
│   │   ├── enquiry.spec.ts
│   │   ├── appointment.spec.ts
│   │   ├── auth.spec.ts
│   │   ├── wishlist.spec.ts
│   │   ├── reviews.spec.ts
│   │   └── responsive.spec.ts
│   ├── fixtures/            # Shared helpers
│   │   ├── auth.fixture.ts
│   │   └── test-data.ts
│   └── pages/               # Page Object Models (for UI tests)
│       ├── home.page.ts
│       ├── shop.page.ts
│       ├── product-detail.page.ts
│       ├── cart.page.ts
│       ├── checkout.page.ts
│       └── account.page.ts
│
├── playwright.config.ts     # Playwright config (project root)
├── .github/
│   └── workflows/
│       └── test.yml         # CI/CD — runs all tests on push
├── .env
├── .env.example
└── README.md
```

---

## Testing Strategy

**Everything is Playwright.** API tests and E2E browser tests — one framework, one runner, one config. No pytest, no Vitest, no context switching.

### Why all-Playwright?
- **One framework to learn** — you're a QA engineer, Playwright is the industry standard
- **API tests use `request` context** — no browser, runs in milliseconds
- **E2E tests use `page` context** — real browser, real user journeys
- **Same assertions, config, fixtures, and CI pipeline for everything**
- **API tests run first** — if your backend is broken, you find out fast before slower browser tests even start

### Install (from project root)
```bash
npm init -y
npm install -D @playwright/test @axe-core/playwright
npx playwright install --with-deps chromium firefox webkit
```

### Playwright Config
```typescript
// playwright.config.ts (project root)
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  projects: [
    // ── API tests: no browser, fast, run first ──
    {
      name: 'api',
      testDir: './e2e/api',
      use: { baseURL: 'http://localhost:8000' },
    },

    // ── UI E2E tests: run after API tests pass ──
    {
      name: 'chromium',
      testDir: './e2e/ui',
      dependencies: ['api'],
      use: {
        baseURL: 'http://localhost:5173',
        ...devices['Desktop Chrome'],
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'firefox',
      testDir: './e2e/ui',
      dependencies: ['api'],
      use: {
        baseURL: 'http://localhost:5173',
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'mobile-chrome',
      testDir: './e2e/ui',
      dependencies: ['api'],
      use: {
        baseURL: 'http://localhost:5173',
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      testDir: './e2e/ui',
      dependencies: ['api'],
      use: {
        baseURL: 'http://localhost:5173',
        ...devices['iPhone 13'],
      },
    },
  ],

  // Auto-start both servers before tests
  webServer: [
    {
      command: 'cd backend && python manage.py runserver 8000',
      port: 8000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'cd frontend && npm run dev',
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
```

**Key design:** `dependencies: ['api']` means all browser projects wait for API tests to pass first. If your backend is broken, you get fast failures in seconds before browser tests even launch.

---

### Auth Fixture (shared by API + UI tests)

```typescript
// e2e/fixtures/auth.fixture.ts
import { test as base, APIRequestContext } from '@playwright/test'

export const TEST_CUSTOMER = {
  email: 'testcustomer@example.com',
  password: 'TestPassword123!',
}

export const TEST_ADMIN = {
  email: 'admin@nareshjewellers.co.uk',
  password: 'AdminPassword123!',
}

type AuthFixtures = {
  api: APIRequestContext        // unauthenticated API context
  authedApi: APIRequestContext  // pre-authenticated with JWT
}

export const test = base.extend<AuthFixtures>({
  api: async ({ playwright }, use) => {
    const ctx = await playwright.request.newContext({
      baseURL: 'http://localhost:8000',
    })
    await use(ctx)
    await ctx.dispose()
  },

  authedApi: async ({ playwright }, use) => {
    // Get JWT token
    const tmp = await playwright.request.newContext({
      baseURL: 'http://localhost:8000',
    })
    const res = await tmp.post('/api/auth/login/', { data: TEST_CUSTOMER })
    const { access } = await res.json()
    await tmp.dispose()

    // Create authenticated context with Bearer token
    const ctx = await playwright.request.newContext({
      baseURL: 'http://localhost:8000',
      extraHTTPHeaders: { Authorization: `Bearer ${access}` },
    })
    await use(ctx)
    await ctx.dispose()
  },
})

export { expect } from '@playwright/test'
```

---

### API Tests (no browser — fast)

These hit your Django REST API directly using Playwright's `request` context. No browser launches, so each test runs in milliseconds.

#### Phase 1 — Products & Categories
```typescript
// e2e/api/products.api.spec.ts
import { test, expect } from '../fixtures/auth.fixture'

test.describe('Products API', () => {
  test('GET /api/products/ — returns paginated list', async ({ api }) => {
    const res = await api.get('/api/products/')
    expect(res.ok()).toBeTruthy()

    const data = await res.json()
    expect(data.results).toBeInstanceOf(Array)
    expect(data.results.length).toBeGreaterThan(0)

    // Verify response shape matches our TypeScript types
    const product = data.results[0]
    expect(product).toHaveProperty('id')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('slug')
    expect(product).toHaveProperty('price')
    expect(product).toHaveProperty('metal_type')
    expect(product).toHaveProperty('images')
  })

  test('filters by category', async ({ api }) => {
    const res = await api.get('/api/products/?category=gold')
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    for (const product of data.results) {
      expect(product.category.slug).toBe('gold')
    }
  })

  test('filters by metal type', async ({ api }) => {
    const res = await api.get('/api/products/?metal_type=silver')
    expect(res.ok()).toBeTruthy()
    for (const p of (await res.json()).results) {
      expect(p.metal_type).toBe('silver')
    }
  })

  test('filters by price range', async ({ api }) => {
    const res = await api.get('/api/products/?price_min=100&price_max=500')
    expect(res.ok()).toBeTruthy()
    for (const p of (await res.json()).results) {
      const price = parseFloat(p.price)
      expect(price).toBeGreaterThanOrEqual(100)
      expect(price).toBeLessThanOrEqual(500)
    }
  })

  test('sorts by price ascending', async ({ api }) => {
    const res = await api.get('/api/products/?ordering=price')
    const prices = (await res.json()).results.map((p: any) => parseFloat(p.price))
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  test('excludes inactive products', async ({ api }) => {
    const data = await (await api.get('/api/products/')).json()
    for (const p of data.results) {
      expect(p.is_active).toBe(true)
    }
  })

  test('GET /api/products/:slug/ — returns detail with images', async ({ api }) => {
    const slug = (await (await api.get('/api/products/')).json()).results[0].slug
    const res = await api.get(`/api/products/${slug}/`)
    expect(res.ok()).toBeTruthy()
    const product = await res.json()
    expect(product.slug).toBe(slug)
    expect(product.images).toBeInstanceOf(Array)
    expect(product.description).toBeTruthy()
  })

  test('GET /api/products/:slug/ — 404 for non-existent', async ({ api }) => {
    expect((await api.get('/api/products/does-not-exist-99999/')).status()).toBe(404)
  })

  test('GET /api/categories/ — returns list', async ({ api }) => {
    const res = await api.get('/api/categories/')
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('slug')
  })
})
```

#### Phase 2 — Auth, Cart, Orders
```typescript
// e2e/api/auth.api.spec.ts
import { test, expect, TEST_CUSTOMER } from '../fixtures/auth.fixture'

test.describe('Auth API', () => {
  test('register — creates account and returns tokens', async ({ api }) => {
    const res = await api.post('/api/auth/register/', {
      data: {
        email: `user_${Date.now()}@example.com`,
        password: 'SecurePass123!',
        first_name: 'Test',
        last_name: 'User',
        phone: '07700900000',
      },
    })
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data).toHaveProperty('access')
    expect(data).toHaveProperty('refresh')
  })

  test('login — returns JWT tokens', async ({ api }) => {
    const res = await api.post('/api/auth/login/', { data: TEST_CUSTOMER })
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.access).toBeTruthy()
    expect(data.refresh).toBeTruthy()
  })

  test('login — rejects bad credentials', async ({ api }) => {
    const res = await api.post('/api/auth/login/', {
      data: { email: 'wrong@example.com', password: 'wrong' },
    })
    expect(res.status()).toBe(401)
  })

  test('profile — 401 without token', async ({ api }) => {
    expect((await api.get('/api/auth/profile/')).status()).toBe(401)
  })

  test('profile — returns data with token', async ({ authedApi }) => {
    const res = await authedApi.get('/api/auth/profile/')
    expect(res.ok()).toBeTruthy()
    expect((await res.json()).email).toBe(TEST_CUSTOMER.email)
  })
})

// e2e/api/cart.api.spec.ts
import { test, expect } from '../fixtures/auth.fixture'

test.describe('Cart API', () => {
  test('add item to cart', async ({ authedApi, api }) => {
    const product = (await (await api.get('/api/products/')).json()).results[0]
    const res = await authedApi.post('/api/cart/', {
      data: { product: product.id, quantity: 1 },
    })
    expect(res.ok()).toBeTruthy()
  })

  test('get cart — returns items and total', async ({ authedApi }) => {
    const res = await authedApi.get('/api/cart/')
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data).toHaveProperty('items')
    expect(data).toHaveProperty('total')
  })

  test('update quantity', async ({ authedApi }) => {
    const cart = await (await authedApi.get('/api/cart/')).json()
    if (cart.items.length > 0) {
      const res = await authedApi.put(`/api/cart/${cart.items[0].id}/`, {
        data: { quantity: 3 },
      })
      expect(res.ok()).toBeTruthy()
      expect((await res.json()).quantity).toBe(3)
    }
  })

  test('remove item', async ({ authedApi }) => {
    const cart = await (await authedApi.get('/api/cart/')).json()
    if (cart.items.length > 0) {
      expect((await authedApi.delete(`/api/cart/${cart.items[0].id}/`)).status()).toBe(204)
    }
  })

  test('401 without auth', async ({ api }) => {
    expect((await api.post('/api/cart/', { data: { product: 1, quantity: 1 } })).status()).toBe(401)
  })
})

// e2e/api/orders.api.spec.ts
import { test, expect } from '../fixtures/auth.fixture'

test.describe('Orders API', () => {
  test('place order from cart', async ({ authedApi, api }) => {
    // Add item to cart
    const product = (await (await api.get('/api/products/')).json()).results[0]
    await authedApi.post('/api/cart/', { data: { product: product.id, quantity: 1 } })

    const res = await authedApi.post('/api/orders/', {
      data: {
        shipping_address_line1: '123 Test Street',
        shipping_city: 'London',
        shipping_postcode: 'SW1A 1AA',
        payment_method: 'stripe',
      },
    })
    expect(res.ok()).toBeTruthy()
    const order = await res.json()
    expect(order).toHaveProperty('id')
    expect(order.status).toBe('pending')
  })

  test('get order history', async ({ authedApi }) => {
    const res = await authedApi.get('/api/orders/')
    expect(res.ok()).toBeTruthy()
    expect(await res.json()).toBeInstanceOf(Array)
  })

  test('401 without auth', async ({ api }) => {
    expect((await api.get('/api/orders/')).status()).toBe(401)
  })
})
```

#### Phase 3 — Enquiries & Appointments
```typescript
// e2e/api/enquiries.api.spec.ts
import { test, expect } from '../fixtures/auth.fixture'

test.describe('Enquiries API', () => {
  test('submit general enquiry', async ({ api }) => {
    const res = await api.post('/api/enquiries/', {
      data: {
        name: 'Test Customer', email: 'test@example.com',
        phone: '07700900000', message: 'Interested in gold bangles.',
      },
    })
    expect(res.status()).toBe(201)
  })

  test('submit product-specific enquiry', async ({ api }) => {
    const productId = (await (await api.get('/api/products/')).json()).results[0].id
    const res = await api.post('/api/enquiries/', {
      data: {
        name: 'Test Customer', email: 'test@example.com',
        phone: '07700900000', message: 'What is the delivery time?',
        product: productId,
      },
    })
    expect(res.status()).toBe(201)
  })

  test('400 on missing required fields', async ({ api }) => {
    expect((await api.post('/api/enquiries/', { data: { name: 'Test' } })).status()).toBe(400)
  })
})

// e2e/api/appointments.api.spec.ts
import { test, expect } from '../fixtures/auth.fixture'

test.describe('Appointments API', () => {
  test('book appointment', async ({ api }) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    const res = await api.post('/api/appointments/', {
      data: {
        name: 'Test Customer', email: 'test@example.com',
        phone: '07700900000', date: futureDate.toISOString().split('T')[0],
        time_slot: '11:00', purpose: 'consultation',
      },
    })
    expect(res.status()).toBe(201)
  })

  test('rejects past dates', async ({ api }) => {
    const res = await api.post('/api/appointments/', {
      data: {
        name: 'Test', email: 'test@example.com', phone: '07700900000',
        date: '2020-01-01', time_slot: '10:00', purpose: 'consultation',
      },
    })
    expect(res.status()).toBe(400)
  })
})
```

#### Phase 4 — Reviews & Wishlist
```typescript
// e2e/api/reviews.api.spec.ts
import { test, expect } from '../fixtures/auth.fixture'

test.describe('Reviews API', () => {
  test('public endpoint only returns approved reviews', async ({ api }) => {
    const productId = (await (await api.get('/api/products/')).json()).results[0].id
    const reviews = await (await api.get(`/api/reviews/${productId}/`)).json()
    for (const r of reviews) { expect(r.is_approved).toBe(true) }
  })

  test('401 without auth', async ({ api }) => {
    expect((await api.post('/api/reviews/', {
      data: { product: 1, rating: 5, title: 'Great', text: 'Loved it' },
    })).status()).toBe(401)
  })

  test('rejects invalid rating (>5)', async ({ authedApi }) => {
    expect((await authedApi.post('/api/reviews/', {
      data: { product: 1, rating: 6, title: 'Test', text: 'Test' },
    })).ok()).toBeFalsy()
  })
})

// e2e/api/wishlist.api.spec.ts
import { test, expect } from '../fixtures/auth.fixture'

test.describe('Wishlist API', () => {
  test('full CRUD flow', async ({ authedApi, api }) => {
    const productId = (await (await api.get('/api/products/')).json()).results[0].id

    // Add
    expect((await authedApi.post('/api/wishlist/', { data: { product: productId } })).ok()).toBeTruthy()
    // List
    const items = await (await authedApi.get('/api/wishlist/')).json()
    expect(items.length).toBeGreaterThan(0)
    // Remove
    expect((await authedApi.delete(`/api/wishlist/${items[0].id}/`)).status()).toBe(204)
  })

  test('401 without auth', async ({ api }) => {
    expect((await api.post('/api/wishlist/', { data: { product: 1 } })).status()).toBe(401)
  })

  test('rejects duplicate', async ({ authedApi, api }) => {
    const productId = (await (await api.get('/api/products/')).json()).results[0].id
    await authedApi.post('/api/wishlist/', { data: { product: productId } })
    expect((await authedApi.post('/api/wishlist/', { data: { product: productId } })).ok()).toBeFalsy()
  })
})
```

---

### E2E Browser Tests (full user journeys)

These launch a real browser and test the complete flow. **Every UI test goes through a Page Object Model — zero raw locators in spec files.**

#### Page Object Models — All Pages

```typescript
// e2e/pages/base.page.ts — shared elements (header, footer, nav)
import { Page, Locator } from '@playwright/test'

export class BasePage {
  readonly page: Page
  readonly header: Locator
  readonly cartCount: Locator
  readonly mobileMenuBtn: Locator
  readonly mobileNav: Locator
  readonly desktopNav: Locator
  readonly whatsappBtn: Locator
  readonly goldTicker: Locator
  readonly languageSwitcher: Locator

  constructor(page: Page) {
    this.page = page
    this.header = page.locator('[data-testid="header"]')
    this.cartCount = page.locator('[data-testid="cart-count"]')
    this.mobileMenuBtn = page.locator('[data-testid="mobile-menu-btn"]')
    this.mobileNav = page.locator('[data-testid="mobile-nav"]')
    this.desktopNav = page.locator('[data-testid="desktop-nav"]')
    this.whatsappBtn = page.locator('[data-testid="whatsapp-btn"]')
    this.goldTicker = page.locator('[data-testid="gold-price-ticker"]')
    this.languageSwitcher = page.locator('[data-testid="language-switcher"]')
  }

  async openMobileMenu() { await this.mobileMenuBtn.click() }
  async getCartCount(): Promise<string> { return await this.cartCount.innerText() }
  async navigateTo(link: string) { await this.page.locator(`[data-testid="nav-${link}"]`).click() }
}
```

```typescript
// e2e/pages/home.page.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class HomePage extends BasePage {
  readonly heroSection: Locator
  readonly featuredProducts: Locator
  readonly categoryShowcase: Locator
  readonly testimonials: Locator
  readonly heroCtaBtn: Locator

  constructor(page: Page) {
    super(page)
    this.heroSection = page.locator('[data-testid="hero-section"]')
    this.featuredProducts = page.locator('[data-testid="featured-products"]')
    this.categoryShowcase = page.locator('[data-testid="category-showcase"]')
    this.testimonials = page.locator('[data-testid="testimonials"]')
    this.heroCtaBtn = page.locator('[data-testid="hero-cta-btn"]')
  }

  async goto() { await this.page.goto('/') }
  async clickHeroCta() { await this.heroCtaBtn.click() }

  async getFeaturedProductCount(): Promise<number> {
    return await this.featuredProducts.locator('[data-testid="product-card"]').count()
  }
}
```

```typescript
// e2e/pages/shop.page.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class ShopPage extends BasePage {
  readonly productCards: Locator
  readonly categoryFilter: Locator
  readonly metalTypeFilter: Locator
  readonly sortDropdown: Locator
  readonly priceMinInput: Locator
  readonly priceMaxInput: Locator
  readonly noResultsMessage: Locator
  readonly loadingSpinner: Locator

  constructor(page: Page) {
    super(page)
    this.productCards = page.locator('[data-testid="product-card"]')
    this.categoryFilter = page.locator('[data-testid="category-filter"]')
    this.metalTypeFilter = page.locator('[data-testid="metal-type-filter"]')
    this.sortDropdown = page.locator('[data-testid="sort-dropdown"]')
    this.priceMinInput = page.locator('[data-testid="price-min"]')
    this.priceMaxInput = page.locator('[data-testid="price-max"]')
    this.noResultsMessage = page.locator('[data-testid="no-results"]')
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]')
  }

  async goto() { await this.page.goto('/shop') }
  async filterByCategory(category: string) { await this.categoryFilter.selectOption(category) }
  async filterByMetal(metal: string) { await this.metalTypeFilter.selectOption(metal) }
  async sortBy(option: string) { await this.sortDropdown.selectOption(option) }
  async getProductCount(): Promise<number> { return await this.productCards.count() }
  async clickProduct(index: number) { await this.productCards.nth(index).click() }

  async filterByPriceRange(min: string, max: string) {
    await this.priceMinInput.fill(min)
    await this.priceMaxInput.fill(max)
  }

  async getProductName(index: number): Promise<string> {
    return await this.productCards.nth(index).locator('[data-testid="product-card-name"]').innerText()
  }
}
```

```typescript
// e2e/pages/product-detail.page.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class ProductDetailPage extends BasePage {
  readonly productName: Locator
  readonly productPrice: Locator
  readonly priceOnRequest: Locator
  readonly productImages: Locator
  readonly productDescription: Locator
  readonly metalType: Locator
  readonly weight: Locator
  readonly purity: Locator
  readonly addToCartBtn: Locator
  readonly sendEnquiryBtn: Locator
  readonly wishlistBtn: Locator
  readonly quantityInput: Locator
  readonly reviewsSection: Locator
  readonly relatedProducts: Locator

  constructor(page: Page) {
    super(page)
    this.productName = page.locator('[data-testid="product-name"]')
    this.productPrice = page.locator('[data-testid="product-price"]')
    this.priceOnRequest = page.locator('[data-testid="price-on-request"]')
    this.productImages = page.locator('[data-testid="product-images"]')
    this.productDescription = page.locator('[data-testid="product-description"]')
    this.metalType = page.locator('[data-testid="product-metal-type"]')
    this.weight = page.locator('[data-testid="product-weight"]')
    this.purity = page.locator('[data-testid="product-purity"]')
    this.addToCartBtn = page.locator('[data-testid="add-to-cart-btn"]')
    this.sendEnquiryBtn = page.locator('[data-testid="send-enquiry-btn"]')
    this.wishlistBtn = page.locator('[data-testid="wishlist-btn"]')
    this.quantityInput = page.locator('[data-testid="quantity-input"]')
    this.reviewsSection = page.locator('[data-testid="reviews-section"]')
    this.relatedProducts = page.locator('[data-testid="related-products"]')
  }

  async goto(slug: string) { await this.page.goto(`/products/${slug}`) }

  async addToCart(quantity?: number) {
    if (quantity) await this.quantityInput.fill(quantity.toString())
    await this.addToCartBtn.click()
  }

  async sendEnquiry() { await this.sendEnquiryBtn.click() }
  async toggleWishlist() { await this.wishlistBtn.click() }
  async getName(): Promise<string> { return await this.productName.innerText() }
  async isPriceOnRequest(): Promise<boolean> { return await this.priceOnRequest.isVisible() }
}
```

```typescript
// e2e/pages/cart.page.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class CartPage extends BasePage {
  readonly cartItems: Locator
  readonly emptyCartMessage: Locator
  readonly subtotal: Locator
  readonly total: Locator
  readonly checkoutBtn: Locator
  readonly continueShoppingLink: Locator

  constructor(page: Page) {
    super(page)
    this.cartItems = page.locator('[data-testid="cart-item"]')
    this.emptyCartMessage = page.locator('[data-testid="empty-cart"]')
    this.subtotal = page.locator('[data-testid="cart-subtotal"]')
    this.total = page.locator('[data-testid="cart-total"]')
    this.checkoutBtn = page.locator('[data-testid="checkout-btn"]')
    this.continueShoppingLink = page.locator('[data-testid="continue-shopping"]')
  }

  async goto() { await this.page.goto('/cart') }
  async getItemCount(): Promise<number> { return await this.cartItems.count() }
  async proceedToCheckout() { await this.checkoutBtn.click() }

  async increaseQuantity(index: number) {
    await this.cartItems.nth(index).locator('[data-testid="quantity-increase"]').click()
  }

  async decreaseQuantity(index: number) {
    await this.cartItems.nth(index).locator('[data-testid="quantity-decrease"]').click()
  }

  async removeItem(index: number) {
    await this.cartItems.nth(index).locator('[data-testid="remove-item"]').click()
  }

  async getItemQuantity(index: number): Promise<string> {
    return await this.cartItems.nth(index).locator('[data-testid="item-quantity"]').innerText()
  }
}
```

```typescript
// e2e/pages/checkout.page.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class CheckoutPage extends BasePage {
  readonly addressLine1: Locator
  readonly addressLine2: Locator
  readonly city: Locator
  readonly postcode: Locator
  readonly stripeOption: Locator
  readonly paypalOption: Locator
  readonly placeOrderBtn: Locator
  readonly orderSummary: Locator
  readonly orderConfirmation: Locator

  constructor(page: Page) {
    super(page)
    this.addressLine1 = page.getByLabel('Address Line 1')
    this.addressLine2 = page.getByLabel('Address Line 2')
    this.city = page.getByLabel('City')
    this.postcode = page.getByLabel('Postcode')
    this.stripeOption = page.locator('[data-testid="payment-stripe"]')
    this.paypalOption = page.locator('[data-testid="payment-paypal"]')
    this.placeOrderBtn = page.locator('[data-testid="place-order-btn"]')
    this.orderSummary = page.locator('[data-testid="order-summary"]')
    this.orderConfirmation = page.locator('[data-testid="order-confirmation"]')
  }

  async fillShippingAddress(address: { line1: string; line2?: string; city: string; postcode: string }) {
    await this.addressLine1.fill(address.line1)
    if (address.line2) await this.addressLine2.fill(address.line2)
    await this.city.fill(address.city)
    await this.postcode.fill(address.postcode)
  }

  async payWithStripeTestCard() {
    await this.stripeOption.click()
    const stripeFrame = this.page.frameLocator('iframe[name*="stripe"]').first()
    await stripeFrame.getByPlaceholder('Card number').fill('4242424242424242')
    await stripeFrame.getByPlaceholder('MM / YY').fill('12/30')
    await stripeFrame.getByPlaceholder('CVC').fill('123')
  }

  async selectPaypal() { await this.paypalOption.click() }
  async placeOrder() { await this.placeOrderBtn.click() }
}
```

```typescript
// e2e/pages/enquiry.page.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class EnquiryPage extends BasePage {
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly phoneInput: Locator
  readonly messageInput: Locator
  readonly submitBtn: Locator
  readonly successMessage: Locator

  constructor(page: Page) {
    super(page)
    this.nameInput = page.locator('[data-testid="enquiry-name"]')
    this.emailInput = page.locator('[data-testid="enquiry-email"]')
    this.phoneInput = page.locator('[data-testid="enquiry-phone"]')
    this.messageInput = page.locator('[data-testid="enquiry-message"]')
    this.submitBtn = page.locator('[data-testid="enquiry-submit"]')
    this.successMessage = page.locator('[data-testid="enquiry-success"]')
  }

  async goto() { await this.page.goto('/contact') }

  async submitEnquiry(details: { name: string; email: string; phone: string; message: string }) {
    await this.nameInput.fill(details.name)
    await this.emailInput.fill(details.email)
    await this.phoneInput.fill(details.phone)
    await this.messageInput.fill(details.message)
    await this.submitBtn.click()
  }

  async getPrefilledMessage(): Promise<string> {
    return await this.messageInput.inputValue()
  }
}
```

```typescript
// e2e/pages/appointment.page.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class AppointmentPage extends BasePage {
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly phoneInput: Locator
  readonly datePicker: Locator
  readonly timeSlotSelect: Locator
  readonly purposeSelect: Locator
  readonly submitBtn: Locator
  readonly successMessage: Locator

  constructor(page: Page) {
    super(page)
    this.nameInput = page.locator('[data-testid="appointment-name"]')
    this.emailInput = page.locator('[data-testid="appointment-email"]')
    this.phoneInput = page.locator('[data-testid="appointment-phone"]')
    this.datePicker = page.locator('[data-testid="appointment-date"]')
    this.timeSlotSelect = page.locator('[data-testid="appointment-time"]')
    this.purposeSelect = page.locator('[data-testid="appointment-purpose"]')
    this.submitBtn = page.locator('[data-testid="appointment-submit"]')
    this.successMessage = page.locator('[data-testid="appointment-success"]')
  }

  async goto() { await this.page.goto('/appointments') }

  async bookAppointment(details: { name: string; email: string; phone: string; time: string; purpose: string }) {
    await this.nameInput.fill(details.name)
    await this.emailInput.fill(details.email)
    await this.phoneInput.fill(details.phone)
    await this.timeSlotSelect.selectOption(details.time)
    await this.purposeSelect.selectOption(details.purpose)
    await this.submitBtn.click()
  }
}
```

```typescript
// e2e/pages/account.page.ts
import { Page, Locator } from '@playwright/test'
import { BasePage } from './base.page'

export class AccountPage extends BasePage {
  readonly orderHistory: Locator
  readonly wishlistItems: Locator
  readonly profileSection: Locator
  readonly logoutBtn: Locator

  constructor(page: Page) {
    super(page)
    this.orderHistory = page.locator('[data-testid="order-history"]')
    this.wishlistItems = page.locator('[data-testid="wishlist-item"]')
    this.profileSection = page.locator('[data-testid="profile-section"]')
    this.logoutBtn = page.locator('[data-testid="logout-btn"]')
  }

  async gotoOrders() { await this.page.goto('/account/orders') }
  async gotoWishlist() { await this.page.goto('/account/wishlist') }
  async gotoProfile() { await this.page.goto('/account/profile') }

  async getOrderCount(): Promise<number> {
    return await this.orderHistory.locator('[data-testid="order-row"]').count()
  }

  async getWishlistCount(): Promise<number> { return await this.wishlistItems.count() }

  async removeWishlistItem(index: number) {
    await this.wishlistItems.nth(index).locator('[data-testid="remove-wishlist"]').click()
  }
}
```

---

#### UI Spec Files — All Through POMs

**Phase 1 — Browsing:**
```typescript
// e2e/ui/product-browsing.spec.ts
import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { ShopPage } from '../pages/shop.page'
import { ProductDetailPage } from '../pages/product-detail.page'

test.describe('Home Page', () => {
  test('loads with hero, featured products, and categories', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()
    await expect(home.heroSection).toBeVisible()
    await expect(home.featuredProducts).toBeVisible()
    await expect(home.categoryShowcase).toBeVisible()
    expect(await home.getFeaturedProductCount()).toBeGreaterThan(0)
  })

  test('hero CTA navigates to shop', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()
    await home.clickHeroCta()
    await expect(page).toHaveURL(/\/shop/)
  })
})

test.describe('Shop Page', () => {
  test('displays products and filters by category', async ({ page }) => {
    const shop = new ShopPage(page)
    await shop.goto()
    const total = await shop.getProductCount()
    expect(total).toBeGreaterThan(0)
    await shop.filterByCategory('gold')
    expect(await shop.getProductCount()).toBeLessThanOrEqual(total)
  })

  test('filters by metal type', async ({ page }) => {
    const shop = new ShopPage(page)
    await shop.goto()
    await shop.filterByMetal('silver')
    expect(await shop.getProductCount()).toBeGreaterThan(0)
  })

  test('sorts products by price', async ({ page }) => {
    const shop = new ShopPage(page)
    await shop.goto()
    await shop.sortBy('price-asc')
    expect(await shop.getProductCount()).toBeGreaterThan(0)
  })
})

test.describe('Product Detail', () => {
  test('shows full product info from shop', async ({ page }) => {
    const shop = new ShopPage(page)
    const detail = new ProductDetailPage(page)
    await shop.goto()
    await shop.clickProduct(0)
    await expect(detail.productName).toBeVisible()
    await expect(detail.productPrice).toBeVisible()
    await expect(detail.productImages).toBeVisible()
    await expect(detail.addToCartBtn).toBeVisible()
    await expect(detail.sendEnquiryBtn).toBeVisible()
  })

  test('enquiry-only product hides cart, shows enquiry', async ({ page }) => {
    const detail = new ProductDetailPage(page)
    await detail.goto('diamond-solitaire-ring') // adjust to seed data slug
    expect(await detail.isPriceOnRequest()).toBe(true)
    await expect(detail.addToCartBtn).not.toBeVisible()
    await expect(detail.sendEnquiryBtn).toBeVisible()
  })
})
```

**Phase 2 — Cart & Checkout:**
```typescript
// e2e/ui/cart-and-checkout.spec.ts
import { test, expect } from '@playwright/test'
import { ShopPage } from '../pages/shop.page'
import { ProductDetailPage } from '../pages/product-detail.page'
import { CartPage } from '../pages/cart.page'
import { CheckoutPage } from '../pages/checkout.page'

test.describe('Cart', () => {
  test('add item and verify in cart', async ({ page }) => {
    const shop = new ShopPage(page)
    const detail = new ProductDetailPage(page)
    const cart = new CartPage(page)

    await shop.goto()
    await shop.clickProduct(0)
    await detail.addToCart()
    await expect(detail.cartCount).toHaveText('1')
    await cart.goto()
    expect(await cart.getItemCount()).toBe(1)
  })

  test('update quantity', async ({ page }) => {
    const shop = new ShopPage(page)
    const detail = new ProductDetailPage(page)
    const cart = new CartPage(page)

    await shop.goto()
    await shop.clickProduct(0)
    await detail.addToCart()
    await cart.goto()
    await cart.increaseQuantity(0)
    expect(await cart.getItemQuantity(0)).toBe('2')
  })

  test('remove item shows empty state', async ({ page }) => {
    const shop = new ShopPage(page)
    const detail = new ProductDetailPage(page)
    const cart = new CartPage(page)

    await shop.goto()
    await shop.clickProduct(0)
    await detail.addToCart()
    await cart.goto()
    await cart.removeItem(0)
    await expect(cart.emptyCartMessage).toBeVisible()
  })
})

test.describe('Checkout', () => {
  test('full purchase with Stripe test card', async ({ page }) => {
    const shop = new ShopPage(page)
    const detail = new ProductDetailPage(page)
    const cart = new CartPage(page)
    const checkout = new CheckoutPage(page)

    await shop.goto()
    await shop.clickProduct(0)
    await detail.addToCart()
    await cart.goto()
    await cart.proceedToCheckout()

    await checkout.fillShippingAddress({
      line1: '123 Test Street', city: 'London', postcode: 'SW1A 1AA',
    })
    await checkout.payWithStripeTestCard()
    await checkout.placeOrder()

    await expect(checkout.orderConfirmation).toBeVisible({ timeout: 15000 })
  })
})
```

**Phase 3 — Enquiry & Appointments:**
```typescript
// e2e/ui/enquiry.spec.ts
import { test, expect } from '@playwright/test'
import { EnquiryPage } from '../pages/enquiry.page'
import { ShopPage } from '../pages/shop.page'
import { ProductDetailPage } from '../pages/product-detail.page'

test.describe('Enquiries', () => {
  test('submit general enquiry', async ({ page }) => {
    const enquiry = new EnquiryPage(page)
    await enquiry.goto()
    await enquiry.submitEnquiry({
      name: 'Test User', email: 'test@example.com',
      phone: '07700900000', message: 'Interested in gold bangles.',
    })
    await expect(enquiry.successMessage).toBeVisible()
  })

  test('product enquiry pre-fills product name', async ({ page }) => {
    const shop = new ShopPage(page)
    const detail = new ProductDetailPage(page)
    const enquiry = new EnquiryPage(page)

    await shop.goto()
    await shop.clickProduct(0)
    const productName = await detail.getName()
    await detail.sendEnquiry()

    const message = await enquiry.getPrefilledMessage()
    expect(message).toContain(productName)
  })
})

// e2e/ui/appointment.spec.ts
import { test, expect } from '@playwright/test'
import { AppointmentPage } from '../pages/appointment.page'

test.describe('Appointments', () => {
  test('book a consultation', async ({ page }) => {
    const appointment = new AppointmentPage(page)
    await appointment.goto()
    await appointment.bookAppointment({
      name: 'Test User', email: 'test@example.com',
      phone: '07700900000', time: '11:00', purpose: 'consultation',
    })
    await expect(appointment.successMessage).toBeVisible()
  })
})
```

**Phase 4 — Wishlist & Reviews:**
```typescript
// e2e/ui/wishlist.spec.ts
import { test, expect } from '@playwright/test'
import { ShopPage } from '../pages/shop.page'
import { ProductDetailPage } from '../pages/product-detail.page'
import { AccountPage } from '../pages/account.page'

test.describe('Wishlist', () => {
  test('add to wishlist from product detail', async ({ page }) => {
    const shop = new ShopPage(page)
    const detail = new ProductDetailPage(page)
    const account = new AccountPage(page)

    await shop.goto()
    await shop.clickProduct(0)
    await detail.toggleWishlist()

    await account.gotoWishlist()
    expect(await account.getWishlistCount()).toBeGreaterThan(0)
  })

  test('remove from wishlist', async ({ page }) => {
    const account = new AccountPage(page)
    await account.gotoWishlist()
    const before = await account.getWishlistCount()
    if (before > 0) {
      await account.removeWishlistItem(0)
      expect(await account.getWishlistCount()).toBe(before - 1)
    }
  })
})
```

**Responsive & Accessibility:**
```typescript
// e2e/ui/responsive.spec.ts
import { test, expect, devices } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { HomePage } from '../pages/home.page'

test.describe('Responsive', () => {
  test('mobile menu opens and closes', async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices['iPhone 13'] })
    const page = await ctx.newPage()
    const home = new HomePage(page)
    await home.goto()
    await expect(home.mobileMenuBtn).toBeVisible()
    await expect(home.desktopNav).not.toBeVisible()
    await home.openMobileMenu()
    await expect(home.mobileNav).toBeVisible()
    await ctx.close()
  })

  test('WhatsApp button visible', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()
    await expect(home.whatsappBtn).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  for (const path of ['/', '/shop', '/contact', '/appointments']) {
    test(`${path} — no critical a11y violations`, async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0)
    })
  }
})
```

### Running Tests

```bash
# Run everything (API first, then browsers)
npx playwright test

# Run ONLY API tests (fast — use during development)
npx playwright test --project=api

# Run ONLY UI tests on Chrome
npx playwright test --project=chromium

# Run a specific file
npx playwright test e2e/api/products.api.spec.ts

# Headed mode (watch the browser)
npx playwright test --project=chromium --headed

# Interactive UI mode (best for debugging)
npx playwright test --ui

# View HTML report
npx playwright show-report
```

**Dev workflow:** Run `npx playwright test --project=api` after every backend change — takes seconds. Run the full suite before pushing.

---

### data-testid Convention

Add `data-testid` to all interactive and key content elements. Decouples tests from CSS — a QA best practice.

```
data-testid="hero-section"         data-testid="featured-products"
data-testid="product-card"         data-testid="product-name"
data-testid="product-price"        data-testid="product-images"
data-testid="price-on-request"     data-testid="add-to-cart-btn"
data-testid="send-enquiry-btn"     data-testid="cart-count"
data-testid="cart-item"            data-testid="checkout-btn"
data-testid="place-order-btn"      data-testid="payment-stripe"
data-testid="enquiry-name"         data-testid="enquiry-submit"
data-testid="enquiry-success"      data-testid="appointment-submit"
data-testid="appointment-success"  data-testid="wishlist-btn"
data-testid="mobile-menu-btn"      data-testid="mobile-nav"
data-testid="desktop-nav"          data-testid="category-filter"
data-testid="metal-type-filter"    data-testid="sort-dropdown"
data-testid="gold-price-ticker"    data-testid="language-switcher"
```

---

### Test Data Seeding

Create a Django management command:
```bash
python manage.py seed_test_data
```

This should create: 4-5 categories, 20-30 products (with at least one "price on request"), a test customer + test admin (known credentials matching the auth fixture), and sample orders/reviews/enquiries. Run before tests in CI.

---

### Tests by Phase — What to Write When

| Phase | API Tests (`e2e/api/`) | UI Tests (`e2e/ui/`) |
|-------|----------------------|---------------------|
| **1** | Products list/detail/filter/sort, categories, 404s | Home loads, shop filters, product detail, responsive |
| **2** | Register, login, JWT, cart CRUD, orders, auth guards | Purchase flow (Stripe), cart UI, login/register forms |
| **3** | Enquiry create, product enquiry, appointments, validation | Enquiry form, appointment booking, WhatsApp visible |
| **4** | Reviews CRUD, rating validation, wishlist CRUD, duplicates | Review flow, wishlist toggle, gold ticker |
| **5** | — | Language switcher, a11y audit all pages |

---

### CI/CD — GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: naresh_jewellers_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports: ['5432:5432']
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - uses: actions/setup-node@v4
        with: { node-version: '20' }

      - name: Install backend
        run: cd backend && pip install -r requirements.txt

      - name: Setup DB & seed
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/naresh_jewellers_test
          SECRET_KEY: ci-test-secret-key
        run: |
          cd backend
          python manage.py migrate
          python manage.py seed_test_data

      - name: Install frontend
        run: cd frontend && npm ci

      - name: Install Playwright
        run: npm ci && npx playwright install --with-deps chromium

      - name: Run all tests
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/naresh_jewellers_test
          SECRET_KEY: ci-test-secret-key
        run: npx playwright test --project=api --project=chromium

      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Environment Variables (.env)

```bash
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://user:pass@localhost:5432/naresh_jewellers

# Stripe (Phase 2 — use test keys)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal (Phase 2 — use sandbox)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox

# Email (Phase 3)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=

# Gold Price API (Phase 4)
GOLD_API_KEY=

# WhatsApp (Phase 3)
WHATSAPP_NUMBER=44xxxxxxxxxx

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## Key Django Packages

```
# requirements.txt
django
djangorestframework
django-cors-headers
djangorestframework-simplejwt
django-filter
django-jazzmin
psycopg2-binary
Pillow
python-decouple
gunicorn
whitenoise
stripe
paypalrestsdk
```

---

## Key Frontend Packages

```
# package.json dependencies (frontend/)
react
react-dom
react-router-dom
axios
tailwindcss
@stripe/react-stripe-js    # Phase 2
@paypal/react-paypal-js     # Phase 2
react-i18next               # Phase 5
i18next                     # Phase 5
react-icons                 # For icons (heart, cart, star, etc.)
```

```
# package.json devDependencies (project root — testing)
@playwright/test
@axe-core/playwright
```

---

## Deployment & Hosting

### Platform: Railway (https://railway.app)

Railway is the simplest way to deploy a Django + React + PostgreSQL app. You push your code and it handles the rest. No server management, no Docker required (though it supports it).

**Estimated cost**: ~£5–10/month for the Hobby plan (includes backend, frontend, and Postgres).

#### What Railway gives you:
- **Django backend** — deployed as a web service (auto-detects Python)
- **React frontend** — deployed as a static site or separate service
- **PostgreSQL** — managed database, one-click add
- **Custom domains** — free SSL included
- **Environment variables** — set via the dashboard (never commit `.env`)
- **Auto-deploy on git push** — connect your GitHub repo

#### Railway Setup Steps (do this after Phase 1 is working locally):
1. Sign up at https://railway.app (free trial, then Hobby plan ~$5/month)
2. Connect your GitHub repo
3. Create 3 services in a Railway project:
   - **PostgreSQL** — click "New" → "Database" → PostgreSQL
   - **Backend** — click "New" → "GitHub Repo" → select repo, set root directory to `/backend`
   - **Frontend** — click "New" → "GitHub Repo" → select repo, set root directory to `/frontend`
4. Set environment variables on the backend service (copy from `.env`, use Railway's Postgres connection string)
5. Add a `Procfile` to `backend/`:
   ```
   web: gunicorn config.wsgi --bind 0.0.0.0:$PORT
   ```
6. Add `gunicorn` and `whitenoise` to `requirements.txt` for production
7. Configure `whitenoise` in Django settings to serve static files
8. Deploy — Railway auto-builds and deploys on every push

#### Production Checklist (backend `settings.py`):
- `DEBUG = False`
- `ALLOWED_HOSTS` = your Railway domain + custom domain
- `CORS_ALLOWED_ORIGINS` = your frontend domain
- Use `whitenoise` for static files
- Use Railway's `DATABASE_URL` environment variable
- `SECURE_SSL_REDIRECT = True`
- `SESSION_COOKIE_SECURE = True`
- `CSRF_COOKIE_SECURE = True`

---

### Domain Name

#### Recommended registrar: Namecheap or Cloudflare Registrar
Both are cheap, straightforward, and beginner-friendly. Cloudflare Registrar sells at cost (no markup).

#### Domain suggestions (check availability):
- `nareshjewellers.co.uk` — best for a UK-based store (~£6-8/year)
- `nareshjewellers.com` — good international option (~£8-12/year)
- `nareshjewellers.uk` — shorter alternative (~£4-6/year)

#### Steps to buy and connect:
1. Go to https://www.namecheap.com or https://www.cloudflare.com/products/registrar/
2. Search for your preferred domain and purchase it
3. In Railway dashboard → your service → Settings → Custom Domain
4. Railway gives you a CNAME record to add
5. Go to your domain registrar's DNS settings
6. Add the CNAME record Railway provides
7. Wait 5–30 minutes for DNS propagation
8. Railway auto-provisions a free SSL certificate — your site will be HTTPS

#### DNS Setup (what you'll add):
```
Type    Name    Value
CNAME   www     your-app.up.railway.app
CNAME   @       your-app.up.railway.app    (or use A record if required)
```

#### Email Setup (optional, for notifications):
For sending order confirmations and enquiry alerts, use one of:
- **Gmail SMTP** — free, works for low volume, use an App Password
- **Resend** — free tier (100 emails/day), easy API
- **Mailgun** — free tier (1,000 emails/month), reliable

---

### Deployment Architecture (Summary)

```
┌─────────────────────────────────────────────────┐
│                   Railway                        │
│                                                  │
│  ┌──────────────┐  ┌───────────┐  ┌──────────┐ │
│  │   Frontend    │  │  Backend  │  │ Postgres │ │
│  │  React + TS   │  │  Django   │  │    DB    │ │
│  │  (static)     │←→│  DRF API  │←→│          │ │
│  └──────────────┘  └───────────┘  └──────────┘ │
│                                                  │
└─────────────────────────────────────────────────┘
         ↑                    ↑
         │                    │
    nareshjewellers.co.uk    API calls
    (custom domain + SSL)
```

---

## Tips for Claude Code

- **Start with Phase 1 only.** Get products displaying before touching payments.
- **Use TypeScript throughout the frontend.** All files should be `.tsx` (components) or `.ts` (utilities/services/types). No `.js` or `.jsx` files.
- **Define types early.** Create a `src/types/` folder with interfaces matching the Django models (e.g. `Product`, `Category`, `ProductImage`). Reuse these across components, services, and context. Example:
  ```typescript
  // src/types/product.ts
  export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: Category;
    metal_type: 'gold' | 'silver' | 'diamond' | 'platinum' | 'other';
    weight_grams: number;
    purity: string;
    price: string; // DecimalField comes as string from DRF
    is_price_on_request: boolean;
    sku: string;
    stock_quantity: number;
    is_featured: boolean;
    images: ProductImage[];
  }
  ```
- **Type your API service layer.** `src/services/api.ts` should use typed axios responses: `axios.get<Product[]>('/api/products/')`.
- **Type your React Context.** Define interfaces for context values and use them with `createContext<MyContextType>()`.
- **Use `ModelViewSet`** in DRF — it gives you full CRUD with minimal code.
- **Use `django-jazzmin`** — instant good-looking admin panel with zero custom code.
- **React Context**: Use `AuthContext` for login state and `CartContext` for cart — keeps things simple without Redux.
- **Test as you go**: After building an API endpoint, write an API spec in `e2e/api/`. After a page is working, write a UI spec in `e2e/ui/`. Run `npx playwright test --project=api` constantly during backend dev — it takes seconds.
- **Always add `data-testid` attributes** to interactive elements in React components — Playwright depends on these.
- **Run `npx playwright test --project=api` before every commit.** Run the full `npx playwright test` before pushing to main.
- **Git commit after each working feature.**
- The logo image is available at the project root — use it in the header. Remember the spelling fix ("JEWELLERS" not "JEWELLLERS").
