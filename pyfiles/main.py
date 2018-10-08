import os
from glob import glob

PATH = os.path.dirname(os.path.realpath(__file__)) + '/../test'

def rec_files(path):
    directories = []
    files = []
    for file in sorted(os.listdir(path)):
        if os.path.isfile("%s/%s" % (path, file)):
            files.append(file)
        else:
            directories.append((file, rec_files("%s/%s" % (path, file))))
    return {'directories': directories, 'files': files}

def files():
    return rec_files(PATH)
    #return [x for x in os.walk(PATH)]