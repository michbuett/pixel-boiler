<div class="pb-editor">
<div class="pixel-ct" style="width: <$= (data.dimX * data.size) $>px; height: <$= (data.dimY * data.size) $>px;">
<$
  var i, j, x, y, s = data.size - 1;
  var c, r, g, b, a;
  for (var j = 0; j < data.dimY; j++) {
    y = j * data.size;
    for (var i = 0; i < data.dimX; i++) {
      x = i * data.size;
      c = data.colors && data.colors[i][j];
      r = c && c[0] || 0;
      g = c && c[1] || 0;
      b = c && c[2] || 0;
      a = (c && c[3] || 0) / 255;
$>
<div class="pixel"
 style="background-color: rgba(<$=r$>, <$=g$>, <$=b$>, <$=a$>); left: <$= x $>px; top: <$= y $>px; width: <$= s $>px; height: <$= s $>px;"
 data-x="<$= i $>" data-y="<$= j $>"
 data-r="<$= r $>" data-g="<$= g $>" data-b="<$= b $>" data-a="<$= a $>"
></div>
<$
    }
  }
$>
</div>
<div class="info-x">X: <span>-</span></div>
<div class="info-y">Y: <span>-</span></div>
</div>
