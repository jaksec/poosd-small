<?php

	$inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "SELECT * FROM Users WHERE Login=?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $username); 
		$stmt->execute();
		$result = $stmt->get_result();
		$rows = mysqli_num_rows($result);

		if ($rows == 0)
		{
			$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Username, Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $username, $password);
			$stmt->execute();
			$id = $conn->insert_id;
			$stmt->close();
			$conn->close();
			http_response_code(200);
			$searchResults .= '{'.'"ID": "'.$id.''.'"}';

			returnWithInfo($searchResults);
		} 
		else {
			http_response_code(409);
			returnWithError("Sorry...Username is taken");
		}
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
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . ']}';
		sendResultInfoAsJson( $retValue );
	}

?>
