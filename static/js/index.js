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

/* AUDIO CONTENT */
var audioPlayer = document.getElementById('audio_player');
var progressBar = document.getElementById('progress-bar');
var volumeBar = document.getElementById('volume-bar');
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
   var percentage = Math.floor((100 / audioPlayer.duration) * audioPlayer.currentTime);
   progressBar.value = percentage;
   progressBar.innerHTML = percentage + '% played';
}, false);

audioPlayer.addEventListener('volumechange', function() {
    var btn = document.getElementById('volume-button');
    if (audioPlayer.volume == 0)
        changeButtonType(btn, 'mute');
    else if (audioPlayer.volume < 0.5)
        changeButtonType(btn, 'volume1');
    else 
        changeButtonType(btn, 'volume2');
});

progressBar.addEventListener('mousedown', function(event) {
    console.log(event);
}, false);


volumeBar.addEventListener('mousedown', function(event) {
    volumeDrag = true;
    updateVolume(event.pageX);
})

volumeBar.addEventListener('mouseup', function (event) {
    if (volumeDrag) {
        volumeDrag = false;
        updateVolume(event.pageX);
    }
});

volumeBar.addEventListener('mousemove', function (event) {
    if (volumeDrag) {
        updateVolume(event.pageX);
    }
});

var updateVolume = function (x) {
    var position = x - volumeBar.getBoundingClientRect().left + document.body.scrollLeft;
    var percentage = 100 * position / volumeBar.offsetWidth;

    if (percentage > 100) {
        percentage = 100;
    }
    if (percentage < 0) {
        percentage = 0;
    }

    //update volume bar and video volume
    volumeBar.value = percentage;
    audioPlayer.volume = percentage / 100;
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
