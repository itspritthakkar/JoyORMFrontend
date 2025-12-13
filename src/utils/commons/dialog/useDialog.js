import { Typography } from '@mui/material';
import { useState, useCallback } from 'react';

export function useDialog(staticConfig) {
    if (!staticConfig) {
        staticConfig = { content: <Typography color={'error'}>Config not defined</Typography> };
    }
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = useCallback(() => {
        setIsOpen(true);
    }, []);

    const closeDialog = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        openDialog,
        closeDialog,
        config: staticConfig
    };
}
