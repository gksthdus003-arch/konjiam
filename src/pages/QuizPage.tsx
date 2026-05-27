import { PageHeader } from "../components/ui/PageHeader";
import { QuizCard } from "../features/quiz/QuizCard";
import { sortSchedules } from "../lib/schedule";
import { useWorkshopStore } from "../store/workshopStore";

export function QuizPage() {
  const quizzes = useWorkshopStore((state) => state.quizzes);
  const schedules = useWorkshopStore((state) => state.schedules);
  const orderedScheduleIds = sortSchedules(schedules).map((schedule) => schedule.id);
  const orderedQuizzes = [...quizzes].sort(
    (a, b) => Number(b.isOpen) - Number(a.isOpen) || orderedScheduleIds.indexOf(a.scheduleId) - orderedScheduleIds.indexOf(b.scheduleId),
  );

  return (
    <div className="space-y-3">
      <PageHeader title="퀴즈" eyebrow="일정 종료 후 오픈" />
      <section className="space-y-3 px-4">
        {orderedQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} schedule={schedules.find((schedule) => schedule.id === quiz.scheduleId)} />
        ))}
      </section>
    </div>
  );
}
