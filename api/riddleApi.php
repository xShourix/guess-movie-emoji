<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

$conn = new mysqli("localhost", "root", "", "emoji_quiz");

$data = json_decode(file_get_contents("php://input"), true);

switch($_SERVER['REQUEST_METHOD']) {
    case "GET":
        // If count parametr is provided, return number of riddles
        if (isset($_GET['count'])) {
            $result = $conn->query("SELECT COUNT(*) as count FROM riddles");
            echo json_encode($result->fetch_assoc());
            break;
        }
        // If an ID is provided, return the specific riddle
        else if (isset($_GET['id'])) {
            $result = $conn->query("SELECT * FROM riddles WHERE id={$_GET['id']}");
            echo json_encode($result->fetch_assoc());
            break;
        }
        // If exclude parameter is provided and not empty, return a random riddle excluding the specified IDs
        else if (isset($_GET['exclude']) && $_GET['exclude'] !== '') {
            $databaseCount = $conn->query("SELECT COUNT(*) as count FROM riddles")->fetch_assoc()['count'];
            $excludeCount = count(explode(",", $_GET['exclude']));

            if($databaseCount == 0) {
                echo json_encode([
                    "empty" => true
                ]);
                break;
            }
            if($databaseCount <= $excludeCount) {
                echo json_encode([
                    "finished" => true
                ]);
                break;
            }
            $result = $conn->query("SELECT * FROM riddles WHERE id NOT IN ({$_GET['exclude']}) ORDER BY RAND() LIMIT 1");
            echo json_encode([
                "finished" => false,
                "riddle" => $result->fetch_assoc()
            ]);
            break;
        }
        // If exclude parameter is provided but empty, return a random riddle
        else if (isset($_GET['exclude']) && $_GET['exclude'] === '') {
            $result = $conn->query("SELECT * FROM riddles ORDER BY RAND() LIMIT 1");
            echo json_encode([ 
                "riddle" => $result->fetch_assoc()
            ]);
            break;
        }
        // If page and limit parametr is provided, return slice of data which fits to requirements
        else if ((isset($_GET['page'])) && isset($_GET['limit'])) {
            $page = (int) $_GET['page'];
            $limit = (int) $_GET['limit'];
            $offset = ($page - 1) * $limit;
            
            $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : "";
            
            $total = $conn->query("
                SELECT COUNT(*) AS count
                FROM riddles
                WHERE title LIKE '%$search%'
            ")->fetch_assoc()['count'];

            $result = $conn->query("
                SELECT *
                FROM riddles
                WHERE title LIKE '%$search%'
                LIMIT $limit OFFSET $offset
            ");
            
            $riddles = [];

            while ($row = $result->fetch_assoc()) {
                $riddles[] = $row;
            }

            echo json_encode([
                "riddles" => $riddles,
                "pages" => ceil($total / $limit)
            ]);
            break;
        }
        // If no specific ID or exclude list is provided, return all riddles
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
