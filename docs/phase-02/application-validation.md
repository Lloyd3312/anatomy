# Phase 2 — Application Validation and Baseline Testing

## Objective

The objective of this phase was to verify that the application could install, build, test, lint, and run successfully before introducing Docker or CI/CD automation.

This establishes a known-good application baseline before containerization.

---

## Why Validate the Application First?

A CI/CD pipeline should automate a process that is already understood and proven manually.

Before creating GitHub Actions workflows, I verified the application directly inside GitHub Codespaces.

The validation process included:

- Installing dependencies
- Running the development server
- Testing the application in a browser
- Running ESLint
- Running automated tests
- Creating a production build
- Reviewing dependency vulnerabilities

---

## Dependency Installation

Because the project contains a `package-lock.json`, dependencies were installed using:

```bash
npm ci