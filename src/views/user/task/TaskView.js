import { Box, Grid, useTheme } from '@mui/material';
import { useTaskContext } from './contexts/TaskContext';
import TaskList from './components/TaskList';
import useTaskService from './services/useTaskService';
import { useEffect } from 'react';
import CreateTaskDialog from './components/CreateTaskDialog';
import EditTask from './components/edit-task/index.js';
import { useEditTaskContext } from './contexts/EditTaskContext';
import FollowupHistory from './components/FollowupHistory';

const TaskView = () => {
    const theme = useTheme();

    const {
        loading,
        error,
        setTasks,
        setLoading,
        setError,
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
        setTotal,
        shouldRefetch,
        setShouldRefetch
    } = useTaskContext();

    const { currentTask } = useEditTaskContext();

    const { fetchTasks } = useTaskService();

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await fetchTasks({ page, pageSize, search, sortBy, sortOrder });
                if (!mounted) return;
                setTasks(res?.data || []);
                setShouldRefetch(false);
                if (typeof res?.total === 'number') setTotal(res.total);
            } catch (err) {
                if (!mounted) return;
                setError(err?.message || String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        if (shouldRefetch) {
            load();
        }

        return () => {
            mounted = false;
        };
    }, [fetchTasks, page, pageSize, search, sortBy, sortOrder, setLoading, setTasks, setError, setTotal, shouldRefetch, setShouldRefetch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Box>
            <Grid container spacing={2}>
                <TaskList />

                <EditTask />

                <CreateTaskDialog />
            </Grid>

            {currentTask.data.id ? (
                <FollowupHistory />
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.background.default,
                        p: 2,
                        mt: 1,
                        borderRadius: 2
                    }}
                >
                    Select a task to view followup history
                </Box>
            )}
        </Box>
    );
};

export default TaskView;
