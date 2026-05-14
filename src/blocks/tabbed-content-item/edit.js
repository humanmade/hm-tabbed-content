/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import { STORE_NAME } from '../tabbed-content/store-name';

const TEMPLATE = [
	[ 'humanmade/tabbed-content-tab' ],
	[ 'humanmade/tabbed-content-panel' ],
];
const ALLOWED_BLOCKS = [
	'humanmade/tabbed-content-tab',
	'humanmade/tabbed-content-panel',
];

export default function Edit( { clientId } ) {
	const { index, parentClientId, isSelectedOrInner, activeIndex } = useSelect(
		( select ) => {
			const {
				getBlockIndex,
				getBlockRootClientId,
				isBlockSelected,
				hasSelectedInnerBlock,
			} = select( 'core/block-editor' );
			const itemsGroupClientId = getBlockRootClientId( clientId );
			const tabbedContentClientId = itemsGroupClientId
				? getBlockRootClientId( itemsGroupClientId )
				: '';
			return {
				index: getBlockIndex( clientId ),
				parentClientId: tabbedContentClientId,
				isSelectedOrInner:
					isBlockSelected( clientId ) ||
					hasSelectedInnerBlock( clientId, true ),
				activeIndex: select( STORE_NAME ).getActiveIndex(
					tabbedContentClientId
				),
			};
		},
		[ clientId ]
	);

	const { setActiveIndex } = useDispatch( STORE_NAME );
	const { selectBlock } = useDispatch( 'core/block-editor' );

	// When this item (or anything inside it) becomes the selection, promote
	// it to the active tab. Leaving the block does not reset — the last
	// selected tab stays active.
	useEffect( () => {
		if (
			isSelectedOrInner &&
			index >= 0 &&
			parentClientId &&
			index !== activeIndex
		) {
			setActiveIndex( parentClientId, index );
		}
	}, [
		isSelectedOrInner,
		index,
		activeIndex,
		parentClientId,
		setActiveIndex,
	] );

	const isActive = index === activeIndex;

	const blockProps = useBlockProps( {
		className: `tabbed-content-item ${ isActive ? 'is-active' : '' }`,
		onClick: () => {
			// Activating the item — even via a click inside the tab or
			// panel — routes through block selection so the useEffect
			// above updates the active index. The handler is safe to fire
			// on every descendant click because selectBlock is idempotent
			// when this block is already selected.
			selectBlock( clientId );
		},
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: 'all',
		allowedBlocks: ALLOWED_BLOCKS,
		renderAppender: false,
	} );

	return <div { ...innerBlocksProps } />;
}
