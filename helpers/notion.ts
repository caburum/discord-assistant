import * as Notion from '@notionhq/client';
import { notion as config } from '../config.json';
import * as Types from '@notionhq/client/build/src/api-types';

const notion = new Notion.Client({
	auth: config.token,
	// logLevel: Notion.LogLevel.DEBUG,
});

export function formatUUID(uuid: string): string {
	return uuid.substr(0, 8) + '-' + uuid.substr(8, 4) + '-' + uuid.substr(12, 4) + '-' + uuid.substr(16, 4) + '-' + uuid.substr(20);
}

export async function getDB(uuid: string, filter?: Types.Filter): Promise<any> {
	var db = await notion.databases.query({
		database_id: uuid,
		filter: filter,
	});
	return db.results;
}

interface Task {
	title: string | undefined;
	id: string;
	importance: {
		name: string | undefined;
		color: Types.Color;
	};
	type: {
		name: string | undefined;
		color: Types.Color;
	};
	status: {
		name: string | undefined;
		color: Types.Color;
	};
	created: number;
	url: string | undefined;
}

interface TaskProperties {
	Name?: Types.TitlePropertyValue;
	Importance?: Types.SelectPropertyValue;
	Type?: Types.SelectPropertyValue;
	Status?: Types.SelectPropertyValue;
	Blocking?: Types.RelationProperty;
	Required?: Types.RelationProperty;
	'Date Created'?: Types.CreatedTimePropertyValue;
	URL?: Types.URLPropertyValue;
}

export async function generateTaskList(filter?: Types.Filter): Promise<Array<Task>> {
	var results: any = [];
	var db = await getDB(config.taskDB, filter);
	db.forEach((result: Types.Page) => {
		var properties: TaskProperties = result.properties;

		var task: Task = {
			title: properties.Name?.title[0].plain_text,
			id: result.id.replace(/\-/g, ''),
			importance: {
				name: properties.Importance?.select.name,
				color: properties.Importance?.select.color || 'default',
			},
			type: {
				name: properties.Type?.select.name,
				color: properties.Type?.select.color || 'default',
			},
			status: {
				name: properties.Status?.select.name,
				color: properties.Status?.select.color || 'default',
			},
			created: Date.parse(properties['Date Created']?.created_time || ''),
			url: properties.URL?.url,
		};

		results.push(task);
	});
	return results;
}

export async function createTask(properties: { [propertyName: string]: Types.InputPropertyValue }) {
	console.log(properties);
	var page = await notion.pages.create({
		parent: {
			database_id: config.taskDB,
		},
		properties: properties,
	});
	console.log(page);
}
