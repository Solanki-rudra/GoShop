import React from 'react';
import { Spin } from 'antd';

const Spinner: React.FC = () => {
    return (
        <div className='w-full h-full flex justify-center items-center p-4'>
            <Spin />
        </div>
    );
};

export default Spinner;