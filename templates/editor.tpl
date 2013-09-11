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
        <button type="button" class="button rotate-antoclockwise" disabled="true" ><span>↶</span></button>
        <button type="button" class="button move-up"><span>▲</span></button>
        <button type="button" class="button rotate-clockwise" disabled="true" ><span>↷</span></button>
        <button type="button" class="button move-left"><span>◀</span></button>
        <button type="button" class="button move-down"><span>▼</span></button>
        <button type="button" class="button move-right"><span>▶</span></button>
    </div>
    <div id="editor-info-x">X: <span>-</span></div>
    <div id="editor-info-y">Y: <span>-</span></div>
    <div id="editor-ghost" style="width: <$= s $>px; height: <$= s $>px;"></div>
</div>
