let totalTime = 0;
let remainingTime = 0;
let interval;
let maxAngle = 0;
let isPaused = false;

function startTimer() {
    clearInterval(interval);

    const minutes = parseInt(document.getElementById("minutesInput").value, 10) || 0;
    const seconds = parseInt(document.getElementById("secondsInput").value, 10) || 0;
    
    totalTime = (minutes * 60) + seconds;
    remainingTime = totalTime;
    maxAngle = (totalTime / 3600) * 2 * Math.PI;

    if (totalTime <= 0) {
        alert("時間を入力してください！");
        return;
    }

    isPaused = false;

    document.getElementById("pauseResumeButton").textContent = "一時停止";
    document.getElementById("pauseResumeButton").disabled = false;

    interval = setInterval(updateTimer, 1000);
    drawTimer();
}

function updateTimer() {
    if (remainingTime > 0) {
        remainingTime--;
        drawTimer();
    } else {
        clearInterval(interval);
        // アラーム再生
        const p = new Audio("public/se/alarm.mp3").play(); 
        p.then(function(){
            // アラート表示
            alert("時間になりました！");
        }); 
    }
}

function pauseResumeTimer() {
    if (isPaused) {
        interval = setInterval(updateTimer, 1000);
        document.getElementById("pauseResumeButton").textContent = "一時停止";
    } else {
        clearInterval(interval);
        document.getElementById("pauseResumeButton").textContent = "再開";
    }
    isPaused = !isPaused;
}

function drawTimer() {
    const canvas = document.getElementById("timerCanvas");
    const ctx = canvas.getContext("2d");

    const canvasSize = Math.min(window.innerWidth, window.innerHeight) - 100;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 80;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);

    const percentage = remainingTime / totalTime;
    const endAngle = -Math.PI / 2 + percentage * maxAngle;

    // 外側の円枠（背景部分）
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#f0f0f0";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#555"; // 濃い灰色の枠線
    ctx.stroke();
    ctx.closePath();

    // 赤いタイマー部分
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle, false);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = "#ff0000";
    ctx.fill();
    ctx.closePath();

    ctx.restore();

    drawTicksAndNumbers(ctx, centerX, centerY, radius);
    document.getElementById("timeDisplay").innerText = formatTime(remainingTime);
}

function drawTicksAndNumbers(ctx, centerX, centerY, radius) {
    const outerRadius = radius + 10;
    const innerRadius1 = radius - 5;
    const innerRadius5 = radius - 15;
    const numberRadius = radius + 35;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.font = `${Math.max(radius / 10, 15)}px Arial`;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const labels = [0, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5];

    for (let i = 0; i < 60; i++) {
        const angle = (-Math.PI / 2) + (i * (2 * Math.PI / 60));
        const isFiveMinuteTick = i % 5 === 0;
        const innerRadius = isFiveMinuteTick ? innerRadius5 : innerRadius1;

        const x1 = centerX + Math.cos(angle) * outerRadius;
        const y1 = centerY + Math.sin(angle) * outerRadius;
        const x2 = centerX + Math.cos(angle) * innerRadius;
        const y2 = centerY + Math.sin(angle) * innerRadius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isFiveMinuteTick ? "black" : "#666";
        ctx.lineWidth = isFiveMinuteTick ? 2 : 1;
        ctx.stroke();
        ctx.closePath();

        if (isFiveMinuteTick) {
            const labelIndex = i / 5;
            const numberX = centerX + Math.cos(angle) * numberRadius;
            const numberY = centerY + Math.sin(angle) * numberRadius;
            ctx.fillText(labels[labelIndex], numberX, numberY);
        }
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

window.addEventListener("resize", drawTimer);
