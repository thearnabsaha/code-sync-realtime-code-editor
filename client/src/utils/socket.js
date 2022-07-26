import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io("https://2deb-202-142-80-29.ngrok.io", options);
    // return io("http://localhost:3001", options);
};
