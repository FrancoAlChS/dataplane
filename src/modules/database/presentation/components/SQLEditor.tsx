"use client";

import { Play, Search, Copy, Save, Share2 } from "lucide-react";
import { Button } from "@/shared/presentation/components/ui/button";
import { ScrollArea } from "@/shared/presentation/components/ui/scroll-area";

export function SQLEditor() {
  return (
    <div className="flex flex-col h-full bg-background border-b border-border">
      <div className="h-10 border-b border-border bg-card/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
            <Search className="size-3.5" />
            Find
          </Button>
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
            <Copy className="size-3.5" />
            Format
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Save className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Share2 className="size-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="relative flex-1 group">
        <ScrollArea className="h-full w-full font-mono text-[13px] leading-relaxed p-4">
          <div className="flex gap-4">
            <div className="text-muted-foreground/30 text-right select-none w-8">
              1<br/>2<br/>3<br/>4
            </div>
            <div className="flex-1">
              <span className="text-indigo-400">SELECT</span> * <span className="text-indigo-400">FROM</span> users<br/>
              <span className="text-indigo-400">WHERE</span> active = <span className="text-emerald-400">true</span><br/>
              <span className="text-indigo-400">ORDER BY</span> created_at <span className="text-indigo-400">DESC</span><br/>
              <span className="text-indigo-400">LIMIT</span> <span className="text-rose-400">100</span>;
            </div>
          </div>
        </ScrollArea>
        
        <Button 
          className="absolute bottom-6 right-6 h-10 px-6 gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-indigo-500/20 rounded-full"
        >
          <Play className="size-4 fill-current" />
          <span className="font-semibold text-xs tracking-wide">EXECUTE</span>
        </Button>
      </div>
    </div>
  );
}
