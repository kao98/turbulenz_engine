/// <reference path="../jslib-modular/turbulenz.d.ts" />
/// <reference path="../jslib-modular/tzdraw2d.d.ts" />
/// <reference path="../jslib-modular/physics2d.d.ts" />

/// <reference path="../scripts/Application.ts" />
/// <reference path="../scripts/Background.ts" />
/// <reference path="../scripts/Debug.ts" />

/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/physics2ddevice.js") }}*/
/*{{ javascript("jslib/physics2ddebugdraw.js") }}*/
/*{{ javascript("jslib/boxtree.js") }}*/
/*{{ javascript("scripts/Background.js") }}*/
/*{{ javascript("scripts/Debug.js") }}*/
/*{{ javascript("scripts/Application.js") }}*/


TurbulenzEngine.onload = function onloadFn(): void {

    var application: Application = Application.create();

    TurbulenzEngine.onunload = function onUnloadFn() {
        application.shutdown();
    }
    
    application
        .init()
        .run()
    ;

};