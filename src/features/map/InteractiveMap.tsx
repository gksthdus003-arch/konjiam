import { LocateFixed, MapPinned, Minus, Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Location } from "../../types";
import { Button } from "../../components/ui/Button";

interface InteractiveMapProps {
  locations: Location[];
  currentLocation?: Location;
  mode: "all" | "current";
  onModeChange: (mode: "all" | "current") => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const BASE_MAP_SRC = "/assets/konjiam-map-base.png";
const BUILDINGS_MAP_SRC = "/assets/konjiam-map-buildings.png";
const FALLBACK_MAP_SRC = "/assets/konjiam-map.svg";

export function InteractiveMap({ locations, currentLocation, mode, onModeChange }: InteractiveMapProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(mode === "current" ? currentLocation?.zoomArea.scale ?? 1.8 : 1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const [baseMapSrc, setBaseMapSrc] = useState(BASE_MAP_SRC);
  const [showBuildingOverlay, setShowBuildingOverlay] = useState(true);
  const workshopLocations = locations.filter((location) => location.isWorkshopVenue);

  const centerOnLocation = useCallback(
    (location?: Location) => {
      const viewport = viewportRef.current;
      if (!viewport || !location) {
        setScale(1);
        setOffset({ x: 0, y: 0 });
        return;
      }

      const rect = viewport.getBoundingClientRect();
      const nextScale = location.zoomArea.scale;
      const mapWidth = rect.width;
      const mapHeight = mapWidth * (1600 / 1200);
      const targetX = (mapWidth * location.zoomArea.xPercent) / 100;
      const targetY = (mapHeight * location.zoomArea.yPercent) / 100;

      setScale(nextScale);
      setOffset({
        x: rect.width / 2 - targetX * nextScale,
        y: rect.height / 2 - targetY * nextScale,
      });
    },
    [],
  );

  const resetView = useCallback(() => {
    if (mode === "current" && currentLocation) {
      centerOnLocation(currentLocation);
      return;
    }

    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [centerOnLocation, currentLocation, mode]);

  useEffect(() => {
    resetView();
  }, [resetView]);

  const zoomBy = (delta: number) => {
    setScale((current) => clamp(current + delta, 0.9, 3.2));
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-4">
        <button
          type="button"
          onClick={() => onModeChange("current")}
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-black ${
            mode === "current" ? "bg-pine text-white" : "bg-white text-slate-700 ring-1 ring-line"
          }`}
        >
          <LocateFixed size={17} />
          현재 장소
        </button>
        <button
          type="button"
          onClick={() => onModeChange("all")}
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-black ${
            mode === "all" ? "bg-pine text-white" : "bg-white text-slate-700 ring-1 ring-line"
          }`}
        >
          <MapPinned size={17} />
          전체 지도
        </button>
      </div>

      <div className="px-4">
        <div
          ref={viewportRef}
          className="relative h-[62vh] min-h-[470px] overflow-hidden rounded-lg border border-line bg-white shadow-sm touch-none"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragStart({ x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y });
          }}
          onPointerMove={(event) => {
            if (!dragStart) return;
            setOffset({
              x: dragStart.offsetX + event.clientX - dragStart.x,
              y: dragStart.offsetY + event.clientY - dragStart.y,
            });
          }}
          onPointerUp={() => setDragStart(null)}
          onPointerCancel={() => setDragStart(null)}
        >
          <div
            className="absolute left-0 top-0 w-full origin-top-left"
            style={{
              aspectRatio: "1200 / 1600",
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transition: dragStart ? "none" : "transform 220ms ease",
            }}
          >
            <img
              src={baseMapSrc}
              alt="곤지암 리조트 워크숍 지도"
              className="h-full w-full select-none object-cover"
              draggable={false}
              onError={() => setBaseMapSrc(FALLBACK_MAP_SRC)}
            />
            {showBuildingOverlay ? (
              <img
                src={BUILDINGS_MAP_SRC}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition ${
                  mode === "current" ? "opacity-95" : "opacity-0"
                }`}
                draggable={false}
                onError={() => setShowBuildingOverlay(false)}
              />
            ) : null}
            {currentLocation?.highlightArea ? (
              <div
                className="pointer-events-none absolute z-20 border-4 border-coral bg-rose-200/15 shadow-[0_0_0_999px_rgba(10,20,18,0.38),0_0_24px_rgba(232,93,79,0.8)]"
                style={{
                  left: `${currentLocation.highlightArea.xPercent}%`,
                  top: `${currentLocation.highlightArea.yPercent}%`,
                  width: `${currentLocation.highlightArea.widthPercent}%`,
                  height: `${currentLocation.highlightArea.heightPercent}%`,
                  transform: "translate(-50%, -50%)",
                  borderRadius: currentLocation.highlightArea.shape === "ellipse" ? "999px" : "14px",
                  opacity: mode === "current" ? 1 : 0,
                  transition: "opacity 180ms ease",
                }}
              />
            ) : null}
            {mode === "current" && currentLocation ? (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(circle at ${currentLocation.xPercent}% ${currentLocation.yPercent}%, rgba(255,255,255,0) 0 8%, rgba(10, 20, 18, 0.55) 15% 100%)`,
                }}
              />
            ) : null}
            {workshopLocations.map((location) => {
              const isCurrent = location.id === currentLocation?.id;
              const showLabel = mode === "all" || isCurrent;
              const labelX = location.xPercent + (location.labelOffset?.xPercent ?? 0);
              const labelY = location.yPercent + (location.labelOffset?.yPercent ?? 0);
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onModeChange("current");
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-full text-left ${isCurrent ? "z-20" : "z-10"}`}
                  style={{ left: `${location.xPercent}%`, top: `${location.yPercent}%` }}
                  aria-label={location.name}
                >
                  <span
                    className={`block rounded-full border-2 border-white shadow-lg ${
                      isCurrent ? "h-7 w-7 animate-pulse bg-coral ring-4 ring-rose-200" : "h-4 w-4 bg-pine"
                    }`}
                  />
                  {showLabel ? (
                    <span
                      className={`absolute block max-w-36 whitespace-nowrap rounded-md bg-white/95 px-2 py-1 text-[11px] font-black shadow-sm ring-1 ring-line ${
                        isCurrent ? "text-coral ring-rose-200" : "text-ink"
                      }`}
                      style={{
                        left: `${labelX - location.xPercent}%`,
                        top: `${labelY - location.yPercent}%`,
                        transform: "translate(-50%, 0)",
                      }}
                    >
                      {location.name}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <Button type="button" variant="secondary" className="h-10 w-10 p-0" onClick={() => zoomBy(0.25)} aria-label="확대">
              <Plus size={18} />
            </Button>
            <Button type="button" variant="secondary" className="h-10 w-10 p-0" onClick={() => zoomBy(-0.25)} aria-label="축소">
              <Minus size={18} />
            </Button>
            <Button type="button" variant="secondary" className="h-10 w-10 p-0" onClick={resetView} aria-label="지도 초기화">
              <RotateCcw size={17} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
