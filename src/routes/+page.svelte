<script lang="ts">
	import { onMount } from 'svelte'
	import { load, upload, create, del } from './db'
	import type { Task, Project, Mode, Section } from './db'
	import Select from './Select.svelte'

	// props

	// states
	let tasks: Task[] = []
	let projects: Project[] = []
	let modes: Mode[] = []
	let sections: Section[] = []
	let currentTime = currentTimeString(0)
	let timeSammary: any
	let showDone = false
	let date = new Date()

	$: {
		timeSammary = tasks.reduce(
			(p, c) => {
				if (c.done) return p
				p.total += c.estimate
				const [section] = sections.filter((section) => section.id == c.section)
				p[section.name as keyof typeof p] += c.estimate
				return p
			},
			{ total: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, U: 0 }
		)
		currentTime = currentTimeString(timeSammary.total)
	}

	// lifecycle
	onMount(async () => {
		const data = await load()
		tasks = data.tasks
		projects = data.projects
		modes = data.modes
		sections = data.sections

		const timer = setInterval(() => {
			currentTime = currentTimeString(timeSammary.total)
		}, 60 * 1000)
		return () => {
			clearInterval(timer)
		}
	})

	// functions
	async function handler(target: EventTarget | null, task: Task) {
		if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return

		const res = await upload(task.id, task)
		target.blur()
		tasks = tasks
	}

	async function addTask(target: HTMLInputElement) {
		const res = await create({ name: target.value, section: 'v8oxto1ra8ghn3w' })
		target.value = ''
		target.blur()
		tasks = [...tasks, res]
	}

	async function delTask(e: Event, task: Task) {
		const res = await del(task.id)
		if (res) {
			tasks = tasks.filter((t) => t.id != task.id)
		}
	}

	function currentTimeString(taskMin: number) {
		const now = new Date()
		const hh = now.getHours()
		const mm = now.getMinutes()
		const totalMin = hh * 60 + mm + taskMin
		const hhTotal = Math.floor(totalMin / 60)
		const mmTotal = (totalMin % 60).toString().padStart(2, '0')
		return `${hhTotal}:${mmTotal}`
	}

	const min2hhmm = (min: number): string => {
		const hh = Math.floor(min / 60)
		const mm = (min % 60).toString().padStart(2, '0')
		return `${hh}:${mm}`
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
		<div class="basis-36 rounded border">
			<div class="border-b text-center">終了予定</div>
			<p class="text-center text-2xl">{currentTime}</p>
		</div>
		<div class="flex h-24 basis-52 flex-col flex-wrap rounded border p-2">
			{#each Object.keys(timeSammary) as section (section)}
				{#if section.length == 1}
					<p>{section}: {min2hhmm(timeSammary[section])}</p>
				{/if}
			{/each}
		</div>
		<div>
			<input type="checkbox" id="show-done" bind:checked={showDone} />
			<label for="show-doen">Show Done</label>
		</div>
		<div class="flex flex-col">
			<input type="date" value={dateISOString(date)} />
			<div>
				<button
					class="border"
					on:click={() => {
						date.setDate(date.getDate() - 1)
						date = date
					}}>前日</button
				>
				<button
					class="border"
					on:click={() => {
						date = new Date()
					}}>今日</button
				>
				<button
					class="border"
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
			class="my-2"
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
					{@const [selectedMode] = modes.filter((mode) => mode.id == task.mode)}
					<tr
						class="border-b"
						draggable={true}
						style:color={selectedMode?.color || 'black'}
						class:done={task.done && !showDone}
					>
						<td
							><input
								type="checkbox"
								bind:checked={task.done}
								on:change={(e) => handler(e.currentTarget, task)}
							/></td
						>
						<td
							><input
								class="w-full py-1 px-4"
								type="text"
								bind:value={task.name}
								on:change={(e) => handler(e.currentTarget, task)}
							/></td
						>
						<td>
							<Select
								bind:value={task.project}
								options={projects}
								on:change={(e) => handler(e.currentTarget, task)}
							/>
						</td>
						<td>
							<Select
								bind:value={task.mode}
								options={modes}
								on:change={(e) => handler(e.currentTarget, task)}
							/>
						</td>
						<td>
							<Select
								bind:value={task.section}
								options={sections}
								on:change={(e) => handler(e.currentTarget, task)}
							/>
						</td>
						<td
							><input
								class="w-16 p-1"
								type="text"
								bind:value={task.estimate}
								on:change={(e) => handler(e.currentTarget, task)}
							/></td
						>
						<td
							><input
								class="w-16 p-1"
								type="text"
								bind:value={task.actual}
								on:change={(e) => handler(e.currentTarget, task)}
							/></td
						>
						<td><button on:click={(e) => delTask(e, task)}>x</button></td>
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
</div>

<style>
	.done {
		@apply hidden;
	}
</style>
