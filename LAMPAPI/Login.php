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

// Function to get JSON request body
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send JSON response
function sendResultInfoAsJson($obj)
{
    header('Content-Type: application/json');
    echo json_encode($obj);
}

// Function to handle errors
function returnWithError($err)
{
    $retValue = ['id' => 0, 'firstName' => '', 'lastName' => '', 'error' => $err];
    sendResultInfoAsJson($retValue);
}

// Function to return successful login info
function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = ['id' => $id, 'firstName' => $firstName, 'lastName' => $lastName, 'error' => ''];
    sendResultInfoAsJson($retValue);
}

// Begin main logic
$inData = getRequestInfo();

// Check if username and password are provided in the JSON body
if (!isset($inData["username"]) || !isset($inData["password"])) {
    returnWithError("Invalid input");
    exit;
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check for connection errors
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName FROM Users WHERE Username=? AND Password=?");
    $stmt->bind_param("ss", $inData["username"], $inData["password"]);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if a matching user was found
    if ($row = $result->fetch_assoc()) {
        returnWithInfo($row['FirstName'], $row['LastName'], $row['ID']);
    } else {
        returnWithError("No Records Found");
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}
?>
