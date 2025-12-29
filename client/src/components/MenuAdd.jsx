import { IconCurrencyDollar } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMenu, updateRestaurantMenu } from "../contexts/MenuRedux";

const MenuAdd = ({ menuToEdit, onCancelEdit }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [type, setType] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { userRestaurant } = useSelector((state) => state.restaurant);

  useEffect(() => {
    if (menuToEdit) {
      setIsEditing(true);
      setName(menuToEdit.name || "");
      setPrice(menuToEdit.price || "");
      setRestaurant(menuToEdit.restaurant || "");
      setType(menuToEdit.type || "");
      setPreview(menuToEdit.image || null);
      setImage(null);
    } else {
      resetForm();
      setIsEditing(false);
    }
  }, [menuToEdit]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setRestaurant("");
    setType("");
    setPreview(null);
    setImage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!restaurant) {
      alert("Vui lòng chọn nhà hàng");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("restaurant", restaurant);
    data.append("type", type);

    if (image && image[0]) {
      data.append("image", image[0]);
    } else {
      data.append("image", "");
    }

    if (isEditing && menuToEdit) {
      dispatch(
        updateRestaurantMenu({
          id: menuToEdit._id,
          updateData: data,
        })
      );
      if (onCancelEdit) onCancelEdit();
    } else {
      dispatch(createMenu(data));
      resetForm();
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setIsEditing(false);
    if (onCancelEdit) onCancelEdit();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage([file]);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="py-4">
      <div className="flex gap-4 justify-between items-center mb-6">
        <h3 className="text-5xl font-bold font-playfair">
          {isEditing ? "Chỉnh sửa Menu" : "Thêm Menu mới"}
        </h3>

        <div className="flex gap-4 items-center">
          <select
            value={restaurant}
            className="select text-xl"
            onChange={(e) => setRestaurant(e.target.value)}
            disabled={isEditing}
          >
            <option value="" disabled>
              Chọn nhà hàng
            </option>
            {userRestaurant ? (
              userRestaurant.map((user, idx) => (
                <option key={user.id + idx} value={user._id}>
                  {user.name}
                </option>
              ))
            ) : (
              <option value="">Không có nhà hàng nào</option>
            )}
          </select>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn btn-outline btn-error"
            >
              Hủy chỉnh sửa
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium">Tên món ăn *</label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Nhập tên món ăn"
            className="input input-bordered outline-0 w-full text-xl"
            required
          />
        </div>


        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4 text-left">
            {isEditing ? "Cập nhật thông tin" : "Thông tin món ăn"}
          </h2>

          <div className="mb-4 flex  w-full h-auto justify-around flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-xs h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover rounded-md"
                  src={preview}
                  alt=""
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="block text-lg font-medium">
                  {isEditing ? "Thay đổi ảnh" : "Chọn ảnh *"}
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered"
                  accept="image/*"
                  required={!isEditing}
                />
                {isEditing && (
                  <p className="text-sm text-gray-500">
                    Để trống nếu không muốn thay đổi ảnh
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <IconCurrencyDollar className="text-gray-600" />
                  <label className="text-lg font-medium">Giá *</label>
                </div>
                <input
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  className="input input-bordered outline-0 w-full"
                  placeholder="Nhập giá"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <IconCurrencyDollar className="text-gray-600" />
                  <label className="text-lg font-medium">Loại món *</label>
                </div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Chọn loại món</option>
                  <option value="Appetizer">Khai vị</option>
                  <option value="Main Course">Món chính</option>
                  <option value="Dessert">Tráng miệng</option>
                </select>
              </div>

            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button type="submit" className="btn btn-primary flex-1">
              {isEditing ? "Cập nhật Menu" : "Thêm vào Menu"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MenuAdd;
