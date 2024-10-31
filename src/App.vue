<template>
	<router-view />
</template>

<script lang="ts" setup>
const apolloClient = singletonApolloClient()
provide(DefaultApolloClient, apolloClient)
useDevice()
useWindowResize()
</script>
