import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { formatDateWithTime } from 'utils/commons/functions';

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
                                {formatDateWithTime(log.createdAt)}: Received -{' '}
                                <span style={{ color: 'red' }}>{log.clientDataLabel}: </span>
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
