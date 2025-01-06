export interface Project {
	title: string;
	description?: string;
	url: string;
	github?: string;
	tags?: Array<{
		id: string;
		name: string;
	}>;
	image: string;
}
