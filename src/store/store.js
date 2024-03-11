import { configureStore } from '@reduxjs/toolkit'
import { blogApi } from '../services/blogsApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import postsReducer from '../features/posts/postsSlice'
import categoryReducer from '../features/category/categorySlice'

export const store = configureStore({
    reducer: {
        [blogApi.reducerPath]: blogApi.reducer,
        posts: postsReducer,
        categories: categoryReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware)
})

setupListeners(store.dispatch)

export default store