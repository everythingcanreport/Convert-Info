define(function() {
    return function(dataFilter) {
        var p = new Promise(function(resolve, reject) {
            $.ajax({
                type: 'POST',
                url: "http://aileephan.com:1337/stories/list",
                data: {
                    data: JSON.stringify(dataFilter)
                },
                success: function(response) {
                    resolve(response);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });
        return p;
    };
});