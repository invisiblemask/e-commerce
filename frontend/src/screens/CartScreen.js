import { getProduct } from "../api";
import { getCartItems, setCartItems } from "../localStorage";
import { parseRequestUrl, rerender } from "../utils"

const addToCart = (item, forceUpdate = false) => {
    let cartItems = getCartItems();
    const exitItem = cartItems.find((x) => x.product === item.product);
    if(exitItem) {
        if(forceUpdate) {
            cartItems = cartItems.map((x) => x.product === exitItem.product ? item : x)
        }
    } else {
        cartItems = [...cartItems, item]
    }
    setCartItems(cartItems)
    if(forceUpdate) {
        rerender(CartScreen)
    }
}

const removeFromCart = (id) => {
    setCartItems(getCartItems().filter((x) => x.product !== id))
    if(id === parseRequestUrl().id){
        document.location.hash = '/cart'
    } else {
        rerender(CartScreen)
    }
}

const CartScreen = {
    after_render: () => {
        const qtySelects = document.getElementsByClassName('qty-select')
        Array.from(qtySelects).forEach((qtySelect) => {
            qtySelect.addEventListener('change', (e) => {
                const item = getCartItems().find((x) => x.product === qtySelect.id)
                addToCart({ ...item, qty: Number(e.target.value) }, true )
            })
        })
        const deleteBtns = document.getElementsByClassName('delete-button')
        Array.from(deleteBtns).forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', () => {
                removeFromCart(deleteBtn.id)
            })
        })
        const checkoutBtn = document.getElementById('checkout-btn')
        checkoutBtn.addEventListener('click', () => {
            document.location.hash = '/signin'
        })
    },
    render: async () => {
        const request = parseRequestUrl();
        if(request.id) {
            const product = await getProduct(request.id)
            addToCart({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                countInStock: product.countInStock,
                qty: 1
            })
        }
        const cartItems = getCartItems()
        return `
            <div class="Cart-screen">
                <div class="cart">
                    <div class="bag">
                        <h2>MY CART</h2>
                        <span>Items are reserved for 60 minutes</span>
                    </div>
                    <div class="cart-view">
                        ${
                            cartItems.length === 0 ?
                            '<div class="cart-message"> You currently have no orders <a href="/#/">Go Shopping</a></div>' : cartItems.map((item) => `
                            <div class="cart-view-cover">
                                <div class="cart-image">
                                    <img src="${item.image}" alt="${item.name}" />
                                </div>
                                <div class="cart-details">
                                    <li>
                                        £${item.price}
                                    </li>
                                    <li>
                                        <a href="/#/product/${item.product}">
                                            ${item.name}
                                        </a>
                                    </li>
                                    <div class="cart-select">
                                        <div class="sect">
                                            <select class="qty-select" id="${item.product}">
                                            ${[...Array(item.countInStock).keys()].map((x) =>
                                                item.qty === x + 1
                                                ? `<option selected value="${x + 1}">${x + 1}</option>`
                                                : `<option  value="${x + 1}">${x + 1}</option>`
                                            )}
                                            </select>
                                        </div>
                                        <button type="button" class="delete-button" id="${item.product}">Remove</button>
                                    </div>
                                </div>
                            </div>
                            `).join('\n')
                        }
                    </div>
                </div>
                <div class="payment">
                    <div class="cart-total">
                        <h3>Sub-total (${cartItems.reduce((a, c) => a + c.qty, 0)})</h3> 
                        <span>£${cartItems.reduce((a, c) => a + c.price * c.qty, 0)}</span>
                    </div>
                    <div class="total">
                        <h1>TOTAL</h1>
                    </div>
                    <div class="sub-total">
                        <h3>Sub-total (${cartItems.reduce((a, c) => a + c.qty, 0)})</h3>
                        <span>£${cartItems.reduce((a, c) => a + c.price * c.qty, 0)}</span>
                    </div>
                    <button id="checkout-btn" class="primary">Checkout</button>
                </div>
            </div>
        `
    }
}

export default CartScreen