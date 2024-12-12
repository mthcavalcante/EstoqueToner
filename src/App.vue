<!-- src/App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/toners">Toners</router-link> |
      <router-link to="/suppliers">Fornecedores</router-link> |
      <router-link to="/movements">Movimentações</router-link> |
      <router-link to="/reports">Relatórios</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
nav {
  background-color: #42b983;
  padding: 10px;
}
nav a {
  color: white;
  margin-right: 10px;
  text-decoration: none;
  font-weight: bold;
}
nav a.router-link-active {
  text-decoration: underline;
}
</style>
