// 자연치유관광 포럼 온라인 교육 플랫폼 - 설정 파일

// Google Apps Script 웹 앱 URL을 여기에 입력하세요
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwAxEYwSbtFc1li0_BR-Ubnh_DaiIuwBwyvEC2NQlzXx0oZQ3_HFTdri6MYowMTn1wadg/exec',
    // 예시: 'https://script.google.com/macros/s/AKfycbx.../exec'
};

// Apps Script URL이 설정되지 않았을 때 경고
if (CONFIG.APPS_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbwAxEYwSbtFc1li0_BR-Ubnh_DaiIuwBwyvEC2NQlzXx0oZQ3_HFTdri6MYowMTn1wadg/exec') {
    console.warn('⚠️ Google Apps Script URL이 설정되지 않았습니다. js/config.js 파일을 수정해주세요.');
}
