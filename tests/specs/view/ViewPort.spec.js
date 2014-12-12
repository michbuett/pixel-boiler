describe('ViewPort', function () {
    'use strict';

    var alchemy = require('./../../../js/alchemy/lib/core/Alchemy.js');

    beforeEach(function () {
        setFixtures(sandbox());
        this.sandboxEl = document.getElementById('sandbox');
    });

    it('renders main UI elements (landscape)', function () {
        // prepare
        var state = alchemy('Immutatio').makeImmutable({
            orientation: 'landscape'
        });
        var testee = alchemy('pb.view.ViewPort').brew({
            root: this.sandboxEl
        });
        // execute
        testee.draw(state);
        // verify
        expect(this.sandboxEl).toHaveClass('landscape');
        expect(this.sandboxEl).toContainElement('#intro');
        expect(this.sandboxEl).toContainElement('#fps');
        expect(this.sandboxEl).toContainElement('.main-menu');
        expect(this.sandboxEl).toContainElement('.sprite-list');
        expect(this.sandboxEl).toContainElement('.editor-pane');
        expect(this.sandboxEl).toContainElement('.preview-area');
        expect(this.sandboxEl).toContainElement('.palette');
    });

    it('renders main UI elements (portrait)', function () {
        // prepare
        var state = alchemy('Immutatio').makeImmutable({
            orientation: 'portrait'
        });
        var testee = alchemy('pb.view.ViewPort').brew({
            root: this.sandboxEl
        });
        // execute
        testee.draw(state);
        // verify
        expect(this.sandboxEl).toHaveClass('portrait');
        expect(this.sandboxEl).toContainElement('#intro');
        expect(this.sandboxEl).toContainElement('#fps');
        expect(this.sandboxEl).toContainElement('.main-menu');
        expect(this.sandboxEl).toContainElement('.sprite-list');
        expect(this.sandboxEl).toContainElement('.editor-pane');
        expect(this.sandboxEl).toContainElement('.preview-area');
        expect(this.sandboxEl).toContainElement('.palette');
    });
});
