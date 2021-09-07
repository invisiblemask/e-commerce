import { getMyOrders, update } from "../api"
import { clearUser, getUserInfo, setUserInfo } from "../localStorage"
import { hideLoading, showLoading, showMessage } from "../utils"

const ProfileScreen = {
    after_render: () => {
        const signoutBtn = document.getElementById('signout-button')
        signoutBtn.addEventListener('click', () => {
            clearUser();
            document.location.hash = '/'
        })
        const registerForm = document.getElementById('profile-form')
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            showLoading()
            const data = await update({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
            hideLoading()
            if(data.error){
                showMessage(data.error)
            } else {
                setUserInfo(data)
                document.location.hash = '/'
            }
        })
    },
    render: async() => {
        const { name, email } = getUserInfo()
        if(!name){
            document.location.hash = '/'
        }
        const orders = await getMyOrders()
        return `
            <div class="content profile">
                <div class="profile-info">
                    <div class="form-container">
                        <form id="profile-form">
                            <ul class="form-items">
                                <li>
                                    <h1>User Profile</h1>
                                </li>
                                <li>
                                    <label for="name">Name</label>
                                    <input type="name" name="name" id="name" value="${name}" />
                                </li>
                                <li>
                                    <label for="email">Email</label>
                                    <input type="email" name="email" id="email" value="${email}" />
                                </li>
                                <li>
                                    <label for="password">Password</label>
                                    <input type="password" name="password" id="password" />
                                </li>
                                <li>
                                    <button type="submit" class="primary">Update</button>
                                </li>
                                <li>
                                    <button type="button" id="signout-button" class="primary">Log out</button>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
                <div class="profile-orders">
                    <table>
                        <thead>
                            <tr>
                                <th>ORDER ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.length === 0 ? `<tr><td colspan="6">No Order Found</tr>` : 
                            orders.map(order => `
                            <tr>
                                <td>${order._id}</td>
                                <td>${order.createdAt}</td>
                                <td>${order.totalPrice}</td>
                                <td>${order.paidAt || 'No'}</td>
                                <td>${order.deliveredAt || 'No'}</td>
                                <td><a href="/#/order/${order._id}">DETAILS</a></td>
                            </tr>
                            `).join('\n')
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        `
    }
}

export default ProfileScreen