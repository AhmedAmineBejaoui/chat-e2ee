import React, { useState } from 'react';
import { Image as ImageIcon, File as FileIcon } from 'lucide-react';

type FilePickerProps = {
  onFileChoose: (file: File) => void;
  accept?: string;
  maxSizeBytes?: number;
};

const FilePicker = ({ onFileChoose, accept = '*/*', maxSizeBytes = 50 * 1024 * 1024 }: FilePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSizeBytes) {
      alert(`Fichier trop volumineux. Taille max: ${Math.round(maxSizeBytes / (1024 * 1024))}MB`);
      e.target.value = '';
      return;
    }
    onFileChoose(file);
    e.target.value = '';
  };

  return (
    <div className="relative flex items-center">
      <label className="cursor-pointer text-holo-text-secondary hover:text-holo-cyan transition-colors">
        <input
          className="hidden"
          type="file"
          accept={accept}
          onChange={handleSelect}
        />
        <FileIcon className="w-5 h-5" />
      </label>
    </div>
  );
};

export default FilePicker;
