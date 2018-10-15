function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    if (callback) {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                callback(this);
            }
        }
    }

}

function check_download() {
    get('/check_progress', function(response) {
        content = JSON.parse(response.responseText);
        if (!content['complete']) {
            console.log(Math.round(content['progress'] * 100) + ' %');
            setTimeout(check_download, 2000);
        }
        else {
            console.log('Complete !')
        }
    });
}

function loader(url) {
    get('/check_progress', function(response) {
        if (JSON.parse(response.responseText)["complete"]) {
            get('/load/' + url);
            setTimeout(check_download, 2000);
        }
    });
}


/* LATERAL MENU */
function toggle(folder_depth) {
    var nodes = document.querySelectorAll('*[class*=" ' + folder_depth + '."]');
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.style.display == 'none') {
            if (node.classList[1].length == folder_depth.toString().length + 2) {
                node.style.display = 'block';
            }
        }
        else {
            if (node.classList.contains('folder')) {
                node.classList.add('closed');
            }
            node.style.display = 'none';
        }
    }

    document.getElementsByClassName(folder_depth)[0].classList.toggle('closed');

}

// toggle(0);
// toggle(1);


/* Drag element on right pannel */
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(data);
}

/* AUDIO CONTENT */
var audioPlayer = document.getElementById('audio_player');
var progressBar = document.getElementById('duration-progress-containter');
var volumeBar = document.getElementById('volume-progress-containter');
var progressDrag = false;
var volumeDrag = false;
var volumeValue = 1;

audioPlayer.addEventListener('play', function() {
    var btn = document.getElementById('play-pause-button');
    changeButtonType(btn, 'pause');
}, false);

audioPlayer.addEventListener('pause', function() {
    var btn = document.getElementById('play-pause-button');
    changeButtonType(btn, 'play');
}, false);

audioPlayer.addEventListener('timeupdate', function() {
    if (typeof(Storage) !== "undefined") {
        if (audioPlayer.currentTime != audioPlayer.duration)
            sessionStorage[audioPlayer.currentSrc] = audioPlayer.currentTime;
        else {
            /* End of audio */
            sessionStorage.removeItem(audioPlayer.currentSrc);
        }
    }
    updateProgress(0, audioPlayer.currentTime);
}, false);

audioPlayer.addEventListener('volumechange', function() {
    var btn = document.getElementById('volume-button');
    console.log(audioPlayer.volume);
    if (audioPlayer.volume == 0)
        changeButtonType(btn, 'mute');
    else if (audioPlayer.volume < 0.33)
        changeButtonType(btn, 'volume1');
    else if (audioPlayer.volume < 0.67)
        changeButtonType(btn, 'volume2');
    else
        changeButtonType(btn, 'volume3');
    if (typeof(Storage) !== "undefined") {
        localStorage.volume = audioPlayer.volume;
    }
    updateVolume(0, audioPlayer.volume)
}, false);

progressBar.addEventListener('mousedown', function(event) { 
    progressDrag = true;
    updateProgress(event.pageX);
}, false);

volumeBar.addEventListener('mousedown', function(event) {
    volumeDrag = true;
    updateVolume(event.pageX);
}, false)

document.addEventListener('mouseup', function (event) {
    if (progressDrag) {
        progressDrag = false;
        updateProgress(event.pageX);
    }
    if (volumeDrag) {
        volumeDrag = false;
        updateVolume(event.pageX);
    }
}, false);

document.addEventListener('mousemove', function (event) {
    if (progressDrag) {
        updateProgress(event.pageX);
    }
    if (volumeDrag) {
        updateVolume(event.pageX);
    }
}, false);

function updateProgress(x, value) {
    var durationProgress = document.getElementById('duration-progress').children[0];
    var percentage = 0;
    if (value) {
        percentage = (100 / audioPlayer.duration) * value;
        var mn = parseInt(value / 60);
        var sec = parseInt(value % 60);
        if (sec < 10)
            sec = '0' + sec;
        document.getElementById('duration-value').innerHTML = mn + ':' + sec;
    }
    else {
        var position = x - progressBar.getBoundingClientRect().left + document.body.scrollLeft;
        percentage = 100 * position / progressBar.offsetWidth;

        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }
        if (audioPlayer.currentTime != parseInt(percentage * audioPlayer.duration / 100))
            audioPlayer.currentTime = parseInt(percentage * audioPlayer.duration / 100);
    }
    durationProgress.style.width = percentage + "%";
}

function updateVolume (x, value) {
    var volumeProgress = document.getElementById('volume-progress').children[0];
    var percentage = 0;
    if (value) {
        percentage = 100 * value;
    }
    else {
        var position = x - volumeBar.getBoundingClientRect().left + document.body.scrollLeft;
        percentage = 100 * position / volumeBar.offsetWidth;

        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }
        audioPlayer.volume = percentage / 100;
    }

    //update volume bar and video volume
    volumeProgress.style.width = percentage + '%';
};

function changeButtonType(btn, value) {
   btn.innerHTML = value;
   btn.className = value;
}

function togglePlayPause() {
   var btn = document.getElementById('play-pause-button');
   if (audioPlayer.paused || audioPlayer.ended) {
      audioPlayer.play();
   }
   else {
      audioPlayer.pause();
   }
}

function toggleMute() {
   var btn = document.getElementById('volume-button');
   if (audioPlayer.volume == 0) {
        if (volumeValue < 0.5) {
            changeButtonType(btn, 'volume1');
        }
        else {
            changeButtonType(btn, 'volume2');
        }
        audioPlayer.volume = volumeValue;
   }
   else {
        changeButtonType(btn, 'mute');
        volumeValue = audioPlayer.volume;
        audioPlayer.volume = 0;
   }
}

window.onload = function() {
    if (audioPlayer && typeof(Storage) !== "undefined") {
        if(localStorage.volume) {
            audioPlayer.volume = localStorage.volume;
        }
        if (sessionStorage[audioPlayer.currentSrc] && sessionStorage[audioPlayer.currentSrc] != 0) {
            audioPlayer.currentTime = sessionStorage[audioPlayer.currentSrc];
        }
    }
};