import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';

const DrawerTitle = ({ isBackButtonVisible, drawerTitle, handleBack }) =>
    isBackButtonVisible ? (
        <div className='flex items-center bg-white-default dark:bg-black-default dark:text-white-default'>
            <ArrowLeftOutlined onClick={handleBack} className='mr-2 dark:text-white-default' />
            {drawerTitle}
        </div>
    ) : (
        <div className='bg-white-default dark:bg-black-default dark:text-white-default'>{drawerTitle}</div>
    );

export default DrawerTitle;
