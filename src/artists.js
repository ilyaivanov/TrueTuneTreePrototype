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
    }
};

