describe('MainMenu', function () {
    'use strict';

    var alchemy = require('./../../../js/alchemy/lib/core/Alchemy.js');

    beforeEach(function () {
        setFixtures(sandbox());

        this.sandboxEl = document.getElementById('sandbox');
    });

    it('renders UI elements for the main menu', function () {
        // prepare
        var testee = alchemy('pb.view.MainMenu').brew();
        // execute
        testee.render(this.sandboxEl);
        // verify
        expect(this.sandboxEl).toContainElement('div.title');
        expect(this.sandboxEl).toContainElement('div.file-info');
        expect(this.sandboxEl).toContainElement('button#btn-new');
        expect(this.sandboxEl).toContainElement('button#btn-open');
        expect(this.sandboxEl).toContainElement('button#btn-save');
        expect(this.sandboxEl).toContainElement('button#btn-saveas');
        expect(this.sandboxEl).toContainElement('button#btn-preview');
    });

    ['new', 'open', 'save', 'saveas', 'preview'].forEach(function (action) {
        it('delegates "' + action + '"-button clicks to message bus', function () {
            // prepare
            var messages = jasmine.createSpyObj('messages', ['trigger']);
            var testee = alchemy('pb.view.MainMenu').brew({
                messages: messages
            });
            testee.render(this.sandboxEl);
            // execute
            $('#btn-' + action).click();
            // verify
            expect(messages.trigger).toHaveBeenCalledWith('user:' + action);
        });
    });
});
