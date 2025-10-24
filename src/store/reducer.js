// third-party
import { combineReducers } from 'redux';

// project imports
import snackbarReducer from './slices/snackbar';
import menuReducer from './slices/menu';
import filterReducer from './slices/filter';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    menu: menuReducer,
    filter: filterReducer
});

export default reducer;
