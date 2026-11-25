// 2-2 핫딜 상세 화면 (/hotdeal/:id)
// 1단계: 사진 영역 + 기본 정보 + 작성자
// 2단계: 본문 + 구매 링크 + 도움돼요/별로예요 (댓글·하단 바는 다음 단계)
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import RankBadge from '../../components/common/RankBadge.jsx'
import { findHotdeal } from '../../mocks/hotdeals.js'
import cartLargeIcon from '../../assets/hotdeal/cart-large.svg'
import backIcon from '../../assets/icons/back.svg'
import shareIcon from '../../assets/icons/share.svg'
import moreIcon from '../../assets/icons/more.svg'
import eyeIcon from '../../assets/icons/eye-13.svg'
import avatarPlaceholder from '../../assets/profile/avatar-placeholder.svg'
import linkIcon from '../../assets/icons/link.svg'
import chevronRightIcon from '../../assets/icons/chevron-right-18.svg'
import thumbUpIcon from '../../assets/icons/thumb-up-18.svg'
import thumbDownIcon from '../../assets/icons/thumb-down-18.svg'
import './HotdealDetailPage.css'

// 25400 → "25,400"
const formatNumber = (value) => value.toLocaleString('ko-KR')

// "https://www.coupang.com/" → "www.coupang.com" (화면에 보여줄 때만)
const formatUrl = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

// 아이콘 모양만 쓰고 색은 CSS(currentColor)로 바꾸기 위한 스타일
// (작은 SVG는 빌드할 때 글자로 바뀌어 들어가서, 주소를 꼭 따옴표로 감싸야 함)
const maskStyle = (icon) => ({
  maskImage: `url("${icon}")`,
  WebkitMaskImage: `url("${icon}")`,
})

// 도움돼요 / 별로예요
// - 처음엔 둘 다 꺼짐 (마우스를 올리면 눌렀을 때 색을 미리 보여줌)
// - 하나를 누르면 켜지고 +1, 그 뒤로는 취소도 다른 쪽 선택도 안 됨
// TODO: 추천 API가 나오면
//   - 상세 응답의 "내가 누른 반응"으로 시작 (계정별로 유지)
//   - 누르면 서버에 저장 (한 계정에 한 번만, 취소·변경 불가는 서버에서도 막음)
function ReactionButtons({ likeCount, dislikeCount }) {
  const [myReaction, setMyReaction] = useState(null) // null | 'like' | 'dislike'
  const hasReacted = myReaction !== null

  const handleReact = (reaction) => {
    if (hasReacted) return
    setMyReaction(reaction)
  }

  const buttons = [
    { type: 'like', label: '도움돼요', count: likeCount, icon: thumbUpIcon },
    { type: 'dislike', label: '별로예요', count: dislikeCount, icon: thumbDownIcon },
  ]

  return (
    <div className="hotdeal-detail__reactions">
      {buttons.map((button) => {
        const isSelected = myReaction === button.type
        return (
          <button
            key={button.type}
            type="button"
            className={`hotdeal-detail__reaction hotdeal-detail__reaction--${button.type} ${
              isSelected ? 'hotdeal-detail__reaction--selected' : ''
            } text-label-14-medium`}
            disabled={hasReacted}
            aria-pressed={isSelected}
            onClick={() => handleReact(button.type)}
          >
            <span className="hotdeal-detail__reaction-icon">
              <span style={maskStyle(button.icon)} />
            </span>
            {button.label} {formatNumber(button.count + (isSelected ? 1 : 0))}
          </button>
        )
      })}
    </div>
  )
}

function HotdealDetailPage() {
  const navigate = useNavigate()
  // 주소 /hotdeal/3 의 "3" 을 꺼냄 (App.jsx 에서 path="/hotdeal/:id" 로 등록)
  const { id } = useParams()
  const deal = findHotdeal(id)

  // 상세 화면에 들어오면 맨 위부터 보이게
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const goBack = () => navigate(-1) // 브라우저 뒤로 가기와 같음

  if (!deal) {
    return (
      <div className="hotdeal-detail__not-found">
        <p className="text-body-15-regular">핫딜을 찾을 수 없어요</p>
        <button type="button" className="text-label-14-bold" onClick={() => navigate('/home')}>
          홈으로 가기
        </button>
      </div>
    )
  }

  return (
    <div className="hotdeal-detail">
      {/* ===== 사진 영역 ===== */}
      <section className="hotdeal-detail__photo">
        {/* TODO: 상품 사진이 생기면 사진 넘겨보기로 교체 (지금은 피그마처럼 장바구니 아이콘) */}
        <img className="hotdeal-detail__photo-placeholder" src={cartLargeIcon} alt="" />
        <span className="hotdeal-detail__photo-count text-caption-12-medium">
          1 / {deal.imageCount}
        </span>

        <nav className="hotdeal-detail__nav">
          <button type="button" className="hotdeal-detail__back" aria-label="뒤로 가기" onClick={goBack}>
            <img src={backIcon} alt="" />
          </button>
          <div className="hotdeal-detail__nav-actions">
            {/* TODO: 공유 기능 */}
            <button type="button" className="hotdeal-detail__nav-button" aria-label="공유하기">
              <img src={shareIcon} alt="" />
            </button>
            {/* TODO: 3-1 더보기 메뉴(신고 등)를 만들면 연결 */}
            <button type="button" className="hotdeal-detail__nav-button" aria-label="더보기">
              <img src={moreIcon} alt="" />
            </button>
          </div>
        </nav>
      </section>

      <section className="hotdeal-detail__body">
        {/* ===== 기본 정보 ===== */}
        <p className="hotdeal-detail__mall text-label-13-regular">{deal.mall}</p>
        <h1 className="hotdeal-detail__title text-title-21-bold">{deal.title}</h1>
        <p className="hotdeal-detail__price text-title-26-bold">{formatNumber(deal.price)}원</p>

        {/* ===== 작성자 ===== */}
        {/* TODO: 8-2 상대방 프로필 화면을 만들면 연결 */}
        <button type="button" className="hotdeal-detail__author">
          <img className="hotdeal-detail__avatar" src={avatarPlaceholder} alt="" />
          <span className="hotdeal-detail__author-info">
            <span className="hotdeal-detail__author-name-row">
              <span className="text-body-15-bold">{deal.authorName}</span>
              <RankBadge rank={deal.authorRank} size="S" />
            </span>
            <span className="hotdeal-detail__author-meta text-caption-12-regular">
              {deal.timeAgo} ·
              <span className="hotdeal-detail__eye">
                <img src={eyeIcon} alt="조회수" />
              </span>
              {formatNumber(deal.viewCount)}
            </span>
          </span>
        </button>

        {/* ===== 본문 ===== */}
        <p className="hotdeal-detail__content text-body-15-paragraph">{deal.content}</p>

        {/* ===== 구매 링크 (새 탭으로 열림) ===== */}
        <a
          className="hotdeal-detail__purchase-link"
          href={deal.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="hotdeal-detail__link-icon">
            <img src={linkIcon} alt="" />
          </span>
          <span className="hotdeal-detail__link-text">
            <span className="hotdeal-detail__link-label text-caption-12-regular">구매 링크</span>
            <span className="hotdeal-detail__link-url text-label-14-medium">
              {formatUrl(deal.purchaseUrl)}
            </span>
          </span>
          <span className="hotdeal-detail__link-chevron">
            <img src={chevronRightIcon} alt="" />
          </span>
        </a>

        {/* ===== 도움돼요 / 별로예요 ===== */}
        {/* key: 다른 핫딜로 넘어가면 누른 상태를 새로 시작 */}
        <ReactionButtons
          key={deal.id}
          likeCount={deal.likeCount}
          dislikeCount={deal.dislikeCount}
        />
      </section>
    </div>
  )
}

export default HotdealDetailPage
