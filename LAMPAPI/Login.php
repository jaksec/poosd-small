
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Username=? AND Password =?");
		$stmt->bind_param("ss", $inData["username"], $inData["password"]); 
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )  
		{
			returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] ); 
		}
		else
		{
			returnWithError("No records found"); 
		}

		$stmt->close();
		$conn->close();
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
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"ID":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
