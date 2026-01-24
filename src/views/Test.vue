<template>
  <div style="padding: 2rem;">
    <h1>Test Page</h1>
    <p>Scroll down and click links to test scroll behavior.</p>

    <div style="height: 200vh; background: linear-gradient(var(--color-bg), var(--color-accent)); padding: 2rem;">
      <p>Long content area...</p>

      <div style="position: fixed; top: 100px; right: 20px; background: var(--color-secondary); padding: 1rem; border-radius: 8px;">
        <p><strong>Nav links:</strong></p>
        <p><router-link to="/test?q=1">Test ?q=1</router-link></p>
        <p><router-link to="/test?q=2">Test ?q=2</router-link></p>
        <p><router-link to="/test?q=3">Test ?q=3</router-link></p>
        <p><router-link to="/">Home</router-link></p>
      </div>
    </div>

    <h2>Bottom of page</h2>
    <p>If scroll works, clicking nav links should bring you here to top.</p>
  </div>
</template>
