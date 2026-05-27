import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { InteractiveMap } from "../features/map/InteractiveMap";
import { resolveCurrentSchedule } from "../lib/schedule";
import { useWorkshopStore } from "../store/workshopStore";

interface MapPageProps {
  initialMode?: "all" | "current";
}

export function MapPage({ initialMode = "all" }: MapPageProps) {
  const [mode, setMode] = useState<"all" | "current">(initialMode);
  const schedules = useWorkshopStore((state) => state.schedules);
  const manualCurrentScheduleId = useWorkshopStore((state) => state.manualCurrentScheduleId);
  const locations = useWorkshopStore((state) => state.locations);
  const currentSchedule = useMemo(
    () => resolveCurrentSchedule(schedules, manualCurrentScheduleId),
    [manualCurrentScheduleId, schedules],
  );
  const currentLocation = useMemo(
    () => locations.find((location) => location.id === currentSchedule?.locationId),
    [currentSchedule?.locationId, locations],
  );

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  return (
    <div className="space-y-2">
      <PageHeader title="지도" eyebrow={mode === "current" ? "현재 장소 보기" : "전체 지도 보기"} />
      <InteractiveMap locations={locations} currentLocation={currentLocation} mode={mode} onModeChange={setMode} />
      {currentLocation ? (
        <div className="px-4">
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-pine">현재 장소</p>
            <h2 className="mt-1 text-lg font-black text-ink">{currentLocation.name}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-600">{currentLocation.description}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
