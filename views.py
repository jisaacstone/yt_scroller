from django.http import HttpRequest
from django.shortcuts import render_to_response
from yt_scroller.models import VidInfo, Timestop

def index(HttpRequest):
    return render_to_response('yt_scroller.html', {})

def show(HttpRequest, vid_string):
    vid = VidInfo.objects.filter(name=vid_string)
    if not vid:
        vid = VidInfo.objects.filter(vid_id=vid_string)
    if not vid:
        return render_to_response('yt_index.html', {'vids': VidInfo.objects.all()})
    vid = vid[0]    
    timestops = vid.timestop_set.all()
    return render_to_response('yt_vid.html', locals())
