
import { logout } from "./api/users.js";
import { page,render } from "./lib.js";
import { getUserData } from "./utils.js";
import { showAdminCreateUsr } from "./views/adminCreateUser.js";
import { showAdminEdtUsr } from "./views/adminEditUser.js";
import { showCreateCommnet } from "./views/createCommentView.js";
import { showCreate } from "./views/createView.js";
import { showCatalog } from "./views/dashboardView.js";
import { showRequestDetails } from "./views/detailsView.js";
import { showEditRequest } from "./views/editView.js";
import { sendIapply, showHome } from "./views/homeView.js";
import { listActiveDir } from "./views/listActiveDir.js";
import { showLogin } from "./views/loginView.js";
import { showRegister } from "./views/registerView.js";
import { showResetPassChange } from "./views/resetPassChange.js";
import { showResetPass } from "./views/resetPassView.js";


let main=document.querySelector('main');
let user=document.querySelector('.user');
let guest=document.querySelector('.guest');
let admin=document.querySelector('.admin');
let loagoutUser=document.getElementById('logout');
loagoutUser.addEventListener('click',logoutUser);

let logoutAdmin=document.getElementById('logoutAdmin');
if (logoutAdmin){
    logoutAdmin.addEventListener('click', logoutUser);
}

//document.getElementById('notifications').style.display='none';
renderNav();

page(decorateCtx);
page('/dashboard',showCatalog);
page('/dashboard/:requestId',showRequestDetails);
page('/create',showCreate);
/*page('/profile',showMyProfile);*/
page('/login',showLogin);
page('/register',showRegister);
page('/',showHome);
page('/edit/:id',showEditRequest);
page('/resetPass',showResetPass);
page('/resetPass/:id',showResetPassChange);
page('/comment/create/:id',showCreateCommnet);
page('/changeIApply',sendIapply);
page('/admin', listActiveDir);
page('/admin/:id',showAdminEdtUsr);
page('/createUser',showAdminCreateUsr);
page.start();

function decorateCtx(ctx,next){
  
    ctx.renderView=renderView;
    ctx.renderNav=renderNav;
    next();
}

function renderView(template){
    render(template,main)
}

function logoutUser(ev){
    logout();
    renderNav();
    page.redirect('/')

}

function renderNav(){
let userData=getUserData();
if(!userData){
    user.style.display='none';
    guest.style.display='';
    admin.style.display='none';
}else{

    if(userData.role!='Admin'){
        user.style.display='';
        guest.style.display='none';
        admin.style.display='none';
        document.getElementById('profile').textContent=`${getUserData().email}`;
    }else{
        user.style.display='none';
        guest.style.display='none';
        admin.style.display='';
        document.getElementById('profile').textContent=`${getUserData().email}`;
    }

    
}

}
let mockCtx={};
mockCtx.renderView=renderView;
mockCtx.renderNav=renderNav;
showHome(mockCtx);