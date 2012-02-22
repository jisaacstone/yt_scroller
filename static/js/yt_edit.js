$(function(){
    $('.ts-edit').click(function(){
        if($(this).children('.edbox').is(':hidden')){
            $(this).children('.edbox').css('display','block');
        }
    });
    $('.edbox .submit').click(function(e){
        e.stopPropagation();
        $.ajax({
            type: 'POST',
            url: $(this).parents('.ts-edit').data('url'),
            data: {time: $(this).siblings('input').val()}
        });    

    });    
    $('.edbox .close').click(function(e){
        e.stopPropagation();
        $(this).parents('.edbox').css('display','none');
    });    
});
