# Car Inventory

A web app for managing a company's car records. Add, view, edit, and delete cars, with search by plate, brand, or model.

## Tech stack

- **Web:** Next.js, React, TypeScript, MUI
- **API:** Node.js, Express, TypeScript, Zod
- **Database:** SQLite (better-sqlite3)

## Features

- Add, edit, and delete cars through dialogs
- Search by license plate, brand, or model
- Duplicate protection for plate and province
- Responsive layout for desktop and mobile

## Project structure

```
car-inventory/
├─ server/   Express API (port 4000)
└─ web/      Next.js app (port 3000)
```

## Run locally

Requires Node.js 20 or later.

```bash
# Terminal 1: API
cd server
npm install
npm run dev
```

```bash
# Terminal 2: web
cd web
npm install
npm run dev
```

Open http://localhost:3000

The SQLite file `server/cars.db` is created automatically on the first run.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/cars` | List all cars |
| POST | `/api/cars` | Add a car |
| PUT | `/api/cars/:id` | Update a car |
| DELETE | `/api/cars/:id` | Delete a car |

Example body for POST and PUT:

```json
{
  "plate": "1กก 1234",
  "province": "Bangkok",
  "brand": "Toyota",
  "model": "Hilux Revo",
  "year": "2022",
  "color": "White",
  "note": "Delivery truck"
}
```

`plate`, `brand`, and `model` are required.

## Configuration

| Variable | Where | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `web/.env.local` | `http://localhost:4000` |
| `PORT` | server environment | `4000` |
| `WEB_ORIGIN` | server environment | `http://localhost:3000` |