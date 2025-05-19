<?php
require 'config.php'; // Inclui o arquivo de configuração que estabelece a conexão com o banco de dados.
session_start(); // Inicia a sessão do PHP para poder armazenar informações do usuário.

class LoginApp {
    private $email; // Variável privada para armazenar o e-mail do usuário.
    private $senha; // Variável privada para armazenar a senha do usuário.

    // Construtor da classe LoginApp. Recebe o e-mail e a senha como argumentos
    // e os atribui às propriedades da classe.
    public function __construct($email, $senha) {
        $this->email = $email;
        $this->senha = $senha;
    }

    // Método para autenticar o usuário no banco de dados.
    public function autenticar() {
        global $conn; // Importa a variável de conexão com o banco de dados definida no arquivo config.php.

        // Query SQL para selecionar um usuário da tabela 'usuarios'
        // onde o e-mail e a senha coincidem com os fornecidos.
        // O 'LIMIT 1' é usado para otimizar a consulta, pois esperamos no máximo um usuário com essas credenciais.
        $sql = "SELECT * FROM usuarios WHERE email = '$this->email' AND senha = '$this->senha' LIMIT 1";
        $result = $conn->query($sql); // Executa a query no banco de dados.

        // Verifica se a consulta foi bem-sucedida ($result é um objeto) e se encontrou alguma linha ($result->num_rows > 0).
        if ($result && $result->num_rows > 0) {
            $usuario = $result->fetch_assoc(); // Obtém a linha resultante como um array associativo.
            // Salva o ID do usuário na variável de sessão 'usuario_id'.
            // As variáveis de sessão persistem entre as requisições do mesmo usuário.
            $_SESSION['usuario_id'] = $usuario['id'];
            // Retorna uma resposta JSON indicando sucesso ('status' => 'ok')
            // e incluindo o ID e o nome do usuário.
            return json_encode([
                "status" => "ok",
                "id" => $usuario['id'],
                "nome" => $usuario['nome']
            ]);
        } else {
            // Se a consulta não encontrou nenhum usuário com as credenciais fornecidas,
            // retorna uma resposta JSON indicando erro ('status' => 'erro').
            return json_encode(["status" => "erro"]);
        }
    }
}

// Captura os dados de e-mail e senha enviados via método POST.
$email = $_POST['email'];
$senha = $_POST['senha'];

// Cria uma instância da classe LoginApp com o e-mail e a senha recebidos.
$loginApp = new LoginApp($email, $senha);
// Chama o método 'autenticar' da instância de LoginApp e imprime o resultado (a string JSON).
echo $loginApp->autenticar();
?>