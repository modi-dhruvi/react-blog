import logo from './logo.svg';
import './App.css'
import { auth } from './common/firebase'
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './provider/AuthContext';
import Header from './components/header';
import Test from './test';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Footer from './pages/Footer';
import Subscribe from './pages/Subscribe';
import PostDetails from './pages/PostDetails';
import AddEditPost from './pages/AddEditPost';
import PrivateRoute from './components/PrivateRoute';
import CategoryWisePosts from './pages/CategoryWisePosts';
import Spinner from './components/Spinner';
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

        {/* <Header /> */}
        {/* <div style={{ backgroundColor: '#f5f5f5' }}> */}
        {/* <Routes>
          <Route exact path='/' element={<Dashboard />} />
          <Route path="/createpost" element={<AddEditPost IsEdit={false} />} />
          <Route path="/editpost" element={<PrivateRoute> <AddEditPost IsEdit={true} /> </PrivateRoute>} />
          <Route path="/category-wise-posts/:categoryName" element={<CategoryWisePosts />} /> */}
        {/* <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
            <Route path="/pending-posts" element={<PrivateRoute><PendingPosts /></PrivateRoute>} /> */}
        {/* <Route path="/postdetails/:id" element={<PostDetails />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        {/* <Route path='/spinner' element={<Spinner />} /> */}
        {/* </Routes>
        <Subscribe /> */}
        {/* </div> */}

        {/* <Footer /> */}
      </AuthProvider>
    </Router>
  );
}

export default App;
