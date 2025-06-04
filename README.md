# SynergySpark - Team Collaboration Assessment Tool

This is a web-based tool to assess an individual's collaboration style and strengths.
The original `script.js` has been refactored into `main.js`, `ui.js`, `scoring.js`, and `feedback.js`.

## Project Structure
- `frontend/`: Contains all frontend static assets.
  - `index.html`: The main HTML file.
  - `style.css`: CSS styles for the application.
  - `main.js`: Main JavaScript file for application logic orchestration.
  - `ui.js`: JavaScript for UI interactions and DOM manipulation.
  - `scoring.js`: JavaScript for survey scoring logic.
  - `feedback.js`: JavaScript for generating AI-driven feedback.
  - `nginx.conf`: Custom Nginx configuration for the frontend, including reverse proxy.
- `backend/`: Contains the Node.js backend server.
  - `server.js`: The main backend server file.
  - `database/`: (Gitignored, created by server) Directory for SQLite database.
  - `package.json`, `package-lock.json`: Node.js project files.
  - `Dockerfile`: For building the backend Docker image.
  - `.gitignore`: Ignores `node_modules/` and `database/`.
- `frontend.Dockerfile`: For building the frontend Docker image (build context is repository root).
- `docker-compose.yml`: For orchestrating the entire application with Docker Compose.
- `README.md`: This file.
- `script.js`: (Deprecated) Original monolithic script. Kept for reference if needed but not used by `index.html`.

## Running the Application

There are multiple ways to run the SynergySpark application:

### 1. Using Docker Compose (Recommended for Full Stack)

This is the recommended method for running the integrated SynergySpark application (frontend and backend with database) locally.

**Prerequisites:**
- Docker installed on your system.
- Docker Compose installed on your system.

**Build and Run:**
Navigate to the root directory of the project (where `docker-compose.yml` is located).
Run the following command to build the images (if they don't exist or have changed) and start the services:
```bash
docker-compose up --build
```
- The `--build` flag ensures images are rebuilt if there are changes to Dockerfiles or application code.
- To run in detached mode (in the background), add the `-d` flag: `docker-compose up --build -d`.

**Accessing the Application:**
- Frontend Web Application: `http://localhost:8080`
- Backend API (if direct access is needed for testing): `http://localhost:3000/api/assessments` (e.g., to view raw data from the GET endpoint)

**Stopping the Application:**
To stop all services and remove the containers and networks:
```bash
docker-compose down
```
If you ran in detached mode, you can also stop with `docker-compose stop`.

**Data Persistence:**
The backend database (SQLite) is persisted using a Docker named volume (`synergyspark_db_data`). This means your assessment data will remain even if you stop and restart the containers. To remove the volume (and all data), you can run `docker volume rm synergyspark_db_data` after running `docker-compose down`. Be cautious with this command as it deletes data.

### 2. Running Individual Services with Docker

These methods are useful for testing or running parts of the application in isolation.

#### Frontend Only

**Build the Docker image:**
```bash
docker build -t synergyspark-frontend -f frontend.Dockerfile .
```

**Run the Docker container:**
```bash
docker run -d -p 8080:80 synergyspark-frontend
```
(The application will be accessible at `http://localhost:8080`. API calls will fail unless a backend is running and accessible.)

**To stop the container:**
First, find the container ID: `docker ps`
Then, stop it using the ID: `docker stop <container_id>`

#### Backend Only (Independently)

**Build the Docker image:**
(Ensure your terminal is at the project root)
```bash
docker build -t synergyspark-backend ./backend
# Or, navigate to backend directory and run:
# cd backend
# docker build -t synergyspark-backend .
# cd ..
```

**Run the Docker container:**
```bash
docker run -d -p 3000:3000 -e PORT=3000 synergyspark-backend
```
(The backend server will be running on `http://localhost:3000`)

**To stop the container:**
First, find the container ID: `docker ps`
Then, stop it using the ID: `docker stop <container_id>`