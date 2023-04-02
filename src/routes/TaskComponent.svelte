<script lang="ts">
	import type { Task, Mode, Project, Section } from './db'
	import Select from './Select.svelte'

	export let task: Task
	export let projects: Project[]
	export let modes: Mode[]
	export let sections: Section[]
	export let showDone: boolean

	$: [selectedMode] = modes.filter((mode) => mode.id == task.mode)
</script>

<tr
	class="border-b"
	draggable={true}
	style:color={selectedMode?.color || 'black'}
	class:done={task.done && !showDone}
>
	<td><input type="checkbox" bind:checked={task.done} on:change /></td>
	<td><input class="w-full py-1 px-4" type="text" bind:value={task.name} on:change /></td>
	<td>
		<Select bind:value={task.project} options={projects} on:change />
	</td>
	<td>
		<Select bind:value={task.mode} options={modes} on:change />
	</td>
	<td>
		<Select bind:value={task.section} options={sections} on:change />
	</td>
	<td><input class="w-16 p-1" type="number" bind:value={task.estimate} on:blur /></td>
	<td><input class="w-16 p-1" type="number" bind:value={task.actual} on:blur /></td>
	<td><button on:click>x</button></td>
</tr>

<style>
	.done {
		@apply hidden;
	}
</style>
