import { Bell, CalendarClock, ChevronDown, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTimeRange, getEffectiveStatus, resolveCurrentSchedule, statusLabel } from "../../lib/schedule";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const schedules = useWorkshopStore((state) => state.schedules);
  const locations = useWorkshopStore((state) => state.locations);
  const quizzes = useWorkshopStore((state) => state.quizzes);
  const quizResponses = useWorkshopStore((state) => state.quizResponses);
  const activeParticipantId = useWorkshopStore((state) => state.activeParticipantId);
  const manualCurrentScheduleId = useWorkshopStore((state) => state.manualCurrentScheduleId);
  const currentSchedule = useMemo(
    () => resolveCurrentSchedule(schedules, manualCurrentScheduleId),
    [manualCurrentScheduleId, schedules],
  );
  const location = useMemo(
    () => locations.find((item) => item.id === currentSchedule?.locationId),
    [currentSchedule?.locationId, locations],
  );
  const pendingQuizCount = useMemo(
    () =>
      quizzes.filter(
        (quiz) =>
          quiz.isOpen &&
          !quizResponses.some(
            (response) => response.quizId === quiz.id && response.participantId === activeParticipantId,
          ),
      ).length,
    [activeParticipantId, quizResponses, quizzes],
  );

  if (!currentSchedule) return null;

  const effectiveStatus = getEffectiveStatus(currentSchedule);

  return (
    <div className="safe-top fixed inset-x-0 top-0 z-40 mx-auto max-w-md border-b border-line bg-white/95 shadow-sm backdrop-blur">
      <div className="px-3 pb-2 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left active:bg-slate-100"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pine text-white">
              <CalendarClock size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>{formatTimeRange(currentSchedule.startTime, currentSchedule.endTime)}</span>
                <Badge tone={statusTone[effectiveStatus]}>{statusLabel[effectiveStatus]}</Badge>
              </span>
              <span className="mt-0.5 block truncate text-sm font-black text-ink">{currentSchedule.title}</span>
            </span>
            <ChevronDown
              size={17}
              className={`shrink-0 text-slate-500 transition ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
          <button
            type="button"
            aria-label="퀴즈 알림"
            onClick={() => navigate("/quiz")}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 active:bg-slate-200"
          >
            <Bell size={16} />
            {pendingQuizCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-black text-white">
                {pendingQuizCount}
              </span>
            ) : null}
          </button>
        </div>
        {isExpanded ? (
          <div className="mt-2 rounded-lg border border-line bg-white p-3 shadow-sm">
            <button
              type="button"
              onClick={() => navigate("/map/current")}
              className="flex min-h-10 w-full items-center gap-2 rounded-lg bg-field px-3 text-left text-sm font-black text-pine active:bg-emerald-50"
            >
              <MapPin size={16} />
              {location?.name ?? "장소 미정"}
            </button>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{currentSchedule.description}</p>
            {currentSchedule.supplies.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {currentSchedule.supplies.map((supply) => (
                  <span key={supply} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                    {supply}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
