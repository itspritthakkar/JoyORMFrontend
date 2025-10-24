import PropTypes from 'prop-types';
import { AppBar, Box, Button, Dialog, Grid, Slide, TextField, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useTheme } from '@mui/material/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import { recordSchema } from 'types';
import { appendSearchParams, showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import axiosExtended from 'utils/axios';
import { LoadingButton } from '@mui/lab';
import ErrorAnimation from '../../../../assets/animations/error-animation.json';
import LocationLoadingAnimation from '../../../../assets/animations/location-loading-animation.json';
import Lottie from 'lottie-react';
import DirectionsIcon from '@mui/icons-material/Directions';
import { FormattedMessage } from 'react-intl';

const libraries = ['places'];

const mapsKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const addMoveToCurrentLocationButton = (map, moveToCurrentLocation) => {
    const buttonDiv = document.createElement('div');
    buttonDiv.style.marginInline = '10px';

    const button = document.createElement('button');

    // Set the tooltip text
    button.title = 'Move to current location';

    // Set up the button icon to mimic Google's location icon
    button.innerHTML = `<span style="display: inline-flex; align-items: center;">
        <svg height="24px" width="24px" viewBox="0 0 24 24" fill="#fff">
            <circle cx="12" cy="12" r="8" stroke="#fff" stroke-width="2" fill="none" />
            <circle cx="12" cy="12" r="2" fill="#fff" />
        </svg>
    </span>`;

    // Default button styles
    button.style.backgroundColor = '#1976d2';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '8px';
    button.style.borderRadius = '20%';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.3)';

    // Make the button mobile-friendly
    button.style.width = 'fit-content';

    // Assign the action for moving to the current location
    button.onclick = moveToCurrentLocation;

    buttonDiv.appendChild(button);
    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(buttonDiv);
};

const PropertyLocation = ({ handleBack, recordData }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const recordDataValidated = recordSchema.cast(recordData.data);

    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    const [completedDialogOpen, setCompletedDialogOpen] = useState(false);

    const [recordDataServer, setRecordDataServer] = useState({
        isLoaded: false,
        infoExists: false
    });

    const [locationPermissionStatus, setLocationPermissionStatus] = useState('prompt');

    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    const [userLocation, setUserLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const mapRef = useRef(null);

    const [searchInput, setSearchInput] = useState('');
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: mapsKey, // Replace with your Google Maps API key
        libraries
    });

    const inputRef = useRef(null);

    // Check for location permission status
    const checkLocationPermission = async () => {
        if (navigator.permissions) {
            try {
                const permission = await navigator.permissions.query({ name: 'geolocation' });
                setLocationPermissionStatus(permission.state);
                permission.onchange = () => setLocationPermissionStatus(permission.state); // Track changes
            } catch (error) {
                console.error('Permission API not supported', error);
            }
        } else {
            console.error('Permissions API is not supported by your browser.');
        }
    };

    const getLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    let initialPosition = { lat: latitude, lng: longitude };
                    setUserLocation(initialPosition);
                    if (recordDataValidated.latitude && recordDataValidated.longitude) {
                        initialPosition = { lat: recordDataValidated.latitude, lng: recordDataValidated.longitude };
                        setRecordDataServer((previousState) => {
                            return { ...previousState, isLoaded: true, infoExists: true };
                        });
                    } else {
                        setRecordDataServer((previousState) => {
                            return { ...previousState, isLoaded: true };
                        });
                    }
                    setCurrentLocation(initialPosition);
                    setMarkerPosition(initialPosition); // Set initial marker position
                    setLocationPermissionStatus('granted');
                },
                (error) => {
                    console.error('Error fetching location');
                    if (error.code === error.PERMISSION_DENIED) {
                        setLocationPermissionStatus('denied');
                    }
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }, [recordDataValidated.latitude, recordDataValidated.longitude]);

    useEffect(() => {
        checkLocationPermission();
        getLocation();
    }, [getLocation]);

    const handleMapClick = (event) => {
        setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    };

    const handleMarkerDragEnd = (event) => {
        setMarkerPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    };

    const handleAddressChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSubmit = async () => {
        setIsFormSubmitting(true);
        const position = markerPosition || currentLocation;

        try {
            if (!position) {
                showAxiosErrorEnquebar('Location invalid');
                return;
            }

            const rawData = {
                latitude: position.lat,
                longitude: position.lng
            };

            let config = {
                method: 'put',
                url: `${process.env.REACT_APP_API_URL}/Records/Location/${recordDataValidated.recordId}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(rawData)
            };
            await axiosExtended.request(config);

            setCurrentLocation(position);

            setRecordDataServer((previousState) => {
                return { ...previousState, infoExists: true };
            });

            showAxiosSuccessEnquebar('Location updated successfully');
        } catch (error) {
            showAxiosErrorEnquebar(error);
        } finally {
            setIsFormSubmitting(false);
        }
    };

    const handleAddressSelect = () => {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const { location } = place.geometry;
                const newPosition = { lat: location.lat(), lng: location.lng() };
                setMarkerPosition(newPosition); // Set marker position to the new location
                setCurrentLocation(newPosition); // Update map center to the new location
            } else {
                alert('No details available for input: ' + searchInput);
            }
        });
    };

    const handleFinish = async () => {
        setCompletedDialogOpen(true);

        if (recordDataServer.infoExists && recordDataValidated.status.toLowerCase() == 'active') {
            let url = `${process.env.REACT_APP_API_URL}/Records/Status/${recordDataValidated.recordId}`;

            const searchParams = {
                status: 'Completed'
            };

            url = appendSearchParams(url, searchParams);

            let recordConfig = {
                method: 'put',
                url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            await axiosExtended.request(recordConfig);
        } else {
            let url = `${process.env.REACT_APP_API_URL}/Records/${recordDataValidated.recordId}/mark-resurvey-done`;

            let recordConfig = {
                method: 'put',
                url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            await axiosExtended.request(recordConfig);
        }
    };

    const handleCloseCompletedDialog = () => {
        setCompletedDialogOpen(false);
    };

    const handleStartNewSurvey = () => {
        handleCloseCompletedDialog();
        navigate('/app/survey');
    };

    const moveToCurrentLocation = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.panTo(userLocation);
            setMarkerPosition(userLocation);
        } else {
            alert('User location not available.');
        }
    };

    const onLoad = (map) => {
        mapRef.current = map;
        addMoveToCurrentLocationButton(map, moveToCurrentLocation);

        map.setZoom(18);
    };

    if (locationPermissionStatus === 'prompt' || locationPermissionStatus === 'denied') {
        return (
            <>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Lottie animationData={ErrorAnimation} loop={false} />
                    {locationPermissionStatus === 'prompt' ? (
                        <Typography sx={{ textAlign: 'center' }}>Location permission denied</Typography>
                    ) : (
                        <Typography sx={{ textAlign: 'center' }}>
                            Location access is blocked. Please enable location permissions in your browser settings.
                        </Typography>
                    )}
                    {locationPermissionStatus === 'prompt' && (
                        <Button variant="contained" color="secondary" onClick={getLocation} sx={{ mt: 2 }}>
                            Request Location Access
                        </Button>
                    )}
                </Box>

                <Grid container sx={{ mt: 2 }} spacing={1}>
                    <Grid item>
                        <AnimateButton>
                            <Button onClick={handleBack} variant="contained" startIcon={<ArrowBackIcon />} color="secondary">
                                Previous
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </>
        );
    }

    if (!isLoaded || !recordDataServer.isLoaded)
        return (
            <>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Lottie animationData={LocationLoadingAnimation} loop={true} />
                </Box>
                <Grid container sx={{ mt: 2 }} spacing={1}>
                    <Grid item>
                        <AnimateButton>
                            <Button onClick={handleBack} variant="contained" startIcon={<ArrowBackIcon />} color="secondary">
                                Previous
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </>
        );

    return (
        <>
            <Box sx={{ width: '100%', height: '500px', mt: 2 }}>
                <TextField
                    label={<FormattedMessage id={'Search-Address'} />}
                    variant="outlined"
                    fullWidth
                    value={searchInput}
                    onChange={handleAddressChange}
                    onFocus={handleAddressSelect}
                    inputRef={inputRef}
                    sx={{ marginBottom: 2 }}
                />
                {currentLocation && (
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '75%' }}
                        zoom={15}
                        center={currentLocation}
                        onLoad={onLoad}
                        onClick={handleMapClick}
                        options={{
                            mapTypeId: 'hybrid', // <-- Enable Satellite View
                            streetViewControl: false
                        }}
                    >
                        {markerPosition && <Marker position={markerPosition} draggable={true} onDragEnd={handleMarkerDragEnd} />}
                    </GoogleMap>
                )}
                <Box sx={{ display: 'flex', width: '100%' }}>
                    <LoadingButton
                        fullWidth={matchDownMd}
                        loading={isFormSubmitting}
                        variant="contained"
                        color={'error'}
                        onClick={handleSubmit}
                        sx={{ marginTop: 2 }}
                        startIcon={<WhereToVoteIcon />}
                    >
                        {matchDownMd ? <FormattedMessage id={'Mark'} /> : <FormattedMessage id={'Mark-Location'} />}
                    </LoadingButton>
                    {currentLocation && (
                        <Button
                            fullWidth={matchDownMd}
                            variant="contained"
                            color={'primary'}
                            sx={{ marginLeft: 1, marginTop: 2 }}
                            startIcon={<DirectionsIcon />}
                            onClick={() =>
                                window.open(`https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`, '_blank')
                            }
                        >
                            <FormattedMessage id={'Directions'} />
                        </Button>
                    )}
                </Box>
                {/* Debug purposes only */}
                {/* {markerPosition && (
                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                        Marked Position - Latitude: {markerPosition.lat}, Longitude: {markerPosition.lng}
                    </Typography>
                )} */}
            </Box>
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
                                    ? handleFinish
                                    : () => showAxiosErrorEnquebar(new Error('Please complete this step to continue'))
                            }
                            variant="contained"
                            endIcon={<DoneAllIcon />}
                            color="secondary"
                        >
                            <FormattedMessage id={'Finish'} />
                        </Button>
                    </AnimateButton>
                </Grid>
            </Grid>
            <Dialog
                id={'completed-dialog'}
                fullScreen
                open={completedDialogOpen}
                onClose={handleCloseCompletedDialog}
                TransitionComponent={Transition}
                PaperProps={{ sx: { padding: 0, backgroundColor: 'background.default', overflowX: 'hidden', borderRadius: 0 } }}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: 'secondary.main' }}>
                    <Toolbar>
                        {/* <IconButton
                            id={'close-filters-dialog'}
                            edge="start"
                            color="inherit"
                            onClick={handleCloseFiltersDialog}
                            aria-label="close"
                            size="medium"
                        >
                            <CloseIcon />
                        </IconButton> */}
                        {/* <Typography
                            variant="h3"
                            color={theme.palette.mode === 'dark' ? theme.palette.grey[50] : theme.palette.background.paper}
                            sx={{ ml: 2, flex: 1 }}
                        >
                            Filters
                        </Typography> */}
                    </Toolbar>
                </AppBar>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        px: 5
                    }}
                >
                    <Box sx={{ fontSize: 150, mb: 2 }}>
                        <CheckCircleIcon fontSize={'inherit'} color="success" />
                    </Box>
                    <Typography variant={'h4'}>
                        <FormattedMessage id={'Record-submitted-successfully'} />
                    </Typography>
                    <Typography variant={'body1'} sx={{ mt: 1, textAlign: 'center' }}>
                        <FormattedMessage id={'Record-has-been-submitted-successfully'} />. <FormattedMessage id={'Refrence-number'} />{' '}
                        {recordDataValidated.recordId}
                    </Typography>
                    <Button variant={'contained'} color="secondary" sx={{ mt: 2 }} startIcon={<HomeIcon />} onClick={handleStartNewSurvey}>
                        <FormattedMessage id={'START-NEW-SURVEY'} />
                    </Button>
                </Box>
            </Dialog>
        </>
    );
};

PropertyLocation.propTypes = {
    handleNext: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    recordData: PropTypes.object.isRequired
};

export default PropertyLocation;
