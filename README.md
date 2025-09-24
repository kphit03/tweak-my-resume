# The Resume Tailor

AI-powered resume tailoring. Sign in with Google → upload a PDF (parsed client-side) → send text + optional job description to the backend → Spring AI (OpenAI) returns structured JSON (summary, strengths, gaps, tailored bullets, ATS keywords).

## Features

- **Auth:** Google OAuth2 (Spring Security) with server session (**JSESSIONID**)
- **Client PDF extraction:** `pdfjs-dist` in the browser (the file itself is not uploaded)
- **Analysis:** Spring AI → OpenAI; strict JSON response rendered in a responsive dashboard
- **Frontend:** React + Vite + React Router + Axios + CSS Modules
- **Backend:** Spring Boot 3, Spring Security, Spring Data JPA, Postgres/MySQL
- **Prod-ready bits:** CORS with credentials, CSRF tokens, secure logout, SPA history fallback, size limits, environment configs

---

## Architecture

```
React (Vite @ 5173)  ── withCredentials ──► Spring Boot API (@ 8080)
      │                                   │
      ├─ pdfjs-dist extracts text         ├─ Spring Security OAuth2 (Google)
      │                                   ├─ Spring AI → OpenAI
      └─ renders JSON results             └─ JPA → Postgres/MySQL
```

**Auth flow:**  
User clicks **Continue with Google** → Spring Security redirects to Google → callback → server session created → Spring redirects to `http://localhost:5173/dashboard`.

---

## Prerequisites

- **Java 17+**
- **Node 18+** (20+ recommended)
- **Maven 3.9+**
- **A database** (Postgres or MySQL). For quick local dev you can swap to H2.

---

## 1) Google OAuth setup

1. Go to **Google Cloud Console → APIs & Services → Credentials**.
2. Create **OAuth 2.0 Client ID** (type: **Web application**).
3. Add **Authorized redirect URI**:  
   `http://localhost:8080/login/oauth2/code/google`
4. (Optional) Add **Authorized JavaScript origins**:  
   `http://localhost:5173` and `http://localhost:8080`
5. Save **Client ID** and **Client Secret**.
6. In testing, add your Google account as a **Test User** on the OAuth consent screen.

---

## 2) Backend setup (Spring Boot)

Create `src/main/resources/application.yml`:

```yaml
server:
  port: 8080
  forward-headers-strategy: framework   # trust X-Forwarded-* when behind a proxy/CDN
  servlet:
    session:
      cookie:
        # For cross-site SPA (different domain) over HTTPS:
        same-site: none
        secure: true

spring:
  datasource:
    # Choose one:
    # Postgres:
    url: jdbc:postgresql://localhost:5432/resume_tailor
    username: postgres
    password: postgres
    # MySQL (example):
    # url: jdbc:mysql://localhost:3306/resume_tailor?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    # username: root
    # password: root

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: openid, profile, email
        provider:
          google:
            issuer-uri: https://accounts.google.com

# Spring AI / OpenAI
spring:
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
      chat:
        options:
          model: gpt-4o-mini   # adjust as needed
```

Environment variables (local), e.g. in your shell or IDE Run Config:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=sk-...
```

Run the backend:

```bash
./mvnw spring-boot:run
```

### Security notes (backend)

- **CORS**: allow the SPA origin and `allowCredentials=true`.
- **CSRF**: use `CookieCsrfTokenRepository.withHttpOnlyFalse()` so the SPA can read `XSRF-TOKEN` and send `X-XSRF-TOKEN` on **POST/PUT/DELETE/LOGOUT**.
- **Logout**: Spring’s built-in **POST `/logout`** expects the CSRF header.

---

## 3) Frontend setup (React + Vite)

Create `.env` in the **frontend**:

```
VITE_API_BASE_URL=http://localhost:8080
```

Install & run:

```bash
npm i
npm run dev
```

- The **Login** button should hit: `http://localhost:8080/oauth2/authorization/google`
- The **Dashboard** will call: `GET /api/auth/me` with `{ withCredentials: true }`

---

## 4) Local development checklist

- **Cookies:** After any API GET (e.g., `/api/auth/me`), you should see `XSRF-TOKEN` in browser devtools → Application → Cookies.
- **Axios:** All calls must use `{ withCredentials: true }`.
- **Logout:** Call `POST /logout` with header `X-XSRF-TOKEN: <value from cookie>`.

Example logout with curl:

```bash
# Fetch cookies first
curl -i -c cookies.txt http://localhost:8080/api/auth/me

# Extract XSRF-TOKEN from cookies.txt and send it back as header
curl -i -b cookies.txt -X POST \
  -H "X-XSRF-TOKEN: <token-from-cookies>" \
  http://localhost:8080/logout
```

---

## 5) API overview

- `GET /api/auth/public` → 200 plain text (health/public)
- `GET /api/auth/me` → returns current user `{ id, firstName, lastName, email }` (requires session)
- `POST /api/analyze/tailor` → `{ resumeText, jobDescription, fileName? }` → JSON analysis
- `POST /api/contact` → `{ name, email, subject?, message }` → 204 (CSRF required if enabled)

> **PDF flow (privacy):** The browser uses `pdfjs-dist` to extract text locally. Only the extracted text (and optional job description) are sent to the server.

---

## 6) Production deployment

### Frontend (Netlify)

1. Build the SPA:

   ```bash
   npm run build
   ```

2. Ensure **history fallback** (so refreshes on deep routes like `/dashboard` work). Add `public/_redirects` (or make sure it ends up in `dist/`):

   ```
   /*  /index.html  200
   ```

3. Set Netlify env var:

   ```
   VITE_API_BASE_URL=https://<your-backend-domain>
   ```

4. Deploy `dist/` (connect repo or drag & drop).

### Backend (Render or any PaaS)

- Env vars:
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`
  - DB: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- Keep:
  - `server.servlet.session.cookie.same-site=none`
  - `server.servlet.session.cookie.secure=true`
  - `server.forward-headers-strategy=framework`
- **CORS:** include your Netlify domain (e.g. `https://the-resume-tailor.netlify.app`) and enable credentials.
- If behind a proxy/CDN (Cloudflare/Render), ensure HTTPS is correctly forwarded so Spring sets `Secure` cookies.

---

## 7) File size & limits (recommended)

**Client (PdfExtractor):**
```js
// example: 10 MB max
if (file.size > 10 * 1024 * 1024) {
  setError("Please choose a PDF under 10 MB.");
  return;
}
```

**Server (if you later accept file uploads):**
```yaml
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

(You currently post text, which is smaller—but still consider a reverse proxy body limit.)

---

## 8) Common issues & fixes

- **401 on `/api/auth/me` after login**
  - Check `JSESSIONID` is set with `SameSite=None; Secure` (requires HTTPS).
  - CORS must include the SPA origin **and** `allowCredentials=true`.
  - SPA calls must use `withCredentials: true`.

- **403 on `POST /logout`**
  - Missing CSRF header. Fetch a GET first (e.g., `/api/auth/me`) to get `XSRF-TOKEN`, then include `X-XSRF-TOKEN` on logout.

- **Refresh 404 on `/dashboard` (Netlify)**
  - Missing `_redirects`. Add `/* /index.html 200`.

- **Cookie not stored in production**
  - Domain/HTTPS mismatch or `SameSite` not `None`. Ensure HTTPS everywhere; don’t try to use cross-site cookies on HTTP.

- **OAuth error: redirect mismatch**
  - The Google Console redirect must **exactly** match `https://<backend-domain>/login/oauth2/code/google` in production.

---

## 9) Scripts

Frontend:
```bash
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

Backend:
```bash
./mvnw spring-boot:run
./mvnw test
```

---

## 10) Roadmap

- Rate limiting & CAPTCHA (Contact form)
- Persist past analyses per user (Resume entity)
- Improved prompts, model configurability per env
- Unit/integration tests (JUnit/Mockito, React Testing Library/Vitest)
- Dockerfiles + docker-compose for full local stack
- CI/CD (Netlify + Render) with health checks

---

## License

MIT — see `LICENSE`.
