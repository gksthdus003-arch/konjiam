import { ClipboardCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { selectActiveParticipant, useWorkshopStore } from "../../store/workshopStore";
import type { LevelTestSubmission } from "../../types";

const experienceOptions: Array<{ value: LevelTestSubmission["experience"]; label: string }> = [
  { value: "first", label: "거의 처음" },
  { value: "casual", label: "가끔 침" },
  { value: "regular", label: "월 1회 이상" },
  { value: "league", label: "리그/동호회 경험" },
];

export function LevelTestForm() {
  const participant = useWorkshopStore(selectActiveParticipant);
  const submitLevelTest = useWorkshopStore((state) => state.submitLevelTest);
  const existing = participant?.levelTest;
  const [experience, setExperience] = useState<LevelTestSubmission["experience"]>(existing?.experience ?? "casual");
  const [averageScore, setAverageScore] = useState(existing?.averageScore ?? 100);
  const [confidence, setConfidence] = useState(existing?.confidence ?? 3);
  const [curveBall, setCurveBall] = useState(existing?.curveBall ?? false);
  const [note, setNote] = useState(existing?.note ?? "");
  const [saved, setSaved] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitLevelTest({ experience, averageScore, confidence, curveBall, note });
    setSaved(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 px-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-pine">
            <ClipboardCheck size={18} />
          </span>
          <div>
            <h2 className="text-base font-black">볼링 실력 간단 진단</h2>
            <p className="text-xs font-semibold text-slate-500">조 배정과 핸디캡 기준에 활용됩니다.</p>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <fieldset>
            <legend className="mb-2 text-sm font-black text-ink">볼링 경험</legend>
            <div className="grid grid-cols-2 gap-2">
              {experienceOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex min-h-12 items-center justify-center rounded-lg border px-3 text-sm font-bold ${
                    experience === option.value ? "border-pine bg-emerald-50 text-pine" : "border-line bg-white text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="experience"
                    value={option.value}
                    checked={experience === option.value}
                    onChange={() => setExperience(option.value)}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-sm font-black text-ink">평균 점수</span>
            <input
              type="number"
              min={30}
              max={300}
              value={averageScore}
              onChange={(event) => setAverageScore(Number(event.target.value))}
              className="mt-2 h-12 w-full rounded-lg border border-line px-3 text-base font-black outline-none focus:border-pine"
            />
          </label>

          <label className="block">
            <span className="flex justify-between text-sm font-black text-ink">
              <span>자신감</span>
              <span className="text-pine">{confidence}/5</span>
            </span>
            <input
              type="range"
              min={1}
              max={5}
              value={confidence}
              onChange={(event) => setConfidence(Number(event.target.value))}
              className="mt-3 w-full accent-teal-700"
            />
          </label>

          <label className="flex min-h-12 items-center justify-between rounded-lg border border-line px-3 text-sm font-bold text-slate-700">
            커브볼 가능
            <input
              type="checkbox"
              checked={curveBall}
              onChange={(event) => setCurveBall(event.target.checked)}
              className="h-5 w-5 accent-teal-700"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-ink">기타 메모</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="예: 손목 부상, 초보자와 같은 조 희망"
              className="mt-2 w-full rounded-lg border border-line px-3 py-3 text-sm font-semibold outline-none focus:border-pine"
            />
          </label>
        </div>
      </Card>

      {saved ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-pine">제출되었습니다. 운영자 화면에 즉시 반영됩니다.</p> : null}

      <Button type="submit" className="w-full">
        <ClipboardCheck size={18} />
        {existing ? "레벨 테스트 수정" : "레벨 테스트 제출"}
      </Button>
    </form>
  );
}
