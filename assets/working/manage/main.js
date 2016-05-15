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
                response.status !== 'connected') {
                $('.loader').removeClass('active');
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
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    //end facebook plugin

});

//menu write stories
function writeStories() {
    require(['menu/menu'], function(menu) {
        menu.writeStories();
    });
};
//end

//menu manage stories
function manageStories() {
    require(['menu/menu'], function(menu) {
        menu.manageStories();
    });
};
//end

//load list stories
function loadList(limit, offset) {
    var filterTitle = $('.filter-title').val();
    if (_.isNull(filterTitle) ||
        _.isUndefined(filterTitle) ||
        filterTitle.length === 0) {
        filterTitle = null;
    }
    var filterShow = $('input[name=manage_show]:checked').val();
    var filterHide = $('input[name=manage_hide]:checked').val();
    var filterShowHide = null;
    if ((filterShow === '' ||
            _.isNull(filterShow) ||
            _.isUndefined(filterShow)) &&
        filterHide === 'Y') {
        filterShowHide = {
            $ne: 'Y'
        };
    } else if (filterShow === 'Y' &&
        (filterHide === '' ||
            _.isNull(filterHide) ||
            _.isUndefined(filterHide))) {
        filterShowHide = 'Y'
    } else if ((filterHide === '' ||
            _.isNull(filterHide) ||
            _.isUndefined(filterHide)) &&
        (filterShow === '' ||
            _.isNull(filterShow) ||
            _.isUndefined(filterShow))) {
        filterShowHide = 'N/A';
    }
    var data = {
        Filter: [{
            Stories: {
                Show: filterShowHide
            }
        }],
        Search: [{
            Stories: {
                Title: filterTitle
            }
        }],
        Limit: limit || 5,
        Offset: offset || 0
    };
    $.ajax({
        type: 'POST',
        url: 'http://localhost:1337/admin/manage/list',
        data: {
            data: JSON.stringify(data)
        },
        success: function(response) {
            renderData(limit, offset, response);
        },
        error: function(err) {
            var notyUploadBackground = noty({
                text: 'Load list failed!',
                layout: 'topRight',
                type: 'error',
                timeout: 3000
            });
        }
    });
};
//end

//renderData
function renderData(limit, offset, response) {
    //append and set value filter
    $('tbody').text('');
    if (!_.isEmpty(response) &&
        response.count !== 0 &&
        !_.isEmpty(response.rows)) {
        //rerender data manage
        _.forEach(response.rows, function(stories, index) {
            var no = '<td>' + (index + 1 + (offset ? offset : 0)) + '</td>';
            var title = '<td colspan="2"><h4 class="ui header">' +
                '<div class="content">' + stories.Title + '</div></h4></td>';
            var show = stories.Show === 'Y' ? '<td class="center aligned">' +
                '<div class="ui fitted slider checkbox">' +
                '<input type="checkbox" name="change-status-' + stories.UID +
                '" onChange="onChangeShow(\'' + stories.UID + '\');"  checked="true"/>' +
                '<label></label></div></td>' : '<td class="center aligned">' +
                '<div class="ui fitted slider checkbox">' +
                '<input type="checkbox" name="change-status-' + stories.UID +
                '" onChange="onChangeShow(\'' + stories.UID + '\');"/>' +
                '<label></label></div></td>';
            var action = '<td><div class="ui buttons tiny icon">' +
                '<a class="ui grey button" onClick="onClickView(\'' + stories.UID + '\');">' +
                '<i class="icon search"></i>View</a>' +
                '<div class="or"></div>' +
                '<a class="ui pink button" onClick="onClickEdit(\'' + stories.UID + '\');">' +
                '<i class="icon write"></i>Edit</a></div></td>';
            $('tbody').append('<tr>' + no + title + show + action + '</tr>');
            $('.manage-pagination').removeClass('hide');
        });
        //rerender pagination
        $('.manage-pagination-main').text('');
        $('.manage-pagination-main').append('<a class="icon item" onClick="paginationManage(1);"><i class="left chevron icon"></i></a>');
        var page = (offset ? (offset / 5) + 1 : 1)
        for (var i = 1; i <= Math.ceil(response.count / 5); i++) {
            $('.manage-pagination-main').append('<a class="item manage-pagination-' + (i == page ? ' active' : '') + '" onClick="paginationManage(' + i + ');">' + i + '</a>');
        }
        $('.manage-pagination-main').append('<a class="icon item" onClick="paginationManage(' + (Math.ceil(response.count / 5)) + ');"><i class="right chevron icon"></i></a>');
        $('.manage-pagination-main').removeClass('hide');
    } else {
        $('.manage-pagination-main').addClass('hide');
    }
    //set total for pagination
    $('.manage-total').text('Total: ' + response.count + ' records');
};
//end
//pagination
function paginationManage(page) {
    var offset = (page - 1) * 5;
    loadList(5, offset);
};
//end

//edit stories
function onClickEdit(uid) {
    require(['menu/menu'], function(menu) {
        menu.writeStories(uid);
    });
};
//end

//view stories
function onClickView(uid) {
    require(['common/manageViewStories'], function(manageViewStories) {
        manageViewStories(uid)
            .then(function(stories) {
                if (!_.isEmpty(stories)) {
                    require(['/libs/moment-timezone/moment-timezone.js'], function(moment) {
                        //set data before show modal review
                        var htmlContent = stories.Content;
                        var title = stories.Title;
                        $('.review-description').append(htmlContent);
                        $('.review-title').text(title);
                        var backgroundUID = (stories && stories.FileUploads && stories.FileUploads[0] ? stories.FileUploads[0].UID : null);
                        $('.review-background').attr('src', '/user/download-backround/' + backgroundUID);
                        var dateWriteReview = moment().format('DD/MM/YYYY');
                        if (!_.isNull(stories.CreatedDate) &&
                            !_.isUndefined(stories.CreatedDate)) {
                            dateWriteReview = moment(stories.CreatedDate).format('DD/MM/YYYY');
                        }
                        $('.review-date').text('');
                        $('.review-date').append('<i class="time pink icon"></i>');
                        $('.review-date').append(dateWriteReview);
                        $('.long.modal').modal('show');
                    });
                } else {
                    noty({
                        text: 'View stories failed!',
                        layout: 'topRight',
                        type: 'error',
                        timeout: 3000
                    });
                }
            }, function(err) {
                noty({
                    text: 'View stories failed!',
                    layout: 'topRight',
                    type: 'error',
                    timeout: 3000
                });
            });
    });
};
//end

//keypress search
function onKeypressSearch(e) {
    if (!_.isEmpty(e) &&
        e.keyCode === 13) {
        loadList();
    }
};

//onChangeShow stories
function onChangeShow(uid) {
    $('.confirm-change-status').val(uid);
    $('.small.modal.change-status').modal('show');
};
//end

//confirm change status no
function onClickChangeStatusNo() {
    var uid = $('.confirm-change-status').val();
    var showUpdate = $('input[name=change-status-' + uid + ']:checked').val();
    if (_.isNull(showUpdate) ||
        _.isUndefined(showUpdate) ||
        showUpdate.length === 0) {
        showUpdate = "N";
    }
    //rollback checkbox status
    if (showUpdate === 'N') {
        $('input[name=change-status-' + uid + ']').prop('checked', true);
    } else {
        $('input[name=change-status-' + uid + ']').removeAttr('checked');
    }
    $('.small.modal.change-status').modal('hide');
};
//end

//confirm change status yes
function onClickChangeStatusYes() {
    var uid = $('.confirm-change-status').val();
    if (!_.isNull(uid) &&
        !_.isUndefined(uid) &&
        uid.length !== 0) {
        var showUpdate = $('input[name=change-status-' + uid + ']:checked').val();
        if (_.isNull(showUpdate) ||
            _.isUndefined(showUpdate) ||
            showUpdate.length === 0) {
            showUpdate = "N";
        } else {
            showUpdate = "Y";
        }
        require(['common/updateStatus'], function(updateStatus) {
            var dataUpdateStatus = {
                data: {
                    Show: showUpdate,
                    UID: uid
                }
            };
            updateStatus(dataUpdateStatus)
                .then(function(response) {
                    $('.small.modal.change-status').modal('hide');
                    noty({
                        text: 'Update status stories success!',
                        layout: 'topRight',
                        type: 'success',
                        timeout: 3000
                    });
                }, function(err) {
                    //rollback checkbox status
                    if (showUpdate === 'N') {
                        $('input[name=change-status-' + uid + ']').prop('checked', true);
                    } else {
                        $('input[name=change-status-' + uid + ']').removeAttr('checked');
                    }
                    $('.small.modal.change-status').modal('hide');
                    noty({
                        text: 'Update status stories failed!',
                        layout: 'topRight',
                        type: 'error',
                        timeout: 3000
                    });
                });
        });
    } else {
        noty({
            text: 'Update status stories failed!',
            layout: 'topRight',
            type: 'error',
            timeout: 3000
        });
    }
};
//end