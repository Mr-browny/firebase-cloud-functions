document.addEventListener("DOMContentLoaded", ()=> {
    const [ switcher, authModal, authWrapper, signUpForm, loginForm, signOut ] = [
        document.querySelectorAll('.switch'),
        document.querySelectorAll('.auth .modal'),
        document.querySelector('.auth'),
        document.querySelector('.register'),
        document.querySelector('.login'),
        document.querySelector('.sign-out'),

    ];

    // toggle auth modals
    switcher.forEach(link => {
        link.addEventListener('click', () => { 1
            authModal.forEach(modal => modal.classList.toggle('active'))
        })
    })

    // Register Form
    signUpForm.addEventListener('submit', (e)=> {
        e.preventDefault(); 

        const email  = signUpForm.email.value;
        const password  = signUpForm.password.value;

        // Utilizing the firebase, linked in the index.html
        firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then( user => {
            console.log('Registered ', user);
            signUpForm.reset(); 
        })
        .catch(error => {
            signUpForm.querySelector('.error').textContent =  error.message;
            setTimeout(() => {
                signUpForm.querySelector('.error').textContent =  ''
                
            }, 5000);
        })
    })

    // Login Form
    loginForm.addEventListener('submit', (e)=> {
        e.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
            console.log("Logged in ", user)
            loginForm.reset()
        })
        .catch(error => {
            loginForm.querySelector('.error').textContent = error.message
            setTimeout(() =>{
                loginForm.querySelector('.error').textContent = ""
            }, 5000)
        })
    })

    // Sign Out
    signOut.addEventListener('click', () => {
        firebase
        .auth()
        .signOut()
        .then( result => console.log('Oops!!! Signed Out.'))
    })


    // Auth State listener

    firebase
    .auth()
    .onAuthStateChanged( (user) => {
        if (user) {
            // User is logged in
            authWrapper.classList.remove('open');
            authModal.forEach(modal => modal.classList.remove('active'))
        }else{
            // User is logged out
            authWrapper.classList.add('open');
            authModal[0].classList.add('active')
        }
    })

















})