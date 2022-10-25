<template>
  <b-link :href="href" class="focess-link">
    <slot/>
    <svg class="bi bi-link-45deg" fill="currentColor" height="20" viewBox="0 0 16 16" width="20"
         xmlns="http://www.w3.org/2000/svg">
      <path
          d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
      <path
          d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
    </svg>
  </b-link>
</template>

<script setup>
defineProps({
  href: {
    type: String
  }
})

</script>

<style scoped>
.focess-link {
  color: #318961;
  background: #598931;
  background: linear-gradient(to top right, #598931 0%, #1D5139 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.focess-link:hover {
  color: #163e2c;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: #163e2c;
  text-decoration: none;
}
</style>