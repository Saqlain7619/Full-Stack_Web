const generateOrderNumber = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2,6).toUpperCase();
  return `ORD-${ts}-${rand}`;
};
const paginate = (page=1, limit=12) => {
  const take = Math.min(parseInt(limit),50);
  const skip = (parseInt(page)-1)*take;
  return { take, skip };
};
module.exports = { generateOrderNumber, paginate };
