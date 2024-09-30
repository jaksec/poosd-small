<?php

	$inData = getRequestInfo();

	$newFirst = $inData["newFirst"];
	$newLast = $inData["newLast"];
	$newEmail = $inData["newEmail"];
	$newPhone = $inData["newPhone"];
	$userId = $inData["userId"];


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
		if ($conn->connect_error)
		{
			returnWithError( $conn->connect_error );
			
		}
		else
		{
			$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName=?, PhoneNumber= ?, EmailAddress= ? WHERE UserID= ?");
			$stmt->bind_param("ssssi", $newFirst, $newLast, $newEmail,$newPhone, $userId);
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