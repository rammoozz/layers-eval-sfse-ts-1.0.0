# TODO - Layers Full Stack Developer Test

## 🚀 **Priority 1: Setup & Environment**
- [x] 📁 Create .gitignore files for backend and frontend  
- [x] 📁 Create root-level .gitignore to exclude node_modules
- [x] 🚀 Create startup scripts and package.json for running all platforms
- [x] 📦 Backend setup
  - [x] Run `npm install` in backend directory
  - [x] Copy `.env.example` to `.env`
  - [x] Start backend with `npm run dev` (should run on http://localhost:3001)
- [x] 🎨 Frontend setup  
  - [x] Run `npm install` in frontend directory
  - [x] Start frontend with `npm run dev` (should run on http://localhost:5173)
- [x] 🔗 Verify navigation between pages works
- [x] 🔐 Test login with credentials: admin@test.com / password123

## 🔧 **Priority 2: Fix Build Issues**
- [x] ❌ Fix TypeScript compilation errors in frontend
- [x] ✅ Ensure `npm run build` succeeds in frontend directory
- [x] 🛠️ Resolve any backend TypeScript compilation issues
- [x] ✔️ Verify `npm run build` works in backend (if applicable)
- [x] 🔧 Combine tsconfig.json files in frontend

## ⚙️ **Priority 3: Complete Missing Features** ✅
- [x] 👤 **User Profile Editing**
  - [x] 🎨 Implement profile editing UI components
  - [x] 🔗 Add backend API endpoints for profile updates
  - [x] 🔌 Connect frontend to backend for profile editing
  - [x] ✅ Add form validation and error handling
- [x] 📊 **Data Export Feature**
  - [x] 📋 Design export functionality (CSV, JSON formats)
  - [x] 🔗 Implement backend export endpoints
  - [x] 🎛️ Add export UI controls
  - [x] 🧪 Test export functionality
- [x] 🔔 **Real-time Notifications**
  - [x] 🔌 Implement WebSocket connection handling
  - [x] 🎨 Add notification UI components
  - [x] 📱 Create notification state management
  - [x] 🧪 Test real-time functionality

## 🔍 **Priority 4: Address Discovered Issues**

### 🚨 **Critical Security Issues**
- [x] 🚨 **Fix Authentication Bypass Vulnerability** (`backend/src/middleware/auth.ts:16-18`)
  - [x] Move `next()` call after token verification instead of before
  - [x] Ensure unauthenticated requests cannot access protected endpoints
  - [x] Add proper error handling for invalid tokens

### 🐛 **Logic & Data Bugs**
- [x] 🔄 **Fix Parameter Order Bug** (`shared/types.ts:49`)
  - [x] Correct `getUserOrder()` function to return parameters in correct order
  - [x] Update: `"Fetching order ${orderId} for user ${userId}"`
- [x] 📈 **Fix Ascending Sort Logic** (`frontend/src/utils/helpers.ts:72`)
  - [x] Change `sortArrayAscending()` to use `['asc']` instead of `['desc']`
- [x] 💰 **Fix Discount Calculation Bug** (`frontend/src/utils/helpers.ts:82`)
  - [x] Change calculation to subtract discount: `originalPrice - (originalPrice * discountPercent / 100)`
- [x] 🔤 **Fix Unicode Character Bug** (`shared/types.ts:31`)
  - [x] Replace Cyrillic 'е' with Latin 'e' in `defaultUsеrId`
  - [x] Add e2e tests for unicode character fix

### ⚠️ **Type & Dependency Issues**
- [x] 🔄 **Resolve Circular Type Dependency** (`shared/schemas.ts:60-68`)
  - [x] Fix circular reference between `AuthUser` and `UserPermissions` types
- [x] 📦 **Standardize Zod Versions**
  - [x] Update root package.json zod from `^4.1.4` to match backend/frontend versions
  - [x] Ensure consistent zod version across all packages (all now using ^3.22.4)

### ⚡ **Performance Issues**
- [ ] 📦 **Optimize Lodash Bundle Size** (`frontend/src/utils/helpers.ts:1`)
  - [ ] Replace `import * as _` with specific imports
  - [ ] Use `import { cloneDeep, filter, orderBy }` etc.

- [ ] 🔐 **Authentication & Session Management**
  - [ ] 📱 Ensure proper session handling
  - [ ] 🔄 Add token refresh mechanism
  - [ ] 🧪 Test login/logout flow
- [ ] 🎨 **UI/UX Consistency**
  - [ ] 👀 Review component styling consistency
  - [ ] 🎛️ Ensure proper use of design system (Radix UI + TailwindCSS)
  - [x] 🔧 Fix any visual inconsistencies (Fixed: white text on white background in dashboard cards)
  - [x] 🔐 **Login Page Improvements** (`frontend/src/pages/Login.tsx`)
    - [x] Add autofocus to email input field
    - [x] Ensure Enter key submits the login form
  - [x] 🎨 **Fix Settings Page Visual Issues** (`frontend/src/pages/Settings.tsx`)
    - [x] Change all setting labels from `text-sm` to `text-sm text-gray-700` for better contrast
    - [x] Replace HTML `<select>` elements with styled Select components
    - [x] Add consistent width classes to all Select components
  - [x] 👤 **Fix Profile Page Visual Issues** (`frontend/src/pages/Profile.tsx`)
    - [x] Standardize text color hierarchy (labels: `text-gray-700`, values: `text-gray-900`, meta: `text-gray-600`)
    - [x] Improve activity section contrast and spacing
    - [x] Add consistent icon colors (`text-gray-500` for icons)
  - [x] 🧩 **Fix Header Component Issues** (`frontend/src/components/Header.tsx`)
    - [x] Remove dynamic `getHeaderPadding()` function - use consistent `px-6 py-4`
    - [x] Remove dynamic `getLogoTransform()` function - eliminate arbitrary positioning
    - [x] Add hover transitions and background colors to navigation links
- [ ] ⚡ **Performance Optimization**
  - [ ] 🔍 Review React component performance
  - [ ] 🗃️ Optimize database queries
  - [ ] ⏳ Add loading states where needed
  - [ ] 🛡️ Implement proper error boundaries
- [ ] 📱 **Mobile Responsiveness**
  - [ ] 📏 Test on mobile viewport sizes
  - [ ] 🔧 Fix responsive design issues
  - [ ] 👆 Ensure touch-friendly interactions

## ✅ **Priority 5: Quality Assurance**
- [ ] 📝 **TypeScript Best Practices**
  - [x] 🔍 Review type definitions in shared/
  - [ ] ✅ Ensure proper typing throughout codebase
  - [ ] 🚫 Fix any `any` types or missing types
- [ ] ⚛️ **React Best Practices**  
  - [ ] 🔍 Review component structure and hooks usage
  - [ ] 📋 Ensure proper dependency arrays
  - [ ] 🔑 Add proper key props for lists
- [ ] 🗃️ **Database & API**
  - [ ] 🧪 Test all API endpoints
  - [ ] ✅ Verify data integrity
  - [ ] ❌ Check error handling
- [ ] 🧹 **Code Quality**
  - [ ] 📏 Ensure consistent code style
  - [ ] 🗑️ Remove unused imports/code
  - [ ] 🛡️ Add proper error boundaries

## 🎯 **Final Verification Checklist**
- [ ] 🚀 Both apps run successfully (`npm run dev`)
- [ ] 🏗️ Frontend builds without errors (`npm run build`)  
- [ ] ✅ All major features work as expected
- [ ] 🔐 Login works with test credentials
- [ ] 📝 Code follows TypeScript best practices
- [ ] 📱 UI is responsive and consistent
- [ ] 🚫 No console errors in browseryes
- [ ] 🔗 All API endpoints respond correctly

## 🛠️ **Available Scripts**
- Root level: `npm run dev` (starts both backend and frontend)
- Root level: `npm run setup` (installs all dependencies and sets up .env)
- Windows: Double-click `start-dev.bat`
- Unix/Mac: Run `./start-dev.sh`

## 🛠️ **Tech Stack Reference**
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Radix UI, GSAP
- **Backend**: Node.js, Express, TypeScript, SQLite, WebSocket
- **Validation**: Zod schemas
- **Build**: Vite + TypeScript compiler

## 📝 **Notes**
- Use test credentials: admin@test.com / password123
- Backend runs on http://localhost:3001
- Frontend runs on http://localhost:5173
- Keep code small, reusable, fully typed, and production ready