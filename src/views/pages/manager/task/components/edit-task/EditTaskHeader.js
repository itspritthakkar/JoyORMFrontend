import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { useEditTaskContext } from '../../contexts/EditTaskContext';
import { useTaskHelperContext } from '../../contexts/TaskHelperContext';
import { useEffect, useMemo, useState } from 'react';
import useTaskService from '../../services/useTaskService';

const EditTaskHeader = () => {
    const { currentTask } = useEditTaskContext();
    const { users } = useTaskHelperContext();
    const [selectedUser, setSelectedUser] = useState(null);

    const { updateExistingTask } = useTaskService();

    // build options including a manual "Unassigned" entry
    const options = useMemo(() => {
        const unassigned = { id: null, label: 'Unassigned', email: '', firstName: '', lastName: '' };
        const userOptions = (users?.data || []).map((u) => ({ ...u, label: `${u.email} (${u.firstName} ${u.lastName})` }));
        return [unassigned, ...userOptions];
    }, [users]);

    // when currentTask changes, set the selected user object (or Unassigned)
    useEffect(() => {
        const match = options.find((opt) => opt.id === currentTask.data.assignedToUserId) || options[0];
        setSelectedUser(match);
    }, [currentTask.data, options, setSelectedUser]);

    return (
        <Box sx={{ px: 2, py: 1, backgroundColor: 'grey.50', borderRadius: '16px 16px 0 0' }}>
            <Typography variant="h5" sx={{ mb: 0.5, fontSize: '12px' }}>
                Assigned User
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                {users.isLoaded && !users.isError && (
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => option.label || `${option.email} (${option.firstName} ${option.lastName})`}
                        value={selectedUser || options[0]}
                        onChange={(event, newValue) => {
                            setSelectedUser(newValue);
                            updateExistingTask({ ...currentTask.data, assignedToUserId: newValue.id });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select User"
                                variant="outlined"
                                size="small"
                                // remove paddings on the input root and input element (does not affect the dropdown list)
                                InputProps={{
                                    ...params.InputProps,
                                    sx: {
                                        padding: 0,
                                        minHeight: 'unset'
                                    }
                                }}
                                inputProps={{
                                    ...params.inputProps,
                                    style: {
                                        padding: 0,
                                        height: 24,
                                        boxSizing: 'border-box'
                                    }
                                }}
                                sx={{
                                    // ensure the outlined root has no extra padding/margins
                                    '& .MuiOutlinedInput-root': {
                                        padding: 0,
                                        minHeight: 'unset'
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        // keep normal outline styling but slightly tighter radius
                                        borderRadius: 6
                                    }
                                }}
                            />
                        )}
                        // tighten the autocomplete container (only affects input area)
                        sx={{
                            width: 300,
                            '& .MuiAutocomplete-inputRoot': {
                                padding: 0,
                                '& .MuiAutocomplete-input': {
                                    padding: 0
                                }
                            }
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

export default EditTaskHeader;
