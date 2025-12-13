import { Box, Button, Divider, Grid, IconButton, Typography, useTheme } from '@mui/material';
import { useTaskContext } from '../contexts/TaskContext';
import { useCreateTaskContext } from '../contexts/CreateTaskContext';
import AddIcon from '@mui/icons-material/Add';
import SubCard from 'ui-component/cards/SubCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useTaskListHelper from '../helpers/useTaskListHelper';
import { useEditTaskContext } from '../contexts/EditTaskContext';
import { formatDateWithTime } from 'utils/commons/functions';
import { useState } from 'react';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import useTaskService from '../services/useTaskService';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';

const TaskList = () => {
    const theme = useTheme();
    const { tasks, removeTask } = useTaskContext();
    const { handleOpenCreateTaskDialog } = useCreateTaskContext();
    const { currentTask } = useEditTaskContext();
    const { selectTaskToEdit } = useTaskListHelper();
    const { deleteExistingTask, markTaskAsCompleted } = useTaskService();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const handlePopoverOpen = (event, task) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedTask(task);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setSelectedTask(null);
    };

    const handleDelete = async () => {
        if (selectedTask) {
            await deleteExistingTask(selectedTask.id);
            removeTask(selectedTask.id);
            handlePopoverClose();
        }
    };

    const handleMarkAsCompleted = async () => {
        if (selectedTask) {
            await markTaskAsCompleted(selectedTask.id);
            handlePopoverClose();
        }
    };

    // Render Task List
    return (
        <>
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
                                <SubCard
                                    key={task.id}
                                    onClick={() => selectTaskToEdit(task)}
                                    sx={{
                                        mb: 1,
                                        cursor: 'pointer',
                                        ...(task.id === currentTask.data.id ? { border: '3px solid', borderColor: 'primary.main' } : {})
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                                                Assigned User
                                            </Typography>
                                            <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                                                {task.assignedByName ? task.assignedByName : 'Unassigned'}
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
                                                <IconButton onClick={(event) => handlePopoverOpen(event, task)}>
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
                                                Date
                                            </Typography>
                                            <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                                                {formatDateWithTime(task.createdAt)}
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

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                                                Email ID
                                            </Typography>
                                            <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                                                {task.emailId}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 1 }} />

                                    <Box>
                                        <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                                            Case ID
                                        </Typography>
                                        <Typography variant="body2" sx={{ wordWrap: 'break-word', fontSize: '14px' }}>
                                            {task.id}
                                        </Typography>
                                    </Box>
                                </SubCard>
                            ))}
                        </Box>
                    )}
                </Box>
            </Grid>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                {selectedTask?.status === 'GreenFlag' && (
                    <MenuItem onClick={handleMarkAsCompleted}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: `${theme.palette.success.light}50`,
                                    borderRadius: 2
                                }}
                            >
                                <IconButton sx={{ color: theme.palette.success.main, fontSize: 18 }}>
                                    <DoneRoundedIcon color="inherit" fontSize="inherit" />
                                </IconButton>
                            </Box>
                            <Typography>Mark as Completed</Typography>
                        </Box>
                    </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleDelete}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: `${theme.palette.error.light}50`,
                                borderRadius: 2
                            }}
                        >
                            <IconButton sx={{ color: theme.palette.error.main, fontSize: 18 }}>
                                <DeleteIcon color="inherit" fontSize="inherit" />
                            </IconButton>
                        </Box>
                        <Typography>Delete</Typography>
                    </Box>
                </MenuItem>
            </Popover>
        </>
    );
};

export default TaskList;
