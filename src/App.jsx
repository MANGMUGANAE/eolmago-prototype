// 주소(URL)별로 어떤 화면을 보여줄지 정하는 곳
import { Routes, Route } from 'react-router'
import SplashPage from './pages/SplashPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfileSetupPage from './pages/ProfileSetupPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
    </Routes>
  )
}

export default App
