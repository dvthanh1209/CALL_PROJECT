// Hàm để chuyển đổi văn bản thành giọng nói qua backend trung gian
function convertTextToSpeech(text, voice, speed) {
    const ttsUrl = 'https://tts-backend.vercel.app/api/tts'; // URL của backend trung gian

    const body = JSON.stringify({
        text: text,
        voice: voice,
        speed: speed
    });

    fetch(ttsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body
    })
    .then(response => response.json())
    .then(responseData => {
        if (responseData.error === 0) {
            console.log('Audio is ready at:', responseData.async);
            playAudio(responseData.async);  // Phát âm thanh
        } else {
            console.error('Lỗi khi yêu cầu TTS:', responseData.message);
            alert('Có lỗi khi yêu cầu TTS: ' + responseData.message);
        }
    })
    .catch(error => {
        console.error('Lỗi khi gửi yêu cầu:', error);
        alert('Có lỗi khi gửi yêu cầu: ' + error.message);
    });
}

// Hàm phát âm thanh từ link async
function playAudio(audioUrl) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = audioUrl;
    audioPlayer.style.display = 'block';
    audioPlayer.play()
    .then(() => {
        console.log('Đang phát âm thanh...');
    })
    .catch(error => {
        console.error('Lỗi khi phát âm thanh:', error);
        alert('Có lỗi khi phát âm thanh: ' + error.message);
    });
}

// Sự kiện khi người dùng nhấn nút
document.addEventListener('DOMContentLoaded', () => {
    const speakButton = document.getElementById('speakButton');
    if (speakButton) { // Kiểm tra xem nút có tồn tại không
        speakButton.addEventListener('click', () => {
            const text = document.getElementById('textInput').value;
            const voice = document.getElementById('voiceSelect').value;
            const speed = document.getElementById('speedSelect').value;

            if (text.length > 3) {
                convertTextToSpeech(text, voice, speed);
            } else {
                alert('Vui lòng nhập ít nhất 3 ký tự.');
            }
        });
    } else {
        console.error('Nút phát âm thanh không tồn tại!');
    }
});
