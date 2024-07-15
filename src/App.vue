<template>
	<router-view />
</template>

<script lang="ts" setup>
import { createApolloClient } from './modules/graphql'

const apolloClient = createApolloClient()
provide(DefaultApolloClient, apolloClient)
useDevice()
useWindowResize()
</script>
