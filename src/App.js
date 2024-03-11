import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './provider/AuthContext';
import { useGetBlogsQuery, useGetCategoriesQuery } from "./services/blogsApi"
import { useEffect } from 'react';
import AppRoutes from './components/AppRoutes';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllCategories } from './features/category/categorySlice';
import { getAllPosts } from './features/posts/postsSlice';

function App() {
  const { data: postsQueryData, isLoading: postsLoading } = useGetBlogsQuery()
  const { data: categoriesQueryData, isLoading: categoriesLoading } = useGetCategoriesQuery()
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (postsLoading && categoriesLoading && !postsQueryData && !categoriesQueryData)
      setIsLoading(true)
    else {
      setIsLoading(false)
      dispatch(getAllPosts(postsQueryData))
      dispatch(getAllCategories(categoriesQueryData))
    }
  }, [postsLoading, postsQueryData, categoriesLoading, categoriesQueryData])
  return (
    <Router>
      <AuthProvider>
        <AppRoutes isLoading={isLoading} />
      </AuthProvider>
    </Router>
  );
}

export default App;
