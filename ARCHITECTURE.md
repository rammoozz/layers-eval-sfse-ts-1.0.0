# Application Architecture

## System Overview

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        App[App.tsx<br/>Main Application]
        
        subgraph "Pages"
            Login[Login Page]
            Dashboard[Dashboard]
            Profile[Profile]
            Settings[Settings]
        end
        
        subgraph "Components"
            Header[Header Component]
            Protected[Protected Route]
            NotifDropdown[Notification Dropdown]
            ThemeToggle[Theme Toggle]
        end
        
        subgraph "Hooks & Context"
            AuthHook[useAuth Hook]
            AppStateHook[useAppState Hook]
            NotifHook[useNotifications Hook]
            ThemeContext[Theme Context]
        end
        
        subgraph "Services"
            APIService[API Service<br/>HTTP Client]
        end
    end
    
    subgraph "Backend (Express + TypeScript)"
        Express[Express Server<br/>Port 3001]
        
        subgraph "API Routes"
            AuthRoutes[Auth Routes<br/>/api/auth]
            UserRoutes[User Routes<br/>/api/users]
            NotifRoutes[Notification Routes<br/>/api/notifications]
        end
        
        subgraph "Services & Middleware"
            AuthService[Auth Service<br/>JWT Management]
            WSService[WebSocket Service<br/>Real-time Updates]
            AuthMiddleware[Auth Middleware]
        end
        
        subgraph "Database Layer"
            SQLite[(SQLite Database)]
            DBInit[DB Initializer]
            Seeder[Data Seeder]
        end
    end
    
    subgraph "Shared Resources"
        Types[TypeScript Types]
        Schemas[Zod Schemas]
    end
    
    subgraph "Testing (Playwright)"
        E2E[E2E Test Suite<br/>- Login Tests<br/>- Profile Tests<br/>- Notification Tests<br/>- Data Export Tests<br/>- Integration Tests]
    end
    
    %% Frontend Connections
    App --> Login
    App --> Dashboard
    App --> Profile
    App --> Settings
    App --> Header
    
    Protected -.->|protects| Dashboard
    Protected -.->|protects| Profile
    Protected -.->|protects| Settings
    
    Header --> NotifDropdown
    Header --> ThemeToggle
    
    Login --> AuthHook
    Dashboard --> AppStateHook
    Profile --> AuthHook
    Settings --> AppStateHook
    NotifDropdown --> NotifHook
    
    AuthHook --> APIService
    AppStateHook --> APIService
    NotifHook --> APIService
    NotifHook -.->|WebSocket| WSService
    
    %% Frontend to Backend
    APIService ==>|HTTP/REST| Express
    
    %% Backend Connections
    Express --> AuthRoutes
    Express --> UserRoutes
    Express --> NotifRoutes
    Express --> WSService
    
    AuthRoutes --> AuthService
    AuthRoutes --> SQLite
    
    UserRoutes --> AuthMiddleware
    UserRoutes --> SQLite
    
    NotifRoutes --> AuthMiddleware
    NotifRoutes --> SQLite
    NotifRoutes --> WSService
    
    AuthMiddleware --> AuthService
    AuthService --> SQLite
    
    DBInit --> SQLite
    Seeder --> SQLite
    
    %% Shared Resources
    APIService -.->|imports| Types
    AuthRoutes -.->|validates| Schemas
    UserRoutes -.->|imports| Types
    
    %% Testing
    E2E ==>|tests| App
    E2E ==>|tests| Express
    
    classDef frontend fill:#4ade80,stroke:#22c55e,stroke-width:2px,color:#fff
    classDef backend fill:#60a5fa,stroke:#3b82f6,stroke-width:2px,color:#fff
    classDef database fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef shared fill:#a78bfa,stroke:#9333ea,stroke-width:2px,color:#fff
    classDef testing fill:#f87171,stroke:#ef4444,stroke-width:2px,color:#fff
    
    class App,Login,Dashboard,Profile,Settings,Header,Protected,NotifDropdown,ThemeToggle,AuthHook,AppStateHook,NotifHook,ThemeContext,APIService frontend
    class Express,AuthRoutes,UserRoutes,NotifRoutes,AuthService,WSService,AuthMiddleware backend
    class SQLite,DBInit,Seeder database
    class Types,Schemas shared
    class E2E testing
```

## Data Flow Example: User Authentication

```mermaid
sequenceDiagram
    participant User
    participant LoginPage
    participant useAuth
    participant APIService
    participant Express
    participant AuthRoute
    participant AuthService
    participant Database
    
    User->>LoginPage: Enter credentials
    LoginPage->>useAuth: Call login()
    useAuth->>APIService: POST /api/auth/login
    APIService->>Express: HTTP Request
    Express->>AuthRoute: Route handler
    AuthRoute->>AuthService: Validate credentials
    AuthService->>Database: Query user
    Database-->>AuthService: User data
    AuthService-->>AuthRoute: Generate JWT
    AuthRoute-->>Express: Success + Token
    Express-->>APIService: HTTP Response
    APIService-->>useAuth: Store token
    useAuth-->>LoginPage: Update auth state
    LoginPage-->>User: Redirect to Dashboard
```

## Component Hierarchy

```mermaid
graph TD
    App[App.tsx]
    App --> ThemeProvider
    ThemeProvider --> AppStateProvider
    AppStateProvider --> AuthProvider
    AuthProvider --> NotificationProvider
    NotificationProvider --> Router
    Router --> Header
    Router --> Routes
    
    Routes --> LoginRoute["/login → Login Page"]
    Routes --> DashboardRoute["/ → Protected → Dashboard"]
    Routes --> ProfileRoute["/profile → Protected → Profile"]
    Routes --> SettingsRoute["/settings → Protected → Settings"]
    
    Header --> Logo
    Header --> Navigation
    Header --> UserMenu
    UserMenu --> NotificationDropdown
    UserMenu --> ThemeToggle
    UserMenu --> ProfileLink
    UserMenu --> LogoutButton
```

## API Endpoints

```mermaid
graph LR
    subgraph "Authentication"
        POST_Login[POST /api/auth/login]
        POST_Register[POST /api/auth/register]
        POST_Logout[POST /api/auth/logout]
    end
    
    subgraph "User Management"
        GET_Profile[GET /api/users/profile]
        PUT_Profile[PUT /api/users/profile]
        GET_Stats[GET /api/users/stats]
    end
    
    subgraph "Notifications"
        GET_Notif[GET /api/notifications]
        PUT_Read[PUT /api/notifications/:id/read]
        DELETE_Notif[DELETE /api/notifications/:id]
    end
    
    subgraph "WebSocket Events"
        WS_Connect[WS: connection]
        WS_Auth[WS: authenticate]
        WS_Notif[WS: notification]
        WS_Update[WS: update]
    end
```

## Technology Stack

```mermaid
mindmap
  root((Layers App))
    Frontend
      React 18
      TypeScript
      Vite
      TailwindCSS
      React Router
      Shadcn/ui
    Backend
      Node.js
      Express
      TypeScript
      SQLite
      JWT Auth
      WebSockets
    Testing
      Playwright
      E2E Tests
    DevOps
      Concurrently
      NPM Scripts
    Shared
      Zod Validation
      TypeScript Types
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        DevFrontend[Frontend Dev Server<br/>localhost:5173]
        DevBackend[Backend Dev Server<br/>localhost:3001]
        DevDB[(SQLite Dev DB)]
        DevWS[WebSocket Server]
    end
    
    subgraph "Production Environment"
        ProdNginx[Nginx<br/>Static Files]
        ProdNode[Node.js Server<br/>PM2 Process Manager]
        ProdDB[(SQLite Prod DB)]
        ProdWS[WebSocket Server]
    end
    
    DevFrontend -.->|Build| ProdNginx
    DevBackend -.->|Deploy| ProdNode
    DevDB -.->|Migrate| ProdDB
    
    User1[Users] --> ProdNginx
    ProdNginx --> ProdNode
    ProdNode --> ProdDB
    User1 <-.->|WebSocket| ProdWS
```

## File Structure

```
layers-fullstack-app/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Helper functions
│   └── dist/                # Production build
│
├── backend/                  # Express server
│   ├── src/
│   │   ├── database/        # Database initialization
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utilities
│   └── dist/                # Compiled TypeScript
│
├── shared/                   # Shared resources
│   ├── schemas.ts           # Zod validation schemas
│   └── types.ts             # TypeScript type definitions
│
└── testing/                  # E2E test suite
    └── e2e/                 # Playwright tests
```

## Key Features

- **Authentication**: JWT-based authentication with protected routes
- **Real-time Updates**: WebSocket integration for live notifications
- **Theme Support**: Dark/Light theme toggle with system preference detection
- **State Management**: Context-based state management with custom hooks
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Testing**: Comprehensive E2E testing with Playwright
- **Responsive Design**: TailwindCSS for mobile-first responsive UI