import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import EditionsPage from './EditionsPage'
import AuthPage from './pages/AuthPage'
import DashboardLayout from './pages/DashboardLayout'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EditionsPage />} />
        <Route path="/login" element={<AuthPage />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/projects" replace />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
