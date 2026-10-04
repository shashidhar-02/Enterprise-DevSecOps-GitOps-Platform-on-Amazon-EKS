const { HttpError, positiveId } = require('./security');

function priceOrder(items, dishes) {
  const quantities = new Map();
  for (const item of items) {
    const id = positiveId(item?.id);
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      throw new HttpError(400, 'Quantity must be between 1 and 99');
    }
    const quantity = (quantities.get(id) || 0) + item.quantity;
    if (quantity > 99) throw new HttpError(400, 'Combined quantity cannot exceed 99');
    quantities.set(id, quantity);
  }
  const pricedItems = [];
  let subtotal = 0;
  for (const [id, quantity] of quantities) {
    const dish = dishes.find((row) => row.id === id);
    if (!dish) throw new HttpError(400, 'Dish does not belong to this restaurant');
    const price = String(dish.price);
    if (!/^\d+(\.\d{1,2})?$/.test(price)) throw new Error('Invalid catalogue price');
    const [whole, fraction = ''] = price.split('.');
    const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
    subtotal += cents * quantity;
    if (!Number.isSafeInteger(subtotal) || subtotal > 9999990000) throw new HttpError(400, 'Order amount exceeds limit');
    pricedItems.push({ id, name: dish.name, price, quantity });
  }
  return { items: pricedItems, total: ((subtotal + 4500 + 2000) / 100).toFixed(2) };
}

module.exports = { priceOrder };
