# GrowButtler Landing

Next.js (TypeScript + SCSS) landing page, driven by headless WordPress + ACF, with PayPal integration. Deploy to Vercel.

## Setup

```bash
cd growbuttler-landing
npm install
cp .env.example .env
# Edit .env: BACKEND_URL, NEXT_PUBLIC_PAYPAL_CLIENT_ID
npm run dev
```

## Environment

| Variable | Description |
|----------|-------------|
| `BACKEND_URL` | Headless WordPress base URL (e.g. `https://yoursite.com`). Used for REST API and checkout redirect. |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID for subscription button. If unset, "Get Access" falls back to `/api/checkout?plan=monthly` (redirects to backend). |

## WordPress / ACF

- Home content is fetched from `GET {BACKEND_URL}/wp-json/wp/v2/pages?slug=home&_fields=id,slug,title,acf`.
- If the request fails or `BACKEND_URL` is missing, built-in fallback copy is used.
- Map your ACF field groups to the shapes in `src/types/wordpress.ts` and expose `acf` in the REST response (e.g. [ACF to REST API](https://github.com/airesvsg/acf-to-rest-api) or custom endpoint).

## PayPal

- Set `NEXT_PUBLIC_PAYPAL_CLIENT_ID` to show the PayPal subscription button on the pricing section.
- Configure your PayPal plan ID (e.g. from WordPress/backend) and pass it as `paypal_plan_id` in the pricing ACF block or in the component.

## Deploy (Vercel)

1. Connect the repo (or `growbuttler-landing` subfolder as root).
2. Set **Root Directory** to `growbuttler-landing` if the repo root is the monorepo.
3. Add env vars: `BACKEND_URL`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.
4. Deploy.
