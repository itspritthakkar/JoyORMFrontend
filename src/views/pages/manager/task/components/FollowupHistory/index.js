import { Box, useTheme } from '@mui/material';
import OtherAttachmentsColumn from './OtherAttachmentsColumn';
import ClientDataColumn from './ClientDataColumn';
import FollowupHistoryColumn from './FollowupHistoryColumn';
import NotesColumn from './NotesColumn';

const FollowupHistory = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                backgroundColor: theme.palette.background.default,
                mt: 1,
                borderRadius: 2,
                height: '25vh',
                p: 0.5
            }}
        >
            {/* Column 1 - Other form attachments */}
            <OtherAttachmentsColumn />

            {/* Column 2 - Client Data */}
            <ClientDataColumn />

            {/* Column 3 - Followup History */}
            <FollowupHistoryColumn />

            {/* Column 4 - Notes */}
            <NotesColumn />
        </Box>
    );
};

export default FollowupHistory;
