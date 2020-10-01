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
$logged = false;

if(isset($data->id))
{
    $insert_query = "UPDATE `users` SET `logged`='$logged' WHERE `id`='$data->id'";
    $insert_stmt = $conn->prepare($insert_query);
    $insert_stmt->bindValue(':logged', $logged,PDO::PARAM_STR);
    $insert_stmt->execute();

    if($insert_query){
        echo json_encode(["success"=>1,"msg"=>"Logout"]);
    }
    else{
        echo json_encode(["success"=>0,"msg"=>"Fail"]);
    }
}