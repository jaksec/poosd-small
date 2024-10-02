const urlBase = 'http://COP4331-13.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let userContacts = [];


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
// Function to update requirement indicators
function updateRequirement(elementId, isValid) {
    const element = document.getElementById(elementId);
    const text = element.getAttribute("data-text"); // Static text for the rule

    element.classList.toggle("valid", isValid);   // Add 'valid' class if true
    element.classList.toggle("invalid", !isValid); // Add 'invalid' class if false

    element.innerHTML = `<i class="fas fa-${isValid ? 'check' : 'times'}"></i> ${text}`;
}
function validatePassword() {
    const password = document.getElementById('newPassword').value;

    // Validate length
    const isValidLength = password.length >= 8 && password.length <= 32;
    updateRequirement("length", isValidLength);

    // Validate that it contains at least one number
    const hasNumber = /\d/.test(password);
    updateRequirement("hasNumber", hasNumber);

    // Validate that it contains at least one letter
    const hasLetter = /[a-zA-Z]/.test(password);
    updateRequirement("hasLetter", hasLetter);

    // Validate that it contains at least one special character
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    updateRequirement("hasSpecialChar", hasSpecialChar);

    // Return true if all requirements are met
    return isValidLength && hasNumber && hasLetter && hasSpecialChar;
}
 

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
function showPasswordRequirements() {
    document.getElementById("passwordRequirements").style.display = "block";
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

function loadContacts(searchText = "") {
    // Prepare the request payload with userId and optional searchText
    let obj = {
        "userID": userId,
        "search": searchText.trim().toLowerCase() // Trim and convert search text to lowercase
    };

    let jsonPayload = JSON.stringify(obj);

    // Define the API URL for searching contacts
    let url = urlBase + "/SearchContacts." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let userContacts = JSON.parse(this.responseText);

                if (userContacts.error && userContacts.error !== "") {
                    console.log(userContacts.error);
                    return;
                }

                // If no contacts are found, show a message or clear the table
                if (userContacts.results === undefined || userContacts.results.length === 0) {
                    document.getElementById("contactTableBody").innerHTML = "<tr><td colspan='5'>No matching contacts found</td></tr>";
                    return;
                }

                // Store the loaded contacts in a global variable for DOM filtering
                window.loadedContacts = userContacts.results;

                // Call the function to update the DOM with the API response and search text
                updateDOMTable(searchText);
            }
        };
        xhr.send(jsonPayload);
    } catch (e) {
        console.log("Error while fetching contacts: " + e);
    }
}

// Function to update the DOM table based on filtered contacts
function updateDOMTable(searchText = "") {
    // Clear the table body
    const tableBody = document.getElementById("contactTableBody");
    tableBody.innerHTML = '';

    // Filter the loaded contacts based on the search text
    let filteredContacts = window.loadedContacts.filter(contact => {
        // Check if the contact's first name starts with the search text letters in order
        return matchesInOrder(contact.FirstName.toLowerCase(), searchText.toLowerCase());
    });

    // Add each filtered contact to the table
    filteredContacts.forEach(contact => {
        addContactToTable(contact.FirstName, contact.LastName, contact.EmailAddress, contact.PhoneNumber);
    });

    // If no contacts remain after filtering, show a message
    if (filteredContacts.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>No matching contacts found</td></tr>";
    }
}

// Helper function to check if the search string appears in the full string in the correct order
function matchesInOrder(fullString, searchString) {
    if (!searchString) return true; // If searchString is empty, consider it a match
    if (fullString.length < searchString.length) return false; // If the searchString is longer, no match is possible

    // Check each character in searchString to see if it matches the corresponding character in fullString
    for (let i = 0; i < searchString.length; i++) {
        if (fullString[i] !== searchString[i]) {
            return false; // Return false if any character doesn't match exactly in order
        }
    }

    return true; // Return true if all characters match in order
}

// Define the searchContact function to handle search input changes
function searchContact() {
    // Get the search input text
    let searchText = document.getElementById("searchText").value;

    // Update the DOM table for real-time filtering without API call
    updateDOMTable(searchText);

    // Call loadContacts with the search text to perform API filtering
    loadContacts(searchText);
}


// Call loadContacts initially to load all contacts when the page loads
window.onload = function() {
    window.loadedContacts = []; // Initialize global variable to store contacts
    loadContacts(); // Load all contacts by default

    // Attach an event listener to the search bar for real-time filtering and API calls
    document.getElementById("searchText").addEventListener("input", searchContact);
};
/*-************************************ADD CONTACTS & ADD CONTACT FORM**************************************-*/


function showForm() {
    var form = document.getElementById("contactForm"); // Toggle the display of the form
	form.style.display = "block"; // Clear the form whenever it's shown    
}

function hideForm() {
    document.getElementById("cancelbtn").addEventListener("click", hideForm);
    var form = document.getElementById("contactForm");// Get the form element
    clearForm();
    form.style.display = "none";  
}

function clearForm() {
    // Clear the form fields to show only placeholders
    document.getElementById('first-Name').value = '';
    document.getElementById('last-Name').value = '';
    document.getElementById('emailAddress').value = '';
    document.getElementById('phoneNumber').value = '';
}

function onclickAdd() {
    const firstName = document.getElementById("first-Name").value;
    const lastName = document.getElementById("last-Name").value;
    const emailAddress = document.getElementById("emailAddress").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    if (firstName && lastName && emailAddress && phoneNumber) {
        if (window.currentlyEditingRow) {
            updateContact(firstName, lastName, emailAddress, phoneNumber);
        } else {
            addContact();
        }
        clearForm();
        hideForm();
        document.querySelector(".formtitle").innerText = "New Connection"; // Reset form title

        // Ensure the button only contains the checkmark, not multiple icons
        const checkButton = document.getElementById("checkbtn");
        // This line ensures that it only contains the checkmark icon
        checkButton.className = "fas fa-check";  // Set only the icon class
    } else {
        // alert("Please fill out all fields");
    }
}


function getUserIdFromCookie() {
	let userId = 0;
	let cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		let cookie = cookies[i].trim();
		if (cookie.startsWith('userId=')) {
			userId = parseInt(cookie.split('=')[1]);
			break;
		}
	}
	return userId;
}

function addContact() {
    let firstName = document.getElementById('first-Name').value;
    let lastName = document.getElementById('last-Name').value;
    let emailAddress = document.getElementById('emailAddress').value;
    let phoneNumber = document.getElementById('phoneNumber').value;
 
    
    let resultDiv = document.getElementById("contactAddResult");//variable that gets the message to confirm contact has been added 
    if (resultDiv) {
        resultDiv.innerHTML = ""; // Clear any previous message
    }
    let userId = getUserIdFromCookie();
    // Creating the request payload
    let e = { firstName: firstName, lastName: lastName, emailAddress: emailAddress, phoneNumber: phoneNumber,userId: userId};
    let jsonPayload = JSON.stringify(e);

    let url = urlBase + '/AddContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Check if resultDiv exists and update its innerHTML
                if (resultDiv) {
                    resultDiv.innerHTML = "Contact added successfully!";//confirmation message
                }
                addContactToTable(firstName, lastName, emailAddress, phoneNumber); //this adds the contact to the table 
                saveContact(firstName, lastName, emailAddress, phoneNumber,userId);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        // Check if resultDiv exists and display the error message
        if (resultDiv) {
            resultDiv.innerHTML = err.message;
        }
    }
}


/*-**************************Phone and email validation inside Add Contact form*****************************************/

// Function to show phone number requirements
function togglePhoneNumberRequirements(show) {
    const requirements = document.getElementById("phoneNumberRequirements");
    if (requirements) {
        requirements.style.display = show ? "block" : "none";
    }
}

// Validate the phone number as the user types
function validatePhoneNumber() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const hasDigits = /^\d+$/.test(phoneNumber); // Only digits allowed
    const digitsLength = phoneNumber.length >= 10; // At least 10 digits

    // Update the UI for each requirement
    updatePhoneRequirement("hasDigits", hasDigits);
    updatePhoneRequirement("digitsLength", digitsLength);

    // Return true if all requirements are met
    return hasDigits && digitsLength;
}

// Function to update phone requirement indicators (valid/invalid)
function updatePhoneRequirement(elementId, isValid) {
    const element = document.getElementById(elementId);
    const text = element.getAttribute("data-text"); // Static text for the rule

    element.classList.toggle("valid", isValid);   // Add 'valid' class if true
    element.classList.toggle("invalid", !isValid); // Add 'invalid' class if false

    element.innerHTML = `<i class="fas fa-${isValid ? 'check' : 'times'}"></i> ${text}`;
}

// Clear all phone validation requirements (reset state)
function clearPhoneNumberValidation() {
    const requirements = document.querySelectorAll("#phoneNumberRequirements li");
    requirements.forEach(item => {
        item.classList.remove("valid");
        item.classList.add("invalid");
        item.innerHTML = `<i class="fa-solid fa-xmark"></i> ${item.getAttribute("data-text")}`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const phoneNumberField = document.getElementById("phoneNumber");

    if (phoneNumberField) {
        // Add event listeners for showing, hiding, and validating the phone number
        phoneNumberField.addEventListener("focus", () => togglePhoneNumberRequirements(true));
        phoneNumberField.addEventListener("blur", () => togglePhoneNumberRequirements(false));
        phoneNumberField.addEventListener("input", validatePhoneNumber);

        // Initialize validation state
        clearPhoneNumberValidation();
    } else {
        console.error('Phone number field not found in the DOM.');
    }
});

/****************************************CONTACTS TABLE*************************************************/

function addContactToTable(firstName, lastName, email, phone) {
    const tableBody = document.getElementById("contactTableBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td>
            <button class="edit"><i class="fa-solid fa-user-pen"></i></button>
            <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
        </td>
    `;
   
    tableBody.appendChild(newRow);

    // Attach delete functionality to the new delete button
    const deleteButton = newRow.querySelector(".delete");
    deleteButton.addEventListener("click", function() {
        showDeleteConfirmation(firstName, lastName, newRow);
    });

    // Attach edit functionality as well (if needed)
    addEditFunctionality();
}


// Save contact in local storage
function saveContact(firstName, lastName, emailAddress, phoneNumber, userId) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push({ firstName, lastName, emailAddress, phoneNumber, userId }); // Include userId in the contact
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Store contact information globally for later use
let contactToDelete = null;

// Function to trigger when the delete button is clicked
function showDeleteConfirmation(firstName, lastName, contactRow) {
    const deleteModal = document.getElementById("deleteConfirmationModal");
    const confirmDeleteButton = document.getElementById("confirmDelete");
    const cancelDeleteButton = document.getElementById("cancelDelete");

    if (deleteModal && confirmDeleteButton && cancelDeleteButton) {
        // Show the modal
        deleteModal.style.display = "flex";

        // Handle "Yes" button click
        confirmDeleteButton.onclick = function() {
            deleteContact(firstName, lastName, contactRow);
            deleteModal.style.display = "none"; // Close the modal
        };

        // Handle "No" button click
        cancelDeleteButton.onclick = function() {
            deleteModal.style.display = "none"; // Close the modal without deleting
        };
    } else {
        console.error('Modal or buttons not found in the DOM.');
    }
}

// Function to confirm deletion
function confirmDeleteContact() {
    if (contactToDelete) {
        deleteContact(contactToDelete.firstName, contactToDelete.lastName, contactToDelete.contactRow);
        document.getElementById("deleteConfirmationModal").style.display = "none"; // Hide the modal
    }
}

// Function to cancel deletion
function cancelDeleteContact() {
    document.getElementById("deleteConfirmationModal").style.display = "none"; // Hide the modal without deleting
}


// Delete contact using the API
function deleteContact(firstName, lastName, contactRow) {
    let userId = getUserIdFromCookie();

    // Create the JSON payload
    let jsonPayload = JSON.stringify({
        userId: userId,
        firstName: firstName,
        lastName: lastName
    });

    // Define the URL for the DeleteContacts API
    let url = urlBase + '/DeleteContacts.' + extension;

    // Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // Try sending the request and handle errors
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    // Parse the response to check for errors or success
                    let response = JSON.parse(xhr.responseText);
                    if (response.Error && response.Error !== "") {
                        console.error("Error from server: ", response.Error);
                        alert("Failed to delete contact: " + response.Error);
                    } else {
                        // Remove the row from the table
                        contactRow.remove();
                        // Remove from local storage
                        removeContactFromLocalStorage(firstName, lastName);
                        // alert("Contact deleted successfully!");
                        location.reload();
                    }
                } else {
                    // HTTP error, display status and message
                    console.error("HTTP Error: ", this.status, this.statusText);
                    alert("Failed to delete contact. Server responded with a status of: " + this.status);
                }
            }
        };
        // Send the request with the JSON payload
        xhr.send(jsonPayload);
    } catch (err) {
        // Catch any other errors and log them
        console.error("Error deleting contact: ", err);
        alert("An error occurred while deleting the contact.");
    }
}

// Function to handle delete button
// Function to handle delete button
function addDeleteFunctionality() {
    const deleteButtons = document.querySelectorAll(".delete");

    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Get the current row data
            let contactRow = this.parentElement.parentElement;
            let firstName = contactRow.cells[0].textContent;
            let lastName = contactRow.cells[1].textContent;

            // Call deleteContact function, passing the contactRow
            deleteContact(firstName, lastName, contactRow);
            removeContactFromLocalStorage(firstName, lastName)
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

            // Store the reference to the contactRow in a global variable to know which row is being edited
            window.currentlyEditingRow = contactRow;

            // Populate the form with current contact info
            document.getElementById('first-Name').value = firstName;
            document.getElementById('last-Name').value = lastName;
            document.getElementById('emailAddress').value = email;
            document.getElementById('phoneNumber').value = phone;

            // Change the form title to "Edit Connection"
            document.querySelector(".formtitle").innerText = "Edit Connection";

            // Show the form to edit
            document.getElementById("contactForm").style.display = "block";
        });
    });
}

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

function updateContact(firstName, lastName, emailAddress, phoneNumber) {
    // Retrieve the currently edited row and the user ID from the cookie
    const row = window.currentlyEditingRow;
    let userId = getUserIdFromCookie();

    // Get the original (old) first and last name values from the row
    let oldFirstName = row.cells[0].textContent;
    let oldLastName = row.cells[1].textContent;

    console.log(oldFirstName);
    console.log(oldLastName);

    // Update the DOM table row with the new values
    row.cells[0].textContent = firstName;
    row.cells[1].textContent = lastName;
    row.cells[2].textContent = emailAddress;
    row.cells[3].textContent = phoneNumber;

    console.log(oldFirstName);
    console.log(oldLastName);

    // Update the contact in local storage using the original names
    updateContactInLocalStorage(oldFirstName, oldLastName, firstName, lastName, emailAddress, phoneNumber);

    // Create the JSON payload with both old and new values for the update request
    let jsonPayload = JSON.stringify({
        newFirst: firstName, 
        newLast: lastName, 
        newEmail: emailAddress, 
        newPhone: phoneNumber,
        userId: userId,
        oldf: oldFirstName,   // Original (old) first name
        oldl: oldLastName     // Original (old) last name
    });

    // Define the URL for the UpdateContacts API
    let url = urlBase + '/UpdateContacts.' + extension;

    // Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // Try sending the request and handle errors
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    // Parse the response to check for errors or success
                    let response = JSON.parse(xhr.responseText);
                    if (response.Error) {
                        console.error("Error from server: ", response.Error);
                        alert("Failed to update contact: " + response.Error);
                    } else {
                        // alert("Contact updated successfully!");
                        location.reload();
                    }
                } else {
                    // HTTP error, display status and message
                    console.error("HTTP Error: ", this.status, this.statusText);
                    alert("Failed to update contact. Server responded with a status of: " + this.status);
                }
            }
        };
        // Send the request with the JSON payload
        xhr.send(jsonPayload);
    } catch (err) {
        // Catch any other errors and log them
        console.error("Error updating contact: ", err);
        alert("An error occurred while updating the contact.");
    }

    // Clear the reference to the edited row after the update
    window.currentlyEditingRow = null;
}