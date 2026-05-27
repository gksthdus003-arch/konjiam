import {
  CalendarDays,
  ClipboardCheck,
  Map,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
}

const participantItems: NavItem[] = [
  { to: "/map", label: "지도", icon: Map },
  { to: "/schedule", label: "일정표", icon: CalendarDays },
];

const adminItems: NavItem[] = [
  { to: "/admin/schedule", label: "일정", icon: CalendarDays },
  { to: "/admin/quizzes", label: "퀴즈", icon: ClipboardCheck },
  { to: "/admin/users", label: "사용자", icon: Users },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const items = isAdmin ? adminItems : participantItems;

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-line bg-white/95 backdrop-blur">
      <div
        className={`grid gap-1 px-2 pb-2 pt-2 ${
          items.length === 2 ? "grid-cols-2" : items.length === 3 ? "grid-cols-3" : "grid-cols-5"
        }`}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/" || item.to === "/admin"}
              className={({ isActive }) =>
                `flex h-12 flex-col items-center justify-center rounded-lg text-[11px] font-bold transition ${
                  isActive ? "bg-pine text-white" : "text-slate-600 active:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              <span className="mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
