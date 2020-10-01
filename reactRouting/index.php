<?php 
$user1 = (object) [
    'name' => 'Jane Doe',
    'email' => 'janedoe@gmail.com',
    'logged' => true
];

?>
<!doctype html>
<html lang="en">
    <head>
        <title>reactRouting</title>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="http://localhost/reactRouting/app/assets/css/app.css" type="text/css">
    </head>
    <script type="text/javascript">
        var STATIC_URL = 'http://localhost/reactRouting/';
        var myApp = {
            user1 : <?php echo json_encode($user1); ?>,
            logged : <?php echo json_encode($user1->logged); ?>
        };
    </script>
    <body>

        <div id="app"></div>

        <script type="text/javascript" src="http://localhost/reactRouting/app/assets/bundle/main.bundle.js" ></script>

    </body>
</html>
