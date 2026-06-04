"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "ホーム",       href: "/"         },
  { label: "チャット",     href: "/chat"     },
  { label: "プロフィール", href: "/profile"  },
  { label: "タイムライン", href: "/timeline" },
  { label: "振り返り",     href: "/review"   },
];

const selectabilityScore = 82;

function ScoreRing({ score }: { score: number }) {
  const r = 14;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
      <circle cx="20" cy="20" r={r} className="stroke-muted fill-none" strokeWidth="3" />
      <circle
        cx="20" cy="20" r={r}
        className="stroke-primary fill-none"
        strokeWidth="3"
        strokeDasharray={`${progress} ${circumference}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CareerSelectabilityHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/95 backdrop-blur-sm">
      {/* Main bar */}
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 md:px-8">

        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={closeMenu}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
            CS
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">
            キャリアセレクタビリティシステム
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <span className="mr-2 h-5 w-px bg-border/70" />
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm transition ${
                isActive(item.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: score + user (desktop) */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2">
            <div className="relative">
              <ScoreRing score={selectabilityScore} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold">
                {selectabilityScore}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">キャリアセレクタビリティ</p>
              <p className="mt-0.5 text-xs font-semibold leading-none">スコア</p>
            </div>
          </div>
          <span className="h-5 w-px bg-border/70" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
              友
            </div>
            <div>
              <p className="text-xs font-medium leading-none">友田 一哉</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground leading-none">メンバー</p>
            </div>
          </div>
        </div>

        {/* Mobile: user avatar + hamburger */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            友
          </div>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="メニュー"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-muted"
          >
            {menuOpen ? (
              /* × */
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              /* ≡ */
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <line x1="2" y1="4"  x2="16" y2="4"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="2" y1="9"  x2="16" y2="9"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="2" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-border/70 bg-card px-4 pb-4 md:hidden">
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive(item.href)
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
            <div className="relative">
              <ScoreRing score={selectabilityScore} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold">
                {selectabilityScore}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium">キャリアセレクタビリティスコア</p>
              <p className="text-[10px] text-muted-foreground">友田 一哉 · メンバー</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
