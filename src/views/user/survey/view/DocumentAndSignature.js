import PropTypes from 'prop-types';
import { Box, Grid, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { recordSchema } from 'types';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import { useTheme } from '@mui/material/styles';

const DocumentAndSignature = ({ recordData }) => {
    const theme = useTheme();
    const recordDataValidated = recordSchema.cast(recordData.data);

    const [recordDataServer, setRecordDataServer] = useState({
        isLoaded: false,
        infoExists: false,
        existingImages: [],
        existingSignature: ''
    });

    const fetchDocumentAndSignature = useCallback(async () => {
        try {
            let config = {
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/Document/by-record/${recordDataValidated.recordId}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const docAndSignatureResponse = await axiosExtended.request(config);

            const docAndSignatureResponseData = docAndSignatureResponse.data;

            if (docAndSignatureResponseData.length > 0) {
                const existingImages = docAndSignatureResponseData.filter((das) => das.documentType === 'Document');
                const existingSignature = docAndSignatureResponseData.filter((das) => das.documentType === 'Signature')[0];

                setRecordDataServer((previousState) => {
                    return { ...previousState, isLoaded: true, infoExists: true, existingImages, existingSignature };
                });
            } else {
                setRecordDataServer((previousState) => {
                    return { ...previousState, isLoaded: true, infoExists: false };
                });
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setRecordDataServer((previousState) => {
                    return { ...previousState, isLoaded: true, infoExists: false };
                });
            } else {
                showAxiosErrorEnquebar(error);
            }
        }
    }, [recordDataValidated.recordId]);

    useEffect(() => {
        fetchDocumentAndSignature();
    }, [fetchDocumentAndSignature]);

    return (
        <>
            {(!recordDataServer.existingSignature ||
                recordDataServer.existingSignature == '' ||
                recordDataServer.existingImages.length == 0) && (
                <Grid container mt={3} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Grid item>
                        <Typography>Document/Signature data does not exist</Typography>
                    </Grid>
                </Grid>
            )}
            {recordDataServer.existingImages.length > 0 && (
                <>
                    <Typography variant={'h5'} fontSize={'20px'} mt={3}>
                        Uploaded Documents
                    </Typography>
                    <Box display="flex" flexWrap={'wrap'} gap={2} justifyContent={'center'} alignItems="center" mt={2}>
                        {recordDataServer.existingImages.map((existingImage) => (
                            <Box
                                key={existingImage.documentId}
                                sx={{
                                    position: 'relative',
                                    width: 150,
                                    borderRadius: '10px',
                                    overflow: 'visible',
                                    p: 1,
                                    backgroundColor: theme.palette.background.default
                                }}
                            >
                                <img
                                    src={existingImage.fileUrl}
                                    alt="File Preview"
                                    style={{ border: '1px solid #ccc', width: '100%', height: '150px' }}
                                />
                                <Typography sx={{ wordBreak: 'break-word' }}>{existingImage.description}</Typography>
                            </Box>
                        ))}
                    </Box>
                </>
            )}
            {recordDataServer.existingSignature && (
                <>
                    <Typography variant={'h5'} fontSize={'20px'} mt={3}>
                        Signature
                    </Typography>
                    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: { xs: '90%', sm: 380 },
                                borderRadius: '10px',
                                overflow: 'visible',
                                border: '2px solid #ddd',
                                p: 1,
                                backgroundColor: theme.palette.background.default
                            }}
                        >
                            <img
                                src={recordDataServer.existingSignature.fileUrl}
                                alt="Signature Preview"
                                style={{ border: '1px solid #ccc', width: '100%', height: '200px' }}
                            />
                            <Typography sx={{ wordBreak: 'break-word' }}>{recordDataServer.existingSignature.description}</Typography>
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
};

DocumentAndSignature.propTypes = {
    recordData: PropTypes.object.isRequired
};

export default DocumentAndSignature;
