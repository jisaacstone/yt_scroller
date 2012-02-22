$(function() {
    $('.hover').css('visibility','hidden');
    $('.hover').parent().hover(function(){
        $(this).children('.hover').css('visibility', 'visible');
        }, function(){
        $(this).children('.hover').css('visibility', 'hidden');
    });
});
