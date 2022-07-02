/* global bootstrap */
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './newExperience.css';
import { serverAddress } from '../../redux/loginSlice';
import { userData } from '../../redux/userDataSlice';

function NewExperienceFunction() {
  const navigate = useNavigate();
  const server = useSelector(serverAddress);
  const { picture } = useSelector(userData);
  return (
    <NewExperience navigate={navigate} server={server} picture={picture} />
  );
}

class NewExperience extends React.Component {
  constructor() {
    super();
    this.state = {
      experienceName: '',
      description: '',
      images: [],
      postingExperience: false,
    };
    this.inputChanged = this.inputChanged.bind(this);
    this.addImages = this.addImages.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.makePost = this.makePost.bind(this);

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  componentDidMount() {
    document.getElementById('newPostDescription').focus();
  }

  addImages() {
    const input = document.createElement('input');
    const newImages = [];
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = () => {
      const files = Array.from(input.files);
      if (FileReader && files && files.length) {
        if (files.length > 2) {
          const toast = new bootstrap.Toast(document.getElementById('maxImagesToast'));
          toast.show();
          return;
        }
        files.forEach((file, index) => {
          const fr = new FileReader();
          fr.onload = () => {
            newImages[index] = fr.result;
            this.setState({
              images: newImages,
            });
          };
          fr.readAsDataURL(file);
        });
      }
    };
    input.click();
  }

  removeImage(index) {
    const { images } = this.state;
    images.splice(index, 1);
    this.setState({ images });
  }

  makePost() {
    const { navigate, server } = this.props;
    this.setState({ postingExperience: true });

    const objectToPost = { ...this.state };
    delete objectToPost.postingExperience;

    fetch(`${server}/postExperience`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objectToPost),
    }).then((res) => res.json()).then((res) => {
      this.setState({ postingExperience: false });
      if (!res.success) {
        const toast = new bootstrap.Toast(document.getElementById('experienceErrorToast'));
        toast.show();
      } else {
        window.newPostModal.hide();
        navigate('/login');
        setTimeout(() => {
          const toast = new bootstrap.Toast(document.getElementById('postToast'));
          toast.show();
        }, 1000);
      }
    }).catch(() => {
      this.setState({ postingExperience: false });
      const toast = new bootstrap.Toast(document.getElementById('experienceErrorToast'));
      toast.show();
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    });
  }

  inputChanged(e) {
    this.setState({ description: e.target.value });
  }

  render() {
    const {
      description,
      images,
      postingExperience,
    } = this.state;
    const { picture, server } = this.props;
    return (
      <div className="newExperience fw-bold">
        <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-sm-bottom">
          <div id="experienceErrorToast" className="toast m-0 w-100" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-body d-flex align-items-center bg-danger text-light fw-bold">
              An Error Occured!
            </div>
          </div>
        </div>
        <div className="toast-container position-fixed bottom-0 end-0 p-3 toast-sm-bottom">
          <div id="maxImagesToast" className="toast m-0 w-100" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-body d-flex align-items-center bg-warning text-dark fw-bold">
              Select a Maximum of 2 Images
            </div>
          </div>
        </div>
        <form>
          <div className="d-flex align-items-top w-100 p-2">
            <img alt="" src={`${server}/photo/${picture}`} id="user-image-new-post" className="me-1" />
            <div className="d-flex flex-column w-100 justify-content-center mt-3 ms-3">
              <textarea
                className="w-100 content-only fw-normal mb-2"
                style={{ resize: 'none' }}
                placeholder="Share your experience..."
                value={description}
                onChange={(e) => {
                  if (e.key === 'Enter') e.preventDefault();
                  this.setState({ description: e.target.value });
                  e.target.style.height = '5px';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                maxLength={250}
                id="newPostDescription"
              />
              {
                images.length ? (
                  <div className="mt-2">
                    {
                      (images.length === 1) ? (
                        <div id="oneImageHolder">
                          <button
                            className="btn btn-link m-0 p-0 position-absolute right-25px text-white font-15"
                            type="button"
                            onClick={() => { this.removeImage(0); }}
                            aria-label="Close"
                          >
                            <i className="fa-solid fa-circle-xmark text-color2 bg-white rounded-circle" />
                          </button>
                          <img src={images[0]} alt="" id="new-post-image" />
                        </div>
                      ) : (
                        <div id="twoImagesHolder">
                          <div id="two-pics-image-1">
                            <button
                              className="btn btn-link m-0 p-0 position-absolute right-10px text-white font-15"
                              type="button"
                              onClick={() => { this.removeImage(0); }}
                              aria-label="Close"
                            >
                              <i className="fa-solid fa-circle-xmark text-color2 bg-white rounded-circle" />
                            </button>
                            <img src={images[0]} alt="" id="new-post-image-1" />
                          </div>
                          <div id="two-pics-image-2">
                            <button
                              className="btn btn-link m-0 p-0 position-absolute right-10px text-white font-15"
                              type="button"
                              onClick={() => { this.removeImage(1); }}
                              aria-label="Close"
                            >
                              <i className="fa-solid fa-circle-xmark text-color2 bg-white rounded-circle" />
                            </button>
                            <img src={images[1]} alt="" id="new-post-image-2" />
                          </div>
                        </div>
                      )
                    }
                  </div>
                ) : null
              }
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3" id="postControl">
            <button
              className="btn btn-light border-dark me-3"
              type="button"
              title="Add Images"
              onClick={this.addImages}
            >
              <i className="fa fa-image" />
            </button>
            <button className="btn btn-light border-dark" type="button" title="Post Experience" onClick={this.makePost} disabled={(description.length === 0 && images.length === 0) || postingExperience}>
              {
                postingExperience ? 'Posting...' : 'Post'
              }
            </button>
          </div>
        </form>
      </div>
    );
  }
}

NewExperience.propTypes = {
  navigate: PropTypes.func.isRequired,
  server: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
};

export default NewExperienceFunction;
