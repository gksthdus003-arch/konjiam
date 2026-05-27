import { Navigate, Route, Routes } from "react-router-dom";
import { MobileShell } from "./components/layout/MobileShell";
import { AdminLevelTestsPage } from "./pages/admin/AdminLevelTestsPage";
import { AdminLocationsPage } from "./pages/admin/AdminLocationsPage";
import { AdminNoticesPage } from "./pages/admin/AdminNoticesPage";
import { AdminQuizzesPage } from "./pages/admin/AdminQuizzesPage";
import { AdminSchedulePage } from "./pages/admin/AdminSchedulePage";
import { AdminTeamsPage } from "./pages/admin/AdminTeamsPage";
import { LevelTestPage } from "./pages/LevelTestPage";
import { MapPage } from "./pages/MapPage";
import { QuizPage } from "./pages/QuizPage";
import { ScheduleDetailPage } from "./pages/ScheduleDetailPage";
import { SchedulePage } from "./pages/SchedulePage";
import { TeamPage } from "./pages/TeamPage";
import { AppErrorBoundary } from "./components/layout/AppErrorBoundary";

export default function App() {
  return (
    <AppErrorBoundary>
      <Routes>
        <Route element={<MobileShell />}>
          <Route index element={<Navigate to="/map" replace />} />
          <Route path="map" element={<MapPage />} />
          <Route path="map/current" element={<MapPage initialMode="current" />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="schedule/:scheduleId" element={<ScheduleDetailPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="level-test" element={<LevelTestPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="admin" element={<Navigate to="/admin/schedule" replace />} />
          <Route path="admin/schedule" element={<AdminSchedulePage />} />
          <Route path="admin/locations" element={<AdminLocationsPage />} />
          <Route path="admin/quizzes" element={<AdminQuizzesPage />} />
          <Route path="admin/level-tests" element={<AdminLevelTestsPage />} />
          <Route path="admin/users" element={<AdminTeamsPage />} />
          <Route path="admin/teams" element={<Navigate to="/admin/users" replace />} />
          <Route path="admin/notices" element={<AdminNoticesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AppErrorBoundary>
  );
}
