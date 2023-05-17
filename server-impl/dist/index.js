"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const WELCOME_SCREEN = "WelcomeScreen";
const initialUser = {
    role: 'regular',
    name: null,
    screen: WELCOME_SCREEN,
};
const wss = new ws_1.WebSocketServer({ port: 8080 }, () => {
    console.log("Server has been started...");
});
wss.on("connection", function connection(clientInstance) {
    clientInstance.on('message', function message(data) {
        const parsedData = JSON.parse(`${data}`);
        switch (parsedData.action) {
            case "userName":
                clientInstance.name = parsedData.payload;
                const screenObj = {
                    action: "screen",
                    payload: "AllUsersScreen"
                };
                clientInstance.send(JSON.stringify(screenObj));
                const users = getAllUsersNames();
                const usersObj = {
                    action: "users",
                    payload: users
                };
                broadcast(usersObj);
                break;
            default:
                return;
        }
    });
    clientInstance.on('close', () => {
        console.log(`Client ${clientInstance.name} disconnected.`);
        broadcast({
            action: "users",
            payload: getAllUsersNames(),
        });
    });
});
function broadcast(data) {
    wss.clients.forEach((clientInstance) => {
        clientInstance.send(JSON.stringify(data));
    });
}
function getAllUsersNames() {
    return [...wss.clients]
        .filter(client => !!client.name)
        .map(client => client.name);
}
