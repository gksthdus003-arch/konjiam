import { PageHeader } from "../components/ui/PageHeader";
import { ScheduleTimeline } from "../features/schedule/ScheduleTimeline";
import { selectCurrentSchedule, selectOrderedSchedules, useWorkshopStore } from "../store/workshopStore";

export function SchedulePage() {
  const schedules = useWorkshopStore(selectOrderedSchedules);
  const locations = useWorkshopStore((state) => state.locations);
  const currentSchedule = useWorkshopStore(selectCurrentSchedule);

  return (
    <div className="space-y-2">
      <PageHeader title="일정표" eyebrow="시간순 전체 일정" />
      <ScheduleTimeline schedules={schedules} locations={locations} currentScheduleId={currentSchedule?.id} />
    </div>
  );
}
