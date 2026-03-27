"use client";

import { createContext, useContext, useState } from "react";

export interface RelationModalContextType {
  isOpen: boolean;
  targetTable: string;
  targetColumn: string;
  targetValue: unknown;
  openModal: (table: string, column: string, value: unknown) => void;
  closeModal: () => void;
}

export const RelationModalContext = createContext<RelationModalContextType>({
  isOpen: false,
  targetTable: "",
  targetColumn: "",
  targetValue: null,
  openModal: () => {},
  closeModal: () => {},
});

export function RelationModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetTable, setTargetTable] = useState("");
  const [targetColumn, setTargetColumn] = useState("");
  const [targetValue, setTargetValue] = useState<unknown>(null);

  const openModal = (table: string, column: string, value: unknown) => {
    setIsOpen(true);
    setTargetTable(table);
    setTargetColumn(column);
    setTargetValue(value);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTargetTable("");
    setTargetColumn("");
    setTargetValue(null);
  };

  return (
    <RelationModalContext.Provider
      value={{
        isOpen,
        targetTable,
        targetColumn,
        targetValue,
        openModal,
        closeModal,
      }}
    >
      {children}
    </RelationModalContext.Provider>
  );
}

export function useRelationModal() {
  const context = useContext(RelationModalContext);

  if (!context) {
    throw new Error(
      "useRelationModal must be used within a RelationModalProvider",
    );
  }

  return context;
}
