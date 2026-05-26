import type { Location, Notice, Participant, Quiz, ScheduleItem, Team, WorkshopControl } from "../types";

export interface WorkshopSnapshot {
  locations: Location[];
  schedules: ScheduleItem[];
  quizzes: Quiz[];
  participants: Participant[];
  teams: Team[];
  notices: Notice[];
  control: WorkshopControl;
}

export type Unsubscribe = () => void;

export interface WorkshopRealtimeRepository {
  subscribeWorkshop(workshopId: string, onSnapshot: (snapshot: WorkshopSnapshot) => void): Unsubscribe;
  updateSchedule(workshopId: string, scheduleId: string, patch: Partial<ScheduleItem>): Promise<void>;
  updateQuiz(workshopId: string, quizId: string, patch: Partial<Quiz>): Promise<void>;
  updateParticipant(workshopId: string, participantId: string, patch: Partial<Participant>): Promise<void>;
  updateNotice(workshopId: string, noticeId: string, patch: Partial<Notice>): Promise<void>;
  updateControl(workshopId: string, patch: Partial<WorkshopControl>): Promise<void>;
}

export const firebaseCollectionPlan = {
  workshop: "workshops/{workshopId}",
  locations: "workshops/{workshopId}/locations",
  schedules: "workshops/{workshopId}/schedules",
  quizzes: "workshops/{workshopId}/quizzes",
  participants: "workshops/{workshopId}/participants",
  teams: "workshops/{workshopId}/teams",
  notices: "workshops/{workshopId}/notices",
  control: "workshops/{workshopId}/control/current",
  users: "users/{uid}",
} as const;
