import { ChevronRight, MapPin } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { formatDateLabel, formatTimeRange, getEffectiveStatus, statusLabel } from "../../lib/schedule";
import type { Location, ScheduleItem } from "../../types";
import { Badge } from "../../components/ui/Badge";

interface ScheduleTimelineProps {
  schedules: ScheduleItem[];
  locations: Location[];
  currentScheduleId?: string;
}

const statusTone = {
  scheduled: "amber",
  active: "green",
  ended: "gray",
  skipped: "red",
} as const;

export function ScheduleTimeline({ schedules, locations, currentScheduleId }: ScheduleTimelineProps) {
  return (
    <div className="space-y-3 px-4">
      {schedules.map((schedule, index) => {
        const location = locations.find((item) => item.id === schedule.locationId);
        const status = getEffectiveStatus(schedule);
        const isCurrent = schedule.id === currentScheduleId;
        const dateLabel = formatDateLabel(schedule.startTime);
        const previousDateLabel = index > 0 ? formatDateLabel(schedules[index - 1].startTime) : undefined;
        const showDateLabel = dateLabel !== previousDateLabel;

        return (
          <Fragment key={schedule.id}>
            {showDateLabel ? <h2 className="px-1 pt-2 text-sm font-black text-pine">{dateLabel}</h2> : null}
            <Link
              to={`/schedule/${schedule.id}`}
              className={`block rounded-lg border bg-white p-4 shadow-sm transition active:bg-slate-50 ${
                isCurrent ? "border-pine ring-2 ring-emerald-100" : "border-line"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                    isCurrent ? "bg-coral ring-4 ring-rose-100" : status === "ended" ? "bg-slate-300" : "bg-pine"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-base font-black text-ink">{schedule.title}</p>
                    <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-600">{formatTimeRange(schedule.startTime, schedule.endTime)}</p>
                  <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-pine">
                    <MapPin size={15} />
                    {location?.name ?? "장소 미정"}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{schedule.description}</p>
                </div>
                <ChevronRight className="mt-1 shrink-0 text-slate-400" size={18} />
              </div>
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}
