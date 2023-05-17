import React from "react";
import s from './App.module.css';
import WelcomeScreen from './screens/WelcomeScreen/WelcomeScreen';
import AllUsersScreen from './screens/AllUsersScreen/AllUsersScreen';
import AllUsersVoteScreen from './screens/AllUsersVoteScreen/AllUsersVoteScreen';
import CardScreen from './screens/CardScreen/CardScreen';
import RewardingScreen from './screens/RewardingScreen/RewardingScreen';
import AdminScreen from './screens/AdminScreen/AdminScreen';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { WebsocketActions } from './utils/websocketMiddleware';
import { selectConnectionState, selectIsAdmin, selectPath } from './redux/selectors';
import { Routes } from "./Shared";

function App() {
  const dispatch = useAppDispatch();
  const connectionState = useAppSelector(selectConnectionState);
  const path = useAppSelector(selectPath);
  const isAdmin = useAppSelector(selectIsAdmin);

  function handleVisibility() {
    if (document.visibilityState === "visible") {
      dispatch({type: WebsocketActions.CONNECT_TO_WS});
      console.log("connecting...");
    } else {
      dispatch({type: WebsocketActions.DISCONNECT_FROM_WS});
      console.log("diconnecting...");
    }
  }


  React.useEffect((): any => {
    dispatch({type: WebsocketActions.CONNECT_TO_WS});

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      dispatch({type: WebsocketActions.DISCONNECT_FROM_WS});
    }
  }, []);

  function CurrentScreen() {
    if (isAdmin) {
      return <AdminScreen />;
    }
    switch (path) {
      case Routes.WELCOME:
        return <WelcomeScreen />
      case Routes.USERS:
        return <AllUsersScreen />
      case Routes.CARD:
        return <CardScreen />
      case Routes.VOTE:
        return <AllUsersVoteScreen />
      case Routes.REWARDING:
        return <RewardingScreen />
      default:
        return <div>No screen</div>
    }
  }

  return (
    <div className={s.App}>
      {/* <h1>{connectionState}</h1>
      <h2>{path}</h2>
      <h3>{isAdmin ? "Admin" : "RegularUser"}</h3>
      <hr /> */}
      <CurrentScreen />
    </div>
  );
}

export default App;
