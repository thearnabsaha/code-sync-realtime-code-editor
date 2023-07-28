import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io("https://code-editor-backend-production.up.railway.app/", options);
    // return io("https://code-sync-backend.herokuapp.com", options);
};
