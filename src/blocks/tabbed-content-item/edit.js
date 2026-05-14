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
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import { STORE_NAME } from '../tabbed-content/store';

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

	// Resolve our position among siblings, the parent tabbed-content
	// clientId (used to scope the active-tab store), our own selection
	// state, and the currently active tab for this parent.
	const { index, parentClientId, isSelectedOrInner, activeIndex } =
		useSelect(
			( select ) => {
				const {
					getBlockIndex,
					getBlockRootClientId,
					isBlockSelected,
					hasSelectedInnerBlock,
				} = select( 'core/block-editor' );
				// The immediate parent is the "items" Group; the grandparent
				// is the tabbed-content block that scopes our active-tab
				// state.
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
					activeIndex:
						select( STORE_NAME ).getActiveIndex(
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
				<div
					className="tabbed-content-item__tab"
					onClick={ () => {
						// Clicking anywhere in the tab area — including
						// the thumbnail — should activate this tab. The
						// RichText title handles its own click for caret
						// placement; for the rest, route through block
						// selection so the useEffect above updates the
						// active index.
						selectBlock( clientId );
					} }
				>
					{ thumbnailUrl && (
						<span className="tabbed-content-item__tab-thumbnail">
							<img
								src={ thumbnailUrl }
								alt={ thumbnailAlt || '' }
							/>
						</span>
					) }
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
				</div>

				<div
					className="tabbed-content-item__panel"
					hidden={ ! isActive }
				>
					<div { ...innerBlocksProps } />
				</div>
			</div>
		</>
	);
}
