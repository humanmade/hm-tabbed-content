/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import variations from './variations';
import './style.scss';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	variations,
} );
