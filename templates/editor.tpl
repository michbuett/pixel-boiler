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
        <div class="button rotate-antoclockwise" disabled><span>↶</span></div>
        <div class="button move-up"><span>▲</span></div>
        <div class="button rotate-clockwise" disabled><span>↷</span></div>
        <div class="button move-left"><span>◀</span></div>
        <div class="button move-down"><span>▼</span></div>
        <div class="button move-right"><span>▶</span></div>
    </div>
    <div id="editor-info-x">X: <span>-</span></div>
    <div id="editor-info-y">Y: <span>-</span></div>
    <div id="editor-ghost" style="width: <$= s $>px; height: <$= s $>px;"></div>
</div>
