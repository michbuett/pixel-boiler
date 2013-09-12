<form id="import-form">
    <input id="file-chooser" type="file" accept="png, gif, jpg, jpeg">
    <div class="selected-image-ct">
        <span class="caption">Click here to select an image</span>
        <img id="selected-image" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">
        <span class="display-data"></span>
    </div>

    <!-- input fields for sprite width and height -->
    <fieldset>
        <legend>Sprite Dimensions</legend>
        <div id="sprite-width-ct"></div>
        <div id="sprite-height-ct"></div>
    </fieldset>

    <!-- the buttons -->
    <div class="buttons">
        <div class="button confirm">Import</div>
        <div class="button cancel">Cancel</div>
    </div>
</form>
