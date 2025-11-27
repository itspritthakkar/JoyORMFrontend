import { Box, Button, Divider, Grid, IconButton, Typography } from '@mui/material';
import { useTaskContext } from '../contexts/TaskContext';
import { useCreateTaskContext } from '../contexts/CreateTaskContext';
import AddIcon from '@mui/icons-material/Add';
import SubCard from 'ui-component/cards/SubCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useTaskListHelper from '../helpers/useTaskListHelper';
import { useEditTaskContext } from '../contexts/EditTaskContext';

const TaskList = () => {
    const { tasks } = useTaskContext();
    const { handleOpenCreateTaskDialog } = useCreateTaskContext();
    const { currentTask } = useEditTaskContext();
    const { selectTaskToEdit } = useTaskListHelper();

    // Render Task List
    return (
        <Grid item xs={12} md={3} sx={{ '&.MuiGrid-item': { paddingTop: 0 } }}>
            <Box sx={{ height: currentTask.data.id ? '60vh' : '75vh', backgroundColor: 'background.default', p: 2, borderRadius: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateTaskDialog}
                    sx={{ mb: 1 }}
                >
                    New Task
                </Button>

                {tasks.length === 0 && <div>No tasks available.</div>}
                {tasks.length > 0 && (
                    <Box sx={{ height: currentTask.data.id ? '48vh' : '60vh', overflowY: 'auto' }}>
                        {tasks.map((task) => (
                            <SubCard key={task.id} onClick={() => selectTaskToEdit(task)} sx={{ mb: 1, cursor: 'pointer' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                                            Assigned User
                                        </Typography>
                                        <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                                            {task.assignedToName ? task.assignedToName : 'Unassigned'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box>
                                            {task.status === 'Pending' && (
                                                <Box sx={{ bgcolor: 'orange.light', py: 0.5, px: 1, borderRadius: 1 }}>
                                                    <Typography variant="caption" color="orange.main">
                                                        {task.status}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {(task.status === 'InProgress' || task.status === 'FollowUp') && (
                                                <Box sx={{ bgcolor: 'primary.light', py: 0.5, px: 1, borderRadius: 1 }}>
                                                    <Typography variant="caption" color="primary.main">
                                                        {task.status}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {(task.status === 'GreenFlag' || task.status === 'Completed') && (
                                                <Box sx={{ bgcolor: 'success.light', py: 0.5, px: 1, borderRadius: 1 }}>
                                                    <Typography variant="caption" color="success.main">
                                                        {task.status}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        <Box sx={{ backgroundColor: 'primary.light', borderRadius: 2 }}>
                                            <IconButton>
                                                <MoreVertIcon fontSize="small" color="primary" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 1 }} />
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                                            Name of Applicant
                                        </Typography>
                                        <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                                            {task.nameOfApplicant}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                                            PassportNo
                                        </Typography>
                                        <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                                            {task.passportNo}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                                            Application Type
                                        </Typography>
                                        <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                                            {task.applicationTypeLabel}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                                            Contact No
                                        </Typography>
                                        <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                                            {task.contactNo}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </SubCard>
                        ))}
                    </Box>
                )}
            </Box>
        </Grid>
    );
};

export default TaskList;
