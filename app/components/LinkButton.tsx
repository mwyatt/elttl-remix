import React from "react";
import { Link } from "react-router";
import classNames from "classnames";
import {buttonPrimaryClassNames, buttonSecondaryClassNames} from "~/styles/ui-classes";

export default function LinkButton({
  to,
  theme = 'primary',
  size,
  children,
  target,
  className = ''
}: {
  to: string;
  theme?: 'primary' | 'secondary';
  size?: 'large' | 'small';
  children: React.ReactNode;
  target?: string;
  className?: string;
}) {
  return (
    <Link to={to} className={classNames({
      [buttonPrimaryClassNames]: theme === 'primary',
      [buttonSecondaryClassNames]: theme === 'secondary',
      ['text-lg']: size === 'large',
      ['text-sm']: size === 'small',
      [className]: true
    }) }
    target={target}>
      {children}
    </Link>
  );
}
