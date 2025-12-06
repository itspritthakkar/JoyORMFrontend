import { Box, Divider } from '@mui/material';
import StaticFieldsForm from './StaticFieldsForm';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import DyanamicFieldsForm from './DyanamicFieldsForm';
import { useEffect, useMemo, useState } from 'react';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import { useEditTaskContext } from 'views/user/task/contexts/EditTaskContext';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';

const staticFieldsValidationSchema = Yup.object({
    nameOfApplicant: Yup.string(),
    passportNo: Yup.string(),
    applicationTypeId: Yup.string(),
    contactNo: Yup.string(),
    emailId: Yup.string()
});

const Page1 = ({ handleNext }) => {
    const { currentTask } = useEditTaskContext();

    const [isLoaded, setIsLoaded] = useState(false);
    const [fields, setFields] = useState([]);

    const [isSaving, setIsSaving] = useState(false);

    const staticFieldsFormik = useFormik({
        initialValues: {
            nameOfApplicant: '',
            passportNo: '',
            applicationTypeId: '',
            contactNo: '',
            emailId: ''
        },
        validationSchema: staticFieldsValidationSchema,
        validateOnMount: false,
        validateOnBlur: true,
        validateOnChange: false
    });

    const { setValues: staticFieldsFormikSetValues } = staticFieldsFormik;

    useEffect(() => {
        const staticFormFieldsData = {};
        staticFormFieldsData.nameOfApplicant = currentTask.data.nameOfApplicant;
        staticFormFieldsData.passportNo = currentTask.data.passportNo;
        staticFormFieldsData.applicationTypeId = currentTask.data.applicationTypeId;
        staticFormFieldsData.contactNo = currentTask.data.contactNo;
        staticFormFieldsData.emailId = currentTask.data.emailId;

        staticFieldsFormikSetValues(staticFormFieldsData);
    }, [
        currentTask.data.applicationTypeId,
        currentTask.data.contactNo,
        currentTask.data.emailId,
        currentTask.data.nameOfApplicant,
        currentTask.data.passportNo,
        staticFieldsFormikSetValues
    ]);

    // Build initialValues and validation schema for dynamic fields based on fetched `fields`.
    const dynamicInitialValues = useMemo(() => {
        const init = {};
        fields.forEach((f) => {
            const key = f.name || f.id;
            init[key] = '';
        });
        return init;
    }, [fields]);

    const dynamicValidationSchema = useMemo(() => {
        const shape = {};
        fields.forEach((f) => {
            const key = f.name || f.id;
            const type = (f.fieldType || '').toLowerCase();
            let validator;

            if (type === 'number') {
                validator = Yup.number().typeError('Must be a number');
                if (!f.isRequired) validator = validator.nullable();
            } else if (type === 'email') {
                validator = Yup.string().email('Invalid email');
            } else {
                // textbox, textarea, button selections etc -> string
                validator = Yup.string();
            }

            // if (f.isRequired) {
            //     validator = validator.required(`${f.label || 'This field'} is required`);
            // }

            shape[key] = validator;
        });

        return Yup.object().shape(shape);
    }, [fields]);

    const dynamicFieldsFormik = useFormik({
        initialValues: dynamicInitialValues,
        validationSchema: dynamicValidationSchema,
        enableReinitialize: true,
        validateOnMount: false,
        validateOnBlur: true,
        validateOnChange: false
    });

    const { setValues: dynamicFieldsFormikSetValues } = dynamicFieldsFormik;

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

    useEffect(() => {
        const loadValues = async () => {
            const { data } = await axiosExtended.get('/DynamicFormValue/' + currentTask.data.id);

            const prefill = {};

            data.fields.forEach((fv) => {
                const field = fields.find((x) => x.id === fv.dynamicFormFieldId);
                if (!field) return;

                const key = field.name || field.id;

                if (field.fieldType.toLowerCase() === 'button') {
                    prefill[key] = field.isMultiSelect ? fv.selectedOptionIds || [] : fv.selectedOptionIds?.[0] || '';
                } else {
                    prefill[key] = fv.value || '';
                }
            });

            dynamicFieldsFormikSetValues(prefill);
        };

        if (isLoaded && fields.length) loadValues();
    }, [currentTask.data.id, dynamicFieldsFormikSetValues, fields, isLoaded]);

    const buildDynamicFormPayload = () => {
        const payload = {
            taskItemId: currentTask.data.id,
            fields: []
        };

        fields.forEach((field) => {
            const key = field.id; // key used in formik
            const rawValue = dynamicFieldsFormik.values[key];

            const dto = {
                dynamicFormFieldId: field.id,
                value: null,
                selectedOptionIds: null
            };

            const fieldType = (field.fieldType || '').toLowerCase();

            if (fieldType === 'button') {
                // Multi-select button field => array of IDs
                if (field.isMultipleSelection) {
                    if (Array.isArray(rawValue)) {
                        dto.selectedOptionIds = rawValue; // already an array of IDs
                    } else if (rawValue) {
                        dto.selectedOptionIds = [rawValue]; // convert single ID to array
                    } else {
                        dto.selectedOptionIds = [];
                    }
                } else {
                    // Single-select
                    dto.selectedOptionIds = rawValue ? [rawValue] : [];
                }
            } else {
                // Textbox / textarea / email / number
                dto.value = rawValue ?? '';
            }

            payload.fields.push(dto);
        });

        return payload;
    };

    const saveStaticForm = async () => {
        try {
            await axiosExtended.put(`/TaskItem/${currentTask.data.id}`, { ...currentTask.data, ...staticFieldsFormik.values });
        } catch (err) {
            console.log('Error saving Static form:', err);
            showAxiosErrorEnquebar(err);
        }
    };

    const saveDynamicForm = async () => {
        try {
            const payload = buildDynamicFormPayload();

            await axiosExtended.post('/DynamicFormValue', payload);
        } catch (err) {
            console.log('Error saving Dynamic form:', err);
            showAxiosErrorEnquebar(err);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        await saveStaticForm();
        await saveDynamicForm();

        showAxiosSuccessEnquebar('Saved Successfully!');
        setIsSaving(false);
    };

    return (
        <Box>
            <Box sx={{ overflowY: 'auto', height: '40vh' }}>
                <StaticFieldsForm formik={staticFieldsFormik} />

                <Divider sx={{ my: 2 }} />

                <DyanamicFieldsForm isLoaded={isLoaded} fields={fields} formik={dynamicFieldsFormik} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <LoadingButton loading={isSaving} variant="contained" color="primary" onClick={async () => await handleSave()}>
                    Save
                </LoadingButton>

                <LoadingButton
                    loading={isSaving}
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                        await handleSave();
                        handleNext();
                    }}
                >
                    Save & Continue
                </LoadingButton>
            </Box>
        </Box>
    );
};

Page1.propTypes = {
    handleNext: PropTypes.func.isRequired
};

export default Page1;
