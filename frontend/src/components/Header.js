import { getUserInfo } from "../localStorage"

const Header = {
    render: () => {
        const { name, isAdmin } = getUserInfo()
        return `
        <div class="logo">
            <a href="/#/"><i class="fas fa-tshirt"></i></a>
        </div>
        <div class="container">
            <input type="text" name="" placeholder="search">
            <a class="search" href=""><i class="material-icons">search</i></a>
        </div>
        <div class="icons">
            ${
                name ? 
                `<a href="/#/profile"><i class="fas fa-user"></i>${name}</a>` 
                : 
                `<a href="/#/signin"><i class="far fa-user"></i>Login</a>`
            }
            <a href="/#/cart"><i class="fas fa-shopping-cart"></i>Bag</a>
            ${isAdmin ? `<a href="/#/dashboard">Dashboard</a>` : ''}
        </div>
        `
    },
    after_render: () => {}
}

export default Header