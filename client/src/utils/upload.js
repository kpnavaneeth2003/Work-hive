import axios from "axios";

const upload = async (file) => {
  const uploadUrl = import.meta.env.VITE_UPLOAD_LINK;

  if (!uploadUrl) {
    throw new Error("Missing VITE_UPLOAD_LINK in .env");
  }

  if (!file) throw new Error("No file selected");
  if (!file.type?.startsWith("image/")) throw new Error("Only image files allowed");

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "workhive"); // ⭐ your preset name

  const res = await axios.post(uploadUrl, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const url = res?.data?.secure_url || res?.data?.url;
  if (!url) throw new Error("Upload succeeded but no URL returned");

  return url;
};

export default upload;