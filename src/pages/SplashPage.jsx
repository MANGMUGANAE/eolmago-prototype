// 1-1 스플래시 화면
import LogoMark from '../components/LogoMark.jsx'
import './SplashPage.css'

function SplashPage() {
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
