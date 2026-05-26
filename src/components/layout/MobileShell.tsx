import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { CurrentScheduleBar } from "./CurrentScheduleBar";

export function MobileShell() {
  return (
    <div className="min-h-screen bg-field text-ink">
      <div className="mx-auto min-h-screen max-w-md bg-field shadow-soft">
        <CurrentScheduleBar />
        <main className="min-h-screen pb-24 pt-[92px]">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
