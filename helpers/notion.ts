import * as Notion from '@notionhq/client';
import { notion as config } from '../config.json';
import { Page, TitlePropertyValue, SelectPropertyValue, RelationProperty, CreatedTimePropertyValue, URLPropertyValue, Color } from '@notionhq/client/build/src/api-types';

const notion = new Notion.Client({
	auth: config.token,
	logLevel: Notion.LogLevel.DEBUG,
});

export function formatUUID(uuid: string): string {
	return uuid.substr(0, 8) + '-' + uuid.substr(8, 4) + '-' + uuid.substr(12, 4) + '-' + uuid.substr(16, 4) + '-' + uuid.substr(20);
}

export async function getDB(uuid: string): Promise<any> {
	var db = await notion.databases.query({
		database_id: uuid,
	});
	return db.results;
}

interface Task {
	title: string | undefined;
	id: string;
	importance: {
		name: string | undefined;
		color: Color;
	};
	type: {
		name: string | undefined;
		color: Color;
	};
	status: {
		name: string | undefined;
		color: Color;
	};
	created: number;
	url: string | undefined;
}

export async function generateTaskList(): Promise<Array<Task>> {
	var results: any = [];
	var db = await getDB(config.taskDB);
	db.forEach((result: Page) => {
		interface TaskProperties {
			Name?: TitlePropertyValue;
			Importance?: SelectPropertyValue;
			Type?: SelectPropertyValue;
			Status?: SelectPropertyValue;
			Blocking?: RelationProperty;
			Required?: RelationProperty;
			'Date Created'?: CreatedTimePropertyValue;
			URL?: URLPropertyValue;
		}

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
