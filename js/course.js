// 자연치유관광 포럼 온라인 교육 플랫폼 - 강좌 시스템

// 강좌 목록 로드
async function loadCourses(category = 'all') {
    showLoading(true);
    
    try {
        const url = `${CONFIG.APPS_SCRIPT_URL}?action=getCourses&category=${category}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            displayCourses(data.courses);
        } else {
            showAlert('강좌 목록을 불러오는데 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('강좌 로딩 오류:', error);
        // 테스트용 더미 데이터
        displayCourses(getDummyCourses());
    } finally {
        showLoading(false);
    }
}

// 강좌 목록 표시
function displayCourses(courses) {
    const container = document.getElementById('courseList');
    
    if (!container) return;
    
    if (courses.length === 0) {
        container.innerHTML = `
            <div class="card">
                <p style="text-align: center; color: #999; padding: 2rem;">
                    등록된 강좌가 없습니다.
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    courses.forEach(course => {
        const card = createCourseCard(course);
        container.appendChild(card);
    });
}

// 강좌 카드 생성
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';
    card.onclick = () => window.location.href = `course-detail.html?id=${course.course_id}`;
    
    const categoryIcon = getCategoryIcon(course.category);
    const priceDisplay = course.price == 0 ? '무료' : `₩${Number(course.price).toLocaleString()}`;
    const user = checkLogin();
    const canAccess = checkCourseAccess(course.required_grade);
    
    card.innerHTML = `
        <div style="position: relative;">
            <img src="${course.thumbnail}" alt="${course.title}" 
                 style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">
            <div style="position: absolute; top: 10px; right: 10px;">
                <span class="badge" style="background-color: ${course.price == 0 ? '#4a7c2c' : '#ff6b6b'}; color: white; font-size: 1rem;">
                    ${priceDisplay}
                </span>
            </div>
        </div>
        
        <div style="margin-bottom: 0.5rem;">
            <span class="badge" style="background-color: #e3f2fd; color: #1976d2;">
                ${categoryIcon} ${course.category}
            </span>
            ${!canAccess ? `<span class="badge" style="background-color: #fff3cd; color: #856404; margin-left: 0.5rem;">
                🔒 ${course.required_grade} 이상
            </span>` : ''}
        </div>
        
        <h3 style="color: #2d5016; margin-bottom: 0.8rem;">${course.title}</h3>
        <p style="color: #666; margin-bottom: 1rem; line-height: 1.6; height: 3em; overflow: hidden;">
            ${course.description}
        </p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;">
            <div>
                <div>👨‍🏫 ${course.instructor}</div>
                <div>📚 총 ${course.total_lessons}강 (${course.duration_weeks}주)</div>
            </div>
            <div>
                <button class="btn btn-secondary" style="font-size: 0.9rem;">
                    자세히 보기 →
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// 강좌 상세 정보 로드
async function loadCourseDetail(courseId) {
    showLoading(true);
    
    try {
        const url = `${CONFIG.APPS_SCRIPT_URL}?action=getCourseDetail&course_id=${courseId}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            displayCourseDetail(data.course);
        } else {
            showAlert('강좌 정보를 불러오는데 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('강좌 상세 로딩 오류:', error);
        // 테스트용 더미 데이터
        const dummyCourse = getDummyCourses().find(c => c.course_id === courseId);
        if (dummyCourse) {
            dummyCourse.lessons = getDummyLessons(courseId);
            displayCourseDetail(dummyCourse);
        }
    } finally {
        showLoading(false);
    }
}

// 강좌 상세 정보 표시
function displayCourseDetail(course) {
    const container = document.getElementById('courseDetail');
    if (!container) return;
    
    const user = checkLogin();
    const canAccess = checkCourseAccess(course.required_grade);
    const priceDisplay = course.price == 0 ? '무료' : `₩${Number(course.price).toLocaleString()}`;
    const categoryIcon = getCategoryIcon(course.category);
    
    container.innerHTML = `
        <div class="card">
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem;">
                <div>
                    <img src="${course.thumbnail}" alt="${course.title}" 
                         style="width: 100%; border-radius: 10px;">
                </div>
                <div>
                    <div style="margin-bottom: 1rem;">
                        <span class="badge" style="background-color: #e3f2fd; color: #1976d2; font-size: 1rem;">
                            ${categoryIcon} ${course.category}
                        </span>
                    </div>
                    <h2 style="color: #2d5016; margin-bottom: 1rem;">${course.title}</h2>
                    <p style="color: #666; line-height: 1.8; margin-bottom: 1.5rem;">${course.description}</p>
                    
                    <div style="display: grid; gap: 0.8rem; margin-bottom: 1.5rem; color: #666;">
                        <div><strong>👨‍🏫 강사:</strong> ${course.instructor}</div>
                        <div><strong>📚 총 강의 수:</strong> ${course.total_lessons}강</div>
                        <div><strong>⏱️ 수강 기간:</strong> ${course.duration_weeks}주</div>
                        <div><strong>💰 가격:</strong> <span style="font-size: 1.3rem; color: #4a7c2c; font-weight: 700;">${priceDisplay}</span></div>
                        <div><strong>🎓 수강 자격:</strong> ${course.required_grade} 이상</div>
                    </div>
                    
                    ${getEnrollButton(course, canAccess, user)}
                </div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 2rem;">
            <h3 style="color: #2d5016; margin-bottom: 1.5rem;">📋 커리큘럼</h3>
            <div id="lessonList">
                ${displayLessons(course.lessons || [], canAccess)}
            </div>
        </div>
    `;
}

// 수강 신청 버튼
function getEnrollButton(course, canAccess, user) {
    if (!user) {
        return '<a href="login.html" class="btn" style="width: 100%; text-align: center;">로그인하고 수강하기</a>';
    }
    
    if (!canAccess) {
        return `<div class="alert alert-error">
            ⚠️ 이 강좌는 <strong>${course.required_grade}</strong> 이상만 수강 가능합니다.
        </div>`;
    }
    
    return `<button onclick="enrollCourse('${course.course_id}', ${course.price})" class="btn" style="width: 100%; font-size: 1.1rem;">
        ${course.price == 0 ? '무료 수강 신청' : '수강 신청 및 결제'}
    </button>`;
}

// 강의 목록 표시
function displayLessons(lessons, canAccess) {
    if (!lessons || lessons.length === 0) {
        return '<p style="text-align: center; color: #999;">강의 정보가 없습니다.</p>';
    }
    
    let html = '<div style="display: grid; gap: 1rem;">';
    
    lessons.forEach(lesson => {
        html += `
            <div style="padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 600; color: #2d5016; margin-bottom: 0.3rem;">
                        ${lesson.lesson_number}강. ${lesson.lesson_title}
                    </div>
                    <div style="color: #666; font-size: 0.9rem;">
                        ${lesson.lesson_description}
                    </div>
                    ${lesson.materials ? `<div style="color: #999; font-size: 0.85rem; margin-top: 0.3rem;">
                        📎 ${lesson.materials}
                    </div>` : ''}
                </div>
                <div style="text-align: right; color: #666; font-size: 0.9rem;">
                    ⏱️ ${lesson.duration_minutes}분
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// 수강 신청 처리
async function enrollCourse(courseId, price) {
    const user = checkLogin();
    if (!user) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }
    
    if (price > 0) {
        // 유료 강좌 - 결제 페이지로 이동
        window.location.href = `payment.html?course_id=${courseId}&amount=${price}`;
        return;
    }
    
    // 무료 강좌 - 바로 수강 신청
    if (!confirm('이 강좌를 수강 신청하시겠습니까?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'enrollCourse',
                user_email: user.email,
                course_id: courseId,
                payment_status: 'completed',
                payment_amount: 0
            })
        });
        
        showLoading(false);
        alert('수강 신청이 완료되었습니다!');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        showLoading(false);
        console.error('수강 신청 오류:', error);
        alert('수강 신청 중 오류가 발생했습니다.');
    }
}

// 출석 체크 (강의 시청 완료)
async function markAttendance(courseId, lessonNumber, watchTime) {
    const user = checkLogin();
    if (!user) return;
    
    try {
        await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'markAttendance',
                user_email: user.email,
                course_id: courseId,
                lesson_number: lessonNumber,
                watch_time_minutes: watchTime
            })
        });
        
        console.log('출석이 기록되었습니다.');
    } catch (error) {
        console.error('출석 체크 오류:', error);
    }
}

// 과제 제출
async function submitAssignment(courseId, lessonNumber, title, content) {
    const user = checkLogin();
    if (!user) {
        alert('로그인이 필요합니다.');
        return;
    }
    
    if (!content.trim()) {
        alert('과제 내용을 입력해주세요.');
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
                action: 'submitAssignment',
                user_email: user.email,
                course_id: courseId,
                lesson_number: lessonNumber,
                assignment_title: title,
                submission_content: content
            })
        });
        
        showLoading(false);
        alert('과제가 제출되었습니다!');
        document.getElementById('assignmentForm').reset();
        
    } catch (error) {
        showLoading(false);
        console.error('과제 제출 오류:', error);
        alert('과제 제출 중 오류가 발생했습니다.');
    }
}

// 강좌 접근 권한 체크
function checkCourseAccess(requiredGrade) {
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

// 카테고리별 아이콘 (seminar.js와 동일)
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

// 테스트용 더미 데이터
function getDummyCourses() {
    return [
        {
            course_id: 'CRS001',
            title: '통합의학 전문가 과정',
            description: '현대의학과 전통의학의 조화로운 접근. 통합의학의 기초부터 실전 적용까지 체계적으로 학습합니다. 8주 과정을 통해 통합의학 전문가로 성장하세요.',
            category: '통합의학',
            instructor: '김건강 박사',
            price: 300000,
            duration_weeks: 8,
            total_lessons: 16,
            thumbnail: 'https://via.placeholder.com/400x250/4a7c2c/ffffff?text=통합의학+전문가',
            required_grade: '포럼 회원',
            status: 'active'
        },
        {
            course_id: 'CRS002',
            title: '자연치유 코디네이터 양성',
            description: '자연치유 프로그램의 기획부터 운영까지. 자연치유 시설 및 프로그램 코디네이터로 활동하기 위한 실무 중심 교육입니다.',
            category: '자연치유',
            instructor: '박자연 교수',
            price: 0,
            duration_weeks: 4,
            total_lessons: 8,
            thumbnail: 'https://via.placeholder.com/400x250/6b8e23/ffffff?text=자연치유+코디네이터',
            required_grade: '일반인',
            status: 'active'
        },
        {
            course_id: 'CRS003',
            title: '웰니스관광 전문가 과정',
            description: '건강관광과 의료관광의 트렌드 분석. 웰니스 관광 상품 개발 및 마케팅 전략을 배우고 실습합니다.',
            category: '웰니스관광',
            instructor: '이여행 교수',
            price: 250000,
            duration_weeks: 6,
            total_lessons: 12,
            thumbnail: 'https://via.placeholder.com/400x250/2d5016/ffffff?text=웰니스관광+전문가',
            required_grade: '포럼 회원',
            status: 'active'
        },
        {
            course_id: 'CRS004',
            title: '마음챙김 명상 지도자 과정',
            description: '마음챙김 명상의 이론과 실제. 명상 지도자로서 필요한 이론과 실습을 통해 전문성을 키웁니다.',
            category: '마음챙김',
            instructor: '정마음 명상가',
            price: 180000,
            duration_weeks: 5,
            total_lessons: 10,
            thumbnail: 'https://via.placeholder.com/400x250/556b2f/ffffff?text=마음챙김+명상',
            required_grade: '일반인',
            status: 'active'
        }
    ];
}

function getDummyLessons(courseId) {
    const lessons = {
        'CRS001': [
            { lesson_number: 1, lesson_title: '통합의학 개론', lesson_description: '통합의학의 정의와 역사', video_link: 'https://youtu.be/example1', duration_minutes: 45, materials: '1강_강의자료.pdf' },
            { lesson_number: 2, lesson_title: '현대의학과 전통의학의 조화', lesson_description: '두 의학 체계의 장단점과 통합 방안', video_link: 'https://youtu.be/example2', duration_minutes: 50, materials: '' },
            { lesson_number: 3, lesson_title: '통합의학의 임상 적용', lesson_description: '실제 임상 사례 분석', video_link: 'https://youtu.be/example3', duration_minutes: 60, materials: '3강_사례집.pdf' }
        ],
        'CRS002': [
            { lesson_number: 1, lesson_title: '자연치유의 이해', lesson_description: '자연치유의 원리와 역사', video_link: 'https://youtu.be/example4', duration_minutes: 40, materials: '' },
            { lesson_number: 2, lesson_title: '자연치유 프로그램 기획', lesson_description: '효과적인 프로그램 설계 방법', video_link: 'https://youtu.be/example5', duration_minutes: 55, materials: '2강_워크시트.pdf' }
        ]
    };
    
    return lessons[courseId] || [];
}

// 페이지 로드 시 강좌 목록 로드
if (document.getElementById('courseList')) {
    loadCourses('all');
}

// 강좌 상세 페이지
if (document.getElementById('courseDetail')) {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    if (courseId) {
        loadCourseDetail(courseId);
    }
}
