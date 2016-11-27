$(document).ready(function(){

    $('#link_refresh').on('click',function(){
        alert('Refresh RSS');
        refreshRSS();
    });

    $('#link_search').on('click', function(){
        $('#news_fresh').html('Gomb lenyomva');
    });

});



function refreshRSS() {
    $('#news_fresh').html('');
    $.post("http://p1race.hu/rss/rss.php",{}, function(rss) {
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

var permissions = cordova.plugins.permissions;
/*
permissions.hasPermission(permission, successCallback, errorCallback);
permissions.requestPermission(permission, successCallback, errorCallback);
permissions.requestPermissions(permissions, successCallback, errorCallback);
*/
alert( permissions );
