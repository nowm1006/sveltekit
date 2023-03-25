<script lang="ts">
	export let value: string
	export let options: { id: string; name: string }[]
</script>

<select {value} on:change>
	{#each options as option (option.id)}
		<option value={option.id}>{option.name}</option>
	{/each}
</select>
