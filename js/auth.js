// 자연치유관광 포럼 온라인 교육 플랫폼 - 인증 시스템

// 로그인 상태 확인
function checkLogin() {
    const user = localStorage.getItem('nhf_user');
    return user ? JSON.parse(user) : null;
}

// 로그인 필요 페이지 보호
function requireLogin() {
    const user = checkLogin();
    if (!user) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 등급별 접근 권한 체크
function checkGrade(requiredGrades) {
    const user = checkLogin();
    if (!user) {
        return false;
    }
    return requiredGrades.includes(user.grade);
}

// 로그아웃
function logout() {
    localStorage.removeItem('nhf_user');
    alert('로그아웃되었습니다.');
    window.location.href = 'index.html';
}

// 회원가입 처리
async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    
    // 유효성 검사
    if (password !== confirmPassword) {
        showAlert('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('비밀번호는 최소 6자 이상이어야 합니다.', 'error');
        return;
    }
    
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    // 로딩 표시
    showLoading(true);
    
    try {
        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'register',
                email: email,
                password: password, // 실제 운영시에는 암호화 필요
                name: name,
                phone: phone
            })
        });
        
        // no-cors 모드에서는 response를 읽을 수 없으므로
        // 약간의 지연 후 성공으로 간주
        setTimeout(() => {
            showLoading(false);
            showAlert('회원가입이 완료되었습니다. 로그인해주세요.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }, 1000);
        
    } catch (error) {
        showLoading(false);
        console.error('회원가입 오류:', error);
        showAlert('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    }
}

// 로그인 처리
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    showLoading(true);
    
    try {
        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'login',
                email: email,
                password: password
            })
        });
        
        // no-cors 모드 처리
        // 실제로는 CORS 설정을 통해 제대로 된 응답을 받아야 합니다
        // 여기서는 간단한 데모를 위해 임시 처리
        
        // 임시: 로컬스토리지에 사용자 정보 저장 (실제로는 서버 응답 기반)
        const userData = {
            email: email,
            name: '사용자', // 실제로는 서버에서 받아옴
            grade: '일반인' // 실제로는 서버에서 받아옴
        };
        
        localStorage.setItem('nhf_user', JSON.stringify(userData));
        
        showLoading(false);
        showAlert('로그인 성공!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showLoading(false);
        console.error('로그인 오류:', error);
        showAlert('로그인 중 오류가 발생했습니다.', 'error');
    }
}

// 알림 메시지 표시
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.form-container') || document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        // 5초 후 자동 제거
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// 로딩 표시
function showLoading(show) {
    let spinner = document.getElementById('loading-spinner');
    
    if (show) {
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'loading-spinner';
            spinner.className = 'spinner';
            document.body.appendChild(spinner);
        }
    } else {
        if (spinner) {
            spinner.remove();
        }
    }
}

// 사용자 정보 표시 (대시보드용)
function displayUserInfo() {
    const user = checkLogin();
    if (!user) return;
    
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');
    const userGradeEl = document.getElementById('userGrade');
    
    if (userNameEl) userNameEl.textContent = user.name;
    if (userEmailEl) userEmailEl.textContent = user.email;
    if (userGradeEl) {
        userGradeEl.textContent = user.grade;
        userGradeEl.className = `badge badge-${getGradeBadgeClass(user.grade)}`;
    }
}

// 등급별 뱃지 클래스
function getGradeBadgeClass(grade) {
    const gradeMap = {
        '일반인': 'general',
        '포럼 회원': 'member',
        '전문위원': 'expert',
        '운영진': 'admin'
    };
    return gradeMap[grade] || 'general';
}

// 헤더 네비게이션 업데이트 (로그인 상태에 따라)
function updateNavigation() {
    const user = checkLogin();
    const navMenu = document.querySelector('nav ul');
    
    if (!navMenu) return;
    
    if (user) {
        // 로그인 상태
        navMenu.innerHTML = `
            <li><a href="index.html">홈</a></li>
            <li><a href="seminars.html">세미나</a></li>
            <li><a href="courses.html">강좌</a></li>
            <li><a href="community.html">커뮤니티</a></li>
            <li><a href="dashboard.html">내 강의실</a></li>
            <li><a href="#" onclick="logout()">로그아웃</a></li>
        `;
        
        // 운영진일 경우 관리자 메뉴 추가
        if (user.grade === '운영진') {
            const adminLi = document.createElement('li');
            adminLi.innerHTML = '<a href="admin.html">관리자</a>';
            navMenu.appendChild(adminLi);
        }
    } else {
        // 비로그인 상태
        navMenu.innerHTML = `
            <li><a href="index.html">홈</a></li>
            <li><a href="seminars.html">세미나</a></li>
            <li><a href="courses.html">강좌</a></li>
            <li><a href="login.html">로그인</a></li>
            <li><a href="register.html">회원가입</a></li>
        `;
    }
}

// 페이지 로드 시 네비게이션 업데이트
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavigation);
} else {
    updateNavigation();
}
