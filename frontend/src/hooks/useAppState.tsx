import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  theme: string;
  language: string;
  sidebarOpen: boolean;
  notifications: any[];
  user: any;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: any;
  selectedItems: string[];
  mousePosition: { x: number; y: number };
  timestamp: number;
}

interface AppStateContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateTheme: (theme: string) => void;
  updateLanguage: (language: string) => void;
  toggleSidebar: () => void;
  updateMousePosition: (x: number, y: number) => void;
  updateTimestamp: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, setState] = useState<AppState>({
    theme: 'light',
    language: 'en',
    sidebarOpen: false,
    notifications: [],
    user: null,
    loading: false,
    error: null,
    searchQuery: '',
    filters: {},
    selectedItems: [],
    mousePosition: { x: 0, y: 0 },
    timestamp: Date.now(),
  });

  const updateTheme = (theme: string) => {
    setState(prev => ({ 
      ...prev, 
      theme, 
      timestamp: Date.now()
    }));
  };

  const updateLanguage = (language: string) => {
    setState(prev => ({ 
      ...prev, 
      language,
      timestamp: Date.now()
    }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ 
      ...prev, 
      sidebarOpen: !prev.sidebarOpen,
      timestamp: Date.now()
    }));
  };

  const updateMousePosition = (x: number, y: number) => {
    setState(prev => ({ 
      ...prev, 
      mousePosition: { x, y },
      timestamp: Date.now()
    }));
  };

  const updateTimestamp = () => {
    setState(prev => ({ 
      ...prev, 
      timestamp: Date.now()
    }));
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const interval = setInterval(updateTimestamp, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const value = {
    state,
    setState,
    updateTheme,
    updateLanguage,
    toggleSidebar,
    updateMousePosition,
    updateTimestamp,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}