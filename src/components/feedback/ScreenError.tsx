import React, { memo } from 'react';
import { InlineFeedback } from '../ui/InlineFeedback';

type Props = {
  message: string;
  actionLabel?: string;
  onRetry?: () => void;
};

export const ScreenError = memo(
  ({ message, actionLabel = 'Retry', onRetry }: Props) => {
    return (
      <InlineFeedback
        type="error"
        message={message}
        actionLabel={onRetry ? actionLabel : undefined}
        onAction={onRetry}
      />
    );
  },
);
