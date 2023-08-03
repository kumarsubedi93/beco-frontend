<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <v-app>
     <v-container class="fixed-width">
         <div class="header-nav">
             <div class="nav-logo">
                 <img src="/becoclean.png" alt="beco logo"> 
             </div>
             <ul class="nav-links">
                 <li> 
                    <router-link :to="{name:'home'}">
                    Home
                    </router-link>
                  </li>
                 <li> <a href=""> Feedback </a></li>
             </ul>
         </div>
         <RouterView />
     </v-container>
</v-app>
</template>

<style scoped>

body {
  color: #5e5e5e;
}
.fixed-width{
  max-width: 1200px;
}
  .nav-links a {
  text-decoration: none;
}
.nav-links li {
  list-style: none;
}

.header-nav img{
    width: 200px;
    height: auto;
    margin-right: 20px;
}

.header-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.nav-links ul li {
    padding: 5px 14px;
}

.nav-links a{
    margin-right: 10px;
    text-decoration: none;
    color:#000;
    font-size: 18px;
}

.nav-links a:hover .nav-links a:focus {
    color: #30a067;
}

.nav-links{
    display: flex;
}

</style>
