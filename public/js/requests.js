document.addEventListener('DOMContentLoaded', () => {
    const notify = document.querySelector('.notification')
    let vm = new Vue({
        el: '#app',
        data: {
            requests: []
        },
        mounted(){ 
            // i'm able to use firebase.firestore() because, when this request.js script is imported, 
            // the firebase is already present above of it
            const ref = firebase.firestore().collection('request').orderBy('upvotes', 'desc');
        
            ref.onSnapshot(snapshot => {
                let requests = []
                snapshot.forEach(doc => {
                    requests.push({
                        ...doc.data(),
                        id: doc.id
                    })
                }); 
                this.requests = requests
            })
        },
        methods: {
            upvoteRequeest(id, text){
               const upvote = firebase.functions().httpsCallable('upvote');

               upvote({ id, text  })
               .then(() => { 
                   notify.textContent = "Voting Successful";
                   notify.classList.add('active', 'success'); 
                   setTimeout(() => {
                    notify.textContent = "";
                    notify.classList.remove('active', 'success'); 
                       
                   }, 4000);
               })
               .catch(error => { 
                   notify.textContent = error.message
                   notify.classList.add('active', 'error')
                   
                   setTimeout(() => {
                       notify.textContent = ''
                       notify.classList.remove('active', 'error')
                   }, 3000)
               })
            }
        }
    })
})