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
	
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$emailAddress = $inData["emailAddress"];
$phoneNumber = $inData["phoneNumber"];
$userId = (int)$inData["userId"];


$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
if( $conn->connect_error )
{
	returnWithError( $conn->connect_error );
}
else
{
	$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,EmailAddress,PhoneNumber, UserID) VALUES(?,?,?,?,?)");
	$stmt->bind_param("ssssi", $firstName,$lastName,$emailAddress,$phoneNumber,$userId);
	$stmt->execute();
	$stmt->close();
	$conn->close();
	returnWithError("");
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError( $err )
{
	$retValue = '{"Error":"' . $err . '"}';
	sendResultInfoAsJson( $retValue );
}

?>

	
