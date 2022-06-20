/* global bootstrap */
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert/Alert';
import './newExperience.css';

function NewExperienceFunction() {
  const navigate = useNavigate();
  return (
    <NewExperience navigate={navigate} />
  );
}

class NewExperience extends React.Component {
  constructor() {
    super();
    this.state = {
      experienceName: '',
      description: '',
      images: [],
    };
    this.inputChanged = this.inputChanged.bind(this);
    this.addImages = this.addImages.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.makePost = this.makePost.bind(this);
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
          Alert('Please select a Maximum of 2 Images', 'danger', 'newExperienceAlert', 'Maximum Images Exceeded');
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
    const { navigate } = this.props;
    const { description } = this.state;
    if (description.trim() === '') {
      Alert('Description Cannot Be Blank', 'warning', 'newExperienceAlert');
      document.getElementById('description').focus();
      return;
    }
    Alert('Posting Experience...', 'dark', 'postingExperienceAlert');

    fetch(`${window.server}/postExperience`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    }).then((res) => res.json()).then((res) => {
      if (!res.success) {
        Alert('Post Experience Failed', 'danger', 'newExperienceAlert', 'Error ');
      } else {
        window.newPostModal.hide();
        navigate('/login');
        setTimeout(() => {
          const toast = new bootstrap.Toast(document.getElementById('postToast'));
          toast.show();
        }, 1000);
      }
    }).catch(() => {
      Alert('Post Experience Failed', 'danger', 'newExperienceAlert', 'Error ');
    });
  }

  inputChanged(e) {
    switch (e.target.id) {
      case 'experienceName': {
        this.setState({ experienceName: e.target.value });
        break;
      }
      case 'description': {
        this.setState({ description: e.target.value });
        break;
      }
      default: break;
    }
  }

  render() {
    const {
      experienceName,
      description,
      images,
    } = this.state;
    return (
      <div className="newExperience fw-bold">
        <div id="newExperienceAlert" />
        <div id="postingExperienceAlert" />
        <form>
          <div className="row">
            <input type="text" autoComplete="off" className="mb-4 py-2 bg-dark text-white" id="experienceName" placeholder="Label Your Experience (Optional)" value={experienceName} onChange={this.inputChanged} />
            <textarea
              rows={6}
              className="py-2 bg-dark text-white"
              id="description"
              value={description}
              style={{ resize: 'none' }}
              onChange={this.inputChanged}
              maxLength="250"
              placeholder="Describe Your Experience..."
            />
          </div>
          <div>
            {
              images.length ? (
                <div className="">
                  {
                    (images.length === 1) ? (
                      <div id="oneImageHolder">
                        <button
                          type="button"
                          className="position-absolute btn btn-close removeImageButton"
                          onClick={() => { this.removeImage(0); }}
                          aria-label="Close"
                        />
                        <img src={images[0]} alt="" id="new-post-image" />
                      </div>
                    ) : (
                      <div id="twoImagesHolder">
                        <div id="two-pics-image-1">
                          <button
                            type="button"
                            className="position-absolute btn btn-close removeImageButton1"
                            onClick={() => { this.removeImage(0); }}
                            aria-label="Close"
                          />
                          <img src={images[0]} alt="" id="new-post-image-1" />
                        </div>
                        <div id="two-pics-image-2">
                          <button
                            type="button"
                            className="position-absolute btn btn-close removeImageButton"
                            onClick={() => { this.removeImage(1); }}
                            aria-label="Close"
                          />
                          <img src={images[1]} alt="" id="new-post-image-2" />
                        </div>
                      </div>
                    )
                  }
                </div>
              ) : null
            }
          </div>
          <div className="d-flex justify-content-between mt-4" id="postControl">
            <button
              className="btn btn-dark border-white me-3"
              type="button"
              title="Add Images"
              onClick={this.addImages}
            >
              <i className="fa fa-image" />
            </button>
            <button className="btn btn-light" type="button" title="Post Experience" onClick={this.makePost}>Post</button>
          </div>
        </form>
      </div>
    );
  }
}

NewExperience.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default NewExperienceFunction;
