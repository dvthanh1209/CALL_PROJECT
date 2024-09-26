const url = 'https://api.fpt.ai/hmi/tts/v5';
const apiKey = '3hlR0ZtgRGnHh2lK2RBM582L4VYOOfiy'; // API key của bạn
const callbackUrl = 'https://yourdomain.com/your-callback-endpoint'; // URL để nhận callback

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
            callback_url: callbackUrl // Thêm callback_url vào đây
        };

        axios.post(url, data, { headers: headers })
            .then(response => {
                if (response.data.error === 0) {
                    // Bạn sẽ không xử lý trực tiếp async link nữa vì sẽ nhận qua callback
                    alert('Yêu cầu đã được gửi. Bạn sẽ nhận được thông báo khi âm thanh sẵn sàng.');
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

// Callback handling (ví dụ cho Node.js server)
app.post('/your-callback-endpoint', (req, res) => {
    const { message, success } = req.body;
    
    if (success === "true") {
        // Xử lý khi callback thành công
        console.log('Nội dung âm thanh đã sẵn sàng:', message);
        // Bạn có thể lưu async link và phát âm thanh khi đã sẵn sàng
    } else {
        // Xử lý khi callback thất bại
        console.error('Có lỗi trong quá trình tạo âm thanh:', message);
    }

    res.sendStatus(200); // Đảm bảo phản hồi lại callback từ API
});
