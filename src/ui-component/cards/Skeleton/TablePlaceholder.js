import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const TablePlaceholder = () => {
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Skeleton animation="wave" width={200} height={60} />
                <Skeleton animation="wave" width={200} height={60} />
            </Box>
            <Skeleton variant="rectangular" animation="wave" height={50} sx={{ marginBottom: '10px', borderRadius: '3px' }} />
            <Skeleton variant="rectangular" animation="wave" height={'45vh'} sx={{ borderRadius: '3px' }} />
        </>
    );
};

export default TablePlaceholder;
