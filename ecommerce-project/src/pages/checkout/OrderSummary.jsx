import dayjs from 'dayjs';
import axios from 'axios';
import { formatMoney } from '../../utils/money';
import { DeliveryOptions } from './DeliveryOptions';

export function OrderSummary({ localCart, deliveryOptions, loadCart }) {
    const handleDeliveryOptionChange = async (productId, deliveryOptionId) => {
        try {
            await axios.put(`/api/cart-items/${productId}`, {
                deliveryOptionId
            });
            await loadCart();
        } catch (err) {
            console.error('Failed to update delivery option:', err);
        }
    };
    return (
        <div className="order-summary">
            {deliveryOptions.length > 0 && localCart.map((cartItem) => {
                // Skip cart items with missing products
                if (!cartItem.product) {
                    return null;
                }

                const selectedDeliveryOption = deliveryOptions.
                    find((deliveryOption) => {
                        return deliveryOption.id === cartItem.deliveryOptionId;
                    });

                const deleteCartItem = async () => {
                        await axios.delete(`/api/cart-items/${cartItem.productId}`);
                        await loadCart();
                };

                const updateCartItem = async () => {
                        const newQuantity = prompt('Enter new quantity (1-10):', cartItem.quantity);
                        if (newQuantity === null) return;
                        
                        const quantity = parseInt(newQuantity);
                        if (isNaN(quantity) || quantity < 1 || quantity > 10) {
                            alert('Please enter a valid quantity between 1 and 10');
                            return;
                        }

                            await axios.put(`/api/cart-items/${cartItem.productId}`, {
                                quantity
                            });
                            await loadCart();
                };

                return (
                    <div key={cartItem.productId}
                        className="cart-item-container">
                        <div className="delivery-date">
                            Delivery date: {dayjs(selectedDeliveryOption.
                                estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                        </div>

                        <div className="cart-item-details-grid">
                            <img className="product-image"
                                src={cartItem.product.image} />

                            <div className="cart-item-details">
                                <div className="product-name">
                                    {cartItem.product.name}
                                </div>
                                <div className="product-price">
                                    {formatMoney(cartItem.product.priceCents)}
                                </div>
                                <div className="product-quantity">
                                    <span>
                                        Quantity: <span className="quantity-label">{cartItem.quantity}</span>
                                    </span>
                                    <span className="update-quantity-link link-primary"
                                        onClick = {updateCartItem}>
                                        Update
                                    </span>
                                    <span className="delete-quantity-link link-primary"
                                        onClick = {deleteCartItem}>
                                        Delete
                                    </span>
                                </div>
                            </div>

                            <DeliveryOptions 
                                deliveryOptions={deliveryOptions} 
                                cartItem={cartItem}
                                loadCart={loadCart}
                                onDeliveryOptionChange={handleDeliveryOptionChange}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}