const url = 'https://api.fpt.ai/hmi/tts/v5';
const apiKey = '3hlR0ZtgRGnHh2lK2RBM582L4VYOOfiy'; // API key của bạn

document.getElementById('speakButton').addEventListener('click', function() {
    const text = document.getElementById('nameInput').value.trim();
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
            callback_url: 'https://dvthanh1209.github.io/Project1-call-2/' // URL để nhận thông báo
        };

        // Gửi yêu cầu đến API
        axios.post(url, data, { headers: headers })
            .then(response => {
                if (response.data.error === 0) {
                    console.log('Yêu cầu thành công, chờ âm thanh được chuẩn bị...');
                    const requestId = response.data.request_id; // Lấy request_id từ phản hồi
                    checkAudioStatus(requestId); // Gọi hàm kiểm tra trạng thái âm thanh
                } else {
                    alert('Có lỗi xảy ra: ' + response.data.message);
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
    const statusUrl = `https://api.fpt.ai/hmi/tts/v5/status/${requestId}`;

    axios.get(statusUrl)
        .then(response => {
            if (response.data.error === 0) {
                const audioUrl = response.data.async;
                const audio = new Audio(audioUrl);
                audio.play().catch(error => {
                    console.error('Lỗi khi phát âm thanh:', error);
                });
            } else {
                console.error('Lỗi kiểm tra trạng thái:', response.data.message);
                alert('Có lỗi xảy ra khi kiểm tra trạng thái âm thanh: ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi khi kiểm tra trạng thái âm thanh:', error);
            alert('Lỗi khi kiểm tra trạng thái âm thanh. Vui lòng thử lại!');
        });
}

// Gọi hàm setupCallback nếu cần
function setupCallback() {
    const callbackUrl = 'https://dvthanh1209.github.io/Project1-call-2/'; // URL để nhận thông báo
    axios.post(callbackUrl, { message: 'Request has been processed.' })
        .then(response => {
            console.log('Callback response:', response.data);
        })
        .catch(error => {
            console.error('Lỗi khi gửi callback:', error);
        });
}

// Gọi hàm setupCallback khi cần
setupCallback();
