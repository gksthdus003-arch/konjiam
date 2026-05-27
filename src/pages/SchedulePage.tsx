import { useMemo } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { ScheduleTimeline } from "../features/schedule/ScheduleTimeline";
import { sortSchedules } from "../lib/schedule";
import { selectCurrentSchedule, useWorkshopStore } from "../store/workshopStore";

export function SchedulePage() {
  const schedules = useWorkshopStore((state) => state.schedules);
  const orderedSchedules = useMemo(() => sortSchedules(schedules), [schedules]);
  const locations = useWorkshopStore((state) => state.locations);
  const currentSchedule = useWorkshopStore(selectCurrentSchedule);

  return (
    <div className="space-y-2">
      <PageHeader title="일정표" eyebrow="시간순 전체 일정" />
      <ScheduleTimeline schedules={orderedSchedules} locations={locations} currentScheduleId={currentSchedule?.id} />
    </div>
  );
}
