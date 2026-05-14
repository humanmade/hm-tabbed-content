/**
 * Custom webpack config layered on top of @wordpress/scripts.
 *
 * The only thing we customize is the DependencyExtractionWebpackPlugin:
 * its default `BUNDLED_PACKAGES` list deliberately excludes
 * `@wordpress/icons` from the externalization map, which means webpack
 * tries to resolve and bundle the package from node_modules. Since
 * `@wordpress/scripts` does not depend on `@wordpress/icons`, that
 * resolution fails in clean CI installs (`npm ci`).
 *
 * WordPress exposes the icons module as the `wp.icons` global (enqueued
 * via the `wp-icons` script handle) on every editor page, so we can
 * safely externalize it here and avoid adding `@wordpress/icons` as a
 * direct dependency.
 */

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

const externalizeIcons = ( request ) => {
	if ( request === '@wordpress/icons' ) {
		return [ 'wp', 'icons' ];
	}
};

const externalizeIconsHandle = ( request ) => {
	if ( request === '@wordpress/icons' ) {
		return 'wp-icons';
	}
};

const replaceDepExtractionPlugin = ( plugins ) =>
	plugins.map( ( plugin ) =>
		plugin instanceof DependencyExtractionWebpackPlugin
			? new DependencyExtractionWebpackPlugin( {
					requestToExternal: externalizeIcons,
					requestToHandle: externalizeIconsHandle,
			  } )
			: plugin
	);

if ( Array.isArray( defaultConfig ) ) {
	module.exports = defaultConfig.map( ( config ) => ( {
		...config,
		plugins: replaceDepExtractionPlugin( config.plugins ),
	} ) );
} else {
	module.exports = {
		...defaultConfig,
		plugins: replaceDepExtractionPlugin( defaultConfig.plugins ),
	};
}
