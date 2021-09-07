import { signin } from "../api"
import { getUserInfo, setUserInfo } from "../localStorage"
import { hideLoading, redirectUser, showLoading, showMessage } from "../utils"

const SigninScreen = {
    after_render: () => {
        const form = document.getElementById('signin-form')
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            showLoading()
            const data = await signin({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
            hideLoading()
            if(data.error){
                showMessage(data.error)
            } else {
                setUserInfo(data)
                redirectUser()
            }
        })
    },
    render: () => {
        if(getUserInfo().name){
            redirectUser()
        }
        return `
        <div class="form-container">
            <form id="signin-form">
                <ul class="form-items">
                    <li>
                        <h1>SIGNIN</h1>
                    </li>
                    <li>
                        <label for="email">EMAIL ADDRESS</label>
                        <input type="email" name="email" id="email" />
                    </li>
                    <li>
                        <label for="password">PASSWORD</label>
                        <input type="password" name="password" id="password" />
                    </li>
                    <li>
                        <button type="submit" class="info">SIGN IN</button>
                    </li>
                    <li>
                        <div>
                            New User?
                            <a href="/#/register">Register</a>
                        </div>
                    </li>
                </ul>
            </form>
        `
    }
}

export default SigninScreen