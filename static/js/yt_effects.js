$(function() {
    $('.timestop').css('visibility','hidden');
    $('.timestop').parent().hover(function(){
        $(this).children('.timestop').css('visibility', 'visible');
        }, function(){
        $(this).children('.timestop').css('visibility', 'hidden');
    });
});
