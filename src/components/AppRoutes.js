// Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './header';
import Dashboard from '../pages/Dashboard';
import AddEditPost from '../pages/AddEditPost';
import { PrivateRoute } from '../components/PrivateRoute';
import { CustomPrivateRoute } from '../components/PrivateRoute'
import CategoryWisePosts from '../pages/CategoryWisePosts';
import PostDetails from '../pages/PostDetails';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import Subscribe from '../pages/Subscribe';
import Footer from '../pages/Footer';
import Spinner from './Spinner';
import UpdateProfile from '../pages/UpdateProfile';
import PendingPosts from '../pages/PendingPosts';
import { useLocation } from 'react-router-dom'

function AppRoutes({ isLoading }) {
    const location = useLocation()
    const { pathname } = location
    const hideSubscribeAndFooter = ['/login', '/update-profile', '/signup', '/forgot-password'].includes(pathname);

    return (
        <div>
            {isLoading && <Spinner />}
            {!isLoading && (
                <div>
                    <Header />
                    <Routes>
                        <Route exact path='/' element={<Dashboard />} />
                        <Route path="/createpost" element={<PrivateRoute><AddEditPost IsEdit={false} /> </PrivateRoute>} />
                        <Route path="/editpost" element={<PrivateRoute> <AddEditPost IsEdit={true} /> </PrivateRoute>} />
                        <Route path="/category-wise-posts/:categoryName" element={<CategoryWisePosts />} />
                        <Route path="/postdetails/:id" element={<PostDetails />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<PrivateRoute><ForgotPassword /></PrivateRoute>} />
                        <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
                        <Route path="/pending-posts" element={<CustomPrivateRoute><PendingPosts /></CustomPrivateRoute>} />
                    </Routes>
                    {!hideSubscribeAndFooter && <Subscribe />}
                    {!hideSubscribeAndFooter && <Footer />}
                </div>
            )}
        </div>
    );
}

export default AppRoutes;