import { Module, Computed, Dictionary } from '@cerebral/fluent';
import Router from '@cerebral/router';
import * as signals from './sequences';
import * as providers from './providers';
import { State, Todo } from './types';
import { counts, isAllChecked, visibleTodosUids } from './computed';

const router = Router({
	onlyHash: true,
	query: true,
	routes: [{ path: '/', signal: 'redirectToAll' }, { path: '/:filter', signal: 'changeFilter' }]
});

const state: State = {
	newTodoTitle: '',
	todos: Dictionary<Todo>({}),
	filter: 'all',
	editingUid: null,
	visibleTodosUids: Computed(visibleTodosUids),
	counts: Computed(counts),
	isAllChecked: Computed(isAllChecked)
};

export default Module({
	state,
	signals,
	modules: {
		router
	},
	providers
});
