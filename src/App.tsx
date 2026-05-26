import { Navigate, Route, Routes } from "react-router-dom";
import { MobileShell } from "./components/layout/MobileShell";
import { AdminHomePage } from "./pages/admin/AdminHomePage";
import { AdminLevelTestsPage } from "./pages/admin/AdminLevelTestsPage";
import { AdminLocationsPage } from "./pages/admin/AdminLocationsPage";
import { AdminNoticesPage } from "./pages/admin/AdminNoticesPage";
import { AdminQuizzesPage } from "./pages/admin/AdminQuizzesPage";
import { AdminSchedulePage } from "./pages/admin/AdminSchedulePage";
import { AdminTeamsPage } from "./pages/admin/AdminTeamsPage";
import { HomePage } from "./pages/HomePage";
import { LevelTestPage } from "./pages/LevelTestPage";
import { MapPage } from "./pages/MapPage";
import { QuizPage } from "./pages/QuizPage";
import { ScheduleDetailPage } from "./pages/ScheduleDetailPage";
import { SchedulePage } from "./pages/SchedulePage";
import { TeamPage } from "./pages/TeamPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MobileShell />}>
        <Route index element={<HomePage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="map/current" element={<MapPage initialMode="current" />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="schedule/:scheduleId" element={<ScheduleDetailPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="level-test" element={<LevelTestPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="admin" element={<AdminHomePage />} />
        <Route path="admin/schedule" element={<AdminSchedulePage />} />
        <Route path="admin/locations" element={<AdminLocationsPage />} />
        <Route path="admin/quizzes" element={<AdminQuizzesPage />} />
        <Route path="admin/level-tests" element={<AdminLevelTestsPage />} />
        <Route path="admin/teams" element={<AdminTeamsPage />} />
        <Route path="admin/notices" element={<AdminNoticesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
