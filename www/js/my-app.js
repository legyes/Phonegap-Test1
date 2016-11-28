$(document).ready(function(){
    refreshRSS();

    $('#link_refresh').on('click',function(){
        refreshRSS();
    });

    $('#link_search').on('click', function(){
        $('#news_fresh').html('Gomb lenyomva');
    });

});



function refreshRSS() {
    $('#news_fresh').html('');
    $.post("http://www.p1race.hu/rss/rss.json.php",{}, function(rss) {
        $(rss.JSONData.items).each(function(i, item){
            $('#news_fresh').append(
                '<article style="background-color: #ffffff; border-radius: 4px; padding: 1px 10px 5px; margin: 25px 0px; box-shadow: 0px 0px 20px grey;" data-target="http://www.p1race.hu/hir/'+ item.news_slug +'">' +
                    '<div><h3>'+ item.news_title +'</h3></div>' +
                    '<div style="position: relative; margin: 10px -10px;">' +
                        '<img src="http://www.p1race.hu/'+ item.news_image_url_432px +'" style="width: 100%;" />' +
                        '<div style="position: absolute; top: 20px; left: 0px; background-color: #94D34A; color: #ffffff; padding: 5px; font-weight: bold; text-shadow: 1px 1px 2px black;">'+ item.category_name +'</div>' +
                    '</div>' +
                    '<div class="text-left" style="font-size: 1.2em;">'+ item.news_short_text +'</div>' +
                    '<div class="row" style="color: #aaaaaa;">'+ 
                        '<div class="col-xs-6">' + item.user_displayname + '</div>' +
                        '<div class="col-xs-6 text-right">' + item.timeago + '</div>' +
                    '</div>' +
                '</article>');
            });
    },'json').done(function(){
        $('article').off('click').on('click',function() {
            window.open( $(this).data('target'), '_system');
        });
    });

}

var permissions = cordova.plugins.permissions;
/*
permissions.hasPermission(permission, successCallback, errorCallback);
permissions.requestPermission(permission, successCallback, errorCallback);
permissions.requestPermissions(permissions, successCallback, errorCallback);
*/
