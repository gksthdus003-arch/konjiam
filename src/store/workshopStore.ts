import { create } from "zustand";
import {
  initialManualCurrentScheduleId,
  locations,
  notices,
  participants,
  quizzes,
  schedules,
  teams,
} from "../data/mockData";
import { resolveCurrentSchedule, resolveNextSchedule } from "../lib/schedule";
import type {
  LevelTestSubmission,
  Location,
  Notice,
  Participant,
  Quiz,
  QuizResponse,
  ScheduleItem,
  ScheduleStatus,
  Team,
} from "../types";

interface WorkshopState {
  workshopId: string;
  activeParticipantId: string;
  locations: Location[];
  schedules: ScheduleItem[];
  quizzes: Quiz[];
  participants: Participant[];
  teams: Team[];
  notices: Notice[];
  quizResponses: QuizResponse[];
  manualCurrentScheduleId?: string;
  setManualCurrentSchedule: (scheduleId?: string) => void;
  startSchedule: (scheduleId: string) => void;
  endSchedule: (scheduleId: string) => void;
  moveToNextSchedule: () => void;
  updateSchedule: (scheduleId: string, patch: Partial<ScheduleItem>) => void;
  updateScheduleStatus: (scheduleId: string, status: ScheduleStatus) => void;
  toggleScheduleQuiz: (scheduleId: string, isOpen: boolean) => void;
  addQuiz: (quiz: Omit<Quiz, "id">) => void;
  updateQuiz: (quizId: string, patch: Partial<Quiz>) => void;
  updateQuizOption: (quizId: string, optionIndex: number, value: string) => void;
  submitQuizResponse: (quizId: string, answer: string) => void;
  submitLevelTest: (submission: Omit<LevelTestSubmission, "submittedAt">) => void;
  assignParticipantTeam: (participantId: string, teamId?: string) => void;
  updateLocation: (locationId: string, patch: Partial<Location>) => void;
  addNotice: (notice: Pick<Notice, "title" | "body" | "isPinned">) => void;
  updateNotice: (noticeId: string, patch: Partial<Notice>) => void;
  markNoticeRead: (noticeId: string) => void;
}

const nowIso = () => new Date().toISOString();

export const useWorkshopStore = create<WorkshopState>((set, get) => ({
  workshopId: "konjiam-2026",
  activeParticipantId: "p-1",
  locations,
  schedules,
  quizzes,
  participants,
  teams,
  notices,
  quizResponses: [],
  manualCurrentScheduleId: initialManualCurrentScheduleId,
  setManualCurrentSchedule: (scheduleId) =>
    set((state) => ({
      manualCurrentScheduleId: scheduleId,
      schedules: state.schedules.map((schedule) => ({
        ...schedule,
        isManuallyControlled: schedule.id === scheduleId ? Boolean(scheduleId) : schedule.isManuallyControlled,
      })),
    })),
  startSchedule: (scheduleId) =>
    set((state) => ({
      manualCurrentScheduleId: scheduleId,
      schedules: state.schedules.map((schedule) => {
        if (schedule.id === scheduleId) {
          return {
            ...schedule,
            status: "active",
            isManuallyControlled: true,
            actualStartTime: schedule.actualStartTime ?? nowIso(),
          };
        }

        if (schedule.status === "active") {
          return {
            ...schedule,
            status: "ended",
            actualEndTime: schedule.actualEndTime ?? nowIso(),
          };
        }

        return schedule;
      }),
    })),
  endSchedule: (scheduleId) =>
    set((state) => ({
      manualCurrentScheduleId: state.manualCurrentScheduleId === scheduleId ? undefined : state.manualCurrentScheduleId,
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              status: "ended",
              actualEndTime: schedule.actualEndTime ?? nowIso(),
              isManuallyControlled: true,
              quizOpen: true,
            }
          : schedule,
      ),
      quizzes: state.quizzes.map((quiz) => (quiz.scheduleId === scheduleId ? { ...quiz, isOpen: true } : quiz)),
    })),
  moveToNextSchedule: () => {
    const state = get();
    const current = resolveCurrentSchedule(state.schedules, state.manualCurrentScheduleId);
    const next = resolveNextSchedule(state.schedules, current?.id);
    if (!next) return;
    get().startSchedule(next.id);
  },
  updateSchedule: (scheduleId, patch) =>
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, ...patch } : schedule,
      ),
    })),
  updateScheduleStatus: (scheduleId, status) =>
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              status,
              isManuallyControlled: true,
              actualStartTime: status === "active" ? schedule.actualStartTime ?? nowIso() : schedule.actualStartTime,
              actualEndTime: status === "ended" ? schedule.actualEndTime ?? nowIso() : schedule.actualEndTime,
            }
          : schedule,
      ),
      manualCurrentScheduleId: status === "active" ? scheduleId : state.manualCurrentScheduleId,
    })),
  toggleScheduleQuiz: (scheduleId, isOpen) =>
    set((state) => ({
      schedules: state.schedules.map((schedule) => (schedule.id === scheduleId ? { ...schedule, quizOpen: isOpen } : schedule)),
      quizzes: state.quizzes.map((quiz) => (quiz.scheduleId === scheduleId ? { ...quiz, isOpen } : quiz)),
    })),
  addQuiz: (quiz) =>
    set((state) => ({
      quizzes: [
        {
          ...quiz,
          id: `quiz-${crypto.randomUUID()}`,
        },
        ...state.quizzes,
      ],
    })),
  updateQuiz: (quizId, patch) =>
    set((state) => ({
      quizzes: state.quizzes.map((quiz) => (quiz.id === quizId ? { ...quiz, ...patch } : quiz)),
    })),
  updateQuizOption: (quizId, optionIndex, value) =>
    set((state) => ({
      quizzes: state.quizzes.map((quiz) =>
        quiz.id === quizId
          ? {
              ...quiz,
              options: quiz.options.map((option, index) => (index === optionIndex ? value : option)),
            }
          : quiz,
      ),
    })),
  submitQuizResponse: (quizId, answer) =>
    set((state) => ({
      quizResponses: [
        ...state.quizResponses.filter(
          (response) => !(response.quizId === quizId && response.participantId === state.activeParticipantId),
        ),
        {
          quizId,
          participantId: state.activeParticipantId,
          answer,
          submittedAt: nowIso(),
        },
      ],
    })),
  submitLevelTest: (submission) =>
    set((state) => ({
      participants: state.participants.map((participant) =>
        participant.id === state.activeParticipantId
          ? {
              ...participant,
              levelTest: {
                ...submission,
                submittedAt: nowIso(),
              },
            }
          : participant,
      ),
    })),
  assignParticipantTeam: (participantId, teamId) =>
    set((state) => ({
      participants: state.participants.map((participant) =>
        participant.id === participantId ? { ...participant, teamId } : participant,
      ),
    })),
  updateLocation: (locationId, patch) =>
    set((state) => ({
      locations: state.locations.map((location) => (location.id === locationId ? { ...location, ...patch } : location)),
    })),
  addNotice: (notice) =>
    set((state) => ({
      notices: [
        {
          id: `notice-${crypto.randomUUID()}`,
          title: notice.title,
          body: notice.body,
          isPinned: notice.isPinned,
          isNew: true,
          createdAt: nowIso(),
        },
        ...state.notices,
      ],
    })),
  updateNotice: (noticeId, patch) =>
    set((state) => ({
      notices: state.notices.map((notice) => (notice.id === noticeId ? { ...notice, ...patch } : notice)),
    })),
  markNoticeRead: (noticeId) =>
    set((state) => ({
      notices: state.notices.map((notice) => (notice.id === noticeId ? { ...notice, isNew: false } : notice)),
    })),
}));
