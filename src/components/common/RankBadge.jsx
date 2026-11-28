// 짠돌 등급 배지 (피그마 컴포넌트 "Rank Badge")
// 사용 예) <RankBadge rank="BEGINNER" size="S" />
//   rank: 서버 등급 값 그대로 (백엔드 JjandolRank)
//     'STARTER'(입문) | 'BEGINNER'(초수) | 'INTERMEDIATE'(중수) | 'EXPERT'(고수) | 'MASTER'(9단)
//     ⚠️ 'BEGINNER'는 '입문'이 아니라 '초수'
//   size: 'M'(진행도·마이용, 기본값) | 'S'(피드·댓글용)
// 아이콘 파일 이름(tag-beginner 등)은 피그마 이름 그대로라 서버 값과 다르다
import tagBeginnerM from '../../assets/rank/tag-beginner-m.svg'
import tagNoviceM from '../../assets/rank/tag-novice-m.svg'
import tagMiddleM from '../../assets/rank/tag-middle-m.svg'
import tagExpertM from '../../assets/rank/tag-expert-m.svg'
import crownMasterM from '../../assets/rank/crown-master-m.svg'
import tagBeginnerS from '../../assets/rank/tag-beginner-s.svg'
import tagNoviceS from '../../assets/rank/tag-novice-s.svg'
import tagMiddleS from '../../assets/rank/tag-middle-s.svg'
import tagExpertS from '../../assets/rank/tag-expert-s.svg'
import crownMasterS from '../../assets/rank/crown-master-s.svg'
import './RankBadge.css'

const RANKS = {
  STARTER: { label: '짠돌입문', icon: { M: tagBeginnerM, S: tagBeginnerS } },
  BEGINNER: { label: '짠돌초수', icon: { M: tagNoviceM, S: tagNoviceS } },
  INTERMEDIATE: { label: '짠돌중수', icon: { M: tagMiddleM, S: tagMiddleS } },
  EXPERT: { label: '짠돌고수', icon: { M: tagExpertM, S: tagExpertS } },
  MASTER: { label: '짠돌9단', icon: { M: crownMasterM, S: crownMasterS } },
}

// 크기별 글꼴 (tokens.css 클래스)
const TEXT_CLASS = {
  M: 'text-label-13-bold',
  S: 'text-caption-11-bold',
}

function RankBadge({ rank, size = 'M' }) {
  const info = RANKS[rank]
  if (!info) return null

  // CSS 클래스는 소문자 (예: rank-badge--starter)
  return (
    <span
      className={`rank-badge rank-badge--${size.toLowerCase()} rank-badge--${rank.toLowerCase()} ${TEXT_CLASS[size]}`}
    >
      <img src={info.icon[size]} alt="" />
      {info.label}
    </span>
  )
}

export default RankBadge
