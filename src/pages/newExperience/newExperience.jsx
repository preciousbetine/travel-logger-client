import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './newExperience.css';

function NewExperienceFunction(props) {
  const { setHeader } = props;
  const navigate = useNavigate();
  return (
    <NewExperience navigate={navigate} setHeader={setHeader} />
  );
}

class NewExperience extends React.Component {
  constructor(props) {
    super();
    this.setHeader = props.setHeader;
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

  componentDidMount() {
    const headerComponent = (
      <div className="d-flex text-dark justify-content-between align-items-center w-100">
        <span>Log a New Experience</span>
        <span>
          <button className="btn btn-dark" type="button" onClick={this.makePost}>Post</button>
        </span>
      </div>
    );
    this.setHeader(headerComponent);
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
        if (files.length > 4) {
          console.log('Max of 4 Images');
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
    fetch('http://localhost:5000/postExperience', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    }).then((res) => res.json()).then((res) => {
      if (!res.success) {
        console.log('Post Experience failed!');
      } else {
        console.log('Experience Posted Successfully');
        navigate('/profile');
      }
    }).catch(() => {
      console.log('Post Experience failed!');
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
      <div className="newExperience text-dark fw-bold">
        <form>
          <div className="row">
            <label htmlFor="experienceName" className="col-md-6 col-sm-6 mb-2">
              Label Your Experience
              <input type="text" className="form-control mt-2" id="experienceName" value={experienceName} onChange={this.inputChanged} />
            </label>
            <label htmlFor="description" className="mb-2">
              Describe Your Experience
              {' '}
              (
              {250 - description.length}
              {' '}
              Words Left )
              <textarea
                rows={10}
                className="form-control mt-2"
                id="description"
                value={description}
                style={{ resize: 'none' }}
                onChange={this.inputChanged}
                maxLength="250"
              />
            </label>
          </div>
          <button
            className="btn btn-dark mt-1"
            type="button"
            onClick={this.addImages}
          >
            <i className="fa fa-image me-2" />
            Add Images
          </button>
          <div className="d-flex pt-3">
            {
              images.map((image, index) => (
                <div key={image} className="position-relative">
                  <button
                    type="button"
                    className="position-absolute btn btn-light end-0 font-10"
                    onClick={() => { this.removeImage(index); }}
                  >
                    Remove
                  </button>
                  <img src={image} alt="" className="postImage" />
                </div>
              ))
            }
          </div>
        </form>
      </div>
    );
  }
}

NewExperience.propTypes = {
  setHeader: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

NewExperienceFunction.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

export default NewExperienceFunction;
