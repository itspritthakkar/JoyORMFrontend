// ...existing code...
import { Box, Button, Grid, Stack, TextField, Typography, useTheme, FormHelperText } from '@mui/material';
import DynamicFieldsSkeleton from './DynamicFieldsSkeleton';
import PropTypes from 'prop-types';

// ...existing code...

const DyanamicFieldsForm = ({ isLoaded, fields, formik }) => {
    const theme = useTheme();

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
                                // use f.name if available, otherwise f.id as form key
                                const fieldKey = f.name || f.id;
                                // Render a separate label above each field (do not use TextField's label prop)
                                const fieldLabel = f.label || `Field ${idx + 1}`;
                                const fieldType = (f.fieldType || '').toLowerCase();

                                if (fieldType === 'textarea') {
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
                                                </Box>
                                            </Box>

                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                multiline
                                                rows={4}
                                                required={!!f.isRequired}
                                                name={fieldKey}
                                                id={fieldKey}
                                                value={formik.values[fieldKey] ?? ''}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched[fieldKey] && Boolean(formik.errors[fieldKey])}
                                                helperText={formik.touched[fieldKey] && formik.errors[fieldKey]}
                                            />
                                        </div>
                                    );
                                }

                                if (fieldType === 'number' || fieldType === 'textbox' || fieldType === 'email') {
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
                                                </Box>
                                            </Box>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                type={fieldType === 'textbox' ? 'text' : fieldType}
                                                required={!!f.isRequired}
                                                name={fieldKey}
                                                id={fieldKey}
                                                value={formik.values[fieldKey] ?? ''}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched[fieldKey] && Boolean(formik.errors[fieldKey])}
                                                helperText={formik.touched[fieldKey] && formik.errors[fieldKey]}
                                            />
                                        </div>
                                    );
                                }

                                if (fieldType === 'button') {
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
                                                </Box>
                                            </Box>

                                            {f.options.map((option) => {
                                                const selectedValue = formik.values[fieldKey];

                                                // Determine selection depending on single-select or multi-select
                                                const isSelected = f.isMultipleSelection
                                                    ? Array.isArray(selectedValue) && selectedValue.includes(option.id)
                                                    : selectedValue === option.id;

                                                return (
                                                    <Button
                                                        key={option.id}
                                                        fullWidth
                                                        variant={isSelected ? 'contained' : 'outlined'}
                                                        onClick={() => {
                                                            if (f.isMultipleSelection) {
                                                                // MULTI SELECT
                                                                let newValues = Array.isArray(selectedValue) ? [...selectedValue] : [];

                                                                if (newValues.includes(option.id)) {
                                                                    // unselect
                                                                    newValues = newValues.filter((id) => id !== option.id);
                                                                } else {
                                                                    // select
                                                                    newValues.push(option.id);
                                                                }

                                                                formik.setFieldValue(fieldKey, newValues);
                                                            } else {
                                                                // SINGLE SELECT
                                                                formik.setFieldValue(fieldKey, option.id);
                                                            }

                                                            formik.setFieldTouched(fieldKey, true, true);
                                                        }}
                                                        onBlur={() => formik.setFieldTouched(fieldKey, true, true)}
                                                        sx={{
                                                            mb: 1,
                                                            ...(isSelected && {
                                                                backgroundColor: theme.palette.primary.main,
                                                                color: theme.palette.primary.contrastText
                                                            }),
                                                            ...(!isSelected && {
                                                                backgroundColor: `${theme.palette.primary.main}4D`,
                                                                color: theme.palette.primary.dark,
                                                                boxShadow: 'none',
                                                                '&:hover': {
                                                                    backgroundColor: `${theme.palette.primary.main}66`,
                                                                    boxShadow: 'none'
                                                                }
                                                            })
                                                        }}
                                                        size="small"
                                                    >
                                                        {option.label}
                                                    </Button>
                                                );
                                            })}

                                            {formik.touched[fieldKey] && formik.errors[fieldKey] && (
                                                <FormHelperText error>{formik.errors[fieldKey]}</FormHelperText>
                                            )}
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
                                            name={fieldKey}
                                            id={fieldKey}
                                            value={formik.values[fieldKey] ?? ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched[fieldKey] && Boolean(formik.errors[fieldKey])}
                                            helperText={formik.touched[fieldKey] && formik.errors[fieldKey]}
                                        />
                                    </div>
                                );
                            })}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

DyanamicFieldsForm.propTypes = {
    isLoaded: PropTypes.bool.isRequired,
    fields: PropTypes.array.isRequired,
    formik: PropTypes.object.isRequired
};

export default DyanamicFieldsForm;
// ...existing code...
