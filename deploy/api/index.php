<?php
 
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Tuupola\Middleware\HttpBasicAuthentication;
use \Firebase\JWT\JWT;
require __DIR__ . '/../vendor/autoload.php';
 

const JWT_SECRET = "makey1234567";

$app = AppFactory::create();

function createJwT (Response $response) : Response {

    $issuedAt = time();
    $expirationTime = $issuedAt + 60;
    $payload = array(
    'userid' => 'toto',
    'email' => 'titi@gmail.com',
    'pseudo' => 'titiPseudo',
    'iat' => $issuedAt,
    'exp' => $expirationTime
    );

    $token_jwt = JWT::encode($payload,JWT_SECRET, "HS256");
    $response = $response->withHeader("Authorization", "Bearer {$token_jwt}");
    return $response;
}

$catalogue = '[
    {
      "id": 1,
      "name": "Aiguillettes de poulet",
      "description": "Poulet français - 1kg",
      "price": 10
    },
    {
      "id": 2,
      "name": "Curry Madras",
      "description": "Marque métro - 480g",
      "price": 9
    },
    {
      "id": 3,
      "name": "Riz Palais des Thés",
      "description": "1kg",
      "price": 2
    },
    {
      "id": 4,
      "name": "Dragon Quest VIII",
      "description": "PS2- 2004",
      "price": 20000
    }
]';


$app->get('/api/hello/{name}', function (Request $request, Response $response, $args) {

    $response->getBody()->write(json_encode("Bonjour " . $args['name']));
    return $response;
});

$app->post('/api/register', function (Request $request, Response $response) {

    // $name = $request->$_POST['name'];
    // $email = $request->$_POST['email'];
    // $password = $request->$_POST['password'];
    $name = "test";
    $email = "test";
    $password = "test";

    $response->getBody()->write(json_encode("Bonjour " . $name . ", vos identifiants : " . $email . " " . $password));
    return $response;
});

// APi d'authentification générant un JWT
$app->post('/api/login', function (Request $request, Response $response, $args) {  
    
//     $email = $request->$_POST['email'];
//     $password = $request->$_POST['password'];
//     $response->getBody()->write(json_encode("Bonjour, vous vous êtes connectés avec : " . $email . " " . $password));
//     return $response;

    $err=false;
    $body = $request->getParsedBody();
    $login = $body ['login'] ?? "";
    $pass = $body ['pass'] ?? "";

    if (!preg_match("/[a-zA-Z0-9]{1,20}/",$login))   {
        $err = true;
    }
    if (!preg_match("/[a-zA-Z0-9]{1,20}/",$pass))  {
        $err=true;
    }

    if (!$err) {
            $response = createJwT ($response);
            $data = array('nom' => 'toto', 'prenom' => 'titi');
            $response->getBody()->write(json_encode($data));
     } else {          
            $response = $response->withStatus(401);
     }
    return $response;
});

$app->get('/api/user', function (Request $request, Response $response, $args) {   
    $data = array('nom' => 'toto', 'prenom' => 'titi','adresse' => '6 rue des fleurs', 'tel' => '0606060607');
    $response->getBody()->write(json_encode($data));

    return $response;
});

$app->get('/api/catalogue', function (Request $request, Response $response) {
    return $catalogue;
});

$app->get('/api/product/{id}', function (Request $request, Response $response, $args) {

    $response->getBody()->write(json_encode("Bonjour " . $args['name']));
    return $response;
});

$options = [
    "attribute" => "token",
    "header" => "Authorization",
    "regexp" => "/Bearer\s+(.*)$/i",
    "secure" => false,
    "algorithm" => ["HS256"],
    "secret" => JWT_SECRET,
    "path" => ["/api"],
    "ignore" => ["/api/hello","/api/login","/api/createUser"],
    "error" => function ($response, $arguments) {
        $data = array('ERREUR' => 'Connexion', 'ERREUR' => 'JWT Non valide');
        $response = $response->withStatus(401);
        return $response->withHeader("Content-Type", "application/json")->getBody()->write(json_encode($data));
    }
];

$app->add(new Tuupola\Middleware\JwtAuthentication($options));

$app->run();