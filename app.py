from pyfiles import main

import json
from flask import Flask, render_template, session, request, url_for, redirect, _request_ctx_stack, jsonify, send_from_directory


app = Flask(__name__)
app.debug = True

@app.route('/')
@app.route('/<path:file_path>')
def index(file_path = None):
    files = main.rec_files()
    if file_path:
        template, media = main.get_media(file_path)
    else:
        template = 'default_template.html'
        media = {}
    return render_template('index.html', template=template, files=files, media=media)


@app.route('/media/<path:file_path>')
def media(file_path):
    return send_from_directory(main.MEDIA_FOLDER, file_path)


@app.route('/load/<path:url>')
def load(url):
    res = main.media_loader(url)
    return jsonify({'res': res})


@app.route('/check_progress')
def check_progress():
    return jsonify({'progress': main.progress, 'complete': main.complete })


if __name__ == "__main__":
    app.run()
