import axios from 'axios';
import { useState, useRef } from 'react';
import { formatMoney } from '../../utils/money';

export function Product({ product, loadCart }) {
    const selectRef = useRef(null);

    return (
        <div className="product-container"
            data-testid="product-container">
            <div className="product-image-container">
                <img
                    className="product-image"
                    data-testid="product-image"
                    src={product.image}
                />
            </div>

            <div className="product-name limit-text-to-2-lines">
                {product.name}
            </div>

            <div className="product-rating-container">
                <img
                    className="product-rating-stars"
                    data-testid="product-rating-stars-image"
                    src={`images/ratings/rating-${product.rating.stars * 10}.png`}
                />
                <div className="product-rating-count link-primary">
                    {product.rating.count}
                </div>
            </div>

            <div className="product-price">
                {formatMoney(product.priceCents)}
            </div>

            <div className="product-quantity-container">
                <select ref={selectRef} defaultValue="1">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>

            <div className="product-spacer"></div>

            <div className="added-to-cart">
                <img src="images/icons/checkmark.png" />
                Added
            </div>

            <button className="add-to-cart-button button-primary"
                data-testid="add-to-cart-button"
                onClick={async () => {
                    const selectedValue = selectRef.current.value;
                    const finalQuantity = parseInt(selectedValue);
                    
                    try {
                        await axios.post('/api/cart-items', {
                            productId: product.id,
                            quantity: finalQuantity,
                        });
                        await loadCart();
                        // Reset select
                        if (selectRef.current) {
                            selectRef.current.value = "1";
                        }
                    } catch (error) {
                        console.error('Error adding to cart:', error.response?.data || error.message);
                    }
                }}>
                Add to Cart
            </button>
        </div>
    );
}