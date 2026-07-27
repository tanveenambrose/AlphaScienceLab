# Alpha Science Lab (ASL) - OpenCode Agent Instructions

## Overview
Alpha Science Lab is an advanced web platform built with Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS, GSAP, Lenis Smooth Scroll, and Firebase Admin SDK.

## Key Development Guidelines
1. **Windows Command Execution**:
   - On Windows, always invoke NPM and Node commands using `cmd /c npm ...` or `powershell -ExecutionPolicy Bypass -Command "..."` to bypass PowerShell script restrictions on `npx.ps1` / `npm.ps1`.

2. **Next.js Dynamic API Routes**:
   - In Next.js 16, Route Handler `params` are Promises. Always await `props.params` (e.g. `const { id } = await props.params`).

3. **Type Safety & Linting**:
   - Maintain 0 ESLint errors and warnings (`npm run lint`).
   - Avoid using `any` types; use explicit interfaces (`ProjectItem`, `Member`, `JoinRequestItem`, `GalleryImage`).

4. **Environment Variables**:
   - Client keys prefix with `NEXT_PUBLIC_FIREBASE_*`.
   - Server keys use `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` in `.env.local` (fallback configured via `firebaseServiceAccount.ts`).

## Main Scripts
- **Development**: `cmd /c npm run dev`
- **Build**: `cmd /c npm run build`
- **Lint**: `cmd /c npm run lint`
