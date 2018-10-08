from pyfiles import main

import json
from flask import Flask, render_template, session, request, url_for, redirect, _request_ctx_stack, jsonify, send_from_directory


app = Flask(__name__)
app.debug = True

@app.route('/')
def index():
    files = main.files()
    return render_template('index.html', files=files)

@app.route('/music/<path:filename>')
def music(filename):
    return send_from_directory('test/music/', filename)

@app.route('/video/<path:filename>')
def video(filename):
    return send_from_directory('test/video/', filename)

if __name__ == "__main__":
    app.run()