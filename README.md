# Social Sandbox Backend Test

A small React application with a FastAPI backend. The frontend displays a
social feed and fetches a message from the API when the page loads.

## Services

- Vite frontend: `http://localhost:5173`
- FastAPI backend: `http://localhost:8081`

The frontend API URL is configured with `VITE_API_URL`. The development and
production environment files currently set it to:

```text
http://localhost:8081
```

## Requirements

- Node.js and npm
- Python 3

## Install

Install the frontend dependencies:

```bash
npm ci
```

Create a Python virtual environment and install the backend dependencies:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

## Run

Start the backend:

```bash
source .venv/bin/activate
npm run start:backend
```

Start the frontend in another terminal:

```bash
npm run start:frontend
```

Open `http://localhost:5173` in a browser.

## API

Health check:

```bash
curl -fsS http://localhost:8081/api/health
```

Example message:

```bash
curl -fsS http://localhost:8081/api/message
```

## Tests

Run the frontend tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```
