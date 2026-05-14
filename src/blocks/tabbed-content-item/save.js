/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Items render dynamically via the parent block's render.php — the parent
 * reads attributes (title, media URLs) from the block delimiter to build
 * the tablist and media panel. Save output is just the inner block content.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
