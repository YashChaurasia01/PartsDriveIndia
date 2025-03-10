const videos = document.querySelectorAll('.video');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
let isMuted = true;
const isIphone = /iPhone|iPad|iPod/i.test(navigator.userAgent); // Detect iOS device

// Function to show the correct video
function showVideo(index) {
    videos.forEach((video, i) => {
        video.classList.remove('active');
        dots[i].classList.remove('active');

        if (i === index) {
            video.currentTime = 0;
            video.play().catch(error => console.error(`Error playing video ${i + 1}:`, error));
            video.muted = isMuted;
            video.classList.add('active');
            dots[i].classList.add('active');

            // Prevent fullscreen on iPhone
            if (isIphone) {
                video.removeAttribute('autoplay'); // Ensures iOS doesn't autoplay into fullscreen
                video.setAttribute('playsinline', 'true'); // Ensures inline play
            }
        } else {
            video.pause();
            video.muted = true;
        }
    });
}

// Function to navigate videos
function nextVideo() {
    currentIndex = (currentIndex + 1) % videos.length;
    showVideo(currentIndex);
}

function prevVideo() {
    currentIndex = (currentIndex - 1 + videos.length) % videos.length;
    showVideo(currentIndex);
}

document.getElementById('nextBtn').addEventListener('click', nextVideo);
document.getElementById('prevBtn').addEventListener('click', prevVideo);

// Mute/Unmute button logic
const muteBtn = document.getElementById('muteBtn');
muteBtn.innerHTML = '<span class="material-icons-round">volume_off</span>';

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    videos.forEach(video => video.muted = isMuted);
    muteBtn.innerHTML = `<span class="material-icons-round">${isMuted ? 'volume_off' : 'volume_up'}</span>`;
});

// Start the video cycle if not on iPhone
if (!isIphone) {
    showVideo(currentIndex);
    setInterval(nextVideo, 10000);
} else {
    showVideo(currentIndex); // No autoplay loop on iPhones
}
