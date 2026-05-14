/**
 * WordPress dependencies
 */
import {
	BlockControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	ChevronUpIcon,
	ChevronDownIcon,
	PlusIcon,
	TrashIcon,
} from '../tabbed-content/icons';

/**
 * Recommended starter content for a tab — a short heading. Authors are
 * free to clear it and use any combination of allowed blocks.
 */
const TEMPLATE = [
	[ 'core/heading', { level: 4, placeholder: 'Tab label…' } ],
];

const ALLOWED_BLOCKS = [
	'core/image',
	'core/heading',
	'core/paragraph',
	'core/group',
];

export default function Edit( { clientId } ) {
	const blockProps = useBlockProps( {
		className: 'tabbed-content__tab-content',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS,
	} );

	// Tab toolbar buttons operate on the parent item — selecting the tab
	// makes a stable place to surface those controls since the item has
	// `display: contents` in the editor and so has no toolbar of its own.
	const {
		itemClientId,
		itemsGroupClientId,
		itemsGroupChildren,
		itemIndex,
		itemCount,
	} = useSelect(
		( select ) => {
			const { getBlockRootClientId, getBlockIndex, getBlock } =
				select( 'core/block-editor' );
			const itemId = getBlockRootClientId( clientId );
			const groupId = itemId ? getBlockRootClientId( itemId ) : '';
			const group = groupId ? getBlock( groupId ) : null;
			return {
				itemClientId: itemId,
				itemsGroupClientId: groupId,
				itemsGroupChildren: group?.innerBlocks ?? [],
				itemIndex: itemId ? getBlockIndex( itemId ) : -1,
				itemCount: group?.innerBlocks?.length ?? 0,
			};
		},
		[ clientId ]
	);

	const {
		moveBlocksUp,
		moveBlocksDown,
		removeBlock,
		replaceInnerBlocks,
		selectBlock,
	} = useDispatch( 'core/block-editor' );

	const isFirst = itemIndex <= 0;
	const isLast = itemIndex < 0 || itemIndex >= itemCount - 1;
	const canDelete = itemCount > 1 && !! itemClientId;

	const onMoveUp = () => {
		if ( ! itemClientId || ! itemsGroupClientId || isFirst ) {
			return;
		}
		moveBlocksUp( [ itemClientId ], itemsGroupClientId );
	};

	const onMoveDown = () => {
		if ( ! itemClientId || ! itemsGroupClientId || isLast ) {
			return;
		}
		moveBlocksDown( [ itemClientId ], itemsGroupClientId );
	};

	const onAddAfter = () => {
		if ( ! itemsGroupClientId ) {
			return;
		}
		const newItem = createBlock( 'humanmade/tabbed-content-item', {}, [
			createBlock( 'humanmade/tabbed-content-tab' ),
			createBlock( 'humanmade/tabbed-content-panel' ),
		] );
		// Splice into the items group's children at itemIndex + 1. We use
		// replaceInnerBlocks rather than insertBlock because the editor's
		// canInsertBlockType validation rejects programmatic inserts here
		// regardless of our allowedBlocks settings.
		const next = [
			...itemsGroupChildren.slice( 0, itemIndex + 1 ),
			newItem,
			...itemsGroupChildren.slice( itemIndex + 1 ),
		];
		replaceInnerBlocks( itemsGroupClientId, next, false );
		selectBlock( newItem.clientId );
	};

	const onDelete = () => {
		if ( ! canDelete ) {
			return;
		}
		removeBlock( itemClientId );
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ ChevronUpIcon }
						label="Move tab earlier"
						onClick={ onMoveUp }
						disabled={ isFirst }
					/>
					<ToolbarButton
						icon={ ChevronDownIcon }
						label="Move tab later"
						onClick={ onMoveDown }
						disabled={ isLast }
					/>
					<ToolbarButton
						icon={ PlusIcon }
						label="Add tab after"
						onClick={ onAddAfter }
					/>
					<ToolbarButton
						icon={ TrashIcon }
						label="Delete tab"
						onClick={ onDelete }
						disabled={ ! canDelete }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
