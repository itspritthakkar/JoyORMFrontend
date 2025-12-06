import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

const FollowupHistoryColumn = ({ taskLogs }) => {
    if (!taskLogs || taskLogs.length === 0) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: 0.5,
                minWidth: '150px',
                height: '100%',
                p: 1
            }}
        >
            {taskLogs &&
                taskLogs
                    .filter((log) => log.type?.toUpperCase() == 'FOLLOWUP')
                    .map((log) => {
                        console.log(log);
                        return (
                            <Typography key={log.id} fontSize={12}>
                                {formatDate(log.createdAt)}: Received - <span style={{ color: 'red' }}>{log.clientDataLabel}: </span>
                                <span style={{ color: 'green' }}>{log.clientDataValue}</span>
                            </Typography>
                        );
                    })}
        </Box>
    );
};

FollowupHistoryColumn.propTypes = {
    taskLogs: PropTypes.array.isRequired
};
export default FollowupHistoryColumn;
