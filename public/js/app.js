document.addEventListener("DOMContentLoaded", ()=> { 
    const [ rModal, rLink, requestTutorial ] = [
        document.querySelector('.new-request'),
        document.querySelector('.add-request'), 
        document.querySelector('.new-request form'),
    ]
    
    // Open modal
    rLink.addEventListener('click', ()=> {
        rModal.classList.add('open');
    });

    rModal.addEventListener('click', (e)=> {
        return e.target.classList.contains('new-request') ?    rModal.classList.remove('open') : rModal.classList.add('open')
    });

 
    // Request form
    requestTutorial.addEventListener('submit', (e) => {
        e.preventDefault();

        const addRequest = firebase.functions().httpsCallable('addRequest')

        addRequest({
            text: requestTutorial.request.value /* Grabbing the input field in the requestTutorial form */
        })
        .then(() => {
            requestTutorial.reset();
            rModal.classList.remove('open')
            requestTutorial.querySelector('.error').textContent = ''
        })
        .catch(error => {
            requestTutorial.querySelector('.error').textContent = error.message
        })
    })

    






})