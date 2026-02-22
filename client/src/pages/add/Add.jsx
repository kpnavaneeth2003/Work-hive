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
  "Bathroom renovators",
  "Air conditioning services",
  "Painting",
  "Arborist",
];

const Add = () => {
  const [singleFile, setSingleFile] = useState(null);
  const [files, setFiles] = useState([]); // FileList
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleUpload = async () => {
    if (!singleFile) return alert("Please select a cover image first.");

    setUploading(true);
    try {
      const cover = await upload(singleFile);
      const images =
        files && files.length > 0
          ? await Promise.all(Array.from(files).map((file) => upload(file)))
          : [];

      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => newRequest.post("/gigs", gig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGigs"] });
      navigate("/mygigs");
    },
    onError: (err) => {
      console.error(err);
      alert(err?.response?.data?.message || err?.response?.data || "Create failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (uploading) return alert("Please wait for upload to finish.");
    if (!state.cover) return alert("Please upload a cover image first.");

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
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label>Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSingleFile(e.target.files?.[0] || null)}
            />

            <label>Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files || [])}
            />

            <button type="button" onClick={handleUpload} disabled={uploading}>
              {uploading ? "uploading..." : "Upload"}
            </button>

            <label>Description</label>
            <textarea name="desc" onChange={handleChange} required />

            <label>Service Title</label>
            <input name="shortTitle" onChange={handleChange} required />

            <label>Short Description</label>
            <textarea name="shortDesc" onChange={handleChange} required />

            <label>Estimated Hours</label>
            <input type="number" name="hours" min={0} onChange={handleChange} required />

            <label>Price</label>
            <input type="number" name="price" min={0} onChange={handleChange} required />

            <button type="submit" disabled={uploading || mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;