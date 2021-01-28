/*
This file will contain all the JS that is used to render
dynamic displays on our web app.
*/

const logList = document.querySelector('.logs');
const loggedOutLinks = document.querySelectorAll('.logged-out'); // need All bc there are > 1
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

// set up UI
const setupUI = (user) => {
  if (user) {
    // toggle UI elements with a forEach loop that will change the display to show or hide them
    loggedInLinks.forEach(item => item.style.display = 'block');  // show
    loggedOutLinks.forEach(item => item.style.display = 'none');  // hide
  }
  else {
    loggedInLinks.forEach(item => item.style.display = 'none');  // hide
    loggedOutLinks.forEach(item => item.style.display = 'block');  // show
  }
}

// This function generates each <li> row for the data in the database.
// there is also a listener attached to the and delete option for the student 

// uses the reference logList for the student log list (created at top of page) and add log form
// if this function renderLog is used, then the function setupLogs is not used

const form = document.querySelector('#create-form');

function renderLog(doc) {
    // if the user just logged in, this clears the message telling them
    // to log in
    if (logList.innerHTML.startsWith('<h5')) {
       logList.innerHTML = "";
     }
  
    let li = document.createElement('li');
    let name = document.createElement('span');
    let time = document.createElement('span');
    let deleteX = document.createElement('span');
   
    // we need to attach the UID to the li tag so that way if we need to 
    // access it later, we know which element it was
    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    time.textContent = doc.data().time;
    deleteX.textContent = 'Delete';
    deleteX.classList = 'deleteX';
    name.classList = 'logLI';
   
    
    li.appendChild(time);
    li.appendChild(name);
    li.appendChild(deleteX);      
    logList.appendChild(li);

    // Add listeners for the -, +, and delete options

    // deleting data
    deleteX.addEventListener('click', (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute('data-id');
      db.collection('logs').doc(id).delete();
    })

    };

// clear log display on log out OR if not logged in
const clearLogs = () => {
  logList.innerHTML = '<h5 class = "center-align">Login to view Work Logs</h5>'
}
  const setupLogs = (data) => {
    // check if data has length to display.  If it does, then go through the data
    // if not, then we want to display a message instructing them to login
  
    if (data.length) {
        
     }
  
    else {
      logList.innerHTML = '<h5 class = "center-align">Login to view work logs- TEST</h5>'
    }
  }

    



// setup materialize components 
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});