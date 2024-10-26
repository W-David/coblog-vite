<template>
	<router-view />
</template>

<script lang="ts" setup>
const apolloClient = createApolloClient()
provide(DefaultApolloClient, apolloClient)
useDevice()
useWindowResize()
</script>
