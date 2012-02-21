from django.http import HttpRequest
from django.shortcuts import render_to_response

def index(HttpRequest):
    return render_to_response('yt_scroller.html', {})
