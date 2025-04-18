// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function responseData(data: any, message: string, code = 200, status = 'success') {
  return {
    status,
    message,
    data,
    code,
  };
}

export function responseError(
  error: {code: number; message: string}, 
  message: string, 
  code = 500, 
  status = 'error'
) {
  const errors =
    typeof error === 'string'
      ? { error }
      : { error: error?.message || 'Ocurrió un error inesperado.' };

  return {
    status,
    message,
    errors,
    code,
  };
}
