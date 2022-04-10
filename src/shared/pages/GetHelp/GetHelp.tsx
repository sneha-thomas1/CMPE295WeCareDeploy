/*global google*/
import React, { Component, useRef, useEffect, useState, FunctionComponent } from 'react';
import { Helmet } from 'react-helmet-async';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

import { connect } from 'react-redux';
import { Box, Grid,
Container,
Typography,Card,
CardContent,TextField,
InputAdornment,CardActions,
SvgIcon,Button, CardMedia, IconButton,MenuItem
} from '@material-ui/core';
import {
    Search as SearchIcon,
    Navigation as NavigationIcon,
    Globe as CircleIcon,
    Share as ShareIcon,
    Star as FavouriteIcon
} from 'react-feather';
import axios from 'axios';
// { withScriptjs, withGoogleMap, GoogleMap, Marker,DirectionsRenderer,InfoWindow  } from "react-google-maps";
import emailjs from '@emailjs/browser';
import{ init } from '@emailjs/browser';
init("Tf7lGE0yewFvOLxah");

//import GoogleMapComponent from '../../components/gethelp/GoogleMapComponent'

import { GoogleMap, useJsApiLoader,Marker ,DirectionsRenderer } from '@react-google-maps/api';
const containerStyle = {
    width: '500px',
    height: '900px'
  };
  
  const center = {
    lat: 37.318400,
    lng: -121.8381589
  };
const GetHelp : FunctionComponent<any> = ({userProfileReducer,...props }) => {
  const UserId = userProfileReducer._id;
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(10);
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [miles, setMiles] = useState('45');
    const [currentloc, setCurrentloc] = useState(null);//"2239 McLaughlin Ave,San Jose,95122"
    const [directions,setDirections]= useState(null);
    const [open, setOpen] = React.useState(false);
    const [resource, setResource] = React.useState(null);
    const [datafilter,setDataFilter]=React.useState("all");
    const [data, setData] = useState(null);
    const [quantity,setQuantity]=useState(null);
    let origin = {};
    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

   
    useEffect(() => {
        //const id = props?.match?.params?.id;
       // alert(props.location.state.datafilter);
       const filter_value=props?.match?.params?.datafilter;
       setDataFilter(filter_value.substring(filter_value.indexOf(':') + 1));
       
        
        axios
            .get('/api/gethelp', { params: {type:'pageload',datafilter:filter_value.substring(filter_value.indexOf(':') + 1)} }) //change later
            .then(
                (response) => {
                    console.log(response);
                    setData(response.data.resources);
                    //console.log(response.data.resources);
                    setCity(response.data.user_currentcity);
                    setCurrentloc(response.data.user_currentaddress)
                    
                
                    //console.log(user_loc);
                },
                (error) => {
                    console.log(error);
                    setError(error);
                }
            );
    }, []);
    //if (loading) return "Loading...."
    //if (error) return "Error"
    
    const handleChangeName = (event) => {
        setName(event.target.value)
    };
    const handleChangeCity = (event) => {

        setCity(event.target.value);
    };
    const handleChangeMiles = (event) => {
        setMiles(event.target.value);
        
    };
    //state = {moduleid, moduletype, modulename, duration};
    
    const handleSearch= (event) => {
        event.preventDefault();
        //console.log("inside button fn");
        axios
        .get('/api/gethelp', { params: { name: name , miles : miles, city :city,datafilter:datafilter,type:'button'} }) 
        .then(
            (response) => {
                //console.log(response);
                setData(response.data.resources);
               //setCity(response.data.user_currentcity)
                //console.log(user_loc);
            },
            (error) => {
                console.log(error);
                setError(error);
            }
        );
    };
    

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCW3O6PQctDxoSoSNYWVa44nXc1ze4V-Nw"
      })
    
      const [map, setMap] = React.useState(null)
    
      const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
      }, [])
    
      const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
      }, [])
    
      //function that is calling the directions service
     const getDirections = (resource) => {
        const directionsService = new google.maps.DirectionsService();
       let destination=resource.address;
       //let origin="2239 McLaughlin Ave,San Jose,95122"
      // console.log(destination);
      // console.log(currentloc);
    if (origin !== null && destination !== null) {
        directionsService.route(
          {
            origin: currentloc,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              //changing the state of directions to the result of direction service
            
                setDirections(result);//setShow(true);
            
            } else {
              console.error(`error fetching directions ${result}`);
            }
          }
        );
    }
      };
          
       

         const handleClose = () => {
            setOpen(false);
          };  
        const handleClickOpen = (resource) => {

            setOpen(true);
           // console.log(resource.SKU);
           setResource(resource);
          };
        
          
          const handleItemQuantityChange=(event)=> {
           /* if (event.target.value<1){
              console.log("Quantity cannot be less than 1");
            }
            else if (event.target.value>=){
              console.log("Maximum available quantity is "+resource.SKU);
            }
            else{
              setQuantity(event.target.value);
            }
            */
           
         }   

         let state = { feedback: '', name: 'Name',to_email:"sneha.thomas@sjsu.edu"};
  
    
      
    
   
    
      const sendEmail = (templateId, variables) => {
        emailjs.send(
          'service_wgfnh0b', templateId,
          variables
          ).then(res => {
            console.log('Email successfully sent!')
          })
          .catch(err => console.error('Oh well, you failed. Here some thoughts on the error that occured:', err))
      }
    
         const handleConfirm = (event) => {
            
            setOpen(false);
          const templateId = 'template_v9fkqmy';
    
        sendEmail(templateId, {message_html: "email body", from_name: state.name})
           
           axios
           .post('/api/gethelp', {resource:resource,user_id:"test"}) //change later
           .then(
               (response) => {
                  // console.log(response);
                   
                   //console.log(user_loc);
               },
               (error) => {
                   console.log(error);
                   setError(error);
               }
           );
         }; 
         

         const handleRadioChange = (event) => {
           setDataFilter(event.target.value);
         };  
    
    return(
   <>
        <Helmet>
            <title>GetHelp | WeCare</title>
        </Helmet>
 <Box
            sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
                py: 3,
            }}
        >
            <Container maxWidth={false}>
    <Box {...props}>
       
        <Box sx={{ mt: 3 }}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', maxWidth: 1200 }}>
                        <Box sx={{ maxWidth: 700 }}>
                       <span>        </span> <RadioGroup row 

defaultValue="all"
value={datafilter}
onChange={handleRadioChange}
>
<FormControlLabel value="all" control={<Radio />} label="All" />
<FormControlLabel value="resources" control={<Radio />} label="Resources" />
<FormControlLabel value="services" control={<Radio />} label="Services" />
                        </RadioGroup><br />
                            <TextField
                                style={{ width: 600 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SvgIcon fontSize="small" color="action">
                                                <SearchIcon />
                                            </SvgIcon>
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder="Search resource/service"
                                value={name}
                                variant="outlined"
                                onChange={handleChangeName}
                            />
                            <br />
                            <br />
                            <TextField
                                style={{ width: 300 }}
                                //fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SvgIcon fontSize="small" color="action">
                                                <NavigationIcon />
                                            </SvgIcon>
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder="Search within City"
                                value={city}
                                variant="outlined"
                                
                                onChange={handleChangeCity}
                            />
                            <span> </span>
                            <TextField
                                style={{ width: 300 }}
                                //fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SvgIcon fontSize="small" color="action">
                                                <CircleIcon />
                                            </SvgIcon>
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder="Search within miles"
                                value={miles}
                                variant="outlined"
                                onChange={handleChangeMiles}
                            />
                            
                            <br />
                            <br />            
                           
                           
                            
 
                        </Box>
                        <Box sx={{ display: 'flex', width: 200, alignItems: 'center' }}>
                            <br />
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <br />
                            <br />
                            <br />
                            <Button
                                style={{ width: 150, height: 50 }}
                                color="primary"
                                variant="contained"
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            
        </Box>
    </Box>
    <Grid container spacing={2}>
    <Grid item xs={6}>
    <Box sx={{ pt: 3 }}>
    {data != null && datafilter!=null ?(
    <Grid container spacing={2}>
   {data.map((resource) => (
    <Grid item xs={6} key={resource._id}>
        <Card>
            <CardMedia
        component="img"
        height="140"
        image="/static/images/avatars/resource.jpg"
        alt={resource.Name}
      />
                <CardContent>
        <Typography  gutterBottom variant="h5" component="div">
        {resource.Name}
        </Typography>
        <Typography  variant="body2" color="text.secondary">
        {resource.Description}
        </Typography> 
        <Typography variant="body2" color="text.secondary">
        {resource.type != "resource" ? ("Available on " +resource.availableDate) :(resource.SKU)+" item(s) available"}
        </Typography>
        <Typography   variant="body2" color="text.secondary">
            {resource.distance+"miles"}</Typography>
        <Typography  variant="body2" color="text.secondary">
        {resource.address}
        <Button style={{ marginLeft: "none",textTransform: 'none' }} onClick={() => getDirections(resource)}>Show Direction</Button></Typography>
        
      </CardContent>
      <CardActions>
        <Button size="large" onClick={() => handleClickOpen(resource)}>Reserve</Button>
     
        <Box style={{ marginLeft: "auto" }}>
        <IconButton ><FavouriteIcon color="blue" size={18} /></IconButton>
        <IconButton ><ShareIcon color="blue" size={18}  /></IconButton></Box>
      </CardActions>
      
                
                    </Card>
                    </Grid>))}
                    </Grid>):null}
                </Box></Grid>
                <Grid item xs={6}>
                <Box paddingTop={3}>
                
               { isLoaded ? (

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
          {currentloc !== null && (<Marker  title="Your current location" key="marker_1" position={currentloc} />)}
          {data != null ? (data.map((resource) => (<Marker title={resource.Name} key={resource._id} position={resource.location} />))):null}
        { /* Child components, such as markers, info windows, etc. */ }
        {directions !== null && (
                <DirectionsRenderer
                  directions={directions}
                  defaultOptions={{
                    suppressMarkers: true
                  }}
                />
                
              )}
        <></>
      </GoogleMap>
  ) : <></>}
              
          </Box>
          </Grid></Grid><Dialog open={open} onClose={handleClose}  
  maxWidth="lg">
        <DialogTitle variant="h3" color=" darkblue">GetHelp:Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText component="span">
          <div>&nbsp; <br/> </div>
          {resource != null ? (
            <Card sx={{ display: 'flex' }} style={{ border: "none", boxShadow: "none" }}>
            <CardMedia
        component="img"
        height="300" 
        sx={{ width:300 }}
        image="/static/images/avatars/resource.jpg"
        alt={resource.Name}
      />
                <CardContent>
                   
                  
        <TextField
           InputLabelProps={{style : {color : 'blue'} }}
           id="standard-read-only-input"
           label="Name"
           InputProps={{
             readOnly: true,
           }}
           variant="standard"
          defaultValue= {resource.Name}
          sx={{  width: '41ch' }}
        />
        <br /><br />
       { resource.type != "resource" ? <TextField
           InputLabelProps={{style : {color : 'blue'} }}
           id="standard-read-only-input"
           label="Name"
           InputProps={{
             readOnly: true,
           }}
           variant="standard"
          defaultValue= {resource.availableDate}
          sx={{  width: '41ch' }}
        />:
       <TextField
          id="standard-number"
          label="Quantity"
          type="number"
          InputLabelProps={{
            shrink: true,style : {color : 'blue'},
          }}
          InputProps={{
            inputProps: {
              type: 'number',
              min: 1
            },
          }}
          variant="standard"
          defaultValue= {resource.SKU}
          helperText="Update required quantity"
          sx={{  width: '41ch' }}
          onChange={handleItemQuantityChange}
        />}
        <br /><br />
        <TextField
        InputLabelProps={{style : {color : 'blue'} }}
            id="standard-read-only-input"
            label="Description"
            InputProps={{
              readOnly: true,
            }}
            variant="standard"
          defaultValue= {resource.Description}
          sx={{  width: '41ch' }}
        />
        <br /><br />
        <TextField
        InputLabelProps={{style : {color : 'blue'} }}
          id="standard-read-only-input"
          label="Address"
          defaultValue={resource.address}
          InputProps={{
            readOnly: true,
          }}
          variant="standard"
          sx={{  width: '41ch' }}
        />
       
      </CardContent>
     
                    </Card>):null}
                    <br/>
An email notification with further details will be send to {"abc@gmail.com"} once you confirm the reservation.
          </DialogContentText>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button autoFocus onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
            </Container>
        </Box>
    </>
);

        };


        const mapStateToProps = ({ userProfileReducer }) => ({
          userProfileReducer,
      });
      
      const mapDispatchToProps = {};
      
      const ConnectedGetHelp = connect(mapStateToProps, mapDispatchToProps)(GetHelp);
      export default ConnectedGetHelp;       

