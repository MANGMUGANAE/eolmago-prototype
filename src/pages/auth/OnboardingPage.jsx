// 1-3 온보딩 ① 짠돌 등급 → 1-4 온보딩 ② 업적과 짠돌주화
// 두 화면은 아래쪽 문구·버튼 틀이 같아서 한 페이지에서 step 으로 바꿔 보여준다.
import { useState } from 'react'
import { useNavigate } from 'react-router'
import RankBadge from '../../components/common/RankBadge.jsx'
import avatarPlaceholder from '../../assets/profile/avatar-placeholder.svg'
import crownIcon from '../../assets/icons/crown.svg'
import coinLargeIcon from '../../assets/icons/coin-72.svg'
import coinSmallIcon from '../../assets/icons/coin-16.svg'
import checkIcon from '../../assets/icons/check.svg'
import thumbIcon from '../../assets/icons/thumb.svg'
import calendarIcon from '../../assets/icons/calendar.svg'
import './OnboardingPage.css'

// ① 짠돌 등급 막대 (높이는 피그마 값)
const RANK_STEPS = [
  { key: 'STARTER', label: '짠돌입문', height: 56 },
  { key: 'BEGINNER', label: '짠돌초수', height: 88 },
  { key: 'INTERMEDIATE', label: '짠돌중수', height: 120 },
  { key: 'EXPERT', label: '짠돌고수', height: 152 },
  { key: 'MASTER', label: '짠돌9단', height: 192 },
]

// ② 업적 예시 (progress: 0~1)
const ACHIEVEMENTS = [
  { key: 'first-deal', title: '첫 핫딜 공유하기', icon: checkIcon, progress: 1, reward: 10 },
  { key: 'likes', title: '도움돼요 50개 받기', icon: thumbIcon, progress: 32 / 50, reward: 30 },
  { key: 'visit', title: '7일 연속 방문하기', icon: calendarIcon, progress: 5 / 7, reward: 20 },
]

const STEPS = [
  {
    title: ['꿀팁을 나눌수록', '짠돌 등급이 올라가요'],
    description: ['짠돌입문부터 짠돌9단까지!', '핫딜을 나누고 주화를 모아 승급할 수 있어요.'],
    buttonLabel: '다음',
  },
  {
    title: ['업적을 달성하면', '짠돌주화를 받아요'],
    description: ['업적을 깨고 짠돌주화를 모아보세요.', '모은 주화는 질문과 승급에 쓸 수 있어요!'],
    buttonLabel: '시작하기',
  },
]

function RankIllustration() {
  return (
    <>
      <div className="onboarding__author-card">
        <img src={avatarPlaceholder} alt="" />
        <div>
          <div className="onboarding__author-name-row">
            <span className="text-body-15-bold">짠돌이자취러</span>
            <RankBadge rank="BEGINNER" size="S" />
          </div>
          <p className="onboarding__author-activity text-caption-12-regular">
            신라면 멀티팩 40개입 핫딜을 공유했어요
          </p>
        </div>
      </div>

      <ul className="onboarding__rank-steps">
        {RANK_STEPS.map((step) => (
          <li key={step.key} className={`onboarding__rank-step onboarding__rank-step--${step.key.toLowerCase()}`}>
            {step.key === 'MASTER' && <img src={crownIcon} alt="" />}
            <div className="onboarding__rank-bar" style={{ height: step.height }} />
            <span className="text-caption-12-bold">{step.label}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

function AchievementIllustration() {
  return (
    <>
      <img src={coinLargeIcon} alt="" />
      <ul className="onboarding__achievements">
        {ACHIEVEMENTS.map((item) => {
          const isDone = item.progress >= 1
          return (
            <li key={item.key} className="onboarding__achievement">
              <div
                className={`onboarding__achievement-icon ${isDone ? 'onboarding__achievement-icon--done' : ''}`}
              >
                <img className={`onboarding__icon--${item.key}`} src={item.icon} alt="" />
              </div>
              <div className="onboarding__achievement-body">
                <p className="text-label-14-bold">{item.title}</p>
                <div className="onboarding__progress">
                  <div
                    className={`onboarding__progress-fill ${isDone ? 'onboarding__progress-fill--done' : ''}`}
                    style={{ width: `${item.progress * 100}%` }}
                  />
                </div>
              </div>
              <div className="onboarding__reward text-label-14-bold">
                <img src={coinSmallIcon} alt="" />+{item.reward}
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLastStep = step === STEPS.length - 1

  const finishOnboarding = () => {
    // replace: 홈에서 뒤로 가기를 눌러도 온보딩으로 돌아오지 않게
    navigate('/home', { replace: true })
  }

  const handleNext = () => {
    if (isLastStep) finishOnboarding()
    else setStep(step + 1)
  }

  return (
    <div className="onboarding">
      <button
        type="button"
        className="onboarding__skip text-body-15-medium"
        onClick={finishOnboarding}
      >
        건너뛰기
      </button>

      <section className="onboarding__illustration">
        {step === 0 ? <RankIllustration /> : <AchievementIllustration />}
      </section>

      <section className="onboarding__copy">
        <h1 className="text-title-26-bold">
          {current.title[0]}
          <br />
          {current.title[1]}
        </h1>
        <p className="onboarding__description text-body-16-regular">
          {current.description[0]}
          <br />
          {current.description[1]}
        </p>
      </section>

      <div className="onboarding__bottom">
        <button type="button" className="onboarding__next text-heading-16-bold" onClick={handleNext}>
          {current.buttonLabel}
        </button>
      </div>
    </div>
  )
}

export default OnboardingPage
