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

// Récupère la commande
$stmt = $conn->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->execute([$id]);
$order = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$order) {
    header("Location: admin_dashboard.php");
    exit;
}

$error = "";
$success = "";

// Mise à jour du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $product_name = $_POST['product_name'];
    $order_date = $_POST['order_date'];
    $amount = $_POST['amount'];
    $status = $_POST['status'];

    $stmt = $conn->prepare("UPDATE orders SET user_id = ?, product_name = ?, order_date = ?, amount = ?, status = ? WHERE id = ?");
    if ($stmt->execute([$user_id, $product_name, $order_date, $amount, $status, $id])) {
        $success = "Commande mise à jour avec succès !";
        $stmt = $conn->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        $error = "Erreur lors de la mise à jour.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Modifier commande - Admin</title>
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
.btn-back:hover { background: #333; color: #fff; }
</style>
</head>
<body>

<div class="container">
    <h1>Modifier commande</h1>

    <?php if($success) echo "<p class='success'>$success</p>"; ?>
    <?php if($error) echo "<p class='error'>$error</p>"; ?>

    <form method="POST">
        <input type="number" name="user_id" value="<?php echo $order['user_id']; ?>" required placeholder="ID utilisateur">
        <input type="text" name="product_name" value="<?php echo htmlspecialchars($order['product_name']); ?>" required placeholder="Produit">
        <input type="date" name="order_date" value="<?php echo $order['order_date']; ?>" required>
        <input type="number" step="0.01" name="amount" value="<?php echo $order['amount']; ?>" required placeholder="Montant (€)">
        <select name="status" required>
            <option value="En attente" <?php if($order['status']=='En attente') echo 'selected'; ?>>En attente</option>
            <option value="Confirmée" <?php if($order['status']=='Confirmée') echo 'selected'; ?>>Confirmée</option>
            <option value="Livrée" <?php if($order['status']=='Livrée') echo 'selected'; ?>>Livrée</option>
        </select>
        <button type="submit">Enregistrer les modifications</button>
    </form>

    <a href="admin_dashboard.php" class="btn-back">Retour au dashboard</a>
</div>

</body>
</html>