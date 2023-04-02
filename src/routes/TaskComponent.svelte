<script lang="ts">
	import { type Task, type Mode, type Project, type Section, upload, del } from './db'
	import Select from './Select.svelte'

	export let task: Task
	export let projects: Project[]
	export let modes: Mode[]
	export let sections: Section[]
	export let showDone: boolean

	$: [selectedMode] = modes.filter((mode) => mode.id == task.mode)

	async function onChange(e: Event) {
		if (
			!(e.currentTarget instanceof HTMLInputElement) &&
			!(e.currentTarget instanceof HTMLSelectElement)
		)
			return

		const res = await upload(task.id, task)
		e.currentTarget.blur()
		task = task
	}
</script>

<tr
	class="border-b"
	draggable={true}
	style:color={selectedMode?.color || 'black'}
	class:done={task.done && !showDone}
>
	<td><input type="checkbox" bind:checked={task.done} on:change={onChange} /></td>
	<td><input class="w-full py-1 px-4" type="text" bind:value={task.name} on:change={onChange} /></td
	>
	<td>
		<Select bind:value={task.project} options={projects} on:change={onChange} />
	</td>
	<td>
		<Select bind:value={task.mode} options={modes} on:change={onChange} />
	</td>
	<td>
		<Select bind:value={task.section} options={sections} on:change={onChange} />
	</td>
	<td><input class="w-16 p-1" type="text" bind:value={task.estimate} on:change={onChange} /></td>
	<td><input class="w-16 p-1" type="text" bind:value={task.actual} on:change={onChange} /></td>
	<td><button on:click>x</button></td>
</tr>

<style>
	.done {
		@apply hidden;
	}
</style>
