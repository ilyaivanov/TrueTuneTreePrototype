var contextmenu = {
    "items": function ($node) {
        var tree = $("#tree").jstree(true);
        return {
            "Ambient": {
                "separator_before": false,
                "separator_after": false,
                "label": "Ambient",
                "action": function (obj) {
                    favorites.createNode('Ambient', $node);
                },
            },
            "Electron": {
                "separator_before": false,
                "separator_after": false,
                "label": "Electron",
                "action": function (obj) {
                    favorites.createNode('Electronic');
                    // tree.delete_node($node);
                },
            }
        };
    }
};

var app = {
    init: function (root, searchInput) {


        function init() {
            root.jstree({
                'core': {
                    'check_callback': true,
                },
                "plugins": [ "contextmenu"],
                contextmenu: contextmenu
            });

            loadTracksOrAlbums(root);


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

        function mapArtists(artists) {
            _.each(artists, a => createNode(root, null, a.id, a.name, "artist"));
        }

    }
};

