/**
 * Inline SVG icons used by the editor UI.
 *
 * Defined locally rather than imported from the WordPress icons package
 * because that package is not always available as either a registered
 * script handle or a resolvable npm dependency in clean installs of
 * this plugin. Paths copied verbatim from the corresponding upstream
 * exports.
 */
import { SVG, Path } from '@wordpress/primitives';

const iconProps = {
	xmlns: 'http://www.w3.org/2000/svg',
	viewBox: '0 0 24 24',
};

export const PlusIcon = (
	<SVG { ...iconProps }>
		<Path d="M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z" />
	</SVG>
);

export const ChevronUpIcon = (
	<SVG { ...iconProps }>
		<Path d="M6.5 12.4L12 8l5.5 4.4-.9 1.2L12 10l-4.5 3.6-1-1.2z" />
	</SVG>
);

export const ChevronDownIcon = (
	<SVG { ...iconProps }>
		<Path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z" />
	</SVG>
);

export const TrashIcon = (
	<SVG { ...iconProps }>
		<Path d="M20 5h-5.7c0-1.3-1-2.3-2.3-2.3S9.7 3.7 9.7 5H4v1.5h1.5v13c0 .8.7 1.5 1.5 1.5h10c.8 0 1.5-.7 1.5-1.5v-13H20V5zM7 19.5v-13h10v13H7zM9 8h1.5v9.5H9V8zm4.5 0H15v9.5h-1.5V8z" />
	</SVG>
);
