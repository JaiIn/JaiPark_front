import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Mypage from '../pages/Mypage';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import PostList from '../pages/PostList';
import PostDetail from '../pages/PostDetail';
import PostForm from '../pages/PostForm';
import EditProfile from '../pages/EditProfile';
import UserProfile from '../pages/UserProfile';
import Home from '../pages/Home';

// 보호된 라우트 컴포넌트
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// 비인증 라우트 컴포넌트
const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? children : <Navigate to="/mypage" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/home" replace />}
            />
            <Route
                path="/home"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
            <Route
                path="/mypage"
                element={
                    <PrivateRoute>
                        <Mypage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                }
            />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route
                path="/posts/new"
                element={
                    <PrivateRoute>
                        <PostForm />
                    </PrivateRoute>
                }
            />
            <Route
                path="/posts/:id/edit"
                element={
                    <PrivateRoute>
                        <PostForm />
                    </PrivateRoute>
                }
            />
            <Route
                path="/mypage/edit"
                element={
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile/:username"
                element={<UserProfile />}
            />
        </Routes>
    );
};

export default AppRoutes; 