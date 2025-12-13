import { LoadingButton } from '@mui/lab';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

const GenericDialog = ({ isOpen, onClose, title, children, actions, fullWidth = true, maxWidth = 'sm' }) => {
    const [loadingIdx, setLoadingIdx] = useState(-1);
    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth}>
            {title && <DialogTitle>{title}</DialogTitle>}

            <DialogContent dividers>{children}</DialogContent>

            <DialogActions>
                {actions?.map((action, idx) => (
                    <LoadingButton
                        loading={loadingIdx === idx}
                        key={idx}
                        variant={action.variant || 'contained'}
                        color={action.color || 'primary'}
                        onClick={async () => {
                            setLoadingIdx(idx);
                            if (action.onClick) {
                                await action.onClick();
                            }
                            setLoadingIdx(-1);
                        }}
                    >
                        {action.label}
                    </LoadingButton>
                ))}
            </DialogActions>
        </Dialog>
    );
};

GenericDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            variant: PropTypes.string,
            color: PropTypes.string
        })
    ),
    fullWidth: PropTypes.bool,
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};
export default GenericDialog;
