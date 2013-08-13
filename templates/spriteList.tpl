<div class="pb-spritelist">
    <div class="pb-sprites">
        <$ for (var i = 0; i < data.numOfSprites; i++) { $>
            <div id="sprite-<$= i $>" class="sprite-item" data-index="<$= i $>">
                <span class="index"><$= i $></span>
            </div>
        <$ } $>
        <div style="clear: both;"></div>
    </div>

    <div class="buttons">
        <button class="add-sprite" title="Add new sprite">+</button>
        <button class="delete-sprite" title="Delete selected sprite">♻</button>
    </div>
</div>
