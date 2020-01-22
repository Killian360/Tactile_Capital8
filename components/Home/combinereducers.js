import { createStore, combineReducers } from 'redux';
import SLIDER_INDEXATION from './slider_reducer.js';

const rootReducer = combineReducers({
    SLIDER_INDEXATION
});

export const store = createStore(rootReducer);
