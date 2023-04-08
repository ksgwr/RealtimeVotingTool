<template>
  <!--div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/room/abc">Room</router-link> |
    <router-link to="/about">About</router-link>
  </div-->
  <PageHeader />
  <router-view name="dialog" />
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
