import React from 'react'
import { Button } from '../../components/core/Button/Button';
import s from "./AdminScreen.module.css";
import { useAppDispatch } from '../../app/hooks';
import { AdminActions } from '../../Shared';
import { Input } from '../../components/core/Input/Input';
import { Text } from '../../components/core/Text/Text';

export default function AdminScreen() {
  const dispatch = useAppDispatch();
  const [monkeysNumber, setMonkeysNumber] = React.useState(1);

  function handleRoundStart() {
    dispatch({
      type: AdminActions.START_THE_ROUND,
      payload: monkeysNumber
    });
  }

  function handleVotingStart() {
    dispatch({type: AdminActions.GO_TO_VOTING});
  }

  function showRoundResults() {
    dispatch({ type: AdminActions.SHOW_RESULTS });
  }

  return (
    <div className={s.AdminScreen}>
      <Text tag='h1'>Monkeys number:</Text>
      <div className={s.AdminScreen__counter}>
        <Button onClick={() => setMonkeysNumber(prev => prev - 1)}>-</Button>
        <Input type="number" value={monkeysNumber} />
        <Button onClick={() => setMonkeysNumber(prev => prev + 1)}>+</Button>
      </div>
      <Button onClick={handleRoundStart}>Run the Round</Button>
      <Button onClick={handleVotingStart}>Run the Voting</Button>
      <Button onClick={showRoundResults}>Show current results</Button>
    </div>
  )
}
