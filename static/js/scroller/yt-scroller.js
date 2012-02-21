/*!
 *
 * Tiny Scrollbar 1.66
 * http://www.baijs.nl/tinyscrollbar/
 *
 * Copyright 2010, Maarten Baijs
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 *
 * Date: 13 / 11 / 2011
 * Depends on library: jQuery
 *
 * Heavily modified by J Isaac Stone for integration with the youtube player
 * Date: 28 / 12 / 2011
 * 
 */

function onYouTubePlayerReady(playerId) {
  	ytplayer = document.getElementById(playerId);
	$('#anno-video-scroller').tinyscrollbar();
	ytplayer.addEventListener("onStateChange", "stateChange");
}
function stateChange(newState) {
    $('#anno-video-scroller').playerStateChange(newState)
}
$(document).ready(function(){
	//$('#anno-video-scroller').tinyscrollbar();
});

(function($){
	$.tiny = $.tiny || { };
	
	$.tiny.scrollbar = {
		options: {	
			axis: 'y', // vertical or horizontal scrollbar? ( x || y ).
			wheel: 40,  //how many pixels must the mouswheel scroll at a time.
			scroll: true, //enable or disable the mousewheel;
			size: 'auto', //set the size of the scrollbar to auto or a fixed number.
			sizethumb: 'auto' //set the size of the thumb to auto or a fixed number.
		}
	};	
	
	$.fn.tinyscrollbar = function(options) { 
		var options = $.extend({}, $.tiny.scrollbar.options, options); 		
		this.each(function(){ $(this).data('tsb', new Scrollbar($(this), options)); });
		return this;
	};
	$.fn.tinyscrollbar_update = function(sScroll) { return $(this).data('tsb').update(sScroll); };
	$.fn.playerStateChange = function(newState) {
        return $(this).data('tsb').onYtplayerStateChange(newState);
    };
	
	function Scrollbar(root, options){
		var oSelf = this;
		var oWrapper = root;
		var oViewport = { obj: $('.viewport', root) };
		var oContent = { obj: $('.overview', root) };
		var oScrollbar = { obj: $('.scrollbar', root) };
		var oTrack = { obj: $('.track', oScrollbar.obj) };
		var oThumb = { obj: $('.thumb', oScrollbar.obj) };
		var sAxis = options.axis == 'x', sDirection = sAxis ? 'left' : 'top', sSize = sAxis ? 'Width' : 'Height';
		var iScroll, iPosition = { start: 0, now: 0 }, iMouse = {};

    	var duration = 0;
    	var offset = 0;
    	var steps = {"0":0};
   		var scrollDiv = null;
    	var curTime = 0;

		function initialize() {
			ytPrep();
			oSelf.update();	
			ytInit();
			setEvents();
			return oSelf;
		}
		this.update = function(sScroll){
			oViewport[options.axis] = oViewport.obj[0]['offset'+ sSize];
			oContent[options.axis] = oContent.obj[0]['scroll'+ sSize];
			oContent.ratio = oViewport[options.axis] / oContent[options.axis];
			oScrollbar.obj.toggleClass('disable', oContent.ratio >= 1);
			oTrack[options.axis] = options.size == 'auto' ? oViewport[options.axis] : options.size;
			oThumb[options.axis] = Math.min(oTrack[options.axis], Math.max(0, ( options.sizethumb == 'auto' ? (oTrack[options.axis] * oContent.ratio) : options.sizethumb )));
			oScrollbar.ratio = options.sizethumb == 'auto' ? (oContent[options.axis] / oTrack[options.axis]) : (oContent[options.axis] - oViewport[options.axis]) / (oTrack[options.axis] - oThumb[options.axis]);
			iScroll = (sScroll == 'relative' && oContent.ratio <= 1) ? Math.min((oContent[options.axis] - oViewport[options.axis]), Math.max(0, iScroll)) : 0;
			iScroll = (sScroll == 'bottom' && oContent.ratio <= 1) ? (oContent[options.axis] - oViewport[options.axis]) : isNaN(parseInt(sScroll)) ? iScroll : parseInt(sScroll);
			setSize();
		};
	    	this.onYtplayerStateChange = function(newState){
            
            if (newState === 3 && ! duration) {
                //ytinit();
            }
            if (newState === 1) {
                return ytplay();
            }
            if (newState === 2) {
		stop_scroll();
                return setCurTime();
            }
        };
        function scroll_content(position, time, callback) {
            callback || (callback = function(){});
            anOb = {};
            anOb[sDirection] = -position;
            oContent.obj.animate(anOb, time, 'linear');
            anOb[sDirection] = position/oScrollbar.ratio;
            oThumb.obj.animate(anOb, time, 'linear', callback);
        };
        function stop_scroll() {
            oContent.obj.stop(true);
            oThumb.obj.stop(true);
            ytplayer.pauseVideo();
        };
		function setSize(){
			oThumb.obj.css(sDirection, iScroll / oScrollbar.ratio);
			oContent.obj.css(sDirection, -iScroll);
			iMouse['start'] = oThumb.obj.offset()[sDirection];
			var sCssSize = sSize.toLowerCase(); 
			oScrollbar.obj.css(sCssSize, oTrack[options.axis]);
			oTrack.obj.css(sCssSize, oTrack[options.axis]);
			oThumb.obj.css(sCssSize, oThumb[options.axis]);		
		};		
		function setEvents(){
			oThumb.obj.bind('mousedown', start);
			oThumb.obj[0].ontouchstart = function(oEvent){
				oEvent.preventDefault();
				oThumb.obj.unbind('mousedown');
				start(oEvent.touches[0]);
				return false;
			};	
			oTrack.obj.bind('mouseup', drag);
			if(options.scroll && this.addEventListener){
				oWrapper[0].addEventListener('DOMMouseScroll', wheel, false);
				oWrapper[0].addEventListener('mousewheel', wheel, false );
			}
			else if(options.scroll){oWrapper[0].onmousewheel = wheel;}
		};
		function start(oEvent){
            stop_scroll();
			iMouse.start = sAxis ? oEvent.pageX : oEvent.pageY;
			var oThumbDir = parseInt(oThumb.obj.css(sDirection));
			iPosition.start = oThumbDir == 'auto' ? 0 : oThumbDir;
			$(document).bind('mousemove', drag);
			document.ontouchmove = function(oEvent){
				$(document).unbind('mousemove');
				drag(oEvent.touches[0]);
			};
			$(document).bind('mouseup', end);
			oThumb.obj.bind('mouseup', end);
			oThumb.obj[0].ontouchend = document.ontouchend = function(oEvent){
				$(document).unbind('mouseup');
				oThumb.obj.unbind('mouseup');
				end(oEvent.touches[0]);
			};
			return false;
		};		
		function wheel(oEvent){
            stop_scroll();
			if(!(oContent.ratio >= 1)){
				var oEvent = oEvent || window.event;
				var iDelta = oEvent.wheelDelta ? oEvent.wheelDelta/120 : -oEvent.detail/3;
				iScroll -= iDelta * options.wheel;
				iScroll = Math.min((oContent[options.axis] - oViewport[options.axis]), Math.max(0, iScroll));
				oThumb.obj.css(sDirection, iScroll / oScrollbar.ratio);
				oContent.obj.css(sDirection, -iScroll);
				
				oEvent = $.event.fix(oEvent);
				oEvent.preventDefault();
			};
		};
		function end(oEvent){
			$(document).unbind('mousemove', drag);
			$(document).unbind('mouseup', end);
			oThumb.obj.unbind('mouseup', end);
			document.ontouchmove = oThumb.obj[0].ontouchend = document.ontouchend = null;
			return false;
		};
		function drag(oEvent){
		    stop_scroll();
			if(!(oContent.ratio >= 1)){
				iPosition.now = Math.min((oTrack[options.axis] - oThumb[options.axis]), Math.max(0, (iPosition.start + ((sAxis ? oEvent.pageX : oEvent.pageY) - iMouse.start))));
				iScroll = iPosition.now * oScrollbar.ratio;
				oContent.obj.css(sDirection, -iScroll);
				oThumb.obj.css(sDirection, iPosition.now);
			}
			return false;
		};
		function ytPrep(){
		    duration = ytplayer.getDuration();
		    offset = Math.floor(oViewport.obj.innerHeight() / 2);
		    oContent.obj.prepend($(document.createElement('div')).css('height', offset));
		    oContent.obj.append($(document.createElement('div')).css('height', offset));
		}
		
		function ytInit(){
	        var curScrPos = oContent.obj.position().top;

        	$('.timestop', oContent.obj).each(function(i, el){
                var timeArray = $(el).data('time').toString().split(':');
                var time = parseInt(timeArray.pop(), 10);
                while(timeArray.length) {
                    timeArray = timeArray.map(function(n){ return n*60; });
                    time += timeArray.pop();
                }
          		steps[time] = $(el).position().top + curScrPos;
        	});
        	var last = oContent.obj.children(':last-child');
        	steps[duration] = last.position().top + curScrPos;
		};
        function ytplay(){
            var before = 0;
            var after = 0;
            $.each(steps, function(time, position){
                if (time > curTime){
                    after || (after = time);
                } else {
                    before = time;
                }
            });
            stepPct = (curTime - before) / (after - before);
            scrollTo = Math.max(0,
                steps[before]+((steps[after]-steps[before])*stepPct - offset));
            scroll_content(scrollTo, 330, function(){
                startScroller();
            });
        };
		function startScroller(){
            setCurTime();
            var to_end = true;
            $.each(steps, function(time, position){
                if (time > curTime && to_end){
                    scroll_content(position-offset,
                        (time-curTime)*1000,
                        function(){
                            startScroller();
                        });
                    to_end = false;
                }
            });
            if (to_end && duration-curTime > 1) {
                scroll_content(steps[duration],(duration-curTime)*1000);
            }
        };
        function setCurTime() {
            curTime = ytplayer.getCurrentTime();
        };
		
		return initialize();
	};
})(jQuery);
