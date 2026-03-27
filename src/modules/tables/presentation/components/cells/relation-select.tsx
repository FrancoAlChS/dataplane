"use client";

import { getData } from "@/modules/tables/infrastructure/sa/tabla.sa";
import { Button } from "@/shared/presentation/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/presentation/components/ui/popover";
import { cn } from "@/shared/presentation/lib/utils";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface RelationSelectProps {
  tableName: string;
  columnName: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RelationSelect({
  tableName,
  columnName,
  value,
  onChange,
  placeholder = "Seleccionar...",
  disabled,
}: RelationSelectProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const fetchItems = useCallback(
    async (pageNum: number, searchStr: string, isInitial = false) => {
      setLoading(true);
      try {
        const safeCol = columnName.replace(/[^a-zA-Z0-9_]/g, "");
        const where = searchStr
          ? `CAST("${safeCol}" AS TEXT) ILIKE '%${searchStr.replace(/'/g, "''")}%'`
          : undefined;

        const { data, error } = await getData(
          tableName,
          pageNum,
          20,
          undefined,
          undefined,
          where,
        );

        if (error) throw new Error(error);

        const rows = data as Record<string, unknown>[];
        if (isInitial) {
          setItems(rows);
        } else {
          setItems((prev) => [...prev, ...rows]);
        }
        setHasMore(rows.length === 20);
      } catch (err) {
        console.error("Error fetching relation data:", err);
      } finally {
        setLoading(false);
      }
    },
    [tableName, columnName],
  );

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchItems(1, search, true);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, fetchItems]);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (!listRef.current || loading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollHeight - scrollTop - clientHeight < 60) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchItems(nextPage, search);
    }
  }, [loading, hasMore, page, search, fetchItems]);

  const selectedLabel = items.find(
    (item) => String(item[columnName]) === String(value),
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          {value ? (
            <span className="truncate">
              {String(selectedLabel?.[columnName] ?? value)}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        {/* Search */}
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X className="h-4 w-4 opacity-50 hover:opacity-100" />
            </button>
          )}
        </div>

        {/* List */}
        <div
          ref={listRef}
          className="max-h-[260px] overflow-y-auto"
          onScroll={handleScroll}
        >
          {items.length === 0 && !loading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Sin resultados.
            </div>
          ) : (
            items.map((item, index) => {
              const itemValue = String(item[columnName]);
              const isSelected = String(value) === itemValue;
              return (
                <div
                  key={`${itemValue}-${index}`}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    isSelected && "bg-accent/50",
                  )}
                  onClick={() => {
                    onChange(itemValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium truncate">{itemValue}</span>
                    <span className="text-[10px] text-muted-foreground truncate opacity-70">
                      {JSON.stringify(item).substring(0, 80)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
