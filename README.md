# URL Shortener Web App

A Next.js URL shortener that generates short links from long URLs, tracks clicks, and redirects users to the original URLs. Built with Next.js, PostgreSQL, and deployed on Vercel.

## Demo

* Deployed App: https://aganitha-cognitive-solutions-home-a.vercel.app

* Example Short URL: https://aganitha-cognitive-solutions-home-a.vercel.app/vLEgmeR

## Features

* Shorten long URLs to unique short codes.

* Redirect short URLs to original URLs.

* Track the number of clicks for each URL.

* Handles invalid short codes gracefully.

* Fully serverless backend on Vercel.

## Technology Stack

* Frontend & Backend: Next.js (App Router)

* Database: PostgreSQL (cloud-hosted, NeonDB)

* Deployment: Vercel

* Serverless Functions: Next.js API Routes + Dynamic Routes

* Database Library: pg

# How It Works

1. Short URL Generation:

  * User submits a long URL → server generates a unique short code → stores it in DB.

2. Redirection:

* User visits https://yourdomain.com/<shortcode> → server queries DB → increments click count → responds with HTTP 302 redirect → browser navigates to original URL.

3. Click Tracking:

* Each redirect increments the click count in the database.

Flow Diagram (simplified):

User
  │
  ▼
Browser
  │
  ▼
Short URL (https://yourdomain.com/<code>)
  │
  ▼
Server ([code]/route.js)
  │
  ▼
Database (PostgreSQL)
  │
  ▼
302 Redirect
  │
  ▼
Original URL (https://example.com)


## Project Structure
aapp/
├─ api/
│  ├─ links/
│  │  └─ route.js         # GET /api/links, POST /api/links
│  ├─ shorten/
│  │  └─ route.js         # Handles URL shortening (POST /api/shorten)
│  └─ stat/
│     └─ route.js         # Handles stats like clicks, retrieval (GET /api/stat)
├─ [code]/
│  └─ route.js            # GET /<code> → redirects to original URL and increments clicks
lib/
└─ db.js                  # PostgreSQL connection setup


## Environment Variables

Create a `.env` file in the root of the project:

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=require&channel_binding=require
NEXT_PUBLIC_BASE_URL=https://aganitha-cognitive-solutions-home-a.vercel.app/
 
```

## Getting Started (Local Development)
Clone the repository
```
git clone <your-repo-url>
cd url-shortener
```

## Install dependencies
```
  npm install
  or yarn
  or pnpm install
```

## Run development server
```
  npm run dev
  or yarn dev
  or pnpm dev
```
Open http://localhost:3000 in your browser.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)  
- [Learn Next.js](https://nextjs.org/learn)  
- [Next.js GitHub Repository](https://github.com/vercel/next.js)  

---

## Deployment

- Deploy easily on [Vercel](https://vercel.com/new)  
- Make sure `DATABASE_URL` and `NEXT_PUBLIC_BASE_URL` are configured in Vercel Environment Variables  

---

## Contact

- **Developer:** Shanu Kumar Gupta  
- **Email:** shanukumargupta.224ca056@nitk.edu.in  
- **GitHub:** [github.com/shanugupta7999](https://github.com/shanugupta7999)  
- **LinkedIn:** [linkedin.com/in/shanu-kumar-gupta](https://linkedin.com/in/shanu-kumar-gupta)
