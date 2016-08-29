var lastfm = {

    findArtists: function (term) {
        var method = 'artist.search';
        var url = 'http://ws.audioscrobbler.com/2.0/?api_key=185032d80f1827034396b9acfab5a79f&format=json';
        this.log(method, "'"+term+"'");

        return $.get(url, {method, artist: term})
            .then(response => response.results.artistmatches.artist.map(this.mapItem))
            .then(artists => this.validateItems(artists, 'artists'));
    },

    findAlbums: function (artistName) {
        var method = 'artist.getTopAlbums';
        var url = 'http://ws.audioscrobbler.com/2.0/?api_key=185032d80f1827034396b9acfab5a79f&format=json';

        this.log(method, `'${artistName}'`);

        return $
            .get(url, {method, artist: artistName})
            .then(response => response.topalbums.album.map(this.mapItem))
            .then(albums => this.validateItems(albums, 'albums'));
    },

    findTracks: function (artistName, album) {
        var albumName = album.name;

        var method = 'album.getInfo';
        this.log(method, `'${artistName}', '${albumName}'`);

        return $
            .get(this.url, {method, artist: artistName, album: albumName})
            .then(response => response.album.tracks.track.map(this.mapTrack))
            .then(tracks => this.validateItems(tracks, 'tracks'));
    },

    mapItem: function (item) {
        return {
            name: item.name,
            id: item.mbid,
            image: item.image[1]['#text'] //small image
        };
    },

    mapTrack: function (item) {
        return {
            name: item.name,
            id: item.url
        };
    },

    validateItems: function (items, setName) {
        var itemsWithId = items.filter(a => a.id);

        if (itemsWithId < items.length) {
            console.log(`ignoring ${items.length - itemsWithId} ${setName} with no id`);
        }

        var duplicated = this.getDuplicated(itemsWithId, 'id');
        if (duplicated) {
            logger.warn(`Found duplicated ${setName}\r\n` + duplicated);
            logger.warn('Taking the first artist by id');
            itemsWithId = this.filterOutDuplicatedBy(itemsWithId, 'id')
        }
        return itemsWithId;
    },

    getDuplicated: function (items, targetPropertyName) {
        return _
            .chain(items)
            .groupBy(item => item[targetPropertyName])
            .toPairs()
            .filter(pair => pair[1].length > 1)
            .map(pair => pair[0] + ' : [' + pair[1].map(i => i.name).join(', ') + ']')
            .join('\r\n')
            .value();
    },

    filterOutDuplicatedBy: function (items, propertyName) {
        return _
            .chain(items)
            .groupBy(item => item[propertyName])
            .toPairs()
            .map(pair => pair[1][0])
            .value();
    },

    log: function (methodName, params) {
        console.log(`http request to lastfm. ${methodName}(${params})`)
    },

    get: function () {
        return 'http://ws.audioscrobbler.com/2.0/?api_key=185032d80f1827034396b9acfab5a79f&format=json';
    }
};

