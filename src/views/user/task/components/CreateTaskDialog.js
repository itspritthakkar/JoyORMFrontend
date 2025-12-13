import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCreateTaskContext } from '../contexts/CreateTaskContext';
import { useTaskHelperContext } from '../contexts/TaskHelperContext';
import { useState } from 'react';
import useTaskService from '../services/useTaskService';
import { useTaskContext } from '../contexts/TaskContext';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';

const CreateTaskDialog = () => {
    const { setShouldRefetch } = useTaskContext();
    const { isCreateTaskDialogOpen, handleCloseCreateTaskDialog, isSaving } = useCreateTaskContext();
    const { applicationTypes, users, selectedUser, setSelectedUser } = useTaskHelperContext();

    const { createNewTask } = useTaskService();

    const [selectedApplicationType, setSelectedApplicationType] = useState(null);
    const [nameOfApplicant, setNameOfApplicant] = useState('');
    const [passportNo, setPassportNo] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [emailId, setEmailId] = useState('');

    const handleSave = async () => {
        if (!selectedUser) {
            showAxiosErrorEnquebar({ message: 'Assign By field is mandatory' });
            return;
        }

        // Validate: at least one field must be non-empty / non-null
        const hasValue =
            (nameOfApplicant && String(nameOfApplicant).trim() !== '') ||
            (passportNo && String(passportNo).trim() !== '') ||
            (contactNo && String(contactNo).trim() !== '') ||
            (emailId && String(emailId).trim() !== '') ||
            (selectedApplicationType && selectedApplicationType !== null);

        if (!hasValue) {
            showAxiosErrorEnquebar({ message: 'Please provide at least one value before submitting.' });
            return;
        }

        await createNewTask({
            assignedByUserId: selectedUser.id,
            nameOfApplicant: nameOfApplicant.trim() || null,
            passportNo: passportNo.trim() || null,
            applicationTypeId: selectedApplicationType ? selectedApplicationType.id : null,
            contactNo: contactNo.trim() || null,
            emailId: emailId.trim() || null
        });

        handleCloseCreateTaskDialog();
        setShouldRefetch(true);
    };

    return (
        <Dialog open={isCreateTaskDialogOpen} onClose={handleCloseCreateTaskDialog} fullWidth maxWidth="sm">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Create New Task
                <IconButton
                    aria-label="close"
                    onClick={handleCloseCreateTaskDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                    size="large"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={1}>
                    <Box>
                        <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                            Assigned By
                        </Typography>

                        {users.isLoaded && !users.isError && (
                            <Autocomplete
                                options={users.data}
                                getOptionLabel={(option) => `${option.email} (${option.firstName} ${option.lastName})`}
                                value={selectedUser}
                                onChange={(event, newValue) => setSelectedUser(newValue)}
                                renderInput={(params) => <TextField {...params} placeholder="Select User" variant="outlined" />}
                                fullWidth
                            />
                        )}
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                            Name of Applicant
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Name of Applicant"
                            variant="outlined"
                            value={nameOfApplicant}
                            onChange={(e) => setNameOfApplicant(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                            Passport No
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Passport No"
                            variant="outlined"
                            value={passportNo}
                            onChange={(e) => setPassportNo(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                            Application Type
                        </Typography>

                        {applicationTypes.isLoaded && !applicationTypes.isError && (
                            <Autocomplete
                                options={applicationTypes.data}
                                getOptionLabel={(option) => option.label}
                                value={selectedApplicationType}
                                onChange={(event, newValue) => setSelectedApplicationType(newValue)}
                                renderInput={(params) => <TextField {...params} placeholder="Select Application Type" variant="outlined" />}
                                fullWidth
                            />
                        )}
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                            Contact No
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Contact No"
                            variant="outlined"
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                            Email Id
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Email Id"
                            variant="outlined"
                            type="email"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                        />
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ pr: 3, pb: 2, justifyContent: 'flex-end' }}>
                <Button onClick={handleSave} variant="contained" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTaskDialog;
