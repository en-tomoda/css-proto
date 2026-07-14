"use client";

import { csaDefinition } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

/**
 * CSA項目のタグ。クリックするとその項目の定義をポップオーバーで表示する。
 * variant で強化中(focus)・課題(challenge)・通常(default)の色を切り替える。
 */
export function CsaTag({
  name,
  variant = "default",
}: {
  name: string;
  variant?: "default" | "focus" | "challenge";
}) {
  const definition = csaDefinition(name);
  const styles: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    focus: "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
    challenge:
      "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button">
          <Badge
            variant="outline"
            className={`cursor-pointer gap-1 font-normal ${styles[variant]}`}
          >
            {name}
            <Info className="size-3 opacity-60" />
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 text-sm">
        <p className="font-semibold">{name}</p>
        <p className="mt-1 leading-relaxed text-muted-foreground">
          {definition ?? "自社設定の項目です。"}
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground/70">
          CSA（行動指針）の項目
        </p>
      </PopoverContent>
    </Popover>
  );
}
