<?php
// -------------------------
// 1. Vérification de la méthode
// -------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html#contact');
    exit;
}

// Petite fonction de nettoyage
function clean($key) {
    return isset($_POST[$key]) ? trim(strip_tags($_POST[$key])) : '';
}

// -------------------------
// 2. Récupération des champs du formulaire
// -------------------------
$nom        = clean('nom');
$entreprise = clean('entreprise');
$email      = clean('email');
$telephone  = clean('telephone');
$besoin     = clean('besoin');   // ⬅️ bien "besoin" comme dans ton formulaire

$errors = [];

// Champs obligatoires
if ($nom === '') {
    $errors[] = "Le nom est obligatoire.";
}
if ($entreprise === '') {
    $errors[] = "L'entreprise est obligatoire.";
}
if ($besoin === '') {
    $errors[] = "Le champ « Votre besoin » est obligatoire.";
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "L'adresse e-mail n'est pas valide.";
}

// -------------------------
// 3. Si erreurs → petite page explicative
// -------------------------
if (!empty($errors)) {
    ?>
    <!doctype html>
    <html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>Formulaire CESINF – Erreur</title>
    </head>
    <body style="font-family: system-ui, sans-serif; padding: 2rem; background:#0b0e14; color:#e6e8ef;">
        <h1>Votre message n'a pas pu être envoyé</h1>
        <p>Merci de corriger les points suivants :</p>
        <ul>
            <?php foreach ($errors as $err): ?>
                <li><?php echo htmlspecialchars($err, ENT_QUOTES, 'UTF-8'); ?></li>
            <?php endforeach; ?>
        </ul>
        <p><a href="index.html#contact" style="color:#7fffb3;">⬅ Retour au formulaire</a></p>
    </body>
    </html>
    <?php
    exit;
}

// -------------------------
// 4. Construction de l’email
// -------------------------
$to      = 'contact@cesinf.fr';
$subject = 'Nouveau message du site CESINF';

$body = "Un nouveau message a été envoyé depuis le formulaire du site CESINF.\n\n"
      . "Nom       : {$nom}\n"
      . "Entreprise: {$entreprise}\n"
      . "E-mail    : " . ($email ?: 'non renseigné') . "\n"
      . "Téléphone : " . ($telephone ?: 'non renseigné') . "\n"
      . "----------------------------------------\n"
      . "Besoin :\n{$besoin}\n";

$from = 'contact@cesinf.fr';

$headers  = "From: CESINF <{$from}>\r\n";
if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers .= "Reply-To: {$email}\r\n";
}
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// -------------------------
// 5. Envoi
// -------------------------
$ok = mail($to, $subject, $body, $headers);
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Formulaire CESINF – Confirmation</title>
</head>
<body style="font-family: system-ui, sans-serif; padding: 2rem; background:#0b0e14; color:#e6e8ef;">
    <?php if ($ok): ?>
        <h1>Merci, votre message a bien été envoyé ✅</h1>
        <p>Nous reviendrons vers vous dans les meilleurs délais.</p>
    <?php else: ?>
        <h1>Une erreur est survenue ❌</h1>
        <p>Votre message n'a pas pu être envoyé. Vous pouvez essayer plus tard ou écrire directement à :</p>
        <p><strong>contact@cesinf.fr</strong></p>
    <?php endif; ?>

    <p><a href="index.html#contact" style="color:#7fffb3;">⬅ Retour au site CESINF</a></p>
</body>
</html>


