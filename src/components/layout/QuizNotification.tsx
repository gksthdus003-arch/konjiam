import { BellRing, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWorkshopStore } from "../../store/workshopStore";
import { Button } from "../ui/Button";

export function QuizNotification() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dismissedQuizIds, setDismissedQuizIds] = useState<string[]>([]);
  const activeParticipantId = useWorkshopStore((state) => state.activeParticipantId);
  const quizzes = useWorkshopStore((state) => state.quizzes);
  const schedules = useWorkshopStore((state) => state.schedules);
  const quizResponses = useWorkshopStore((state) => state.quizResponses);

  const pendingQuiz = useMemo(
    () =>
      quizzes.find(
        (quiz) =>
          quiz.isOpen &&
          !dismissedQuizIds.includes(quiz.id) &&
          !quizResponses.some(
            (response) => response.quizId === quiz.id && response.participantId === activeParticipantId,
          ),
      ),
    [activeParticipantId, dismissedQuizIds, quizResponses, quizzes],
  );

  if (!pendingQuiz || pathname.startsWith("/admin") || pathname === "/quiz") return null;

  const schedule = schedules.find((item) => item.id === pendingQuiz.scheduleId);

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 mx-auto max-w-md px-4">
      <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <BellRing size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-amber-700">새 퀴즈 도착</p>
            <h2 className="mt-1 line-clamp-2 text-sm font-black text-ink">{pendingQuiz.question}</h2>
            <p className="mt-1 text-xs font-bold text-slate-500">{schedule?.title ?? "현장 퀴즈"}</p>
          </div>
          <button
            type="button"
            aria-label="퀴즈 알림 닫기"
            onClick={() => setDismissedQuizIds((ids) => [...ids, pendingQuiz.id])}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 active:bg-slate-200"
          >
            <X size={15} />
          </button>
        </div>
        <Button
          type="button"
          className="mt-3 w-full"
          onClick={() => navigate(`/quiz?quizId=${pendingQuiz.id}`)}
        >
          퀴즈 풀기
        </Button>
      </div>
    </div>
  );
}
