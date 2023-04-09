import { Dictionary, EntityId, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Post date structure
interface Post {
  id: number,
  title: string,
  desc: string,
}

// state to represent EntityAdapter
export interface EntityState<T> {
  ids: EntityId[]
  entities: Dictionary<T>
}

// creating adapter for post slice
const postAdapter = createEntityAdapter<Post>();

// defining initial state for postAdapter
const initialState = postAdapter.getInitialState();

export const postApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<EntityState<Post>, void>({
      query: () => `/posts`,
      transformResponse: (response: Post[]) => {
        return postAdapter.setAll(initialState, response)
      },
      providesTags: ((result:any)  => [
        { type: "Post", id: "LIST"},
        ...result.ids.map((id: number | string)=>({ type: "Post", id: id}))
      ])
    }),
  }),
});

export const { useGetPostsQuery } = postApi;

const selectPostResult = postApi.endpoints.getPosts.select();

const selectPostData = createSelector(selectPostResult, postResult=>postResult.data)

export const postSelector = postAdapter.getSelectors<RootState>(state=>selectPostData(state) ?? initialState);