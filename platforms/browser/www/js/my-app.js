$(document).ready(function(){

    $('#link_refresh').on('click',function(){
        alert('Refresh RSS');
        refreshRSS();
    });

});

function refreshRSS() {
    $('#news_fresh').html('');
    $.post("http://www.p1race.hu/rss/rss.php",{}, function(rss) {
        alert( rss );
        $(rss).find('item').each(function(i, item){
            $('#news_fresh').append(
                '<div>' +
                    '<div><b>'+ $(item).find('title').text() +'</b></div>' +
                    '<div>'+ $(item).find('description').text() +'</div>' +
                '</div>');
            });

    },'xml');

}
