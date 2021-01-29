/*
LISTENS FOR CHANGE OF AUTH STATE AND HANDLES CHANGE ACCORDINGLY WITH REALTIME LISTENER

This file will contain all the JS that will communicate with 
the firebase firestore database and also firebase auth that is needed to authenticate
authorized users.  If you don't use auth, then some of this code is not needed.
*/

auth.onAuthStateChanged(user => {
    //  if the user was logged out, then user parameter will be null
    //  if the user is logged in, then user parameter will equal a reference to their account (auth token)

        if (user) {
        // get data if a valid user is logged in
            setupUI(user);      // display correct links in navbar based on login status

            /*
            In this section of code, we are getting the logs collection and then calling the onSnapshot method.
            This will grab a current snapshot of the state of the database.  This is done every time there is a
            change to the database, but only if the user is logged in.

            Because we are using the onSnapshot method, this will execute every time there is a change to the database.  
            This will be what causes our web app to update in real time.  So IF the user is logged in, and a change is made,
            then the user will see it on the web app.

            The parameter snapshot refers to a current static copy of the database at this exact moment in time.
            docChanges is a method that is called of the snapshot and we are using a for each loop to cycle through
            all the changes for each entry of the log.  If the change was 'added', we need to call renderLog to add a 
            new Student <li> entry to our display.  If the change was 'removed', we need to query that specific <li> tag
            from the DOM and remove it so it is removed from the display.  If you were also allowing the display to update
            in realtime, then you would have another option here for 'modified'.

            The else statement for the top function is what to do if the user is NOT logged in.  In this case
            we want to make sure that the logs do NOT display and that the UI displays the appropriate links to Log in or 
            Sign up
            */
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
                    // if an entry was updated, the change type is 'modified'
                    // if you wanted to listen for changes in the db, you'd need this added it if statement
                })
            });
        }
        else {
            setupUI();  // don't send anything so it will evaluate to false in the method
            setupLogs([]);
        }
    });


/*
    LOGIN FUNCTIONALITY

    In this section of code we are first getting a reference to the login form in the DOM
    We then add an action listener so that we are ready for changes made and when the user
    submits the action to log in, we are telling it how to act.  We tell it to prevent the
    default action of a refresh/reload after the submit button was pressed.

    We get the values entered into the form using the array notation to access the properties
    of the form using the id value of each <input> tag and then accessing the value at that spot

    We then call the signIn method for firebase auth.  This is an async method, meaning it 
    takes some time to do (not much, but it isn't instantaneous), so we need our program to pause
    until it is done.  The way we do that, is we tack on a .then() function after the signIn

    When signInWithEmailAndPassword is done, it returns a promise, essentially that it is done.
    When that happens, we want to query a reference to the modal in the DOM, and using the
    materialize library methods, close the modal and reset the login form so it is blank the 
    next time someone tries to log in
*/

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();         // prevents page from reloading

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

/*
    SIGN UP FUNCTIONALITY

    Very similar in description to the login form code.

    We will sign up the user using a method from firebase auth services
    This is an async task and therefore it takes a sec to complete
    Because of that, we can tack on a .then function that will do something
    AFTER this is completed.  In this case, that is when we close the modal
    like we did for Login.
*/

const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
   
    // get user info from the fields and pass in id of desired field inside [ ]
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    
    auth.createUserWithEmailAndPassword(email, password).then(() => {
         const modal = document.querySelector('#modal-signup');
         M.Modal.getInstance(modal).close();
         signupForm.reset(); 
    });
});


/*
    LOG OUT FUNCTIONALITY

    Adds a listener for when the user clicks the logout button 
    Calls the sign out method for auth.  This will trigger the code
    we already have set up for when their isn't a user logged in above in the 
    auth section.
*/

const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});



/*
    ADD STUDENT FUNCTIONALITY

    Listens for when the add student link is clicked, gets a reference to the 
    form in the modal, gets the name and time from the form and uses the add
    function of firestore to add this document to the collection 'logs'

    The .next next functions lets the code know when this task is done, and 
    then the modal is closed and cleared.

    We also use a catch here to catch any errors that might have occurred when the add
    function was called.  If there is an error, it is logged to the console.
*/

const addForm = document.querySelector('#add-form');
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('logs').add({
        name: addForm['name'].value,
        time: addForm['time'].value
    }).then(()=> {
        const modal = document.querySelector('#modal-add');
        M.Modal.getInstance(modal).close();
        addForm.reset(); 
    }).catch(err => {
        console.log(err.message);
        // this will catch any errors that might come back from firebase when trying
        // to add, and if it doesn't work, then it will log the error message 
    })
})

/*
    SET UP MATERIALIZE COMPONENTS
    **  You only need this if you are using the Materialize styling and the code you
    use here depends on the materialize components you need to set up.  Since I only used
    modals, that is all I need to initialize.

    This function is listening for when you load the DOM.  At that point, all the modals 
    are queried.  Then, they are all initialized with the init function
*/

document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  });
