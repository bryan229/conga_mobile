import { createStore, applyMiddleware, AnyAction } from 'redux';
import rootReducer from './reducers';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;
export type AppThunkAction<T> = ThunkAction<Promise<T>, RootState, unknown, AnyAction>;

export default store;
