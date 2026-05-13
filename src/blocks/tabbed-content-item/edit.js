/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';

const TEMPLATE = [ [ 'core/paragraph' ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		title,
		id,
		url,
		alt,
		thumbnailId,
		thumbnailUrl,
		thumbnailAlt,
	} = attributes;

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
			template: TEMPLATE,
		}
	);

	// Sync panel media data from Media Library when ID changes.
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

	// Sync thumbnail data from Media Library when ID changes.
	const { thumbMediaUrl, thumbMediaAlt } = useSelect(
		( select ) => {
			if ( ! thumbnailId ) {
				return {};
			}
			const media = select( 'core' ).getMedia( thumbnailId );
			return {
				thumbMediaUrl: media?.source_url,
				thumbMediaAlt: media?.alt_text,
			};
		},
		[ thumbnailId ]
	);

	useEffect( () => {
		if (
			thumbnailId &&
			thumbMediaUrl &&
			thumbMediaUrl !== thumbnailUrl
		) {
			setAttributes( { thumbnailUrl: thumbMediaUrl } );
		}
		if (
			thumbnailId &&
			thumbMediaAlt !== undefined &&
			thumbMediaAlt !== thumbnailAlt
		) {
			setAttributes( { thumbnailAlt: thumbMediaAlt } );
		}
	}, [
		thumbnailId,
		thumbMediaUrl,
		thumbMediaAlt,
		thumbnailUrl,
		thumbnailAlt,
		setAttributes,
	] );

	const onSelectMedia = ( media ) => {
		setAttributes( {
			id: media.id,
			url: media.url,
			alt: media.alt || '',
		} );
	};

	const onRemoveMedia = () => {
		setAttributes( {
			id: undefined,
			url: '',
			alt: '',
		} );
	};

	const onSelectThumbnail = ( media ) => {
		setAttributes( {
			thumbnailId: media.id,
			thumbnailUrl: media.url,
			thumbnailAlt: media.alt || '',
		} );
	};

	const onRemoveThumbnail = () => {
		setAttributes( {
			thumbnailId: undefined,
			thumbnailUrl: '',
			thumbnailAlt: '',
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Tab thumbnail" initialOpen={ true }>
					<VStack spacing={ 4 }>
						<p>
							Shown as the tab affordance in layouts that
							display image-based tabs.
						</p>
						{ thumbnailUrl && (
							<img
								src={ thumbnailUrl }
								alt={ thumbnailAlt || '' }
								style={ {
									maxWidth: '100%',
									height: 'auto',
								} }
							/>
						) }
						<MediaUploadCheck>
							<HStack>
								<MediaUpload
									onSelect={ onSelectThumbnail }
									allowedTypes={ [ 'image' ] }
									value={ thumbnailId }
									render={ ( { open } ) => (
										<Button
											variant="secondary"
											onClick={ open }
										>
											{ thumbnailUrl
												? 'Replace thumbnail'
												: 'Add thumbnail' }
										</Button>
									) }
								/>
								{ thumbnailUrl && (
									<Button
										variant="link"
										isDestructive
										onClick={ onRemoveThumbnail }
									>
										Remove
									</Button>
								) }
							</HStack>
						</MediaUploadCheck>
					</VStack>
				</PanelBody>
				<PanelBody title="Panel media" initialOpen={ true }>
					<VStack spacing={ 4 }>
						<p>
							Shown in the media panel when this tab is
							active.
						</p>
						{ url && (
							<img
								src={ url }
								alt={ alt || '' }
								style={ {
									maxWidth: '100%',
									height: 'auto',
								} }
							/>
						) }
						<MediaUploadCheck>
							<HStack>
								<MediaUpload
									onSelect={ onSelectMedia }
									allowedTypes={ [ 'image', 'video' ] }
									value={ id }
									render={ ( { open } ) => (
										<Button
											variant="secondary"
											onClick={ open }
										>
											{ url
												? 'Replace media'
												: 'Add media' }
										</Button>
									) }
								/>
								{ url && (
									<Button
										variant="link"
										isDestructive
										onClick={ onRemoveMedia }
									>
										Remove
									</Button>
								) }
							</HStack>
						</MediaUploadCheck>
					</VStack>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText
					tagName="span"
					className="tabbed-content-item__title"
					value={ title }
					onChange={ ( newTitle ) =>
						setAttributes( { title: newTitle } )
					}
					placeholder="Tab title..."
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>

				{ isExpanded && <div { ...innerBlocksProps } /> }
			</div>
		</>
	);
}
