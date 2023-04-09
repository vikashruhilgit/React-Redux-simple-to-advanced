import {
  Dictionary,
  EntityId,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { type } from "os";

// Post date structure
interface Post {
  id: number;
  title: string;
  desc: string;
}

// state to represent EntityAdapter
export interface EntityState<T> {
  ids: EntityId[];
  entities: Dictionary<T>;
}

// creating adapter for post slice
const postAdapter = createEntityAdapter<Post>();

// defining initial state for postAdapter
const initialState = postAdapter.getInitialState();

export const postApiWithAdapter = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<EntityState<Post>, void>({
      query: () => `/posts`,
      transformResponse: (response: Post[]) => {
        return postAdapter.setAll(initialState, response);
      },
      providesTags: (result: any) => [
        { type: "Post", id: "LIST" },
        ...result.ids.map((id: number | string) => ({ type: "Post", id: id })),
      ],
    }),
    // for all other request type we are using mutation instead of query
    addPostExample: builder.mutation({
      query: (post: Post) => ({ url: `/posts`, method: "POST", body: post }),
      invalidatesTags: [{ type: "Post", id: "LIST" }], // LIST in id because this post doesn't exist.
    }),
    updatePostExample: builder.mutation({
      query: (post: Post) => ({
        url: `/posts/${post.id}`,
        method: "PUT",
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    removeExample: builder.mutation({
      query: ({ id }: Post) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
  }),
});

// useGetPostsQuery is used to give is loading, isError, error, isfecting for all the action related to post.
// this is common selector fo all eg, for query and mutation(add, update, delete)
export const {
  useGetPostsQuery,
  useUpdatePostExampleMutation,
  useAddPostExampleMutation,
  useRemoveExampleMutation,
} = postApiWithAdapter;

const selectPostResult = postApiWithAdapter.endpoints.getPosts.select();

const selectPostData = createSelector(
  selectPostResult,
  (postResult) => postResult.data
);

export const postSelector = postAdapter.getSelectors<RootState>(
  (state) => selectPostData(state) ?? initialState
);

// This eill fetch post in dispatch - or in index when app load - like
// ex: store.dispatch(postApi.endpoints.getPosts.initiate())
// postApi.endpoints.getPosts.initiate()
