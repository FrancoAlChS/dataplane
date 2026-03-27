import { Globe, Layers } from "lucide-react";

export function StatusBar() {
  return (
    <footer className="h-7 border-t border-border bg-card flex items-center justify-between px-4 text-[11px] text-muted-foreground select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-2 hover:bg-accent hover:text-accent-foreground cursor-default transition-colors h-full">
          <Globe className="size-3 text-emerald-500" />
          <span>PostgreSQL 16.2</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 hover:bg-accent hover:text-accent-foreground cursor-default transition-colors h-full">
          <Layers className="size-3" />
          <span>public.users</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 h-full">
        <div className="flex items-center gap-1.5 px-2">
          <span className="text-emerald-500 tabular-nums">15ms</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 border-l border-border h-full">
          <span className="tabular-nums">1,248 rows</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 bg-emerald-500/10 text-emerald-500 font-medium h-full">
          <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>DEV</span>
        </div>
      </div>
    </footer>
  );
}
