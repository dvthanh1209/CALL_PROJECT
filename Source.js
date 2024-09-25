const url = 'https://api.fpt.ai/hmi/tts/v5';
const apiKey = '3hlR0ZtgRGnHh2lK2RBM582L4VYOOfiy'; // Khóa API của bạn

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
            text: text,      // Chỉ gửi văn bản
            voice: voice,    // Giữ lại giọng nói để tùy chỉnh
            speed: speed,    // Giữ lại tốc độ để tùy chỉnh
            format: 'mp3'    // Giữ lại định dạng để tùy chỉnh, nhưng sẽ không đọc
        };

        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) throw new Error('Phản hồi mạng không ổn định');
            return response.json();
        })
        .then(result => {
            if (result.error === 0) {
                const audioUrl = result.async; // URL tệp âm thanh
                console.log("URL âm thanh:", audioUrl); // In URL âm thanh ra để kiểm tra

                if (audioUrl) {  // Kiểm tra nếu URL tồn tại
                    const audio = new Audio(audioUrl);
                    audio.onerror = function() {
                        console.error('Lỗi khi tải âm thanh:', audioUrl);
                        alert('Không thể phát âm thanh, vui lòng kiểm tra lại URL âm thanh!');
                    };
                    audio.play().catch(error => {
                        console.error('Lỗi khi phát âm thanh:', error);
                        alert('Lỗi khi phát âm thanh, vui lòng kiểm tra lại!');
                    });
                } else {
                    console.error('URL âm thanh không hợp lệ:', audioUrl);
                    alert('URL âm thanh không hợp lệ, vui lòng thử lại!');
                }
            } else {
                alert('Có lỗi xảy ra từ API: ' + result.message);
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
