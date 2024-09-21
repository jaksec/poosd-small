<?php


$inData = getRequestInfo();

// Ensure the expected data is available
$firstName = isset($inData["firstName"]) ? $inData["firstName"] : null;
$lastName = isset($inData["lastName"]) ? $inData["lastName"] : null;
$username = isset($inData["username"]) ? $inData["username"] : null;
$password = isset($inData["password"]) ? $inData["password"] : null;

// Check if all required fields are provided and not empty
if (empty($firstName) || empty($lastName) || empty($username) || empty($password)) {
    http_response_code(400);
    exit;
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check for connection errors
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Check if the username already exists
    $stmt = $conn->prepare("SELECT * FROM Users WHERE Username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = $result->num_rows;
    // If the username does not exist, continue to registration
    if ($rows == 0) {
        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Username, Password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $username, $password);

        if ($stmt->execute()) {
            $id = $conn->insert_id;
            $stmt->close();
            $conn->close();
            http_response_code(200);
            returnWithInfo($firstName, $lastName, $id);
        } else {
            returnWithError("Error inserting user: " . $stmt->error);
        }
    } else {
        http_response_code(409); // username taken
        returnWithError("Sorry...Username is taken");
    }
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type:application/json');
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
