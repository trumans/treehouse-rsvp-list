const form = document.getElementById("registrar");
const input = form.getElementsByTagName("input")[0];
const mainDiv = document.getElementsByClassName("main")[0];
const inviteList = document.getElementById("invitedList");

// add Hide Not Confirmed label & checkbox
const filterDiv = document.createElement('div');
const filterLabel = document.createElement('label');
filterLabel.textContent = "Hide guests who haven't confirmed";
const filterCheckbox = document.createElement('input');
filterCheckbox.type = 'checkbox';
filterDiv.appendChild(filterLabel);
filterDiv.appendChild(filterCheckbox);
mainDiv.insertBefore(filterDiv, inviteList);
const rsvpInviteList = 'rsvpInviteList';

window.onload = function() {
  createListFromLocalStorage();
}
// Listener for filter checkbox
filterCheckbox.addEventListener('change', (event) => {
  for (let guest of inviteList.children) {
    guest.style.display =
      ( filterCheckbox.checked &&
        guest.className !== 'responded') ? 'none' : '';
  }
} );

// Create a guest card
//   Return a guest card element
function createGuestElement(name, confirmed) {
  function createElement(type, property, value) {
    const element = document.createElement(type);
    element[property] = value;
    return element;
  }

  function appendElementToGuest(type, property, value) {
    const element = createElement(type, property, value);
    guest.appendChild(element);
    return element;
  }

  const guest = document.createElement('li');
  guest.className = setClassName( confirmed );
  // add name display element
  appendElementToGuest('span', 'textContent', name);
  // create checkbox enclosed in a label element
  const ch = createElement('input', 'type', 'checkbox');
  ch.checked = confirmed;
  // create label element containing checkbox
  appendElementToGuest('label', 'textContent', 'confirmed')
    .appendChild(ch);
  // add buttons
  appendElementToGuest('button', 'textContent', 'edit');
  appendElementToGuest('button', 'textContent', 'remove');

  return guest;
}

function setClassName( confirmed ) {
  return confirmed ? 'responded' : '';
}
// Add a guest when form is submitted
form.addEventListener('submit', (event) => {
  event.preventDefault();  // prevent default page refresh on submit
  inviteList.appendChild(createGuestElement(input.value, false));
  input.value = '';
  saveListToLocalStorage();
} );

// Change guest card styling based on Confirm checkbox
inviteList.addEventListener('change', (event) => {
  if ( event.target.tagName === 'INPUT' &&
       event.target.type === 'checkbox') {
    const box = event.target;
    const guest = box.parentElement.parentElement;
    guest.className = setClassName( box.checked );
    saveListToLocalStorage();
  }
} );

// Buttons on guest card
inviteList.addEventListener('click', (event) => {
    if ( event.target.tagName === 'BUTTON' ) {
      const btn = event.target;
      const guest = btn.parentElement;
      const buttonActions = {
        'remove': function() {
          removeCard(guest);
          saveListToLocalStorage();
        },
        'edit': function() {
          changeNameToEditMode(guest)
        },
        'SAVE': function() {
          saveAndChangeNameToDisplayMode();
          saveListToLocalStorage();
        }
      }

      function removeCard() {
        inviteList.removeChild(guest);
      }

      function changeNameToEditMode() {
        const span = guest.querySelector('span');
        // create the edit field
        const edit = document.createElement('input');
        edit.type = 'text';
        edit.value = span.textContent;
        // replace the text field with the edit field.
        guest.insertBefore(edit, span);
        guest.removeChild(span);
        // replace text on edit button
        btn.textContent = 'SAVE';
      }

      function saveAndChangeNameToDisplayMode() {
        const edit = guest.querySelector('input[type="text"]');
        // recreate the span field
        const span = document.createElement('span')
        span.textContent = edit.value;
        // replace the edit field with the span.
        guest.insertBefore(span, edit);
        guest.removeChild(edit);
        // restore text on edit button
        btn.textContent = 'edit';

      }
      // Execute the button based on the button's text
      //  (using class might be better if buttons had clsss name)
      buttonActions[btn.textContent]();
    }
} );

function createListFromLocalStorage() {
  for (let guest of JSON.parse(localStorage[rsvpInviteList])) {
    inviteList.appendChild(createGuestElement(
      guest['name'], guest['confirmed']));
  }
}

function saveListToLocalStorage() {
  let list = [];
  for (guest of inviteList.children) {
    list.push( {
      name: guest.querySelector('span').textContent,
      confirmed: guest.querySelector('input[type="checkbox"]').checked
    } );
  }
  localStorage[rsvpInviteList] = JSON.stringify(list);
}
