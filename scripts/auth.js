/*
This file will contain all the JS that will communicate with 
the firebase firestore database and also firebase auth
*/


// real-time listener
auth.onAuthStateChanged(user => {
    //  if the user was logged out, then user will be null
    //  if they were logged in, then we will see the email of who the user is
        if (user) {
        // get data if a valid user is logged in
            setupUI(user);      // display correct links
            db.collection('logs').onSnapshot(snapshot => {
                let changes = snapshot.docChanges();
                // based on change made, either add to display or remove from display
                changes.forEach(change => {
                   if (change.type == 'added') {
                       renderLog(change.doc)
                    }
                    else if (change.type == 'removed') {
                        // finding the li in the DOM of the document that was just removed
                        let li = logList.querySelector('[data-id=' + change.doc.id + ']');
                        // remove this li from the ul
                        logList.removeChild(li);
                    }
                    else if (change.type == 'modified') {
                        // finding the li in the DOM of the document that was just removed
                        let li = logList.querySelector('[data-id=' + change.doc.id + ']');
                        // returns an array of all the children elements of the li tag
                        let children = li.children;
                        // gets the new updated time
                        let newTime = change.doc.data().time;
                        // sets this new time to display on the screen
                        console.log("old time" + children[1].innerHTML);
                        children[1].innerHTML = newTime;
                        console.log("new time" + children[1].innerHTML);
                    }
                })
            });
        }
        else {
            setupLogs([]);
            setupUI();  // don't send anything so it will evaluate to false in the method
        }
    });




// create new work log
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('logs').add({
        name: createForm['name'].value,
        time: createForm['time'].value
    }).then(()=> {
        // close modal and reset after data has been added
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset(); 
    }).catch(err => {
        console.log(err.message);
        // this will catch any errors that might come back from firebase when I try to 
        // add, and if it doesn't work, then it will log the error message
    })
})

// signup
// first get a reference to the signup form in the DOM using its id "signup-form"
const signupForm = document.querySelector('#signup-form');

// When a user clicks the button, that will submit the form
signupForm.addEventListener('submit', (e) => {
    // first we want to prevent the default action of a refresh
    // the event object (e) is automatically passed into the callback function
    e.preventDefault();
    // get user info from the fields and pass in id of desired field inside [ ]
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user using a method from firebase auth services
    // this is an async task and therefore it takes a sec to complete
    // because of that, we can tack on a .then function that will do something
    // AFTER this is completed.

    // cred is a user credential token
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return  db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value,
            admin: false
        });
    }).then(() => {
        // at this point we have added the user AND added their bio do a diff collection
         // get a reference to the open modal
         const modal = document.querySelector('#modal-signup');
         // using the Material library methods, we close the modal
         M.Modal.getInstance(modal).close();
         // call the JS method reset to clear the form
         signupForm.reset(); 
    });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    clearLogs();        // this works the first time, the problem is then it always stays
});



// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // prevents page from reloading

    // get user info from the form
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // use auth method with the email and password
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        
        // get a reference to the open modal
        const modal = document.querySelector('#modal-login');
        // using the Material library methods, we close the modal
        M.Modal.getInstance(modal).close();
        // call the JS method reset to clear the form
        loginForm.reset(); 
    });
});



// setup materialize components
// you only need this if you are using the Materialize styling 
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
  });
