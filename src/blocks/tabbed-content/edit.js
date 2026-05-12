/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import './editor.scss';
import { isVideo } from '../../utils';

const ALLOWED_BLOCKS = [ 'core/group' ];
const TEMPLATE = [
	[
		'core/group',
		{
			lock: { move: true, remove: true },
			className: 'tabbed-content-header',
		},
		[
			[ 'core/heading', { level: 2, placeholder: 'Add heading...' } ],
			[ 'core/paragraph', { placeholder: 'Add description...' } ],
			[ 'core/buttons' ],
		],
	],
	[
		'core/group',
		{
			lock: {
				move: true,
				remove: true,
			},
			className: 'tabbed-content-items',
		},
		[
			[ 'humanmade/tabbed-content-item' ],
			[ 'humanmade/tabbed-content-item' ],
			[ 'humanmade/tabbed-content-item' ],
		],
	],
];

export default function Edit( { clientId } ) {
	const blockProps = useBlockProps( {
		className: 'tabbed-content',
	} );

	const { selectedImageUrl } = useSelect(
		( select ) => {
			const {
				getBlocksByClientId,
				isBlockSelected,
				hasSelectedInnerBlock,
			} = select( 'core/block-editor' );
			const blocks =
				getBlocksByClientId( clientId )[ 0 ]?.innerBlocks || [];

			const itemsGroup = blocks.find(
				( block ) =>
					block.name === 'core/group' &&
					block.attributes?.className === 'tabbed-content-items'
			);

			const items = itemsGroup?.innerBlocks || [];

			let selectedBlock = items[ 0 ];

			for ( const block of items ) {
				if (
					isBlockSelected( block.clientId ) ||
					hasSelectedInnerBlock( block.clientId, true )
				) {
					selectedBlock = block;
					break;
				}
			}

			return {
				innerBlocks: blocks,
				selectedImageUrl: selectedBlock?.attributes?.url,
			};
		},
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'tabbed-content-container__left',
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			renderAppender: false,
		}
	);

	return (
		<div { ...blockProps }>
			<div className="tabbed-content-container">
				<div { ...innerBlocksProps } />
				<div className="tabbed-content-container__right">
					<div className="tabbed-content-cover-image">
						{ selectedImageUrl ? ( // eslint-disable-line no-nested-ternary
							isVideo( selectedImageUrl ) ? (
								<video
									src={ selectedImageUrl }
									autoPlay
									loop
									muted
									playsInline
									className="cover-image-desktop"
								/>
							) : (
								<img
									src={ selectedImageUrl }
									alt=""
									className="cover-image-desktop"
								/>
							)
						) : (
							<div className="tabbed-content-cover-image__placeholder">
								Select media
							</div>
						) }
					</div>
				</div>
			</div>
		</div>
	);
}
