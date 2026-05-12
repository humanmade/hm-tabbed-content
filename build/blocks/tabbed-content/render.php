<?php
/**
 * Server-side rendering for the Tabbed Content block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block inner content.
 * @param WP_Block $block      Block instance.
 * @return string Rendered block HTML.
 */

$wrapper_attributes = get_block_wrapper_attributes( [
	'class' => 'tabbed-content',
] );

?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="tabbed-content-container">
		<div class="tabbed-content-container__left">
			<?php echo $content ?? ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<div class="tabbed-content-container__right">
			<div class="tabbed-content-cover-image"></div>
		</div>
	</div>
</div>
