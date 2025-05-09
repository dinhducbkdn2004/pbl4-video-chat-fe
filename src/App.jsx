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
import GroupListPage from './pages/ContactPage/GroupListPage/GroupListPage';
import FriendRequestPage from './pages/ContactPage/FriendRequestPage/FriendRequestPage';
import VideoCall from './components/VideoCall';
import SettingPage from './pages/SettingPage/SettingPage';
import JoinGroupPage from './pages/JoinGroupPage/JoinGroupPage';

function App({ setIsDarkMode, isDarkMode }) {
    return (
        <Routes>
            {/* Public route for unauthenticated users */}
            <Route element={<UnauthorizeRoute />}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
            </Route>

            {/* Protected route for authenticated users */}
            <Route element={<ProtectedRoute />}>
                <Route path='/' element={<MainPage setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} />}>
                    <Route index element={<Navigate to='/message' replace />} />
                    <Route path='message' element={<MessagePage />}>
                        <Route path=':chatRoomId' element={<ChatPage />} />
                    </Route>
                    <Route path='contact' element={<ContactPage />}>
                        <Route path='friend-list' element={<FriendListPage />} />
                        <Route path='groups-list' element={<GroupListPage />} />
                        <Route path='friend-request' element={<FriendRequestPage />} />
                    </Route>
                    <Route path='search' element={<SearchPage />}>
                        <Route path='users' element={<SearchUsers />} />
                        <Route path='groups' element={<SearchGroup />} />
                    </Route>
                    <Route path='user/:id' element={<UserPage />} />
                    <Route path='setting' element={<SettingPage />} />
                </Route>
                <Route path='/video-call/:chatRoomId' element={<VideoCall />} />
                <Route path='/join-group/:chatRoomId' element={<JoinGroupPage />} />
            </Route>

            {/* Optional: Catch-all route for undefined paths */}
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
}

export default App;
