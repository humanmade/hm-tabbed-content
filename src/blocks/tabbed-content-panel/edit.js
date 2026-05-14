/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'core/heading', { level: 3, placeholder: 'Panel heading…' } ],
	[ 'core/paragraph', { placeholder: 'Panel content…' } ],
];

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'tabbed-content__panel-content',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		templateLock: false,
	} );

	return <div { ...innerBlocksProps } />;
}
