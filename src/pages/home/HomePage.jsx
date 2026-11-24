// 2-1 홈 화면
import { Fragment, useEffect, useRef, useState } from 'react'
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
// 스크롤한 만큼 요소를 같이 밀어 올리고(아래로 스크롤), 다시 내려오게(위로 스크롤) 한다.
// 사용: const ref = useHideOnScroll() → <div ref={ref}>
// 스크롤은 1초에 수십 번 일어나서, React 상태(useState) 대신 요소의 위치(transform)를 직접 바꾼다.
function useHideOnScroll() {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    let lastScrollY = window.scrollY
    let offset = 0 // 지금 위로 밀려 올라간 거리 (0 = 다 보임, 요소 높이 = 다 숨음)

    const handleScroll = () => {
      const currentScrollY = Math.max(window.scrollY, 0) // 맨 위에서 튕기는 경우(음수) 방지
      const diff = currentScrollY - lastScrollY // 아래로 스크롤하면 +, 위로 스크롤하면 -
      lastScrollY = currentScrollY

      // 스크롤한 만큼 더하고, 0 ~ 요소 높이 사이로 자름
      offset = Math.min(Math.max(offset + diff, 0), element.offsetHeight)
      element.style.transform = `translateY(-${offset}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // 화면을 벗어나면 스크롤 감지를 멈춤
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return ref
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
  const [searchKeyword, setSearchKeyword] = useState('')
  const toolbarRef = useHideOnScroll()

  const handleSearch = (event) => {
    event.preventDefault() // 폼 기본 동작(페이지 새로고침) 막기
    // TODO: 2-6 검색 결과 화면을 만들면 searchKeyword 로 이동
  }

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

      {/* 검색창·카테고리·필터: 스크롤한 만큼 같이 밀려 올라가고 내려옴 */}
      <div className="home__toolbar" ref={toolbarRef}>
        {/* 검색창: label 로 감싸서 돋보기를 눌러도 입력칸에 커서가 들어감 */}
        <form className="home__search-wrap" role="search" onSubmit={handleSearch}>
          <label className="home__search">
            <img src={searchIcon} alt="" />
            <input
              type="search"
              className="home__search-input text-body-15-regular"
              placeholder="사기 전에 한 번, 검색해 보세요"
              aria-label="핫딜 검색"
              enterKeyHint="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
          </label>
        </form>

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
