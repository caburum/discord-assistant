import * as Notion from '@notionhq/client'
import { notion as config } from '../config.json'

const notion = new Notion.Client({
	auth: config.token,
	logLevel: Notion.LogLevel.DEBUG
})

export function formatUUID(uuid: string): string {
	return uuid.substr(0, 8) + '-' + uuid.substr(8, 4) + '-' + uuid.substr(12, 4) + '-' + uuid.substr(16, 4) + '-' + uuid.substr(20);
}

export async function getDB(uuid: string): Promise<any> {
	var db = await notion.databases.query({
		database_id: uuid
	});
	return db;
}