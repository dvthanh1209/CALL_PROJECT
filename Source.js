const url = 'https://api.fpt.ai/hmi/tts/v5';
const apiKey = '3hlR0ZtgRGnHh2lK2RBM582L4VYOOfiy'; // API key của bạn

document.getElementById('speakButton').addEventListener('click', function() {
    const text = document.getElementById('nameInput').value.trim();

    console.log("Dữ liệu gửi đi:", {
        text: text,
    });

    if (text.length >= 3 && text.length <= 5000) {
        const headers = {
            'api_key': apiKey,
            'Content-Type': 'application/json',
        };

        const data = {
            text: text,
            voice: 'banmai', // Giọng nói mặc định
            speed: 0, // Tốc độ mặc định
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
            console.log(result); // In phản hồi ra console

            if (result.error === 0) {
                const audioUrl = result.async; // URL của tệp âm thanh
                console.log("URL âm thanh:", audioUrl); // In URL âm thanh ra console

                // Tạo link tải xuống
                const link = document.createElement('a');
                link.href = audioUrl;
                link.download = 'audio.mp3'; // Tên file khi tải về
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Phát âm thanh
                const audio = new Audio(audioUrl);
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
