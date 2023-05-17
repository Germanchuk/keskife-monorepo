import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentAction, selectIsMonkey } from '../../redux/selectors';
import s from "./CardScreen.module.css";

export default function CardScreen() {
    const [isFront, setIsFront] = React.useState(false);
    const isMonkey = useAppSelector(selectIsMonkey);
    const gameAction = useAppSelector(selectCurrentAction);
    const cardClass = isFront ? "" : s.flip;

    function toggleCard() {
      setIsFront(prev => !prev);
    }

  return (
    <div className={s.CardScreen}>
      <div className={`${s.card} ${cardClass}`} onClick={toggleCard}>
        <div className={s.content}>
          <div className={s.front}>
            <div className={s.frontInner}>
              <div className={s.frontInner__inner}>
                {isMonkey ? "Ти мавпочка" : gameAction}
              </div>
            </div>
          </div>
          <div className={s.back}>
            <div className={s.backInner}>
              Клікни, щоб перегорнути
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
