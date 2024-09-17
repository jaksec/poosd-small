<?php 

$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$username = $inData["username"];
$password = $inData["password"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} 
else 
{
    // Prepare and bind the select statement
    $stmt = $conn->prepare("SELECT Username FROM Users WHERE Username = ?");
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

