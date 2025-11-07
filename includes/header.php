<?php require_once __DIR__ . '/session.php'; $parts = explode('/', trim($_SERVER['SCRIPT_NAME'], '/')); $base = '/' . ($parts[0] ?? ''); ?>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
  <div class="container">
    <a class="navbar-brand" href="<?php echo $base; ?>/index.php">Neth shopping</a>
    <button class="navbar-toggler" type="button">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="<?php echo $base; ?>/index.php">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="<?php echo $base; ?>/contactus.php">Contact Us</a></li>
        <li class="nav-item"><a class="nav-link" href="<?php echo $base; ?>/cart.php">🛒 Cart</a></li>
        <?php if (!empty($_SESSION['authenticated']) && !empty($_SESSION['user'])): ?>
          <li class="nav-item d-flex align-items-center me-2">
            <span class="navbar-text small">Hello, <?php echo htmlspecialchars($_SESSION['user']['first_name'] ?? $_SESSION['user']['username'] ?? 'User'); ?></span>
          </li>
          <li class="nav-item">
            <a class="btn btn-sm btn-outline-light nav-link px-3" href="<?php echo $base; ?>/api/logout.php">Logout</a>
          </li>
        <?php else: ?>
          <li class="nav-item">
            <button class="btn btn-sm btn-outline-light nav-link" id="navLoginBtn" data-bs-toggle="modal" data-bs-target="#loginModal">LOGIN</button>
          </li>
        <?php endif; ?>
      </ul>
    </div>
  </div>
  
</nav>
<script>window.BASE_PATH=<?php echo json_encode($base); ?>;window.IS_AUTH=<?php echo (!empty($_SESSION['authenticated']) && !empty($_SESSION['user'])) ? 'true' : 'false'; ?>;</script>


