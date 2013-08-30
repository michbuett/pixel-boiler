<div class="context-menu-mask">
    <div class="context-menu" style="left: <$= data.x $>px; top: <$= data.y $>px; width: <$= data.w $>px; height: <$= data.h $>px;">
        <div class="item center cancel" title="Cancel">
            <span class="icon">⛔</span>
        </div>
        <$
            var items = data.items;
            var keys = Object.keys(items);
            for (var i = 0, l = keys.length; i < l; i++) {
                var key = keys[i];
                var item = items[key];
                var r = (360 / l) * i - 90;
                $>
                    <div class="item <$= item.pos $>" data-key="<$= key $>" title="<$= item.text $>">
                        <div class="icon"><$= item.icon $></div>
                    </div>
                <$
            }
        $>
    </div>
</div>
