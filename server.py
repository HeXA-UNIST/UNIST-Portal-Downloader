# -*- coding: utf-8 -*-
from flask import Flask, request, make_response
from socket import *
from threading import Thread
import os, sys, time

app = Flask(__name__)

DOWNLOAD_PATH = os.path.expanduser("~/Downloads/")
#DOWNLOAD_PATH = "./"

def recvall(sock, n):
	data = ''
	count = 15000
	while len(data) < n:
		if len(data) > count:
			sock.send("0"*10)
			count = len(data) + 15000
		packet = sock.recv(n - len(data))
		if not packet:
			return None
		data += packet
	return data

def download_from_portal(filepath, original_filename):
	s = socket(AF_INET, SOCK_STREAM)
	s.connect(('sftp.unist.ac.kr', 7775))

	buf = "DOWNLOAD\x091\x091\x09"+filepath
	buf_len = str(len(buf)).rjust(10,'0')
	s.send(buf_len)
	s.send(buf)

	buf = recvall(s,10)
	buf_len = int(buf)
	buf = recvall(s,buf_len)
	filesize = int(buf.split("\x09")[-1])
	buf = recvall(s, filesize)

	filename = '.'.join(original_filename.split(".")[:-1])
	file_ext = original_filename.split(".")[-1]
	check_filename = DOWNLOAD_PATH+filename+"."+file_ext
	uniq = 1
	while os.path.exists(check_filename):
		check_filename = DOWNLOAD_PATH+'%s_%d.%s' % (filename, uniq, file_ext)
		uniq += 1

	f = open(check_filename,"wb")
	f.write(buf)
	f.close()
	return check_filename 

@app.route('/')
def index():
	response = make_response("UNIST Portal Downloader")
	response.headers['Access-Control-Allow-Origin'] = '*';
	return response

@app.route('/d', methods=['POST'])
def download():
	f = request.form['filepath']
	original_filename = request.form['filename']

	filename = download_from_portal(f, original_filename)
	if filename:
		response = make_response(filename.split('/')[-1])
		response.headers['Access-Control-Allow-Origin'] = '*';
		return response
	else:
		response = make_response("Fail: "+original_filename)
		response.headers['Access-Control-Allow-Origin'] = '*';
		return response

# Run the app.
if __name__ == '__main__':
	app.run(debug=True, port=31777, threaded=True, use_reloader=False)
