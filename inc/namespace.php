<?php
/**
 * Plugin bootstrap.
 */

namespace HM\TabbedContent;

/**
 * Hook block registration on init.
 */
function bootstrap(): void {
	add_action( 'init', __NAMESPACE__ . '\\register_blocks' );
}

/**
 * Register the Tabbed Content blocks from the compiled build directory.
 */
function register_blocks(): void {
	// Children must be registered before the parents that template them.
	register_block_type( PLUGIN_PATH . '/build/blocks/tabbed-content-tab' );
	register_block_type( PLUGIN_PATH . '/build/blocks/tabbed-content-panel' );
	register_block_type( PLUGIN_PATH . '/build/blocks/tabbed-content-item' );
	register_block_type( PLUGIN_PATH . '/build/blocks/tabbed-content' );
}
