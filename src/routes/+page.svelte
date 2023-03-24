<script lang="ts">
	import type { PageData, ActionData } from './$types'
	import { enhance } from '$app/forms'

	export let data: PageData
	export let form: ActionData
</script>

<div class="container m-auto max-w-5xl">
	{#each data.tasks as task (task.id)}
		<form
			method="POST"
			class="my-2 flex gap-4 rounded-xl bg-slate-200 p-4"
			draggable={true}
			style:color={task.expand?.mode.color}
			use:enhance
		>
			<input type="text" name="id" bind:value={task.id} class="hidden" />
			<div class="flex flex-1 basis-48 flex-col gap-2">
				<select name="project" value={task.expand?.project.id} onchange="submit(this.form)">
					{#each data.projects as project (project.id)}
						<option value={project.id}>{project.name}</option>
					{/each}
				</select>
				<input name="task" class="w-full p-1" type="text" bind:value={task.name} />
			</div>
			<select name="mode" value={task.expand?.mode.id} onchange="submit(this.form)">
				{#each data.modes as mode (mode.id)}
					<option value={mode.id}>{mode.name}</option>
				{/each}
			</select>
			<input name="estimate" class="p-1" type="text" bind:value={task.estimate} />
			<input name="actual" class="p-1" type="text" bind:value={task.actual} />
			<input type="submit" value="" class="hidden" />
		</form>
	{/each}
</div>
{#if form?.success}
	<p>success</p>
{/if}
