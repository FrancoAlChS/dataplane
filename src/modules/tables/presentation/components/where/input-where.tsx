"use client";

import { Button } from "@/shared/presentation/components/ui/button";
import { SyntaxHighlightedInput } from "@/shared/presentation/components/ui/syntax-highlighted-input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Props {
  currentWhere?: string;
}

export const InputWhere = ({ currentWhere }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prevWhere, setPrevWhere] = useState(currentWhere);
  const [whereInput, setWhereInput] = useState(currentWhere || "");

  if (currentWhere !== prevWhere) {
    setPrevWhere(currentWhere);
    setWhereInput(currentWhere || "");
  }

  const handleWhereSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (whereInput.trim()) {
      params.set("where", whereInput.trim());
    } else {
      params.delete("where");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleWhereSubmit}
      className="flex items-center space-x-2 px-6 pt-6"
    >
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground uppercase z-10">
          WHERE
        </span>
        <SyntaxHighlightedInput
          placeholder="status = 'active' AND age > 18"
          value={whereInput}
          onChange={(e) => setWhereInput(e.target.value)}
          className="pl-20"
        />
      </div>
      <Button type="submit">Filtrar</Button>

      {whereInput && (
        <Button
          variant="ghost"
          type="button"
          onClick={() => {
            setWhereInput("");
            const params = new URLSearchParams(searchParams.toString());
            params.delete("where");
            router.push(`?${params.toString()}`);
          }}
        >
          Limpiar
        </Button>
      )}
    </form>
  );
};
