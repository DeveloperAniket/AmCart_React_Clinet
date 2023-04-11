import React, { useEffect, useState } from "react";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../Apis/menuItemApi";
import { inputHelper, toastNotify } from "../../Helper";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { SD_Categories } from "../../Utility/SD";
import { apiResponse } from "../../Interfaces";

const Categories = [
  SD_Categories.Mens,
  SD_Categories.Womens,
  SD_Categories.Kids,
  SD_Categories.Electronics,
];

const menuItemData = {
  name: "",
  description: "",
  specialTag: "",
  category: Categories[0],
  price: "",
};

function MenuItemUpsert() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [imageToStore, setImageToStore] = useState<any>();
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [menuItemInputs, setMenuItemInputs] = useState(menuItemData);
  const [loading, setLoading] = useState(false);
  const [createMenuItem] = useCreateProductMutation();
  const [updateMenuItem] = useUpdateProductMutation();
  const { data } = useGetProductByIdQuery(id);

  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        name: data.result.name,
        description: data.result.description,
        specialTag: data.result.specialTag,
        category: data.result.category,
        price: data.result.price,
      };
      setMenuItemInputs(tempData);
      setImageToDisplay(data.result.image);
    }
  }, [data]);

  const handleMenuItemInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, menuItemInputs);
    setMenuItemInputs(tempData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imgType = file.type.split("/")[1];
      const validImgTypes = ["jpeg", "jpg", "png"];

      const isImageTypeValid = validImgTypes.filter((e) => {
        return e === imgType;
      });

      if (file.size > 1000 * 1024) {
        setImageToStore("");
        toastNotify("File Must be less then 1 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToStore("");
        toastNotify("File Must be in jpeg, jpg or png", "error");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      setImageToStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToDisplay(imgUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // if (!imageToStore && !id) {
    //   toastNotify("Please upload an image", "error");
    //   setLoading(false);
    //   return;
    // }

    const formData = new FormData();

    formData.append("Name", menuItemInputs.name);
    formData.append("Description", menuItemInputs.description);
    formData.append("SpecialTag", menuItemInputs.specialTag ?? "");
    formData.append("CategoryName", menuItemInputs.category);
    formData.append("Price", menuItemInputs.price);
    // if (imageToDisplay) formData.append("File", imageToStore);
     let url = '';
    // switch (menuItemInputs.category) {
    //   case SD_Categories.Mens:
    //     url = 'data:image/jpeg;base64,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';
    //     break;
    //   case SD_Categories.Womens:
    //     url = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fpremium-vector%2Fgirl-s-face-with-beautiful-smile-female-avatar-website-social-network_21167198.htm&psig=AOvVaw3jXpNFt8bQ26fqYyHjahd0&ust=1681283449913000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCMCO3oijof4CFQAAAAAdAAAAABAE';
    //     break;
    //   case SD_Categories.Kids:
    //     url = 'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375__340.png';
    //     break;
    //   default:
    //     break;
    // }
    formData.append("ImageUrl", url);

    let response: apiResponse;

    if (id) {
      //update
      formData.append("Id", id);
      var object: any = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });
      var json = JSON.stringify(object);
      response = await updateMenuItem({ data: json, id });
      console.log(response);
      toastNotify("Menu Item updated successfully", "success");
    } else {
      //create
      formData.append("Id", "0");
      var object: any = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });
      var json = JSON.stringify(object);
      console.log(json);
      response = await createMenuItem(json);
      toastNotify("Menu Item created successfully 1", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/menuItem/menuitemlist");
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className=" px-2 text-success">
        {id ? "Edit Menu Item" : "Add Menu Item"}
      </h3>
      <div className="bg-danger form-control text-center text-white h4">
        In demo, you will not be able to create/update or delete Menu Items!
      </div>
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              name="name"
              value={menuItemInputs.name}
              onChange={handleMenuItemInput}
            />
            <textarea
              className="form-control mt-3"
              placeholder="Enter Description"
              name="description"
              rows={10}
              value={menuItemInputs.description}
              onChange={handleMenuItemInput}
            ></textarea>
            <input
              type="text"
              className="form-control mt-3"
              placeholder="Enter Special Tag"
              name="specialTag"
              value={menuItemInputs.specialTag}
              onChange={handleMenuItemInput}
            />
            <select
              className="form-control mt-3 form-select"
              placeholder="Enter Category"
              name="category"
              value={menuItemInputs.category}
              onChange={handleMenuItemInput}
            >
              {Categories.map((category) => (
                <option value={category}>{category}</option>
              ))}
            </select>
            <input
              type="number"
              className="form-control mt-3"
              required
              placeholder="Enter Price"
              name="price"
              value={menuItemInputs.price}
              onChange={handleMenuItemInput}
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control mt-3"
            />
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn btn-success form-control mt-3"
                >
                  {id ? "Update" : "Create"}
                </button>
              </div>
              <div className="col-6">
                <a
                  onClick={() => navigate("/menuItem/menuitemlist")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Menu Items
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img
              src={imageToDisplay}
              style={{ width: "100%", borderRadius: "30px" }}
              alt=""
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default MenuItemUpsert;
