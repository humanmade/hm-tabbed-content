/**
 * Internal dependencies
 */
import { isVideo } from '../../utils';

document.addEventListener( 'DOMContentLoaded', function () {
	const containers = document.querySelectorAll( '.tabbed-content' );
	containers.forEach( setupContainer );
} );

function setupContainer( container ) {
	const items = container.querySelectorAll( '.tabbed-content-item' );
	const coverImageContainer = container.querySelector(
		'.tabbed-content-cover-image'
	);

	if ( ! coverImageContainer || ! items.length ) {
		return;
	}

	// Create cover images/videos for each item
	const coverImages = [];
	items.forEach( ( item, index ) => {
		const mediaUrl = item.getAttribute( 'data-image-cover-url' );
		if ( mediaUrl ) {
			let element;
			if ( isVideo( mediaUrl ) ) {
				element = document.createElement( 'video' );
				element.src = mediaUrl;
				element.autoplay = true;
				element.loop = true;
				element.muted = true;
				element.playsInline = true;
			} else {
				element = document.createElement( 'img' );
				element.src = mediaUrl;
				element.alt = '';
			}
			element.className = 'cover-image';
			element.style.opacity = '0';
			element.style.transition =
				'opacity 0.35s cubic-bezier(0.4, 0, 0.1, 1)';
			element.setAttribute( 'data-index', index );
			coverImageContainer.appendChild( element );
			coverImages.push( element );
		} else {
			coverImages.push( null );
		}
	} );

	let currentIndex = -1;

	function getContentHeight( content ) {
		const currentHeight = content.style.height;
		const currentDisplay = content.style.display;
		content.style.height = 'auto';
		content.style.display = 'block';
		const height = content.scrollHeight;
		content.style.height = currentHeight;
		content.style.display = currentDisplay;
		return height;
	}

	function selectItem( index ) {
		if ( index === currentIndex || index < 0 || index >= items.length ) {
			return;
		}

		const previousIndex = currentIndex;
		currentIndex = index;

		items.forEach( ( item, i ) => {
			const content = item.querySelector(
				'.tabbed-content-item__content'
			);

			if ( i === index ) {
				const height = getContentHeight( content );
				content.style.height = '0px';
				content.classList.add( 'is-open' );
				item.classList.add( 'is-open' );

				// Force reflow
				void content.offsetHeight;

				content.style.height = height + 'px';

				setTimeout( () => {
					if ( content.classList.contains( 'is-open' ) ) {
						content.style.height = 'auto';
					}
				}, 350 );
			} else {
				if ( content.classList.contains( 'is-open' ) ) {
					const height = content.scrollHeight;
					content.style.height = height + 'px';

					void content.offsetHeight;

					content.style.height = '0px';
				}

				content.classList.remove( 'is-open' );
				item.classList.remove( 'is-open' );
			}
		} );

		coverImages.forEach( ( img, i ) => {
			if ( ! img ) {
				return;
			}
			if ( i === index ) {
				img.style.zIndex = '2';
				img.style.opacity = '1';
			} else if ( i === previousIndex ) {
				img.style.zIndex = '1';
				img.style.opacity = '0';
			} else {
				img.style.zIndex = '1';
				img.style.opacity = '0';
			}
		} );
	}

	const headers = container.querySelectorAll( '.tabbed-content-item__title' );
	headers.forEach( ( header, index ) => {
		header.setAttribute( 'role', 'button' );
		header.setAttribute( 'tabindex', '0' );

		header.addEventListener( 'click', () => {
			selectItem( index );
		} );

		header.addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'Enter' || e.key === ' ' ) {
				e.preventDefault();
				selectItem( index );
			}
		} );
	} );

	let resizeTimeout;
	window.addEventListener( 'resize', () => {
		clearTimeout( resizeTimeout );
		resizeTimeout = setTimeout( () => {
			items.forEach( ( item, i ) => {
				const content = item.querySelector(
					'.tabbed-content-item__content'
				);
				if (
					i === currentIndex &&
					content.classList.contains( 'is-open' )
				) {
					content.style.height = 'auto';
				}
			} );
		}, 100 );
	} );

	if ( items.length > 0 ) {
		selectItem( 0 );
	}
}
