/**
 * Shared utility functions for the Tabbed Content block.
 */

/**
 * Check if a URL is a video file based on its extension.
 *
 * @param {string} url - The URL to check.
 * @return {boolean} True if the URL is a video file.
 */
export function isVideo( url ) {
	if ( ! url ) {
		return false;
	}
	const pathname = url.split( '?' )[ 0 ].toLowerCase();
	const videoExtensions = [ '.webm', '.mp4', '.ogg', '.mov' ];
	return videoExtensions.some( ( ext ) => pathname.endsWith( ext ) );
}
