<?php
include "config.php"; // Inclui o arquivo de configuração que estabelece a conexão com o banco de dados.


// Recebe os dados do formulário de cadastro de usuário via método POST.
// O operador de coalescência nula (??) é utilizado para definir um valor padrão (string vazia)
// caso a chave não exista no $_POST.
$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$telefone = $_POST['telefone'] ?? '';
$cidade = $_POST['cidade'] ?? '';
$bairro = $_POST['bairro'] ?? '';
$senha = $_POST['senha'] ?? '';

// Verifica se o e-mail fornecido já está cadastrado na tabela 'usuarios'.
$sql = "SELECT * FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email); // Vincula o e-mail à query preparada como uma string ('s').
$stmt->execute(); // Executa a query de seleção.
$result = $stmt->get_result(); // Obtém o resultado da query.

// Verifica se o número de linhas retornadas é maior que zero, o que indica que o e-mail já existe.
if ($result->num_rows > 0) {
    echo "email_cadastrado"; // Retorna a string 'email_cadastrado' para o lado do cliente, indicando que o e-mail já está em uso.
} else {
    // Se o e-mail não estiver cadastrado, prepara a query para inserir um novo usuário na tabela 'usuarios'.
    $sql = "INSERT INTO usuarios (nome, email, telefone, cidade, bairro, senha) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    // Vincula os parâmetros da query preparada com os valores recebidos do formulário.
    // "sssss" indica que todos os valores são strings.
    $stmt->bind_param("ssssss", $nome, $email, $telefone, $cidade, $bairro, $senha);
    // Executa a query de inserção.
    if ($stmt->execute()) {
        echo "sucesso"; // Retorna a string 'sucesso' para o lado do cliente, indicando que o cadastro foi realizado com êxito.
    } else {
        echo "erro_ao_cadastrar"; // Retorna a string 'erro_ao_cadastrar' para o lado do cliente, indicando que houve um erro durante o cadastro.
    }
}

// Fecha a conexão com o banco de dados para liberar recursos.
$conn->close();
?>