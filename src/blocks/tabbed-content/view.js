/**
 * Pure tab switching for the Tabbed Content block.
 *
 * The server renders all panels; this script just toggles the active state
 * on click (and on Arrow/Home/End keys per the WAI-ARIA tabs pattern).
 */

document.addEventListener( 'DOMContentLoaded', () => {
	document.querySelectorAll( '.tabbed-content' ).forEach( setupContainer );
} );

function setupContainer( container ) {
	const tabs = Array.from(
		container.querySelectorAll( '.tabbed-content__tab' )
	);
	const panels = Array.from(
		container.querySelectorAll( '.tabbed-content__panel' )
	);

	if ( tabs.length === 0 || panels.length !== tabs.length ) {
		return;
	}

	function selectTab( index, focusTab = false ) {
		if ( index < 0 || index >= tabs.length ) {
			return;
		}

		tabs.forEach( ( tab, i ) => {
			const isActive = i === index;
			tab.classList.toggle( 'is-active', isActive );
			tab.setAttribute( 'aria-selected', isActive ? 'true' : 'false' );
			tab.setAttribute( 'tabindex', isActive ? '0' : '-1' );
		} );

		panels.forEach( ( panel, i ) => {
			const isActive = i === index;
			panel.classList.toggle( 'is-active', isActive );
			if ( isActive ) {
				panel.removeAttribute( 'hidden' );
			} else {
				panel.setAttribute( 'hidden', '' );
			}
		} );

		if ( focusTab ) {
			tabs[ index ].focus();
		}
	}

	tabs.forEach( ( tab, index ) => {
		tab.addEventListener( 'click', () => selectTab( index ) );

		tab.addEventListener( 'keydown', ( event ) => {
			let next = null;
			switch ( event.key ) {
				case 'ArrowRight':
				case 'ArrowDown':
					next = ( index + 1 ) % tabs.length;
					break;
				case 'ArrowLeft':
				case 'ArrowUp':
					next = ( index - 1 + tabs.length ) % tabs.length;
					break;
				case 'Home':
					next = 0;
					break;
				case 'End':
					next = tabs.length - 1;
					break;
				default:
					return;
			}
			event.preventDefault();
			selectTab( next, true );
		} );
	} );
}
