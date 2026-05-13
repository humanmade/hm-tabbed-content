/**
 * Layout variations for the Tabbed Content block.
 *
 * Both variations share the same data model — a heading area followed by a
 * list of tabbed-content-item blocks — but render with different DOM and
 * styling. The `layout` attribute drives render.php and style.scss.
 */

const sharedItem = ( title ) => [
	'humanmade/tabbed-content-item',
	{ title },
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
		items.map( sharedItem ),
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
				'First tab',
				'Second tab',
				'Third tab',
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
				'First tab',
				'Second tab',
				'Third tab',
				'Fourth tab',
			] ),
		],
		scope: [ 'inserter', 'transform' ],
	},
];

export default variations;
