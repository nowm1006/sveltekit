<script lang="ts">
	import { onMount } from 'svelte'
	import type { Section, Task } from './db'

	export let tasks: Task[]
	export let sections: Section[]
	let timeSammary = { total: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, U: 0 }
	let currentTime = currentTimeString(0)
	const timeSammaryKeys = Object.keys(timeSammary) as unknown as keyof typeof timeSammary

	$: {
		timeSammary = tasks.reduce((p, c) => {
			if (c.done) return p
			p.total += c.estimate
			const [section] = sections.filter((section) => section.id == c.section)
			p[section.name as keyof typeof p] += c.estimate
			return p
		}, timeSammary)
		currentTime = currentTimeString(timeSammary.total)
	}

	// lifecycles
	onMount(() => {
		const timer = setInterval(() => {
			currentTime = currentTimeString(timeSammary.total)
		}, 60 * 1000)

		return () => {
			clearInterval(timer)
		}
	})

	// functions
	function currentTimeString(taskMin: number) {
		const now = new Date()
		const hh = now.getHours()
		const mm = now.getMinutes()
		const totalMin = hh * 60 + mm + taskMin
		return min2hhmm(totalMin)
	}

	function min2hhmm(min: number) {
		const hh = Math.floor(min / 60)
		const mm = (min % 60).toString().padStart(2, '0')
		return `${hh}:${mm}`
	}
</script>

<div class="flex w-96 gap-2 rounded border p-2">
	<div class="flex basis-36 flex-col rounded border">
		<div class="border-b text-center">終了予定</div>
		<div class="flex flex-1 flex-col justify-center">
			<p class="text-center text-2xl">{currentTime}</p>
		</div>
	</div>
	<div class="flex h-24 basis-52 flex-col flex-wrap rounded border p-2">
		{#each timeSammaryKeys as section (section)}
			{#if section.length == 1}
				<p>{section}: {min2hhmm(timeSammary[section])}</p>
			{/if}
		{/each}
	</div>
</div>
