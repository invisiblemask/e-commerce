import Header from "./components/Header";
import CartScreen from "./screens/CartScreen";
import DashboardScreen from "./screens/DashboardScreen";
import Error404Screen from "./screens/Error404Screen";
import HomeScreen from "./screens/HomeScreen";
import OrderScreen from "./screens/OrderScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceorderScreen";
//import ProductEditScreen from "./screens/ProductEditScreen";
//import ProductListScreen from "./screens/ProductListScreen";
import ProductScreen from "./screens/ProductScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import SigninScreen from "./screens/SigninScreen";
import { hideLoading, parseRequestUrl, showLoading } from "./utils";

const routes =  {
    '/': HomeScreen,
    //'/product/:id/edit': ProductEditScreen,
    '/product/:id': ProductScreen,
    '/cart/:id': CartScreen,
    '/cart': CartScreen,
    '/signin': SigninScreen,
    '/register': RegisterScreen,
    '/profile': ProfileScreen,
    '/shipping': ShippingScreen,
    '/payment': PaymentScreen,
    '/placeorder': PlaceOrderScreen,
    '/order/:id': OrderScreen,
    '/dashboard': DashboardScreen,
    //'/productlist': ProductListScreen
}
const router = async () => {
    showLoading()
    const request = parseRequestUrl()
    const parseUrl = (request.resource ? `/${request.resource}` : '/') + (request.id ? '/:id' : '') + (request.verb ? `/${request.verb}` : '')
    const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
    const header = document.getElementById('header-container')
    header.innerHTML = Header.render()
    await Header.after_render()
    const main = document.getElementById('main-container');
    main.innerHTML = await screen.render();
    if(screen.after_render) await screen.after_render();
    hideLoading()
}

window.addEventListener("load", router)
window.addEventListener("hashchange", router)