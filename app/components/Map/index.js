import React from "react"
import StarRatings from 'react-star-ratings';
import { compose, withProps ,lifecycle} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps"
import { getMiles } from '../../utils/helper';
import {SearchBox} from 'react-google-maps/lib/components/places/SearchBox';
import _ from 'lodash';
import { connect } from 'react-redux';
import {getGyms,setFilters,getTrainers} from '../../containers/Search/actions';

const boxStyle = [
  { 'border': "5px solid red" },
  { 'textAlign': "center" },
  { 'fontSize': "8pt" },
  { 'width': "50px" }
];
function getGymType(gymTypes) {
  return gymTypes.map((gymType) => {
    return gymType.gymType
  }).toString()
}

function getTrainerType(trainerTypes) {
  return trainerTypes.map((trainerTypes) => {
    return trainerTypes.trainerType
  }).toString()
}

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAfgGPEBO_X_i21mt-1bii2ui8vvIiin08&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%`, width: `100%` }} />,
    mapElement: <div style={{ height: `100%`, }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        // center: {
        //   lat: 41.9, lng: -87.624
        // },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();
          
          places.forEach(place => {
            if (place.geometry.viewport) {
              const obj = {}
              obj.latitude = place.geometry.location.lat()
              obj.longitude = place.geometry.location.lng()
              obj.distanceValue = 50
              this.props.setFilters(obj)
              this.props.getGyms(obj) 
              bounds.union(place.geometry.viewport)
              // this.setState({lati:place.geometry.location.lat(),longi:place.geometry.location.lng()})
            } else {             
              bounds.extend(place.geometry.location)
            }
     
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
          
          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          refs.map.fitBounds(bounds);
          
          // console.log(refs.map.fitBounds,'refs')
        },
      })
    },
  }),
  
  withScriptjs,
  withGoogleMap
)((props) =>
  props.lat && props.lon ?
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: props.lat, lng: props.lon }}
      ref ={props.onMapMounted}
      onBoundsChanged={props.onBoundsChanged}

    >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_CENTER}
      onPlacesChanged={props.onPlacesChanged}
    >    
      <input
        type="text"
        placeholder="Enter your location"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,        
          background:`#fff`,
          marginLeft:'290px',          
        }}
      />
    </SearchBox>   
        
        {/* {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} icon='/marker_gyms.png'/>
    )} */}
    {/* {console.log(props,"Hello this si")} */}
      {props.isMarkerShown && props.filter === 'gym' &&
        props.gyms && props.gyms.length ? props.gyms.map((gym, index) =>
          <Marker
          key={index}
            position={{ lat: gym.location[1], lng: gym.location[0] }}
            onMouseOver={() => props.showInfo(gym._id)}
            icon='/marker_gyms.png'
          >
            {props.info && props.info === gym._id ?
              <InfoWindow
                defaultStyles={boxStyle}
              >
                <div className="mapinfo" onClick={() => props.onClick(gym._id)}
                >
                  <div className="mapinfo-ttl">
                    <h3>{gym.name}</h3>
                    <StarRatings
                      rating={gym.rating}
                      starDimension="12px"
                      starSpacing="1px"
                    />
                  </div>
                  <p className="mapinfo-btm">
                    <span className="gymtype">{getGymType(gym.gymType)}</span>
                    <span>{getMiles(gym.distanceFromLocation)} Miles Away</span>
                  </p>
                </div>
              </InfoWindow> : ''}
          </Marker>
        ) : ''
      }
      {props.isMarkerShown && props.filter === 'trainer' &&
        props.trainers && props.trainers.length ? props.trainers.map((trainer, index) =>
          <Marker
          key={index}

            position={{
              lat: trainer.location[1],
              lng: trainer.location[0]
            }}
            onMouseOver={() => props.showInfo(trainer._id)}
            icon='/marker_trainers.png'
          >
            {props.info && props.info === trainer._id ?
              <InfoWindow
                defaultStyles={boxStyle}
              >
                <div className="mapinfo" onClick={() => props.onClick(trainer._id)}>
                  <div className="mapinfo-ttl">
                    <h3>{`${trainer.userId.firstName} ${trainer.userId.lastName}`}</h3>
                    <StarRatings
                      rating={trainer.rating}
                      starDimension="12px"
                      starSpacing="1px"
                    />

                  </div>
                  <p className="mapinfo-btm">
                    <span className="gymtype">  {getMiles(trainer.distanceFromLocation)} Miles Away</span>
                  </p>
                </div>
              </InfoWindow> : ''}
          </Marker>
        ) : ''
      }
    </GoogleMap> : ''
  )


  function mapDispatchToProps(dispatch) {
    return {
     
      getGyms: (params, limit, loadMore) =>
        dispatch(getGyms(params, limit, loadMore)),
        setFilters: (params) =>
      dispatch(setFilters(params)),
      getTrainers: (params, loadMore) =>
			dispatch(getTrainers(params, loadMore)),
      
    };
  }


export default connect(null,mapDispatchToProps)(MyMapComponent);