import { FormEvent, useState } from "react";
import { BellPlus } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { useWorkshopStore } from "../../store/workshopStore";

export function AdminNoticesPage() {
  const notices = useWorkshopStore((state) => state.notices);
  const addNotice = useWorkshopStore((state) => state.addNotice);
  const updateNotice = useWorkshopStore((state) => state.updateNotice);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPinned, setIsPinned] = useState(true);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    addNotice({ title, body, isPinned });
    setTitle("");
    setBody("");
    setIsPinned(true);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="공지 관리" eyebrow="앱 내 알림 배너" />

      <section className="px-4">
        <Card className="p-4">
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="공지 제목"
              className="h-12 w-full rounded-lg border border-line px-3 text-sm font-black outline-none focus:border-pine"
            />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={3}
              placeholder="공지 내용"
              className="w-full rounded-lg border border-line px-3 py-3 text-sm font-semibold outline-none focus:border-pine"
            />
            <label className="flex min-h-11 items-center justify-between rounded-lg bg-field px-3 text-sm font-bold">
              상단 고정
              <input type="checkbox" checked={isPinned} onChange={(event) => setIsPinned(event.target.checked)} className="h-5 w-5 accent-teal-700" />
            </label>
            <Button type="submit" className="w-full">
              <BellPlus size={17} />
              공지 등록
            </Button>
          </form>
        </Card>
      </section>

      <section className="space-y-3 px-4">
        {notices.map((notice) => (
          <Card key={notice.id} className="p-4">
            <div className="flex items-center gap-2">
              {notice.isNew ? <Badge tone="red">NEW</Badge> : null}
              {notice.isPinned ? <Badge tone="amber">고정</Badge> : null}
            </div>
            <h2 className="mt-2 text-base font-black text-ink">{notice.title}</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{notice.body}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" onClick={() => updateNotice(notice.id, { isPinned: !notice.isPinned })}>
                {notice.isPinned ? "고정 해제" : "상단 고정"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => updateNotice(notice.id, { isNew: !notice.isNew })}>
                {notice.isNew ? "읽음 처리" : "NEW 표시"}
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
