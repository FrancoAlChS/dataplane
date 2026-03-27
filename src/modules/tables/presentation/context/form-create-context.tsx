import { createContext, useContext, useState } from "react";


interface FormCreateContextType {
  formData: Record<string, unknown>;
  initialData: Record<string, unknown> | null;
  excludedFields: Set<string>;
  isEditing: boolean;
  handleFieldChange: (name: string, value: unknown) => void;
  toggleExcludeField: (name: string) => void;
  setInitialData: (data: Record<string, unknown>) => void;
  resetForm: () => void;
}

const FormCreateContext = createContext<FormCreateContextType>({
  formData: {},
  initialData: null,
  excludedFields: new Set(),
  isEditing: false,
  handleFieldChange: () => { },
  toggleExcludeField: () => { },
  setInitialData: () => { },
  resetForm: () => { },
});


export function FormCreateProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [initialData, setInitialDataState] = useState<Record<string, unknown> | null>(null);
  const [excludedFields, setExcludedFields] = useState<Set<string>>(new Set());

  const handleFieldChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleExcludeField = (name: string) => {
    setExcludedFields((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const setInitialData = (data: Record<string, unknown>) => {
    setInitialDataState(data);
    setFormData(data);
  };

  const resetForm = () => {
    setFormData({});
    setInitialDataState(null);
    setExcludedFields(new Set());
  };

  return (
    <FormCreateContext.Provider value={{
      formData,
      initialData,
      excludedFields,
      isEditing: !!initialData,
      handleFieldChange,
      toggleExcludeField,
      setInitialData,
      resetForm
    }}>
      {children}
    </FormCreateContext.Provider>
  );
}



export function useFormCreateContext() {
  const context = useContext(FormCreateContext);
  if (!context) {
    throw new Error("useFormCreateContext must be used within a FormCreateProvider");
  }
  return context;
}

