import { getProduct } from "../api"
import { hideLoading, parseRequestUrl, showLoading } from "../utils"

const ProductScreen = {
    after_render: () => {
        const request = parseRequestUrl()
        const cartBtn = document.getElementById("add-button")
        cartBtn.addEventListener('click', () => {
            document.location.hash = `/cart/${request.id}`
        })
    },
    render: async () => {
        const request = parseRequestUrl()
        showLoading()
        const product = await getProduct(request.id)
        if(product.error){
            return (`<div>${product.error}</div>`)
        }
        hideLoading()
        return `
        <div class="content">
            <div class="link-display">
                <a href="/#/"><i class="fas fa-angle-left"></i>Back</a>
            </div>
            <div class="img-display">
                <img src="${product.image}" alt="${product.name}"/>
            </div>
            <div class="details">
                <ul>
                    <li>
                        <h1>${product.name}</h1>
                    </li>
                    <li>
                        <strong>£${product.price}</strong>
                    </li>
                    <li>
                        <div class="sizes">
                            <label for="size">Size:</label>
                            <select name="product" id="cat-product">
                                <option value="">Please select</option>
                                <option value="">XS</option>
                                <option value="">S</option>
                                <option value="">L</option>
                                <option value="">XL</option>
                            </select>
                        </div>
                    </li>
                    <button id="add-button" class="info">ADD TO BAG</button>
                </ul>
                <div class="action-details">
                    <ul>
                        <li>
                            ${product.price > 50 && product.countInStock > 0 ? `<span>Free Delivery</span>` : `<span>No Free Delivery</span>`}
                        </li>
                        <li>
                            ${product.countInStock > 0 ? `<span class="success">Available</span>` : `<span class="error">Unavailable</span>`}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        `
    }
}

export default ProductScreen                