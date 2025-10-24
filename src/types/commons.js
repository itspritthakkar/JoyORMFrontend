import * as yup from 'yup';

/* =================================== Error messages =================================== */

// Total Elements
const TOTAL_ELEMENTS_NUMBER = 'Total elements must be a type of an integer';

// Status
const STATUS = 'Status must be one of the following: on, off';

/* =================================== Error messages end here =================================== */

/* ======================================= Common schemas ======================================== */

export const totalElements = yup.number().required(TOTAL_ELEMENTS_NUMBER).integer(TOTAL_ELEMENTS_NUMBER).default(0);
export const createdAt = yup.date();
export const updatedAt = yup.date();

export const status = yup.mixed().oneOf(['on', 'off', 'ON', 'OFF'], STATUS);
export const arrayOfStrings = yup.array(yup.string()).ensure();
export const autocompleteSchema = yup.object({
    label: yup.string().required(),
    value: yup.string().required()
});

export const autocompleteListSchema = yup.array(autocompleteSchema).ensure();

export const autocompleteBooleanSchema = yup.object({
    label: yup.string().required(),
    value: yup.bool().required()
});

export const autocompleteBooleanListSchema = yup.array(autocompleteBooleanSchema).ensure();

/* =================================== Common schemas end here =================================== */
