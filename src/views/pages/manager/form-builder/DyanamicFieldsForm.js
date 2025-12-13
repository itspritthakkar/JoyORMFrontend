// ...existing code...
import {
    Box,
    Button,
    Grid,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import CalculateIcon from '@mui/icons-material/Calculate';
import SubjectIcon from '@mui/icons-material/Subject';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';
import DynamicFieldsSkeleton from './DynamicFieldsSkeleton';
import EditIcon from '@mui/icons-material/Edit';

// ...existing code...

const DyanamicFieldsForm = () => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [fields, setFields] = useState([]);
    const [values, setValues] = useState({}); // store values keyed by field.name

    // dialog states for adding a field
    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingType, setPendingType] = useState(null);
    const [dialogLabel, setDialogLabel] = useState('');
    const [dialogIsRequired, setDialogIsRequired] = useState(false);
    const [dialogIsMulti, setDialogIsMulti] = useState(false);

    // edit state: id of field being edited (null when creating)
    const [editingFieldId, setEditingFieldId] = useState(null);

    // option dialog states
    const [optionDialogOpen, setOptionDialogOpen] = useState(false);
    const [optionLabel, setOptionLabel] = useState('');
    const [optionFieldId, setOptionFieldId] = useState(null);

    // delete dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteFieldId, setDeleteFieldId] = useState(null);
    const [deleteFieldLabel, setDeleteFieldLabel] = useState('');

    // delete option dialog states
    const [deleteOptionDialogOpen, setDeleteOptionDialogOpen] = useState(false);
    const [deleteOptionId, setDeleteOptionId] = useState(null);
    const [deleteOptionLabel, setDeleteOptionLabel] = useState('');
    const [deleteOptionFieldId, setDeleteOptionFieldId] = useState(null);

    useEffect(() => {
        const fetchDynamicFields = async () => {
            try {
                const { data } = await axiosExtended.get('/DynamicFormField');
                setFields(Array.isArray(data) ? data : []);
                setIsLoaded(true);
            } catch (err) {
                showAxiosErrorEnquebar(err);
            }
        };

        fetchDynamicFields();
    }, []);

    const open = Boolean(anchorEl);
    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const labelToName = (label) => {
        if (!label) return `field_${Date.now()}`;
        const base = label
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_') // spaces -> underscore
            .replace(/[^a-z0-9_]/g, ''); // remove any other chars
        // ensure uniqueness among existing fields
        let name = base || `field_${Date.now()}`;
        let idx = 1;
        const exists = (n) => fields.some((f) => f.name === n);
        while (exists(name)) {
            name = `${base}_${idx++}`;
        }
        return name;
    };

    const openAddDialog = (fieldType) => {
        setPendingType(fieldType);
        setDialogLabel(fieldType.toLowerCase() === 'button' ? 'Buttons' : 'New Field');
        setDialogIsRequired(false);
        setDialogIsMulti(false);
        setDialogOpen(true);
        handleClose();
    };

    const openEditDialog = (field) => {
        if (!field) return;
        setEditingFieldId(field.id);
        setPendingType(field.fieldType);
        setDialogLabel(field.label ?? '');
        setDialogIsRequired(!!field.isRequired);
        setDialogIsMulti(!!field.isMultiSelect);
        setDialogOpen(true);
        handleClose();
    };

    const closeAddDialog = () => {
        setDialogOpen(false);
        setPendingType(null);
        setEditingFieldId(null);
    };

    const createDynamicFormField = async ({ label, fieldType, isRequired, isMultipleSelection }) => {
        const body = {
            label,
            fieldType,
            isRequired,
            isMultipleSelection
        };

        try {
            const res = await axiosExtended.post('/DynamicFormField', body);
            return res.data;
        } catch (err) {
            showAxiosErrorEnquebar(err);
        }
    };

    const updateDynamicFormField = async ({ id, label, fieldType, isRequired, isMultipleSelection }) => {
        if (!id) return;
        const body = { label, fieldType, isRequired, isMultipleSelection };
        try {
            const res = await axiosExtended.put(`/DynamicFormField/${id}`, body);
            return res.data;
        } catch (err) {
            showAxiosErrorEnquebar(err);
        }
    };

    const confirmAddField = async () => {
        // If editingFieldId is set -> update, otherwise create
        const payload = {
            label: dialogLabel || (pendingType === 'button' ? 'Buttons' : 'New Field'),
            fieldType: pendingType,
            isRequired: !!dialogIsRequired,
            isMultipleSelection: pendingType === 'button' ? !!dialogIsMulti : false
        };

        closeAddDialog();

        if (editingFieldId) {
            const updated = await updateDynamicFormField({ id: editingFieldId, ...payload });
            if (updated) {
                setFields((prev) =>
                    prev.map((f) => {
                        if (f.id === editingFieldId) {
                            // preserve name if backend doesn't return it
                            return { ...f, ...updated, name: f.name ?? updated.name };
                        }
                        return f;
                    })
                );
            }
        } else {
            const created = await createDynamicFormField(payload);
            if (created) {
                setFields((prev) => [...prev, created]);
                // ensure values entry exists for created.name (use returned name or generate)
                setValues((prev) => ({
                    ...prev,
                    [created.name ?? labelToName(created.label)]:
                        created.fieldType.toLowerCase() === 'button' ? (created.isMultiSelect ? [] : '') : ''
                }));
            }
        }
    };

    const handleChange = (name, v) => {
        setValues((prev) => ({ ...prev, [name]: v }));
    };

    const openAddOptionDialog = (fieldId) => {
        setOptionFieldId(fieldId);
        setOptionLabel('Option 1');
        setOptionDialogOpen(true);
    };

    const closeAddOptionDialog = () => {
        setOptionDialogOpen(false);
        setOptionLabel('');
        setOptionFieldId(null);
    };

    const labelToValue = (label) => {
        const base = (label ?? '')
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
        return base || `opt_${Date.now()}`;
    };

    const createDynamicFormOption = async ({ label, value, dynamicFormFieldId }) => {
        try {
            const body = { label, value, dynamicFormFieldId };
            const res = await axiosExtended.post('/DynamicFormOption', body);
            return res.data;
        } catch (err) {
            showAxiosErrorEnquebar(err);
        }
    };

    const confirmAddOption = async () => {
        if (!optionFieldId) return;
        const label = optionLabel.trim();
        const value = labelToValue(label);
        // call API
        const created = await createDynamicFormOption({
            label,
            value,
            dynamicFormFieldId: optionFieldId
        });

        const optionToAdd = {
            id: created?.id ?? created?.Id ?? `${optionFieldId}_opt_${Date.now()}`,
            label,
            value
        };

        setFields((prev) =>
            prev.map((f) => {
                if (f.id === optionFieldId) {
                    const opts = Array.isArray(f.options) ? [...f.options, optionToAdd] : [optionToAdd];
                    return { ...f, options: opts };
                }
                return f;
            })
        );

        closeAddOptionDialog();
    };

    const openDeleteDialog = (id, label) => {
        setDeleteFieldId(id);
        setDeleteFieldLabel(label ?? '');
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeleteFieldId(null);
        setDeleteFieldLabel('');
    };

    const openDeleteOptionDialog = (optionId, optionLabel, fieldId) => {
        setDeleteOptionId(optionId);
        setDeleteOptionLabel(optionLabel ?? '');
        setDeleteOptionFieldId(fieldId);
        setDeleteOptionDialogOpen(true);
    };

    const closeDeleteOptionDialog = () => {
        setDeleteOptionDialogOpen(false);
        setDeleteOptionId(null);
        setDeleteOptionLabel('');
        setDeleteOptionFieldId(null);
    };

    const deleteDynamicFormField = async (id) => {
        if (!id) return;
        try {
            await axiosExtended.delete(`/DynamicFormField/${id}`);
            // remove from local state
            const removed = fields.find((f) => f.id === id);
            setFields((prev) => prev.filter((f) => f.id !== id));
            setValues((prev) => {
                const next = { ...prev };
                if (removed?.name) delete next[removed.name];
                return next;
            });
            closeDeleteDialog();
        } catch (err) {
            showAxiosErrorEnquebar(err);
        }
    };

    const deleteDynamicFormOption = async (id, fieldId) => {
        if (!id || !fieldId) return;
        try {
            await axiosExtended.delete(`/DynamicFormOption/${id}`);
            // remove from local state
            setFields((prev) =>
                prev.map((f) => {
                    if (f.id === fieldId) {
                        return { ...f, options: f.options.filter((o) => o.id !== id) };
                    }
                    return f;
                })
            );
            closeDeleteOptionDialog();
        } catch (err) {
            showAxiosErrorEnquebar(err);
        }
    };

    if (!isLoaded) {
        return <DynamicFieldsSkeleton count={4} />;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2, fontSize: '18px' }}>
                Dynamic Fields
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        {/* dynamically added / backend fields */}
                        {fields
                            .slice()
                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                            .map((f, idx) => {
                                // Render a separate label above each field (do not use TextField's label prop)
                                const fieldLabel = f.label || `Field ${idx + 1}`;

                                if (f.fieldType.toLowerCase() === 'textarea') {
                                    return (
                                        <div key={f.id}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    my: 0.5,
                                                    width: '100%'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                                                        {fieldLabel}{' '}
                                                        {f.isRequired ? (
                                                            <Typography component="span" color="error">
                                                                *
                                                            </Typography>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: `${theme.palette.primary.light}`,
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <IconButton
                                                            sx={{ color: theme.palette.primary.main }}
                                                            onClick={() => openEditDialog(f)}
                                                        >
                                                            <EditIcon color="inherit" fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: `${theme.palette.error.light}50`,
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    <IconButton
                                                        sx={{ color: theme.palette.error.main }}
                                                        onClick={() => openDeleteDialog(f.id, fieldLabel)}
                                                    >
                                                        <DeleteIcon color="inherit" fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                multiline
                                                rows={4}
                                                required={!!f.isRequired}
                                                name={f.name}
                                                id={f.name}
                                                value={values[f.name] ?? ''}
                                                onChange={(e) => handleChange(f.name, e.target.value)}
                                            />
                                        </div>
                                    );
                                }

                                if (
                                    f.fieldType.toLowerCase() === 'number' ||
                                    f.fieldType.toLowerCase() === 'textbox' ||
                                    f.fieldType.toLowerCase() === 'email'
                                ) {
                                    return (
                                        <div key={f.id}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    my: 0.5,
                                                    width: '100%'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                                                        {fieldLabel}{' '}
                                                        {f.isRequired ? (
                                                            <Typography component="span" color="error">
                                                                *
                                                            </Typography>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: `${theme.palette.primary.light}`,
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <IconButton
                                                            sx={{ color: theme.palette.primary.main }}
                                                            onClick={() => openEditDialog(f)}
                                                        >
                                                            <EditIcon color="inherit" fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: `${theme.palette.error.light}50`,
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    <IconButton
                                                        sx={{ color: theme.palette.error.main }}
                                                        onClick={() => openDeleteDialog(f.id, fieldLabel)}
                                                    >
                                                        <DeleteIcon color="inherit" fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                type={f.fieldType.toLowerCase() === 'textbox' ? 'text' : f.fieldType.toLowerCase()}
                                                required={!!f.isRequired}
                                                name={f.name}
                                                id={f.name}
                                                value={values[f.name] ?? ''}
                                                onChange={(e) => handleChange(f.name, e.target.value)}
                                            />
                                        </div>
                                    );
                                }

                                if (f.fieldType.toLowerCase() === 'button') {
                                    return (
                                        <div key={f.id}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    my: 0.5,
                                                    width: '100%'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                                                        {fieldLabel}{' '}
                                                        {f.isRequired ? (
                                                            <Typography component="span" color="error">
                                                                *
                                                            </Typography>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: `${theme.palette.primary.light}`,
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <IconButton
                                                            sx={{ color: theme.palette.primary.main }}
                                                            onClick={() => openEditDialog(f)}
                                                        >
                                                            <EditIcon color="inherit" fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: `${theme.palette.error.light}50`,
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    <IconButton
                                                        sx={{ color: theme.palette.error.main }}
                                                        onClick={() => openDeleteDialog(f.id, fieldLabel)}
                                                    >
                                                        <DeleteIcon color="inherit" fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                sx={{ mb: 1 }}
                                                size="small"
                                                startIcon={<Add />}
                                                onClick={() => openAddOptionDialog(f.id)}
                                            >
                                                Add Option
                                            </Button>

                                            {f.options.map((option) => (
                                                <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        sx={{
                                                            backgroundColor: `${theme.palette.primary.main}4D`,
                                                            color: theme.palette.primary.dark,
                                                            boxShadow: 'none',
                                                            '&:hover': {
                                                                backgroundColor: `${theme.palette.primary.main}66`,
                                                                boxShadow: 'none'
                                                            }
                                                        }}
                                                        size="small"
                                                    >
                                                        {option.label}
                                                    </Button>
                                                    <Box
                                                        sx={{
                                                            height: 35,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: `${theme.palette.error.light}50`,
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <IconButton
                                                            sx={{ color: theme.palette.error.main }}
                                                            onClick={() => openDeleteOptionDialog(option.id, option.label, f.id)}
                                                        >
                                                            <DeleteIcon color="inherit" fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </div>
                                    );
                                }

                                // fallback
                                return (
                                    <div key={f.id}>
                                        <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                                            {fieldLabel}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name={f.name}
                                            id={f.name}
                                            value={values[f.name] ?? ''}
                                            onChange={(e) => handleChange(f.name, e.target.value)}
                                        />
                                    </div>
                                );
                            })}

                        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpen}>
                            Add a Field
                        </Button>

                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            <MenuItem onClick={() => openAddDialog('textbox')}>
                                <ListItemIcon>
                                    <TextFieldsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Textfield</ListItemText>
                            </MenuItem>

                            <MenuItem onClick={() => openAddDialog('number')}>
                                <ListItemIcon>
                                    <CalculateIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Number</ListItemText>
                            </MenuItem>

                            <MenuItem onClick={() => openAddDialog('email')}>
                                <ListItemIcon>
                                    <EmailIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Email</ListItemText>
                            </MenuItem>

                            <MenuItem onClick={() => openAddDialog('textarea')}>
                                <ListItemIcon>
                                    <SubjectIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Textarea</ListItemText>
                            </MenuItem>

                            <MenuItem onClick={() => openAddDialog('button')}>
                                <ListItemIcon>
                                    <TouchAppIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Button</ListItemText>
                            </MenuItem>
                        </Menu>

                        {/* Add Field Dialog */}
                        <Dialog open={dialogOpen} onClose={closeAddDialog} maxWidth="xs" fullWidth>
                            <DialogTitle>Add field</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Field label"
                                    type="text"
                                    fullWidth
                                    value={dialogLabel}
                                    onChange={(e) => setDialogLabel(e.target.value)}
                                />
                                <FormControlLabel
                                    sx={{ mt: 1 }}
                                    control={<Switch checked={dialogIsRequired} onChange={(_, v) => setDialogIsRequired(v)} />}
                                    label="Required"
                                />
                                {pendingType === 'button' && (
                                    <FormControlLabel
                                        sx={{ mt: 0 }}
                                        control={<Switch checked={dialogIsMulti} onChange={(_, v) => setDialogIsMulti(v)} />}
                                        label="Allow multiselect"
                                    />
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={closeAddDialog}>Cancel</Button>
                                <Button variant="contained" onClick={confirmAddField}>
                                    {editingFieldId ? 'Update' : 'Add'}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Add Option Dialog */}
                        <Dialog open={optionDialogOpen} onClose={closeAddOptionDialog} maxWidth="xs" fullWidth>
                            <DialogTitle>Add option</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Option label"
                                    type="text"
                                    fullWidth
                                    value={optionLabel}
                                    onChange={(e) => setOptionLabel(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={closeAddOptionDialog}>Cancel</Button>
                                <Button variant="contained" onClick={confirmAddOption}>
                                    Add
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Delete Confirmation Dialog */}
                        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
                            <DialogTitle>Delete field</DialogTitle>
                            <DialogContent>
                                <Typography>
                                    Are you sure you want to delete <strong>{deleteFieldLabel}</strong>? This action cannot be undone.
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={closeDeleteDialog}>Cancel</Button>
                                <Button color="error" variant="contained" onClick={() => deleteDynamicFormField(deleteFieldId)}>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Delete Option Confirmation Dialog */}
                        <Dialog open={deleteOptionDialogOpen} onClose={closeDeleteOptionDialog} maxWidth="xs" fullWidth>
                            <DialogTitle>Delete option</DialogTitle>
                            <DialogContent>
                                <Typography>
                                    Are you sure you want to delete the option <strong>{deleteOptionLabel}</strong>? This action cannot be
                                    undone.
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={closeDeleteOptionDialog}>Cancel</Button>
                                <Button
                                    color="error"
                                    variant="contained"
                                    onClick={() => deleteDynamicFormOption(deleteOptionId, deleteOptionFieldId)}
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DyanamicFieldsForm;
// ...existing code...
