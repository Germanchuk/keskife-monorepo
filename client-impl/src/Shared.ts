export enum UnitedAction {
    GET_USER_BY_ID = "GET_USER_BY_ID",
    UPDATE_USER_DATA = "UPDATE_USER_DATA"
}

export enum ForServerActions {
    SET_USER_NAME = "SET_USER_NAME",
    VOTE_THE_USER = "VOTE_THE_USER"
}

export enum ForClientActions {
    SET_ALL_USERS_NAME = "SET_ALL_USERS_NAME",
    SET_PATH = "SET_PATH"
}

export enum AdminActions {
    START_THE_ROUND = "START_THE_ROUND",
    GO_TO_VOTING = "GO_TO_VOTING",
    SHOW_RESULTS = "SHOW_RESULTS"
}

export interface UserData {
    name?: string;
    path: string;
    id?: string;
    admin?: boolean;
    monkey?: boolean;
    currentAction?: string;
    points?: number;
    noticed?: boolean;
    voted?: string;
}

export enum Routes {
    WELCOME = "/welcome",
    USERS = "/users",
    VOTE = "/vote",
    CARD = "/card",
    REWARDING = "/rewarding",
    ADMIN = "/admin"
}