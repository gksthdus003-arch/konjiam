import {
  Bell,
  CalendarDays,
  ClipboardCheck,
  Home,
  Map,
  Medal,
  Settings,
  ShieldCheck,
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
  { to: "/", label: "홈", icon: Home },
  { to: "/map", label: "지도", icon: Map },
  { to: "/schedule", label: "일정", icon: CalendarDays },
  { to: "/quiz", label: "퀴즈", icon: Medal },
  { to: "/team", label: "내 조", icon: Users },
];

const adminItems: NavItem[] = [
  { to: "/admin", label: "관리", icon: Settings },
  { to: "/admin/schedule", label: "일정", icon: CalendarDays },
  { to: "/admin/quizzes", label: "퀴즈", icon: ClipboardCheck },
  { to: "/admin/teams", label: "조", icon: ShieldCheck },
  { to: "/admin/notices", label: "공지", icon: Bell },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const items = isAdmin ? adminItems : participantItems;

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-line bg-white/95 backdrop-blur">
      <div className="grid grid-cols-5 gap-1 px-2 pb-2 pt-2">
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
