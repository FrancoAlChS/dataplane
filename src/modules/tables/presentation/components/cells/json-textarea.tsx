"use client";

import { Textarea } from "@/shared/presentation/components/ui/textarea";
import { cn } from "@/shared/presentation/lib/utils";
import { useMemo } from "react";

interface JsonTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function JsonTextArea({ value, onChange, placeholder, className, disabled }: JsonTextAreaProps) {
  const isValid = useMemo(() => {
    if (!value) return true;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }, [value]);

  return (
    <div className="space-y-1">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "font-mono text-xs",
          !isValid && "border-destructive focus-visible:ring-destructive",
          className
        )}
      />
      {!isValid && (
        <p className="text-[10px] text-destructive font-medium">
          JSON inválido
        </p>
      )}
    </div>
  );
}
