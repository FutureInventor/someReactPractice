<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

function msg($success,$status,$message,$extra = []){
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ],$extra);
}

require __DIR__.'/classes/Database.php';

$db_connection = new Database();
$conn = $db_connection->dbConnection();

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id) 
	&& isset($data->name) 
	&& isset($data->email) 
    && is_numeric($data->id) 
    && is_numeric($data->type)
	&& !empty(trim($data->name)) 
	&& !empty(trim($data->email))
	){
    $user_id = trim($data->id);
    $username = trim($data->name);
    $useremail = trim($data->email);
    $usertype = trim($data->type);
    if (filter_var($useremail, FILTER_VALIDATE_EMAIL)) {
        
        $insert_query = "UPDATE `users` SET `name`='$username', `email`='$useremail', `type`='$usertype' WHERE `id`='$user_id'";

        $insert_stmt = $conn->prepare($insert_query);

        // DATA BINDING
        $insert_stmt->bindValue(':name', htmlspecialchars(strip_tags($username)),PDO::PARAM_STR);
        $insert_stmt->bindValue(':email', $useremail,PDO::PARAM_STR);
        $insert_stmt->bindValue(':type', $usertype,PDO::PARAM_STR);
        $fetch_user_by_id = "SELECT * FROM `users` WHERE `id`='$user_id'";
        $query_stmt = $conn->prepare($fetch_user_by_id);
        $query_stmt->bindValue(':id', $user_id, PDO::PARAM_INT);

        $query_stmt->execute();
        $insert_stmt->execute();

        if($insert_query && $query_stmt->rowCount()){
            $row = $query_stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(["success"=>1,"msg"=>"User Updated.",'user' => $row]);
        }
        else{
            echo json_encode(["success"=>0,"msg"=>"User Not Updated!"]);
        }
    }
    else{
        echo json_encode(["success"=>0,"msg"=>"Invalid Email Address!"]);
    }
}
else{
    echo json_encode(["success"=>0,"msg"=>"Please fill all the required fields!"]);
}