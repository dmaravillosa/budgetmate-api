---
name: api-creation
user-invocable: true
description: "Create or extend Express API endpoints, controllers, services, and routes in this repository using the project's existing TypeScript/Knex conventions. Use when adding CRUD or resource API functionality for backend entities."
applyTo:
  - "src/**"
---

# API Creation Skill

Use this skill to generate or extend backend API functionality in `src/`.

## What it does

- Identifies existing Express, route, controller, and service conventions in the repository
- Generates new API route files under `src/routes`
- Creates matching controller handlers under `src/controllers`
- Adds supporting service functions under `src/services`
- Updates the main router in `src/routes/index.ts`
- Reuses existing database connection and TypeScript patterns

## How to use

Ask the assistant something like:

- `/api-creation create CRUD API for expense`
- `/api-creation add endpoint for invoices with create/read/update/delete`
- `/api-creation generate a users API route, controller, and service`

## Guidelines for the assistant

- Inspect current repository structure before creating files
- Reuse existing file patterns and naming conventions
- Add only the minimal set of files needed for the requested API
- Keep error handling consistent with the project's style
- Wire new routes into `src/routes/index.ts`
- Prefer centralized middleware and reusable helpers when possible
