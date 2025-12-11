# 🌿 자연치유관광 포럼 온라인 교육 플랫폼

> 사이버대학교 스타일의 온라인 교육 플랫폼  
> 네이버 웨일온 실시간 세미나 + 유튜브 녹화 강의 + 출석/과제 관리

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-brightgreen)](https://pages.github.com/)

## 📋 목차
- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [빠른 시작](#빠른-시작)
- [회원 등급 체계](#회원-등급-체계)
- [파일 구조](#파일-구조)
- [배포 가이드](#배포-가이드)
- [라이선스](#라이선스)

---

## 🎯 프로젝트 소개

자연치유관광 포럼의 온라인 교육 플랫폼입니다. 전문가 양성, 일반인 대상 교육, 세미나 등을 온라인으로 제공하며, 완전 무료 인프라(GitHub Pages + Google Sheets)로 구축되었습니다.

### ✨ 특징
- 🎓 **실시간 세미나**: 네이버 웨일온 연동
- 📚 **온라인 강좌**: 유튜브 기반 VOD 학습
- 💳 **결제 시스템**: 토스페이먼츠 연동
- 👥 **회원 등급**: 4단계 등급별 콘텐츠 접근 제어
- 📊 **관리자 대시보드**: 회원/강좌/수강 현황 관리
- 📱 **반응형 디자인**: 모바일/PC 최적화

---

## 🚀 주요 기능

### 1️⃣ 회원 시스템
- 이메일 기반 회원가입/로그인
- 4단계 등급 체계 (일반인 → 포럼 회원 → 전문위원 → 운영진)
- 내 강의실 (수강 중인 강좌 관리)

### 2️⃣ 세미나
- 실시간 세미나 (네이버 웨일온 링크)
- 녹화 영상 다시보기 (유튜브)
- 상태별 필터 (예정/진행중/종료)
- 카테고리별 분류

### 3️⃣ 강좌
- 유료/무료 강좌
- 커리큘럼 상세 정보
- 출석 체크 (강의 시청 완료)
- 과제 제출 및 피드백
- 수료 기준: 출석률 80% + 과제 100%

### 4️⃣ 결제
- 토스페이먼츠 연동
- 신용카드/카카오페이/계좌이체
- 결제 내역 조회
- 환불 처리

### 5️⃣ 관리자
- 대시보드 (통계)
- 회원 관리 (등급 변경)
- 강좌/세미나 관리
- 수강 현황 확인

---

## 🛠️ 기술 스택

### Frontend
- **HTML5** / **CSS3** / **JavaScript (Vanilla)**
- Google Fonts (Noto Sans KR)
- 반응형 디자인 (Flexbox, Grid)

### Backend
- **Google Apps Script** (서버리스)
- **Google Sheets** (데이터베이스)

### 결제
- **토스페이먼츠 API** (테스트/라이브 모드)

### 호스팅
- **GitHub Pages** (무료)

### 외부 연동
- **네이버 웨일온** (실시간 세미나)
- **유튜브** (녹화 영상)

---

## ⚡ 빠른 시작

### 1. 필수 요구사항
- Google 계정
- GitHub 계정
- (선택) 토스페이먼츠 계정

### 2. Google Sheets 설정
```
1. Google Drive에서 스프레드시트 생성
2. 9개 시트 생성 (회원정보, 세미나일정, 강좌목록 등)
3. 헤더 입력
```
👉 자세한 가이드: [SETUP-GUIDE.md](SETUP-GUIDE.md) 참고

### 3. Google Apps Script 배포
```
1. 스프레드시트 > 확장 프로그램 > Apps Script
2. apps-script-*.js 파일 내용 복사
3. 배포 > 웹 앱 > 모든 사용자 액세스
4. 배포 URL 복사
```

### 4. 설정 파일 수정
```javascript
// js/config.js
const CONFIG = {
    APPS_SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL'
};

// js/payment.js (토스페이먼츠 사용 시)
const TOSS_CLIENT_KEY = 'test_ck_...';
const TOSS_SECRET_KEY = 'test_sk_...';
```

### 5. GitHub Pages 배포
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main

# GitHub 저장소 Settings > Pages > Deploy from main
```

### 6. 접속
```
https://username.github.io/repo/
```

---

## 👥 회원 등급 체계

| 등급 | 세미나 | 강좌 | 관리 기능 |
|------|--------|------|-----------|
| **일반인** | 무료 세미나만 | 무료 강좌만 | ❌ |
| **포럼 회원** | 전체 세미나 | 일부 무료 강좌 | ❌ |
| **전문위원** | 전체 세미나 | 전체 강좌 + 강의 업로드 | 과제 피드백 |
| **운영진** | 전체 | 전체 | 전체 관리 권한 |

---

## 📁 파일 구조

```
natural-healing-edu/
├── index.html              # 메인 페이지
├── login.html              # 로그인
├── register.html           # 회원가입
├── dashboard.html          # 내 강의실
├── seminars.html           # 세미나 목록
├── courses.html            # 강좌 목록
├── course-detail.html      # 강좌 상세
├── payment.html            # 결제 페이지
├── payment-success.html    # 결제 성공
├── payment-fail.html       # 결제 실패
├── admin.html              # 관리자 대시보드
├── admin-users.html        # 회원 관리
├── admin-enrollments.html  # 수강 현황
├── css/
│   └── style.css           # 전체 스타일
├── js/
│   ├── config.js           # API URL 설정
│   ├── auth.js             # 인증 시스템
│   ├── seminar.js          # 세미나 기능
│   ├── course.js           # 강좌 기능
│   ├── payment.js          # 결제 기능
│   └── admin.js            # 관리자 기능
├── apps-script-stage1.js   # Apps Script (1단계)
├── apps-script-stage2.js   # Apps Script (2단계)
├── apps-script-stage3.js   # Apps Script (3단계)
├── apps-script-stage4.js   # Apps Script (4단계)
├── SETUP-GUIDE.md          # 상세 설정 가이드
└── README.md               # 프로젝트 소개
```

---

## 🚀 배포 가이드

### GitHub Pages 배포
1. 저장소 생성 (Public)
2. 코드 푸시
3. Settings > Pages > Deploy from main
4. 5-10분 대기
5. `https://username.github.io/repo/` 접속

### 커스텀 도메인 설정
1. 도메인 구매
2. GitHub Pages에서 Custom domain 설정
3. DNS CNAME 레코드 추가
   ```
   CNAME: www → username.github.io
   ```

### 실제 운영 전환
1. 토스페이먼츠 **라이브 키** 발급
2. `payment.js`의 키를 라이브 키로 변경
3. 실제 사업자 정보로 설정

---

## 📊 데이터 관리

모든 데이터는 **Google Sheets**에서 관리합니다:

- **회원정보**: 이메일, 이름, 등급
- **세미나일정**: 일정, 웨일온 링크, 녹화 영상
- **강좌목록**: 강좌 기본 정보
- **강좌상세**: 각 강의 정보
- **수강신청**: 수강 신청 내역
- **출석기록**: 강의 시청 기록
- **과제제출**: 과제 제출 및 피드백
- **결제내역**: 결제 및 환불 정보

구글 시트에서 직접 데이터를 추가/수정하면 즉시 반영됩니다!

---

## 🔒 보안

- 비밀번호는 **평문 저장** (프로토타입용)
  - 실제 운영 시 해시 처리 권장
- 토스페이먼츠 시크릿 키는 **서버 사이드**에서 관리 권장
- CORS 정책으로 승인된 도메인에서만 접근 가능

---

## 🎨 커스터마이징

### 색상 변경
`css/style.css`에서 다음 색상 변경:
```css
:root {
    --primary-color: #2d5016;    /* 주 색상 */
    --secondary-color: #4a7c2c;  /* 보조 색상 */
}
```

### 로고 변경
```html
<!-- index.html -->
<div class="logo">
    <h1>자연치유관광 포럼</h1>
    <p>Natural Healing Tourism Forum</p>
</div>
```

### 썸네일 이미지
구글 시트 "강좌목록"의 `thumbnail` 컬럼에 이미지 URL 입력

---

## 🐛 문제 해결

### Apps Script 오류
- 배포 URL이 `config.js`에 정확히 입력되었는지 확인
- Apps Script 실행 로그 확인

### 결제 오류
- 토스페이먼츠 키 확인 (`test_ck_...`, `test_sk_...`)
- 브라우저 콘솔(F12)에서 오류 확인

### GitHub Pages 404
- Settings > Pages에서 배포 상태 확인
- 브랜치가 `main`인지 확인
- 5-10분 후 재시도

👉 더 많은 정보: [SETUP-GUIDE.md](SETUP-GUIDE.md) 참고

---

## 📝 라이선스

MIT License

Copyright (c) 2024 자연치유관광 포럼

---

## 🙏 감사의 말

이 프로젝트는 다음 기술들을 활용했습니다:
- Google Apps Script & Sheets
- GitHub Pages
- 토스페이먼츠 API
- 네이버 웨일온
- YouTube

---

## 📞 문의

문의사항이 있으시면:
- 이메일: contact@example.com
- 웹사이트: https://your-site.com

---

**Made with 💚 by Natural Healing Tourism Forum**
