document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const albumArtwork = document.getElementById('album-artwork');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = document.getElementById('play-pause-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBarContainer = document.querySelector('.progress');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    const playlist = [
        {
            src: 'music/music-1.mp3', 
            title: 'PIToRRO DE COCO',
            artist: 'Bad Bunny',
            album: 'Debí Tirar Más Fotos',
            artwork: 'https://mr-y-mrs-debail.github.io/prueba002/img/album-art.jpg'
        }
    ];

    let currentSongIndex = 0;

    const loadSong = (index) => {
        const song = playlist[index];
        audioPlayer.src = song.src;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumArtwork.src = song.artwork;
        updateMediaSession(song);
        audioPlayer.load(); 
        playPauseBtn.disabled = false;
    };

    const playPause = () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    };

    const nextSong = () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        audioPlayer.play();
    };

    const prevSong = () => {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        audioPlayer.play();
    };

    const updateMediaSession = (song) => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist,
                album: song.album,
                 artwork: [
      {
        src: "https://dummyimage.com/96x96",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "https://dummyimage.com/128x128",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "https://dummyimage.com/192x192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "https://dummyimage.com/256x256",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "https://dummyimage.com/384x384",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "https://dummyimage.com/512x512",
        sizes: "512x512",
        type: "image/png",
      },
                ],
            });

            navigator.mediaSession.setActionHandler('play', () => audioPlayer.play());
            navigator.mediaSession.setActionHandler('pause', () => audioPlayer.pause());
            navigator.mediaSession.setActionHandler('nexttrack', nextSong);
            navigator.mediaSession.setActionHandler('previoustrack', prevSong);
        }
    };

    playPauseBtn.addEventListener('click', playPause);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    
    audioPlayer.addEventListener('play', () => {
        playPauseIcon.classList.remove('bi-play-fill');
        playPauseIcon.classList.add('bi-pause-fill');
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing';
        }
    });
    audioPlayer.addEventListener('pause', () => {
        playPauseIcon.classList.remove('bi-pause-fill');
        playPauseIcon.classList.add('bi-play-fill');
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
    });
    
    audioPlayer.addEventListener('timeupdate', () => {
        const duration = audioPlayer.duration;
        const currentTime = audioPlayer.currentTime;
        const progressPercent = (currentTime / duration) * 100;
        
        progressBar.style.width = `${progressPercent}%`;
        
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        currentTimeEl.textContent = formatTime(currentTime);
        if (duration && !isNaN(duration)) {
            durationEl.textContent = formatTime(duration);
        } else {
            durationEl.textContent = '0:00';
        }

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setPositionState({
                duration: duration,
                playbackRate: audioPlayer.playbackRate,
                position: currentTime
            });
        }
    });

    progressBarContainer.addEventListener('click', (e) => {
        const totalWidth = progressBarContainer.offsetWidth;
        const clickX = e.offsetX;
        const newTime = (clickX / totalWidth) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    });

    loadSong(currentSongIndex);
});