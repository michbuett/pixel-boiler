// Eine Einführung zur leeren Vorlage finden Sie in der folgenden Dokumentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var alchemy = require('alchemy');
    var pixelBoiler;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: Diese Anwendung wurde neu eingeführt. Die Anwendung
                // hier initialisieren.
                alchemy.heatUp({
                    waitForDomReady: false,
                    path: {
                        alchemy: '/js/alchemy/lib',
                        pb: '/js/pb',
                        win: '/js/win'
                    },
                    require: [
                        'pb.Application',
                        'win.overrides'
                    ],
                    onReady: function () {
                        alchemy('win.overrides').apply();
                        pixelBoiler = alchemy('pb.Application').brew({
                            title: 'The Pixel Boiler'
                        });
                        pixelBoiler.launch();
                        window.debug = pixelBoiler;
                    }
                });
            } else {
                // TODO: Diese Anwendung war angehalten und wurde reaktiviert.
                // Anwendungszustand hier wiederherstellen.
                pixelBoiler.launch();
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function () {
        // TODO: Diese Anwendung wird gleich angehalten. Jeden Zustand,
        // der über Anhaltevorgänge hinweg beibehalten muss, hier speichern. Dazu kann das
        // WinJS.Application.sessionState-Objekt verwendet werden, das automatisch
        // über ein Anhalten hinweg gespeichert und wiederhergestellt wird. Wenn ein asynchroner
        // Vorgang vor dem Anhalten der Anwendung abgeschlossen werden muss,
        // args.setPromise() aufrufen.
        if (pixelBoiler) {
            pixelBoiler.end();
        }
    };

    app.start();
})();
