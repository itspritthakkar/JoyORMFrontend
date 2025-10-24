import PropTypes from 'prop-types';
import { Grid, Skeleton, TableRow } from '@mui/material';
import { motion } from 'framer-motion';
import { gridSpacing } from 'store/constant';

// ==============================|| Animated Components ||============================== //
export const AnimatedTableRow = motion(TableRow);

export const MotionGrid = motion(Grid);

export const SkeletonGridContainer = ({ children, ...props }) => {
    return (
        <MotionGrid container {...props} layoutId="skeletonContainer" layout={'position'} spacing={gridSpacing} paddingY={1}>
            {children}
        </MotionGrid>
    );
};

SkeletonGridContainer.propTypes = {
    children: PropTypes.node
};

export const SkeletonInputLabel = (props) => (
    <Skeleton variant="rounded" animation="wave" width={150} height={25} sx={{ marginBottom: 1, borderRadius: '6px' }} {...props} />
);

export const SkeletonInputField = (props) => (
    <Skeleton variant="rounded" animation="wave" height={50} {...props} sx={{ borderRadius: '10px' }} />
);

export const SkeletonMultilineInputField = (props) => (
    <Skeleton variant="rounded" animation="wave" height={110} {...props} sx={{ borderRadius: '10px' }} />
);

export const SkeletonTableOnly = (props) => (
    <>
        <Skeleton variant="rounded" animation="wave" height={50} sx={{ marginY: '10px', borderRadius: '10px' }} {...props} />
        <Skeleton variant="rounded" animation="wave" height={400} sx={{ borderRadius: '10px' }} {...props} />
    </>
);
