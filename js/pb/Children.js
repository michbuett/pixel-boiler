module.exports = function (alchemy) {
    'use strict';

    alchemy.formula.add({
        name: 'pb.Children',
    }, {

        entities: undefined,

        update: function () {
            var components = this.entities.getAllComponentsOfType('children');
            components.each(this.updateEntity, this);
        },

        updateEntity: function (children) {
            if (!children.fromState) {
                return;
            }

            var state = this.entities.getComponent(children.id, 'state');
            if (!state || state.last === state.current) {
                return;
            }

            alchemy.each(children.fromState(state.current), function (cfg) {
                var entityId = this.entities.createEntity(cfg.type, cfg);
                children[entityId] = cfg;
                this.createChildrenOfEntity(entityId);
            }, this);
        },

        createChildrenOfEntity: function (entityId) {
            var children = this.entities.getComponent(entityId, 'children');

            alchemy.each(children, function (cfg, id) {
                if (!alchemy.isObject(cfg) || !alchemy.isString(cfg.type)) {
                    return;
                }

                if (this.entities.exists(id)) {
                    return;
                }

                var type = cfg.type;
                var cmpCfg = alchemy.mix({}, cfg, { id: id });

                this.entities.createEntity(type, cmpCfg);
                this.createChildrenOfEntity(id);
            }, this);
        },
    });
};
