const formatter = new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0, maximumFractionDigits: 2 });
export const formatPKR = (value) => formatter.format(Number(value) || 0).replace('PKR', 'Rs.');
