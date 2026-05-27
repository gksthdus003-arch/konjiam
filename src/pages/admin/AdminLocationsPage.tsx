import { MapPin } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { InteractiveMap } from "../../features/map/InteractiveMap";
import { resolveCurrentSchedule } from "../../lib/schedule";
import { useWorkshopStore } from "../../store/workshopStore";
import { useMemo, useState } from "react";

export function AdminLocationsPage() {
  const [mode, setMode] = useState<"all" | "current">("all");
  const locations = useWorkshopStore((state) => state.locations);
  const schedules = useWorkshopStore((state) => state.schedules);
  const manualCurrentScheduleId = useWorkshopStore((state) => state.manualCurrentScheduleId);
  const currentSchedule = useMemo(
    () => resolveCurrentSchedule(schedules, manualCurrentScheduleId),
    [manualCurrentScheduleId, schedules],
  );
  const currentLocation = useMemo(
    () => locations.find((location) => location.id === currentSchedule?.locationId),
    [currentSchedule?.locationId, locations],
  );
  const updateLocation = useWorkshopStore((state) => state.updateLocation);

  return (
    <div className="space-y-4">
      <PageHeader title="장소 관리" eyebrow="지도 핀 좌표 보정" />
      <InteractiveMap locations={locations} currentLocation={currentLocation} mode={mode} onModeChange={setMode} />

      <section className="space-y-3 px-4">
        {locations.map((location) => (
          <Card key={location.id} className="p-4">
            <div className="flex items-center gap-2">
              <MapPin size={17} className="text-pine" />
              <h2 className="text-base font-black text-ink">{location.name}</h2>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-bold text-slate-500">X {location.xPercent}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={location.xPercent}
                  onChange={(event) =>
                    updateLocation(location.id, {
                      xPercent: Number(event.target.value),
                      zoomArea: { ...location.zoomArea, xPercent: Number(event.target.value) },
                    })
                  }
                  className="w-full accent-teal-700"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-500">Y {location.yPercent}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={location.yPercent}
                  onChange={(event) =>
                    updateLocation(location.id, {
                      yPercent: Number(event.target.value),
                      zoomArea: { ...location.zoomArea, yPercent: Number(event.target.value) },
                    })
                  }
                  className="w-full accent-teal-700"
                />
              </label>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
