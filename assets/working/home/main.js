var accessToken = null;
define(function(require) {
    //facebook plugin
    var fbInit = require('fbPlugin/init');
    var login_event = require('fbPlugin/login_event');
    var logout_event = require('fbPlugin/logout_event');
    var status_change = require('fbPlugin/status_change');
    window.fbAsyncInit = function() {
        fbInit();
        FB.getLoginStatus(function(response) {
            if (typeof response === 'object' &&
                response.status === 'connected') {
                accessToken = response.authResponse.accessToken;
            } else {
                $('.menu-loader').removeClass('active');
                $('.unknown').removeClass('hide');
            }
        });
        FB.Event.subscribe('auth.login', login_event);
        FB.Event.subscribe('auth.logout', logout_event);
        FB.Event.subscribe('auth.statusChange', status_change);
    };
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/vi_VN/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    //end facebook plugin
    require(['/libs/moment-timezone/moment-timezone.js'], function(moment) {
        var dateWriteReview = moment().format('DD/MM/YYYY');
        var dateWriteResponse = $('.home-date-hidden').val();
        if (!_.isNull(dateWriteResponse) &&
            !_.isUndefined(dateWriteResponse)) {
            dateWriteReview = moment(dateWriteResponse, 'ddd MMM DD YYYY HH:mm:ss ZZ').format('DD/MM/YYYY');
        }
        $('.home-date').text('');
        $('.home-date').append(dateWriteReview);
    });
});

function writeStories() {
    require(['menu/menu'], function(menu) {
        menu.writeStories();
    });
};

function manageStories() {
    require(['menu/menu'], function(menu) {
        menu.manageStories();
    });
};

var rows = 5;
var count = $('.home-count').val();
var appending = false;
//load data when scroll last page
$(document).scroll(function() {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        if (rows < count && !appending) {
            appending = true;
            require(['common/listStories'], function(listStories) {
                var dataFilter = {
                    Limit: 5,
                    Offset: rows
                };
                $('.home-loader').addClass('active');
                listStories(dataFilter)
                    .then(function(response) {
                        $('.home-loader').removeClass('active');
                        renderData(response);
                    }, function(err) {
                        $('.home-loader').removeClass('active');
                    });
            });
        }
    }
});

//render data
function renderData(response) {
    if (!_.isEmpty(response) &&
        !_.isEmpty(response.rows)) {
        require(['/libs/moment-timezone/moment-timezone.js'], function(moment) {
            _.forEach(response.rows, function(stories, index) {
                var ribbon = '<a class="ui pink font-ribbon ribbon large label">Ngôn tình</a>';
                var homeDate = '<span class="float-right media-time font-ribbon home-date">' +
                    moment(stories.CreatedDate).format('DD/MM/YYYY') + '</span>';
                var uidBackground = (stories &&
                    stories.FileUploads &&
                    stories.FileUploads[0]) ? stories.FileUploads[0].UID : null;
                var imageBackground = uidBackground ? '<div class="ui small image">' +
                    '<a href="/truyen/' + stories.SpeakingUrl + '" class="ui image">' +
                    '<img class="height-image-home" src="/user/download-background/' +
                    uidBackground + '"/></a></div>' : '';
                var title = (!_.isEmpty(stories) &&
                        !_.isNull(stories.Title) &&
                        !_.isUndefined(stories.Title) &&
                        stories.Title.length !== 0) ? '<h1 class="ui pink header">' +
                    '<div class="content">' +
                    '<span class="font-header capitalize"><a href="/truyen/' + stories.SpeakingUrl +
                    '">' +
                    stories.Title +
                    '</a></span></div></h1>' : '';
                var content = ''
                var detail = '<div class="description"><p class="font-content">' +
                    stories.ShortContent +
                    '</p><a href="/truyen/' +
                    stories.SpeakingUrl +
                    '"class = "ui mini pink button font-brand">Chi tiết</a></div>';
                $('.home-main').append('<div class="ui segment">' +
                    ribbon + homeDate + '<div class="ui very relaxed items"><div class="item">' +
                    imageBackground + '<div class="content">' + title + detail +
                    '</div></div></div></div>');
            });
        });
        appending = false;
        rows += response.rows.length;
    }
};
