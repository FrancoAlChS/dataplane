/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { cn } from "@/shared/presentation/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

const RESERVED_WORDS = [
  "AND", "OR", "NOT", "IS", "NULL", "LIKE", "IN", "BETWEEN", "EXISTS", "SELECT", "FROM", "WHERE", "ORDER", "BY", "LIMIT", "OFFSET", "JOIN", "ON", "GROUP", "HAVING", "CASE", "WHEN", "THEN", "ELSE", "END", "AS", "DISTINCT", "ALL", "ANY", "SOME", "TRUE", "FALSE"
];
const SYMBOLS = ["=", "!=", "<>", "<", ">", "<=", ">=", "(", ")", ",", ".", "+", "-", "*", "/", ";"];

export const SyntaxHighlightedInput = ({
  value,
  onChange,
  onValueChange,
  className,
  ...props
}: Props) => {
  const [inputValue, setInputValue] = useState(String(value || ""));
  const highlightRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(String(value || ""));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) onChange(e);
    if (onValueChange) onValueChange(newValue);
  };

  const tokenize = (text: string) => {
    if (!text) return null;
    // Split by whitespace, strings, and symbols/operators
    const tokens = text.split(/(\s+|'[^']*'|"[^"]*"|[=!<>\(\),\.\+\-\*\/;]+)/);
    
    return tokens.map((token, i) => {
      if (!token) return null;

      // Strings (purple)
      if (token.startsWith("'") || token.startsWith('"')) {
        return <span key={i} className="text-red-800 dark:text-red-200 font-medium">{token}</span>;
      }

      const upperToken = token.toUpperCase();
      // Keywords (orange)
      if (RESERVED_WORDS.includes(upperToken)) {
        return <span key={i} className="text-slate-600 dark:text-slate-400 font-bold">{token}</span>;
      }

      // Symbols (orange)
      if (SYMBOLS.includes(token) || /^[=!<>\(\),\.\+\-\*\/;]+$/.test(token)) {
        return <span key={i} className="text-slate-600 dark:text-slate-400 font-bold">{token}</span>;
      }

      // Properties / Identifiers (dark gray/light gray)
      if (token.trim().length > 0) {
        return <span key={i} className="text-purple-900 dark:text-purple-100 font-medium">{token}</span>;
      }

      // Whitespace and others
      return <span key={i}>{token}</span>;
    });
  };

  const handleScroll = () => {
    if (highlightRef.current && inputRef.current) {
      highlightRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="grid w-full items-center">
        {/* Background highlighting layer */}
        <div
          ref={highlightRef}
          className={cn(
            "col-start-1 row-start-1 pointer-events-none whitespace-pre overflow-hidden font-mono text-sm border border-transparent h-9 flex items-center",
            className
          )}
          aria-hidden="true"
        >
          {tokenize(inputValue)}
        </div>

        {/* Hidden but functional input layer */}
        <input
          {...props}
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onScroll={handleScroll}
          autoComplete="off"
          spellCheck="false"
          className={cn(
            "col-start-1 row-start-1 h-9 w-full rounded-md border border-input bg-transparent font-mono text-sm shadow-xs transition-colors",
            "focus-visible:outline-none ",
            "text-transparent caret-foreground",
            "placeholder:text-muted-foreground/50",
            className
          )}
        />
      </div>
    </div>
  );
};
