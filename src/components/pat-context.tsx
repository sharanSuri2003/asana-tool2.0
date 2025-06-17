"use client";
import { User } from "@/app/(protected)/dashboard/workspaces/columns";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PatContextType {
  pat: string | null;
  setPat: (pat: string) => void;
}

const PatContext = createContext<PatContextType | undefined>(undefined);

export const PatProvider = ({ children }: { children: ReactNode }) => {
  const [pat, setPat] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("pat") : null
  );

  return (
    <PatContext.Provider value={{ pat, setPat }}>
      {children}
    </PatContext.Provider>
  );
};

export const usePat = () => {
  const context = useContext(PatContext);
  if (context === undefined) {
    throw new Error("usePat must be used within a PatProvider");
  }
  return context;
};

interface SelectedRowsContextType {
  selectedRows: { [gid: string]: User[] };
  setSelectedRows: (selectedRows: { [gid: string]: User[] }) => void;
}

const selectedRowsContext = createContext<SelectedRowsContextType | undefined>(
  undefined
);

export const useSelectedRows = () => {
  const context = useContext(selectedRowsContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedRows must be used within a SelectedRowsProvider"
    );
  }
  return context;
};

export const SelectedRowsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRows, setSelectedRows] = useState<{ [gid: string]: User[] }>(
    {}
  );

  return (
    <selectedRowsContext.Provider value={{ selectedRows, setSelectedRows }}>
      {children}
    </selectedRowsContext.Provider>
  );
};
