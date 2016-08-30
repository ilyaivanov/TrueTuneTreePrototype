var app = {
    init: function (root, searchInput) {
        var searchNode = {
            id: 'searchNode',
            text: 'Search results..',
            icon: 'searchIcon.png'
        };
        var favorites = {
            text: 'Favorites',
            icon: 'heart.png'
        };
        root.on('before_open.jstree', function (e, data) {
            if (data.node.id != 'searchNode') {
                artists.findAlbumsXml(data.node.id)
                    .then(albums => mapAlbums(albums, data.node));
            }
        });
        root.jstree({
            'core': {
                'data': [
                    searchNode,
                    favorites
                ],
                'check_callback': true
            }
        });

        searchInput.keyup(_.debounce(function () {
            clearNode($("#searchNode"));
            artists.findArtistsXml(searchInput.val())
                .then(a => mapArtists(a))

        }, 250));

        function mapAlbums(albums, parent) {
            clearNode($("#" + parent.id));
            _.each(albums, album=> createNode("#" + parent.id, album.id, album.name, "album"));
        }

        function mapArtists(artists) {
            _.each(artists, a=> createNode("#searchNode", a.id, a.name, "artist"));
        }

        function clearNode(node) {
            var nodes = root.jstree('get_children_dom', node);
            for (var i = 0; i < nodes.length; i++) {
                root.jstree('delete_node', nodes[i]);
            }
        }

        function createNode(parent_node, new_node_id, new_node_text, icon) {
            root.jstree('create_node', $(parent_node), {
                "text": new_node_text,
                "id": new_node_id,
                'icon': icon + '.png',
                'state': 'closed',
                'children': [{text: 'Loading...', state: "disabled"}],
            }, 'last', false, false);
            root.jstree('open_node', $(parent_node))
        }
    }
};

