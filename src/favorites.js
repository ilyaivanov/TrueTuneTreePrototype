var favorites = (function () {
    return {
        init: function (root) {
            this.root = root;
            function init() {
                root.jstree({
                    'core': {
                        'check_callback': true
                    },
                    "plugins": ["wholerow", 'dnd']
                });

                loadTracksOrAlbums(root);
            }

            init();

            createNode(root, null, "AmbientPlaylist", "Ambient", "heart", true)
            createNode(root, null, "ElectronicPlaylist", "Electronic", "heart", true)
        },
        createNode(parentPrefix, node){
            //TODO ugly, use jstree internal id
            let newNode = this.root.jstree('copy_node',
                node,
                $('#' + parentPrefix + 'Playlist'));
            console.log(node.data)
            this.root.jstree('get_node', newNode).data = node.data;
            console.log(this.root.jstree('get_node', newNode))
        }
    };
})();
