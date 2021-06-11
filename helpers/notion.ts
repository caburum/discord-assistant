import * as Notion from '@notionhq/client';
import { notion as config } from '../config.json';
import { Page, TitlePropertyValue, SelectPropertyValue, RelationProperty, CreatedTimePropertyValue } from '@notionhq/client/build/src/api-types';

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

export async function generateTaskList() {
	var results: any = [];
	var db = await getDB(config.taskDB);
	db.forEach((result: Page) => {
		interface Properties {
			Name?: TitlePropertyValue;
			Importance?: SelectPropertyValue;
			Type?: SelectPropertyValue;
			Status?: SelectPropertyValue;
			Blocking?: RelationProperty;
			Required?: RelationProperty;
			'Date Created'?: CreatedTimePropertyValue;
		}

		var properties: Properties = result.properties;

		results.push({
			title: properties.Name?.title[0].plain_text,
			importance: {
				name: properties.Importance?.select.name || 'Unknown',
				color: properties.Importance?.select.color || 'default',
			},
			type: {
				name: properties.Type?.select.name || 'Unknown',
				color: properties.Type?.select.color || 'default',
			},
			status: {
				name: properties.Status?.select.name || 'Unknown',
				color: properties.Status?.select.color || 'default',
			},
			created: Date.parse(properties['Date Created']?.created_time || ''),
		});
	});
	return results;
}
