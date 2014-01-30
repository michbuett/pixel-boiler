<fieldset><$

    var pd = data.paletteData;
    var index = 0;

    for (var i = 0, l = pd.length; i < l; i += 4) {
        var r = pd[i];
        var g = pd[i + 1];
        var b = pd[i + 2];
        var a = pd[i + 3] / 255;
        var id = 'item-' + i;
        var c = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

$><div class="palette-item-wrap"><div id="<$= id $>" class="palette-item" style="background-color: <$= c $>;"
  data-color="<$= c $>"
  data-r="<$= r $>"
  data-g="<$= g $>"
  data-b="<$= b $>"
  data-a="<$= a $>"
  data-index="<$= index $>"
></div></div><$

        index++;
    }
$></fieldset>
