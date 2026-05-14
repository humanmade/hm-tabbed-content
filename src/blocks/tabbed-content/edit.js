/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import { PlusIcon } from './icons';

const ITEMS_GROUP_ALLOWED_BLOCKS = [ 'humanmade/tabbed-content-item' ];

export default function Edit( { attributes, clientId } ) {
	const { layout = 'side' } = attributes;

	const blockProps = useBlockProps( {
		className: `tabbed-content is-layout-${ layout }`,
		'data-layout': layout,
	} );

	// Template is provided per-variation; the block-level template here is a
	// safety net so the block is still usable if inserted programmatically.
	// Note: we intentionally do not pass `allowedBlocks` on the tabbed-
	// content block itself because Gutenberg applies that restriction
	// transitively to every descendant. The structural integrity is
	// enforced via templateLock on the children and via ancestor/parent
	// restrictions on the item/tab/panel block types.
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
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

	// Locate the items Group child by its `tabbed-content__items` className so
	// we can append a new item into it when the "Add tab" button is clicked.
	const { itemsGroupClientId, itemsGroupChildren } = useSelect(
		( select ) => {
			const { getBlock } = select( 'core/block-editor' );
			const ownBlock = getBlock( clientId );
			const itemsGroup = ownBlock?.innerBlocks?.find( ( child ) => {
				const className = child.attributes?.className ?? '';
				return className.includes( 'tabbed-content__items' );
			} );
			return {
				itemsGroupClientId: itemsGroup?.clientId,
				itemsGroupChildren: itemsGroup?.innerBlocks ?? [],
			};
		},
		[ clientId ]
	);

	const { replaceInnerBlocks, selectBlock, updateBlockListSettings } =
		useDispatch( 'core/block-editor' );

	// Restrict the items Group to only allow tabbed-content-item children.
	// We set this at runtime via the data store rather than passing
	// allowedBlocks on the parent block (which would cascade restrictions
	// onto every descendant, including the freeform tab/panel content).
	useEffect( () => {
		if ( ! itemsGroupClientId ) {
			return;
		}
		updateBlockListSettings( itemsGroupClientId, {
			allowedBlocks: ITEMS_GROUP_ALLOWED_BLOCKS,
		} );
	}, [ itemsGroupClientId, updateBlockListSettings ] );

	const onAddTab = () => {
		if ( ! itemsGroupClientId ) {
			return;
		}
		const newItem = createBlock( 'humanmade/tabbed-content-item', {}, [
			createBlock( 'humanmade/tabbed-content-tab' ),
			createBlock( 'humanmade/tabbed-content-panel' ),
		] );
		// insertBlock validates against canInsertBlockType, which currently
		// rejects programmatic insertions into a freshly templated group
		// regardless of our allowedBlocks. replaceInnerBlocks bypasses that
		// validation and is the documented escape hatch for blocks that
		// fully own their inner-blocks structure.
		replaceInnerBlocks(
			itemsGroupClientId,
			[ ...itemsGroupChildren, newItem ],
			false
		);
		// Select the new item so the editor surfaces it as the active tab.
		selectBlock( newItem.clientId );
	};

	const { children: innerBlocksChildren, ...wrapperProps } = innerBlocksProps;

	return (
		<div { ...wrapperProps }>
			{ innerBlocksChildren }
			{ itemsGroupClientId && (
				<div
					className="tabbed-content__appender"
					contentEditable={ false }
				>
					<Button
						variant="secondary"
						icon={ PlusIcon }
						onClick={ onAddTab }
					>
						Add tab
					</Button>
				</div>
			) }
		</div>
	);
}
