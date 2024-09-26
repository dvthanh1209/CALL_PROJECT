const url = 'https://api.fpt.ai/hmi/tts/v5';
const apiKey = '4NEZSsPkkttUr47VLaB5rFrkeQGmowRC'; // API key mới

document.getElementById('speakButton').addEventListener('click', function() {
    const text = document.getElementById('textInput').value.trim();
    const voice = document.getElementById('voiceSelect').value;
    const speed = document.getElementById('speedSelect').value;

    if (text.length >= 3 && text.length <= 5000) {
        const headers = {
            'api_key': apiKey,
            'Content-Type': 'application/json',
        };

        const data = {
            text: text,
            voice: voice,
            speed: speed,
            format: 'mp3',
            callback_url: 'https://dvthanh1209.github.io/CALL_PROJECT/' // URL callback
        };

        // Gửi yêu cầu đến API
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => response.json()) // Chuyển đổi phản hồi thành JSON
        .then(responseData => {
            if (responseData.error === 0) {
                const requestId = responseData.request_id;
                console.log('Request ID:', requestId);
                setTimeout(() => checkAudioStatus(requestId), 5000); // Chờ 5 giây trước khi kiểm tra trạng thái
            } else {
                console.error('Có lỗi xảy ra từ API:', responseData.message);
                alert('Có lỗi xảy ra từ API: ' + responseData.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi gửi yêu cầu đến API:', error);
            alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại!');
        });
    } else {
        alert('Vui lòng nhập ít nhất 3 ký tự và tối đa 5000 ký tự!');
    }
});

// Hàm kiểm tra trạng thái âm thanh
function checkAudioStatus(requestId) {
    const statusCheckUrl = `https://api.fpt.ai/hmi/tts/v5/status/${requestId}`;

    fetch(statusCheckUrl)
        .then(response => response.json())
        .then(responseData => {
            if (responseData.error === 0 && responseData.async) {
                playAudio(responseData.async); // Phát âm thanh từ liên kết async
            } else {
                console.error('Lỗi khi kiểm tra trạng thái hoặc không có async link:', responseData.message);
                alert('Có lỗi xảy ra khi kiểm tra trạng thái: ' + responseData.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi kiểm tra trạng thái âm thanh:', error);
            alert('Lỗi khi kiểm tra trạng thái âm thanh. Vui lòng thử lại!');
        });
}

// Hàm phát âm thanh từ liên kết nhận được
function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
        console.error('Lỗi khi phát âm thanh:', error);
    });
}
