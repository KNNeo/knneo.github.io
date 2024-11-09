//--NOTES--//
//Default separator is '_' (underscore) unless stated in settings
//Filenames of images to be in the format of <tag>_<tag>, if with extension eg. '.jpg' will be removed
//Thumbnail filenames to be in format '<prefix>_<id>' according to preset; original has no prefix
//Data in data.js, variable config.data

//--SETTINGS--//
const config = {
	debug: false,
	menu: {
		width: 500,
	},
	title: 'VVブロマイド図鑑',
	description: `Gallery based on tag separated filenames\n\n©コーエーテクモゲームス All rights reserved.	`,
	placeholder: {
		include: '以内の…',
		exclude: '以外の…',
	},
	sort: {
		order: 'asc',
		locale: 'ja-JP',
		property: 'nm',
	},
	setting: {
		sidebar: true,
		clear: true,
		expand: true,
		darkmode: true,
		preset: true,
		filter: true,
		slideshow: 5,
		stats: true,
	},
	tag: {
		category: {
			groups: ['衣装', 'キャラクター'],
			ratio: [4, 1],
		},
		preset: [160, 320, 640],
		min: 2,
		max: 9999,
		exclude: ['覚醒'],
		hidden: ['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'],
	},
	grid: {
		banner: {
			length: 1,
		},
		column: {
			min: 2,
		},
		thumbnail: {
			ratio: 9/16,
		},
		star: {
			text: '⭐',
			tooltip: '覚醒'
		}
	},
	separator: '_',
	data: [
_DATA_
	],
};