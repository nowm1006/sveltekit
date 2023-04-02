<script lang="ts">
	import { onMount } from 'svelte'
	import { load, upload, create, del } from './db'
	import type { Task, Project, Mode, Section } from './db'
	import TaskComponent from './TaskComponent.svelte'
	import ToggleSwitch from '$lib/ToggleSwitch.svelte'
	import TimeSummary from './TimeSummary.svelte'

	// props

	// states
	let tasks: Task[] = []
	let projects: Project[] = []
	let modes: Mode[] = []
	let sections: Section[] = []
	let showDone = false
	let date = new Date()

	// lifecycle
	onMount(async () => {
		const data = await load()
		tasks = data.tasks
		projects = data.projects
		modes = data.modes
		sections = data.sections
	})

	// functions
	async function changeTask(task: Task) {
		const res = await upload(task.id, task)
		tasks = tasks
	}

	async function addTask(target: HTMLInputElement) {
		const res = await create({ name: target.value, section: 'v8oxto1ra8ghn3w' })
		target.value = ''
		target.blur()
		tasks = [...tasks, res]
	}

	async function delTask(task: Task) {
		const res = await del(task.id)
		if (res) {
			tasks = tasks.filter((t) => t.id != task.id)
		}
	}

	function dateISOString(date: Date) {
		const yyyy = date.getFullYear().toString()
		const mm = (date.getMonth() + 1).toString().padStart(2, '0')
		const dd = date.getDate().toString().padStart(2, '0')
		return `${yyyy}-${mm}-${dd}`
	}
</script>

<svelte:head>
	<title>TaskChuteClone</title>
</svelte:head>

<div class="container m-auto max-w-5xl">
	<div class="flex gap-4 p-4">
		<TimeSummary {tasks} {sections} />
		<ToggleSwitch bind:checked={showDone}>Show Done</ToggleSwitch>

		<div class="flex flex-col">
			<input class="h-12 w-52 border p-2 text-center" type="date" value={dateISOString(date)} />
			<div class="flex">
				<button
					class="h-12 flex-auto border"
					on:click={() => {
						date.setDate(date.getDate() - 1)
						date = date
					}}>前日</button
				>
				<button
					class="h-12 flex-auto border"
					on:click={() => {
						date = new Date()
					}}>今日</button
				>
				<button
					class="h-12 flex-auto border"
					on:click={() => {
						date.setDate(date.getDate() + 1)
						date = date
					}}>翌日</button
				>
			</div>
		</div>
	</div>
	<div class="my-4">
		<i class="fa-solid fa-circle-plus fa-xl mr-1 text-sky-400" />
		<input
			class="my-2 w-96 rounded border p-2"
			type="text"
			placeholder="New Task"
			on:change={(e) => addTask(e.currentTarget)}
		/>
	</div>
	<table class="w-full">
		<thead>
			<tr class="border-b bg-slate-400 text-left text-white shadow-lg">
				<th><input type="checkbox" /></th>
				<th>Task</th>
				<th>Project</th>
				<th>Mode</th>
				<th>Section</th>
				<th>Estimate</th>
				<th>Actual</th>
				<th>...</th>
			</tr>
		</thead>
		<tbody>
			{#each sections as section (section.id)}
				{@const sectionTasks = tasks.filter((task) => task.section == section.id)}
				<tr class="mt-4 bg-gray-400 text-white"
					><td class="px-2" colspan="8">{section.name} {section.start}:00~ 「{section.comment}」</td
					></tr
				>
				{#each sectionTasks as task (task.id)}
					<TaskComponent
						bind:task
						{projects}
						{modes}
						{sections}
						{showDone}
						on:change={() => changeTask(task)}
						on:blur={() => changeTask(task)}
						on:click={() => delTask(task)}
					/>
				{/each}
			{/each}
		</tbody>
	</table>
</div>
