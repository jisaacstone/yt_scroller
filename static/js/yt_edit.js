$(function(){
    $('.ts-edit').click(function(){
        if($(this).children('.edbox').is(':hidden')){
            $(this).children('.edbox').css('display','block');
        }
    });
    $('.edbox .submit').click(function(e){
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
});
