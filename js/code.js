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

                // Check for errors in the response
                if (jsonObject.Error) {
                    document.getElementById("registrationResult").innerHTML = jsonObject.Error;
                } else {
                    document.getElementById("registrationResult").innerHTML = "Registration successful!";
                    saveCookie();  // Optional if you want to save data in cookies
                    // You can redirect or move to a different page after successful registration
                    // window.location.href = "login.html"; // Example of redirect
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


function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					conrtactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
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
    addContact();
    clearForm(); // Clear the form fields
    var form = document.getElementById("contactForm");
    form.style.display = "none"; // Hide the form after adding a contact
}

function addContact() {
   
    let firstName = document.getElementById('first-Name').value;
    let lastName = document.getElementById('last-Name').value;
    let emailAddress = document.getElementById('emailAddress').value;
    let phoneNumber = document.getElementById('phoneNumber').value;
    let userId = document.getElementById('userId').value;

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
                document.getElementById("contactAddResult").innerHTML = "";
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
