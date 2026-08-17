# Phase 3 — Docker Containerization

## Objective

The objective of this phase was to containerize the Anatomy Atelier application from scratch using Docker.

The inherited Docker configuration was removed so that a new containerization workflow could be created, tested, understood, and documented independently.

## Why Docker?

Docker packages an application together with the runtime and dependencies it requires.

This allows the application to run consistently across different environments such as:

* GitHub Codespaces
* CI runners
* developer machines
* Kubernetes clusters
* AWS EKS

The goal is to create the application image once and use the same image throughout the deployment pipeline.

## Docker Workflow

The workflow implemented in this phase is:

```text
Application Source
       ↓
Dockerfile
       ↓
docker build
       ↓
Docker Image
       ↓
docker run
       ↓
Container
       ↓
Vinext Production Server
       ↓
Port 3000
       ↓
Anatomy Atelier
```

## Creating the Dockerfile

A new Dockerfile was written from scratch.

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Dockerfile Explanation

### Base Image

```dockerfile
FROM node:24-alpine
```

The application requires Node.js 22.13 or newer.

Node.js 24 was selected because it satisfies the application requirement and had already been verified successfully in the GitHub Codespaces development environment.

The Alpine variant provides a smaller Linux base image than a full Node.js distribution.

### Working Directory

```dockerfile
WORKDIR /app
```

This creates and selects `/app` as the working directory inside the container.

Subsequent Docker instructions execute relative to this directory.

### Copy Dependency Files

```dockerfile
COPY package.json package-lock.json ./
```

The dependency files are copied before the rest of the application source.

This structure allows Docker to reuse the dependency installation layer when application source code changes without changes to the dependency files.

### Install Dependencies

```dockerfile
RUN npm ci
```

`npm ci` installs the exact dependency versions defined by `package-lock.json`.

This improves reproducibility compared with installing potentially different dependency versions.

### Copy Application Source

```dockerfile
COPY . .
```

The remaining application source is copied into the image after dependency installation.

### Production Build

```dockerfile
RUN npm run build
```

This generates the Vinext production build.

### Expose Application Port

```dockerfile
EXPOSE 3000
```

The Vinext production server listens on port `3000`.

### Start Application

```dockerfile
CMD ["npm", "start"]
```

When the container starts, npm launches the Vinext production server.

---

## Docker Ignore File

A `.dockerignore` file was created to prevent unnecessary files from entering the Docker build context.

```text
node_modules
.git
.github
docs
dist
.next
.vinext
.wrangler
coverage
.env
.env.*
npm-debug.log*
.DS_Store
```

This prevents local dependencies, Git history, generated output, documentation, environment files and other unnecessary files from being copied into the image build context.

## Building the Image

The Docker image was created using:

```bash
docker build -t anatomy:v1 .
```

### Command Explanation

```text
docker       Docker CLI
build        Build a Docker image
-t           Assign a name/tag
anatomy:v1   Image name and version
.            Use current directory as build context
```

The build completed successfully.

## Running the Container

The image was started using:

```bash
docker run -d \
  --name anatomy-v1 \
  -p 8080:3000 \
  anatomy:v1
```

### Port Mapping

```text
8080:3000
```

means:

```text
Codespace/Host port 8080
        ↓
Container port 3000
```

The application itself continues listening on port 3000 inside the container.

## Container Verification

The running container was verified using:

```bash
docker ps
```

The container was successfully running and exposing:

```text
0.0.0.0:8080->3000/tcp
```

## Application Logs

Logs were inspected using:

```bash
docker logs anatomy-v1
```

The output confirmed:

```text
vinext start (port 3000)

Production server running at http://0.0.0.0:3000
```

## HTTP Verification

The application endpoint was tested using:

```bash
curl -I http://localhost:8080
```

The server returned:

```text
HTTP/1.1 200 OK
content-type: text/html; charset=utf-8
```

## Application-Level Verification

HTTP `200` alone does not prove that the correct application is being served.

The response body was therefore checked using:

```bash
curl -s http://localhost:8080 | grep -o "Anatomy Atelier" | head
```

The expected Anatomy Atelier content was returned successfully.

This proved that the running container was serving the intended application.

## Troubleshooting Lessons

Several issues were encountered while building the Docker implementation.

### Image Did Not Exist

Attempting to run:

```bash
docker run ... anatomy:v1
```

before creating the image caused Docker to attempt to pull the image from a registry.

The correct order is:

```text
docker build
     ↓
docker run
```

### Dockerfile Syntax Errors

During the initial Dockerfile creation, several typographical mistakes were identified and corrected, including:

```text
nom → npm
EPOSE → EXPOSE
["npm". "start"] → ["npm", "start"]
```

This demonstrated the importance of reviewing Dockerfile syntax before building an image.

### Container Verification

A previous inherited implementation returned HTTP `200` while displaying the default Nginx page.

For this reason, the Docker validation process now verifies both:

1. HTTP availability
2. Expected application content

This provides stronger evidence that the correct workload is running.

## Final Phase Status

| Check                            | Result |
| -------------------------------- | ------ |
| Dockerfile created               | ✅      |
| `.dockerignore` created          | ✅      |
| Dependency installation          | ✅      |
| Production build                 | ✅      |
| Docker image build               | ✅      |
| Container startup                | ✅      |
| Vinext production server         | ✅      |
| Port mapping                     | ✅      |
| HTTP response                    | ✅      |
| Application content verification | ✅      |

## Key Lessons

This phase demonstrated:

* The difference between Docker images and containers
* How to build an image from a Dockerfile
* How Docker layer ordering affects dependency caching
* Why `.dockerignore` is important
* How host-to-container port mapping works
* How to inspect container logs
* Why HTTP status alone is not sufficient application verification
* How Docker provides a consistent runtime for future CI/CD and Kubernetes environments

## Next Phase

Phase 4 will implement Continuous Integration using GitHub Actions.

The CI pipeline will automate application validation and Docker image creation whenever code is pushed or submitted through a pull request.
