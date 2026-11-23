// 주소(URL)별로 어떤 화면을 보여줄지 정하는 곳
import { Routes, Route } from 'react-router'
import SplashPage from './pages/auth/SplashPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import ProfileSetupPage from './pages/auth/ProfileSetupPage.jsx'
import OnboardingPage from './pages/auth/OnboardingPage.jsx'
import HomePage from './pages/home/HomePage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  )
}

export default App
