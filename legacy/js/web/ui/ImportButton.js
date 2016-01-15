module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.define('web.ui.ImportButton', [], function () {
        return {

            vdom: {
                renderer: function renderImportBtnVdom(context) {
                    return context.h('div', {
                        className: 'button file-button-wrap',
                    }, [context.h('input.hidden-file-inp', {type: 'file'}), 'Import']);
                }
            },

            events: {
                'change input.hidden-file-inp': function handleFileSelection(ev, state) {
                    console.log('handleFileSelection', ev, state);
                }
            },

            css: {
                typeRules: {
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
                        'cursor': 'pointer',
                    },
                }
            }
        };
    });
};
