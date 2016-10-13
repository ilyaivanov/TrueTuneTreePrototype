var app = {
    init: function (root, searchInput) {
        function isAlbum(node) {
            return node.icon == 'album.png';
        }

        function isTrack(node) {
            return node.icon == 'song.png';
        }

        function init() {
            root.jstree({
                'core': {
                    'check_callback': true,
                },
                "plugins": ["wholerow", 'dnd']
            });

            root.on('before_open.jstree', function (e, data) {
                if (isAlbum(data.node)) {
                    artists.fintTracks(data.node.parent, data.node.text)
                        .then(albums => mapTracks(albums, data.node));
                } else {
                    artists.findAlbumsXml(data.node.id)
                        .then(albums => mapAlbums(albums, data.node));
                }
            });

            root.on('select_node.jstree', function (e, data) {
                if (isTrack(data.node)) {
                    console.log(data.node) //play here
                }
            });
        }

        init();


        searchInput.keyup(_.debounce(function () {
            clearNode($("#searchNode"));
            root.jstree("destroy");
            init();
            artists.findArtistsXml(searchInput.val())
                .then(a => mapArtists(a))

        }, 250));

        function mapAlbums(albums, parent) {
            clearNode($("#" + parent.id));
            _.each(albums, album => createNode($("#" + parent.id), album.id, album.name, "album"));
        }

        function mapTracks(tracks, parent) {
            clearNode($("#" + parent.id));
            _.each(tracks, track => createNode($("#" + parent.id), track.id, track.name, "song", true));
        }

        function mapArtists(artists) {
            _.each(artists, a => createNode(null, a.id, a.name, "artist"));
        }

        function clearNode(node) {
            var nodes = root.jstree('get_children_dom', node);
            for (var i = 0; i < nodes.length; i++) {
                root.jstree('delete_node', nodes[i]);
            }
        }

        function createNode($parent_node, new_node_id, new_node_text, icon, noChildren) {
            root.jstree('create_node', $parent_node, {
                "text": new_node_text,
                "id": new_node_id,
                'icon': icon + '.png',
                'state': 'closed',
                'children': noChildren ? undefined : [{ text: 'Loading...', state: "disabled" }],
            }, 'last', false, false);
            if ($parent_node) {
                root.jstree('open_node', $parent_node)
            }
        }
    }
};

