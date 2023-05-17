import { RootState } from "../app/store";

export const selectConnectionState = (state: RootState) => state.websocket.connectionStatus;
export const selectAllUsers = (state: RootState) => state.websocket.users;

// User Data
export const selectPath = (state: RootState) => state.websocket.userData?.path;
export const selectCurrentAction = (state: RootState) => state.websocket.userData?.currentAction;
export const selectUserId = (state: RootState) => state.websocket.userData?.id;
export const selectIsAdmin = (state: RootState) => state.websocket.userData?.admin;
export const selectIsMonkey = (state: RootState) => state.websocket.userData?.monkey;
export const selectVoted = (state: RootState) => state.websocket.userData?.voted || "";
