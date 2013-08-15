<form id="form-new-sheet">
    <fieldset>
        <legend>Sprite Dimensions</legend>
        <div>
            <label for="inp-sprite-width">Width</label>
            <input id="inp-sprite-width" type="text" size="3" maxlength="3" value="<$= data.spriteWidth $>">
        </div>

        <div>
            <label for="inp-sprite-height">Height</label>
            <input id="inp-sprite-height" type="text" size="3" maxlength="3" value="<$= data.spriteHeight $>">
        </div>
    </fieldset>

    <fieldset>
        <legend>Sprite Array</legend>
        <div>
            <label for="inp-columns">Columns</label>
            <input id="inp-columns" type="text" size="3" maxlength="3" value="<$= data.columns $>">
        </div>

        <div>
            <label for="inp-rows">Rows</label>
            <input id="inp-rows" type="text" size="3" maxlength="3" value="<$= data.rows $>">
        </div>
    </fieldset>

    <div class="buttons">
        <div class="button" id="btn-create" title="Create new sprite sheet with entered parameter">Create</div>
    </div>
<form>
