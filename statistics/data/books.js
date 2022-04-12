//set elements here; elements are rendered top left to bottom right in zigzag manner
const pageElements = [
	{
		isMain: true,
		isSinglePage: false,
		prefix: '',
		title: 'THE BOOKS WORTH OF PHOTOS',
		suffix: 'A Klassic Note Web Reports series where I review photobooks',
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: 'THREE',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/gallery11/dbd8c4be.jpg',
				source: 'https://knbooks.carrd.co/assets/images/gallery11/dbd8c4be.jpg',
			},
			{
				type: 'title',
				prefix: 'MARCH 2019',
				title: 'Three Books Worth of Photos: That “F**k, Marry, Kill” Question',
				suffix: 'The beginning of all beginnings, on a specific birthday, coinciding with someone’s first photobook totally made by herself. Her two fellow members of the same idol group were complimented for this celebration.',
			},
			{
				type: 'gallery',
				caption: '(From left to right: Natsukawa Shiina “Nukegara”, Amamiya Sora “10 looks”, Asakura Momo “pleasant”)',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery10/a8f7efe3.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery10/a8f7efe3.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery10/6297e75b.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery10/6297e75b.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery10/a76c4e88.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery10/a76c4e88.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: 'FOURTH',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/image03.jpg',
				source: 'https://knbooks.carrd.co/assets/images/image03.jpg',
			},
			{
				type: 'title',
				prefix: 'MARCH 2019',
				title: 'Fourth Book Worth of Photos: What Happened To Summer??',
				suffix: 'It’s a birthday gift from a fellow friend who likes her too, and it’s her boldest work yet. It was indeed the last and best summer of the Heisei Era.',
			},
			{
				type: 'gallery',
				caption: '(From Kouno Marika “Marinka”)',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery03/b7b6543b.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery03/b7b6543b.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery03/3fd15167.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery03/3fd15167.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery03/7d07927d.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery03/7d07927d.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: 'FIFTH',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/image04.jpg',
				source: 'https://knbooks.carrd.co/assets/images/image04.jpg',
			},
			{
				type: 'title',
				prefix: 'MAY 2019',
				title: 'Fifth Book Worth of Photos: The Tsundere Who Grew Up Well',
				suffix: 'She’s young, she’s cute, and she’s left an impression. The confession after all these years cannot express how lovely she has grown up to be.',
			},
			{
				type: 'gallery',
				caption: '(From Kido Ibuki “breath”)',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery04/8045d162.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery04/8045d162.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery04/a48fe7d6.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery04/a48fe7d6.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery04/4ecf8433.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery04/4ecf8433.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: 'SIXTH',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/image05.jpg',
				source: 'https://knbooks.carrd.co/assets/images/image05.jpg',
			},
			{
				type: 'title',
				prefix: 'SEPTEMBER 2019',
				title: 'Sixth Book Worth of Photos: The Cosplayer On Vacation',
				suffix: 'She’s the only cosplayer in the list, and her cheerfulness shines through the horizon. And in her last photobook for Comiket, she goes all out.',
			},
			{
				type: 'gallery',
				caption: '(From Tachibana Haru “Last.”)',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery05/4f82cc2a.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery05/4f82cc2a.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery05/9681d34b.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery05/9681d34b.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery05/88782a8c.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery05/88782a8c.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: 'SEVENTH',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/image06.jpg',
				source: 'https://knbooks.carrd.co/assets/images/image06.jpg',
			},
			{
				type: 'title',
				prefix: 'NOVEMBER 2019',
				title: 'Seventh Book Worth of Photos: Top Beauty Down Under',
				suffix: 'She’s the only gravure idol in the list, and with the photobook under her control, this introvert decides to take a trip to Australia.',
			},
			{
				type: 'gallery',
				caption: '(From Baba Fumika “Babatabi”)',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery06/f525fa7a.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery06/f525fa7a.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery06/0d2c946b.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery06/0d2c946b.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery06/fb5944cb.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery06/fb5944cb.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: 'EIGHTH',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/image07.jpg',
				source: 'https://knbooks.carrd.co/assets/images/image07.jpg',
			},
			{
				type: 'title',
				prefix: 'DECEMBER 2019',
				title: 'Eighth Book Worth of Photos: Her Biggest Birthday Present',
				suffix: 'She is all but a normal voice actress but hidden inside a body of unbelievable proportions, and finally she bares them all in her boldest attempt yet.',
			},
			{
				type: 'gallery',
				caption: '(From Uesaka Sumire “Sumireiro”)',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery07/545238b2.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery07/545238b2.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery07/5c29c1e5.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery07/5c29c1e5.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery07/9d51d84c.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery07/9d51d84c.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: 'NINTH',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/image08.jpg',
				source: 'https://knbooks.carrd.co/assets/images/image08.jpg',
			},
			{
				type: 'title',
				prefix: 'DECEMBER 2019',
				title: 'Ninth Book Worth of Photos: Once In An Anime Lifetime',
				suffix: 'It’s the most unique one I’ve reviewed thus far, with themes focusing on a voice actress who dedicated her life to the Anime industry without being well-known.',
			},
			{
				type: 'gallery',
				caption: '(From Anzai Chika “Ichi’go Ichi’e”)',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery08/bb708e97.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery08/bb708e97.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery08/b9c2109e.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery08/b9c2109e.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery08/afb61978.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery08/afb61978.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: 'TENTH',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/image01.jpg',
				source: 'https://knbooks.carrd.co/assets/images/image01.jpg',
			},
			{
				type: 'title',
				prefix: 'FEBRUARY 2020',
				title: 'Tenth Book Worth of Photos: The Route to Love, From The End and Beyond',
				suffix: 'Ending with a bang, a literal dating simulator featuring a new generation voice actress, shows us what it is like to fall in love with her.',
			},
			{
				type: 'gallery',
				caption: '(From Kitou Akari “Love Route”)',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery01/0353c383.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery01/0353c383.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery01/6487c223.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery01/6487c223.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery01/eef64252.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery01/eef64252.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: '11VS12',
		componentData: [
			{
				type: 'image',
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/gallery09/28e472c9.jpg',
				source: 'https://knbooks.carrd.co/assets/images/gallery09/28e472c9.jpg',
			},
			{
				type: 'title',
				prefix: 'MARCH 2021',
				title: 'The Eleventh Book VS Twelfth Book Worth of Photos: The Valentine Birthday Showdown!',
				suffix: 'With everyone prepared for Valentine\'s Day, it will be hard to decide who hits the best impression from the new generation.',
			},
			{
				type: 'image',
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/gallery09/1c31253b.jpg',
				source: 'https://knbooks.carrd.co/assets/images/gallery09/1c31253b.jpg',
			},
			{
				type: 'gallery',
				caption: '(From left to right: Waki Azumi "AZU YOU", Koga Aoi "Aoiro.")',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery02/1fcc5db6.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery02/1fcc5db6.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery02/cc64ec61.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery02/cc64ec61.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery02/1d83fd63.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery02/1d83fd63.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery02/ade15c6c.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery02/ade15c6c.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: '13TH',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/gallery12/6bf8331b_original.jpg',
				source: 'https://knbooks.carrd.co/assets/images/gallery12/6bf8331b_original.jpg',
			},
			{
				type: 'title',
				prefix: 'JANUARY 2022',
				title: 'The Thirteenth Book Worth of Photos: Long Matured Trip Alone',
				suffix: 'Living away from home in pursuit of education isn\'t exactly easy considering it lasted 2 years, but the voice actress shows us how one can grow up freely.',
			},
			{
				type: 'gallery',
				caption: '(From Kotobuki Minako "Cuppa")',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery12/2f71dc4b.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery12/2f71dc4b.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery12/99f005b1.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery12/99f005b1.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery12/7c9b0cb9.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery12/7c9b0cb9.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: '14TH',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: 'https://knbooks.carrd.co/assets/images/gallery12/730e96c0_original.jpg',
				source: 'https://knbooks.carrd.co/assets/images/gallery12/730e96c0_original.jpg',
			},
			{
				type: 'title',
				prefix: 'MARCH 2022',
				title: 'The Fourteenth Book Worth of Photos: Desire For Change',
				suffix: 'On her first for everything, from releasing a photobook to getting a short haircut, she bares all without revealing any of her voice acting skills.',
			},
			{
				type: 'gallery',
				caption: '(From Hondo Kaede "MUTE")',
				datas: [
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery12/cb79399a.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery12/cb79399a.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery12/940ae0d5.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery12/940ae0d5.jpg'
					},
					{
						tooltip: '',
						thumbnail: 'https://knbooks.carrd.co/assets/images/gallery12/a2523d78.jpg',
						source: 'https://knbooks.carrd.co/assets/images/gallery12/a2523d78.jpg'
					},
				],
			},
		],
	},
	{
		type: 'grid',
		columns: 2,
		rows: 2,
		image: '',
		text: '15VS16',
		componentData: [
			{
				type: 'image',
				rows: 2,
				tooltip: '',
				thumbnail: '',
				source: '',
			},
			{
				type: 'title',
				prefix: '2022',
				title: 'The Fifteenth VS Sixteenth Book Worth of Photos: From First To Best',
				suffix: '',
			},
			{
				type: 'gallery',
				caption: '(From left to right: Lynn "Rin", Sano Hinako "BE WITH ME")',
				datas: [
					{
						tooltip: '',
						thumbnail: '',
						source: ''
					},
					{
						tooltip: '',
						thumbnail: '',
						source: ''
					},
					{
						tooltip: '',
						thumbnail: '',
						source: ''
					},
					{
						tooltip: '',
						thumbnail: '',
						source: ''
					},
				],
			},
		],
	},
];