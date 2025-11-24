import { IconCurrencyDollar, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMenu } from "../contexts/MenuRedux";

const MenuAdd = () => {
  const dispatch = useDispatch();
  const initialFormData = {
    name: "",
    description: "",
    price: "",
    ingredient: "",
    restaurant: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const { userRestaurant } = useSelector((state) => state.restaurant);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("ingredient", formData.ingredient);
    submitData.append("restaurant", formData.restaurant);

    if (image && image[0]) {
      submitData.append("image", image[0]);
    }

    console.log("Submitting menu data:", {
      name: formData.name,
      restaurant: formData.restaurant,
      hasImage: !!image,
    });

    dispatch(createMenu(submitData));
    handleReset();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage([file]);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleReset = () => {
    setFormData(initialFormData);
    setImage(null);
    setPreview(null);

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }

    console.log("Form reset successfully");
  };
  return (
    <>
      <div className="py-4">
        <div className="flex gap-4 justify-between items-center">
          <h3 className="text-5xl font-bold font-playfair ">Menu</h3>
          <select
            name="restaurant"
            value={formData.restaurant}
            onChange={handleChange}
            className="select"
          >
            <option value="" disabled>
              Choose Restaurant
            </option>
            {userRestaurant ? (
              <>
                {userRestaurant.map((user, idx) => {
                  return (
                    <option key={user._id + idx} value={user._id}>
                      {user.name}
                    </option>
                  );
                })}
              </>
            ) : (
              <option value="">Không có nhà hàng nào</option>
            )}
          </select>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Tên món ăn */}
            <div className="flex flex-col gap-2">
              <label>Tên món ăn</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên món ăn"
                className="input input-neutral outline-0 w-full"
              />
            </div>

            {/* Mô tả */}
            <div className="flex flex-col">
              <label>Mô tả</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả chi tiết món ăn"
                className="input input-neutral outline-0 w-full text-xl"
              />
            </div>

            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-4 text-left">
                Upload Ảnh
              </h2>

              <div className="mb-4 flex items-center w-full h-[32vh] justify-around">
                <img
                  className="w-[20vw] h-[24vh] object-cover rounded-md"
                  src={preview || null}
                  alt=""
                />

                <div className="flex flex-col h-[26vh] gap-2">
                  {/* Price */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 w-md">
                      <IconCurrencyDollar />
                      <p>Price</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="input outline-0 input-neutral"
                        placeholder="Enter price"
                      />
                    </div>
                  </div>

                  {/* Ingredient */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 w-md">
                      <IconCurrencyDollar />
                      <p>Ingredient</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="ingredient"
                        value={formData.ingredient}
                        onChange={handleChange}
                        placeholder="Enter ingredients"
                        className="input outline-0 input-neutral"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                      Chọn ảnh
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="file-input"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-soft w-full btn-error">
                Add to Menu
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MenuAdd;
