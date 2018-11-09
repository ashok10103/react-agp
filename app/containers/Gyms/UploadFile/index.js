import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import { changeValue, validate, submit, getImages, uploadImages, removeImage } from './actions';
import { fetchImages } from './selectors';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import Image from 'react-image-resizer'
import { weekDays, setUserState } from 'utils/helper';
const style = {
  image: {
    background: '#fefefe',
    
  },
};

class gymUploadPhotos extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.goToNext = this.goToNext.bind(this);
  }
  componentDidMount() {
    this.props.getImages(this.props.match.params.gymId);
  }
  removeImage(image) {    
    this.props.removeImage(image, this.props.match.params.gymId);
  }

  goToNext() {    
   
  }

  handleImageUpload(e) {
    e.preventDefault();
    if (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png') {
      this.setState({ fileFormat: false });
      const reader = new FileReader();
      const imageFile = e.target.files[0];
      this.props.uploadImages(imageFile, this.props.match.params.gymId)
      reader.onloadend = () => {
        this.setState({ preview: reader.result, file: imageFile });
        const fileType = [{
          fileName: imageFile.name,
          fileType: imageFile.type,
        }];
      };
      reader.readAsDataURL(imageFile);
    } else {
      this.setState({ preview: '' });
    }
  }

  render() {
    const { images } = this.props;
    return (
      <div className="contentarea p-scheduler upload-gym-photos">
        <div className="container">
        {images.length ?<Link to={`/gyms/schedule/${ this.props.match.params.gymId}`} > <div className="btn btn-bdr-gray pull-right" >Next</div></Link>:''}
          <h2 className="ttl">Upload Gym Photos</h2>
        
          { images.length < 10?
          <div className="uploader">
            <i className="sprite-upload-images"></i>
            <p>Upload photos of your Gym</p>
            <input type="file" accept="image/x-png,image/gif,image/jpeg"  onChange={(e) => this.handleImageUpload(e)} />
          </div>
          : ''
          }
          <div className="submit-wrp text-center">
          
          
          </div>
          <h3 className="text-center uploaded-photos-ttl"><span>Uploaded Photos</span></h3>
          <ul className="uploaded-photos list-unstyled row">
            {
              images && images.length ?
                images.map((img) =>
                
                  <li className="col-lg-2 col-md-3 col-sm-4 col-xs-6">
                    <div  onClick={(e) => this.removeImage(img)}> <span> <i style={{cursor:'pointer'}}className="fa fa-close"></i></span> </div>

                    <div className="img-wrp" >
                      <Image
                        src={img}
                        alt=""    
                        height= {200}
                        width= {200}
                        style={style.image}
                      />
                    </div>

                  </li>
                )
                : ''
            }

          </ul>
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    uploadImages: (file, id) => {
      return dispatch(uploadImages(file, id));
  },
    getImages: (id) => {
      return dispatch(getImages(id));
    },
    removeImage: (image, id) => {
      return dispatch(removeImage(image, id));
    },
  };
}
const mapStateToProps = createStructuredSelector({
  images: fetchImages(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'GymUpload', reducer });
const withSaga = injectSaga({ key: 'GymUpload', saga });

export default compose(withReducer, withSaga, withConnect)(gymUploadPhotos);
