define(function() {
    return function(urlAvatar) {
        var p = new Promise(function(resolve, reject) {
            FB.api(urlAvatar, function(response) {
                if (typeof response === 'object' &&
                    !response.error &&
                    typeof response.data === 'object') {
                    //funcion setCookie
                    function setCookie(cname, cvalue, exdays) {
                        var d = new Date();
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        document.cookie = cname + "=" + cvalue + "; " + expires;
                    }
                    //set cookieAvatar
                    setCookie('cookieAvatar', JSON.stringify(response.data), 1);
                    //function get cookie
                    function getCookie(cname) {
                        var name = cname + "=";
                        var ca = document.cookie.split(';');
                        for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == ' ') {
                                c = c.substring(1);
                            }
                            if (c.indexOf(name) == 0) {
                                return c.substring(name.length, c.length);
                            }
                        }
                        return "";
                    };
                    alert('avartar', getCookie('cookieAvatar'));
                    $('.connected-avatar').attr('src', response.data.url);
                    resolve({ status: 'success' });
                } else {
                    reject({ status: 'error' });
                }
            });
        });
        return p;
    };
});
