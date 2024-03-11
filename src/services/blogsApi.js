import { createApi } from '@reduxjs/toolkit/query/react'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../common/firebase'

export const blogApi = createApi({
    reducerPath: 'blogApi',
    tagTypes: ['posts', 'categories'],
    endpoints: (builder) => ({
        getBlogs: builder.query({
            async queryFn() {
                try {
                    const postsCollectionRef = collection(db, 'posts')
                    const postsSnapshot = await getDocs(postsCollectionRef)
                    const postsData = postsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id, lastEdited: doc.data().lastEdited?.toDate().toString() }));
                    return { data: postsData }
                } catch (error) {
                    return { error: error }
                }
            },
            providesTags: ['posts']
        }),
        getCategories: builder.query({
            async queryFn() {
                try {
                    const categoriesCollectionRef = collection(db, "categories")
                    const categoriesSnapshot = await getDocs(categoriesCollectionRef)
                    const categoriesData = categoriesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    return { data: categoriesData }
                } catch (error) {
                    return { error: error }
                }
            },
            providesTags: ['categories']
        }),
        addBlog: builder.mutation({
            async queryFn(data) {
                try {
                    const postsCollectionRef = collection(db, 'posts')
                    // console.log('data to add: ', data)
                    await addDoc(postsCollectionRef, data)
                    return { data: 'Added' }
                } catch (error) {
                    return { error: error }
                }
            },
            invalidatesTags: ['posts']
        }),
        updateBlog: builder.mutation({
            async queryFn(data) {
                try {
                    let [id, blog] = data
                    // console.log(id, 'data to update : ', blog)
                    const postDocRef = doc(db, "posts", id);
                    await updateDoc(postDocRef, blog)
                    return { data: 'Updated' }
                } catch (error) {
                    return { error: error }
                }
            },
            invalidatesTags: ['posts']
        }),
        deleteBlog: builder.mutation({
            async queryFn(id) {
                try {
                    await deleteDoc(doc(db, "posts", id))
                    return { data: 'Deleted' }
                } catch (error) {
                    return { error: error }
                }
            },
            invalidatesTags: ['posts']
        })
    })
})

export const { useGetBlogsQuery, useGetCategoriesQuery, useAddBlogMutation, useUpdateBlogMutation } = blogApi