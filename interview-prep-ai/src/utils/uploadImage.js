export const uploadToImgBB = async (file) => {
  const apiKey = "f7b7aefe37b4c9e027d3d7bcd03548ed"; // your key

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data?.data?.url; // final hosted image URL
};
