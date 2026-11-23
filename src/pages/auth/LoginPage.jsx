// 1-2 로그인 화면
import LogoAppIcon from '../../components/common/LogoAppIcon.jsx'
import kakaoIcon from '../../assets/icons/kakao.svg'
import googleIcon from '../../assets/icons/google.svg'
import './LoginPage.css'

function LoginPage() {
  // TODO: 백엔드 인증 API가 나오면 실제 로그인으로 연결
  const handleKakaoLogin = () => {}
  const handleGoogleLogin = () => {}

  return (
    <div className="login">
      <section className="login__intro">
        <LogoAppIcon />
        <h1 className="login__title text-title-28-bold">
          사기 전에 한 번,
          <br />
          <span className="login__title-point">얼마고</span>?
        </h1>
        <p className="login__description text-body-16-regular">
          나만의 장보기 꿀팁을 나누는
          <br />
          짠돌이들의 핫딜 커뮤니티
        </p>
      </section>

      <section className="login__social">
        <button
          type="button"
          className="login__button login__button--kakao text-heading-16-bold"
          onClick={handleKakaoLogin}
        >
          <img src={kakaoIcon} alt="" />
          카카오로 시작하기
        </button>
        <button
          type="button"
          className="login__button login__button--google text-heading-16-bold"
          onClick={handleGoogleLogin}
        >
          <img src={googleIcon} alt="" />
          Google로 시작하기
        </button>
        <p className="login__terms text-caption-12-regular">
          시작하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 돼요
        </p>
      </section>
    </div>
  )
}

export default LoginPage
