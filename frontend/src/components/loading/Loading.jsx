import { CircularProgress } from '@mui/material';
import './Loading.css';
import Topbar from '../topbar/Topbar';

const Loading = () => {
  return (
    <>
      <Topbar />
      <div className="loadingContainer">
        <CircularProgress className="loadingIcon" />
      </div>
    </>
  );
};

export default Loading;
