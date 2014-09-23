(function () {
    'use strict';

    var alchemy = require('./Alchemy.js');

    /**
     * The main viewport
     *
     * @class
     * @name pb.view.ViewPort
     * @extends pb.view.PrimaReactus
     */
    alchemy.formula.add({
        name: 'pb.view.ViewPort',
        extend: 'pb.view.PrimaReactus',
        requires: ['pb.view.MainMenu'],
        overrides: {
            /** @lends pb.view.ViewPort.prototype */

            state: {
                orientation: 'landscape'
            },

            /**
             * The render method for the React component
             * <code>
             *   <div id="intro"></div>
             *   <div id="fps"></div>
             *   <MainMenu></MainMenu>
             *   <div id="sprite-list" class="toolbar"></div>
             *   <div id="editor-pane"></div>
             *   <div id="preview-area"></div>
             *   <div id="palette"></div>
             * </code>
             *
             * @return ReactComponent
             */
            createReactRenderer: function () {
                return function renderComponent() {
                    var content;
                    var dom = React.DOM;
                    var fps = dom.div({id: 'fps'});
                    var intro = dom.div({id: 'intro'});
                    var mainMenu = alchemy('pb.view.MainMenu').brew().getComponentDescriptor();
                    var spriteList = dom.div({
                        className: 'sprite-list',
                    });
                    var editorPane = dom.div({
                        className: 'editor-pane',
                    });
                    var preview = dom.div({
                        className: 'preview-area',
                    });
                    var palette = dom.div({
                        className: 'palette',
                    });

                    if (this.state.orientation === 'landscape') {
                        var left = dom.div({
                            className: 'toolbar'
                        }, mainMenu({}), spriteList);
                        var right = dom.div({
                            className: 'toolbar'
                        }, preview, palette);

                        content = dom.div({}, left, editorPane, right);
                    } else { // portrait
                        var top = dom.div({
                            className: 'toolbar'
                        }, mainMenu({}), palette, preview);
                        var bottom = dom.div({
                            className: 'toolbar'
                        }, spriteList);

                        content = dom.div({}, top, editorPane, bottom);
                    }

                    return dom.div({
                        id: 'viewport',
                        className: this.state.orientation,
                    }, intro, fps, content);
                };
            },
        }
    });
}());


