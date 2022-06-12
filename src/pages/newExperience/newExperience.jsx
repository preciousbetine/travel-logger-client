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
      placesVisited: [],
      images: [],
      experienceName: '',
      travelCost: '',
    };
    this.selectImages = this.selectImages.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
    this.makePost = this.makePost.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
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
    document.getElementById('postImage1').style.visibility = 'hidden';
    document.getElementById('postImage2').style.visibility = 'hidden';
    this.setHeader(headerComponent);
  }

  selectImages = () => {
    const input = document.createElement('input');
    const newImages = [];
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = () => {
      const files = Array.from(input.files);
      if (FileReader && files && files.length) {
        if (files.length > 2) {
          console.log('Max of 2 Images');
          return;
        }
        if (files.length > 0) document.getElementById('postImage1').style.visibility = 'visible';
        if (files.length > 1) document.getElementById('postImage2').style.visibility = 'visible';
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
      } else {
        document.getElementById('postImage1').style.visibility = 'hidden';
        document.getElementById('postImage2').style.visibility = 'hidden';
      }
    };
    input.click();
  };

  addLocation(e) {
    const { placesVisited } = this.state;
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      this.setState({
        placesVisited: [...placesVisited, e.target.value.trim()],
      });
      e.target.value = '';
    }
  }

  removeLocation(id) {
    const { placesVisited } = this.state;
    this.setState({
      placesVisited: placesVisited.filter((item, index) => index !== id),
    });
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
      case 'travelCost': {
        this.setState({ travelCost: e.target.value });
        break;
      }
      default: break;
    }
  }

  render() {
    const {
      placesVisited,
      images,
      experienceName,
      travelCost,
    } = this.state;
    return (
      <div className="newExperience text-dark fw-bold">
        <form>
          <div className="row">
            <label htmlFor="experienceName" className="col-md-6 col-sm-6 mb-2">
              Label Experience
              <input type="text" className="form-control mt-2" id="experienceName" value={experienceName} onChange={this.inputChanged} />
            </label>
            <label htmlFor="travelCost" className="col-md-6 col-sm-6 mb-2">
              Add Travel Cost
              <input type="text" className="form-control mt-2" id="travelCost" value={travelCost} onChange={this.inputChanged} />
            </label>
            <label htmlFor="placesVisited" className="mb-2 mt-2">
              Places Visited (Press Enter to Add)
              <div className="mt-3" id="placesVisited">
                <span className="d-inline-block">
                  <ul className="m-0 p-0">
                    {
                    placesVisited.map((place, index) => (
                      <li key={`${place}&&${Math.random()}`}>
                        <span className="badge bg-dark text-light p-2 me-2 mb-2 font-15">
                          <i className="fa-solid fa-location-dot me-2" />
                          {place}
                          <i
                            className="fa-solid fa-circle-xmark ms-2"
                            onClick={() => this.removeLocation(index)}
                            onKeyDown={() => {}}
                            role="button"
                            tabIndex={index}
                            aria-label="Places Visited"
                          />
                        </span>
                      </li>
                    ))
                  }
                    <li>
                      <span className="d-inline-block">
                        <input
                          type="text"
                          placeholder="Add location"
                          className="locationInput"
                          onKeyUp={this.addLocation}
                        />
                      </span>
                    </li>
                  </ul>
                </span>
              </div>
            </label>
            <div>
              <button
                onClick={() => { this.selectImages(); }}
                className="btn btn-dark border border-light d-flex justify-content-center align-items-center mt-3"
                type="button"
              >
                <i className="fa-solid fa-image font-30 me-2" />
                Add Images
              </button>
            </div>
            <div className="imageHolder mt-3">
              <img id="postImage1" alt="" src={images[0]} className="postImage me-2" />
              <img id="postImage2" alt="" src={images[1] || null} className="postImage" />
            </div>
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
