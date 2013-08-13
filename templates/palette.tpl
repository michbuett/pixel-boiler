<form class="color-ct">
<$
    var pd = data.paletteData;
    var index = 0;

    for (var i = 0, l = pd.length; i < l; i += 4) {
        var r = pd[i];
        var g = pd[i + 1];
        var b = pd[i + 2];
        var a = pd[i + 3] / 255;
        var id = 'item-' + i;
        var c = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    $>

<input id="<$= id $>" type="radio" name="color" value="<$= c $>" class="hidden-radio">
<div class="visible-radio">
    <label
        for="<$= id $>"
        data-color="<$= c $>"
        data-r="<$= r $>"
        data-g="<$= g $>"
        data-b="<$= b $>"
        data-a="<$= a $>"
        data-index="<$= index $>"
        style="background-color: <$= c $>"
        class="visible-radio palette-item" >
    </label>
</div>

    <$
        index++;
    }
$>
</form>

