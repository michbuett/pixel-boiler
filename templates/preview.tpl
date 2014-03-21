<fieldset>
    <legend>Preview</legend>
    <div class="preview-wrap" data-background="dark">
        <canvas class="anim-preview" width="<$= data.width $>" height="<$= data.height $>"
          style="margin: -<$= data.height / 2$>px 0 0 -<$= data.width / 2 $>px;"
        ></canvas>
        <div class="scale-info">x<$= data.scale $></div>
    </div>

    <div class="buttons">
        <button type="button" id="preview-play" title="Start Animation" class="stop">
            <div class="icon"></div>
        </button>

        <button type="button" id="preview-background" title="Change Preview Settings" class="settings">
            <div class="icon"></div>
        </button>
    </div>
</fieldset>
