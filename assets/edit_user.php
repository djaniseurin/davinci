<?php
session_start();
require_once 'db.php';

// Vérifie si admin
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] != 1) {
    header("Location: login.php");
    exit;
}

// Vérifie l'ID passé en GET
if (!isset($_GET['id'])) {
    header("Location: admin_dashboard.php");
    exit;
}

$id = $_GET['id'];

// Récupère l'utilisateur
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    header("Location: admin_dashboard.php");
    exit;
}

$error = "";
$success = "";

// Mise à jour du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $civilite = $_POST['civilite'];
    $prenom = $_POST['prenom'];
    $email = $_POST['email'];
    $points = $_POST['points'];
    $role = $_POST['role'];

    $stmt = $conn->prepare("UPDATE users SET civilite = ?, prenom = ?, email = ?, points = ?, role = ? WHERE id = ?");
    if ($stmt->execute([$civilite, $prenom, $email, $points, $role, $id])) {
        $success = "Utilisateur mis à jour avec succès !";
        // Recharger les données
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $error = "Erreur lors de la mise à jour.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Modifier utilisateur - Admin</title>
<style>
body { font-family: Arial, sans-serif; background: #f8f8f8; padding: 40px; }
.container { background: #fff; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto; box-shadow: 0 8px 25px rgba(0,0,0,0.1);}
h1 { text-align: center; margin-bottom: 20px; color: #111; }
form { display: flex; flex-direction: column; }
input, select { margin-bottom: 15px; padding: 12px; border-radius: 8px; border: 1px solid #ccc; font-size: 14px; }
button { background: #111; color: #fff; padding: 12px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; transition: 0.3s; }
button:hover { background: #333; }
.success { color: green; margin-bottom: 15px; text-align: center; }
.error { color: red; margin-bottom: 15px; text-align: center; }
.btn-back { display: block; text-align: center; margin-top: 20px; background: #555; color: #fff; padding: 10px; border-radius: 8px; text-decoration: none; }
.btn-back:hover { background: #333; }
</style>
</head>
<body>

<div class="container">
    <h1>Modifier utilisateur</h1>

    <?php if($success) echo "<p class='success'>$success</p>"; ?>
    <?php if($error) echo "<p class='error'>$error</p>"; ?>

    <form method="POST">
        <select name="civilite" required>
            <option value="M" <?php if($user['civilite']=='M') echo 'selected'; ?>>M</option>
            <option value="Mme" <?php if($user['civilite']=='Mme') echo 'selected'; ?>>Mme</option>
        </select>
        <input type="text" name="prenom" value="<?php echo htmlspecialchars($user['prenom']); ?>" required>
        <input type="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
        <input type="number" name="points" value="<?php echo $user['points'] ?? 0; ?>" required>
        <select name="role" required>
            <option value="0" <?php if($user['role']==0) echo 'selected'; ?>>Utilisateur</option>
            <option value="1" <?php if($user['role']==1) echo 'selected'; ?>>Admin</option>
        </select>
        <button type="submit">Enregistrer les modifications</button>
    </form>

    <a href="admin_dashboard.php" class="btn-back">Retour au dashboard</a>
</div>

</body>
</html>