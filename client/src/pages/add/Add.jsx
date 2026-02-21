import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Plumbing",
  "Electrician",
  "Carpentry",
  "Landscaping",
  "Cleaning",
  "Air Conditioning",
  "Painting",
  "Arborist",
];

const Add = () => {
  const [singleFile, setSingleFile] = useState();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);
      const images = await Promise.all(
        [...files].map((file) => upload(file))
      );
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
    }
    setUploading(false);
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => newRequest.post("/gigs", gig),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>

        <div className="sections">
          <form className="info" onSubmit={handleSubmit}>
            <label>Title</label>
            <input name="title" onChange={handleChange} required />

            <label>Category</label>
            <select name="cat" onChange={handleChange} required>
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label>Cover Image</label>
            <input type="file" onChange={(e) => setSingleFile(e.target.files[0])} />

            <label>Upload Images</label>
            <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />

            <button type="button" onClick={handleUpload}>
              {uploading ? "uploading..." : "Upload"}
            </button>

            <label>Description</label>
            <textarea name="desc" onChange={handleChange} required />

            <label>Service Title</label>
            <input name="shortTitle" onChange={handleChange} required />

            <label>Short Description</label>
            <textarea name="shortDesc" onChange={handleChange} notrequired />

            <label>Estimated Hours</label>
            <input type="number" name="hours" onChange={handleChange} required />

           
            <label>Price</label>
            <input type="number" name="price" onChange={handleChange} required />

            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;
