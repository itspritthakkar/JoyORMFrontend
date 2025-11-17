import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';

export const appendSearchParams = (baseUrl, searchParamsObj) => {
    const searchParamsStr = Object.keys(searchParamsObj)
        .map((searchParamKey) =>
            searchParamsObj[searchParamKey] && searchParamsObj[searchParamKey] !== ''
                ? `${searchParamKey}=${searchParamsObj[searchParamKey]}`
                : undefined
        )
        .filter(Boolean)
        .join('&');

    return `${baseUrl}?${searchParamsStr}`;
};

export function formatDateString(dateString) {
    // Parse the UTC date string into a Date object
    const utcDate = new Date(dateString + 'Z'); // Ensures it's treated as UTC

    // Define options for formatting the date in the user's local time zone
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    // Use Intl.DateTimeFormat to format the UTC date in the user's local time zone
    return new Intl.DateTimeFormat('en-US', options).format(utcDate);
}

// Common enquebars
export const showAxiosErrorEnquebar = (error) => {
    if (process.env.REACT_APP_DEVELOPER_MODE === 'true') {
        console.error(error);
    }
    enqueueSnackbar(error.response?.data.message || error.message || 'Something went wrong.', {
        style: {
            borderRadius: '10px'
        },
        preventDuplicate: true,
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
        }
    });
};

export const showAxiosSuccessEnquebar = (message) => {
    if (typeof message === 'string') {
        enqueueSnackbar(message, {
            style: {
                borderRadius: '10px'
            },
            preventDuplicate: true,
            variant: 'success',
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            }
        });
    }
};

export const showAxiosInfoEnquebar = (message) => {
    if (typeof message === 'string') {
        enqueueSnackbar(message, {
            style: {
                borderRadius: '10px'
            },
            preventDuplicate: true,
            variant: 'info',
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            }
        });
    }
};

export const sanitizeSearchString = (searchString) => {
    const searchSanitization = {
        isValid: false,
        sanitizedSearch: searchString
    };

    if (typeof searchString === 'string' && searchString.replace(/^[^a-zA-Z0-9]+/, '').replaceAll('/', '') !== '') {
        searchSanitization['isValid'] = true;
        searchSanitization['sanitizedSearch'] = encodeURIComponent(searchString.replace(/^[^a-zA-Z0-9]+/, '').replaceAll('/', ''));
    }

    return searchSanitization;
};

export const checkIfPageInvalid = (count, rowsPerPage, page) => {
    const lastPossiblePageFloat = count / rowsPerPage - 1;
    const lastPossiblePage = Math.ceil(lastPossiblePageFloat);

    return { isInvalid: page > lastPossiblePage, lastPossiblePage };
};

export const getWeekdayAbbreviation = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekdays[date.getDay()];
};

export const formatDate = (date) => {
    return date ? format(date, 'yyyy-MM-dd') : null;
};

export const formatDateWithSuffix = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const suffix = (d) => {
        if (d > 3 && d < 21) return 'th'; // 4th to 20th
        switch (d % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };

    return `${day}${suffix(day)} ${month} ${year}`;
};

export function a11yProps(index, tabName) {
    return {
        id: `${tabName}-${index}`,
        'aria-controls': `${tabName}-tabpanel-${index}`
    };
}
