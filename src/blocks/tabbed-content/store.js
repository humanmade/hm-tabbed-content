/**
 * Editor-only data store tracking which child item is "active" (its panel
 * shown in the editor preview) for each tabbed-content block on the page.
 *
 * The active index is keyed by the parent block's clientId so multiple
 * tabbed-content blocks in the same post don't share state. Items update
 * the store when they (or their descendants) gain selection; nothing
 * resets it when selection leaves the block, so the last-selected tab
 * remains active.
 *
 * The store name is exported separately in `./store-name.js` so consumer
 * blocks (item/tab/panel) can reference it without pulling the
 * registration side-effect into their bundle.
 */
import { createReduxStore, register, select } from '@wordpress/data';
import { STORE_NAME } from './store-name';

const DEFAULT_STATE = {};

const actions = {
	setActiveIndex( parentClientId, index ) {
		return {
			type: 'SET_ACTIVE_INDEX',
			parentClientId,
			index,
		};
	},
};

const selectors = {
	getActiveIndex( state, parentClientId ) {
		return state[ parentClientId ] ?? 0;
	},
};

function reducer( state = DEFAULT_STATE, action ) {
	if ( action.type === 'SET_ACTIVE_INDEX' ) {
		if ( state[ action.parentClientId ] === action.index ) {
			return state;
		}
		return {
			...state,
			[ action.parentClientId ]: action.index,
		};
	}
	return state;
}

// Guard against double-registration in case this module is somehow loaded
// from more than one bundle.
if ( ! select( STORE_NAME ) ) {
	const store = createReduxStore( STORE_NAME, {
		reducer,
		actions,
		selectors,
	} );
	register( store );
}

export { STORE_NAME };
