function Player() {
    var controls = document.querySelector('.controls');
    var volumeControls = document.querySelector('.volume-controls');
    var progress = controls.querySelector('progress')
    var volume = volumeControls.querySelector('progress')
    var volume2 = volumeControls.querySelector('span')
    var time = controls.querySelector('span')
    var drag;
    var elemClick;

    function _normalize(number) {
        if (number < 10) {
            return '0' + number
        }
        return number;
    }

    function play() {
        audio.play()
        localStorage.setItem('play', new Date().getTime())
        title()
    }

    function pause() {
        audio.pause()
        document.querySelector('title').innerHTML = 'Player'

    }

    function statusPlay() {
        return audio.paused
    }

    function progressSong(elem) {
        progress.max = elem.duration
        progress.value = elem.currentTime
    }

    function timeProgressSong(elem) {
        time.innerHTML = new Date(elem.currentTime * 1000).getMinutes() + ':' + 
        _normalize(new Date(elem.currentTime * 1000).getSeconds()) + ' из ' + 
        new Date(elem.duration * 1000).getMinutes() + ':' + _normalize(new Date(elem.duration * 1000).getSeconds())
    }

    function volumeProgress(elem) {
        volume.value = (elem.volume) * 100
    }

    function volumeProcent(elem) {
        volume2.innerHTML = ((elem.volume) * 100).toFixed() + '%'
    }

    function volumDragProgress(event) {
        audio.volume = ((100 * event.offsetX) / event.target.offsetWidth) / 100
    }

    function songDragProgress(event) {
        audio.currentTime = (audio.duration * event.offsetX) / event.target.offsetWidth
    }

    function forvardClick() {
        audio.currentTime += 10;
    }

    function nextClick() {
        audio.currentTime -= 10;
    }

    function scan(direction) {
        for (var i = 0; i < playList.length; ++i) {
            if (audio.getAttribute('src').substr(5) === playList[i].dataset.file) {

                if (i === playList.length - 1 && direction === 1) {
                    i = -1;
                } else if (i === 0 && direction === -1) {
                    i = playList.length
                }
                if (!statusPlay()) {
                    audio.setAttribute('src', 'mp3s/' + playList[i + direction].dataset.file)
                    player.play()
                } else {
                    audio.setAttribute('src', 'mp3s/' + playList[i + direction].dataset.file)
                    progress.value = 0;
                }

                break;
            }
        }
    }

    function title() {
        for (var i = 0; i < playList.length; i++) {
            if (audio.getAttribute('src').substr(5) === playList[i].dataset.file) {
                document.querySelector('h3').innerHTML = playList[i].textContent
                document.querySelector('title').innerHTML = playList[i].textContent
            }
        }
    }

    function dragProgress() {
        document.querySelector('body').addEventListener('mousedown', function(event) {
            if (event.target.tagName === 'PROGRESS') {
                drag = true;
                elemClick = event.target
            }
        }, false)

        document.querySelector('body').addEventListener('mousemove', function(event) {
            if (audio.duration) {
                if (drag === true && elemClick === event.target) {
                    if (event.target.className === 'volume') {
                        audio.volume = ((100 * event.offsetX) / event.target.offsetWidth) / 100
                    } else {
                        audio.currentTime = (audio.duration * event.offsetX) / event.target.offsetWidth
                    }
                }
            }
        }, false)

        window.addEventListener('mouseup', function(event) {
            drag = false;
        }, false)
    }
    return {
        progressSong: progressSong,
        timeProgressSong: timeProgressSong,
        volumeProgress: volumeProgress,
        volumeProcent: volumeProcent,
        scan: scan,
        title: title,
        dragProgress: dragProgress,
        play: play,
        pause: pause,
        statusPlay: statusPlay,
        forvardClick: forvardClick,
        nextClick: nextClick
    }
}