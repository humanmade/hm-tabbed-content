/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Recommended starter content for a tab — an image and a short heading.
 * Authors are free to clear this and use any combination of blocks.
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

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'tabbed-content__tab-content',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS,
	} );

	return <div { ...innerBlocksProps } />;
}
