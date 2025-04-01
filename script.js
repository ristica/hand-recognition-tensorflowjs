async function initNeuralNetwork() {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
        runtime: 'tfjs',
    };
    let detector = await handPoseDetection.createDetector(model, detectorConfig);
    return detector;
}

function drawHands(hands, keypoints) {
    hands.forEach(hand => {

        // get all keypoints
        const keypoints = hand.keypoints.map((kp) => [kp.x, kp.y]);

        for (let j = 0; j < Object.keys(FINGER_JOINTS).length; j++) {
            // current finger
            let finger = Object.keys(FINGER_JOINTS)[j];
            for (let k = 0; k < FINGER_JOINTS[finger].length - 1; k++) {
                const firstJointIndex = FINGER_JOINTS[finger][k];
                const secondJointIndex = FINGER_JOINTS[finger][k + 1];

                CTX.beginPath();
                CTX.moveTo(
                    keypoints[firstJointIndex][0],
                    keypoints[firstJointIndex][1]
                );
                CTX.lineTo(
                    keypoints[secondJointIndex][0],
                    keypoints[secondJointIndex][1]
                );
                CTX.strokeStyle = "aqua";
                CTX.lineWidth = 1;
                CTX.stroke();
            }
        }

        drawJoints(keypoints);
    });
}

function drawJoints(keypoints) {
    // draw key points
    for (var i = 0; i < keypoints.length; i++) {
        const x = keypoints[i][0];
        const y = keypoints[i][1];

        CTX.beginPath();
        CTX.arc(x, y, 3, 0, 3 * Math.PI);
        CTX.fillStyle = 'aqua';
        CTX.fill();
    }
}

async function detectLandmarks(video, detector) {

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    video.width = videoWidth;
    video.height = videoHeight;

    CANVAS.width = videoWidth;
    CANVAS.height = videoHeight;

    const hands = await detector.estimateHands(video);
    console.log(hands);

    requestAnimationFrame(() => {
        drawHands(hands);
    });
}

async function main() {

    var video = await startVideo();
    const detector = await initNeuralNetwork();

    setInterval(() => {
        detectLandmarks(video, detector);
    });

}

main();