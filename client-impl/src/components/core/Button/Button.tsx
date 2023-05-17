import classNames from 'classnames';
import React, { ReactNode } from 'react';
import s from "./Button.module.css";

interface ButtonProps {
    children: ReactNode;
    onClick?: any;
    type?: "submit"
}

export const Button: React.FC<ButtonProps> = ({
    children,
    ...props
}) => {
  return (
    <button
        className={classNames(
            s.Button,
        )}
        {...props}
    >
        {children}
    </button>
  )
}
