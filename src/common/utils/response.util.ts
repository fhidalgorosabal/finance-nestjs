export function responseData(data: any, message: string, code = 200, status = 'success') {
  return {
    status,
    message,
    data,
    code,
  };
}

export function responseError(error: any, message: string, code = 500, status = 'error') {
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
