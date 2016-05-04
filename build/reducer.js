'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = reducer;

var _message = require('./message.js');

var _image = require('./image.js');

var _immutable = require('immutable');

var initStore = function initStore() {
    console.log("Initializing store.");
    var s = (0, _immutable.Map)({
        "Messages": (0, _immutable.List)(),
        "Images": (0, _immutable.List)()
    });
    return s;
};

function reducer(state, action) {

    switch (action.type) {
        case 'INIT':
            return initStore();
        case 'MESSAGE_CHANGES':
            return (0, _message.processMessageChanges)(state, action.changes);
        case 'IMAGE_CHANGES':
            return (0, _image.processImageChanges)(state, action.changes);
    }
    return state;
}
//# sourceMappingURL=reducer.js.map