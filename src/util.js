function createNode(root, $parent_node, new_node_id, new_node_text, icon, noChildren) {
    root.jstree('create_node', $parent_node, {
        "text": new_node_text,
        "id": new_node_id,
        'icon': icon + '.png',
        'state': 'closed',
        'data':{id: new_node_id},
        'children': noChildren ? undefined : [{ text: 'Loading...', state: "disabled" }],
    }, 'last', false, false);
    if ($parent_node) {
        root.jstree('open_node', $parent_node)
    }
}

function isAlbum(node) {
    return node.icon == 'album.png';
}

function isArtist(node) {
    return node.icon == 'artist.png';
}

function isTrack(node) {
    return node.icon == 'song.png';
}

function loadTracksOrAlbums(root, callback) {
    root.on('before_open.jstree', function (e, data) {
        if (isAlbum(data.node)) {
            artists.fintTracks(data.node.parent, data.node.text)
                .then(albums => mapTracks(root, albums, data.node))
                .then(callback);
        } else if (isArtist(data.node)) {
            artists.findAlbumsXml(data.node.data.id)
                .then(albums => mapAlbums(root, albums, data.node))
                .then(callback);
        }
    });
}


function mapAlbums(root, albums, parent) {
    clearNode(root, $("#" + parent.id));
    _.each(albums, album => createNode(root, $("#" + parent.id), album.id, album.name, "album"));
}

function mapTracks(root, tracks, parent) {
    clearNode(root, $("#" + parent.id));
    _.each(tracks, track => createNode(root, $("#" + parent.id), track.id, track.name, "song", true));
}

function clearNode(root, node) {
    var nodes = root.jstree('get_children_dom', node);
    for (var i = 0; i < nodes.length; i++) {
        root.jstree('delete_node', nodes[i]);
    }
}