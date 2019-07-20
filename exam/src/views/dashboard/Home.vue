<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Hi {{_.capitalize($store.state.user.data.nama)}}</h1>
        <h2 class="subtitle">
          A simple container to divide your page into <strong>sections</strong>, like the one you're currently reading
        </h2>
      </div>
    </section>
  </div>
</template>