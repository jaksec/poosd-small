const urlBase = 'http://COP4331-13.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


//- *********************JS for LOGIN PAGE***************************************
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value; 
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {username:login,password:password}; 
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "account.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

//- *********************JS for SIGNUP PAGE***************************************


function Register() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let userloginName = document.getElementById("userloginName").value;
    let password = document.getElementById("newPassword").value;

	// Front-end validation to ensure all fields are filled
    if (firstName === "" || lastName === "" || userloginName === "" || password === "") {
        document.getElementById("registrationResult").innerHTML = "Please fill in all fields.";
        return; 
    }
	
    // Validate password requirements before proceeding
    if (!validatePassword()) {
        document.getElementById("registrationResult").innerHTML = "";
        return; 
    }

    // Creating the request payload
    let e = { firstName: firstName, lastName: lastName, username: userloginName, password: password };
    let jsonPayload = JSON.stringify(e);

    let url = urlBase + '/Registration.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Parse the server response
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.Error) {
                    document.getElementById("registrationResult").innerHTML = jsonObject.Error;
                } else {
                    // Clear the form
                    document.getElementById("firstName").value = "";
                    document.getElementById("lastName").value = "";
                    document.getElementById("userloginName").value = "";
                    document.getElementById("newPassword").value = "";
                
                    // Inform the user of successful registration
                    document.getElementById("registrationResult").innerHTML = "Registration successful!";
                    saveCookie(); // Optional
                    window.location.href = "login.html"; // Redirect
                }
            }
        };
        // Send the request with the user data
        xhr.send(jsonPayload);
    } catch (err) {
        // Handle any errors during the request
        document.getElementById("registrationResult").innerHTML = err.message;
    }
}

//-*********************************************************************************************


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ";expires=" + date.toGMTString() + ";path=/";
    document.cookie = "lastName=" + lastName + ";expires=" + date.toGMTString() + ";path=/";
    document.cookie = "userId=" + userId + ";expires=" + date.toGMTString() + ";path=/";
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(";");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Hello " + firstName + " " + lastName+"!";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
/*-******************************SEARCH FOR CONTACT***********************************-*/

function searchContact() {
    let srch = document.getElementById("searchText").value.toLowerCase().trim();
    // Clear the table body
    const tableBody = document.getElementById("contactTableBody");
    tableBody.innerHTML = "";
    
    // Get contacts from localStorage
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    
    // If search text is empty, display all contacts
    if (srch === "") {
        contacts.forEach(contact => {
            addContactToTable(contact.firstName, contact.lastName, contact.emailAddress, contact.phoneNumber);
        });
    } else {
        // Filter contacts where first name starts with search text
        let filteredContacts = contacts.filter(contact => {
            return contact.firstName.toLowerCase().startsWith(srch);
        });
        
        // Add the filtered contacts to the table
        filteredContacts.forEach(contact => {
            addContactToTable(contact.firstName, contact.lastName, contact.emailAddress, contact.phoneNumber);
        });
    }
}

/*-************************************ADD CONTACTS**************************************-*/
function showForm() {
    // Toggle the display of the form
    var form = document.getElementById("contactForm");
	form.style.display = "block";
         // Clear the form whenever it's shown
    
}

function clearForm() {
    // Clear the form fields to show only placeholders
    document.getElementById('first-Name').value = '';
    document.getElementById('last-Name').value = '';
    document.getElementById('emailAddress').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('userId').value = '';
}

function onclickAdd() {
    const firstName = document.getElementById("first-Name").value;
    const lastName = document.getElementById("last-Name").value;
    const emailAddress = document.getElementById("emailAddress").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    if (firstName && lastName && emailAddress && phoneNumber) {
        // Add contact to the table and save in localStorage
        addContactToTable(firstName, lastName, emailAddress, phoneNumber);
        saveContact(firstName, lastName, emailAddress, phoneNumber);

        // Reset the form and hide it after submission
        clearForm();
        document.getElementById("contactForm").style.display = "none";
    } else {
        alert("Please fill out all fields");
    }
}

function addContact() {
    let firstName = document.getElementById('first-Name').value;
    let lastName = document.getElementById('last-Name').value;
    let emailAddress = document.getElementById('emailAddress').value;
    let phoneNumber = document.getElementById('phoneNumber').value;
    
    // Assuming userId is stored in cookies or globally
    let userId = getUserIdFromCookie(); // Implement this function or access the cookie directly

    document.getElementById("contactAddResult").innerHTML = "";

    // Creating the request payload
    let e = { firstName: firstName, lastName: lastName, emailAddress: emailAddress, phoneNumber: phoneNumber, userId: userId };
    let jsonPayload = JSON.stringify(e);

    let url = urlBase + '/AddContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactAddResult").innerHTML = "Contact added successfully!";

                // Dynamically add the contact to the table (optionally, only if server-side insert was successful)
                addContactToTable(firstName, lastName, emailAddress, phoneNumber);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

/*-*******************************************************************/
// Show the password requirements when the user clicks/focuses on the password field
function showPasswordRequirements() {
    document.getElementById("passwordRequirements").style.display = "block";
}

// Validate the password as the user types
function validatePassword() {
    const password = document.getElementById("newPassword").value;

    // Regular expressions to check the requirements
    const hasNumber = /[0-9]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const charLength = password.length >= 8 && password.length <= 32;

    // Update the password requirement list based on validation
    updateRequirement("charLength", charLength);
    updateRequirement("hasNumber", hasNumber);
    updateRequirement("hasLetter", hasLetter);
    updateRequirement("hasSpecialChar", hasSpecialChar);

	// Return true if all requirements are met, otherwise false
    return charLength && hasNumber && hasLetter && hasSpecialChar;
}

// Function to update the requirements with a green check (valid) or red "X" (invalid)
function updateRequirement(elementId, isValid) {
    const element = document.getElementById(elementId);
    if (isValid) {
        element.classList.remove("invalid");
        element.classList.add("valid");
        element.innerHTML = `✔ ${element.innerHTML.slice(2)}`; // Replace the ❌ with ✔
    } else {
        element.classList.remove("valid");
        element.classList.add("invalid");
        element.innerHTML = `❌ ${element.innerHTML.slice(2)}`; // Replace the ✔ with ❌
    }
}

// Save contact 

// Add Contact Function

function addContactToTable(firstName, lastName, email, phone) {
    const tableBody = document.getElementById("contactTableBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = 
        `<td>${firstName}</td>
        <td>${lastName}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td>
            <button class="edit"><i class="fa-solid fa-user-pen"></i></button>
            <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
        </td>`;
    
    tableBody.appendChild(newRow);

    // Add functionality to the newly added buttons
    const editButton = newRow.querySelector('.edit');
    const deleteButton = newRow.querySelector('.delete');

    editButton.addEventListener('click', function () {
        // Your edit functionality here
    });

    deleteButton.addEventListener('click', function () {
        // Remove the row from the table
        tableBody.removeChild(newRow);
        // Remove the contact from localStorage
        removeContactFromLocalStorage(firstName, lastName);
    });
}

// Save contact in local storage
function saveContact(firstName, lastName, emailAddress, phoneNumber) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push({ firstName, lastName, emailAddress, phoneNumber });
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Load contacts from local storage on page load
window.addEventListener("load", function() {
    const savedContacts = JSON.parse(localStorage.getItem("contacts")) || [];
    savedContacts.forEach(contact => {
        addContactToTable(contact.firstName, contact.lastName, contact.emailAddress, contact.phoneNumber);
    });
});

// Delete contact from local storage
function deleteContact(firstName, lastName, emailAddress, phoneNumber) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts = contacts.filter(contact => 
        contact.firstName !== firstName || 
        contact.lastName !== lastName || 
        contact.emailAddress !== emailAddress || 
        contact.phoneNumber !== phoneNumber
    );
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Function to handle delete button
function addDeleteFunctionality() {
    const deleteButtons = document.querySelectorAll(".delete");

    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            this.parentElement.parentElement.remove(); // Remove the row from the table

            // Optionally: If using localStorage, remove the contact from there as well
            let contactRow = this.parentElement.parentElement;
            let firstName = contactRow.cells[0].textContent;
            let lastName = contactRow.cells[1].textContent;
            removeContactFromLocalStorage(firstName, lastName);
        });
    });
}

// Remove from localStorage function (optional if you're storing contacts in localStorage)
function removeContactFromLocalStorage(firstName, lastName) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts = contacts.filter(contact => contact.firstName !== firstName && contact.lastName !== lastName);
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Function to handle edit button
function addEditFunctionality() {
    const editButtons = document.querySelectorAll(".edit");

    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Get the current row data
            let contactRow = this.parentElement.parentElement;
            let firstName = contactRow.cells[0].textContent;
            let lastName = contactRow.cells[1].textContent;
            let email = contactRow.cells[2].textContent;
            let phone = contactRow.cells[3].textContent;

            // Populate the form with current contact info
            document.getElementById('first-Name').value = firstName;
            document.getElementById('last-Name').value = lastName;
            document.getElementById('emailAddress').value = email;
            document.getElementById('phoneNumber').value = phone;

            // Show the form to edit
            document.getElementById("contactForm").style.display = "block";

            // Update the contact on form submission
            document.getElementById("contactForm").onsubmit = function (event) {
                event.preventDefault();
                
                // Get updated values from form
                let updatedFirstName = document.getElementById('first-Name').value;
                let updatedLastName = document.getElementById('last-Name').value;
                let updatedEmail = document.getElementById('emailAddress').value;
                let updatedPhone = document.getElementById('phoneNumber').value;

                // Update the table row with the new values
                contactRow.cells[0].textContent = updatedFirstName;
                contactRow.cells[1].textContent = updatedLastName;
                contactRow.cells[2].textContent = updatedEmail;
                contactRow.cells[3].textContent = updatedPhone;

                // Optionally: If using localStorage, update the contact there as well
                updateContactInLocalStorage(firstName, lastName, updatedFirstName, updatedLastName, updatedEmail, updatedPhone);

                // Hide the form after updating
                document.getElementById("contactForm").style.display = "none";
            };
        });
    });
}

// Function to update contact in localStorage (optional)
function updateContactInLocalStorage(oldFirstName, oldLastName, newFirstName, newLastName, newEmail, newPhone) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    let contactIndex = contacts.findIndex(contact => contact.firstName === oldFirstName && contact.lastName === oldLastName);
    if (contactIndex !== -1) {
        contacts[contactIndex] = {
            firstName: newFirstName,
            lastName: newLastName,
            email: newEmail,
            phone: newPhone
        };
        localStorage.setItem("contacts", JSON.stringify(contacts));
    }
}
