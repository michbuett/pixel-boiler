<div class="pb-sprites">
    <$ for (var i = 0; i < data.numOfSprites; i++) { $>
        <div id="sprite-<$= i $>" class="sprite-item" data-index="<$= i $>">
            <span class="index"><$= i $></span>
            <!-- <span class="clone">⎘<</span> -->
            <span class="settings">⚙</span>
        </div>
    <$ } $>
</div>

<div class="buttons">
    <button class="add-sprite" title="Add new sprite">+</button>
</div>
