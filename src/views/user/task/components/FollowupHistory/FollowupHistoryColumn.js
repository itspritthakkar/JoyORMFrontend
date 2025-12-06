import { Box, Typography } from '@mui/material';
import { useTaskLogContext } from '../../contexts/TaskLogContext';

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

const FollowupHistoryColumn = () => {
    const { taskLog } = useTaskLogContext();
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
                {taskLog &&
                    taskLog
                        .filter((log) => log.type?.toUpperCase() == 'FOLLOWUP')
                        .map((log) => (
                            <Typography key={log.id} fontSize={12}>
                                {formatDate(log.createdAt)}: Received -{' '}
                                <span style={{ color: 'green' }}>
                                    {log.clientDataLabel}: {log.clientDataValue}
                                </span>
                            </Typography>
                        ))}
            </Box>
        </Box>
    );
};

export default FollowupHistoryColumn;
