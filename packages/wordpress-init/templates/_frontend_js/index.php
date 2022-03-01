<!DOCTYPE html>
<html <?= language_attributes(); ?>>
<head>
  <?php get_header(); ?>
</head>

<body>
<?php

wp_body_open();
get_template_part("templates/noscript");

?>

<div data-application="true" aria-label="App"></div>

<?php if (ENV === "development"): ?>

<script type="module">
  import RefreshRuntime from 'http://localhost:3000/@react-refresh'
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="http://localhost:3000/@vite/client"></script>
<script type="module" src="http://localhost:3000/src/main.js"></script>

<?php endif; ?>

<?php

get_template_part("templates/config");
get_footer();

?>
</body>

</html>
