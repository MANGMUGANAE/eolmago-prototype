// 1-1 스플래시 화면 (2초 뒤 로그인 화면으로 이동)
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import LogoMark from '../components/LogoMark.jsx'
import './SplashPage.css'

const SPLASH_DURATION_MS = 2000

function SplashPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      // replace: 뒤로 가기를 눌러도 스플래시로 돌아오지 않게
      navigate('/login', { replace: true })
    }, SPLASH_DURATION_MS)

    // 2초가 지나기 전에 화면을 벗어나면 타이머 취소
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="splash">
      <div className="splash__brand">
        <LogoMark />
        <h1 className="splash__wordmark">얼마고?</h1>
      </div>
      <p className="splash__tagline text-body-15-medium">사기 전에 한 번, 얼마고?</p>
    </div>
  )
}

export default SplashPage
