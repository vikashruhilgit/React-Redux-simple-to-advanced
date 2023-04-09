import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './counter/counterSlice';
import { postApiWithAdapter } from './post/postAdvancedSlice';
import postAdapter  from './post/postAdapterSlice';
import postBasicSlice from './post/postBasicSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [postApiWithAdapter.reducerPath]: postApiWithAdapter.reducer,
    postAdapter: postAdapter,
    postBasic: postBasicSlice
  },
  middleware: (gDm) =>
  gDm().concat(postApiWithAdapter.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
