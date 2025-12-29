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
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [address, setAddress] = useState("");
  const [decription, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState([]);
  const [preview, setPreview] = useState([]);
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("type", type);
    data.append("from", from);
    data.append("to", to);
    data.append("address", address);
    data.append("medium_price", price);
    data.append("description", decription);
    image.forEach((img) => {
      data.append("images", img);
    });
    data.append(
      "location",
      JSON.stringify({
        type: "Point",
        coordinates: [Number(lon), Number(lat)],
      })
    );
    dispatch(createRestaurant(data));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length + preview.length > 4) {
      setPreview([]);
      setImage([]);
      toast.error("Maximum image is 4");
      return;
    }
    if (files && files.length > 0) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setPreview((prev) => [...prev, ...urls]);
      setImage(Array.from(files));
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
            placeholder="Restaurant Name"
            className="input w-full outline-0"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3  pb-1">
          <label className="label text-black font-serif">
            <IconBuildingStore />
            Type
          </label>
          <input
            type="text"
            placeholder="Name"
            className="input w-full text-black outline-0"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3  pb-1">
          <label className="label text-black font-serif">
            <IconShoppingCartDollar />
            Average Price
          </label>
          <input
            type="number"
            placeholder="Name"
            className="input w-full text-black outline-0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
              className="w-full input text-black outline-0"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              type="time"
              className="input w-full text-black outline-0"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="label text-black font-serif flex items-center gap-1">
              <IconMapPin size={16} />
              Địa chỉ
            </label>
            <input
              type="text"
              className="input w-full text-black outline-0"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 w-40">
            <label className="label text-black font-serif flex items-center gap-1">
              <IconMapPin size={16} />
              Latitude
            </label>
            <input
              type="number"
              step="any"
              className="input w-full text-black outline-0"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 w-40">
            <label className="label text-black font-serif flex items-center gap-1">
              <IconMapPin size={16} />
              Longitude
            </label>
            <input
              type="number"
              step="any"
              className="input w-full text-black outline-0"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap pb-1">
          <label className="label text-black font-serif">Description</label>
          <textarea
            type="text"
            placeholder="Description"
            className="textarea w-full outline-0"
            value={decription}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="w-full flex gap-2 ">
          {preview.map((img) => {
            return (
              <img src={img} alt="" className="w-1/4 h-[15vh] rounded-lg" />
            );
          })}
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
