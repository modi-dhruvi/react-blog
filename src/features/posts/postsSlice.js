import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    postsList: []
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        getAllPosts: (state, action) => {
            state.postsList = action.payload
        }
    }
})

export const { getAllPosts } = postsSlice.actions

export default postsSlice.reducer