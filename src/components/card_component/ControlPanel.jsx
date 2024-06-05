import { useState } from 'react';
import './Control.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line react/prop-types
const Control = ({ name, initialStatus, icon }) => {
  const [status, setStatus] = useState(initialStatus);

  const toggleStatus = () => {
    setStatus(!status);
    if (name === "Ánh Sáng") {
      !status ? toast("Đèn được bật", { autoClose: 2000 }) : toast("Đèn đã được tắt", { autoClose: 2000 });
    } else if (name === "Độ Ẩm") {
      !status ? toast("Thiết bị cấp nước hoạt động", { autoClose: 2000 }) : toast("Thiết bị cấp nước đã được tắt", { autoClose: 2000 });
    }
  };

  return (
    <div className={`control ${status ? 'on' : 'off'}`}>
      <div className="control-left">
        {icon && <img className="control-icon" src={icon} alt={name} />}
        <span className="control-name">{name}</span>
      </div>
      <div className="control-right">
        <label className="switch">
          <input type="checkbox" checked={status} onChange={toggleStatus} />
          <span className="slider"></span>
        </label>
        <span className="control-button">{status ? 'On' : 'Off'}</span>
      </div>
    </div>
  );
};

const ControlPanel = () => {
  return (
    <div className="control-panel">
      <Control name="Ánh Sáng" initialStatus={false} icon="https://afamilycdn.com/150157425591193600/2020/6/8/-1591602033061427821364.jpg" />
      <Control name="Độ Ẩm" initialStatus={false} icon="https://tincay.com/wp-content/uploads/2017/02/cong-nghe-tuoi-nho-giot.jpg" />
      <ToastContainer />
    </div>
  );
};

export default ControlPanel;
