$(function(){
    $('.ts-edit').click(function(){
        if($(this).children('.edbox').is(':hidden')){
            $(this).children('.edbox').css('display','block');
        }
    });
    $('.addnew').click(function(){
        $('.overview p:first').clone(true)
            .children('.textcontent').html('edit this text')
            .siblings('.timestop').data('time','0')
            .parent().insertAfter('.overview div:first');
    });
    $('.remove').click(function(){
        $('.textcontent').click(function(){
            $.ajax({
                type: 'DELETE',
                url: $(this).siblings('.ts-edit').data('url'),
            });
        });
        $('.messagebox').css('display', 'block');
        $('.messagebox .message').html('Click on Text to Remove');
        $('.messagebox .close').click(function(){
            $('.textcontent').unbind('click');
            $('.messagebox').css('display', 'none');
        });
    });
    $('p .edbox .submit').click(function(e){
        e.stopPropagation();
        time = $(this).siblings('input').val();
        html = $(this).parents('p').children('.textcontent').html();
        $.ajax({
            type: 'POST',
            url: $(this).parents('.ts-edit').data('url'),
            data: {time: time, html: html}
        });    
        $(this).parents('p').children('.timestop').data('time', time);
    });    
    $('.edbox .close').click(function(e){
        e.stopPropagation();
        $(this).parents('.edbox').css('display','none');
    });    
    $('.hover').css('visibility','hidden');
    $('.hover').parent().hover(function(){
        $(this).children('.hover').css('visibility', 'visible');
        }, function(){
        $(this).children('.hover').css('visibility', 'hidden')
            .children('.edbox').css('display', 'none');
    });
});
