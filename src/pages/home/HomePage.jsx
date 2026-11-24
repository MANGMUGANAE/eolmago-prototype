// 2-1 홈 화면
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router'
import HotdealCard from '../../components/hotdeal/HotdealCard.jsx'
import BottomTabBar from '../../components/common/BottomTabBar.jsx'
import { CATEGORIES, HOTDEALS } from '../../mocks/hotdeals.js'
import bellIcon from '../../assets/icons/bell.svg'
import notificationDot from '../../assets/home/notification-dot.svg'
import searchIcon from '../../assets/icons/search.svg'
import flameIcon from '../../assets/icons/flame.svg'
import chevronDownIcon from '../../assets/icons/chevron-down.svg'
import chevronRightIcon from '../../assets/icons/chevron-right.svg'
import adPlaceholder from '../../assets/home/ad-placeholder.svg'
import './HomePage.css'

const ALL = '전체'
const POPULAR = '인기'
const AD_INTERVAL = 5 // 핫딜 5개마다 광고 1개
const SCROLL_THRESHOLD = 8 // 이만큼(px) 이상 움직였을 때만 방향을 바꿈 (손 떨림에 깜빡이지 않게)

// 아래로 스크롤하면 false(숨김), 위로 스크롤하면 true(보임)를 돌려준다
function useShowOnScrollUp() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastScrollY

      if (currentScrollY <= 0) {
        setIsVisible(true) // 맨 위에서는 항상 보임
      } else if (Math.abs(diff) < SCROLL_THRESHOLD) {
        return // 조금만 움직였으면 무시 (lastScrollY 도 그대로)
      } else {
        setIsVisible(diff < 0) // 위로 올리면(diff < 0) 보임
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // 화면을 벗어나면 스크롤 감지를 멈춤
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return isVisible
}

// 선택한 카테고리·종료 제외 여부에 맞춰 보여줄 핫딜 목록을 만든다
function getVisibleDeals(selectedCategory, excludeEnded) {
  let deals = HOTDEALS

  if (selectedCategory === POPULAR) {
    // TODO: 인기 기준이 정해지면 API 정렬로 교체 (지금은 도움돼요 많은 순)
    deals = [...deals].sort((a, b) => b.likeCount - a.likeCount)
  } else if (selectedCategory !== ALL) {
    deals = deals.filter((deal) => deal.category === selectedCategory)
  }

  if (excludeEnded) {
    deals = deals.filter((deal) => !deal.isEnded)
  }

  return deals
}

function CategoryChip({ label, isSelected, onSelect }) {
  const isPopular = label === POPULAR
  const className = [
    'home__chip',
    isPopular && 'home__chip--popular',
    isSelected && 'home__chip--selected',
    'text-label-14-medium',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={className} aria-pressed={isSelected} onClick={onSelect}>
      {isPopular && <img src={flameIcon} alt="" />}
      {label}
    </button>
  )
}

function AdSlot() {
  // TODO: 광고 데이터가 생기면 실제 광고로 교체 (지금은 피그마 예시 그대로)
  return (
    <div className="home__ad">
      <div className="home__ad-image">
        <img src={adPlaceholder} alt="" />
      </div>
      <div className="home__ad-body">
        <div className="home__ad-source text-caption-12-regular">
          <span className="home__ad-label text-caption-11-bold">광고</span>
          싱싱마켓
        </div>
        <p className="home__ad-title text-body-15-medium">첫 장보기 최대 50% 할인</p>
        <p className="home__ad-description text-label-13-regular">신규 가입하면 무료배송 쿠폰까지</p>
        <span className="home__ad-link text-label-13-bold">
          자세히 보기
          <img src={chevronRightIcon} alt="" />
        </span>
      </div>
    </div>
  )
}

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(ALL)
  const [excludeEnded, setExcludeEnded] = useState(false)
  const isToolbarVisible = useShowOnScrollUp()

  const deals = getVisibleDeals(selectedCategory, excludeEnded)

  // 이미 홈이라 주소는 그대로고, 맨 위로 부드럽게 올라감
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="home">
      {/* 로고·알림 줄: 항상 화면 맨 위에 고정 */}
      <header className="home__header">
        <h1>
          <Link to="/home" className="home__wordmark" onClick={scrollToTop}>
            얼마고<span className="home__wordmark-point">?</span>
          </Link>
        </h1>
        {/* TODO: 2-7 알림 화면을 만들면 연결 */}
        <button type="button" className="home__bell" aria-label="알림">
          <img className="home__bell-icon" src={bellIcon} alt="" />
          <img className="home__bell-dot" src={notificationDot} alt="새 알림 있음" />
        </button>
      </header>

      {/* 검색창·카테고리·필터: 아래로 스크롤하면 숨고, 위로 올리면 다시 나타남 */}
      <div className={`home__toolbar ${isToolbarVisible ? '' : 'home__toolbar--hidden'}`}>
        {/* TODO: 2-6 검색 화면을 만들면 연결 */}
        <div className="home__search-wrap">
          <button type="button" className="home__search">
            <img src={searchIcon} alt="" />
            <span className="text-body-15-regular">사기 전에 한 번, 검색해 보세요</span>
          </button>
        </div>

        <nav className="home__categories" aria-label="카테고리">
          {[ALL, POPULAR, ...CATEGORIES].map((category) => (
            <CategoryChip
              key={category}
              label={category}
              isSelected={selectedCategory === category}
              onSelect={() => setSelectedCategory(category)}
            />
          ))}
        </nav>

        <div className="home__filter text-label-13-medium">
          <label className="home__exclude-ended">
            <input
              type="checkbox"
              checked={excludeEnded}
              onChange={(event) => setExcludeEnded(event.target.checked)}
            />
            <span className="home__checkbox" aria-hidden="true" />
            종료 제외
          </label>
          {/* TODO: 2-1-3 정렬 선택 화면을 만들면 연결 */}
          <button type="button" className="home__sort">
            최신순
            <span className="home__sort-icon">
              <img src={chevronDownIcon} alt="" />
            </span>
          </button>
        </div>
      </div>

      <ul className="home__deals">
        {deals.map((deal, index) => {
          const showAd = (index + 1) % AD_INTERVAL === 0
          const isLast = index === deals.length - 1
          return (
            <Fragment key={deal.id}>
              <li>
                <HotdealCard deal={deal} />
              </li>
              {showAd ? (
                <li>
                  <AdSlot />
                </li>
              ) : (
                !isLast && <li className="home__divider" aria-hidden="true" />
              )}
            </Fragment>
          )
        })}
      </ul>

      {deals.length === 0 && (
        <p className="home__empty text-body-15-regular">조건에 맞는 핫딜이 없어요</p>
      )}

      <BottomTabBar />
    </div>
  )
}

export default HomePage
