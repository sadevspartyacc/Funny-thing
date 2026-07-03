# TextCloud

Simple text-sharing app where anyone can submit `username: text`. Includes Recent and Search tabs. Posts are stored permanently in an SQLite database.

## Run locally

1. Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   npm start
   ```
3. Open http://localhost:3000

## Endpoints

- POST /api/posts
  - Body: { "username": "...", "text": "..." }
  - Returns the saved post
- GET /api/recent?limit=50
  - Returns recent posts (default limit 50)
- GET /api/posts?q=term&limit=100
  - Search username or text

## Notes
- Data persisted in `data.db` (SQLite) in the project folder.
- No authentication—anyone with access can post. If you want per-user accounts or moderation, I can add that.

## To publish to GitHub
Push these files to a repository named `textcloud`, or rename your existing repository and merge the branch I created.
