module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'web.ui.ImportButton',
    }, {
        getComponents: function () {
            return {
                vdom: {
                    renderer: renderButton
                },

                events: {
                    change: {
                        handler: 'handleFileSelection',
                    }
                },
            };
        },

        getEventHandler: function () {
            return {
                handleFileSelection: handleFileSelection,
            };
        },

        getStaticCss: function () {
            return {
                '.file-button-wrap': {
                    'position': 'relative',
                },

                '.hidden-file-inp': {
                    'position': 'absolute',
                    'box-sizing:': 'border-box',
                    'top': 0,
                    'left': 0,
                    'width': '100%',
                    'height': '100%',
                    'opacity': 0,
                    'z-index': 100,
                },
            };
        },
    });

    /** @private */
    function renderButton(context) {
        return context.h('div', {
            className: 'button file-button-wrap',
        }, [context.h('input.hidden-file-inp', {type: 'file'}), 'Import']);
    }

    /** @private */
    function handleFileSelection(ev, state) {
        console.log('handleFileSelection', ev, state);
    }
};
