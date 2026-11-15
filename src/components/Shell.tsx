import { useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import {
  IconSatellite,
  IconDashboard,
  IconAnalyze,
  IconHistory,
  IconReports,
  IconSettings,
  IconMenu,
  IconClose,
} from "./icons";
import { StatDot, cn } from "./ui";
import type { Route } from "../App";
import { api, type SystemHealth } from "../lib/api";
import { authService, type UserProfile } from "../lib/firebase";
import { AuthModal, GoogleIcon } from "./AuthModal";

const nav: { key: Route; label: string; icon: (p: any) => ReactNode; desc?: string }[] = [
  { key: "dashboard", label: "Story Dashboard", icon: IconDashboard, desc: "NISAR Earth Change" },
  { key: "analyze", label: "Analyze", icon: IconAnalyze, desc: "Multimodal Workspace" },
  { key: "history", label: "History", icon: IconHistory, desc: "Temporal Archives" },
  { key: "reports", label: "Reports", icon: IconReports, desc: "Verified PDF Dossiers" },
  { key: "settings", label: "Settings", icon: IconSettings, desc: "Sensors & Config" },
];

export function Brand({ onClick, small }: { onClick?: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl text-left transition-all focus-ring cursor-pointer",
        onClick ? "hover:opacity-90" : "cursor-default"
      )}
    >
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#789575] text-[#E5E8CE] shadow-sm font-bold transition-transform group-hover:scale-105">
        <IconSatellite className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#2E7D32] animate-ping" />
      </span>
      {!small && (
        <span className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-[#18261B] leading-tight">
              Satya Dristi
            </span>
            <span className="mono rounded-full bg-[#789575]/20 px-2 py-0.2 text-[9px] font-bold text-[#18261B] border border-[#789575]/40">
              NISAR
            </span>
          </div>
          <span className="mono text-[10px] uppercase tracking-[0.12em] text-[#4B634E] leading-tight mt-0.5">
            Earth Observatory
          </span>
        </span>
      )}
    </button>
  );
}

export function Shell({
  route,
  navigate,
  title,
  status = "NISAR Dual-Band Stream Ready",
  actions,
  children,
}: {
  route: Route;
  navigate: (r: Route) => void;
  title: string;
  status?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Active heartbeat connection to backend API
  const pollHealth = useCallback(async () => {
    try {
      const h = await api.system.getHealth();
      setHealth(h);
    } catch {
      // Backend temporarily offline
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    pollHealth();

    // Auto-reconnecting heartbeat timer (8s while connecting/degraded, 30s when operational)
    const intervalMs = !health || health.status !== "operational" ? 8000 : 30000;
    const interval = setInterval(() => {
      if (mounted) pollHealth();
    }, intervalMs);

    const unsubscribe = authService.onAuthStateChanged((u) => {
      if (mounted) setUser(u);
    });

    const handleOpenAuth = () => {
      setShowAuthModal(true);
      setShowUserMenu(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener("open-auth-modal", handleOpenAuth);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      mounted = false;
      clearInterval(interval);
      unsubscribe();
      window.removeEventListener("open-auth-modal", handleOpenAuth);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pollHealth, health?.status]);

  const handleManualRetry = async () => {
    setIsRetrying(true);
    await pollHealth();
    setTimeout(() => setIsRetrying(false), 600);
  };

  const handleProfileClick = () => {
    if (user) {
      setShowUserMenu((prev) => !prev);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSignOut = () => {
    setShowUserMenu(false);
    authService.signOut();
  };

  const NavList = (
    <nav className="flex flex-col gap-1.5">
      {nav.map((n) => {
        const active = route === n.key;
        return (
          <button
            key={n.key}
            onClick={() => {
              navigate(n.key);
              setOpen(false);
            }}
            className={cn(
              "group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-medium transition-all focus-ring text-left cursor-pointer",
              active
                ? "bg-[#789575] text-[#E5E8CE] font-bold shadow-xs border border-[#789575]"
                : "text-[#2B3B2C] hover:bg-white/60 hover:text-[#18261B]"
            )}
          >
            <n.icon
              className={cn(
                "h-5 w-5 shrink-0 transition-colors",
                active ? "text-[#E5E8CE]" : "text-[#4B634E] group-hover:text-[#18261B]"
              )}
            />
            <div className="flex flex-col">
              <span className="text-[13.5px] font-semibold">{n.label}</span>
              {n.desc && (
                <span className={cn("text-[10px] font-mono", active ? "text-[#E5E8CE]/80" : "text-[#4B634E]")}>
                  {n.desc}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="app-bg min-h-screen text-[#18261B]">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col glass-sidebar lg:flex">
        <div className="flex h-16 items-center px-6 border-b border-[#789575]/25">
          <Brand onClick={() => navigate("landing")} />
        </div>

        {/* Mission Pulse Pill */}
        <div className="px-5 pt-4">
          <div className="rounded-2xl border border-[#789575]/35 bg-white/60 p-3.5 backdrop-blur-md shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="mono text-[10px] font-bold uppercase tracking-wider text-[#18261B]">
                Radar Telemetry
              </span>
              <span className="flex items-center gap-1.5 mono text-[10px] text-[#2E7D32] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32] animate-ping" />
                Live
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#789575]" />
              <span className="text-xs font-bold text-[#18261B] truncate">
                NISAR L+S Dual-Band Orbit
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-tight text-[#4B634E]">
              747km polar sun-synchronous pass
            </p>
          </div>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto px-4">{NavList}</div>

        {/* Bottom Hardware Telemetry Box with Auto-Healing */}
        <div className="mt-auto p-5 border-t border-[#789575]/25">
          <div className="rounded-2xl border border-[#789575]/35 bg-white/70 p-3.5 backdrop-blur-md shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <StatDot
                  tone={
                    health?.status === "operational"
                      ? "ok"
                      : health
                      ? "warn"
                      : "warn"
                  }
                />
                <span className="text-xs font-bold text-[#18261B] truncate">
                  {!health
                    ? "Connecting to Engine…"
                    : health.status === "operational"
                    ? "Remote Sensing Engine Active"
                    : "Engine Active (degraded)"}
                </span>
              </div>
              {!health && (
                <button
                  type="button"
                  onClick={handleManualRetry}
                  disabled={isRetrying}
                  className="mono text-[10px] px-2 py-0.5 rounded-full bg-[#789575] text-[#E5E8CE] hover:bg-[#688565] transition-colors cursor-pointer shrink-0 ml-1 font-semibold"
                  title="Retry connecting to FastAPI backend"
                >
                  {isRetrying ? "..." : "Retry"}
                </button>
              )}
            </div>
            <div className="mono mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1 text-[10.5px] text-[#4B634E]">
              <span>Compute</span>
              <span className="text-right text-[#18261B] font-bold">
                {health?.preferred_device?.toUpperCase() || "CPU / CUDA"}
              </span>
              <span>Queued Jobs</span>
              <span className="text-right text-[#18261B]">
                {health?.active_jobs_count ?? 0}
              </span>
              <span>Bands</span>
              <span className="text-right text-[#2E7D32] font-bold">
                L-Band + S-Band
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col glass-sidebar p-0">
            <div className="flex h-16 items-center justify-between px-6 border-b border-[#789575]/25">
              <Brand
                onClick={() => {
                  navigate("landing");
                  setOpen(false);
                }}
              />
              <button
                className="focus-ring rounded-lg p-2 text-[#4B634E] hover:bg-white/60 hover:text-[#18261B]"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto px-4">{NavList}</div>
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 glass-header px-6 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              className="focus-ring rounded-lg p-2 text-[#4B634E] hover:bg-white/60"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu className="h-5 w-5" />
            </button>
            <Brand onClick={() => navigate("landing")} small />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[17px] font-extrabold text-[#18261B] leading-tight tracking-tight">
              {title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#789575] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2E7D32]"></span>
              </span>
              <span className="mono text-xs uppercase tracking-wider text-[#4B634E] leading-none">
                {status}
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {actions}

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={handleProfileClick}
                  className="focus-ring flex items-center gap-2.5 rounded-xl border border-[#789575]/40 bg-white/70 px-3.5 py-1.5 backdrop-blur-md hover:bg-white transition-all cursor-pointer shadow-2xs"
                  title={`Signed in as ${user.email}`}
                  aria-expanded={showUserMenu}
                >
                  {user.picture || user.photoURL ? (
                    <img
                      src={user.picture || user.photoURL}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-[#789575]"
                    />
                  ) : (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#789575] text-[#E5E8CE] text-xs font-bold">
                      {(user.name || user.displayName || "SD")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                  <span className="hidden text-xs font-semibold sm:block text-[#18261B]">
                    {user.displayName || user.name || user.email || "Explorer"}
                  </span>
                  <svg
                    className="h-3.5 w-3.5 text-[#4B634E]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#789575]/35 bg-white/95 p-4 shadow-xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-100 text-[#18261B]">
                    <div className="flex items-center gap-3 border-b border-[#789575]/20 pb-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-[#789575] text-[#E5E8CE] font-bold text-sm">
                        {(user.displayName || user.name || user.email || "SD")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-[#18261B]">
                          {user.displayName || user.name || "Remote Sensing Analyst"}
                        </div>
                        <div className="truncate text-xs text-[#4B634E]">
                          {user.email}
                        </div>
                        <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#789575]/20 px-2 py-0.5 text-[9.5px] font-semibold text-[#183B1E]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
                          <span>Google Authenticated</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowAuthModal(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#2B3B2C] hover:bg-[#789575]/15 hover:text-[#18261B] transition-colors text-left cursor-pointer"
                      >
                        <GoogleIcon className="h-4 w-4" />
                        <span>Switch Google Account</span>
                      </button>

                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="focus-ring flex items-center gap-2 rounded-xl border border-[#789575]/40 bg-white/70 px-4 py-2 hover:bg-white transition-all shadow-2xs cursor-pointer"
                title="Click to sign in with Google"
              >
                <GoogleIcon className="h-4 w-4" />
                <span className="text-xs font-bold text-[#18261B]">
                  Sign in
                </span>
              </button>
            )}
          </div>
        </header>

        <main className="px-6 py-8 sm:px-8 lg:px-10 max-w-7xl mx-auto">
          {children}
        </main>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
          }}
        />
      </div>
    </div>
  );
}
