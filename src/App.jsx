// 디자인 토큰 확인용 임시 화면 (나중에 홈 화면으로 교체 예정)
function App() {
  return (
    <main style={{ padding: 20 }}>
      <h1 className="text-title-28-bold">
        얼마고<span style={{ color: 'var(--primary-500)' }}>?</span>
      </h1>
      <p className="text-body-15-regular" style={{ color: 'var(--gray-600)', marginTop: 8 }}>
        사기 전에 한 번, 검색해 보세요
      </p>
      <p className="text-heading-20-bold" style={{ marginTop: 24 }}>
        25,400원
      </p>
      <p className="text-label-13-bold" style={{ color: 'var(--hot-500)', marginTop: 8 }}>
        🔥 인기
      </p>
    </main>
  )
}

export default App
