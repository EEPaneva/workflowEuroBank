import { get, post } from '../api/api.js';
import { loadFormData } from '../api/handleFormData.js';
import { html,repeat } from '../lib.js';
import { setUserData } from '../utils.js';
import { errorHandler } from './errorHandler.js';

let registerTemplate=()=>html`<section id="register">
<div class="form">
  <h2>Регистрация на потребител</h2>
  <form @submit=${submitRegisterForm} class="login-form">
    <input
      type="text"
      name="email"
      id="register-email"
      placeholder="email"
    />
    <input
      type="password"
      name="password"
      id="register-password"
      placeholder="password"
    />
    <input
      type="password"
      name="re-password"
      id="repeat-password"
      placeholder="repeat password"
    />
    <button type="submit">Регистрация</button>
    <p class="message">Вече сте регистриран? <a href="/login">Вход</a></p>
    <p class="message">
      Забравена парола? <a href="/resetPass">Натиснете тук, за да възстановите паролата си</a>
    </p>
  </form>
</div>
</section>`

let outerCtx=null;
export async function showRegister(ctx){
    outerCtx=ctx
    try{
        ctx.renderView(registerTemplate());
    }catch(error){
        errorHandler(error);
    }

}

async function submitRegisterForm(ev){
    ev.preventDefault();
    try {
        let data=loadFormData(ev.target);
        if (data.password!=data[`re-password`]){
            throw new Error('Passwords do not match!');
        }
        let serverResponseData=await post('/users/register',data);
        setUserData(serverResponseData);
        ev.target.reset();
        outerCtx.renderNav();
        outerCtx.page.redirect('/')
    } catch (error) {
        errorHandler(error);
    }


}