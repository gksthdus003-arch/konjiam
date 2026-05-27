import { CheckCircle2, LockKeyhole, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { formatTimeRange, getEffectiveStatus } from "../../lib/schedule";
import { useWorkshopStore } from "../../store/workshopStore";
import type { Quiz, ScheduleItem } from "../../types";

interface QuizCardProps {
  quiz: Quiz;
  schedule?: ScheduleItem;
}

const quizTypeLabel = {
  multipleChoice: "객관식",
  ox: "OX",
  bowlingRank: "순위",
} as const;

export function QuizCard({ quiz, schedule }: QuizCardProps) {
  const submitQuizResponse = useWorkshopStore((state) => state.submitQuizResponse);
  const quizResponses = useWorkshopStore((state) => state.quizResponses);
  const activeParticipantId = useWorkshopStore((state) => state.activeParticipantId);
  const existingResponse = useMemo(
    () => quizResponses.find((response) => response.quizId === quiz.id && response.participantId === activeParticipantId),
    [activeParticipantId, quiz.id, quizResponses],
  );
  const [answer, setAnswer] = useState(existingResponse?.answer ?? "");
  const isUnlocked = Boolean(quiz.isOpen || schedule?.quizOpen);
  const status = schedule ? getEffectiveStatus(schedule) : "scheduled";

  const helper = useMemo(() => {
    if (isUnlocked) return "응답 가능";
    if (status === "ended") return "관리자 오픈 대기";
    return "일정 종료 후 오픈";
  }, [isUnlocked, status]);

  return (
    <article className={`rounded-lg border bg-white p-4 shadow-sm ${isUnlocked ? "border-line" : "border-slate-200 opacity-85"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge tone={isUnlocked ? "green" : "gray"}>{quizTypeLabel[quiz.type]}</Badge>
            {schedule ? <span className="text-xs font-bold text-slate-500">{formatTimeRange(schedule.startTime, schedule.endTime)}</span> : null}
          </div>
          <h2 className="mt-2 text-base font-black text-ink">{quiz.question}</h2>
          <p className="mt-1 text-xs font-bold text-slate-500">{schedule?.title ?? "연결 일정 없음"} · {helper}</p>
        </div>
        {isUnlocked ? <CheckCircle2 className="shrink-0 text-pine" size={22} /> : <LockKeyhole className="shrink-0 text-slate-400" size={22} />}
      </div>

      {isUnlocked ? (
        <div className="mt-4 space-y-3">
          {quiz.options.length > 0 ? (
            <div className="grid gap-2">
              {quiz.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswer(option)}
                  className={`min-h-11 rounded-lg border px-3 text-left text-sm font-bold ${
                    answer === option ? "border-pine bg-emerald-50 text-pine" : "border-line bg-white text-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="예: 김민준, 이지은, 박서준"
              className="h-12 w-full rounded-lg border border-line px-3 text-sm font-semibold outline-none focus:border-pine"
            />
          )}
          <Button type="button" onClick={() => submitQuizResponse(quiz.id, answer)} disabled={!answer.trim()} className="w-full">
            <Send size={17} />
            {existingResponse ? "응답 수정" : "응답 제출"}
          </Button>
        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-600">
          퀴즈는 일정 종료 후 운영자가 열면 바로 표시됩니다.
        </div>
      )}
    </article>
  );
}
