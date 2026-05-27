import type { ScheduleItem, ScheduleStatus } from "../types";

export const sortSchedules = (schedules: ScheduleItem[]) => [...schedules].sort((a, b) => a.order - b.order);

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));

export const formatTimeRange = (startIso: string, endIso: string) => `${formatTime(startIso)}-${formatTime(endIso)}`;

export const formatDateLabel = (iso: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(iso));

export const formatDateTimeRange = (startIso: string, endIso: string) =>
  `${formatDateLabel(startIso)} ${formatTimeRange(startIso, endIso)}`;

export const getEffectiveStatus = (schedule: ScheduleItem, now = new Date()): ScheduleStatus => {
  if (schedule.status === "active" || schedule.status === "ended" || schedule.status === "skipped") {
    return schedule.status;
  }

  const start = new Date(schedule.startTime).getTime();
  const end = new Date(schedule.endTime).getTime();
  const current = now.getTime();

  if (current >= start && current < end) return "active";
  if (current >= end) return "ended";
  return "scheduled";
};

export const resolveCurrentSchedule = (
  schedules: ScheduleItem[],
  manualCurrentScheduleId?: string,
  now = new Date(),
) => {
  const ordered = sortSchedules(schedules);
  const manual = manualCurrentScheduleId
    ? ordered.find((schedule) => schedule.id === manualCurrentScheduleId && schedule.status !== "skipped")
    : undefined;
  if (manual) return manual;

  const active = ordered.find((schedule) => schedule.status === "active");
  if (active) return active;

  const nowMs = now.getTime();
  const byTime = ordered.find((schedule) => {
    const start = new Date(schedule.startTime).getTime();
    const end = new Date(schedule.endTime).getTime();
    return nowMs >= start && nowMs < end && schedule.status !== "skipped";
  });
  if (byTime) return byTime;

  return ordered.find((schedule) => new Date(schedule.startTime).getTime() > nowMs && schedule.status !== "skipped") ?? ordered.at(-1);
};

export const resolveNextSchedule = (schedules: ScheduleItem[], currentId?: string) => {
  const ordered = sortSchedules(schedules);
  const currentIndex = ordered.findIndex((schedule) => schedule.id === currentId);
  if (currentIndex < 0) return ordered.find((schedule) => schedule.status === "scheduled");
  return ordered.slice(currentIndex + 1).find((schedule) => schedule.status !== "skipped");
};

export const statusLabel: Record<ScheduleStatus, string> = {
  scheduled: "예정",
  active: "진행 중",
  ended: "종료",
  skipped: "건너뜀",
};
