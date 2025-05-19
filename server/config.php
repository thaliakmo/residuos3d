<?php

// Bloco de configuração de cabeçalhos HTTP para controle de acesso e cache.

// Permite Cross-Origin Resource Sharing (CORS) para todas as origens (*).
// Isso é útil para permitir o aplicativo web (rodando em um domínio diferente)
header("Access-Control-Allow-Origin: *");

// Define os métodos HTTP permitidos para requisições CORS.
// Aqui, permite POST, GET e OPTIONS. OPTIONS é usado para preflight requests pelo navegador.
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Define os cabeçalhos permitidos nas requisições CORS.
// Content-Type é comum para enviar dados no corpo da requisição (por exemplo, application/json).
header("Access-Control-Allow-Headers: Content-Type");

// Bloco de configuração de cache para evitar que os navegadores armazenem em cache as respostas.
// Isso é importante para APIs onde os dados podem mudar frequentemente e você quer garantir
// que o cliente sempre receba a versão mais recente.
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

// Bloco de configuração de segurança para evitar ataques de Content-Type sniffing.
// Isso instrui o navegador a não tentar adivinhar o tipo de conteúdo da resposta
// se o cabeçalho Content-Type indicar algo diferente.
header("X-Content-Type-Options: nosniff");

// Bloco de configuração da conexão com o banco de dados MySQL.

// Define as constantes para o servidor, nome de usuário, senha e nome do banco de dados.
// Estes valores precisam corresponder às configurações do MySQL.
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "residuos3d";

// Cria uma nova conexão com o banco de dados MySQL usando a extensão mysqli.
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica se houve algum erro na conexão com o banco de dados.
if ($conn->connect_error) {
    // Se a conexão falhar, envia uma resposta JSON com um status de erro e a mensagem de erro da conexão.
    // A função die() encerra a execução do script após enviar a resposta.
    die(json_encode(["status" => "erro", "message" => "Falha na conexão com o banco de dados: " . $conn->connect_error]));
}

// Define o conjunto de caracteres da conexão para UTF-8.
// Isso é importante para garantir que os dados com caracteres especiais (como acentos)
// sejam tratados corretamente.
$conn->set_charset("utf8");
?>