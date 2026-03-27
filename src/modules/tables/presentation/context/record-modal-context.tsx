"use client";

import { createContext, useContext, useState } from "react";

interface RecordModalContextType {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  openCreate: () => void;
  openEdit: (data: Record<string, unknown>) => void;
}

const RecordModalContext = createContext<RecordModalContextType | undefined>(undefined);

export function RecordModalProvider({ children, setInitialData }: { children: React.ReactNode, setInitialData: (data: Record<string, unknown>) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCreate = () => {
    setIsOpen(true);
  };

  const openEdit = (data: Record<string, unknown>) => {
    setInitialData(data);
    setIsOpen(true);
  };

  return (
    <RecordModalContext.Provider value={{ isOpen, onOpenChange: setIsOpen, openCreate, openEdit }}>
      {children}
    </RecordModalContext.Provider>
  );
}

export function useRecordModal() {
  const context = useContext(RecordModalContext);
  if (!context) {
    throw new Error("useRecordModal must be used within a RecordModalProvider");
  }
  return context;
}
