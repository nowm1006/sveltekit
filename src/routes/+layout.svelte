<script lang="ts">
	import '../app.css'
</script>

<svelte:head>
	<link rel="stylesheet" href="/fontawesome/css/all.min.css" />
</svelte:head>

<header>
	<div class="flex h-8 items-center justify-center bg-gray-700">
		<i class="fa-solid fa-plane-departure mr-1 text-white" />
		<span class="font-bold text-white">TaskChute</span>
		<span class="font-light text-white">Clone</span>
	</div>
</header>
<slot />
