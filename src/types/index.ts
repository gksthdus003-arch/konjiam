export type ScheduleStatus = "scheduled" | "active" | "ended" | "skipped";

export type QuizType = "multipleChoice" | "ox" | "bowlingRank";

export type ParticipantRole = "participant" | "admin";

export interface ZoomArea {
  xPercent: number;
  yPercent: number;
  scale: number;
}

export interface Location {
  id: string;
  name: string;
  xPercent: number;
  yPercent: number;
  zoomArea: ZoomArea;
  description: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  locationId: string;
  description: string;
  supplies: string[];
  status: ScheduleStatus;
  isManuallyControlled: boolean;
  actualStartTime?: string;
  actualEndTime?: string;
  quizOpen: boolean;
  order: number;
}

export interface Quiz {
  id: string;
  scheduleId: string;
  type: QuizType;
  question: string;
  options: string[];
  answer: string;
  isOpen: boolean;
  closesAt?: string;
}

export interface LevelTestSubmission {
  experience: "first" | "casual" | "regular" | "league";
  averageScore: number;
  confidence: number;
  curveBall: boolean;
  note: string;
  submittedAt: string;
}

export interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  teamId?: string;
  levelTest?: LevelTestSubmission;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  meetingLocationId: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isPinned: boolean;
  isNew: boolean;
}

export interface QuizResponse {
  quizId: string;
  participantId: string;
  answer: string;
  submittedAt: string;
}

export interface WorkshopControl {
  manualCurrentScheduleId?: string;
}
