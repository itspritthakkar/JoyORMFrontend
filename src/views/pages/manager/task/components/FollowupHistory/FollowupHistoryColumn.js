import { Box, Typography } from '@mui/material';
import { useTaskLogContext } from '../../contexts/TaskLogContext';

function formatDate(dateString) {
    const date = new Date(dateString);

    // Convert to IST (UTC + 5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);

    const day = String(istDate.getDate()).padStart(2, '0');
    const month = String(istDate.getMonth() + 1).padStart(2, '0');
    const year = istDate.getFullYear();

    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const allowedTypes = ['FOLLOWUP', 'SOCIAL_WHATSAPP', 'SOCIAL_EMAIL', 'SOCIAL_CALL'];

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
                        .filter((log) => allowedTypes.includes(log.type?.toUpperCase()))
                        .map((log) => {
                            switch (log.type.toUpperCase()) {
                                case 'SOCIAL_WHATSAPP':
                                    return (
                                        <Typography key={log.id} fontSize={12}>
                                            {formatDate(log.updatedAt)}: WhatsApp
                                        </Typography>
                                    );
                                case 'SOCIAL_EMAIL':
                                    return (
                                        <Typography key={log.id} fontSize={12}>
                                            {formatDate(log.updatedAt)}: Email
                                        </Typography>
                                    );
                                case 'SOCIAL_CALL':
                                    return (
                                        <Typography key={log.id} fontSize={12}>
                                            {formatDate(log.updatedAt)}: Call
                                        </Typography>
                                    );
                                default:
                                    if (!log.clientDataValue || log.clientDataValue === '') return null;
                                    return (
                                        <Typography key={log.id} fontSize={12}>
                                            {formatDate(log.updatedAt)}: Received -{' '}
                                            <span style={{ color: 'green' }}>
                                                {log.clientDataLabel}: {log.clientDataValue}
                                            </span>
                                        </Typography>
                                    );
                            }
                        })}
            </Box>
        </Box>
    );
};

export default FollowupHistoryColumn;
