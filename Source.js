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
            callback_url: 'https://dvthanh1209.github.io/CALL_PROJECT/' // URL callback mới
        };

        // Gửi yêu cầu đến API
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.error === 0) {
                console.log('Yêu cầu thành công, chờ âm thanh được chuẩn bị...');
                const requestId = responseData.request_id; // Lấy request_id từ phản hồi
                checkAudioStatus(requestId); // Gọi hàm kiểm tra trạng thái âm thanh
            } else {
                alert('Có lỗi xảy ra: ' + responseData.message);
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        });
    } else {
        alert('Vui lòng nhập ít nhất 3 ký tự và tối đa 5000 ký tự!');
    }
});

// Hàm kiểm tra trạng thái âm thanh
function checkAudioStatus(requestId) {
    const statusCheckUrl = `https://api.fpt.ai/hmi/tts/v5/status/${requestId}`;
    const headers = {
        'api_key': apiKey // Thêm API key vào header
    };

    fetch(statusCheckUrl, {
        method: 'GET',
        headers: headers
    })
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

// Hàm phát âm thanh từ liên kết async
function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
        console.error('Lỗi khi phát âm thanh:', error);
    });
}

// Gọi hàm setupCallback nếu cần
function setupCallback() {
    const callbackUrl = 'https://dvthanh1209.github.io/CALL_PROJECT/'; // URL để nhận thông báo
    fetch(callbackUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Request has been processed.' })
    })
    .then(response => response.json())
    .then(responseData => {
        console.log('Callback response:', responseData);
    })
    .catch(error => {
        console.error('Lỗi khi gửi callback:', error);
    });
}

// Gọi hàm setupCallback khi cần
setupCallback();
