import React from 'react';
import { InlineFeedback } from '../ui/InlineFeedback';

type Props = {
  message: string;
};

export const ScreenError = ({ message }: Props) => {
  return <InlineFeedback type="error" message={message} />;
};
