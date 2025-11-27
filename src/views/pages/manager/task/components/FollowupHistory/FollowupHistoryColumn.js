import { Box, Typography } from '@mui/material';

const FollowupHistoryColumn = () => {
    return (
        <Box
            sx={{
                width: '27%',
                backgroundColor: '#FDE3D8',
                borderRadius: 1,
                p: 1
            }}
        >
            <Typography fontWeight="bold" fontSize={14} mb={1}>
                Followup History
            </Typography>

            <Box sx={{ overflowY: 'auto', maxHeight: '110px' }}>
                <Typography fontSize={12}>11/09/2025: E-mail</Typography>
                <Typography fontSize={12}>11/09/2025: Whatsapp</Typography>
                <Typography fontSize={12}>
                    11/09/2025: Received - <span style={{ color: 'green' }}>Australian Address: 123 XYZ STREET, CITY, STATE PIN 1234</span>
                </Typography>
                <Typography fontSize={12}>12/09/2025: Call</Typography>
                <Typography fontSize={12}>
                    12/09/2025: Received - <span style={{ color: 'green' }}>Australian Address Proof: Received</span>
                </Typography>
            </Box>
        </Box>
    );
};

export default FollowupHistoryColumn;
