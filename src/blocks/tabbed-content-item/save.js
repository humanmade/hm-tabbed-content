/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { isVideo } from '../../utils';

export default function save( { attributes } ) {
	const { title, url, alt } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'tabbed-content-item',
	} );

	const isVideoFile = isVideo( url );

	return (
		<div { ...blockProps } data-image-cover-url={ url || undefined }>
			<RichText.Content
				tagName="h3"
				className="tabbed-content-item__title wp-block-heading"
				value={ title }
			/>
			<div className="tabbed-content-item__content accordion-content">
				{ url && (
					<figure className="tabbed-content-item__image">
						{ isVideoFile ? (
							<video
								src={ url }
								autoPlay
								loop
								muted
								playsInline
								title={ alt || '' }
								aria-label={ alt || '' }
							/>
						) : (
							<img src={ url } alt={ alt || '' } />
						) }
					</figure>
				) }
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
