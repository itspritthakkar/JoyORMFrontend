import { Box, Divider, Typography } from '@mui/material';

const ClientDataColumn = () => {
    return (
        <Box
            sx={{
                width: '27%',
                backgroundColor: '#D7EEFF',
                borderRadius: 1,
                p: 1
            }}
        >
            <Typography fontWeight="bold" fontSize={14} mb={1}>
                Client Data
            </Typography>

            <Box sx={{ overflowY: 'auto', maxHeight: '110px' }}>
                <Typography fontSize={12}>61123456789</Typography>
                <Typography fontSize={12}>911234567891</Typography>
                <Typography fontSize={12}>a@gmail.com</Typography>
                <Divider sx={{ my: 0.5 }} />

                <Typography fontSize={12}>
                    Australian Address: <span style={{ color: 'green' }}>123 XYZ STREET, CITY, STATE PIN 1234</span>
                </Typography>

                <Typography fontSize={12}>
                    Australian Address Proof: <span style={{ color: 'green' }}>Received</span>
                </Typography>

                <Typography fontSize={12} color="red">
                    Police Station:
                </Typography>
            </Box>
        </Box>
    );
};

export default ClientDataColumn;
