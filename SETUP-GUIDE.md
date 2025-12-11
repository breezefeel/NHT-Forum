# 자연치유관광 포럼 온라인 교육 플랫폼 - 완전 설정 가이드

## 📋 목차
1. [Google Sheets 설정](#1-google-sheets-설정)
2. [Google Apps Script 배포](#2-google-apps-script-배포)
3. [토스페이먼츠 연동](#3-토스페이먼츠-연동)
4. [GitHub Pages 배포](#4-github-pages-배포)
5. [초기 데이터 입력](#5-초기-데이터-입력)
6. [관리자 계정 설정](#6-관리자-계정-설정)
7. [테스트 가이드](#7-테스트-가이드)

---

## 1. Google Sheets 설정

### 1.1 새 스프레드시트 생성
1. Google Drive에서 **스프레드시트 만들기**
2. 이름: `자연치유관광포럼_교육시스템`

### 1.2 시트 생성 (총 9개)

#### 시트 1: 회원정보
```
헤더 (A1-F1):
email | password | name | phone | grade | created_at

예시 데이터:
admin@example.com | admin123! | 관리자 | 010-1234-5678 | 운영진 | 2024-12-01
test@example.com | test123! | 테스트 | 010-2345-6789 | 일반인 | 2024-12-10
```

#### 시트 2: 세미나일정
```
헤더 (A1-M1):
seminar_id | title | description | category | instructor | date | time | duration | whale_link | video_link | status | max_participants | required_grade

예시 데이터:
SEM001 | 통합의학의 이해와 실제 | 통합의학의 기본 개념과 실제 적용 | 통합의학 | 박준규 교수 | 2024-12-20 | 14:00 | 120 | https://whale.naver.com/meeting/abc123 |  | 예정 | 100 | 일반인

SEM002 | 자연치유 관광의 트렌드 | 글로벌 자연치유 관광 동향 | 웰니스관광 | 김영희 박사 | 2024-12-05 | 15:00 | 90 |  | https://youtube.com/watch?v=xyz789 | 종료 | 100 | 일반인
```

#### 시트 3: 강좌목록
```
헤더 (A1-K1):
course_id | title | description | category | instructor | price | duration_weeks | total_lessons | thumbnail | required_grade | status

예시 데이터:
CRS001 | 통합의학 전문가 과정 | 통합의학의 A to Z | 통합의학 | 박준규 교수 | 300000 | 8 | 16 | https://via.placeholder.com/400x300 | 포럼 회원 | active

CRS002 | 자연치유 입문 | 자연치유의 기초 | 자연치유 | 김영희 박사 | 0 | 4 | 8 | https://via.placeholder.com/400x300 | 일반인 | active
```

#### 시트 4: 강좌상세
```
헤더 (A1-G1):
course_id | lesson_number | lesson_title | lesson_description | video_link | duration_minutes | materials

예시 데이터:
CRS001 | 1 | 통합의학의 개념 | 통합의학의 정의와 역사 | https://youtube.com/watch?v=abc123 | 45 | 
CRS001 | 2 | 동서의학의 만남 | 동양의학과 서양의학의 통합 | https://youtube.com/watch?v=def456 | 50 | 

CRS002 | 1 | 자연치유란 무엇인가 | 자연치유의 기본 원리 | https://youtube.com/watch?v=ghi789 | 30 | 
CRS002 | 2 | 자연치유의 역사 | 전통적 치유 방법들 | https://youtube.com/watch?v=jkl012 | 35 | 
```

#### 시트 5: 수강신청
```
헤더 (A1-G1):
enrollment_id | user_email | course_id | enrolled_date | payment_status | payment_amount | completion_status

예시 데이터:
ENR001 | test@example.com | CRS002 | 2024-12-10 | completed | 0 | in_progress
```

#### 시트 6: 출석기록
```
헤더 (A1-F1):
attendance_id | user_email | course_id | lesson_number | completed_date | watch_time_minutes

예시 데이터:
ATT001 | test@example.com | CRS002 | 1 | 2024-12-10 | 30
```

#### 시트 7: 과제제출
```
헤더 (A1-H1):
assignment_id | user_email | course_id | lesson_number | assignment_title | submission_content | submitted_date | feedback | score

예시 데이터:
(처음에는 비워두세요)
```

#### 시트 8: 결제내역
```
헤더 (A1-J1):
payment_id | user_email | course_id | order_id | payment_key | amount | payment_method | status | approved_at | refunded_at

예시 데이터:
(처음에는 비워두세요)
```

#### 시트 9: 댓글
```
헤더 (A1-F1):
comment_id | user_email | course_id | lesson_number | comment_text | created_at

예시 데이터:
(처음에는 비워두세요)
```

---

## 2. Google Apps Script 배포

### 2.1 Apps Script 에디터 열기
1. 스프레드시트에서 **확장 프로그램 > Apps Script** 클릭
2. 기본 코드 삭제

### 2.2 코드 복사
1. `apps-script-stage1.js` 전체 복사
2. Apps Script 에디터에 붙여넣기
3. `apps-script-stage2.js` 내용 추가
4. `apps-script-stage3.js` 내용 추가
5. `apps-script-stage4.js` 내용 추가

### 2.3 배포
1. **배포 > 새 배포** 클릭
2. **유형 선택 > 웹 앱** 선택
3. 설정:
   - 설명: `자연치유관광 포럼 교육 API v1`
   - 실행 권한: **나**
   - 액세스 권한: **모든 사용자**
4. **배포** 클릭
5. **웹 앱 URL 복사** (예: https://script.google.com/macros/s/ABC...XYZ/exec)
6. 권한 승인

### 2.4 URL 저장
복사한 URL을 메모장에 저장해두세요. 다음 단계에서 사용합니다.

---

## 3. 토스페이먼츠 연동

### 3.1 토스페이먼츠 가입
1. https://www.tosspayments.com 접속
2. 회원가입 및 사업자 정보 입력

### 3.2 API 키 발급
1. 개발자센터 > API 키 발급
2. **클라이언트 키** 복사 (테스트용)
3. **시크릿 키** 복사 (테스트용)

### 3.3 키 저장
- 클라이언트 키: `test_ck_...`
- 시크릿 키: `test_sk_...`

**⚠️ 주의**: 실제 운영 시에는 **라이브 키**로 변경해야 합니다!

---

## 4. GitHub Pages 배포

### 4.1 파일 준비
1. `natural-healing-edu` 폴더의 모든 파일 확인
2. `js/config.js` 파일 열기

### 4.2 config.js 설정
```javascript
const CONFIG = {
    APPS_SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'  // 2.4에서 복사한 URL
};
```

### 4.3 payment.js 설정
```javascript
// 3.2에서 복사한 키 입력
const TOSS_CLIENT_KEY = 'test_ck_...';  // 클라이언트 키
const TOSS_SECRET_KEY = 'test_sk_...';  // 시크릿 키
```

### 4.4 GitHub 저장소 생성
1. GitHub에 로그인
2. **New repository** 클릭
3. 저장소 이름: `natural-healing-forum`
4. Public으로 설정
5. **Create repository** 클릭

### 4.5 코드 업로드
```bash
# 터미널에서 실행
cd natural-healing-edu
git init
git add .
git commit -m "자연치유관광 포럼 교육 플랫폼 초기 배포"
git branch -M main
git remote add origin https://github.com/your-username/natural-healing-forum.git
git push -u origin main
```

### 4.6 GitHub Pages 활성화
1. 저장소 **Settings** 클릭
2. 좌측 메뉴에서 **Pages** 클릭
3. Source: **Deploy from a branch**
4. Branch: **main**, 폴더: **/ (root)**
5. **Save** 클릭

### 4.7 배포 완료
5-10분 후 `https://your-username.github.io/natural-healing-forum` 에서 접속 가능!

---

## 5. 초기 데이터 입력

### 5.1 테스트 세미나 생성
스프레드시트 "세미나일정" 시트에 추가:
```
SEM003 | 마음챙김 명상 입문 | 스트레스 해소를 위한 명상 | 마음챙김 | 이지은 강사 | 2024-12-25 | 10:00 | 60 | https://whale.naver.com/meeting/test123 |  | 예정 | 50 | 일반인
```

### 5.2 테스트 강좌 생성
"강좌목록" 시트에 추가:
```
CRS003 | 웰니스관광 전문가 | 웰니스관광 기획 및 운영 | 웰니스관광 | 최민수 교수 | 250000 | 6 | 12 | https://via.placeholder.com/400x300 | 포럼 회원 | active
```

"강좌상세" 시트에 추가:
```
CRS003 | 1 | 웰니스관광의 이해 | 웰니스관광의 정의와 특징 | https://youtube.com/watch?v=test1 | 40 | 
CRS003 | 2 | 세계 웰니스관광 트렌드 | 글로벌 웰니스관광 동향 | https://youtube.com/watch?v=test2 | 45 | 
```

---

## 6. 관리자 계정 설정

### 6.1 관리자 계정 생성
1. 웹사이트에서 회원가입
2. 또는 스프레드시트 "회원정보"에 직접 추가:
```
admin@yourdomain.com | YourPassword123! | 홍길동 | 010-0000-0000 | 운영진 | 2024-12-11
```

### 6.2 관리자 페이지 접속
- URL: `https://your-site.com/admin.html`
- 로그인 후 접속 가능

### 6.3 회원 등급 변경
1. 관리자 페이지 > **회원 관리**
2. 회원 찾기
3. **등급 변경** 버튼 클릭
4. 새 등급 입력 (일반인 / 포럼 회원 / 전문위원 / 운영진)

---

## 7. 테스트 가이드

### 7.1 회원가입 테스트
1. 메인 페이지 > **회원가입**
2. 정보 입력 후 가입
3. 로그인 확인

### 7.2 세미나 테스트
1. **세미나** 메뉴 클릭
2. 세미나 목록 확인
3. 웨일온 입장 버튼 / 녹화 영상 버튼 확인

### 7.3 강좌 테스트
1. **강좌** 메뉴 클릭
2. 강좌 카드 클릭
3. 커리큘럼 확인
4. 무료 강좌로 수강 신청 테스트

### 7.4 결제 테스트 (토스페이먼츠 테스트 모드)
1. 유료 강좌 선택
2. **수강 신청** 클릭
3. 토스페이먼츠 테스트 카드 입력:
   - 카드번호: 아무 숫자나 16자리
   - 유효기간: 미래 날짜
   - CVC: 아무 숫자 3자리
4. 결제 완료 확인

### 7.5 관리자 기능 테스트
1. 관리자 계정으로 로그인
2. **관리자** 메뉴 클릭
3. 대시보드 통계 확인
4. 회원 관리 > 등급 변경 테스트
5. 수강 현황 확인

---

## 8. 문제 해결

### 8.1 Apps Script 오류
**증상**: "스크립트 오류" 또는 데이터가 안 불러와짐  
**해결**:
1. Apps Script 에디터에서 **실행 로그** 확인
2. 배포 URL이 `config.js`에 정확히 입력되었는지 확인
3. 스프레드시트 권한 확인

### 8.2 결제 오류
**증상**: 결제 버튼 클릭 시 오류  
**해결**:
1. 토스페이먼츠 키가 `payment.js`에 정확히 입력되었는지 확인
2. 브라우저 콘솔(F12)에서 오류 메시지 확인
3. 테스트 키인지 확인 (`test_ck_...`, `test_sk_...`)

### 8.3 로그인 안 됨
**증상**: 로그인 버튼 클릭해도 반응 없음  
**해결**:
1. 브라우저 개발자 도구(F12) > Console 탭에서 오류 확인
2. `config.js`의 Apps Script URL 확인
3. 이메일/비밀번호가 스프레드시트의 데이터와 일치하는지 확인

### 8.4 GitHub Pages 404 오류
**증상**: 페이지가 안 열림  
**해결**:
1. GitHub 저장소 Settings > Pages에서 배포 상태 확인
2. 브랜치가 `main`으로 설정되었는지 확인
3. 5-10분 후 다시 시도

---

## 9. 다음 단계

### 9.1 커스터마이징
- `css/style.css`에서 색상 변경
- 로고 이미지 추가
- 강좌 썸네일 이미지 변경

### 9.2 도메인 연결
1. 도메인 구매 (예: yourdomain.com)
2. GitHub Pages에서 Custom domain 설정
3. DNS 설정 (CNAME 레코드)

### 9.3 실제 운영 전환
1. 토스페이먼츠 **라이브 키** 발급
2. `payment.js`의 키를 라이브 키로 변경
3. 실제 사업자 정보로 설정

### 9.4 추가 기능
- 커뮤니티 게시판 구현
- 수료증 자동 발급
- 이메일 알림 시스템
- 모바일 앱 개발

---

## 10. 지원

문제가 발생하면:
1. 브라우저 개발자 도구(F12)에서 Console 확인
2. Apps Script 실행 로그 확인
3. 이 가이드의 문제 해결 섹션 참고

---

**축하합니다! 🎉**  
자연치유관광 포럼 온라인 교육 플랫폼이 완성되었습니다!
