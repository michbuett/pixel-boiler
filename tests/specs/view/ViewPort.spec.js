describe('ViewPort', function () {
    'use strict';

    var alchemy = require('./../../../js/alchemy/lib/core/Alchemy.js');

    beforeEach(function () {
        setFixtures(sandbox());

        this.sandboxEl = document.getElementById('sandbox');
    });

    it('renders main UI elements (landscape)', function () {
        // prepare
        var testee = alchemy('pb.view.ViewPort').brew();
        // execute
        testee.render(this.sandboxEl);
        // verify
        expect(this.sandboxEl).toContainElement('#viewport.landscape');
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
        var testee = alchemy('pb.view.ViewPort').brew();
        testee.setState({
            orientation: 'portrait'
        });
        // execute
        testee.render(this.sandboxEl);
        // verify
        expect(this.sandboxEl).toContainElement('#viewport.portrait');
        expect(this.sandboxEl).toContainElement('#intro');
        expect(this.sandboxEl).toContainElement('#fps');
        expect(this.sandboxEl).toContainElement('.main-menu');
        expect(this.sandboxEl).toContainElement('.sprite-list');
        expect(this.sandboxEl).toContainElement('.editor-pane');
        expect(this.sandboxEl).toContainElement('.preview-area');
        expect(this.sandboxEl).toContainElement('.palette');
    });
});
