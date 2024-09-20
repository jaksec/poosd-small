<?php 

// Allow from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific methods (GET, POST, etc.)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}


$inData = getRequestInfo();

// Ensure the expected data is available
$firstName = isset($inData["firstName"]) ? $inData["firstName"] : null;
$lastName = isset($inData["lastName"]) ? $inData["lastName"] : null;
$username = isset($inData["username"]) ? $inData["username"] : null;
$password = isset($inData["password"]) ? $inData["password"] : null;

// Check for required fields
if (is_null($firstName) || is_null($lastName) || is_null($username) || is_null($password)) {
    returnWithError("All fields are required.");
    exit;
}
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} 
else 
{
    // Prepare and bind the select statement
    $stmt = $conn->prepare("SELECT * FROM Users WHERE Username=?");
    $stmt->bind_param("s", $username); 
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the username exists in the database
    if ($result->num_rows > 0) 
    {
        // Username already exists
        returnWithError("Sorry... Username is taken");
    } 
    else 
    {
        // Hash the password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // Insert the new user into the database
        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Username, Password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $username, $passwordHash);
        $stmt->execute();

        // Get the new user's ID
        $id = $conn->insert_id;

        // Close the statement and connection
        $stmt->close();
        $conn->close();

        // Return the user's info
        returnWithInfo($firstName, $lastName, $id);
    }
}

// Helper functions

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"Error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id) {
    $retValue = '{"ID":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '"}';
    sendResultInfoAsJson($retValue);
}

?>

