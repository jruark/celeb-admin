'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = startAdminServer;

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startAdminServer(store) {
    var io = new _socket2.default().attach(8091);

    store.subscribe(function () {
        return io.emit('state', store.getState().toJS());
    });

    io.on('connection', function (socket) {
        socket.emit('state', store.getState().toJS());
    });
}
//# sourceMappingURL=adminsocketing.js.map