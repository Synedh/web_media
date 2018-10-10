import os
from pytube import YouTube
from glob import glob

MEDIA_FOLDER = '/test'
PATH = os.path.dirname(os.path.realpath(__file__)) + '/..' + MEDIA_FOLDER
file_size = 0
progress = 0
complete = True

def rec_files(path, short_path):
    directories = []
    files = []
    for file in sorted(os.listdir(path)):
        if os.path.isfile("%s/%s" % (path, file)):
            files.append({
                'name': ".".join(file.split('.')[:-1]),
                'path': "%s/%s" % (short_path, file)
            })
        else:
            directories.append((file, rec_files("%s/%s" % (path, file), "%s/%s" % (short_path, file))))
    return {'directories': directories, 'files': files}


def files():
    return rec_files(PATH, '')


def media_loader(url):
    global file_size, complete
    complete = False
    yt = YouTube(url, on_progress_callback=download_progress, on_complete_callback=download_complete)
    video = yt.streams.filter(mime_type='audio/webm').first()
    file_size = video.filesize
    video.download()


def download_progress(stream, chunk, file_handle, remaining):
    global progress
    progress = (file_size - remaining) / file_size


def download_complete(stream, file_handle):
    global file_size, progress, complete
    filesize = 0
    progress = 0
    complete = True


def get_media(path):
    extension = path.split('.')[-1]
    if extension in ('mp3', 'ogg', 'flac', 'wav'):
        return 'audio_template.html', '%s/%s' % (MEDIA_FOLDER, path)
    else:
        return 'video_template.html', '%s/%s' % (MEDIA_FOLDER, path)

