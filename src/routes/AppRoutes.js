import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 로딩 컴포넌트
const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="sr-only">Loading...</span>
    </div>
);

// Lazy-loaded 컴포넌트
const Home = lazy(() => import('../pages/Home'));
const Mypage = lazy(() => import('../pages/Mypage'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const PostList = lazy(() => import('../pages/PostList'));
const PostDetail = lazy(() => import('../pages/PostDetail'));
const PostForm = lazy(() => import('../pages/PostForm'));
const EditProfile = lazy(() => import('../pages/EditProfile'));
const UserProfile = lazy(() => import('../pages/UserProfile'));

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
        <Suspense fallback={<LoadingSpinner />}>
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
        </Suspense>
    );
};

export default AppRoutes;