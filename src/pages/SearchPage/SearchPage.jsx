import { Outlet } from 'react-router-dom';

import SearchSideBar from '../../components/Search/SearchSideBar';

const SearchPage = () => {
    return (
        <div className='flex'>
            <SearchSideBar />
            <Outlet />
        </div>
    );
};

export default SearchPage;
