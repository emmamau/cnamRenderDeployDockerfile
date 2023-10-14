<?php
	use Doctrine\ORM\Tools\Setup;
	use Doctrine\ORM\EntityManager;
	date_default_timezone_set('America/Lima');
	require_once "vendor/autoload.php";
	$isDevMode = true;
	$config = Setup::createYAMLMetadataConfiguration(array(__DIR__ . "/config/yaml"), $isDevMode);
	$conn = array(
	'host' => 'dpg-ck3ie7b6fquc73cq3a50-a.oregon-postgres.render.com',

	'driver' => 'pdo_pgsql',
	'user' => 'cnam_db_92ul_user',
	'password' => 'Z0OjNnVAavrSDdSI6biVgys2U3N52Z3Q',
	'dbname' => 'cnam_db_92ul',
	'port' => '5432'
	);

	$entityManager = EntityManager::create($conn, $config);



