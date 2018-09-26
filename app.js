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

filterCheckbox.addEventListener('change', (event) => {
  for (let guest of inviteList.children) {
    if (filterCheckbox.checked && guest.className === 'responded') {
      guest.style.display = 'none';
    } else {
      guest.style.display = '';
    }
  }
} );

function createGuest(name) {
  const guest = document.createElement('li');

  // Set guest name
  const span = document.createElement('span');
  span.textContent = input.value;
  guest.appendChild(span)

  // Create Confirmed checkbox
  const label = document.createElement('label');
  label.textContent = 'confirmed';
  const box = document.createElement('input');
  box.type = 'checkbox';
  label.appendChild(box);
  guest.appendChild(label);

  // Create Edit button
  const editButton = document.createElement('button');
  editButton.textContent = 'edit';
  guest.appendChild(editButton);

  // Create Remove button
  const removeButton = document.createElement('button');
  removeButton.textContent = 'remove';
  guest.appendChild(removeButton);

  return guest;
}

// Add a guest when form is submitted
form.addEventListener('submit', (event) => {
  event.preventDefault();  // prevent default page refresh on submit
  inviteList.appendChild(createGuest(input.value));
  input.value = '';
} );

// Change guest card styling based on Confirm checkbox
inviteList.addEventListener('change', (event) => {
  if ( event.target.tagName === 'INPUT' ) {
    const box = event.target;
    const guest = box.parentElement.parentElement;
    if ( box.checked ) {
      guest.className = 'responded';
    } else {
      guest.className = '';
    }
  }
} );

// Buttons on guest card
inviteList.addEventListener('click', (event) => {
    if ( event.target.tagName === 'BUTTON' ) {
      const btn = event.target;
      const guest = btn.parentElement;

      if ( btn.textContent === 'remove' ) {
        inviteList.removeChild(guest);
      }
      else if ( btn.textContent === 'edit' ) {
        const span = guest.querySelector('span');
        // create the edit field
        const edit = document.createElement('input')
        edit.type = 'text';
        edit.value = span.textContent;
        // replace the text field with the edit field.
        guest.insertBefore(edit, span);
        guest.removeChild(span);
        // replace text on edit button
        btn.textContent = 'SAVE';
      }
      else if ( btn.textContent === 'SAVE' ) {
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
    }
} );
