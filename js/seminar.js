// 자연치유관광 포럼 온라인 교육 플랫폼 - 세미나 시스템

// 세미나 목록 로드
async function loadSeminars(status = 'all') {
    showLoading(true);
    
    try {
        const url = `${CONFIG.APPS_SCRIPT_URL}?action=getSeminars&status=${status}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            displaySeminars(data.seminars);
        } else {
            showAlert('세미나 목록을 불러오는데 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('세미나 로딩 오류:', error);
        // 테스트용 더미 데이터
        displaySeminars(getDummySeminars());
    } finally {
        showLoading(false);
    }
}

// 세미나 목록 표시
function displaySeminars(seminars) {
    const container = document.getElementById('seminarList');
    
    if (!container) return;
    
    if (seminars.length === 0) {
        container.innerHTML = `
            <div class="card">
                <p style="text-align: center; color: #999; padding: 2rem;">
                    등록된 세미나가 없습니다.
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    seminars.forEach(seminar => {
        const card = createSeminarCard(seminar);
        container.appendChild(card);
    });
}

// 세미나 카드 생성
function createSeminarCard(seminar) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const statusBadge = getStatusBadge(seminar.status);
    const categoryIcon = getCategoryIcon(seminar.category);
    const dateFormatted = formatDate(seminar.date);
    const user = checkLogin();
    
    // 접근 권한 체크
    const canAccess = checkSeminarAccess(seminar.required_grade);
    
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
            <div>
                ${statusBadge}
                <span class="badge" style="background-color: #e3f2fd; color: #1976d2; margin-left: 0.5rem;">
                    ${categoryIcon} ${seminar.category}
                </span>
            </div>
            <div style="text-align: right; font-size: 0.9rem; color: #666;">
                <div>📅 ${dateFormatted}</div>
                <div>⏰ ${seminar.time} (${seminar.duration}분)</div>
            </div>
        </div>
        
        <h3 style="color: #2d5016; margin-bottom: 1rem;">${seminar.title}</h3>
        <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">${seminar.description}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #eee;">
            <div style="color: #666; font-size: 0.9rem;">
                <div>👨‍🏫 강사: ${seminar.instructor}</div>
                <div>👥 정원: ${seminar.max_participants}명</div>
            </div>
            <div>
                ${getSeminarButtons(seminar, canAccess, user)}
            </div>
        </div>
    `;
    
    return card;
}

// 세미나 상태별 뱃지
function getStatusBadge(status) {
    const badges = {
        '예정': '<span class="badge" style="background-color: #fff3cd; color: #856404;">📅 예정</span>',
        '진행중': '<span class="badge" style="background-color: #d4edda; color: #155724;">🔴 LIVE</span>',
        '종료': '<span class="badge" style="background-color: #e0e0e0; color: #666;">✅ 종료</span>'
    };
    return badges[status] || badges['예정'];
}

// 카테고리별 아이콘
function getCategoryIcon(category) {
    const icons = {
        '통합의학': '🏥',
        '웰니스관광': '✈️',
        '자연치유': '🌿',
        '건강증진': '💪',
        '마음챙김': '🧘',
        '영양관리': '🥗'
    };
    return icons[category] || '📚';
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[date.getDay()];
    
    return `${year}.${month}.${day} (${dayOfWeek})`;
}

// 세미나 접근 권한 체크
function checkSeminarAccess(requiredGrade) {
    const user = checkLogin();
    if (!user) return false;
    
    const gradeLevel = {
        '일반인': 1,
        '포럼 회원': 2,
        '전문위원': 3,
        '운영진': 4
    };
    
    const userLevel = gradeLevel[user.grade] || 0;
    const requiredLevel = gradeLevel[requiredGrade] || 1;
    
    return userLevel >= requiredLevel;
}

// 세미나 버튼 생성
function getSeminarButtons(seminar, canAccess, user) {
    if (!user) {
        return '<a href="login.html" class="btn">로그인 필요</a>';
    }
    
    if (!canAccess) {
        return `<span class="badge" style="background-color: #f8d7da; color: #721c24;">⚠️ ${seminar.required_grade} 이상 필요</span>`;
    }
    
    let buttons = '';
    
    if (seminar.status === '예정' || seminar.status === '진행중') {
        if (seminar.whale_link) {
            buttons += `<a href="${seminar.whale_link}" target="_blank" class="btn" style="margin-right: 0.5rem;">🐋 세미나 입장</a>`;
        }
    }
    
    if (seminar.status === '종료' && seminar.video_link) {
        buttons += `<a href="${seminar.video_link}" target="_blank" class="btn btn-secondary">📹 녹화 영상 보기</a>`;
    }
    
    if (!buttons) {
        buttons = '<span style="color: #999;">준비 중</span>';
    }
    
    return buttons;
}

// 필터 적용
function filterSeminars(status) {
    loadSeminars(status);
    
    // 필터 버튼 활성화 상태 변경
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// 카테고리별 필터
function filterByCategory(category) {
    showLoading(true);
    
    setTimeout(() => {
        const allCards = document.querySelectorAll('#seminarList .card');
        
        allCards.forEach(card => {
            if (category === 'all') {
                card.style.display = 'block';
            } else {
                const cardCategory = card.querySelector('.badge:nth-of-type(2)');
                if (cardCategory && cardCategory.textContent.includes(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
        
        showLoading(false);
    }, 300);
}

// 테스트용 더미 데이터
function getDummySeminars() {
    return [
        {
            seminar_id: 'SEM001',
            title: '통합의학의 이해와 실제',
            description: '현대의학과 전통의학의 조화로운 접근법을 배우고, 실제 임상에서의 적용 사례를 살펴봅니다. 통합의학의 기본 원리부터 최신 연구 동향까지 폭넓게 다룹니다.',
            category: '통합의학',
            instructor: '김건강 박사',
            date: '2024-12-20',
            time: '14:00',
            duration: 90,
            whale_link: 'https://whale.naver.com/meeting/example1',
            video_link: '',
            status: '예정',
            max_participants: 100,
            required_grade: '일반인'
        },
        {
            seminar_id: 'SEM002',
            title: '자연치유 관광의 트렌드',
            description: '2024년 웰니스 관광 산업의 주요 트렌드와 국내외 성공 사례를 분석합니다. 자연치유 관광 프로그램 기획 및 운영 노하우를 공유합니다.',
            category: '웰니스관광',
            instructor: '박웰니스 교수',
            date: '2024-12-15',
            time: '19:00',
            duration: 120,
            whale_link: '',
            video_link: 'https://youtu.be/example1',
            status: '종료',
            max_participants: 150,
            required_grade: '일반인'
        },
        {
            seminar_id: 'SEM003',
            title: '스트레스 관리와 마음챙김 명상',
            description: '현대인의 스트레스 관리를 위한 과학적 접근법과 마음챙김 명상의 실제. 즉시 적용 가능한 스트레스 해소 기법을 실습합니다.',
            category: '마음챙김',
            instructor: '이평온 명상가',
            date: '2024-12-18',
            time: '20:00',
            duration: 60,
            whale_link: 'https://whale.naver.com/meeting/example2',
            video_link: '',
            status: '진행중',
            max_participants: 80,
            required_grade: '포럼 회원'
        },
        {
            seminar_id: 'SEM004',
            title: '기능의학과 영양요법',
            description: '개인 맞춤형 영양관리의 과학적 근거와 실제 적용 방법. 기능의학 관점에서의 영양요법 프로토콜을 배웁니다.',
            category: '영양관리',
            instructor: '최영양 박사',
            date: '2024-12-25',
            time: '15:00',
            duration: 100,
            whale_link: 'https://whale.naver.com/meeting/example3',
            video_link: '',
            status: '예정',
            max_participants: 120,
            required_grade: '전문위원'
        }
    ];
}

// 페이지 로드 시 세미나 목록 로드
if (document.getElementById('seminarList')) {
    loadSeminars('all');
}
