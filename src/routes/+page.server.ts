import type { Actions, PageServerLoad } from './$types'

interface Project {
	id: string
	name: string
}

interface Mode {
	id: string
	name: string
	color: string
}

interface Task {
	id: string
	name: string
	project: string
	mode: string
	estimate: number
	actual: number
	expand?: {
		project: Project
		mode: Mode
	}
}

export const load = (async ({ locals }) => {
	const [tasks, projects, modes] = await Promise.all([
		locals.pb.collection('tc_tasks').getFullList<Task>({ expand: 'project,mode' }),
		locals.pb.collection('tc_projects').getFullList<Project>(),
		locals.pb.collection('tc_modes').getFullList<Mode>()
	])

	return {
		tasks: structuredClone(tasks) as typeof tasks,
		projects: structuredClone(projects) as typeof projects,
		modes: structuredClone(modes) as typeof modes
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData()
		const id = data.get('id') as string
		if (!id) return
		await locals.pb.collection('tc_tasks').update(id, {
			name: data.get('task'),
			project: data.get('project'),
			mode: data.get('mode'),
			estimate: data.get('estimate'),
			actual: data.get('actual')
		})

		return { success: true }
	}
} satisfies Actions
