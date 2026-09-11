# AIRC-506 wrong-backend reproduction

This repository reproduces a frontend that starts successfully in a remote Air
environment but addresses its backend through the browser's `localhost`.

The Vite frontend listens on port `5173`. The FastAPI backend listens on port
`8081`. Both services are healthy inside the remote environment, while the
frontend bundle intentionally uses this absolute browser-side URL:

```text
http://localhost:8081
```

Do not replace it with a relative `/api` path, a Vite proxy, a forwarded backend
URL, or a URL derived from `window.location`. Those changes would remove the
condition this fixture is intended to test.

## Install

```bash
npm ci
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

## Start

Start the backend in one terminal:

```bash
source .venv/bin/activate
npm run start:backend
```

Start the frontend in another terminal:

```bash
npm run start:frontend
```

The primary reproduction uses the Vite development server. A production Vite
build contains the same intentionally incorrect API URL so that build mode does
not silently change the scenario.

## Verify service health inside the environment

```bash
curl -fsS http://localhost:5173
curl -fsS http://localhost:8081/api/health
```

Both commands must succeed. The backend response identifies itself as
`social-sandbox-backend-test`. CORS is intentionally permissive so a CORS policy
does not hide the host-routing problem.

## Reproduce through Air forwarding

1. Open the forwarded URL for port `5173` in the user's browser.
2. Confirm that the frontend itself loads.
3. Inspect the displayed browser request URL or the browser Network panel.
4. Confirm that the request targets `http://localhost:8081/api/message`.

Expected result: Air can declare both services healthy from inside the remote
environment, but the browser request targets the user's localhost instead of
the remote FastAPI service. The page displays `Result: error` unless an unrelated
service happens to be listening on the user's port `8081`; a successful response
must identify itself as `social-sandbox-backend-test`.
