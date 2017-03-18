'use strict';

require('./core.module')
    .factory('csCoreModel', csCoreModel);

function csCoreModel () {

    var factory = {
        model: {},
        clean: clean
    };

    return factory;

    function clean (preserveFields) {

        if (preserveFields && !angular.isArray(preserveFields)) {
            throw '"fields" (if provided) must be an array';
        }

        for (var key in factory.model) {
            /* istanbul ignore else */
            if (factory.model.hasOwnProperty(key)) {

                if (!preserveFields || preserveFields.indexOf(key) === -1) {
                    delete factory.model[key];
                }

            }
        }

    }
}

