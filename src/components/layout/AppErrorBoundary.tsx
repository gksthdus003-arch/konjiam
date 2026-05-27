import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error?: Error;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App render error", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-field px-4 py-10 text-ink">
        <div className="mx-auto max-w-md">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-coral">
                <AlertTriangle size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-black">화면을 다시 불러와야 합니다</h1>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  일시적인 화면 오류가 발생했습니다. 새로고침하면 현재 상태로 다시 이어집니다.
                </p>
                {import.meta.env.DEV ? (
                  <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-700">
                    {this.state.error.message}
                  </pre>
                ) : null}
              </div>
            </div>
            <Button type="button" className="mt-4 w-full" onClick={() => window.location.reload()}>
              <RotateCcw size={17} />
              새로고침
            </Button>
          </Card>
        </div>
      </div>
    );
  }
}
