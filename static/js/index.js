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

function load_media(path) {
    console.log(path);
}