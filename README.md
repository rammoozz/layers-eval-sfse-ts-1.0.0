# Layers - Full Stack Developer Test

Welcome to the Layers technical assessment. This project tests your skills in TypeScript, React, Node.js, and modern web development practices.

## Project Structure

```
├── backend/     # Node.js + Express API
├── frontend/    # React + Vite + TypeScript
├── shared/      # Shared types and schemas
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```
   The backend will start on `http://localhost:3001`

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## Tasks

Your goal is to get the application working properly and complete any missing features.

### Login Credentials
Use these credentials to test the application:
- Email: `admin@test.com`
- Password: `password123`

### Main Objectives

1. **Get the application running**
   - Both frontend and backend should start without errors
   - You should be able to navigate between pages

2. **Fix build issues**
   - `npm run build` should succeed in the frontend
   - Resolve any TypeScript compilation errors

3. **Complete missing features**
   - User profile editing functionality
   - Data export feature
   - Real-time notifications

4. **Address any issues you discover**
   - Authentication and session management
   - UI/UX consistency
   - Performance optimization
   - Mobile responsiveness

### Development Focus

Pay attention to:

- TypeScript compilation and type safety
- React best practices and performance
- Database operations and data integrity
- UI consistency and responsive design
- Code quality and maintainability

### Submission

When complete, ensure:
- [ ] Both apps run successfully (`npm run dev`)
- [ ] Frontend builds without errors (`npm run build`)
- [ ] All major features work as expected
- [ ] Code follows TypeScript best practices
- [ ] UI is responsive and consistent

## Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests (if any)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Radix UI, GSAP
- **Backend**: Node.js, Express, TypeScript, SQLite, WebSocket
- **Validation**: Zod schemas
- **Build**: Vite + TypeScript compiler

## Notes

This assessment evaluates your ability to:
- Work with modern TypeScript and React
- Debug and optimize full-stack applications
- Handle real-world development scenarios
- Write clean, maintainable code

Take your time to explore the codebase and ensure everything works correctly. Good luck!