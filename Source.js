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
            callback_url: 'https://dvthanh1209.github.io/CALL_PROJECT/' // URL để nhận thông báo
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
                console.log('Yêu cầu thành công, đang lấy liên kết âm thanh...');
                const audioUrl = responseData.async; // Lấy liên kết âm thanh từ phản hồi
                playAudio(audioUrl); // Gọi hàm để phát âm thanh từ liên kết
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

// Hàm phát âm thanh từ liên kết nhận được
function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
        console.error('Lỗi khi phát âm thanh:', error);
    });
}
