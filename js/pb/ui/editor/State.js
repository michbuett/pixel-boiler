module.exports = function (alchemy) {
    'use strict';

    /**
     * @class pb.ui.editor.State
     */
    alchemy.formula.add({
        name: 'pb.ui.editor.State',

    }, {
        globalToLocal: function (appState, currentState) {
            var height = appState.val('windowHeight');
            var width = appState.val('windowWidth');
            var isLandscape = (width > height);

            var sheet = appState.sub('sheet');
            var appSprites = sheet.sub('sprites');
            var spriteWidth = sheet.val('spriteWidth');
            var spriteHeight = sheet.val('spriteHeight');

            var cvsWidth = isLandscape ? width - 400 : width;
            var cvsHeight = isLandscape ? height - 50 : height - 400;
            var scale = Math.min(
                Math.floor(cvsWidth / spriteWidth),
                Math.floor(cvsHeight / spriteHeight)
            );

            return currentState.set({
                appSprites: appSprites,
                sprites: appSprites !== currentState.sub('appSprites') ? appSprites : currentState.sub('sprites'),
                selected: sheet.sub('selected'),
                scale: scale,
                width: scale * spriteWidth,
                height: scale * spriteHeight,
                color: appState.sub('colors').val('selected'),
            });
        },
    });
};
