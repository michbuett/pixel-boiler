/* global setFixtures */
(function () {
    'use strict';

    window.uiHelper = function (Observari, State, UI) {
        return {
            setUp: function (testRun) {
                testRun = testRun || this;

                setFixtures([
                    '<div id="viewport"></div>',
                ].join(''));

                testRun.messages = Observari.brew();

                testRun.state = State.getInitialState();

                testRun.ui = UI.brew({
                    messages: testRun.messages,
                });

                testRun.ui.init(testRun.state);
            },

            tearDown: function (testRun) {
                testRun = testRun || this;

                testRun.ui.dispose();
                testRun.messages.dispose();
                testRun.ui = null;
                testRun.state = null;
                testRun.messages = null;
            },
        };
    };
}());
