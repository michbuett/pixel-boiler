<form class="import-form">
    <input id="file-chooser" type="file" accept="png, gif, jpg, jpeg">
    <div class="selected-image-ct">
        <img id="selected-image">
        <span id="display-data"></span>
    </div>

    <!-- input fields for sprite width and height -->
    <fieldset>
        <label for="inp-sprite-width">Sprite Width:</label>
        <input id="inp-sprite-width" maxLength="3" value="<$= data.spriteWidth $>">
    </fieldset>

    <fieldset>
        <label for="inp-sprite-height">Sprite Height:</label>
        <input id="inp-sprite-height" maxLength="3" value="<$= data.spriteHeight $>">
    </fieldset>

    <!-- the buttons -->
    <div class="buttons">
        <div class="button confirm">Import</div>
        <div class="button cancel">Cancel</div>
    </div>
</form>
