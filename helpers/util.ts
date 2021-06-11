import { Color } from '@notionhq/client/build/src/api-types';

export function getColor(color: Color) {
	var colors = {
		// https://optemization.com/notion-color-guide
		default: '37352F',
		gray: '9B9A97',
		brown: '64473A',
		orange: 'D9730D',
		yellow: 'DFAB01',
		green: '0F7B6C',
		blue: '0B6E99',
		purple: '6940A5',
		pink: 'AD1A72',
		red: 'E03E3E',
	};

	return colors[color];
}
