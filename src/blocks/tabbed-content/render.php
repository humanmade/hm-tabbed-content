<?php
/**
 * Server-side rendering for the Tabbed Content block.
 *
 * Walks the parent block's inner blocks to find the locked header group and
 * the locked items group, then rebuilds the output as a tablist + panels
 * structure. The same DOM is emitted for both layouts; CSS arranges it.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner HTML (unused — we render inner blocks directly).
 * @var WP_Block $block      Block instance.
 */

namespace HM\TabbedContent;

$layout = ( $attributes['layout'] ?? 'side' ) === 'top' ? 'top' : 'side';

$wrapper_attributes = get_block_wrapper_attributes( [
	'class'       => sprintf( 'tabbed-content is-layout-%s', $layout ),
	'data-layout' => $layout,
] );

$header_block = null;
$items_group  = null;
foreach ( $block->inner_blocks as $inner ) {
	$class = $inner->parsed_block['attrs']['className'] ?? '';
	if ( strpos( $class, 'tabbed-content__header' ) !== false ) {
		$header_block = $inner;
	} elseif ( strpos( $class, 'tabbed-content__items' ) !== false ) {
		$items_group = $inner;
	}
}

$items = [];
if ( $items_group ) {
	foreach ( $items_group->inner_blocks as $item ) {
		if ( $item->name === 'humanmade/tabbed-content-item' ) {
			$items[] = $item;
		}
	}
}

$instance_id = wp_unique_id( 'tabbed-content-' );

/**
 * Decide whether a URL points at a video file.
 *
 * @param string $url Media URL.
 */
$is_video = static function ( string $url ): bool {
	$path = strtolower( wp_parse_url( $url, PHP_URL_PATH ) ?? '' );
	return (bool) preg_match( '/\.(mp4|webm|ogg|mov)$/', $path );
};

?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $header_block ) : ?>
		<?php echo $header_block->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endif; ?>

	<?php if ( ! empty( $items ) ) : ?>
		<div class="tabbed-content__body">
			<div class="tabbed-content__tablist" role="tablist">
				<?php foreach ( $items as $index => $item ) :
					$atts          = $item->attributes;
					$title         = $atts['title'] ?? '';
					$thumbnail     = $atts['thumbnailUrl'] ?? '';
					$thumbnail_alt = $atts['thumbnailAlt'] ?? '';
					$is_active     = 0 === $index;
					$tab_id        = sprintf( '%s-tab-%d', $instance_id, $index );
					$panel_id      = sprintf( '%s-panel-%d', $instance_id, $index );
					?>
					<button
						type="button"
						role="tab"
						class="tabbed-content__tab<?php echo $is_active ? ' is-active' : ''; ?>"
						id="<?php echo esc_attr( $tab_id ); ?>"
						aria-controls="<?php echo esc_attr( $panel_id ); ?>"
						aria-selected="<?php echo $is_active ? 'true' : 'false'; ?>"
						tabindex="<?php echo $is_active ? '0' : '-1'; ?>"
						data-index="<?php echo (int) $index; ?>"
					>
						<?php if ( $thumbnail ) : ?>
							<span class="tabbed-content__tab-thumbnail" aria-hidden="true">
								<img src="<?php echo esc_url( $thumbnail ); ?>" alt="<?php echo esc_attr( $thumbnail_alt ); ?>" loading="lazy" />
							</span>
						<?php endif; ?>
						<span class="tabbed-content__tab-title"><?php echo wp_kses( $title, [ 'strong' => [], 'em' => [], 'br' => [] ] ); ?></span>
					</button>
				<?php endforeach; ?>
			</div>

			<div class="tabbed-content__panels">
				<?php foreach ( $items as $index => $item ) :
					$atts      = $item->attributes;
					$media_url = $atts['url'] ?? '';
					$media_alt = $atts['alt'] ?? '';
					$is_active = 0 === $index;
					$tab_id    = sprintf( '%s-tab-%d', $instance_id, $index );
					$panel_id  = sprintf( '%s-panel-%d', $instance_id, $index );
					?>
					<div
						class="tabbed-content__panel<?php echo $is_active ? ' is-active' : ''; ?>"
						id="<?php echo esc_attr( $panel_id ); ?>"
						role="tabpanel"
						aria-labelledby="<?php echo esc_attr( $tab_id ); ?>"
						data-index="<?php echo (int) $index; ?>"
						<?php echo $is_active ? '' : 'hidden'; ?>
					>
						<div class="tabbed-content__panel-content">
							<?php echo $item->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</div>
						<?php if ( $media_url ) : ?>
							<div class="tabbed-content__panel-media">
								<?php if ( $is_video( $media_url ) ) : ?>
									<video src="<?php echo esc_url( $media_url ); ?>" autoplay loop muted playsinline aria-label="<?php echo esc_attr( $media_alt ); ?>"></video>
								<?php else : ?>
									<img src="<?php echo esc_url( $media_url ); ?>" alt="<?php echo esc_attr( $media_alt ); ?>" loading="lazy" />
								<?php endif; ?>
							</div>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	<?php endif; ?>
</div>
