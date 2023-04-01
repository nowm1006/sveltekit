<script lang="ts">
	export let checked: boolean
</script>

<div>
	<label class="relative inline-flex cursor-pointer items-center">
		<input type="checkbox" value="" class="peer sr-only" bind:checked />
		<div
			class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full"
		/>
		<span class="ml-3"><slot /></span>
	</label>
</div>
