import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    categoriesList: []
}

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        getAllCategories: (state, action) => {
            state.categoriesList = action.payload
        }
    }
})

export const { getAllCategories } = categorySlice.actions

export default categorySlice.reducer