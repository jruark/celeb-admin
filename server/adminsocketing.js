import Server from 'socket.io';

export default function startAdminServer(store) {
    const io = new Server().attach(8091);
    
    store.subscribe(
        () => io.emit('state', store.getState().toJS())
    );
    
    io.on('connection', (socket) => {
       socket.emit('state', store.getState().toJS());
    });
}