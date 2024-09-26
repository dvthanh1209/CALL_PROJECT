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
            callback_url: 'https://dvthanh1209.github.io/Project1-call-2/' // Thay đổi thành URL của bạn để nhận thông báo
        };

        axios.post(url, data, { headers: headers })
            .then(response => {
                if (response.data.error === 0) {
                    const audioUrl = response.data.async;
                    const audio = new Audio(audioUrl);
                    audio.play().catch(error => {
                        console.error('Lỗi khi phát âm thanh:', error);
                    });
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

// Phần callback để nhận thông tin khi âm thanh đã sẵn sàng
function setupCallback() {
    const callbackUrl = 'https://dvthanh1209.github.io/Project1-call-2/'; // Thay đổi thành URL của bạn để nhận thông báo
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
