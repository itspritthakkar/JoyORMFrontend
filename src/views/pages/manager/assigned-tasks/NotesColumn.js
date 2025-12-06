import { Box, Typography } from '@mui/material';

const NotesColumn = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: 0.5,
                minWidth: '200px',
                height: '100%',
                p: 1
            }}
        >
            <Typography fontSize={12}>11/09/2025: XXXXXXXXXXXX 🟢</Typography>
            <Typography fontSize={12}>12/09/2025: XXXXXXXXXXXX 🟡</Typography>
            <Typography fontSize={12}>13/09/2025: XXXXXXXXXXXX 🔵</Typography>
            <Typography fontSize={12}>14/09/2025: XXXXXXXXXXXX 🟥</Typography>
        </Box>
    );
};

export default NotesColumn;
