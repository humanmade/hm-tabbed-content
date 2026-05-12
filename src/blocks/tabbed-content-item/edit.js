/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	BlockControls,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';

const ALLOWED_BLOCKS = [ 'core/paragraph', 'core/buttons', 'core/list' ];
const TEMPLATE = [ [ 'core/paragraph' ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, id, url, alt } = attributes;

	const isExpanded = useSelect(
		( select ) => {
			const { isBlockSelected, hasSelectedInnerBlock } =
				select( 'core/block-editor' );
			return (
				isBlockSelected( clientId ) ||
				hasSelectedInnerBlock( clientId, true )
			);
		},
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: `tabbed-content-item ${ isExpanded ? 'is-open' : '' }`,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'tabbed-content-item__content' },
		{
			templateLock: false,
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
		}
	);

	// Sync image data from Media Library when ID changes.
	const { mediaUrl, mediaAlt } = useSelect(
		( select ) => {
			if ( ! id ) {
				return {};
			}
			const media = select( 'core' ).getMedia( id );
			return {
				mediaUrl: media?.source_url,
				mediaAlt: media?.alt_text,
			};
		},
		[ id ]
	);

	useEffect( () => {
		if ( id && mediaUrl && mediaUrl !== url ) {
			setAttributes( { url: mediaUrl } );
		}
		if ( id && mediaAlt !== undefined && mediaAlt !== alt ) {
			setAttributes( { alt: mediaAlt } );
		}
	}, [ id, mediaUrl, mediaAlt, url, alt, setAttributes ] );

	const onSelectImage = ( media ) => {
		setAttributes( {
			id: media.id,
			url: media.url,
			alt: media.alt || '',
		} );
	};

	const onRemoveImage = () => {
		setAttributes( {
			id: undefined,
			url: '',
			alt: '',
		} );
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImage }
							allowedTypes={ [ 'image', 'video' ] }
							value={ id }
							render={ ( { open } ) => (
								<ToolbarButton onClick={ open }>
									{ id ? 'Replace Media' : 'Add Media' }
								</ToolbarButton>
							) }
						/>
					</MediaUploadCheck>
					{ id && (
						<ToolbarButton onClick={ onRemoveImage }>
							Remove Media
						</ToolbarButton>
					) }
				</ToolbarGroup>
			</BlockControls>

			<div { ...blockProps } data-image-cover-url={ url || undefined }>
				<RichText
					tagName="h3"
					className="tabbed-content-item__title"
					value={ title }
					onChange={ ( newTitle ) =>
						setAttributes( { title: newTitle } )
					}
					placeholder="Enter title..."
				/>

				{ isExpanded && <div { ...innerBlocksProps } /> }
			</div>
		</>
	);
}
