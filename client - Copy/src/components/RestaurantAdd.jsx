import {
  IconBuildingStore,
  IconDeviceMobile,
  IconMapPin,
  IconShoppingCartDollar,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createRestaurant } from "../contexts/ResRedux";

const RestaurantAdd = () => {
  const dispatch = useDispatch();
  const initialState = {
    name: "",
    type: "",
    from: "",
    to: "",
    address: "",
    description: "",
    price: 0,
  };

  const [, setImage] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [preview, setPreview] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
    setPreview([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "image") {
        formData.image.forEach((file) => {
          data.append("images", file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });
    try {
      await dispatch(createRestaurant(data));
      resetForm();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length + preview.length > 4) {
      setPreview([]);
      setImage([]);
      toast.error("Maximum image is 4");
      e.target.value = "";
      return;
    }
    if (files && files.length > 0) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setPreview((prev) => [...prev, ...urls]);
      setImage((prev) => [...prev, ...Array.from(files)]);
      e.target.value = "";
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-full px-10 space-y-3"
      >
        <h3 className="text-black text-5xl pt-6 pb-3 font-playfair">
          Restaurant Form
        </h3>
        <div className="flex flex-col gap-3 pb-1">
          <label className="text-black "> Name</label>
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            className="input w-full outline-0"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3  pb-1">
          <label className="label text-black font-serif">
            <IconBuildingStore />
            Type
          </label>
          <input
            type="text"
            name="type"
            placeholder="Name"
            className="input w-full text-black outline-0"
            value={formData.type}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-3  pb-1">
          <label className="label text-black font-serif">
            <IconShoppingCartDollar />
            Average Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Average Price"
            className="input w-full text-black outline-0"
            value={formData.price === 0 ? "" : formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3  pb-1">
          <div className="flex justify-between">
            <label className="label w-full text-black font-serif">
              Opening Time
            </label>
            <label className="label w-full text-black font-serif">
              Closing Time
            </label>
          </div>
          <div className="flex gap-3 w-full justify-between">
            <input
              type="time"
              name="from"
              className="w-full input text-black outline-0"
              value={formData.from}
              onChange={handleChange}
            />
            <input
              type="time"
              name="to"
              className="input w-full text-black outline-0"
              value={formData.to}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3  pb-1">
          <label className="label text-black font-serif">
            <IconMapPin />
            Location
          </label>
          <input
            className="input w-full text-black outline-0"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap pb-1">
          <label className="label text-black font-serif">Description</label>
          <textarea
            type="text"
            name="description"
            placeholder="Description"
            className="textarea w-full outline-0"
            value={formData.decription}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex gap-2 ">
          {preview.map((url, index) => (
            <div key={`preview-${index}`} className="w-1/4 h-[15vh]">
              <img src={url} alt="" className="rounded-lg" />
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <p>Choose Image ( Maximum image is 4)</p>
          <button
            type="button"
            className="btn btn-soft"
            onClick={() => {
              setImage([]);
              setPreview([]);
            }}
          >
            Remove all images
          </button>
        </div>
        <input
          type="file"
          multiple
          onChange={(e) => handleImageChange(e)}
          className="file-input w-full file-input-neutral"
        />

        <button type="submit" className="btn btn-soft btn-neutral w-full">
          Add
        </button>
      </form>
    </div>
  );
};

export default RestaurantAdd;
