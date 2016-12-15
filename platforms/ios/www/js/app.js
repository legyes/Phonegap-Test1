var cache_articles;
var cache_categories;

var promises = [];

try {
    var permissions = cordova.plugins.permissions;
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

}
catch (err) {
    //navigator.notification.alert(err);
    // pre Android 6.0 hack
}

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    try {
        navigator.app.overrideButton("menubutton", true); 
    }
    catch (err) {
        //alert( err );
    }
}

function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onPause() {
    //
}

function onResume() {
    //
}

function onMenuKeyDown() {
    //
}

function onBackKeyDown() {

    if( $('aside').is(':visible') ) {
        asideMenu('close');
    }
    else if ( $('#article').is(':visible') ) {
        $('#article').hide();
        $('#articles').show();
    }
    else if( $('#articles').is(':visible') ) {
        navigator.notification.confirm(
            'Szeretnél kilépni?',
            function(btnIndex){
                if( btnIndex ===1 ) navigator.app.exitApp();
                else return;
            },
            'Kilépés',
            'Igen,Nem'
        );


    }


}

function onRefreshKey() {
    $('aside').hide();
    $('#article').hide();
    $('#articles').show();
    $('html, body').animate({scrollTop: '0px'}, 20);
    refreshRSSOnline();
}

$(document).ready(function(){
    try {
        if( typeof window.localStorage === 'undefined' ) {
            navigator.notification.alert('localStorage nem elérhető :(');
        }

        //checkConnection();
        refreshRSS();
        refreshCategories();

        $('.refresh').on('click',function(){
            onRefreshKey();
        });

        $('#link_search').on('click', function(){
            $('#news_fresh').html('Gomb lenyomva');
        });

        // side menu
        $('#a_menu').on('click',function(){

            if ( $('aside').hasClass('closed') ) {
                asideMenu('open');
            }
            else {
                asideMenu('close');
            }

        });

    }
    catch(err) {
        navigator.notification.alert('document ready' + err);
    }

});

function checkConnection() {
    try {
        $('#indicator_net').html('<i class="fa fa-wifi"></i> ' + networkState);
    }    
    catch(err) {
        navigator.notification.alert(err);
    }
}

function refreshRSS() {
    asideMenu('close');

    $('#dark').show();

    try {
        if ( 
                typeof window.localStorage !== 'undefined' && 
                window.localStorage.getItem('articles')  !== null &&
                window.localStorage.getItem('articles') !== ''
        ) {
            try {
                local_cache = window.localStorage.getItem('articles');
            }
            catch(err) {
                navigator.notification.alert('local cache read error');
            }
            try {
                articles = JSON.parse( local_cache );
            }
            catch(err) {
                navigator.notification.alert('JSON parse error')
            }

            $('#news_fresh').html('');

            $('#aside_image').html('<img src="http://www.p1race.hu/data/images/news/24454_w380px_4790ee6f46b0f1da882d5a988734fcb1.jpg" alt="" style="width: 100%;" />');

            $.when(
                $.each(articles, function(i, article){

                    icon_seen = ( getRead(article.ID ) ) ? '&nbsp;<i class="fa fa-check-circle-o"></i>' : '';

                    $('#news_fresh').append(
                        '<article style="background-color: #ffffff; border-radius: 4px; padding: 1px 10px 5px; margin: 25px 0px; box-shadow: 0px 0px 20px grey;" data-id="'+ article.ID +'" data-target="http://www.p1race.hu/hir/'+ article.Slug +'">' +
                            '<div style="position: relative;"><h3>'+ article.Title +'</h3><div style="position: absolute; top: -15px; right: -5px; color: silver;">'+ icon_seen +'</div></div>' +
                            '<div style="position: relative; margin: 10px -10px; min-height: 100px;">' +
                                '<img id="image_'+ article.ID +'" src="http://www.p1race.hu/'+ article.Image +'" style="width: 100%;" />' +
                                '<div style="position: absolute; top: 20px; left: 0px; background-color: #94D34A; color: #ffffff; padding: 5px; font-weight: bold; text-shadow: 1px 1px 2px black;">'+ article.CategoryName +'</div>' +
                            '</div>' +
                            '<div class="text-left" style="font-size: 1.2em;">'+ article.Article +'</div>' +
                            '<div class="row" style="color: #aaaaaa; padding: 5px 0px;">'+ 
                                '<div class="col-xs-5"><i class="fa fa-pencil"></i> ' + article.Creator + '</div>' +
                                '<div class="col-xs-4 text-center"><i class="fa fa-calendar"></i> ' + article.TimeAgo + '</div>' +
                                '<div class="col-xs-3 text-right"><i class="fa fa-comments"></i> ' + article.CommentCount + '</div>' +
                            '</div>' +
                        '</article>');
                    })
            ).done(function(){
                $('#dark').hide();
                //window.scrollBy(0,100);
                //refreshRSSOnline();
                $('#articles article').off('click').on('click',function() {
                    //window.open( $(this).data('target'), '_system');
                    getArticle( $(this).data('id') );
                });
            });
        }
        else {
            refreshRSSOnline();
        }

    }
    catch (err) {
        navigator.notification.alert('refreshRSS' + err);
    }

 }

function refreshRSSOnline() {
    asideMenu('close');
    $('#dark').show();
    try {
        $.post("http://www.p1race.hu/api/articles/",{}, function(data) {
            $('#news_fresh').html('');
            cache_articles = data.articles;

            //navigator.notification.alert( cache_articles.length + 'db letöltve');

            $('#aside_image').html('<img src="http://www.p1race.hu/data/images/news/24454_w380px_4790ee6f46b0f1da882d5a988734fcb1.jpg" alt="" style="width: 100%;" />');

            $(data.articles).each(function(i, article){

                window.localStorage.setItem('article_'+article.ID, JSON.stringify(article));
                icon_seen = ( getRead(article.ID ) ) ? '&nbsp;<i class="fa fa-check-circle-o"></i>' : '';

                $('#news_fresh').append(
                    '<article style="background-color: #ffffff; border-radius: 4px; padding: 1px 10px 5px; margin: 25px 0px; box-shadow: 0px 0px 20px grey;" data-id="'+ article.ID +'" data-target="http://www.p1race.hu/hir/'+ article.Slug +'">' +
                        '<div style="position: relative;"><h3>'+ article.Title +'</h3><div style="position: absolute; top: -15px; right: -5px; color: silver;">'+ icon_seen +'</div></div>' +
                        '<div style="position: relative; margin: 10px -10px; min-height: 100px;">' +
                            '<img id="image_'+ article.ID +'" src="http://www.p1race.hu/'+ article.Image +'" style="width: 100%;" />' +
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
            $('#dark').hide();
            //window.scrollBy(0,100);
            window.localStorage.setItem('articles', JSON.stringify(cache_articles));


            $('#articles article').off('click').on('click',function() {
                //window.open( $(this).data('target'), '_system');
                getArticle( $(this).data('id') );
            });
        }).fail(function(){
            //window.scrollBy(0,100);
            navigator.notification.alert('Nincs kapcsolat :(');
        });
    }
    catch(err) {
        navigator.notification.alert('refreshRSSOnline' + err);
    }
}

function getArticle( article_id ) {

    setRead( article_id );

    $('#dark').show();
    $.post('http://www.p1race.hu/api/articles/article.php',{ id : article_id }, function(data){
        if ( typeof data !== 'undefined' && typeof data.article !== 'undefined' && data.article !== false && data.article !== null ) {

            article = data.article;

            window.localStorage.setItem('article_full_'+article.ID, JSON.stringify(article));
            $('#article').html(
                '<article style="background-color: #ffffff; border-radius: 4px; padding: 1px 10px 5px; margin: 25px 0px; box-shadow: 0px 0px 20px grey;" data-id="'+ article.ID +'" data-target="http://www.p1race.hu/hir/'+ article.Slug +'">' +
                    '<div><h3>'+ article.Title + '</h3></div>' +
                    '<div style="position: relative; margin: 10px -10px; min-height: 100px;">' +
                        '<img id="image_'+ article.ID +'" src="http://www.p1race.hu/'+ article.Image +'" style="width: 100%;" />' +
                        '<div style="position: absolute; top: 20px; left: 0px; background-color: #94D34A; color: #ffffff; padding: 5px; font-weight: bold; text-shadow: 1px 1px 2px black;">'+ article.CategoryName +'</div>' +
                    '</div>' +
                    '<div class="text-left" style="font-size: 1.2em;">'+ article.Article +'</div>' +
                    '<div class="row" style="color: #aaaaaa; padding: 5px 0px;">'+ 
                        '<div class="col-xs-5"><i class="fa fa-pencil"></i> ' + article.Creator + '</div>' +
                        '<div class="col-xs-4 text-center"><i class="fa fa-calendar"></i> ' + article.TimeAgo + '</div>' +
                        '<div class="col-xs-3 text-right"><i class="fa fa-comments"></i> ' + article.CommentCount + '</div>' +
                    '</div>' +
                '</article>');

            $('#article iframe').css('width','100%').removeAttr('height','');            

            if ( typeof article.comments !== 'undefined' && article.comments !== false && article.comments !== false && article.comments.length ) {
                $.each( article.comments, function(ic, comment){
                    $('#article').append(
                        '<div style="margin: 0px 5px; padding: 5px;">' +
                            '<div><img src="http://www.p1race.hu/'+ comment.Avatar +'" />&nbsp;&nbsp;<b style="font-size: 140%;">'+ comment.NickName +'</b></div>' +
                            '<div>'+ comment.Comment +'</div>' +
                        '</div>'
                    );
                });
            }
        }
    },'json').done(function(){
        $('html, body').animate({scrollTop: '0px'}, 30);
        $('#dark').hide();
        $('#articles').hide();
        $('#article').show();
    }).fail(function(){
        $('#dark').hide();
        navigator.notification.alert("Betöltési hiba :(");
    });
}

function refreshCategories() {
    try {
        $.post('http://www.p1race.hu/api/categories',{},function(data){
            cache_categories = data.categories;
        },'json');

    }
    catch(err) {
        navigator.notification.alert('refreshCategories' + err);
    }

}

function asideMenu( f ) {
    if ( typeof f === 'undefined' ) f = 'toggle';

    if ( f === 'close' ) {
        $('aside').css('width','0px').hide().addClass('closed').removeClass('open');
    }

    else if ( f === 'open' ) {
        $('aside').css('width','300px').show().addClass('open').removeClass('closed');
    }
    
    else if ( f === 'toggle' ) {
        if ( $('aside').hasClass('closed') ) {
            asideMenu('open');
        }
        else {
            asideMenu('close');
        }
    }
    
}

function setRead( article_id ) {
    read_jsonstring = window.localStorage.getItem('read');

    if ( typeof article_id !== 'undefined' ) {

        if ( read_jsonstring !== null ) {

            r = JSON.parse(read_jsonstring);

            var article_found = false;
            $.each( r, function(i, aid) {
                if ( parseInt(article_id,10) === parseInt(aid,10)) article_found = true;
            });

            if ( article_found === false ) r.push( article_id );
            window.localStorage.setItem('read', JSON.stringify(r))
        }
        else {
            window.localStorage.setItem('read', JSON.stringify([article_id]));
        }
    }
}

function getRead( article_id ) {

    read_jsonstring = window.localStorage.getItem('read');
    if ( typeof article_id !== 'undefined' ) {

        if ( read_jsonstring !== null ) {

            r = JSON.parse(read_jsonstring);

            var article_found = false;
            $.each( r, function(i, aid) {
                if ( parseInt(article_id,10) === parseInt(aid,10)) article_found = true;
            });

            return article_found;
        }
        else return false;
    }
    else {
        return false;
    }
}


/*
permissions.hasPermission(permission, successCallback, errorCallback);
permissions.requestPermission(permission, successCallback, errorCallback);
permissions.requestPermissions(permissions, successCallback, errorCallback);
*/


// confirm teszt
/*
navigator.notification.confirm(
    networkState + ' kapcsolat. Frissíted a híreket?', // message
     onConfirm,            // callback to invoke with index of button pressed
    'Figylem!',           // title
    ['Igen','Nem']     // buttonLabels
);

function onConfirm(buttonIndex) {
    if ( buttonIndex === 1 ) {
         refreshRSS();
    }
}


*/
