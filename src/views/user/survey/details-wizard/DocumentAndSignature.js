import PropTypes from 'prop-types';
import { Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { recordSchema } from 'types';
import SignatureCanvas from 'react-signature-canvas';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import RestartAltTwoToneIcon from '@mui/icons-material/RestartAltTwoTone';
import { LoadingButton } from '@mui/lab';
import { FormattedMessage, useIntl } from 'react-intl';

const DocumentAndSignature = ({ handleBack, handleNext, recordData }) => {
    const theme = useTheme();
    const intlHook = useIntl();
    const recordDataValidated = recordSchema.cast(recordData.data);

    const [images, setImages] = useState([]);
    const sigCanvasRef = useRef(null); // Ref to access the SignatureCanvas instance
    const [isPreview, setIsPreview] = useState(false); // Track whether to show the preview
    const [signatureImage, setSignatureImage] = useState(''); // Store the signature as an image
    const [signatureRemark, setSignatureRemark] = useState('');
    const [changeRequested, setChangeRequested] = useState(false);

    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    const [recordDataServer, setRecordDataServer] = useState({
        isLoaded: false,
        infoExists: false,
        existingImages: [],
        existingSignature: {}
    });

    console.log(recordDataServer.existingImages);

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

    const onDrop = (acceptedFiles) => {
        const newImages = acceptedFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                remark: '',
                id: file.name + file.lastModified
            })
        );
        setImages((prevImages) => [...prevImages, ...newImages]);
    };

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleRemarkChange = (index, remark) => {
        const updatedImages = [...images];
        updatedImages[index].remark = remark; // Update remark for specific image
        setImages(updatedImages);
    };

    const maxDropzoneFiles = 5 - (recordDataServer.existingImages.length + images.length);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/bmp': [],
            'image/webp': []
        },
        onDrop,
        multiple: true,
        maxFiles: maxDropzoneFiles
    });

    useEffect(() => {
        return () => images.forEach((image) => URL.revokeObjectURL(image.preview));
    }, [images]);

    // Handle preview mode toggle
    const handlePreview = () => {
        try {
            if (!isPreview) {
                if (!sigCanvasRef.current.isEmpty()) {
                    const imageURL = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
                    setSignatureImage(imageURL);
                } else {
                    throw new Error('Signature is required');
                }
            }
            setIsPreview(!isPreview);
        } catch (error) {
            showAxiosErrorEnquebar(error);
        }
    };

    // Handle clearing the canvas
    const clearCanvas = () => {
        sigCanvasRef.current.clear();
    };

    const handleSave = async () => {
        setIsFormSubmitting(true);
        try {
            const signatureValidationFailed =
                (recordDataServer.existingSignature?.fileName && changeRequested && !signatureImage) ||
                (!recordDataServer.existingSignature?.fileName && !signatureImage);

            if (recordDataServer.existingImages.length + images.length < 1) {
                throw new Error('Minimum 1 documents need to be uploaded');
            }
            if (recordDataServer.existingImages.length + images.length > 5) {
                throw new Error('Maximum 5 documents can be uploaded');
            }
            if (signatureValidationFailed) {
                throw new Error('Signature is required');
            }

            const filesWithRemarks = images.map((image) => ({
                file: image, // The actual file object (e.g., from a dropzone or input element)
                remark: image.remark // The corresponding remark for the file
            }));

            const signatureResponse = await fetch(signatureImage);
            const blob = await signatureResponse.blob();

            // Create a new FormData object
            const formData = new FormData();

            formData.append('RecordId', recordDataValidated.recordId);

            // Loop over the files and append each file and its remark (description) to the FormData
            filesWithRemarks.forEach((fileWithRemark, index) => {
                formData.append(`Documents[${index}].DocumentFile`, fileWithRemark.file); // Append the image file to the documents array
                formData.append(`Documents[${index}].Description`, fileWithRemark.remark); // Append the corresponding description (remark)
            });

            if (signatureImage) {
                formData.append('Signature.SignatureFile', blob, 'signature.png');
                formData.append(`Signature.Description`, signatureRemark);
            }

            await axiosExtended.post(`${process.env.REACT_APP_API_URL}/Document/UploadMultipleDocuments`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Important to set the correct content type
                }
            });

            showAxiosSuccessEnquebar(
                recordDataServer.infoExists
                    ? 'Document and Signature data updated successfully.'
                    : 'Document and Signature data uploaded successfully.'
            );

            fetchDocumentAndSignature();

            setImages([]);
            setChangeRequested(false);
        } catch (error) {
            showAxiosErrorEnquebar(error);
        } finally {
            setIsFormSubmitting(false);
        }
    };

    const handleDeleteDocument = async (documentId) => {
        try {
            const updatedExistingImages = recordDataServer.existingImages.filter(
                (existingImage) => existingImage.documentId !== documentId
            );

            setRecordDataServer((previousState) => {
                return { ...previousState, existingImages: updatedExistingImages };
            });

            let config = {
                method: 'delete',
                url: `${process.env.REACT_APP_API_URL}/Document/${documentId}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            await axiosExtended.request(config);
        } catch (error) {
            showAxiosErrorEnquebar(error);
        }
    };

    const handleSignatureRemarkChange = (value) => {
        setSignatureRemark(value);
    };

    const handleChangeSignature = () => {
        setChangeRequested(true);
        setIsPreview(false);
        setSignatureRemark('');
    };

    return (
        <>
            {recordDataServer.existingImages.length > 0 && (
                <>
                    <Typography variant={'h5'} fontSize={'20px'} mt={3}>
                        <FormattedMessage id={'Uploaded-Documents'} />
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
                                    border: '2px solid #ddd',
                                    p: 1
                                }}
                            >
                                {recordDataServer.existingImages.length > 1 && (
                                    <IconButton
                                        size="medium"
                                        sx={{
                                            borderRadius: '10px',
                                            position: 'absolute',
                                            top: -10,
                                            right: -10,
                                            color: 'white',
                                            backgroundColor: theme.palette.secondary.main,
                                            p: '2px'
                                        }}
                                        onClick={() => handleDeleteDocument(existingImage.documentId)}
                                    >
                                        <CloseIcon fontSize="medium" />
                                    </IconButton>
                                )}
                                <img
                                    src={existingImage.fileUrl}
                                    alt="File Preview"
                                    style={{ border: '1px solid #ccc', width: '100%', height: '150px' }}
                                />
                                <Typography sx={{ wordWrap: 'break-word' }}>{existingImage.description}</Typography>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            <Typography variant={'h5'} fontSize={'20px'} mt={2}>
                <FormattedMessage id={'Documents'} />
            </Typography>
            {/* Image Previews */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2, width: '100%' }}>
                {images.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            mt: 2,
                            justifyContent: 'center',
                            width: { xs: '100%', sm: 'unset' }
                        }}
                    >
                        {images.map((file, index) => (
                            <Box
                                key={file.id}
                                sx={{
                                    position: 'relative',
                                    width: 150,
                                    borderRadius: '10px',
                                    overflow: 'visible',
                                    border: '2px solid #ddd',
                                    p: 1
                                }}
                            >
                                {/* Cross icon to remove image */}

                                <IconButton
                                    size="medium"
                                    sx={{
                                        borderRadius: '10px',
                                        position: 'absolute',
                                        top: -10,
                                        right: -10,
                                        color: 'white',
                                        backgroundColor: theme.palette.secondary.main,
                                        p: '2px'
                                    }}
                                    onClick={() => removeImage(index)}
                                >
                                    <CloseIcon fontSize="medium" />
                                </IconButton>
                                <img src={file.preview} alt={file.name} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />

                                {/* Remark TextField */}
                                <TextField
                                    placeholder="Remark"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={file.remark}
                                    onChange={(e) => handleRemarkChange(index, e.target.value)}
                                    sx={{ mt: 1 }}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
                {recordDataServer.existingImages.length + images.length > 4 && (
                    <Box sx={{ display: 'flex', width: '100%', height: 70, justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant={'caption'} fontSize={'14px'}>
                            Maximum document limit reached
                        </Typography>
                    </Box>
                )}
                {recordDataServer.existingImages.length + images.length < 5 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, width: { xs: '100%', sm: 'unset' } }}>
                        {/* Dropzone Add Button */}
                        <Box
                            {...getRootProps()}
                            sx={{
                                width: { xs: '100%', sm: 'unset' },
                                backgroundColor: theme.palette.secondary.main + '30',
                                p: 2,
                                borderRadius: '15px',
                                textAlign: 'center'
                            }}
                        >
                            <input {...getInputProps()} />
                            <IconButton color="secondary" component="span" size="large">
                                <AddIcon fontSize="large" />
                            </IconButton>
                            <Typography color={'secondary'} sx={{ m: 1 }}>
                                Click or drag &apos; n &apos; drop images here
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            <Typography variant={'h5'} fontSize={'20px'} mt={3}>
                <FormattedMessage id={'Signature'} />
            </Typography>
            {recordDataServer.existingSignature?.fileName && !changeRequested ? (
                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: { xs: '90%', sm: 380 },
                            borderRadius: '10px',
                            overflow: 'visible',
                            border: '2px solid #ddd',
                            p: 1
                        }}
                    >
                        <IconButton
                            size="medium"
                            sx={{
                                borderRadius: '10px',
                                position: 'absolute',
                                top: -10,
                                right: -10,
                                color: 'white',
                                backgroundColor: theme.palette.secondary.main,
                                p: '2px'
                            }}
                            onClick={handleChangeSignature}
                        >
                            <RestartAltTwoToneIcon fontSize="medium" />
                        </IconButton>
                        <img
                            src={recordDataServer.existingSignature.fileUrl}
                            alt="Signature Preview"
                            style={{ border: '1px solid #ccc', width: '100%', height: '200px' }}
                        />
                        <TextField
                            disabled
                            fullWidth
                            placeholder={intlHook.formatMessage({ id: 'Name-of-Respondent' })}
                            variant="outlined"
                            size="small"
                            value={recordDataServer.existingSignature.description}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Box>
            ) : (
                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                    {isPreview ? (
                        // If preview mode, show the image preview
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <img
                                src={signatureImage}
                                alt="Signature Preview"
                                style={{ border: '1px solid #ccc', width: '300px', height: '200px' }}
                            />
                            <TextField
                                disabled
                                placeholder={intlHook.formatMessage({ id: 'Name-of-Respondent' })}
                                variant="outlined"
                                size="small"
                                value={signatureRemark}
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    ) : (
                        // Show the Signature Canvas when not in preview mode
                        <Box border="2px solid #ccc" borderRadius={'10px'} sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
                            <SignatureCanvas
                                ref={sigCanvasRef}
                                canvasProps={{ width: 250, height: 200, className: 'sigCanvas' }}
                                backgroundColor="#f5f5f5"
                                penColor="black"
                            />

                            <TextField
                                placeholder={intlHook.formatMessage({ id: 'Name-of-Respondent' })}
                                variant="outlined"
                                size="small"
                                value={signatureRemark}
                                onChange={(e) => handleSignatureRemarkChange(e.target.value)}
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    )}

                    <Box mt={2} display="flex" gap={2}>
                        {/* Button to toggle between preview and edit mode */}
                        <Button variant="contained" color="secondary" onClick={handlePreview}>
                            {isPreview ? <FormattedMessage id={'Edit'} /> : <FormattedMessage id={'Preview'} />}
                        </Button>

                        {/* Clear button to reset the canvas */}
                        {!isPreview && (
                            <Button variant="outlined" color="secondary" onClick={clearCanvas}>
                                <FormattedMessage id={'Clear'} />
                            </Button>
                        )}
                    </Box>
                </Box>
            )}

            <LoadingButton
                loading={isFormSubmitting}
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={() => handleSave()}
            >
                <FormattedMessage id={'Save'} />
            </LoadingButton>
            <Grid container sx={{ justifyContent: 'space-between', mt: 2 }} spacing={1}>
                <Grid item>
                    <AnimateButton>
                        <Button onClick={handleBack} variant="contained" startIcon={<ArrowBackIcon />} color="secondary">
                            <FormattedMessage id={'Previous'} />
                        </Button>
                    </AnimateButton>
                </Grid>
                <Grid item>
                    <AnimateButton>
                        <Button
                            sx={{ minWidth: 130 }}
                            onClick={
                                recordDataServer.infoExists
                                    ? handleNext
                                    : () => showAxiosErrorEnquebar(new Error('Please complete this step to continue'))
                            }
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            color="secondary"
                        >
                            <FormattedMessage id={'Next'} />
                        </Button>
                    </AnimateButton>
                </Grid>
            </Grid>
        </>
    );
};

DocumentAndSignature.propTypes = {
    handleNext: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    recordData: PropTypes.object.isRequired
};

export default DocumentAndSignature;
