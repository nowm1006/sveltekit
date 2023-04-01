import PocketBase from 'pocketbase'

export const pb = new PocketBase('http://127.0.0.1:8090')

export interface Project {
	id: string
	name: string
}

export interface Mode {
	id: string
	name: string
	color: string
}

export interface Section {
	id: string
	name: string
	start: number
	comment: string
}

export interface Task {
	id: string
	name: string
	project: string
	mode: string
	estimate: number
	actual: number
	section: string
	done: boolean
}

export const load: () => Promise<{
	tasks: Task[]
	projects: Project[]
	modes: Mode[]
	sections: Section[]
}> = async () => {
	const [tasks, projects, modes, sections] = await Promise.all([
		pb.collection('tc_tasks').getFullList<Task>(),
		pb.collection('tc_projects').getFullList<Project>(),
		pb.collection('tc_modes').getFullList<Mode>(),
		pb.collection('tc_sections').getFullList<Section>()
	])

	return {
		tasks: structuredClone(tasks) as typeof tasks,
		projects: structuredClone(projects) as typeof projects,
		modes: structuredClone(modes) as typeof modes,
		sections: structuredClone(sections) as typeof sections
	}
}

export const upload = async (id: string, task: Task) => {
	return await pb.collection('tc_tasks').update<Task>(id, task)
}

export const create = async (task: Partial<Task>) => {
	return await pb.collection('tc_tasks').create<Task>(task)
}

export const del = async (id: string) => {
	return await pb.collection('tc_tasks').delete(id)
}
