<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

$conn = new mysqli("localhost", "root", "", "emoji_quiz");

$data = json_decode(file_get_contents("php://input"), true);

switch($_SERVER['REQUEST_METHOD']) {
    case "GET":
        if (isset($_GET['id'])) {
            $result = $conn->query("SELECT * FROM riddles WHERE id={$_GET['id']}");
            echo json_encode($result->fetch_assoc());
            break;
        }
        $result = $conn->query("SELECT * FROM riddles");
        $riddles = [];
        while ($row = $result->fetch_assoc()) {
            $riddles[] = $row;
        }
        echo json_encode($riddles);
        break;
    case "POST":
        $result = $conn->query(
            "INSERT INTO riddles (title, answer)
            VALUES ('{$data['title']}', '{$data['answer']}')"
        );

        if ($result) {
            echo json_encode([
                "success" => true
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Adding riddle failed: " . $conn->error
            ]);
        }
        break;
    case "PUT":
        $result = $conn->query(
            "UPDATE riddles SET title='{$data['title']}', answer='{$data['answer']}'
            WHERE id={$data['id']}"
        );

        if ($result) {
            echo json_encode([
                "success" => true
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Updating riddle failed: " . $conn->error
            ]);
        }
        break;
    case "DELETE":
        $result = $conn->query("DELETE FROM riddles WHERE id={$data['id']}");

        if ($result) {
            echo json_encode([
                "success" => true
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Deleting riddle failed: " . $conn->error
            ]);
        }
        break;
    default:
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed"
        ]);
}


$conn->close();
