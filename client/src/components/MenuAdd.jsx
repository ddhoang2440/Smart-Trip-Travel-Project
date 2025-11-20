import { IconCurrencyDollar, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMenu } from "../contexts/MenuRedux";

const MenuAdd = () => {

  const dispatch = useDispatch();
  const [image,setImage] = useState(null);
  const [preview,setPreview] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [restaurant,setRestaurant] = useState("");


  const {userRestaurant} = useSelector((state) => state.restaurant)


  const handleSubmit = (e)  => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("description", description);
    data.append("price", price);
    data.append("ingredient", ingredient);
    data.append("restaurant", restaurant);
    data.append("image", image[0]);
    dispatch(createMenu(data));
  }
  

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    };
  
  return (
    <>
      <div className="py-4">
        <div className="flex gap-4 justify-between items-center">
          <h3 className="text-5xl font-bold font-playfair ">Menu</h3>
          <select
            defaultValue="Choose Restaurant"
            className="select"
            onChange={(e) => setRestaurant(e.target.value)}
          >
            <option value="Choose Restaurant" disabled>Choose Restaurant</option>
            {userRestaurant ? (
              <>
                {userRestaurant.map((user, idx) => {
                  return (
                    <option  key={user.id + idx} value={user._id}>
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
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label className="">Tên món ăn</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Nhập tên món ăn"
                className="input input-neutral outline-0 w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="">Mô tả</label>
              <input
                type="text"
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Nhập mô tả chi tiết món ăn"
                className="input input-neutral outline-0 w-full text-xl"
              />
            </div>
            <div className="flex flex-col gap-3"></div>
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
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 w-md">
                      <IconCurrencyDollar />
                      <p>PriceRange</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        className="input outline-0 input-neutral"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 w-md">
                      <IconCurrencyDollar />
                      <p>Ingredient</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        onChange={(e) => setIngredient(e.target.value)}
                        value={ingredient}
                        type="text"
                        className="input outline-0 input-neutral"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                      Chọn ảnh
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        setImage(Array.from(e.target.files));
                        handleImageChange(e);
                      }}
                      className="file-input"
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
