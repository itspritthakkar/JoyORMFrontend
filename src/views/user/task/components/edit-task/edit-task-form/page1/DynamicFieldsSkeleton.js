import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import PropTypes from 'prop-types';

const DynamicFieldsSkeleton = ({ count = 4 }) => {
    return (
        <Box>
            <Stack spacing={2}>
                {Array.from({ length: count }).map((_, i) => (
                    <Box key={i}>
                        {/* label skeleton */}
                        <Skeleton variant="text" width="40%" height={24} />
                        {/* input skeleton */}
                        <Skeleton variant="rectangular" height={44} sx={{ borderRadius: 1, mt: 0.5 }} />
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};
DynamicFieldsSkeleton.propTypes = {
    count: PropTypes.number
};

export default DynamicFieldsSkeleton;
