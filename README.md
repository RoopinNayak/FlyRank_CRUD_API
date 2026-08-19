# Task API

A minimal RESTful CRUD API built with **Node.js** and **Express** for managing tasks. Includes input validation, proper HTTP status codes, and interactive API documentation powered by **Swagger UI**.

---

## Features

- Full CRUD operations on an in-memory task list
- Input validation with descriptive error messages
- Interactive API docs at `/docs` via Swagger UI
- Health check endpoint

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- npm (bundled with Node.js)

## Installation

```bash
git clone https://github.com/RoopinNayak/FlyRank_CRUD_API.git
cd FlyRank_CRUD_API
npm install
```

## Running the Server

```bash
npm start
```

The server starts at **http://localhost:3000**.

## API Endpoints

| Method | Path | Request Body | Success | Error | Description |
|--------|------|--------------|---------|-------|-------------|
| `GET` | `/` | — | `200` | — | API info and available endpoints |
| `GET` | `/health` | — | `200` | — | Health check |
| `GET` | `/tasks` | — | `200` | — | List all tasks |
| `GET` | `/tasks/:id` | — | `200` | `404` | Get a single task by ID |
| `POST` | `/tasks` | `{ "title": "string" }` | `201` | `400` | Create a new task |
| `PUT` | `/tasks/:id` | `{ "title?": "string", "done?": boolean }` | `200` | `400` `404` | Update a task |
| `DELETE` | `/tasks/:id` | — | `204` | `404` | Delete a task |

## Example Request

```bash
curl -i http://localhost:3000/tasks
```

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 190
ETag: W/"be-IOch9YMhFnLtEhJ5PqxRY70kd7Q"
Date: Wed, 19 Aug 2026 08:05:52 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[
  { "id": 1, "title": "Set up project", "done": true },
  { "id": 2, "title": "Create API routes", "done": false },
  { "id": 3, "title": "Write documentation", "done": false }
]
```

## Interactive Documentation

Swagger UI is served at **http://localhost:3000/docs** — use the **Try it out** buttons to test every endpoint directly from the browser.

![Swagger UI](swagger.png)

## Project Structure

```
├── index.js          # Express server & route handlers
├── openapi.json      # OpenAPI 3.0 specification
├── package.json      # Project metadata & dependencies
├── swagger.png       # Swagger UI screenshot
├── .gitignore        # Ignores node_modules
└── README.md
```

## License

ISC
