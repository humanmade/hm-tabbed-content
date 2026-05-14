<?php
/**
 * Server-side rendering for the Tabbed Content block.
 *
 * Walks the parent block's inner blocks to find the locked header group and
 * the locked items group, then rebuilds the output as a tablist + panels
 * structure. The same DOM is emitted for both layouts; CSS arranges it.
 *
 * Each tabbed-content-item contains two child blocks: a tabbed-content-tab
 * whose inner blocks become the tab affordance, and a tabbed-content-panel
 * whose inner blocks become the revealed content.
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
		if ( $item->name !== 'humanmade/tabbed-content-item' ) {
			continue;
		}
		$tab_block   = null;
		$panel_block = null;
		foreach ( $item->inner_blocks as $child ) {
			if ( $child->name === 'humanmade/tabbed-content-tab' ) {
				$tab_block = $child;
			} elseif ( $child->name === 'humanmade/tabbed-content-panel' ) {
				$panel_block = $child;
			}
		}
		if ( $tab_block && $panel_block ) {
			$items[] = [
				'tab'   => $tab_block,
				'panel' => $panel_block,
			];
		}
	}
}

$instance_id = wp_unique_id( 'tabbed-content-' );

?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $header_block ) : ?>
		<?php echo $header_block->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<?php endif; ?>

	<?php if ( ! empty( $items ) ) : ?>
		<div class="tabbed-content__body">
			<div class="tabbed-content__tablist" role="tablist">
				<?php foreach ( $items as $index => $pair ) :
					$is_active = 0 === $index;
					$tab_id    = sprintf( '%s-tab-%d', $instance_id, $index );
					$panel_id  = sprintf( '%s-panel-%d', $instance_id, $index );
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
						<?php echo $pair['tab']->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</button>
				<?php endforeach; ?>
			</div>

			<div class="tabbed-content__panels">
				<?php foreach ( $items as $index => $pair ) :
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
						<?php echo $pair['panel']->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	<?php endif; ?>
</div>
