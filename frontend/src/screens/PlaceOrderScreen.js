import { createOrder } from "../api";
import CheckoutSteps from "../components/CheckoutSteps";
import { cleanCart, getCartItems, getPayment, getShipping } from "../localStorage"
import { hideLoading, showLoading, showMessage } from "../utils";

const convertCartToOrder = () => {
    const orderItems = getCartItems();
    if(orderItems.length === 0){
        document.location.hash = '/cart'
    }
    const shipping = getShipping()
    if(!shipping.address){
        document.location.hash = '/shipping'
    }
    const payment = getPayment()
    if(!payment.paymentMethod){
        document.location.hash = '/payment'
    }
    const itemsPrice = orderItems.reduce((a, c) => a + c.price * c.qty, 0)
    const shippingPrice = itemsPrice > 100 ? 0 : 10
    const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100
    const totalPrice = itemsPrice + shippingPrice + taxPrice
    return {
        orderItems,
        shipping,
        payment,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    }
}

const PlaceOrderScreen = {
    after_render: async () => {
        const placeorderBtn = document.getElementById('placeholder-button')
        placeorderBtn.addEventListener('click', async () => {
            const order = convertCartToOrder()
            showLoading()
            const  data = await createOrder(order)
            hideLoading()
            if(data.error){
                showMessage(data.error)
            } else {
                cleanCart()
                document.location.hash = `/order/${data.order._id}`
            }  
        }) 
    },
    render: () => {
        const {
            orderItems,
            shipping,
            payment,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        } = convertCartToOrder();
        return `
        <div>
            ${CheckoutSteps.render({ step1: true, step2: true, step3: true, step4: true })}
            <div class="top">
                <h1>CHECKOUT</h1>
            </div>
            <div class="order">
                <div class="order-info">
                    <div class="order-address">
                        <h2>DELIVERY ADDRESS</h2>
                        <div class="order-address-details">
                            <li>
                                ${shipping.address}
                            </li>
                            <li>
                                ${shipping.city}
                            </li>
                            <li>
                                ${shipping.postalCode}
                            </li>
                            <li>
                                ${shipping.country}
                            </li>
                        </div>
                    </div>
                    <div class="order-pay">
                        <h2>PAYMENT</h2>
                        <div>
                            Payment Type : ${payment.paymentMethod}
                        </div>
                    </div>
                    <div class="order-list-container">
                        <div>
                            <h2>SHOPPING CART</h2>
                        </div>
                        <ul>
                            ${
                                orderItems.map(item => `
                                <div class="order-view-cover">
                                    <div class="cart-image">
                                        <img src="${item.image}" alt="${item.name}" />
                                    </div>
                                    
                                    <div class="order-details">
                                        <li>
                                            <a href="/#/product/${item.product}">${item.name}</a>
                                        </li>
                                        <li>
                                            £${item.price}
                                        </li>
                                        <li> 
                                            Qty: ${item.qty}
                                        </li>
                                    </div>
                                </div>
                                `).join('\n')
                            }
                        </ul>
                    </div>
                </div>
                <div class="order-total">
                    <div>
                        <h2>ORDER</h2>
                    </div>
                    <ul>
                        <div class="total-price">
                            Items
                            <span>£${itemsPrice}</span>
                        </div>
                        <div class="total-price">
                            Shipping
                            <span>£${shippingPrice}</span>
                        </div>
                        <div class="total-price">
                            Tax
                            <span>£${taxPrice}</span>
                        </div>
                        <div class="total-price total">
                            Order Total
                            <span>£${totalPrice}</span>
                        </div>
                        <div class="order-btn">
                            <button id="placeholder-button" class="info" fw>Place Order</button>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
        `
    }
}

export default PlaceOrderScreen