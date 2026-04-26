# AI Campaign — Backend

FastAPI service for the AI Campaign app. Handles auth (Supabase), campaign generation (Gemini image API), and persistence (Supabase REST).

## Prerequisites

- Python 3.9+ (project venv was built on 3.9)
- A Supabase project (URL + service role key)
- A Google AI Studio / Gemini API key

## Setup

```bash
cd Frontend/Backend

# 1. Create virtualenv
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env (see template below)
cp .env.example .env   # then edit with real values
```

### `.env` template

```
# Supabase — backend only, never exposed to frontend
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_jwt>

# Admin panel credentials
ADMIN_EMAIL=superadmin@example.com
ADMIN_PASSWORD=<strong-password>
ADMIN_SECRET=<random-secret>

# Gemini
GEMINI_API_KEY=<google-ai-studio-key>
```

> The service role key bypasses RLS — keep it server-side only. Never commit `.env`.

## Run

```bash
# from Frontend/Backend, with venv activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or run the entry script directly:

```bash
python main.py
```

The API will be at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Project layout

```
Backend/
├── main.py                 # FastAPI app + router wiring
├── core/                   # config, supabase helpers
├── controllers/            # route handlers (auth, campaign, dashboard, admin, ...)
├── services/               # business logic (gemini, supabase REST)
├── models/                 # pydantic request/response shapes
├── requirements.txt
└── .env                    # secrets (gitignored)
```

## Endpoints (high level)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/login` | Supabase email/password sign-in |
| `POST` | `/signup` | New user + profile |
| `GET`  | `/dashboard` | Lightweight dashboard payload (text only) |
| `POST` | `/campaign/generate` | SSE — streams 4 generated images |
| `POST` | `/campaign/save` | Persist a campaign |
| `GET`  | `/campaigns` | List user's campaigns (no images) |
| `GET`  | `/campaigns/{id}` | Full campaign detail (with images) |
| `POST` | `/admin/login` | Admin auth |

## Notes

- The list endpoint deliberately omits `image` and `metadata` (each can hold ~5–15 MB of base64 PNG). Detail endpoint returns the full row on demand.
- Image generation uses `gemini-2.5-flash-image` — model availability depends on your Gemini key region.
- CORS is currently `allow_origins=["*"]` for dev. Tighten before deploying.
