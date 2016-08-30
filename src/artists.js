var artists = {
    findArtistsXml: function (term) {
        var mapper = function (artist) {
            var note = artist.disambiguation ? (' (' + artist.disambiguation + ')') : '';

            return {
                name: artist.name + note,
                id: artist.id
            };
        };
        return $.get('http://musicbrainz.org/ws/2/artist/?query=artist:' + term + '&fmt=json')
            .then(function (response) {
                return response.artists.map(mapper);
            });
    },

    findAlbumsXml: function (artistId) {
        var url = 'http://musicbrainz.org/ws/2/release-group/?query=arid:' + artistId + '%20AND%20primarytype:album%20AND%20type:album&fmt=json';
        return $.get(url)
            .then(function (response) {
                return _.chain(response['release-groups'])
                    .map(function (releaseGroup) {
                        return {
                            name: releaseGroup.title,
                            id: releaseGroup.id
                        };
                    })
                    .value();
            });
    },

    fintTracks: function (artistId, releaseGroupName) {
        var urlToFindReleases = 'http://musicbrainz.org/ws/2/release?query=aid=(' + artistId + ')%20release=(' + releaseGroupName + ')&limit=30&fmt=json';

        return $
            .get(urlToFindReleases)
            .then(function (response) {
                var firstRelease = _.chain(response.releases).filter(r => r.title == releaseGroupName).first().value();
                var urlToFindTracks = 'http://musicbrainz.org/ws/2/release/' + firstRelease.id + '/?inc=recordings&fmt=json';
                return $.get(urlToFindTracks)
            })
            .then(function (response) {
                return response.media[0].tracks.map(function (track) {
                    return {
                        name: track.title,
                        id: track.id
                    };
                });
            });
    }
};

