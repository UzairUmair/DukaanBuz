export const whatsappUrl = ({ number, product, price, link }) => {
  const digits = String(number || '').replace(/\D/g, '');
  const message = `Assalamualaikum! I am interested in ${product}, priced at ${price}. Is this product available? ${link}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};
