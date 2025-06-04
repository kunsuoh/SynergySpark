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
  - `nginx.conf`: Custom Nginx configuration for the frontend.
- `backend/`: Contains the Node.js backend server.
  - `server.js`: The main backend server file.
  - `database/`: (Gitignored, created by server) Directory for SQLite database.
  - `package.json`, `package-lock.json`: Node.js project files.
  - `Dockerfile`: For building the backend Docker image.
  - `.gitignore`: Ignores `node_modules/` and `database/`.
- `letsencrypt/`: (Created by user, mounted into Traefik) Stores ACME certificates.
- `frontend.Dockerfile`: For building the frontend Docker image.
- `docker-compose.yml`: For orchestrating the entire application with Docker Compose.
- `traefik.yml`: (Reference) Traefik configuration file (primary config via `docker-compose.yml` commands for this project).
- `.env.example`: Example environment file for API keys.
- `README.md`: This file.
- `script.js`: (Deprecated) Original monolithic script. Kept for reference if needed but not used by `index.html`.

## Prerequisites for Running the Full Application
- Docker installed on your system.
- Docker Compose installed on your system.
- A domain name (e.g., `synergy.droh.company`) pointing to your server's public IP address (for HTTPS via Traefik).
- Ports 80 and 443 open on your server/firewall and directed to the host running Docker (for Traefik).

## Configuration: Setting up the Gemini API Key

This application uses the Google Gemini API to generate personalized feedback. To enable this feature, you need to obtain a Gemini API key and make it available to the backend service.

1.  **Obtain an API Key:**
    - Go to [Google AI Studio](https://aistudio.google.com/apikey) (or Google Cloud Console).
    - Create a new project if you don't have one.
    - Generate an API key for the Gemini API. **Keep this key secure and do not commit it to version control.**

2.  **Create a `.env` file:**
    - In the root directory of this project, create a file named `.env`.
    - Copy the contents of `.env.example` into your new `.env` file.
    - Replace `YOUR_GEMINI_API_KEY_HERE` with the actual API key you obtained.
      ```env
      # .env
      GEMINI_API_KEY=your_actual_gemini_api_key
      ```
    - The `.env` file is listed in the root `.gitignore`, so your API key will not be committed.

The `docker-compose.yml` file is configured to read the `GEMINI_API_KEY` from this `.env` file and pass it to the backend service. If this key is not provided or is invalid, AI feedback generation will fail or be disabled.

## Running the Application

There are multiple ways to run the SynergySpark application:

### 1. Using Docker Compose (Recommended for Full Stack with HTTPS)

This is the recommended method for running the integrated SynergySpark application (frontend, backend with database, and Traefik for HTTPS) locally or for deployment.

**Prerequisites (Recap):**
- Docker and Docker Compose installed.
- Domain name configured and pointing to your server IP.
- Ports 80 & 443 open and forwarded.
- **Valid email address** to replace `your-email@example.com` in `docker-compose.yml` (for the `traefik` service's Let's Encrypt configuration).
- **`GEMINI_API_KEY` configured in a `.env` file** as described above.

**Build and Run:**
Navigate to the root directory of the project (where `docker-compose.yml` is located).
Run the following command to build the images (if they don't exist or have changed) and start the services:
```bash
docker-compose up --build
```
- The `--build` flag ensures images are rebuilt if there are changes to Dockerfiles or application code.
- To run in detached mode (in the background), add the `-d` flag: `docker-compose up --build -d`.

**Accessing the Application:**
- **Frontend Web Application:** `https://synergy.droh.company` (HTTP will automatically redirect to HTTPS).
- **Traefik Dashboard (for debugging, if enabled):** `http://localhost:8081` (Ensure `api.insecure=true` is set for Traefik in `docker-compose.yml` for local access. **Secure or disable for production.**)
- **Backend API (for direct testing, if needed, though typically accessed via Traefik):** The backend is not directly exposed to the host by default when using Traefik for external access. Traefik routes `/api` requests to it.

**Stopping the Application:**
To stop all services and remove the containers and networks:
```bash
docker-compose down
```
If you ran in detached mode, you can also stop with `docker-compose stop`.

**Data Persistence:**
The backend database (SQLite) is persisted using a Docker named volume (`synergyspark_db_data`). This means your assessment data will remain even if you stop and restart the containers. To remove the volume (and all data), you can run `docker volume rm synergyspark_db_data` after running `docker-compose down`. **Be cautious with this command as it deletes data.**

### Backend Service Notes
- The backend service now requires the `GEMINI_API_KEY` as configured in the `.env` file.
- The backend Docker image has been updated to use Node.js 20.x to support the latest Google Generative AI SDK.

### HTTPS and Traefik Configuration Details

- **SSL/TLS Termination:** Traefik handles SSL/TLS termination for the `synergy.droh.company` domain. This means HTTPS connections are decrypted by Traefik, and traffic to backend services can be plain HTTP within the Docker network.
- **Let's Encrypt:** Traefik is configured to automatically obtain and renew SSL certificates from Let's Encrypt using the HTTP-01 challenge.
    - **Email:** You **must** replace `your-email@example.com` in the `traefik` service command arguments within `docker-compose.yml` with a valid email address.
    - **DNS & Ports:** Ensure your domain's DNS A record points to your server's IP, and ports 80 (for HTTP challenge) and 443 (for HTTPS) are open and correctly routed to the Traefik container.
- **Testing with Staging Server:** For initial testing or to avoid Let's Encrypt production rate limits, you can use the Let's Encrypt staging environment. In `docker-compose.yml`, within the `traefik` service's `command` section, comment out the production `caServer` line and uncomment the line for `https://acme-staging-v02.api.letsencrypt.org/directory`. Staging certificates are not trusted by browsers but are useful for verifying setup.
- **`traefik.yml` vs. CLI commands:** This project primarily configures Traefik via command-line arguments in `docker-compose.yml` for clarity in this context. The `traefik.yml` file is provided as a common alternative configuration method; if you prefer to use it, you would mount it to `/etc/traefik/traefik.yml` in the Traefik service and remove corresponding CLI arguments.

### 2. Running Individual Services with Docker (Legacy / For Specific Testing)

These methods are useful for testing parts of the application in isolation but do not include the full Traefik HTTPS setup or `.env` file integration for API keys.

#### Frontend Only

(Note: Without Traefik or manual proxy setup, API calls to the backend will not work if the backend is running in a separate container without direct port exposure or CORS configured.)

**Build the Docker image:**
```bash
docker build -t synergyspark-frontend -f frontend.Dockerfile .
```

**Run the Docker container:**
```bash
docker run -d -p 8080:80 synergyspark-frontend
```
(The application will be accessible at `http://localhost:8080`.)

**To stop the container:**
First, find the container ID: `docker ps`
Then, stop it using the ID: `docker stop <container_id>`

#### Backend Only (Independently)

(Note: When running independently, you would need to manually set the `GEMINI_API_KEY` and `PORT` environment variables, e.g., `docker run -d -p 3000:3000 -e PORT=3000 -e GEMINI_API_KEY=your_key synergyspark-backend`)

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