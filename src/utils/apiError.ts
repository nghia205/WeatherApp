export const FORBIDDEN_ERROR_MESSAGE =
  'Bạn không có quyền để thực hiện hành động này.';

export const isForbiddenError = (error: unknown) => {
  if (typeof error !== 'object' || error === null) return false;

  const maybeError = error as {
    message?: string;
    response?: {
      status?: number;
    };
  };

  return (
    maybeError.response?.status === 403 ||
    maybeError.message === FORBIDDEN_ERROR_MESSAGE ||
    maybeError.message?.includes('status code 403') === true
  );
};
