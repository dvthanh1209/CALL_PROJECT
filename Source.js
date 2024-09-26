const apiKey = '3hlR0ZtgRGnHh2lK2RBM582L4VYOOfiy';
const callbackUrl = 'https://dvthanh1209.github.io/CALL_PROJECT/';

// Hàm để chuyển đổi văn bản thành giọng nói
function convertTextToSpeech(text) {
    const ttsUrl = 'https://api.fpt.ai/hmi/tts/v5';
    const headers = {
        'api_key': apiKey,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
    };

    const body = JSON.stringify({
        text: text,
        voice: 'banmai',  // Bạn có thể thay đổi giọng đọc ở đây
        speed: 0,         // Tốc độ giọng đọc (từ -3 đến +3)
        format: 'mp3',    // Định dạng file
        callback_url: callbackUrl
    });

    fetch(ttsUrl, {
        method: 'POST',
        headers: headers,
        body: body
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.success === "true") {
            const requestId = responseData.request_id;
            console.log('Request ID:', requestId);
            checkAudioStatus(requestId);  // Kiểm tra trạng thái audio
        } else {
            console.error('Lỗi khi yêu cầu TTS:', responseData.message);
        }
    })
    .catch(error => {
        console.error('Lỗi khi gửi yêu cầu:', error);
    });
}

// Hàm kiểm tra trạng thái âm thanh
function checkAudioStatus(requestId) {
    const statusCheckUrl = `https://api.fpt.ai/hmi/tts/v5/status/${requestId}`;
    const headers = {
        'api_key': apiKey
    };

    fetch(statusCheckUrl, {
        method: 'GET',
        headers: headers
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.error === 0 && responseData.async) {
            console.log('Audio is ready at:', responseData.async);
            playAudio(responseData.async);  // Phát âm thanh
        } else {
            console.error('Lỗi khi kiểm tra trạng thái hoặc không có async link:', responseData.message);
            alert('Có lỗi xảy ra khi kiểm tra trạng thái: ' + responseData.message);
        }
    })
    .catch(error => {
        console.error('Lỗi khi kiểm tra trạng thái âm thanh:', error);
    });
}

// Hàm phát âm thanh từ link async
function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play()
    .then(() => {
        console.log('Đang phát âm thanh...');
    })
    .catch(error => {
        console.error('Lỗi khi phát âm thanh:', error);
    });
}

// Ví dụ sử dụng hàm để chuyển đổi văn bản
document.getElementById('convert-btn').addEventListener('click', () => {
    const text = document.getElementById('text-input').value;
    if (text.length > 3) {
        convertTextToSpeech(text);
    } else {
        alert('Vui lòng nhập ít nhất 3 ký tự.');
    }
});
