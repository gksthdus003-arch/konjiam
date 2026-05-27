import { MapPin } from "lucide-react";
import { Fragment } from "react";
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
    <div className="space-y-2 px-4">
      {schedules.map((schedule, index) => {
        const location = locations.find((item) => item.id === schedule.locationId);
        const status = getEffectiveStatus(schedule);
        const isCurrent = schedule.id === currentScheduleId;
        const dateLabel = formatDateLabel(schedule.startTime);
        const previousDateLabel = index > 0 ? formatDateLabel(schedules[index - 1].startTime) : undefined;
        const showDateLabel = dateLabel !== previousDateLabel;

        return (
          <Fragment key={schedule.id}>
            {showDateLabel ? <h2 className="px-1 pb-1 pt-4 text-sm font-black text-pine">{dateLabel}</h2> : null}
            <article
              className={`rounded-lg border bg-white p-3 shadow-sm ${
                isCurrent ? "border-pine ring-2 ring-emerald-100" : "border-line"
              }`}
            >
              <div className="grid grid-cols-[82px_1fr] gap-3">
                <div className="rounded-lg bg-field px-2 py-2 text-center">
                  <p className="text-[11px] font-black leading-4 text-slate-600">
                    {formatTimeRange(schedule.startTime, schedule.endTime)}
                  </p>
                  <Badge tone={statusTone[status]} className="mt-1">
                    {statusLabel[status]}
                  </Badge>
                </div>
                <div className="min-w-0 py-1">
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        isCurrent ? "bg-coral ring-4 ring-rose-100" : status === "ended" ? "bg-slate-300" : "bg-pine"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-black text-ink">{schedule.title}</h3>
                      <p className="mt-1 flex items-center gap-1 truncate text-sm font-black text-pine">
                        <MapPin size={15} className="shrink-0" />
                        <span className="truncate">{location?.name ?? "장소 미정"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Fragment>
        );
      })}
    </div>
  );
}
