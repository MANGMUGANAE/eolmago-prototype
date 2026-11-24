// 소셜 로그인이 끝나고 돌아오는 화면 (/oauth/callback?accessToken=...)
// 주소에서 토큰을 꺼내 저장한 뒤 다음 화면으로 보낸다. 사용자에게는 잠깐만 보인다.
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { saveAccessToken } from '../../api/auth.js'
import './OAuthCallbackPage.css'

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const accessToken = searchParams.get('accessToken')

  useEffect(() => {
    if (!accessToken) {
      // 토큰이 없으면 로그인 실패 → 로그인 화면으로
      navigate('/login', { replace: true })
      return
    }

    saveAccessToken(accessToken)

    // TODO: 신규 회원인지 알 수 있게 되면 신규 → /profile-setup, 기존 → /home 으로 나누기
    // replace: 토큰이 붙은 주소가 방문 기록에 남지 않게
    navigate('/home', { replace: true })
  }, [accessToken, navigate])

  return <p className="oauth-callback text-body-15-regular">로그인 중이에요…</p>
}

export default OAuthCallbackPage
