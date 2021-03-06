module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Stories)) {
        var dataStories = data.Stories;
        dataStories.ModifiedBy = userInfo.id;
        sequelize.transaction()
            .then(function(t) {
                return Stories.findOne({
                        attributes: ['ID'],
                        where: {
                            UID: dataStories.UID,
                            CreatedBy: userInfo.id
                        },
                        raw: true
                    }).then(function(stories) {
                        if (!_.isEmpty(stories)) {
                            var speakingUrl = SpeakingUrlService(dataStories.Title) +
                                '-' + HashIDService.Create(stories.ID);
                            dataStories.SpeakingUrl = speakingUrl;
                        }
                        return Stories.update(dataStories, {
                            where: {
                                UID: dataStories.UID
                            },
                            transaction: t,
                            individualHooks: true
                        });
                    }, function(err) {
                        defer.reject({
                            error: err,
                            transaction: t
                        });
                    })
                    .then(function(storiesUpdated) {
                        if (!_.isEmpty(storiesUpdated) &&
                            !_.isEmpty(data.FileUploads) &&
                            _.isArray(data.FileUploads)) {
                            var objRelStoriesFileUpload = {
                                storiesObject: storiesUpdated[1][0],
                                where: data.FileUploads,
                                transaction: t
                            };
                            return Services.RelStoriesFileUpload(objRelStoriesFileUpload);
                        }
                    }, function(err) {
                        defer.reject({
                            error: err,
                            transaction: t
                        });
                    })
                    .then(function(relStorieFileUploadCreated) {
                        defer.resolve({
                            status: 'success',
                            transaction: t
                        });
                    }, function(err) {
                        defer.reject({
                            error: err,
                            transaction: t
                        });
                    });
            }, function(err) {
                defer.reject({ error: err });
            });
    } else {
        defer.reject({ error: 'UpdateStories.data.not.exist' });
    }
    return defer.promise;
};
