// 주소(URL)별로 어떤 화면을 보여줄지 정하는 곳
import { Routes, Route } from 'react-router'
import SplashPage from './pages/auth/SplashPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage.jsx'
import ProfileSetupPage from './pages/auth/ProfileSetupPage.jsx'
import OnboardingPage from './pages/auth/OnboardingPage.jsx'
import HomePage from './pages/home/HomePage.jsx'
import HotdealDetailPage from './pages/hotdeal/HotdealDetailPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/home" element={<HomePage />} />
      {/* :id 자리에 핫딜 번호가 들어감 (예: /hotdeal/3) */}
      <Route path="/hotdeal/:id" element={<HotdealDetailPage />} />
    </Routes>
  )
}

export default App
