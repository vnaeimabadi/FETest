export const getExchangeCurrency = url =>
  fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
