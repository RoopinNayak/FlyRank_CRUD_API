# Task API — Containerized Express & PostgreSQL Stack

A RESTful CRUD API built with **Node.js**, **Express**, and **PostgreSQL** (`pg` driver). The entire stack (Express API server + PostgreSQL database) is fully containerized and orchestrated using **Docker Compose** with data persistence via named Docker volumes.

Includes input validation, parameterized SQL queries, proper HTTP status codes, and interactive API documentation powered by **Swagger UI**.

---

## Architecture Overview

This project has evolved from SQLite file-based persistence to a scalable, containerized microservices architecture:

- **Express API Service (`api`)**: Containerized Node.js app built on `node:alpine`. Connects to PostgreSQL using `pg` connection pool.
- **PostgreSQL Database (`db`)**: Running PostgreSQL 17 in a dedicated Docker container.
- **Data Persistence (`taskdata`)**: Named Docker volume mapped to `/var/lib/postgresql/data` ensuring database records persist across container teardowns (`docker compose down`).
- **Container Networking**: Services communicate over a isolated Docker bridge network using service names (`db:5432`).

---

## One-Command Stack Setup & Execution

Run the complete multi-container stack with a single command:

```bash
cp .env.example .env && docker compose up --build
```

The Express server starts at **http://localhost:3000** and PostgreSQL runs on **localhost:5432**.

To stop the stack:
```bash
docker compose down
```

---

## Environment Variables

Environment variables are managed via `.env` (git-ignored) and referenced by `.env.example`.

| Variable | Description | Local / Docker Example |
|----------|-------------|-------------------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://postgres:dev@localhost:5432/tasks` (Local)<br>`postgres://postgres:dev@db:5432/tasks` (Docker Compose) |

### `.env.example`
```env
DATABASE_URL=postgres://postgres:dev@localhost:5432/tasks
```

---

## API Endpoints

| Method | Path | Request Body | Success | Error Statuses | Description |
|--------|------|--------------|---------|----------------|-------------|
| `GET` | `/` | — | `200 OK` | — | API metadata & endpoint list |
| `GET` | `/health` | — | `200 OK` | — | Health check endpoint |
| `GET` | `/tasks` | — | `200 OK` | — | Retrieve all tasks |
| `GET` | `/tasks/:id` | — | `200 OK` | `404 Not Found` | Retrieve a single task by ID |
| `POST` | `/tasks` | `{ "title": "string" }` | `201 Created` | `400 Bad Request` | Create a new task |
| `PUT` | `/tasks/:id` | `{ "title?": "string", "done?": boolean }` | `200 OK` | `400 Bad Request`, `404 Not Found` | Update task title and/or done status |
| `DELETE` | `/tasks/:id` | — | `204 No Content` | `404 Not Found` | Delete a task by ID |

---

## Sample Request & Response

### `GET /tasks`
```bash
curl -i http://localhost:3000/tasks
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 197
ETag: W/"c5-i0fFAl6sYYlXfwQdiWhklFlPCTY"
Date: Sat, 22 Aug 2026 15:56:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[
  { "id": 1, "title": "Set up project", "done": true },
  { "id": 2, "title": "Create API routes", "done": false },
  { "id": 3, "title": "Write documentation", "done": false },
  { "id": 4, "title": "Persistent Task", "done": false }
]
```

### `POST /tasks`
```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Docker task"}'
```

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":5,"title":"Docker task","done":false}
```

---

## Database Inspection

You can inspect the PostgreSQL database directly inside the container using `psql`:

```bash
docker exec -it first_crud_api-db-1 psql -U postgres -d tasks -c "SELECT * FROM tasks;"
```

![Postgres Data](db-screenshot.png)

---

## Interactive API Documentation

Interactive Swagger UI is served at **http://localhost:3000/docs**.

![Swagger UI](swagger.png)

---

## Project Structure

```
├── index.js          # Express server & route handlers
├── db.js             # PostgreSQL pool & auto-migration module
├── openapi.json      # OpenAPI 3.0 specification
├── Dockerfile        # Container build instructions for Express API
├── compose.yaml      # Docker Compose multi-container stack
├── .dockerignore     # Docker build exclusions
├── .env.example      # Environment variable template
├── .gitignore        # Git tracking exclusions (ignores .env, node_modules)
├── package.json      # Dependencies and start scripts
├── db-screenshot.png # PostgreSQL database inspection screenshot
├── swagger.png       # Swagger UI documentation screenshot
└── README.md         # Documentation
```

## License

ISC
