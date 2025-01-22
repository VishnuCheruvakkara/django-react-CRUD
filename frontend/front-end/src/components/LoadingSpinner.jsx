import React from 'react';
import { GridLoader } from 'react-spinners';

const LoadingSpinner = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="absolute bg-white inset-0 opacity-90 z-10 flex justify-center items-center">
            <GridLoader color="#3b82f6" loading={loading} size={15} />
        </div>
    );
};

export default LoadingSpinner;
