import { Box, Typography } from '@mui/material';
import { useOtherAttachmentsContext } from 'contexts/OtherAttachmentsContext';
import PropTypes from 'prop-types';

const OtherAttachmentsColumn = ({ otherAttachmentValueIds }) => {
    const { itemsMap } = useOtherAttachmentsContext();

    if (!otherAttachmentValueIds || otherAttachmentValueIds.length === 0) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: 0.5,
                minWidth: '150px',
                height: '100%',
                p: 1
            }}
        >
            {otherAttachmentValueIds.map((id) => (
                <Typography key={id} fontSize={12}>
                    {itemsMap.get(id)?.label}
                </Typography>
            ))}
        </Box>
    );
};

OtherAttachmentsColumn.propTypes = {
    otherAttachmentValueIds: PropTypes.array.isRequired
};
export default OtherAttachmentsColumn;
