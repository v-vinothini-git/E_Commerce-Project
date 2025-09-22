document.addEventListener('DOMContentLoaded',()=>{

let roundBtns = document.querySelectorAll('.round');
let ind=0;
let timerId;
let loggedIn = localStorage.getItem('isLoggedIn');

if(loggedIn === "true") 
{
    showProfile();
    
}

roundBtns.forEach((button,index)=>{
    button.addEventListener('click',()=>{
        slideLeft(index);
        //ind = index;
        //clearInterval(timerId);// Clear the timer on click
        //timerId = setInterval(autoSlide, 5000);
    });
});

function slideLeft(i)
{
    roundBtns.forEach((button)=>{
        button.classList.remove('active');
    });
    roundBtns[i].classList.add('active');
    let translateValue = -100*i;
    document.querySelector('.advertisement_banner_list').style.transform = `translateX(${translateValue}%)`;
    ind=ind+1;
    if(ind === roundBtns.length)
    {
        ind=0;
    }
}
timerId = setInterval(()=>{
   slideLeft(ind); 
},5000);

let navBar = document.querySelector('.navigation_bar');
let OfferText = document.querySelector('.offer-text');
let isNavBarFixed = false;
let navBarHeight = navBar.offsetHeight;

//console.log(navBarHeight);

window.addEventListener('scroll',()=>{

    let scrollPosition = window.scrollY;
    let navBarPositions = navBar.getBoundingClientRect();

    if(navBarPositions.top <=0)
    {
        navBar.classList.add('fixed');
        isNavbarFixed = true;
        OfferText.style.marginBottom = navBarHeight+'PX';  
    }
    else{
        navBar.classList.remove('fixed');
        isNavbarfixed = false;
        OfferText.style.marginBottom ='0';
    }
    if(scrollPosition<=55)
    {
        navBar.classList.remove('fixed');
        isNavbarfixed = false;
        OfferText.style.marginBottom ='0'; 
    }
});

});

function showProfile()
{
    let profile_icon = document.querySelector('.profile_icon');
    let login_btn = document.querySelector('.login_btn');

    if(profile_icon.style.display === "none")
        //if (localStorage.getItem('isLoggedIn') === 'true')
    {
        profile_icon.style.display = "block";
        login_btn.style.display = "none";
    }
    else
    {
        profile_icon.style.display = "none";
        login_btn.style.display = "block";

    }
}

function redirectToLogin()
{
    if(document.querySelector('.profile_icon').style.display === "block")
        localStorage.setItem('isLoggedIn',"false");
        window.location.href = "/api/auth/login";
    //location.reload();

}

async function createUser(e) 
{
    e.preventDefault();

    let userName = document.querySelector('#userName').value;
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    
    let response =await fetch('/api/auth/register',{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({userName,email,password}),
    });
    if(response.ok)
    {
        window.location.href = "/api/auth/login";
    }

}
function goToRegisterPage()
{
    window.location.href = "/api/auth/register";
}

 async function loginValidation(e)
{
    e.preventDefault();

    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    
    const response = await fetch('/api/auth/login',{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({email,password}), 

    });
    const data = await response.json();

    if(response.ok)
    {
        localStorage.setItem('userId',data.result[0].userId);
        localStorage.setItem('isLoggedIn','true');
        window.location.href = "/";
    }

}
 async function openCart()
{
    //window.location.href="/api/cart/open";
    const userId = localStorage.getItem('userId');
    const response = await fetch(`/api/cart/${userId}`,{
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
        }, 

    });
    const data = await response.json();

    localStorage.setItem("cartItems",JSON.stringify(data.result));
    console.log(localStorage.getItem('cartItems'));
    window.location.href = '/api/cart/open';
}
function addToCart(button)
{
   const product = button.closest('.product');
   const userId =  localStorage.getItem('userId');
   const pid = product.dataset.productId;

   const cartItem = {
    userId :userId,
    pid : pid,
    quantity : 1,
   }

    updateCartDatabase(cartItem);
}
 async function updateCartDatabase(cartItem)
{
    const response = await fetch('/api/cart/add',{
        method : 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({cartItem}),
    });
}
  