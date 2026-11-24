// 2-2 핫딜 상세 화면 (/hotdeal/:id)
// 1단계: 사진 영역 + 기본 정보 + 작성자 (본문·구매 링크·반응·댓글·하단 바는 다음 단계)
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import RankBadge from '../../components/common/RankBadge.jsx'
import { findHotdeal } from '../../mocks/hotdeals.js'
import cartLargeIcon from '../../assets/hotdeal/cart-large.svg'
import backIcon from '../../assets/icons/back.svg'
import shareIcon from '../../assets/icons/share.svg'
import moreIcon from '../../assets/icons/more.svg'
import eyeIcon from '../../assets/icons/eye-13.svg'
import avatarPlaceholder from '../../assets/profile/avatar-placeholder.svg'
import './HotdealDetailPage.css'

// 25400 → "25,400"
const formatNumber = (value) => value.toLocaleString('ko-KR')

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
      </section>
    </div>
  )
}

export default HotdealDetailPage
