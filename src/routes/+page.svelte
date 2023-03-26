<script lang="ts">
	import { onMount } from 'svelte'
	import { load, upload, create } from './db'
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

	$: {
		timeSammary = tasks.reduce(
			(p, c) => {
				p.total += c.estimate
				const [section] = sections.filter((section) => section.id == c.section)
				p[section.name as keyof typeof p] += c.estimate
				return p
			},
			{ total: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, U: 0 }
		)
		currentTime = currentTimeString(timeSammary.total)
		console.log(timeSammary)
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
	async function handler(target: EventTarget | null, task: Task, field: keyof Task) {
		if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return

		await upload(task.id, field, target.value)
		target.blur()
		const data = await load()
		tasks = data.tasks
	}

	async function addTask(target: HTMLInputElement) {
		await create({ name: target.value, section: 'v8oxto1ra8ghn3w' })
		target.value = ''
		target.blur()
		const data = await load()
		tasks = data.tasks
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
		<div class="bourder flex h-24 basis-36 flex-col flex-wrap rounded">
			{#each Object.keys(timeSammary) as section (section)}
				{#if section.length == 1}
					<p>{section}: {min2hhmm(timeSammary[section])}</p>
				{/if}
			{/each}
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
				<th>Task</th>
				<th>Project</th>
				<th>Mode</th>
				<th>Section</th>
				<th>Estimate</th>
				<th>Actual</th>
			</tr>
		</thead>
		<tbody>
			{#each sections as section (section.id)}
				{@const sectionTasks = tasks.filter((task) => task.section == section.id)}
				<tr class="mt-4 bg-gray-400 text-white"
					><td class="px-2" colspan="6">{section.name} {section.start}:00~ 「{section.comment}」</td
					></tr
				>
				{#each sectionTasks as task (task.id)}
					{@const [selectedMode] = modes.filter((mode) => mode.id == task.mode)}
					<tr class="border-b" draggable={true} style:color={selectedMode?.color || 'black'}>
						<td
							><input
								class="w-full p-1"
								type="text"
								value={task.name}
								on:change={(e) => handler(e.currentTarget, task, 'name')}
							/></td
						>
						<td>
							<Select
								value={task.project}
								options={projects}
								on:change={(e) => handler(e.currentTarget, task, 'project')}
							/>
						</td>
						<td>
							<Select
								value={task.mode}
								options={modes}
								on:change={(e) => handler(e.currentTarget, task, 'mode')}
							/>
						</td>
						<td>
							<Select
								value={task.section}
								options={sections}
								on:change={(e) => handler(e.currentTarget, task, 'section')}
							/>
						</td>
						<td
							><input
								class="w-16 p-1"
								type="text"
								value={task.estimate}
								on:change={(e) => handler(e.currentTarget, task, 'estimate')}
							/></td
						>
						<td
							><input
								class="w-16 p-1"
								type="text"
								value={task.actual}
								on:change={(e) => handler(e.currentTarget, task, 'actual')}
							/></td
						>
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
</div>
