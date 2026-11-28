// 소셜 로그인이 끝나고 돌아오는 화면
// (/oauth/callback?accessToken=...&refreshToken=...&isNewUser=true|false)
// 주소에서 토큰을 꺼내 저장한 뒤 다음 화면으로 보낸다. 사용자에게는 잠깐만 보인다.
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { saveTokens } from '../../api/auth.js'
import './OAuthCallbackPage.css'

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  // 주소에 붙은 값은 글자라서 'true' 와 비교한다
  const isNewUser = searchParams.get('isNewUser') === 'true'

  useEffect(() => {
    if (!accessToken) {
      // 토큰이 없으면 로그인 실패 → 로그인 화면으로
      navigate('/login', { replace: true })
      return
    }

    saveTokens({ accessToken, refreshToken })

    // 신규 회원 → 프로필 설정, 기존 회원 → 홈
    // replace: 토큰이 붙은 주소가 방문 기록에 남지 않게
    navigate(isNewUser ? '/profile-setup' : '/home', { replace: true })
  }, [accessToken, refreshToken, isNewUser, navigate])

  return <p className="oauth-callback text-body-15-regular">로그인 중이에요…</p>
}

export default OAuthCallbackPage
