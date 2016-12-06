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

    try {
        navigator.app.overrideButton("menubutton", true);
        document.addEventListener("menubutton", onMenuKeyDown, false);
    }
    catch (err) {
        navigator.notification.alert( err );
    }


    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
}
 
function onPause() {
    navigator.notification.alert('pause');
    // Handle the pause event
}

function onResume() {
    navigator.notification.alert('resume');
    // Handle the resume event
}

function onMenuKeyDown() {
    navigator.notification.alert('menu');
    // Handle the menubutton event
}

function onBackKeyDown() {
    navigator.notification.alert('back');
    // Handle the menubutton event
}

$(document).ready(function(){
    try {
        //$('#refresh').show();
        
        /*
        $(document).on('scroll',function(){
            if( window.pageYOffset == 0 ) {
                refreshRSSOnline();
            }
        });
        */
        if( typeof window.localStorage === 'undefined' ) {
            navigator.notification.alert('localStorage nem elérhető :(');
        }

        //checkConnection();
        refreshRSS();
        refreshCategories();

        $('.refresh').on('click',function(){
            refreshRSSOnline();
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

                $('#news_fresh').append(
                    '<article style="background-color: #ffffff; border-radius: 4px; padding: 1px 10px 5px; margin: 25px 0px; box-shadow: 0px 0px 20px grey;" data-target="http://www.p1race.hu/hir/'+ article.Slug +'">' +
                        '<div><h3>'+ article.Title +'</h3></div>' +
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
                //window.scrollBy(0,100);
                //refreshRSSOnline();
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
    try {
        $.post("http://www.p1race.hu/api/articles/",{}, function(data) {
            $('#news_fresh').html('');
            cache_articles = data.articles;

            //navigator.notification.alert( cache_articles.length + 'db letöltve');

            $('#aside_image').html('<img src="http://www.p1race.hu/data/images/news/24454_w380px_4790ee6f46b0f1da882d5a988734fcb1.jpg" alt="" style="width: 100%;" />');

            $(data.articles).each(function(i, article){

                window.localStorage.setItem('article_'+article.ID, JSON.stringify(article));

                $('#news_fresh').append(
                    '<article style="background-color: #ffffff; border-radius: 4px; padding: 1px 10px 5px; margin: 25px 0px; box-shadow: 0px 0px 20px grey;" data-target="http://www.p1race.hu/hir/'+ article.Slug +'">' +
                        '<div><h3>'+ article.Title +'</h3></div>' +
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
            //window.scrollBy(0,100);
            window.localStorage.setItem('articles', JSON.stringify(cache_articles));


            $('article').off('click').on('click',function() {
                window.open( $(this).data('target'), '_system');
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
