/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	// render.php handles the wrapper, we just output inner blocks
	return <InnerBlocks.Content />;
}
