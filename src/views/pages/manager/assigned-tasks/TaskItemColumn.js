import { Box, Divider, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const TaskItemColumn = ({ taskItem }) => {
    return (
        <Box key={taskItem.id} sx={{ p: 0.5, mb: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                        Assigned User
                    </Typography>
                    <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                        {taskItem.assignedToName ? taskItem.assignedToName : 'Unassigned'}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box>
                        {taskItem.status === 'Pending' && (
                            <Box sx={{ bgcolor: 'orange.light', py: 0.5, px: 1, borderRadius: 1 }}>
                                <Typography variant="caption" color="orange.main">
                                    {taskItem.status}
                                </Typography>
                            </Box>
                        )}

                        {(taskItem.status === 'InProgress' || taskItem.status === 'FollowUp') && (
                            <Box sx={{ bgcolor: 'primary.light', py: 0.5, px: 1, borderRadius: 1 }}>
                                <Typography variant="caption" color="primary.main">
                                    {taskItem.status}
                                </Typography>
                            </Box>
                        )}

                        {(taskItem.status === 'GreenFlag' || taskItem.status === 'Completed') && (
                            <Box sx={{ bgcolor: 'success.light', py: 0.5, px: 1, borderRadius: 1 }}>
                                <Typography variant="caption" color="success.main">
                                    {taskItem.status}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ my: 1, borderColor: 'grey.500' }} />

            <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                        Name of Applicant
                    </Typography>
                    <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                        {taskItem.nameOfApplicant}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                        PassportNo
                    </Typography>
                    <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                        {taskItem.passportNo}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                        Application Type
                    </Typography>
                    <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                        {taskItem.applicationTypeLabel}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                        Contact No
                    </Typography>
                    <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                        {taskItem.contactNo}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

TaskItemColumn.propTypes = {
    taskItem: PropTypes.object.isRequired
};
export default TaskItemColumn;
