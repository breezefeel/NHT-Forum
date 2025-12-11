// 자연치유관광 포럼 온라인 교육 플랫폼 - 관리자 시스템

// 관리자 권한 체크
function checkAdminAccess() {
    const user = checkLogin();
    if (!user) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return false;
    }
    
    if (user.grade !== '운영진') {
        alert('관리자 권한이 필요합니다.');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// 대시보드 통계 로드
async function loadDashboardStats() {
    showLoading(true);
    
    try {
        const url = `${CONFIG.APPS_SCRIPT_URL}?action=getDashboardStats`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            displayDashboardStats(data.stats);
        }
    } catch (error) {
        console.error('통계 로딩 오류:', error);
        // 테스트용 더미 데이터
        displayDashboardStats(getDummyStats());
    } finally {
        showLoading(false);
    }
}

// 대시보드 통계 표시
function displayDashboardStats(stats) {
    document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('totalCourses').textContent = stats.totalCourses || 0;
    document.getElementById('totalEnrollments').textContent = stats.totalEnrollments || 0;
    document.getElementById('totalRevenue').textContent = '₩' + (stats.totalRevenue || 0).toLocaleString();
    
    // 최근 가입 회원
    const recentUsersEl = document.getElementById('recentUsers');
    if (recentUsersEl && stats.recentUsers) {
        let html = '<div style="display: grid; gap: 0.8rem;">';
        stats.recentUsers.forEach(user => {
            html += `
                <div style="padding: 0.8rem; background: #f8f9fa; border-radius: 5px;">
                    <strong>${user.name}</strong> (${user.email})<br>
                    <small style="color: #666;">등급: ${user.grade} | 가입일: ${user.created_at}</small>
                </div>
            `;
        });
        html += '</div>';
        recentUsersEl.innerHTML = html;
    }
}

// 전체 회원 목록 로드
async function loadAllUsers() {
    showLoading(true);
    
    try {
        const url = `${CONFIG.APPS_SCRIPT_URL}?action=getAllUsers`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            displayUserList(data.users);
        }
    } catch (error) {
        console.error('회원 목록 로딩 오류:', error);
        displayUserList(getDummyUsers());
    } finally {
        showLoading(false);
    }
}

// 회원 목록 표시
function displayUserList(users) {
    const container = document.getElementById('userList');
    if (!container) return;
    
    if (users.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">등록된 회원이 없습니다.</p>';
        return;
    }
    
    let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                    <th style="padding: 1rem; text-align: left;">이름</th>
                    <th style="padding: 1rem; text-align: left;">이메일</th>
                    <th style="padding: 1rem; text-align: left;">연락처</th>
                    <th style="padding: 1rem; text-align: center;">등급</th>
                    <th style="padding: 1rem; text-align: center;">가입일</th>
                    <th style="padding: 1rem; text-align: center;">관리</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    users.forEach(user => {
        html += `
            <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 1rem;">${user.name}</td>
                <td style="padding: 1rem;">${user.email}</td>
                <td style="padding: 1rem;">${user.phone || '-'}</td>
                <td style="padding: 1rem; text-align: center;">
                    <span class="badge badge-${getGradeBadgeClass(user.grade)}">${user.grade}</span>
                </td>
                <td style="padding: 1rem; text-align: center;">${user.created_at || '-'}</td>
                <td style="padding: 1rem; text-align: center;">
                    <button onclick="editUserGrade('${user.email}', '${user.grade}')" 
                            class="btn btn-outline" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">
                        등급 변경
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// 회원 등급 변경
async function editUserGrade(email, currentGrade) {
    const grades = ['일반인', '포럼 회원', '전문위원', '운영진'];
    const newGrade = prompt(`${email}의 등급을 변경하세요.\n\n현재 등급: ${currentGrade}\n\n선택 가능한 등급:\n1. 일반인\n2. 포럼 회원\n3. 전문위원\n4. 운영진\n\n새 등급을 입력하세요:`);
    
    if (!newGrade || !grades.includes(newGrade)) {
        alert('올바른 등급을 입력해주세요.');
        return;
    }
    
    if (newGrade === currentGrade) {
        alert('현재 등급과 동일합니다.');
        return;
    }
    
    showLoading(true);
    
    try {
        await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'updateUserGrade',
                email: email,
                new_grade: newGrade
            })
        });
        
        showLoading(false);
        alert('등급이 변경되었습니다.');
        loadAllUsers(); // 목록 새로고침
        
    } catch (error) {
        showLoading(false);
        console.error('등급 변경 오류:', error);
        alert('등급 변경 중 오류가 발생했습니다.');
    }
}

// 수강 현황 로드
async function loadEnrollmentStats() {
    showLoading(true);
    
    try {
        const url = `${CONFIG.APPS_SCRIPT_URL}?action=getEnrollmentStats`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            displayEnrollmentStats(data.enrollments);
        }
    } catch (error) {
        console.error('수강 현황 로딩 오류:', error);
        displayEnrollmentStats(getDummyEnrollments());
    } finally {
        showLoading(false);
    }
}

// 수강 현황 표시
function displayEnrollmentStats(enrollments) {
    const container = document.getElementById('enrollmentList');
    if (!container) return;
    
    if (enrollments.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">수강 신청 내역이 없습니다.</p>';
        return;
    }
    
    let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                    <th style="padding: 1rem; text-align: left;">회원</th>
                    <th style="padding: 1rem; text-align: left;">강좌</th>
                    <th style="padding: 1rem; text-align: center;">신청일</th>
                    <th style="padding: 1rem; text-align: center;">결제금액</th>
                    <th style="padding: 1rem; text-align: center;">진행상태</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    enrollments.forEach(enrollment => {
        const completionBadge = enrollment.completion_status === 'completed' ? 
            '<span class="badge" style="background-color: #d4edda; color: #155724;">수료</span>' :
            '<span class="badge" style="background-color: #fff3cd; color: #856404;">진행중</span>';
        
        html += `
            <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 1rem;">${enrollment.user_name}<br><small style="color: #666;">${enrollment.user_email}</small></td>
                <td style="padding: 1rem;">${enrollment.course_title}</td>
                <td style="padding: 1rem; text-align: center;">${enrollment.enrolled_date}</td>
                <td style="padding: 1rem; text-align: center;">₩${Number(enrollment.payment_amount).toLocaleString()}</td>
                <td style="padding: 1rem; text-align: center;">${completionBadge}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// 테스트용 더미 데이터
function getDummyStats() {
    return {
        totalUsers: 248,
        totalCourses: 12,
        totalEnrollments: 156,
        totalRevenue: 18500000,
        recentUsers: [
            { name: '김철수', email: 'kim@example.com', grade: '일반인', created_at: '2024-12-10' },
            { name: '이영희', email: 'lee@example.com', grade: '포럼 회원', created_at: '2024-12-09' },
            { name: '박민수', email: 'park@example.com', grade: '일반인', created_at: '2024-12-08' }
        ]
    };
}

function getDummyUsers() {
    return [
        { name: '김철수', email: 'kim@example.com', phone: '010-1234-5678', grade: '일반인', created_at: '2024-11-15' },
        { name: '이영희', email: 'lee@example.com', phone: '010-2345-6789', grade: '포럼 회원', created_at: '2024-11-20' },
        { name: '박민수', email: 'park@example.com', phone: '010-3456-7890', grade: '전문위원', created_at: '2024-12-01' },
        { name: '최지원', email: 'choi@example.com', phone: '010-4567-8901', grade: '일반인', created_at: '2024-12-05' }
    ];
}

function getDummyEnrollments() {
    return [
        { user_name: '김철수', user_email: 'kim@example.com', course_title: '통합의학 전문가 과정', enrolled_date: '2024-12-01', payment_amount: 300000, completion_status: 'in_progress' },
        { user_name: '이영희', user_email: 'lee@example.com', course_title: '자연치유 코디네이터', enrolled_date: '2024-11-25', payment_amount: 0, completion_status: 'completed' },
        { user_name: '박민수', user_email: 'park@example.com', course_title: '웰니스관광 전문가', enrolled_date: '2024-11-28', payment_amount: 250000, completion_status: 'in_progress' }
    ];
}

// 페이지 로드 시 관리자 권한 체크
if (window.location.pathname.includes('admin')) {
    if (checkAdminAccess()) {
        // 대시보드 페이지
        if (document.getElementById('totalUsers')) {
            loadDashboardStats();
        }
        
        // 회원 관리 페이지
        if (document.getElementById('userList')) {
            loadAllUsers();
        }
        
        // 수강 현황 페이지
        if (document.getElementById('enrollmentList')) {
            loadEnrollmentStats();
        }
    }
}
