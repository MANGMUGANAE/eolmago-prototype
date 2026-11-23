# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 참고하는 안내 문서입니다.

## 프로젝트 개요

- **이름**: 얼마고?(Eolmago) 웹 프로토타입
- **서비스 내용**: 실구매가·핫딜 공유 커뮤니티 서비스
- **목적**: 캡스톤디자인 수업 기말 프로젝트용이며, 졸업작품으로 이어질 예정

## 기술 스택

- React + Vite (JavaScript)
- ESLint
- Node.js 24

## 저장소

- GitHub: [MANGMUGANAE/eolmago-prototype](https://github.com/MANGMUGANAE/eolmago-prototype)
- 기본 브랜치: `main`

## 디자인

- 피그마: https://www.figma.com/design/4VifIO6LeNxqzm9E6pJ2hR/얼마고
- 모바일(iOS) 화면 기준으로 디자인되어 있음

## 백엔드 API

- API 명세(Swagger): https://api.eolmago.co.kr/swagger-ui/index.html
- 개발 완료된 API가 계속 추가되므로, API 연동 작업 전에는 최신 명세를 확인할 것

## 커밋 메시지 규칙

`접두사 : 한글 내용` 형식을 따른다. (콜론 앞뒤로 공백 한 칸)

| 접두사 | 용도 | 예시 |
| --- | --- | --- |
| `feat` | 새 기능 추가 | `feat : 메인 페이지 구현` |
| `fix` | 버그 수정 | `fix : 로그인 오류 수정` |
| `style` | 디자인·스타일 수정 | `style : 버튼 디자인 수정` |
| `chore` | 설정·빌드 등 기타 변경 | `chore : 설정 변경` |
| `docs` | 문서 수정 | `docs : 문서 수정` |

## 작업 방식

- 사용자는 Git과 React를 배우는 중이다.
- 한 번에 많이 바꾸지 말고 **한 단계씩** 진행한다.
- 파일을 바꾸기 전에 **무엇을, 왜** 바꾸는지 짧게 설명한다.
- 대답은 항상 **한국어**로 한다.
