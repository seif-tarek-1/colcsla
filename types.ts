import React from 'react';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface ButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'accent' | 'danger' | 'secondary';
  className?: string;
  doubleWidth?: boolean;
}