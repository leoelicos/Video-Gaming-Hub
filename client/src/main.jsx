import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// all of the apps pages get pathed here for routing
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import UserPostsPage from './pages/UserPosts.jsx';
import SoloThread from './pages/SoloThread.jsx';
import NewsPage from './pages/NewsPage.jsx';
import Navbar from './pages/Navbar.jsx';
import RootWrapper from './pages/RootWrapper.jsx';

//router for app page change functionality
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: '',
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: '/profile',
        element: <ProfilePage />
      },
      {
        path: '/blog',
        element: <BlogPage />
      },
      {
        path: '/create-post',
        element: <CreatePostPage />
      },
      {
        path: '/user-posts',
        element: <UserPostsPage />
      },
      {
        path: '/solo-thread/:postId',
        element: <SoloThread />
      },
      {
        path: '/news',
        element: <NewsPage />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RootWrapper>
    <RouterProvider router={router} />
  </RootWrapper>
);
