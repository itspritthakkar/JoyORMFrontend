import { Box, Divider, Typography } from '@mui/material';

const NotesColumn = () => {
    return (
        <Box
            sx={{
                width: '23%',
                backgroundColor: '#D8FFD8',
                borderRadius: 1,
                p: 1
            }}
        >
            <Typography fontWeight="bold" fontSize={14} mb={1}>
                Notes
            </Typography>

            <Box sx={{ overflowY: 'auto', maxHeight: '110px' }}>
                <Typography fontSize={12}>11/09/2025: XXXXXXXXXXXX 🟢</Typography>
                <Typography fontSize={12}>12/09/2025: XXXXXXXXXXXX 🟡</Typography>
                <Typography fontSize={12}>13/09/2025: XXXXXXXXXXXX 🔵</Typography>
                <Typography fontSize={12}>14/09/2025: XXXXXXXXXXXX 🟥</Typography>

                <Divider sx={{ my: 0.7 }} />

                <Typography fontSize={11}>Logs: User working on application & Admin can enter notes</Typography>

                <Divider sx={{ my: 0.7 }} />

                <Typography fontSize={11} fontWeight="bold">
                    Color codes for categories:
                </Typography>
                <Typography fontSize={11}>🟢 Discussed on Call</Typography>
                <Typography fontSize={11}>🟡 Confirmed on Call</Typography>
                <Typography fontSize={11}>🔵 For Sydney team</Typography>
                <Typography fontSize={11}>🟥 For India team</Typography>
                <Typography fontSize={11} fontWeight="bold">
                    Bold
                </Typography>
            </Box>
        </Box>
    );
};

export default NotesColumn;
