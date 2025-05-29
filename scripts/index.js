const musicList = [
	"../assets/audio/1.mp3",
	"../assets/audio/Andery Toronto - Glock.mp3",
	"../assets/audio/Andery Toronto feat. Archi - С Кем Ты Была.mp3",
	"../assets/audio/Andery Toronto - Криминал.mp3",
];
const elements = {
	playBtn: document.querySelector("#play-btn"),
	nextBtn: document.querySelector("#next-btn"),
	prevBtn: document.querySelector("#prev-btn"),
	playImage: document.querySelector(".play-img"),
	muteBtn: document.querySelector("#mute-btn"),
	muteImage: document.querySelector(".mute-img"),
	repeatBtn: document.querySelector("#repeat-btn"),
	progressBar: document.querySelector(".footer__progress-bar"),
	progressPercent: document.querySelector(".footer__progress-percent"),
	uploadBtn: document.querySelector("#upload-btn"),
	fileInput: document.querySelector(".header__input"),
};

const state = {
	isPlaying: false,
	isMuted: false,
	currentIndex: 0,
	audio: new Audio(musicList[0]),
};

const updateUI = {
	changePlayButton: () => {
		elements.playImage.src = state.isPlaying
			? "../assets/icons/actions/pause.png"
			: "../assets/icons/actions/play.png";
	},

	changeMuteButton: () => {
		elements.muteImage.src = state.isMuted
			? "../assets/icons/mute.png"
			: "../assets/icons/sound.png";
	},

	progress: () => {
		if (!isNaN(state.audio.duration)) {
			const percent = (state.audio.currentTime / state.audio.duration) * 100;
			elements.progressBar.style.width = `${percent}%`;
			elements.progressPercent.textContent = `${Math.floor(percent)}%`;
		}
	},
};

const player = {
	togglePlay: () => {
		state.isPlaying = !state.isPlaying;
		state.isPlaying ? state.audio.play() : state.audio.pause();
		updateUI.changePlayButton();
	},

	toggleMute: () => {
		state.isMuted = !state.isMuted;
		state.audio.muted = state.isMuted;
		updateUI.changeMuteButton();
	},

	toggleRepeat: () => (state.audio.loop = !state.audio.loop),

	switchTrack: (newIndex) => {
		state.audio.pause();
		state.currentIndex = (newIndex + musicList.length) % musicList.length;
		state.audio = new Audio(musicList[state.currentIndex]);
		state.audio.addEventListener("timeupdate", updateUI.progress);
		state.isPlaying = true;
		state.audio.play();
		updateUI.changePlayButton();
	},
};

Object.entries({
	playBtn: () => player.togglePlay(),
	muteBtn: () => player.toggleMute(),
	repeatBtn: () => player.toggleRepeat(),
	nextBtn: () => player.switchTrack(state.currentIndex + 1),
	prevBtn: () => player.switchTrack(state.currentIndex - 1),
	uploadBtn: () => elements.fileInput.click(),
}).forEach(([key, handler]) =>
	elements[key].addEventListener("click", handler)
);

elements.fileInput.addEventListener("change", (e) => {
	const files = e.target.files;
	if (!files.length) return;

	files.forEach((file) => musicList.push(URL.createObjectURL(file)));
});

state.audio.addEventListener("timeupdate", updateUI.progress);

// --------------------------------------------------------------

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((reg) => console.log("Service Worker registered:", reg))
			.catch((err) =>
				console.error("Service Worker registration failed:", err)
			);
	});
}