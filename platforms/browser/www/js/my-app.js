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
    $.post("http://www.p1race.hu/api/articles/",{}, function(articles) {
        $(articles).each(function(i, article){
            $('#news_fresh').append(
                '<article style="background-color: #ffffff; border-radius: 4px; padding: 1px 10px 5px; margin: 25px 0px; box-shadow: 0px 0px 20px grey;" data-target="http://www.p1race.hu/hir/'+ article.Slug +'">' +
                    '<div><h3>'+ article.Title +'</h3></div>' +
                    '<div style="position: relative; margin: 10px -10px;">' +
                        '<img src="http://www.p1race.hu/'+ article.Image +'" style="width: 100%;" />' +
                        '<div style="position: absolute; top: 20px; left: 0px; background-color: #94D34A; color: #ffffff; padding: 5px; font-weight: bold; text-shadow: 1px 1px 2px black;">'+ article.CategoryName +'</div>' +
                    '</div>' +
                    '<div class="text-left" style="font-size: 1.2em;">'+ article.Article +'</div>' +
                    '<div class="row" style="color: #aaaaaa; padding: 5px 0px;">'+ 
                        '<div class="col-xs-5"><i class="fa fa-pencil"></i> ' + article.Creator + '</div>' +
                        '<div class="col-xs-4 text-center"><i class="fa fa-calendar"></i> ' + article.TimeAgo + '</div>' +
                        '<div class="col-xs-3 text-right"><i class="fa fa-comments"></i> ' + article.CommentCount + '</div>' +
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
