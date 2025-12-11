// 자연치유관광 포럼 온라인 교육 플랫폼 - 결제 시스템 (토스페이먼츠)

// 토스페이먼츠 설정
const TOSS_CLIENT_KEY = 'YOUR_TOSS_CLIENT_KEY_HERE'; // 토스페이먼츠 클라이언트 키
const TOSS_SECRET_KEY = 'YOUR_TOSS_SECRET_KEY_HERE'; // 토스페이먼츠 시크릿 키

// 토스페이먼츠 SDK 로드 확인
function checkTossPayments() {
    if (typeof TossPayments === 'undefined') {
        console.error('토스페이먼츠 SDK가 로드되지 않았습니다.');
        return false;
    }
    return true;
}

// 결제 요청
async function requestPayment(courseId, courseName, amount) {
    const user = checkLogin();
    if (!user) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }
    
    if (!checkTossPayments()) {
        alert('결제 시스템을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
    }
    
    try {
        // 주문 ID 생성 (고유값)
        const orderId = 'ORDER_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
        
        // 토스페이먼츠 객체 생성
        const tossPayments = TossPayments(TOSS_CLIENT_KEY);
        
        // 결제 요청
        await tossPayments.requestPayment('카드', {
            amount: amount,
            orderId: orderId,
            orderName: courseName,
            customerName: user.name,
            customerEmail: user.email,
            successUrl: window.location.origin + '/payment-success.html',
            failUrl: window.location.origin + '/payment-fail.html',
        });
        
    } catch (error) {
        console.error('결제 요청 오류:', error);
        alert('결제 요청 중 오류가 발생했습니다.');
    }
}

// 결제 승인 (결제 성공 페이지에서 호출)
async function confirmPayment(paymentKey, orderId, amount) {
    showLoading(true);
    
    try {
        // 토스페이먼츠 서버에 결제 승인 요청
        const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(TOSS_SECRET_KEY + ':'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentKey: paymentKey,
                orderId: orderId,
                amount: amount
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 결제 성공 - 구글 시트에 기록
            await recordPayment(data);
            return { success: true, data: data };
        } else {
            console.error('결제 승인 실패:', data);
            return { success: false, message: data.message };
        }
        
    } catch (error) {
        console.error('결제 승인 오류:', error);
        return { success: false, message: '결제 승인 중 오류가 발생했습니다.' };
    } finally {
        showLoading(false);
    }
}

// 결제 정보를 구글 시트에 기록
async function recordPayment(paymentData) {
    const user = checkLogin();
    
    try {
        // 구글 시트에 결제 정보 저장
        await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'recordPayment',
                user_email: user.email,
                order_id: paymentData.orderId,
                payment_key: paymentData.paymentKey,
                amount: paymentData.totalAmount,
                payment_method: paymentData.method,
                status: paymentData.status,
                approved_at: paymentData.approvedAt
            })
        });
        
    } catch (error) {
        console.error('결제 기록 오류:', error);
    }
}

// 카카오페이 결제
async function requestKakaoPayment(courseId, courseName, amount) {
    const user = checkLogin();
    if (!user) {
        alert('로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }
    
    alert('카카오페이 연동은 준비 중입니다.\n토스페이먼츠를 이용해주세요.');
    // TODO: 카카오페이 API 연동
}

// 환불 요청
async function requestRefund(paymentKey, reason) {
    if (!confirm('정말 환불하시겠습니까?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(TOSS_SECRET_KEY + ':'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cancelReason: reason
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('환불이 완료되었습니다.');
            // 구글 시트에 환불 정보 업데이트
            await updateRefundStatus(paymentKey, data);
            return { success: true };
        } else {
            alert('환불 처리 중 오류가 발생했습니다: ' + data.message);
            return { success: false };
        }
        
    } catch (error) {
        console.error('환불 요청 오류:', error);
        alert('환불 처리 중 오류가 발생했습니다.');
        return { success: false };
    } finally {
        showLoading(false);
    }
}

// 환불 상태 업데이트
async function updateRefundStatus(paymentKey, refundData) {
    try {
        await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'updateRefundStatus',
                payment_key: paymentKey,
                status: 'refunded',
                refunded_at: refundData.canceledAt
            })
        });
    } catch (error) {
        console.error('환불 상태 업데이트 오류:', error);
    }
}

// 결제 내역 조회
async function getPaymentHistory(userEmail) {
    try {
        const url = `${CONFIG.APPS_SCRIPT_URL}?action=getPaymentHistory&email=${userEmail}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            return data.payments;
        } else {
            return [];
        }
    } catch (error) {
        console.error('결제 내역 조회 오류:', error);
        return [];
    }
}

// 결제 내역 표시
async function displayPaymentHistory() {
    const user = checkLogin();
    if (!user) return;
    
    const container = document.getElementById('paymentHistory');
    if (!container) return;
    
    showLoading(true);
    
    const payments = await getPaymentHistory(user.email);
    
    showLoading(false);
    
    if (payments.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">결제 내역이 없습니다.</p>';
        return;
    }
    
    let html = '<div style="display: grid; gap: 1rem;">';
    
    payments.forEach(payment => {
        const statusBadge = payment.status === 'completed' ? 
            '<span class="badge" style="background-color: #d4edda; color: #155724;">완료</span>' :
            '<span class="badge" style="background-color: #f8d7da; color: #721c24;">환불</span>';
        
        html += `
            <div style="padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <div>
                        <strong style="color: #2d5016;">${payment.course_name}</strong>
                        ${statusBadge}
                    </div>
                    <div style="font-size: 1.1rem; font-weight: 700; color: #4a7c2c;">
                        ₩${Number(payment.amount).toLocaleString()}
                    </div>
                </div>
                <div style="font-size: 0.9rem; color: #666;">
                    <div>주문번호: ${payment.order_id}</div>
                    <div>결제일: ${payment.approved_at}</div>
                    <div>결제수단: ${payment.payment_method}</div>
                </div>
                ${payment.status === 'completed' ? `
                    <div style="margin-top: 0.8rem;">
                        <button onclick="requestRefund('${payment.payment_key}', '고객 요청')" 
                                class="btn btn-outline" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
                            환불 요청
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}
