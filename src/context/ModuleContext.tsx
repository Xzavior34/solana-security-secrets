import { createContext, useContext, useState, ReactNode } from 'react';
import { ModuleId, SECURITY_MODULES, MODULE_ORDER } from '@/data/modules';

interface ModuleContextType {
  activeModule: ModuleId;
  setActiveModule: (id: ModuleId) => void;
  nextModule: () => void;
  prevModule: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  moduleIndex: number;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider = ({ children }: { children: ReactNode }) => {
  const [activeModule, setActiveModule] = useState<ModuleId>('signer-auth');
  
  const moduleIndex = MODULE_ORDER.indexOf(activeModule);
  const hasNext = moduleIndex < MODULE_ORDER.length - 1;
  const hasPrev = moduleIndex > 0;

  const nextModule = () => {
    if (hasNext) {
      setActiveModule(MODULE_ORDER[moduleIndex + 1]);
    }
  };

  const prevModule = () => {
    if (hasPrev) {
      setActiveModule(MODULE_ORDER[moduleIndex - 1]);
    }
  };

  return (
    <ModuleContext.Provider value={{
      activeModule,
      setActiveModule,
      nextModule,
      prevModule,
      hasNext,
      hasPrev,
      moduleIndex,
    }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModule must be used within ModuleProvider');
  }
  return context;
};
