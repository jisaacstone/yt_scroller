$(function(){
    // lyrics editing js
    $('.ts-edit').click(function(){
        if($(this).children('.edbox').is(':hidden')){
            $(this).children('.edbox').css('display','block');
            $(this).siblings('.textcontent').hide()
            $('<textarea class="tcinput">'+$(this).siblings('.textcontent').html()+'</textarea>').insertBefore(this);
        }
    });
    $('.v-scroll .addnew').click(function(){
        $('.overview p:first').clone(true)
            .children('.textcontent').html('edit this text')
            .siblings('.timestop').data('time','0')
            .siblings('.ts-edit').data('url', $('.ts-edit:first').data('url').replace(/[0-9]+\/$/i,'0/'))
            .parent().insertBefore('.overview p:last');
    });
    $('.v-scroll .controls .remove').click(function(){
        $('.textcontent').parent().click(function(){
            $.ajax({
                type: 'DELETE',
                url: $(this).children('.ts-edit').data('url'),
            });
            $(this).remove();
        });
        $('.messagebox').css('display', 'block');
        $('.messagebox .message').html('Click on Text to Remove');
        $('.messagebox .close').click(function(){
            $('.textcontent').parent().unbind('click');
            $('.messagebox').css('display', 'none');
        });
    });
    $('.v-scroll p .edbox .submit').click(function(e){
        e.stopPropagation();
        var time = $(this).siblings('input').val();
        var html = $(this).parents('p').children('.tcinput').val();
        $(this).parents('p').children('.textcontent').html(html);
        $.ajax({
            type: 'POST',
            url: $(this).parents('.ts-edit').data('url'),
            data: {time: time, html: html}
        });    
        $(this).parents('p').children('.timestop').data('time', time);
        $(this).siblings('.close').click();
    });    
    $('.edbox .close').click(function(e){
        e.stopPropagation();
        $(this).parents('.edbox').css('display','none');
        $('.tcinput').remove();
        $('.textcontent').show();
    });    
    $('.hover').css('visibility','hidden');
    $('.hover').parent().hover(function(){
        $(this).children('.hover').css('visibility', 'visible');
        }, function(){
        $(this).children('.hover').css('visibility', 'hidden');
    });
    // video editing js
    $('.v-list p .edbox .submit').click(function(e){
        e.stopPropagation();
        var title = $(this).parents('p').children('.tcinput').val();
        $(this).parents('p').children('.textcontent').html(title);
        $.ajax({
            type: 'POST',
            url: '/yt_scroller/ajax/update/'+$(this).parents('p').data('vid')+'/',
            data: {title: title}
        });    
        $(this).siblings('.close').click();
    });    
    $('.v-list .controls .remove').click(function(){
        $('.vid-listing').click(function(){
            $.ajax({
                type: 'DELETE',
                url: '/yt_scroller/ajax/update/'+$(this).parents('p').data('vid')+'/'
            });
            $(this).remove();
        });
        $('.messagebox').css('display', 'block');
        $('.messagebox .message').html('Click on Listing to Remove');
        $('.messagebox .close').click(function(){
            $('.vid-listing').unbind('click');
            $('.messagebox').css('display', 'none');
        });
    });
    $('.v-list .addnew').click(function(){
        $('.addnew:last').clone().html('' +
            '<div><label for="name"> Video Name: </label>' + 
            '<input type="text" id="name" name="name"></input></div>' +
            '<div><label for="vid_id"> YouTube Id: </label>' + 
            '<input type="text" id="vid_id" name="vid_id"></input></div>' +
            '<input type="submit" class="new_video" value="+"></input>'
        ).insertBefore($('.addnew:last'))
        .children('.new_video').click(function(){
            var vid_id = $(this).siblings().children('#vid_id').val();
            var vid_name = $(this).siblings().children('#name').val();
            $.ajax({
                type: 'POST',
                url: '/yt_scroller/ajax/new_video/',
                data: {
                    vid_id: vid_id,
                    name: vid_name
                }
            });
            $(this).parents('.addnew').replaceWith('<p><a href="'+vid_id+'">'+vid_name+'</a>');
        });
    });
});
