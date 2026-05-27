import { CalendarClock, MapPin, SkipForward } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatTimeRange, getEffectiveStatus, resolveCurrentSchedule, resolveNextSchedule, statusLabel } from "../../lib/schedule";
import { useWorkshopStore } from "../../store/workshopStore";
import { Badge } from "../ui/Badge";

const statusTone = {
  scheduled: "amber",
  active: "green",
  ended: "gray",
  skipped: "red",
} as const;

export function CurrentScheduleBar() {
  const navigate = useNavigate();
  const schedules = useWorkshopStore((state) => state.schedules);
  const locations = useWorkshopStore((state) => state.locations);
  const manualCurrentScheduleId = useWorkshopStore((state) => state.manualCurrentScheduleId);
  const currentSchedule = useMemo(
    () => resolveCurrentSchedule(schedules, manualCurrentScheduleId),
    [manualCurrentScheduleId, schedules],
  );
  const location = useMemo(
    () => locations.find((item) => item.id === currentSchedule?.locationId),
    [currentSchedule?.locationId, locations],
  );
  const nextSchedule = useMemo(
    () => resolveNextSchedule(schedules, currentSchedule?.id),
    [currentSchedule?.id, schedules],
  );

  if (!currentSchedule) return null;

  const effectiveStatus = getEffectiveStatus(currentSchedule);

  return (
    <div className="safe-top fixed inset-x-0 top-0 z-40 mx-auto max-w-md border-b border-line bg-white/95 shadow-sm backdrop-blur">
      <div className="px-3 pb-2 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/schedule/${currentSchedule.id}`)}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left active:bg-slate-100"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pine text-white">
              <CalendarClock size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-black text-ink">{currentSchedule.title}</span>
                <Badge tone={statusTone[effectiveStatus]}>{statusLabel[effectiveStatus]}</Badge>
              </span>
              <span className="mt-0.5 block text-xs font-semibold text-slate-600">
                {formatTimeRange(currentSchedule.startTime, currentSchedule.endTime)}
              </span>
            </span>
          </button>
          {nextSchedule ? (
            <button
              type="button"
              aria-label="다음 일정 보기"
              onClick={() => navigate(`/schedule/${nextSchedule.id}`)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 active:bg-slate-200"
            >
              <SkipForward size={16} />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => navigate("/map/current")}
          className="ml-10 mt-0.5 flex max-w-[calc(100%-2.5rem)] items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-pine active:bg-emerald-50"
        >
          <MapPin size={13} />
          <span className="truncate">{location?.name ?? "장소 미정"}</span>
        </button>
      </div>
    </div>
  );
}
