/**
 * Layout variations for the Tabbed Content block.
 *
 * Both variations share the same data model — a heading area followed by a
 * list of tabbed-content-item blocks, each of which contains a locked tab
 * and panel pair — but render with different DOM and styling. The `layout`
 * attribute drives render.php and style.scss.
 */

const itemTemplate = ( { tabHeading, panelHeading } ) => [
	'humanmade/tabbed-content-item',
	{},
	[
		[
			'humanmade/tabbed-content-tab',
			{},
			[
				[
					'core/heading',
					{
						level: 4,
						content: tabHeading,
						placeholder: 'Tab label…',
					},
				],
			],
		],
		[
			'humanmade/tabbed-content-panel',
			{},
			[
				[
					'core/heading',
					{
						level: 3,
						content: panelHeading,
						placeholder: 'Panel heading…',
					},
				],
				[ 'core/paragraph', { placeholder: 'Panel content…' } ],
			],
		],
	],
];

const headerTemplate = [
	[
		'core/group',
		{
			lock: { move: true, remove: true },
			metadata: { name: 'Heading' },
			className: 'tabbed-content__header',
		},
		[ [ 'core/heading', { level: 2, placeholder: 'Add a heading…' } ] ],
	],
];

const itemsTemplate = ( items ) => [
	[
		'core/group',
		{
			lock: { move: true, remove: true },
			metadata: { name: 'Tabs' },
			className: 'tabbed-content__items',
		},
		items.map( itemTemplate ),
	],
];

const variations = [
	{
		name: 'tabs-side',
		title: 'Tabbed Content (tabs on side)',
		description:
			'Vertical list of text tabs alongside a media panel that swaps when a tab is activated.',
		isDefault: true,
		attributes: { layout: 'side' },
		innerBlocks: [
			...headerTemplate,
			...itemsTemplate( [
				{ tabHeading: 'First tab', panelHeading: 'First panel' },
				{ tabHeading: 'Second tab', panelHeading: 'Second panel' },
				{ tabHeading: 'Third tab', panelHeading: 'Third panel' },
			] ),
		],
		scope: [ 'inserter', 'transform' ],
	},
	{
		name: 'tabs-top',
		title: 'Tabbed Content (tabs on top)',
		description:
			'Horizontal row of image tabs above a content panel that swaps when a tab is activated.',
		attributes: { layout: 'top' },
		innerBlocks: [
			...headerTemplate,
			...itemsTemplate( [
				{ tabHeading: 'First tab', panelHeading: 'First panel' },
				{ tabHeading: 'Second tab', panelHeading: 'Second panel' },
				{ tabHeading: 'Third tab', panelHeading: 'Third panel' },
				{ tabHeading: 'Fourth tab', panelHeading: 'Fourth panel' },
			] ),
		],
		scope: [ 'inserter', 'transform' ],
	},
];

export default variations;
