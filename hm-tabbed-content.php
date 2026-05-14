<?php
/**
 * Plugin Name:       HM Tabbed Content
 * Description:       A tabbed content block where each tab reveals an associated image or video alongside its content.
 * Version:           0.2.0
 * Requires at least: 6.7
 * Requires PHP:      8.0
 * Author:            Human Made Limited
 * Author URI:        https://humanmade.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hm-tabbed-content
 */

namespace HM\TabbedContent;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PLUGIN_PATH = __DIR__;
const PLUGIN_FILE = __FILE__;

require_once __DIR__ . '/inc/namespace.php';

add_action( 'plugins_loaded', __NAMESPACE__ . '\\bootstrap' );
