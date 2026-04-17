import React from 'react';
import { InlineFeedback } from '../ui/InlineFeedback';

type Props = {
  message: string;
  actionLabel?: string;
  onRetry?: () => void;
};

export const ScreenError = ({
  message,
  actionLabel = 'Retry',
  onRetry,
}: Props) => {
  return (
    <InlineFeedback
      type="error"
      message={message}
      actionLabel={onRetry ? actionLabel : undefined}
      onAction={onRetry}
    />
  );
};
