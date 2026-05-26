import { Lock, Unlock } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { useWorkshopStore } from "../../store/workshopStore";

const quizTypeLabel = {
  multipleChoice: "객관식",
  ox: "OX",
  bowlingRank: "순위",
} as const;

export function AdminQuizzesPage() {
  const quizzes = useWorkshopStore((state) => state.quizzes);
  const schedules = useWorkshopStore((state) => state.schedules);
  const updateQuiz = useWorkshopStore((state) => state.updateQuiz);
  const updateQuizOption = useWorkshopStore((state) => state.updateQuizOption);
  const toggleScheduleQuiz = useWorkshopStore((state) => state.toggleScheduleQuiz);

  return (
    <div className="space-y-4">
      <PageHeader title="퀴즈 관리" eyebrow="문제, 정답, 오픈 제어" />
      <section className="space-y-3 px-4">
        {quizzes.map((quiz) => {
          const schedule = schedules.find((item) => item.id === quiz.scheduleId);
          const isOpen = quiz.isOpen || Boolean(schedule?.quizOpen);

          return (
            <Card key={quiz.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone={isOpen ? "green" : "gray"}>{isOpen ? "오픈" : "잠금"}</Badge>
                    <Badge tone="blue">{quizTypeLabel[quiz.type]}</Badge>
                  </div>
                  <h2 className="mt-2 text-sm font-black text-slate-500">{schedule?.title ?? "연결 일정 없음"}</h2>
                </div>
                <Button
                  type="button"
                  variant={isOpen ? "danger" : "primary"}
                  className="min-h-10 px-3"
                  onClick={() => {
                    updateQuiz(quiz.id, { isOpen: !isOpen });
                    if (schedule) toggleScheduleQuiz(schedule.id, !isOpen);
                  }}
                >
                  {isOpen ? <Lock size={16} /> : <Unlock size={16} />}
                  {isOpen ? "마감" : "오픈"}
                </Button>
              </div>

              <label className="mt-4 block">
                <span className="mb-1 block text-xs font-bold text-slate-500">문제</span>
                <textarea
                  value={quiz.question}
                  rows={2}
                  onChange={(event) => updateQuiz(quiz.id, { question: event.target.value })}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm font-semibold outline-none focus:border-pine"
                />
              </label>

              {quiz.options.length > 0 ? (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-bold text-slate-500">보기</p>
                  {quiz.options.map((option, index) => (
                    <input
                      key={`${quiz.id}-${index}`}
                      value={option}
                      onChange={(event) => updateQuizOption(quiz.id, index, event.target.value)}
                      className="h-11 w-full rounded-lg border border-line px-3 text-sm font-semibold outline-none focus:border-pine"
                    />
                  ))}
                </div>
              ) : null}

              <label className="mt-3 block">
                <span className="mb-1 block text-xs font-bold text-slate-500">정답</span>
                <input
                  value={quiz.answer}
                  onChange={(event) => updateQuiz(quiz.id, { answer: event.target.value })}
                  placeholder={quiz.type === "bowlingRank" ? "1위, 2위, 3위 순서 입력" : "정답 입력"}
                  className="h-12 w-full rounded-lg border border-line px-3 text-sm font-black outline-none focus:border-pine"
                />
              </label>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
