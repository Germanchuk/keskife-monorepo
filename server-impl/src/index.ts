import WebSocket from "ws";
import { Server, WebSocketServer } from "ws";
import { AdminActions, ForClientActions, ForServerActions, UnitedAction, UserData } from "./models/SharedTypes";
import { Routes } from "./models/SharedTypes";
import { gameAction } from "./gameData";

interface Action {
    type: String;
    payload: any;
}

interface Client extends WebSocket {
    userID: string;
}

interface GameState {
    monkeysNumber: number;
    roundUsers: Array<any>;
}

const initialUser: UserData = {
    path: Routes.WELCOME,
    admin: false,
    monkey: false,
    currentAction: '',
    points: 0,
    noticed: false,
    name: '',
}

const savedUsersStorage: {[key: string]: UserData} = {};

const gameState: GameState = {
    monkeysNumber: 0,
    roundUsers: []
}

savedUsersStorage["eten0000"] =  { admin: true, id: "eten0000"};

const wss: Server<Client> = new WebSocket.Server({ port: 8080 }, () => {
    console.log("Server has been started...");
});

wss.on("connection", function connection(client) {
    console.log("Someone connected");

    client.on('message', function message(data: any) {
        // Data preparing, no more
        const parsedData = JSON.parse(`${data}`);
        const { type, payload } = parsedData;
        
        switch (type) {
            case UnitedAction.GET_USER_BY_ID:
                // Case always executed, triggered by user on open connection event
                // Restores user or create user
                console.log("get user by id executed..");
                console.log(payload);
                const restoredUserData = savedUsersStorage[payload];
                
                if (restoredUserData) {
                    client.userID = payload;
                    if (restoredUserData.path === Routes.USERS || restoredUserData.path === Routes.VOTE || restoredUserData.path === Routes.REWARDING || restoredUserData.path === Routes.CARD) {
                        sendToClient({
                            type: ForClientActions.SET_ALL_USERS_NAME,
                            payload: getAllUsersData()
                        })
                    }
                } else {
                    console.log("new user creating...");
                    client.userID = generateID();
                    savedUsersStorage[client.userID] = {...initialUser};
                    savedUsersStorage[client.userID].id = client.userID;
                }

                updateSingleUserData();

                break
            case ForServerActions.SET_USER_NAME:
                console.dir(savedUsersStorage);
                console.log(client.userID);
                savedUsersStorage[client.userID].name = payload;
                savedUsersStorage[client.userID].path = Routes.USERS;
                
                updateSingleUserData();
                
                const action2 = {
                    type: ForClientActions.SET_ALL_USERS_NAME,
                    payload: getAllUsersData()
                }

                broadcast(action2);
                
                break
            case ForServerActions.VOTE_THE_USER:
                savedUsersStorage[client.userID].voted = payload;
                if (!savedUsersStorage[client.userID].monkey) {
                    let { monkey } = savedUsersStorage[payload];
                    if (monkey) {
                        savedUsersStorage[client.userID].points = (savedUsersStorage[client.userID].points || 0) + 100;
                        savedUsersStorage[payload].noticed = true;
                    }
                } else {
                    // monkeys votes never matter
                }
                break
            case AdminActions.START_THE_ROUND:
                gameState.monkeysNumber = payload;

                dealTheCards();

                updateAllUsersData({
                    path: Routes.CARD,
                    currentAction: gameAction.shift()
                });

                break
            case AdminActions.GO_TO_VOTING:
                updateAllUsersData({
                    path: Routes.VOTE
                });
                break
            case AdminActions.SHOW_RESULTS:
                // calculate monkeys points
                Object.keys(savedUsersStorage).forEach(key => {
                    if(savedUsersStorage[key].monkey && !savedUsersStorage[key].noticed) {
                        savedUsersStorage[key].points = (savedUsersStorage[key].points || 0) + 200;
                    }
                })
                // send data to users
                broadcast({
                    type: ForClientActions.SET_ALL_USERS_NAME,
                    payload: getAllUsersData(),
                });
                updateAllUsersData({
                    path: Routes.REWARDING
                })
                break
            default:
                return;
        }
    });

    client.on('close', () => {
        const { name, id } = savedUsersStorage[client.userID];
        console.log(`Client ${name} (${id}) disconnected.`);
    });

    function updateSingleUserData() {
        console.log(client.userID);
        console.dir(savedUsersStorage);
        sendToClient({
            type: UnitedAction.UPDATE_USER_DATA,
            payload: savedUsersStorage[client.userID]
        });
    }

    function sendToClient(data: any) {
        client.send(JSON.stringify(data));
    }
});

function broadcast(data: Action) {
    wss.clients.forEach((clientInstance: any) => {
        if (!savedUsersStorage[clientInstance.userID].admin) {
            clientInstance.send(JSON.stringify(data));
        }
    })
}

function updateAllUsersData(newProps: UserData = {}) {
    
    Object.keys(savedUsersStorage).forEach((key: any) => {
        if (!savedUsersStorage[key].admin) {
            savedUsersStorage[key] = {...savedUsersStorage[key], ...newProps};
        }
    });
    console.log("MUTATED???");
    console.dir(savedUsersStorage);

    wss.clients.forEach((clientInstance: any) => {
        const userData = savedUsersStorage[clientInstance.userID];
        console.warn(clientInstance.userID);
        console.log(userData);
        if (!userData?.admin) {
            clientInstance.send(JSON.stringify({
                type: UnitedAction.UPDATE_USER_DATA,
                payload: userData
            }));
        }
    })
}

function dealTheCards() {
    const clientsArr = [...Object.values(savedUsersStorage)].filter(user => !!user.id);

    // Find the index of the admin in the array
    const adminIndex = clientsArr.findIndex(user => user.admin);

    // Remove the admin from the array
    if (adminIndex !== -1) {
        clientsArr.splice(adminIndex, 1);
    }

    // reset users after previous round
    // clientsArr.forEach(cl => {
    //     cl.userData.noticed = false;
    //     cl.userData.voted = "";
    // });

    // Shuffle the array randomly
    const shuffledUsers = clientsArr.sort(() => Math.random() - 0.5);

    // Get the first three users from the shuffled array
    const selectedUsers = shuffledUsers.splice(0, gameState.monkeysNumber);

    shuffledUsers.forEach((cl: any) => {
        savedUsersStorage[cl.id].monkey = false;
        savedUsersStorage[cl.id].voted = "";
        savedUsersStorage[cl.id].noticed = false;
    });

    selectedUsers.forEach((cl: any) => {
        savedUsersStorage[cl.id].monkey = true;
        savedUsersStorage[cl.id].voted = "";
        savedUsersStorage[cl.id].noticed = false;
    });
}

function getAllUsersData() {

    return Object.values(savedUsersStorage)
        .filter(client => !!client.name)
        .map(client => ({
            name: client.name,
            id: client.id,
            points: client.points,
            monkey: client.monkey
        }));
}

function generateID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 10; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
