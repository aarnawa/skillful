# Migrating to PostgreSQL

We have successfully migrated the application's database driver and schema from SQLite to PostgreSQL. This change prepares the application for production deployment, as PostgreSQL correctly handles concurrent connections and serverless environments.

## What Changed

1. **Dependencies**: Removed `better-sqlite3` and installed `pg` (Node Postgres).
2. **Schema (`src/db/schema.ts`)**: 
   - Swapped `sqliteTable` for `pgTable`.
   - Updated data types mapping to Postgres standards (e.g. `serial("id")` for auto-incrementing primary keys, `varchar`, and `timestamp`).
3. **Database Connection (`src/db/index.ts`)**: 
   - Removed the local file-based initialization.
   - Now uses a connection pool `Pool` from the `pg` package connected via a `DATABASE_URL` environment variable.
4. **Configuration (`drizzle.config.ts`)**: Updated the Drizzle config dialect to `"postgresql"` and set it to read from `process.env.DATABASE_URL`.

## Steps You Need To Take Locally

To run the application locally, you must now run a PostgreSQL server and provide the connection string to the application.

1. **Install and start PostgreSQL** on your machine (e.g., via Postgres.app on macOS, Homebrew, or Docker).
2. **Create a Database**: Open `psql` or a GUI like pgAdmin and run:
   ```sql
   CREATE DATABASE skillful;
   ```
3. **Set Environment Variables**: 
   Open the newly created `.env.local` file at the root of the project. It contains a template `DATABASE_URL`. Adjust the username, password, and port if your local postgres installation differs from the default:
   ```env
   DATABASE_URL="postgres://postgres:postgres@localhost:5432/skillful"
   ```
4. **Push Schema & Seed**:
   Run Drizzle Kit to create the tables in your new Postgres database:
   ```bash
   npx drizzle-kit push
   ```
   Then trigger the seed process by visiting the home page `http://localhost:3000/` while the dev server is running, or by sending a POST request to `/api/seed`.
