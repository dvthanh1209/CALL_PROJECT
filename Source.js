const apiKey = "4NEZSsPkkttUr47VLaB5rFrkeQGmowRC";
const apiUrl = "https://api.fpt.ai/hmi/tts/v5";

// URL để nhận thông báo callback
const callbackUrl = "https://your-callback-url.com/notify"; // Cần thay thế bằng URL thật của bạn

document.getElementById('speakButton').addEventListener('click', function () {
    const text = document.getElementById('textInput').value;

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
        body: JSON.stringify({ text: text, callback_url: callbackUrl })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error === 0) {
            console.log("Yêu cầu thành công, chờ âm thanh được chuẩn bị...");
            // Gọi hàm để kiểm tra trạng thái âm thanh
            checkAudioStatus(data.request_id);
        } else {
            alert("Đã xảy ra lỗi: " + data.message);
        }
    })
    .catch(error => {
        console.error("Lỗi:", error);
    });
});

// Hàm kiểm tra trạng thái âm thanh
function checkAudioStatus(requestId) {
    const statusCheckUrl = `${apiUrl}/status/${requestId}`;

    // Đợi một khoảng thời gian trước khi kiểm tra lại
    setTimeout(() => {
        fetch(statusCheckUrl, {
            method: "GET",
            headers: {
                "api_key": apiKey
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error === 0) {
                playAudio(data.async); // Phát âm thanh khi có sẵn
            } else {
                console.log("Âm thanh chưa sẵn sàng, kiểm tra lại...");
                checkAudioStatus(requestId); // Gọi lại nếu âm thanh chưa sẵn sàng
            }
        })
        .catch(error => {
            console.error("Lỗi kiểm tra trạng thái:", error);
        });
    }, 5000); // Kiểm tra lại sau 5 giây
}

function playAudio(url) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = url;
    audioPlayer.play();
}
