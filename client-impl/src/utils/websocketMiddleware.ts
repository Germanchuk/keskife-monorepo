import { Action, Middleware } from "@reduxjs/toolkit";
import { Socket } from "./Socket";
import {
  setPath,
  setWebsocketState,
  setAllUsersNames,
  setUser,
} from "../redux/websocketSlice";
import {
  AdminActions,
  ForClientActions,
  ForServerActions,
  UnitedAction,
} from "../Shared";

const WS_URL = "ws://192.168.0.71:8080";
const LS_ID = "keskifeUserId";

const socket = new Socket();

export enum WebsocketActions {
  CONNECT_TO_WS = "CONNECT_TO_WS",
  DISCONNECT_FROM_WS = "DISCONNECT_FROM_WS",
}

const socketMiddleware: Middleware = (params) => (next) => (action) => {
  const { dispatch } = params;
  const { type, payload } = action;

  switch (type) {
    case WebsocketActions.CONNECT_TO_WS:
      socket.connect(WS_URL);

      socket.on("open", () => {
        dispatch(setWebsocketState("connected"));

        const userId = localStorage.getItem(LS_ID) || null;

          socket.send({
            type: UnitedAction.GET_USER_BY_ID,
            payload: userId,
          });

      });

      socket.on("error", () => dispatch(setWebsocketState("error")));
      socket.on("message", (action: Action) => {
        console.log(action);
        if (action) {
          dispatch(action);
        }
      });
      socket.on("close", () => dispatch(setWebsocketState("disconnected")));
      break;
    case WebsocketActions.DISCONNECT_FROM_WS:
      dispatch(setWebsocketState("disconnected"));
      socket.disconnect();
      break;
    case ForServerActions.SET_USER_NAME:
      socket.send(action);
      break;
    case ForServerActions.VOTE_THE_USER:
      socket.send(action);
      break;
    case ForClientActions.SET_PATH:
      dispatch(setPath(payload));
      break;
    case ForClientActions.SET_ALL_USERS_NAME:
      dispatch(setAllUsersNames(payload));
      break;
    case UnitedAction.UPDATE_USER_DATA:
      dispatch(setUser(payload));
      break;
    case AdminActions.START_THE_ROUND:
      socket.send(action);
      break;
    case AdminActions.GO_TO_VOTING:
      socket.send(action);
      break;
    case AdminActions.SHOW_RESULTS:
      socket.send(action);
      break;
    default:
      return next(action);
  }
};

export { socketMiddleware };
