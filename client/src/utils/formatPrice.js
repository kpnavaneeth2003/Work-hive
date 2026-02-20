export const formatPrice = (price) => {
  if (!price && price !== 0) return "₹ 0";
  return `₹ ${Number(price).toLocaleString("en-IN")}`;
};
