# Phase 1 — GitHub Forking and Codespaces Setup

## Objective

The objective of this phase is to create an isolated development environment for the project using GitHub Codespaces and verify the existing repository before making any changes.

## Why GitHub Codespaces?

GitHub Codespaces provides a cloud-based Linux development environment directly connected to the GitHub repository.

For this project, Codespaces was selected so the entire DevOps workflow could be built without depending on software installed on a local computer.

## Repository Setup

The original project was forked from:

`santos-alaska/anatomy`

The fork used for this project is:

`Lloyd3312/anatomy`

## Git Remote Configuration

The repository contains two Git remotes:

- `origin` — my fork of the repository
- `upstream` — the original project

This allows me to develop independently while still retaining a reference to the original source project.

## Development Environment

The project is developed using GitHub Codespaces.

Environment verified during setup:

- Node.js: v24.14.0
- npm: 11.9.0
- Docker: 29.3.0-1
- Git: 2.53.0

## Repository Inspection

Before changing the project, I inspected:

- `package.json`
- `Jenkinsfile`
- `Dockerfile`
- Kubernetes manifests
- existing tests
- `.gitignore`
- existing README documentation

This inspection was performed to understand the original architecture and identify areas that could be improved.

## Original CI/CD Architecture

The original project uses:

- GitHub for source control
- Jenkins for Continuous Integration
- Docker and Docker Hub for containerization
- Kubernetes on AWS EKS
- ArgoCD for Continuous Deployment
- Prometheus and Grafana for monitoring

## Planned Architecture Change

The Jenkins CI layer will be replaced with GitHub Actions.

The target architecture is:

Developer → GitHub → GitHub Actions → Docker Hub → Kubernetes manifests → ArgoCD → AWS EKS

## Initial Observations

Several areas were identified for improvement:

1. The application requires Node.js version 22.13 or newer, while the existing Dockerfile uses Node 20.
2. The existing Jenkins pipeline does not explicitly run linting before publishing a container image.
3. The project contains automated tests that should be integrated into the new CI pipeline.
4. The original CI implementation uses broader credentials and permissions than necessary.
5. The existing documentation contains both automated and manual Jenkins build instructions, which creates inconsistency.

These items will be investigated and improved during later phases.

## Verification Commands

```bash
pwd
whoami
git status
git branch
git remote -v
git log --oneline --all --decorate -10
node --version
npm --version
docker --version
git --version