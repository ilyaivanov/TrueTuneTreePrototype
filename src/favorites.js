var favorites = (function () {
    return {
        init: function (root) {
            this.root = root;
            function init(initialData) {
                root.jstree({
                    'core': {
                        'check_callback': true,
                        data: initialData
                    },
                    "plugins": ["wholerow", 'dnd']
                });

                loadTracksOrAlbums(root);
            }

            let savedState = JSON.parse(localStorage.getItem('prototypeState'));
            init(savedState);
            if (!savedState) {
                createNode(root, null, "AmbientPlaylist", "Ambient", "heart", true)
                createNode(root, null, "ElectronicPlaylist", "Electronic", "heart", true)
            }
        },
        createNode(parentPrefix, node){
            //TODO ugly, use jstree internal id
            let newNode = this.root.jstree('copy_node',
                node,
                $('#' + parentPrefix + 'Playlist'));
            console.log(node.data)
            this.root.jstree('get_node', newNode).data = node.data;

            var json = JSON.stringify(this.root.jstree('get_json'));
            localStorage.setItem('prototypeState', json);
            console.log(this.root.jstree('get_node', newNode))
        }
    };
})();
