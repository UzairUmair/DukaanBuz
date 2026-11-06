const formatter = new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 });
export const formatPKR = (value) => formatter.format(Number(value) || 0).replace('PKR', 'Rs.');
