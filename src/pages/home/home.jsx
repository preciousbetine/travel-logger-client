/* eslint-disable react/style-prop-object */
/* global bootstrap */
import React from 'react';
import PropTypes from 'prop-types';
import './home.css';
import { useSelector } from 'react-redux';
import { serverAddress } from '../../redux/loginSlice';
import Experience from '../../components/experience/experience';
import NewExperience from '../newExperience/newExperience';
import Loader from '../../components/loader/loader';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      posts: [],
      loading: true,
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    const { setHeader, server } = this.props;
    const { currentIndex, posts } = this.state;
    const nav = (
      <div className="d-flex align-items-center h-100">
        <h6 className="m-0 font-20">Home</h6>
      </div>
    );
    setHeader(nav);
    fetch(`${server}/timeline?index=${currentIndex}`, {
      credentials: 'include',
    })
      .then((res) => res.json()).then((res) => {
        this.setState({
          currentIndex: 20,
          posts: [...posts, ...(res.posts.map((post) => post.post))],
          loading: false,
        });
      }).catch(() => {
        const toast = new bootstrap.Toast(document.getElementById('errorToast'));
        toast.show();
        this.setState({
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll() {
    const { currentIndex, posts } = this.state;
    const { server } = this.props;
    if (
      document.documentElement.scrollHeight - document.documentElement.scrollTop
    <= (document.documentElement.clientHeight + 10)
    ) {
      fetch(`${server}/timeline?index=${currentIndex}`, {
        credentials: 'include',
      })
        .then((res) => res.json()).then((res) => {
          if (res.posts.length) {
            this.setState({
              currentIndex: currentIndex + 20,
              posts: [...posts, ...(res.posts.map((post) => post.post))],
            });
          }
        }).catch(() => {
          const toast = new bootstrap.Toast(document.getElementById('errorToast'));
          toast.show();
        });
    }
  }

  render() {
    const { posts, loading } = this.state;
    return (
      <div className="home-page d-flex flex-column h-max-content">
        <div className="toast-container position-fixed end-0 p-3 toast-sm">
          <div
            id="errorToast"
            className="toast m-0 w-100"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-body d-flex align-items-center bg-danger text-light w-100">
              An Error Occured!
            </div>
          </div>
        </div>
        <div className="new-experience-home">
          <NewExperience />
        </div>
        <table className="table table-borderless">
          <tbody>
            {
              posts.map(
                (post) => (
                  <Experience
                    key={post.datePosted}
                    datePosted={post.datePosted}
                    experienceName={post.experienceName}
                    images={post.images}
                    postId={post.postId}
                    description={post.description}
                    userName={post.user.name}
                    userImage={post.user.picture}
                    deleteExperience={() => {}}
                    showDeleteOption={false}
                  />
                ),
              )
            }
            <tr>
              <td>
                {loading ? <Loader /> : null}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

function HomeComponent(props) {
  const server = useSelector(serverAddress);
  const { setHeader } = props;
  return (
    <Home setHeader={setHeader} server={server} />
  );
}

HomeComponent.propTypes = {
  setHeader: PropTypes.func.isRequired,
};

Home.propTypes = {
  setHeader: PropTypes.func.isRequired,
  server: PropTypes.string.isRequired,
};

export default HomeComponent;
