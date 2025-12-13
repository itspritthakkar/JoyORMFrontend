import { Box, Typography } from '@mui/material';
import { useTaskLogContext } from '../../contexts/TaskLogContext';
import { formatDateWithTime } from 'utils/commons/functions';

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
                                            {formatDateWithTime(log.updatedAt)}: WhatsApp
                                        </Typography>
                                    );
                                case 'SOCIAL_EMAIL':
                                    return (
                                        <Typography key={log.id} fontSize={12}>
                                            {formatDateWithTime(log.updatedAt)}: Email
                                        </Typography>
                                    );
                                case 'SOCIAL_CALL':
                                    return (
                                        <Typography key={log.id} fontSize={12}>
                                            {formatDateWithTime(log.updatedAt)}: Call
                                        </Typography>
                                    );
                                default:
                                    if (!log.clientDataValue || log.clientDataValue === '') return null;
                                    return (
                                        <Typography key={log.id} fontSize={12}>
                                            {formatDateWithTime(log.updatedAt)}: Received -{' '}
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
