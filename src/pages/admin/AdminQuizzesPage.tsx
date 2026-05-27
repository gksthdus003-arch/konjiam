import { FormEvent, useMemo, useState } from "react";
import { Lock, Send, Unlock } from "lucide-react";
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
  const participants = useWorkshopStore((state) => state.participants);
  const quizResponses = useWorkshopStore((state) => state.quizResponses);
  const addQuiz = useWorkshopStore((state) => state.addQuiz);
  const updateQuiz = useWorkshopStore((state) => state.updateQuiz);
  const updateQuizOption = useWorkshopStore((state) => state.updateQuizOption);
  const toggleScheduleQuiz = useWorkshopStore((state) => state.toggleScheduleQuiz);
  const [scheduleId, setScheduleId] = useState(schedules[0]?.id ?? "");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [optionsText, setOptionsText] = useState("O\nX");

  const participantMap = useMemo(
    () => new Map(participants.map((participant) => [participant.id, participant])),
    [participants],
  );

  const normalize = (value: string) => value.trim().toLowerCase();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!scheduleId || !question.trim() || !answer.trim()) return;

    addQuiz({
      scheduleId,
      type: "multipleChoice",
      question: question.trim(),
      options: optionsText
        .split("\n")
        .map((option) => option.trim())
        .filter(Boolean),
      answer: answer.trim(),
      isOpen: true,
    });
    setQuestion("");
    setAnswer("");
  };

  return (
    <div className="space-y-4">
      <PageHeader title="퀴즈 관리" eyebrow="발송 · 응답 현황" />

      <section className="px-4">
        <Card className="p-4">
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-pine">
                <Send size={18} />
              </span>
              <div>
                <h2 className="text-base font-black text-ink">새 퀴즈 발송</h2>
                <p className="text-xs font-bold text-slate-500">발송 즉시 참가자에게 알림이 뜹니다.</p>
              </div>
            </div>
            <select
              value={scheduleId}
              onChange={(event) => setScheduleId(event.target.value)}
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm font-black outline-none focus:border-pine"
            >
              {schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.title}
                </option>
              ))}
            </select>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={2}
              placeholder="퀴즈 문제"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm font-semibold outline-none focus:border-pine"
            />
            <textarea
              value={optionsText}
              onChange={(event) => setOptionsText(event.target.value)}
              rows={3}
              placeholder={"보기는 줄바꿈으로 입력\n예: O\nX"}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm font-semibold outline-none focus:border-pine"
            />
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="정답"
              className="h-11 w-full rounded-lg border border-line px-3 text-sm font-black outline-none focus:border-pine"
            />
            <Button type="submit" className="w-full" disabled={!scheduleId || !question.trim() || !answer.trim()}>
              <Send size={17} />
              퀴즈 발송
            </Button>
          </form>
        </Card>
      </section>

      <section className="space-y-3 px-4">
        {quizzes.map((quiz) => {
          const schedule = schedules.find((item) => item.id === quiz.scheduleId);
          const isOpen = quiz.isOpen || Boolean(schedule?.quizOpen);
          const responses = quizResponses.filter((response) => response.quizId === quiz.id);
          const correctCount = responses.filter((response) => normalize(response.answer) === normalize(quiz.answer)).length;

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

              <div className="mt-4 rounded-lg bg-field p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-ink">응답 현황</p>
                  <p className="text-xs font-black text-pine">
                    정답 {correctCount} / 응답 {responses.length}
                  </p>
                </div>
                {responses.length > 0 ? (
                  <div className="mt-3 grid gap-2">
                    {responses.map((response) => {
                      const participant = participantMap.get(response.participantId);
                      const isCorrect = normalize(response.answer) === normalize(quiz.answer);
                      return (
                        <div
                          key={`${response.quizId}-${response.participantId}`}
                          className="flex min-h-10 items-center justify-between gap-2 rounded-lg bg-white px-3 text-sm font-bold"
                        >
                          <span>{participant?.name ?? response.participantId}</span>
                          <span className={isCorrect ? "text-pine" : "text-coral"}>
                            {response.answer} · {isCorrect ? "정답" : "오답"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-slate-500">아직 응답이 없습니다.</p>
                )}
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
