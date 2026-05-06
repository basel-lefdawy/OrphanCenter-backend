# OrphanCenter Backend

Backend API for the OrphanCenter project.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Update `.env` values if needed.

4. Start MySQL with Docker:

```bash
docker compose up -d db
```

5. Start the backend:

```bash
npm run dev
```

## Useful Routes

- `GET /health`: server health check.
- `GET /api`: API root check.

## Project Structure

```txt
src/
  app.js
  server.js
  config/
    db.js
  controllers/
  middleware/
    requireAuth.js
    requireAdmin.js
  models/
  routes/
    index.js
  services/
  utils/
    apiResponse.js
    asyncHandler.js
  validations/
    index.js
```

## Shared Helpers

Use `sendSuccess` and `sendError` from `src/utils/apiResponse.js` to keep API responses consistent.

Use `asyncHandler` from `src/utils/asyncHandler.js` if your controller prefers not to repeat `try/catch`.

Use `requireAuth` before protected routes and `requireAdmin` after it for admin-only routes.

Example order:

```js
router.get("/admin/example", requireAuth, requireAdmin, controller);
```

## Response Shape

Success:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "errors": null
}
```

## Notes for the Team

- Add module routes through `src/routes/index.js`.
- Keep page-specific logic inside its controller/service/model files.
- Put shared validation helpers in `src/validations`.
- Keep real secrets in `.env`; use `.env.example` for shared defaults only.
