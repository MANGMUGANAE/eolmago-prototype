// 1-2-2 프로필 설정 화면
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import defaultBg from '../../assets/profile/default-bg.svg'
import defaultPerson from '../../assets/profile/default-person.svg'
import cameraIcon from '../../assets/icons/camera.svg'
import clearIcon from '../../assets/icons/clear.svg'
import './ProfileSetupPage.css'

const NICKNAME_MAX = 10
// 한글(완성된 글자)·영문·숫자만, 2~10자
const NICKNAME_RULE = /^[가-힣a-zA-Z0-9]{2,10}$/

function ProfileSetupPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [photoUrl, setPhotoUrl] = useState(null)

  const isEmpty = nickname.length === 0
  const isValid = NICKNAME_RULE.test(nickname)

  // 사진이 바뀌거나 화면을 벗어나면 이전 미리보기 주소를 정리 (메모리 낭비 방지)
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) setPhotoUrl(URL.createObjectURL(file))
  }

  const handleNext = () => {
    // TODO: 닉네임 중복 확인·프로필 저장 API가 나오면 저장 후 이동하도록 연결
    navigate('/onboarding')
  }

  // 입력 상태에 따라 밑줄 색과 안내 문구를 다르게
  let fieldState = 'empty'
  if (!isEmpty) fieldState = isValid ? 'valid' : 'invalid'

  return (
    <div className="profile-setup">
      <section className="profile-setup__copy">
        <h1 className="text-title-26-bold">
          짠돌이들에게 보여줄
          <br />
          프로필을 만들어주세요
        </h1>
        <p className="profile-setup__description text-body-16-regular">
          닉네임은 한글·영문·숫자 2~10자예요
        </p>
      </section>

      {/* 프로필 사진: label 을 누르면 숨겨진 파일 선택창이 열림 */}
      <label className="profile-setup__photo">
        {photoUrl ? (
          <img className="profile-setup__photo-preview" src={photoUrl} alt="선택한 프로필 사진" />
        ) : (
          <>
            <img className="profile-setup__photo-bg" src={defaultBg} alt="" />
            <img className="profile-setup__photo-person" src={defaultPerson} alt="" />
          </>
        )}
        <span className="profile-setup__photo-badge">
          <img src={cameraIcon} alt="" />
        </span>
        <input
          type="file"
          accept="image/*"
          className="profile-setup__photo-input"
          aria-label="프로필 사진 선택"
          onChange={handlePhotoChange}
        />
      </label>

      <div className="profile-setup__field">
        <div className={`profile-setup__input-row profile-setup__input-row--${fieldState}`}>
          <input
            className="profile-setup__input text-heading-20-medium"
            type="text"
            value={nickname}
            maxLength={NICKNAME_MAX}
            placeholder="닉네임을 입력해 주세요"
            aria-label="닉네임"
            onChange={(event) => setNickname(event.target.value)}
          />
          {!isEmpty && (
            <button
              type="button"
              className="profile-setup__clear"
              aria-label="닉네임 지우기"
              onClick={() => setNickname('')}
            >
              <img src={clearIcon} alt="" />
            </button>
          )}
        </div>
        <div className="profile-setup__status">
          {fieldState === 'valid' && (
            <p className="profile-setup__message--valid text-caption-12-medium">
              사용할 수 있는 닉네임이에요
            </p>
          )}
          {fieldState === 'invalid' && (
            <p className="profile-setup__message--invalid text-caption-12-medium">
              한글·영문·숫자 2~10자로 입력해 주세요
            </p>
          )}
          <p className="profile-setup__count text-caption-12-regular">
            {nickname.length}/{NICKNAME_MAX}
          </p>
        </div>
      </div>

      <div className="profile-setup__bottom">
        <button
          type="button"
          className="profile-setup__next text-heading-16-bold"
          disabled={!isValid}
          onClick={handleNext}
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default ProfileSetupPage
