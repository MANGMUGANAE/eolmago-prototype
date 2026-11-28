// 홈 피드 핫딜 카드 (피그마 "Deal Item" + 2-1 홈 화면의 카드)
// 사용 예) <HotdealCard deal={deal} />
//   deal = {
//     id: 1, mall: '쿠팡', title: '신라면 멀티팩 40개입', price: 25400,
//     commentCount: 31, authorRank: 'BEGINNER', likeCount: 96, viewCount: 1350,
//     timeAgo: '23분 전', isEnded: false, thumbnailUrl: 'https://...' 또는 null,
//   }
// 작성자가 짠돌고수(EXPERT)·짠돌9단(MASTER)이면 카드가 강조되고, 종료된 핫딜은 흐리게 보인다.
// 상품 사진(thumbnailUrl)이 없으면 장바구니 아이콘을 보여 준다.
// 카드를 누르면 그 핫딜의 상세 화면(/hotdeal/:id)으로 이동한다.
import { Link } from 'react-router'
import RankBadge from '../common/RankBadge.jsx'
import cartDefault from '../../assets/hotdeal/cart-default.svg'
import cartExpert from '../../assets/hotdeal/cart-expert.svg'
import cartMaster from '../../assets/hotdeal/cart-master.svg'
import commentIcon from '../../assets/icons/comment.svg'
import commentEndedIcon from '../../assets/icons/comment-ended.svg'
import thumbIcon from '../../assets/icons/thumb-14.svg'
import eyeIcon from '../../assets/icons/eye.svg'
import './HotdealCard.css'

// 강조되는 등급과 그때 쓰는 장바구니 아이콘
const HIGHLIGHT_CART = {
  EXPERT: cartExpert,
  MASTER: cartMaster,
}

// 25400 → "25,400"
const formatNumber = (value) => value.toLocaleString('ko-KR')

function HotdealCard({ deal }) {
  const {
    id,
    mall,
    title,
    price,
    commentCount,
    authorRank,
    likeCount,
    viewCount,
    timeAgo,
    isEnded,
    thumbnailUrl,
  } = deal

  // 카드 모양: ended(종료) > expert/master(강조) > default(기본)
  let variant = 'default'
  if (isEnded) variant = 'ended'
  else if (HIGHLIGHT_CART[authorRank]) variant = authorRank.toLowerCase()

  const cartIcon = (!isEnded && HIGHLIGHT_CART[authorRank]) || cartDefault

  return (
    <Link to={`/hotdeal/${id}`} className={`hotdeal-card hotdeal-card--${variant}`}>
      <div className="hotdeal-card__thumbnail">
        {thumbnailUrl ? (
          <img className="hotdeal-card__photo" src={thumbnailUrl} alt="" loading="lazy" />
        ) : (
          <img src={cartIcon} alt="" />
        )}
      </div>

      <div className="hotdeal-card__info">
        <div className="hotdeal-card__source text-caption-12-regular">
          {isEnded && <span className="hotdeal-card__ended-badge text-caption-11-bold">종료됨</span>}
          {mall}
        </div>

        <div className="hotdeal-card__title-row">
          <h3 className="hotdeal-card__title text-body-15-medium">{title}</h3>
          <span className="hotdeal-card__comments text-label-13-medium">
            <img src={isEnded ? commentEndedIcon : commentIcon} alt="댓글" />
            {formatNumber(commentCount)}
          </span>
        </div>

        <p className="hotdeal-card__price text-heading-17-bold">{formatNumber(price)}원</p>

        <div className="hotdeal-card__meta text-caption-12-regular">
          <RankBadge rank={authorRank} size="S" />
          <span className="hotdeal-card__stat">
            <span className="hotdeal-card__thumb-icon">
              <img src={thumbIcon} alt="도움돼요" />
            </span>
            {formatNumber(likeCount)}
          </span>
          <span className="hotdeal-card__stat">
            <img src={eyeIcon} alt="조회수" />
            {formatNumber(viewCount)}
          </span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </Link>
  )
}

export default HotdealCard
