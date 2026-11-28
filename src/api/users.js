// 회원(마이페이지) 관련 API
import { apiRequest } from './client.js'

// 회원가입: 소셜 로그인 후 신규 회원(isNewUser=true)이 닉네임·프로필 사진을 등록한다
// - nickname: 필수
// - photoFile: 선택 (사진을 고르지 않았으면 null → 사진 없이 가입)
// 이미 가입한 사람이 다시 불러도 아무것도 바뀌지 않고 성공으로 온다
export function signup({ nickname, photoFile }) {
  const formData = new FormData()
  // 닉네임은 'request' 라는 이름의 JSON 조각으로 보낸다 (서버 명세)
  formData.append(
    'request',
    new Blob([JSON.stringify({ nickname })], { type: 'application/json' }),
  )
  if (photoFile) formData.append('file', photoFile)

  return apiRequest('/api/v1/users/signup', { method: 'POST', formData })
}
