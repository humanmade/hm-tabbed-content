/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';

const ALLOWED_BLOCKS = [ 'core/group' ];

export default function Edit( { attributes } ) {
	const { layout = 'side' } = attributes;

	const blockProps = useBlockProps( {
		className: `tabbed-content is-layout-${ layout }`,
		'data-layout': layout,
	} );

	// Template is provided per-variation; the block-level template here is a
	// safety net so the block is still usable if inserted programmatically.
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: [
			[
				'core/group',
				{
					lock: { move: true, remove: true },
					metadata: { name: 'Heading' },
					className: 'tabbed-content__header',
				},
				[
					[
						'core/heading',
						{ level: 2, placeholder: 'Add a heading…' },
					],
				],
			],
			[
				'core/group',
				{
					lock: { move: true, remove: true },
					metadata: { name: 'Tabs' },
					className: 'tabbed-content__items',
				},
				[
					[
						'humanmade/tabbed-content-item',
						{},
						[
							[ 'humanmade/tabbed-content-tab' ],
							[ 'humanmade/tabbed-content-panel' ],
						],
					],
					[
						'humanmade/tabbed-content-item',
						{},
						[
							[ 'humanmade/tabbed-content-tab' ],
							[ 'humanmade/tabbed-content-panel' ],
						],
					],
					[
						'humanmade/tabbed-content-item',
						{},
						[
							[ 'humanmade/tabbed-content-tab' ],
							[ 'humanmade/tabbed-content-panel' ],
						],
					],
				],
			],
		],
		renderAppender: false,
	} );

	return <div { ...innerBlocksProps } />;
}
