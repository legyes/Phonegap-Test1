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
    //alert(err);
    // pre Android 6.0 hack
}

$(document).ready(function(){
    try {
        $('#refresh').show();
        
        $(document).on('scroll',function(){
            if( window.pageYOffset == 0 ) {
                refreshRSSOnline();
                alert("Frissítés");
            }
        });
        
        if( typeof window.localStorage === 'undefined' ) {
            alert('localStorage nem elérhető :(');
        }

        //checkConnection();
        refreshRSS();
        refreshCategories();

        $('#link_refresh').on('click',function(){
            refreshRSS();
        });

        $('#link_search').on('click', function(){
            $('#news_fresh').html('Gomb lenyomva');
        });

        // side menu
        $('#a_menu').on('click',function(){

            if ( $('aside').hasClass('closed') ) {
                $('aside').animate({
                    width: '300px'
                }).addClass('open').removeClass('closed');
            }
            else {
                $('aside').animate({
                    width: '0px'
                }).addClass('closed').removeClass('open');
            }

        });

    }
    catch(err) {
        alert('document ready' + err);
    }

});

function checkConnection() {
    try {
        $('#indicator_net').html('<i class="fa fa-wifi"></i> ' + networkState);
    }    
    catch(err) {
        alert(err);
    }
}

function refreshRSS() {
    try {
        if ( 
                typeof window.localStorage !== 'undefined' && 
                typeof window.localStorage !== null && 
                typeof window.localStorage.getItem('articles' !== null) 
        ) {
           
            try {
                local_cache = window.localStorage.getItem('articles');
            }
            catch(err) {
                alert('local cache read error');
            }
            try {
                articles = JSON.parse( local_cache );
            }
            catch(err) {
                alert('JSON parse error')
            }

            $('#news_fresh').html('');
            $.when(
                $.each(articles, function(i, article){

                if (i <2) {
                    alert(article.Title);
                }

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
                window.scrollBy(0,100);
                //refreshRSSOnline();
            });
        }
        else {
                    alert(7);

            refreshRSSOnline();
        }

    }
    catch (err) {
        alert('refreshRSS' + err);
    }

 }

function refreshRSSOnline() {
    try {
        $.post("http://www.p1race.hu/api/articles/",{}, function(data) {
            $('#news_fresh').html('');
            cache_articles = data.articles;

            alert( cache_articles.length + 'db letöltve');

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
            window.scrollBy(0,100);
            window.localStorage.setItem('articles', JSON.stringify(cache_articles));


            $('article').off('click').on('click',function() {
                window.open( $(this).data('target'), '_system');
            });
        }).fail(function(){
            window.scrollBy(0,100);
            alert('Nincs kapcsolat :(');
        });
    }
    catch(err) {
        alert('refreshRSSOnline' + err);
    }
}

function refreshCategories() {
    try {
        c = $('#aside_menu');
        c.html('<div class="col-md-12 text-center"><select id="select_category" class="form-control"></select></div>');

        s = c.find('select');

        $.post('http://www.p1race.hu/api/categories',{},function(data){
            cache_categories = data.categories;
            $(data.categories).each(function(i, category){

                s.append('<option value="'+ category.ID +'">'+ category.Name +'</option>');

            });

            c.off('change').on('change', function(){
                $('#modal_menu').modal('hide');
            });

        },'json');

    }
    catch(err) {
        alert('refreshCategories' + err);
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
