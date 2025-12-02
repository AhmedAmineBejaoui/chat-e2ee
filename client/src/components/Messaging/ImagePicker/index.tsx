import React, { useState } from "react";
import imagePicker from "../../../utils/imagePicker";
import Image from "../../Image/index";
import { Image as ImageIcon } from "lucide-react";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // ~5MB to avoid huge payloads

const ImagePicker = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedImg, setSelectedImg, setText, previewImg, setPreviewImg } = props;

  const handleShowDialog = (e: any) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const selectImage = async (e: any) => {
    e.persist();
    const file = e.target.files?.[0];
    if (file && file.size > MAX_IMAGE_BYTES) {
      alert(`Selected image is too large. Please keep attachments under ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))}MB.`);
      e.target.value = "";
      return;
    }
    try {
      const { base64: imgUrl, fileName } = await imagePicker(e);
      if (imgUrl) {
        setPreviewImg(true);
        setSelectedImg(imgUrl);
        setText(fileName);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || err || "Unable to process this image. Please use a PNG/JPG under 4MB.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="relative flex items-center">
      <label className="cursor-pointer text-holo-text-secondary hover:text-holo-cyan transition-colors">
        <input
          className="hidden"
          type="file"
          accept="image/png, image/jpeg"
          onChange={selectImage}
        />
        {previewImg ? (
          <div>
            <span onClick={handleShowDialog} className="block w-8 h-8 rounded overflow-hidden border border-holo-border">
              <Image src={selectedImg} maxWidth="100%" maxHeight="100%" />
            </span>
            {isOpen && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                onClick={handleShowDialog}
              >
                <img 
                  className="max-w-full max-h-full rounded-lg shadow-2xl" 
                  src={selectedImg} 
                  alt="file-zoom" 
                />
              </div>
            )}
          </div>
        ) : (
          <ImageIcon className="w-5 h-5" />
        )}
      </label>
    </div>
  );
};
export default ImagePicker;
