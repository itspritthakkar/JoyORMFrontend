import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { Box, Typography } from '@mui/material';

const NoTaskSelected = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Box>
                <CategoryRoundedIcon sx={{ fontSize: 200 }} color="disabled" />
                <Typography variant="h5" align="center" color="textSecondary" fontSize={20}>
                    Select a Task to edit
                </Typography>
            </Box>
        </Box>
    );
};

export default NoTaskSelected;
