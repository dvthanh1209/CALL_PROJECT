const apiKey = "4NEZSsPkkttUr47VLaB5rFrkeQGmowRC"; // Thay đổi với API key thực tế của bạn
const apiUrl = "https://api.fpt.ai/hmi/tts/v5";

// URL để nhận thông báo callback (có thể để trống nếu không cần)
const callbackUrl = ""; 

document.getElementById('speakButton').addEventListener('click', function () {
    const text = document.getElementById('textInput').value.trim();
    const selectedVoice = document.getElementById('voiceSelect').value;
    const selectedSpeed = document.getElementById('speedSelect').value;

    if (text.length < 3 || text.length > 5000) {
        alert("Vui lòng nhập văn bản từ 3 đến 5000 ký tự.");
        return;
    }

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "api_key": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            text: text, 
            voice: selectedVoice,
            speed: selectedSpeed,
            callback_url: callbackUrl 
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Lỗi trong yêu cầu API");
        }
        return response.json();
    })
    .then(data => {
        if (data.error === 0) {
            console.log("Yêu cầu thành công, chờ âm thanh được chuẩn bị...");
            checkAudioStatus(data.request_id);
        } else {
            alert("Đã xảy ra lỗi: " + data.message);
        }
    })
    .catch(error => {
        console.error("Lỗi:", error);
    });
});

function checkAudioStatus(requestId) {
    const statusCheckUrl = `${apiUrl}/status/${requestId}`;

    setTimeout(() => {
        fetch(statusCheckUrl, {
            method: "GET",
            headers: {
                "api_key": apiKey
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi khi kiểm tra trạng thái âm thanh");
            }
            return response.json();
        })
        .then(data => {
            if (data.error === 0) {
                playAudio(data.async);
            } else {
                console.log("Âm thanh chưa sẵn sàng, kiểm tra lại...");
                checkAudioStatus(requestId);
            }
        })
        .catch(error => {
            console.error("Lỗi kiểm tra trạng thái:", error);
        });
    }, 5000);
}

function playAudio(url) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = url; // Sử dụng URL từ phản hồi
    audioPlayer.style.display = "block"; // Hiển thị audio player
    audioPlayer.play().catch(error => {
        console.error("Lỗi phát âm thanh:", error);
    });
}
