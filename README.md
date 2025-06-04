# SynergySpark - Team Collaboration Assessment Tool

This is a web-based tool to assess an individual's collaboration style and strengths.
The original `script.js` has been refactored into `main.js`, `ui.js`, `scoring.js`, and `feedback.js`.

## Running with Docker (Frontend Only)

This section describes how to run the frontend application using Docker.

**Prerequisites:**
- Docker installed on your system.

**Build the Docker image:**
```bash
docker build -t synergyspark-frontend .
```

**Run the Docker container:**
```bash
docker run -d -p 8080:80 synergyspark-frontend
```
(The application will be accessible at `http://localhost:8080`)

**To stop the container:**
First, find the container ID:
```bash
docker ps
```
Then, stop it using the ID:
```bash
docker stop <container_id>
```

## Project Structure
- `index.html`: The main HTML file.
- `style.css`: CSS styles for the application.
- `main.js`: Main JavaScript file for application logic orchestration.
- `ui.js`: JavaScript for UI interactions and DOM manipulation.
- `scoring.js`: JavaScript for survey scoring logic.
- `feedback.js`: JavaScript for generating AI-driven feedback.
- `Dockerfile`: For building the frontend Docker image.
- `script.js`: (Deprecated) Original monolithic script. Kept for reference if needed but not used by `index.html`.