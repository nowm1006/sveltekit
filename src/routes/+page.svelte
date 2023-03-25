<script lang="ts">
	import { load, upload, create } from './db'
	import type { Task } from './db'
	import Select from './Select.svelte'

	// props

	// states
	let promise = load()

	// lifecycle

	// functions
	async function handler(target: EventTarget | null, task: Task, field: keyof Task) {
		if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return

		await upload(task.id, field, target.value)
		promise = load()
	}

	async function addTask(target: HTMLInputElement) {
		await create({ name: target.value, section: 'v8oxto1ra8ghn3w' })
		promise = load()
	}
</script>

<div class="container m-auto max-w-5xl">
	<input
		class="my-2"
		type="text"
		placeholder="New Task"
		on:change={(e) => addTask(e.currentTarget)}
	/>
	{#await promise then { tasks, projects, modes, sections }}
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
						><td class="px-2" colspan="6"
							>{section.name} {section.start}:00~ 「{section.comment}」</td
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
	{/await}
</div>
