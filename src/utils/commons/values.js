import { autocompleteListSchema } from 'types/commons';

export const propertySituations = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Active', value: 'Active' },
    { label: 'Under Construction', value: 'UnderConstruction' },
    { label: 'Temporary Locked', value: 'TemporaryLocked' },
    { label: 'Permanent Locked', value: 'PermanentLocked' }
    // { label: 'Other', value: 'Other' }
];
export const propertySituationAutocomplete = autocompleteListSchema.cast(
    propertySituations.filter((propertySituation) => propertySituation.value != 'Pending' && propertySituation.value != 'Completed')
);

export const statusColors = (theme) => ({
    Completed: {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.dark
    },
    TemporaryLocked: {
        backgroundColor: '#FDE4EC',
        color: '#AD1457'
    },
    PermanentLocked: {
        backgroundColor: '#FFCDD2',
        color: '#B71C1C'
    },
    Pending: {
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.dark
    },
    Active: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.dark
    },
    UnderConstruction: {
        backgroundColor: '#D2B48C',
        color: '#8B4513'
    },
    Default: {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.info.dark
    }
});
