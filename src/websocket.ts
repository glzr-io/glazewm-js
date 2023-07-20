import WebSocket from 'ws';

export default global?.WebSocket ?? window?.WebSocket ?? WebSocket;
