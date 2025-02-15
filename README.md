<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rocket Animation</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }
        canvas {
            display: block;
            background-color: black;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <audio id="backgroundMusic" loop autoplay>
        <source src="https://raw.githubusercontent.com/blueboxyz/bluebo.xyz/main/beat1.wav" type="audio/wav">
        Your browser does not support the audio element.
    </audio>

    <script>
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        const WIDTH = 800, HEIGHT = 600;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const SCROLL_SPEED = 5;
        const FONT_SIZE = 32;
        const COLORS = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];

        let scrollText = "Nip >-<";
        let txtColorIdx = 0;
        let textX = WIDTH;

        let stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push([Math.random() * WIDTH, Math.random() * HEIGHT]);
        }

        const rocketImage = new Image();
        rocketImage.src = "https://raw.githubusercontent.com/blueboxyz/bluebo.xyz/main/rocket.png";

        const rocketSpeed = 2.5;
        let rocketAngle = Math.random() * 360;
        let angularVelocity = 0.0;
        let turnTimer = 0;

        const minTurnRate = 0.5;
        const maxTurnRate = 1.5;
        const rotationOffset = -90;

        function normalizeAngle(angle) {
            return angle % 360;
        }

        const rocketRect = { x: WIDTH / 2, y: HEIGHT / 2, width: 40, height: 40 };

        function update() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            for (let star of stars) {
                star[0] += 2;
                if (star[0] > WIDTH) {
                    star[0] = 0;
                    star[1] = Math.random() * HEIGHT;
                }
                ctx.beginPath();
                ctx.arc(star[0], star[1], 2, 0, Math.PI * 2);
                ctx.fillStyle = "#FFFFFF";
                ctx.fill();
            }

            if (turnTimer <= 0) {
                if (Math.random() < 0.005) {
                    turnTimer = Math.floor(Math.random() * (180 - 60 + 1) + 60);
                    angularVelocity = Math.random() * (maxTurnRate - minTurnRate) + minTurnRate;
                    if (Math.random() < 0.5) angularVelocity = -angularVelocity;
                } else {
                    angularVelocity = 0.0;
                }
            } else {
                turnTimer--;
            }

            rocketAngle = normalizeAngle(rocketAngle + angularVelocity);

            let rocketDx = Math.cos(rocketAngle * Math.PI / 180) * rocketSpeed;
            let rocketDy = Math.sin(rocketAngle * Math.PI / 180) * rocketSpeed;
            rocketRect.x += rocketDx;
            rocketRect.y += rocketDy;

            if (rocketRect.x < 0) rocketRect.x = WIDTH;
            if (rocketRect.x > WIDTH) rocketRect.x = 0;
            if (rocketRect.y < 0) rocketRect.y = HEIGHT;
            if (rocketRect.y > HEIGHT) rocketRect.y = 0;

            ctx.save();
            ctx.translate(rocketRect.x + rocketRect.width / 2, rocketRect.y + rocketRect.height / 2);
            ctx.rotate(-rocketAngle * Math.PI / 180);
            ctx.drawImage(rocketImage, -rocketRect.width / 2, -rocketRect.height / 2, rocketRect.width, rocketRect.height);
            ctx.restore();

            ctx.font = `${FONT_SIZE}px Arial`;
            ctx.fillStyle = COLORS[txtColorIdx];
            ctx.fillText(scrollText, textX, HEIGHT / 2);

            textX -= SCROLL_SPEED;
            if (textX < -ctx.measureText(scrollText).width) {
                textX = WIDTH;
                txtColorIdx = (txtColorIdx + 1) % COLORS.length;
            }

            requestAnimationFrame(update);
        }

        rocketImage.onload = () => {
            update();
        };
    </script>
</body>
</html>
