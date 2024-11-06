import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';

const DrawerTitle = ({ isBackButtonVisible, drawerTitle, handleBack }) => (
    isBackButtonVisible ? (
        <div className='flex items-center'>
            <ArrowLeftOutlined onClick={handleBack} className='mr-2' />
            {drawerTitle}
        </div>
    ) : (
        drawerTitle
    )
);

export default DrawerTitle;