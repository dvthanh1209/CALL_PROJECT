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
            format: 'mp3'
        };

        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(result => {
            if (result.error === 0) {
                const audioUrl = result.async; // URL của tệp âm thanh
                
                // Tạo và phát âm thanh từ URL
                const audio = new Audio(audioUrl);
                audio.onerror = function() {
                    console.error('Lỗi khi tải âm thanh:', audioUrl);
                    alert('Không thể phát âm thanh, vui lòng kiểm tra lại!');
                };
                audio.play().catch(error => {
                    console.error('Lỗi khi phát âm thanh:', error);
                });
            } else {
                alert('Có lỗi xảy ra: ' + result.message);
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
