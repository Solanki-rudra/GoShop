import React from 'react';
import { Spin } from 'antd';

const Spinner: React.FC = () => {
    return (
        <div className='w-full h-full flex justify-center items-center p-4'>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
};

export default Spinner;