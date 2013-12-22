<$
    var s = data.scale;
    var x = data.dimX;
    var y = data.dimY;
    var w = x * s;
    var h = y * s;
$>
<div class="pb-editor <$= data.orientation $>">
    <canvas id="editor-canvas" width="<$= w $>" height="<$= h $>" style="width: <$= w $>px; height: <$= h $>px;"></canvas>
    <div class="tool-ct">
        <div class="row">
            <button type="button" class="button undo"><span class="icon undo"></span></button>
            <button type="button" class="button redo"><span class="icon redo"></span></button>
        </div>

        <div class="row">
            <button type="button" class="button move-up"><span class="icon moveUp"></span></button>
            <button type="button" class="button move-down"><span class="icon moveDown"></span></button>
        </div>

        <div class="row">
            <button type="button" class="button move-left"><span class="icon moveLeft"></span></button>
            <button type="button" class="button move-right"><span class="icon moveRight"></span></button>
        </div>
    </div>
    <div id="editor-info-x">X: <span>-</span></div>
    <div id="editor-info-y">Y: <span>-</span></div>
    <div id="editor-ghost" style="width: <$= s $>px; height: <$= s $>px;"></div>
</div>
