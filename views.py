from django.http import HttpRequest, HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
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
    edit = True
    return render_to_response('yt_vid.html', locals())

def update_time(HttpRequest, vid_id, timestop_id):
    time = HttpRequest.POST.get('time', None)
    if time is None:
        return HttpResponse(status="403") 
    ts = get_object_or_404(Timestop, pk=timestop_id, vidinfo_id=vid_id)
    ts.time = time
    ts.save()
    return HttpResonse(status='200')
