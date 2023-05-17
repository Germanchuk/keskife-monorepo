import classNames from 'classnames';
import React, { ReactNode } from 'react';
import s from "./Text.module.css";

interface TextProps {
    children: ReactNode;
    tag?: "p" | "h1";
}

export const Text: React.FC<TextProps> = ({
    children,
    tag = "p"
}) => {
    const Tag = tag;
  return (
    <Tag
        className={classNames(
            s.Text,
        )}
    >
        {children}
    </Tag>
  )
}
