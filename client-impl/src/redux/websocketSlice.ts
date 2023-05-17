import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserData, Routes } from "../Shared";

export type ConnectionStatus = "idle" | "pending" | "connected" | "error" | "disconnected";
const LS_ID = "keskifeUserId";


export interface State {
    connectionStatus: ConnectionStatus;
    users: Array<{name: string; id: string; points: number; monkey: boolean;}>;
    userData: UserData;
}

const initialState: State = {
    connectionStatus: 'pending',
    users: [],
    userData: {
        path: Routes.WELCOME,
    }
}

const websocketSlice = createSlice({
    name: "websocket",
    initialState,
    reducers: {
        setWebsocketState: (state, action: PayloadAction<ConnectionStatus>) => {
            state.connectionStatus = action.payload
        },
        setPath: (state, action) => {
            state.userData.path = action.payload;
        },
        setAllUsersNames: (state, action) => {
            state.users = action.payload;
        },
        setUser: (state, action) => {
            const ls_id = localStorage.getItem(LS_ID);
            const id = action.payload?.id;
            if (id && ls_id !== id) {
                localStorage.setItem(LS_ID, id);
            }
            state.userData = action.payload;
        }
    }
});

export const {
    setWebsocketState,
    setPath,
    setAllUsersNames,
    setUser
} = websocketSlice.actions;

export default websocketSlice.reducer;