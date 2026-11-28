// 2-1 홈 화면
import { Fragment, useEffect, useEffectEvent, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import HotdealCard from '../../components/hotdeal/HotdealCard.jsx'
import BottomTabBar from '../../components/common/BottomTabBar.jsx'
import { getCategories, getDealPosts } from '../../api/dealPosts.js'
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

// ===== 정렬 (값은 서버 sortType 그대로) =====
const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'price', label: '가격순' }, // 싼 것부터
  { value: 'grade', label: '등급순' }, // 높은 등급부터
]

// 선택한 칩·종료 제외·정렬 → 핫딜 목록 API 조건
// selectedCategory: ALL | POPULAR | 카테고리 번호
function toDealQuery(selectedCategory, excludeEnded, sortOption) {
  return {
    categoryId: typeof selectedCategory === 'number' ? selectedCategory : undefined,
    // TODO: "인기" 기준이 서버의 핫딜 필터(hotDeal)와 같은지 백엔드 확인 필요
    hotDeal: selectedCategory === POPULAR,
    excludeEnded,
    sortType: sortOption,
  }
}

// 정렬 버튼 + 드롭다운 메뉴 (피그마 2-1-3 "Dropdown/정렬")
function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapRef = useRef(null)
  const selected = SORT_OPTIONS.find((option) => option.value === value)

  // 메뉴가 열려 있을 때만: 바깥을 누르거나 Esc 를 누르면 닫기
  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event) => {
      if (!wrapRef.current.contains(event.target)) setIsOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="home__sort-wrap" ref={wrapRef}>
      <button
        type="button"
        className="home__sort"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.label}
        <span className="home__sort-icon">
          <img src={chevronDownIcon} alt="" />
        </span>
      </button>

      {isOpen && (
        <ul className="home__sort-menu" role="listbox" aria-label="정렬">
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.value === value
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={
                    isSelected
                      ? 'home__sort-option home__sort-option--selected text-label-14-bold'
                      : 'home__sort-option text-label-14-medium'
                  }
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function CategoryChip({ label, isPopular = false, isSelected, onSelect }) {
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
  const navigate = useNavigate()
  const [categories, setCategories] = useState([]) // [{ categoryId, categoryName }]
  const [selectedCategory, setSelectedCategory] = useState(ALL)
  const [excludeEnded, setExcludeEnded] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortOption, setSortOption] = useState('latest')
  const toolbarRef = useHideOnScroll()

  // 불러온 핫딜 목록. key 는 어떤 조건으로 불러온 목록인지 표시
  // → 조건(filterKey)이 바뀌었는데 key 가 아직 예전 값이면 "불러오는 중"
  const [list, setList] = useState({ key: null, deals: [], page: 0, hasNext: false, error: null })
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [retryCount, setRetryCount] = useState(0) // "다시 시도"를 누르면 1 증가 → 다시 불러옴
  const moreRef = useRef(null) // 목록 맨 아래 표시: 화면에 보이면 다음 페이지를 불러옴

  const filterKey = `${selectedCategory}|${excludeEnded}|${sortOption}`
  const isLoading = list.key !== filterKey

  // 로그인이 풀렸으면(401) 로그인 화면으로
  const handleApiError = (error) => {
    if (error.status === 401) {
      navigate('/login', { replace: true })
      return true
    }
    return false
  }

  // 카테고리 칩: 화면에 처음 들어올 때 한 번 불러옴 (실패하면 전체·인기 칩만 보임)
  useEffect(() => {
    let ignore = false
    getCategories()
      .then((result) => {
        if (!ignore) setCategories(result)
      })
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [])

  // 조건이 바뀌면 첫 페이지부터 다시 불러옴
  // ignore: 응답이 오기 전에 조건이 또 바뀌면 늦게 온 예전 응답은 버린다
  useEffect(() => {
    let ignore = false
    const key = `${selectedCategory}|${excludeEnded}|${sortOption}`

    getDealPosts({ ...toDealQuery(selectedCategory, excludeEnded, sortOption), page: 0 })
      .then((result) => {
        if (ignore) return
        setList({ key, deals: result.deals, page: result.page, hasNext: result.hasNext, error: null })
      })
      .catch((error) => {
        if (ignore) return
        if (error.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setList({ key, deals: [], page: 0, hasNext: false, error })
      })

    return () => {
      ignore = true
    }
  }, [selectedCategory, excludeEnded, sortOption, retryCount, navigate])

  // 다음 페이지 불러와서 뒤에 이어 붙이기
  const loadMore = async () => {
    if (isLoading || isLoadingMore || !list.hasNext) return
    const key = list.key
    setIsLoadingMore(true)
    try {
      const result = await getDealPosts({
        ...toDealQuery(selectedCategory, excludeEnded, sortOption),
        page: list.page + 1,
      })
      // 그사이 조건이 바뀌었으면 버림
      setList((prev) =>
        prev.key === key
          ? { ...prev, deals: [...prev.deals, ...result.deals], page: result.page, hasNext: result.hasNext }
          : prev,
      )
    } catch (error) {
      // 다음 페이지 실패는 조용히 넘어감 (스크롤하면 다시 시도)
      handleApiError(error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // 목록 맨 아래가 화면에 보이면 다음 페이지 불러오기
  const onReachEnd = useEffectEvent(() => {
    loadMore()
  })

  useEffect(() => {
    const element = moreRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onReachEnd()
      },
      { rootMargin: '200px' }, // 맨 아래 200px 전부터 미리 불러옴
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [list.key, list.hasNext])

  const handleRetry = () => {
    setList((prev) => ({ ...prev, key: null }))
    setRetryCount((count) => count + 1)
  }

  const handleSearch = (event) => {
    event.preventDefault() // 폼 기본 동작(페이지 새로고침) 막기
    // TODO: 2-6 검색 결과 화면을 만들면 searchKeyword 로 이동 (목록 API 의 keyword 사용)
  }

  const deals = isLoading ? [] : list.deals

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
          <CategoryChip
            label={ALL}
            isSelected={selectedCategory === ALL}
            onSelect={() => setSelectedCategory(ALL)}
          />
          <CategoryChip
            label={POPULAR}
            isPopular
            isSelected={selectedCategory === POPULAR}
            onSelect={() => setSelectedCategory(POPULAR)}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category.categoryId}
              label={category.categoryName}
              isSelected={selectedCategory === category.categoryId}
              onSelect={() => setSelectedCategory(category.categoryId)}
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
          <SortDropdown value={sortOption} onChange={setSortOption} />
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

      {isLoading && (
        <p className="home__empty text-body-15-regular" role="status">
          핫딜을 불러오는 중이에요
        </p>
      )}

      {!isLoading && list.error && (
        <div className="home__empty home__error text-body-15-regular" role="alert">
          <p>핫딜을 불러오지 못했어요</p>
          <button type="button" className="home__retry text-label-14-medium" onClick={handleRetry}>
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !list.error && deals.length === 0 && (
        <p className="home__empty text-body-15-regular">조건에 맞는 핫딜이 없어요</p>
      )}

      {/* 다음 페이지가 있을 때만: 이 표시가 화면에 보이면 더 불러옴 */}
      {!isLoading && list.hasNext && (
        <div ref={moreRef} className="home__more text-label-13-medium" aria-hidden="true">
          {isLoadingMore ? '더 불러오는 중…' : ''}
        </div>
      )}

      <BottomTabBar />
    </div>
  )
}

export default HomePage
