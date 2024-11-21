import { Navigate, Route, Routes } from 'react-router-dom';

import ForgotPassword from './pages/LoginPage/ForgotPasswordPage';
import LoginPage from './pages/LoginPage/LoginPage';
import MainPage from './pages/MainPage/MainPage';
import ContactPage from './pages/ContactPage/ContactPage';
import MessagePage from './pages/MessagePage/MessagePage';

import ProtectedRoute from './routes/ProtectedRoute';
import UnauthorizeRoute from './routes/UnauthorizeRoute';
import SearchPage from './pages/SearchPage/SearchPage';
import UserPage from './pages/User/UserPage';

import SearchUsers from './components/Search/SearchUsers';
import SearchGroup from './components/Search/SearchGroup';

import ChatPage from './pages/MessagePage/ChatPage/ChatPage';
import FriendListPage from './pages/ContactPage/FriendListPage/FriendListPage';
import FriendRequestPage from './pages/ContactPage/FriendRequestPage/FriendRequestPage';
import VideoCall from './components/VideoCall';
import SettingPage from './pages/SettingPage/SettingPage';
import GroupListPage from './pages/ContactPage/GroupListPage/GroupListPage';
import GroupRequestPage from './pages/ContactPage/GroupRequestPage/GroupRequestPage';

function App() {
    return (
        <Routes>
            {/* Public route for unauthenticated users */}
            <Route element={<UnauthorizeRoute />}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
            </Route>

            {/* Protected route for authenticated users */}
            <Route element={<ProtectedRoute />}>
                <Route path='/' element={<MainPage />}>
                    <Route index element={<Navigate to='/message' replace />} /> {/* Redirect to /message */}
                    <Route path='message' element={<MessagePage />}>
                        <Route path=':chatRoomId' element={<ChatPage />} />
                    </Route>
                    <Route path='contact' element={<ContactPage />}>
                        <Route path='friend-list' element={<FriendListPage />} />
                        <Route path='friend-request' element={<FriendRequestPage />} />
                        <Route path='group-list' element={<GroupListPage />} />
                        <Route path='group-request' element={<GroupRequestPage />} />
                    </Route>
                    <Route path='search' element={<SearchPage />}>
                        <Route path='users' element={<SearchUsers />} />
                        <Route path='groups' element={<SearchGroup />} />
                    </Route>
                    <Route path='user/:id' element={<UserPage />} />
                    <Route path='setting' element={<SettingPage />} />
                </Route>
                <Route path='/video-call/:chatRoomId' element={<VideoCall />} />
            </Route>

            {/* Optional: Catch-all route for undefined paths */}
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
}

export default App;
