import { PayloadAction, createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../store/store";

// Define Date Modal for Post
interface Post {
  id: number;
  title: string;
  desc: string;
}

// Fake Async funcion to fetch post data
const fetchPost = async () => {
  return new Promise<{ data: Post[] }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: [
            {
              id: 1,
              title: "hello",
              desc: "test desc",
            },
          ],
        }),
      500
    )
  );
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getPost = createAsyncThunk("post/fetchPost", async () => {
  const response = await fetchPost();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const postAdapter = createEntityAdapter<Post>()

// Define Initial Post data
const initialState = postAdapter.getInitialState({
  error: "",
  status: "idle",
});

// Creating post slice and define reducer function and action
export const postAdapterSlice = createSlice({
  name: "postSlice",
  initialState: initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setPost: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.status = "idle";
      postAdapter.upsertMany(state, action.payload);
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getPost.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getPost.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = "idle";
        postAdapter.upsertMany(state, action.payload)
      })
      .addCase(getPost.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// exporting all default post Adapter selctor - available with postAction.[use telesense to check all built in selector]
export const postAdapterSelector  = postAdapter.getSelectors<RootState>(state=>state.postAdapter)

// exporting all post action - available with postAction.[name of the action or use telesense]
export const postAction = postAdapterSlice.actions;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const fetchPostDirect =
  (amount: number): AppThunk =>
  async (dispatch, getState) => {
    const posts = await fetchPost();
    dispatch(postAction.setPost(posts));
  };

// exporting reducer
export default postAdapterSlice.reducer;
