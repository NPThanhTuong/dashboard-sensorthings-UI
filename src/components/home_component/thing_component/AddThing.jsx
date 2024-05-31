import axios from "axios";
import "./add-thing.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import uploadFile from "../../../../public/images/upload-file.png";

const FloatingLabelInput = ({ label, type, name, value, onChange }) => (
  <div className="input-group">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder=" "
      className="input"
    />
    <label className="input-label">{label}</label>
  </div>
);

const FloatingLabelSelect = ({ label, name, value, onChange, options }) => (
  <div className="input-group">
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="input"
    >
      <option value="">Lựa chọn vị trí</option>
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <label className="input-label">{label}</label>
  </div>
);

const AddThing = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    id_user: "",
    id_location: "",
    avt_image: null,
  });

  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_user: user.message.id,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avt_image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("id_user", formData.id_user);
    data.append("id_location", formData.id_location);
    if (formData.avt_image) {
      data.append("avt_image", formData.avt_image);
    }

    try {
      await axios.post("/api/post/things", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      toast.success("Thêm thing thành công");
      navigate("/");
    } catch (error) {
      console.error("Lỗi thêm thing:", error);
      toast.error("Thêm thing thất bại");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-5 max-w-lg rounded-lg bg-white p-8 shadow-lg"
    >
      <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900">
        Thêm Thing
      </h2>

      <FloatingLabelSelect
        label="Vị trí"
        name="id_location"
        value={formData.id_location}
        onChange={handleChange}
        options={[{ value: "1", label: "1" }]}
      />

      <FloatingLabelInput
        label="Tên Thing"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <FloatingLabelInput
        label="Mô tả"
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <div className="image-upload-group">
        <div className="image-upload">
          <label className="image-upload-label">Hình ảnh</label>
          <input
            type="file"
            name="avt_image"
            onChange={handleFileChange}
            className="hidden-input"
            id="fileInput"
          />
          <div className="flex items-center justify-center">
            <img
              src={
                formData.avt_image
                  ? URL.createObjectURL(formData.avt_image)
                  : uploadFile
              }
              alt="Upload"
              className={`cursor-pointer ${formData.avt_image ? "uploaded-image" : "default-image"}`}
              onClick={() => document.getElementById("fileInput").click()}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-5 py-3 text-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Thêm
      </button>
    </form>
  );
};

export default AddThing;
