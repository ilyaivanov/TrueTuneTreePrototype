var favorites = (function () {
    "use strict";

    function init(root) {
        this.root = root;
        function init(initialData) {
            root.jstree({
                'core': {
                    'check_callback': true,
                    data: initialData
                },
                "plugins": []
            });

            loadTracksOrAlbums(root, () => saveState(root));
            root.on('after_open.jstree', () => saveState(root));
            root.on('after_close.jstree', () => saveState(root));
        }

        let savedState = JSON.parse(localStorage.getItem('prototypeState'));

        init(savedState);

        if (!savedState) {
            createNode(root, null, "AmbientPlaylist", "Ambient", "heart", true)
            createNode(root, null, "ElectronicPlaylist", "Electronic", "heart", true)
        }
    }

    function createNode(parentPrefix, node) {
        //TODO ugly, use jstree internal id
        let newNode = this.root.jstree('copy_node',
            node,
            $('#' + parentPrefix + 'Playlist'));
        this.root.jstree('get_node', newNode).data = node.data;

        saveState(this.root);
    }

    let saveState = _.debounce(function(root){
        var json = JSON.stringify(root.jstree('get_json'));
        localStorage.setItem('prototypeState', json);
        console.log('saved')
    }, 500);
    return {
        init: init,
        createNode: createNode
    };


})();
