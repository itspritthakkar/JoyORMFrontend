import { Box, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import NoTaskSelected from './NoTaskSelected';
import { useEffect } from 'react';
import useTaskService from '../../services/useTaskService';
import { useEditTaskContext } from '../../contexts/EditTaskContext';
import EditTaskForm from './edit-task-form';

const EditTaskView = () => {
    const { id } = useParams();
    const { currentTask, setCurrentTask, handleResetCurrentTask } = useEditTaskContext();
    const { fetchTaskById } = useTaskService();

    useEffect(() => {
        const loadTaskData = async (taskId) => {
            try {
                setCurrentTask({ isLoaded: false, isError: false, data: {} });
                const res = await fetchTaskById(taskId);
                setCurrentTask({ isLoaded: true, isError: false, data: res });
            } catch (err) {
                setCurrentTask({ isLoaded: true, isError: true, data: {} });
            }
        };

        if (id) {
            loadTaskData(id);
        } else {
            handleResetCurrentTask();
        }
    }, [fetchTaskById, handleResetCurrentTask, id, setCurrentTask]);

    return (
        <Grid item xs={12} md={9} sx={{ '&.MuiGrid-item': { paddingTop: 0 } }}>
            <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2, height: currentTask.data.id ? '60vh' : '75vh' }}>
                {!id && <NoTaskSelected />}

                {id && !currentTask.isLoaded && !currentTask.isError && (
                    <Box>
                        <Typography>Loading...</Typography>
                    </Box>
                )}

                {id && currentTask.isLoaded && currentTask.isError && (
                    <Box>
                        <Typography>Error...</Typography>
                    </Box>
                )}

                {id && currentTask.isLoaded && !currentTask.isError && <EditTaskForm />}
            </Box>
        </Grid>
    );
};

export default EditTaskView;
