import { getOrder, getPaypalClientId, payOrder } from "../api";
import { hideLoading, parseRequestUrl, rerender, showLoading, showMessage } from "../utils";

const addPayPalSDK = async (totalPrice) => {
    const clientId = await getPaypalClientId()
    showLoading()
    if(!window.paypal){
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypalobjects.com/api/checkout.js'
        script.async = true
        script.onload = () => handlePayment(clientId, totalPrice)
        document.body.appendChild(script)
    } else {
        handlePayment(clientId, totalPrice)
    }
}

const handlePayment = (clientId, totalPrice) => {
    window.paypal.Button.render({
        env: 'sandbox',
        client: {
            sandbox: clientId,
            production: ''
        },
        locale: 'en_US',
        style: {
            size: 'responsive',
            color: 'blue',
            shape: 'pill'
        },
        commit: true,
        payment(data, actions){
            return actions.payment.create({
                transactions: [
                    {
                        amount: {
                            total: totalPrice,
                            currency: 'USD'
                        }
                    }
                ]
            })
        },
        onAuthorize(data, actions){
            return actions.payment.execute().then(async() => {
                showLoading()
                await payOrder(parseRequestUrl().id, {
                    orderID: data.orderID,
                    payerID: data.payerID,
                    paymentID: data.paymentID
                })
                hideLoading()
                showMessage('Payment was successful.', () => {
                    rerender(OrderScreen)
                })
            })
        }
    }, 
    '#paypal-button'
    ).then(() => {
        hideLoading()
    })
}

const OrderScreen = {
    after_render: async () => {},
    render: async () => {
        const request = parseRequestUrl()
        const {
            shipping,
            payment,
            orderItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            isDelivered,
            deliveredAt,
            isPaid,
            paidAt
        } = await getOrder(request.id)
        if(!isPaid){
            addPayPalSDK(totalPrice)
        }
        return `
        <div>
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
                        ${isDelivered 
                            ? `<div class="success">Delivered at ${deliveredAt}</div>` 
                            
                            : `<div class="error">Not Delivered</div>`
                        }
                    </div>
                    <div class="order-pay">
                        <h2>PAYMENT</h2>
                        <div>
                            Payment Type : ${payment.paymentMethod}
                        </div>
                        ${isPaid 
                            ? `<div class="success">Paid at ${paidAt}</div>` 
                            
                            : `<div class="error">Not Paid</div>`
                        }
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
                            <div id="paypal-button" class="fw"></button>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
        `
    }
}

export default OrderScreen