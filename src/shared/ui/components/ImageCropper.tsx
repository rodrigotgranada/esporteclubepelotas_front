import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Camera, Trash2, Edit2, X, Check } from 'lucide-react';

interface ImageCropperProps {
  onCropSave: (croppedImageBlob: Blob) => void;
  onImageRemove: () => void;
  initialImage?: string | null;
}

const getCroppedImg = async (imageSrc: string, pixelCrop: { x: number, y: number, width: number, height: number }): Promise<Blob> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (error) => reject(error));
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg');
  });
};

export const ImageCropper: React.FC<ImageCropperProps> = ({ onCropSave, onImageRemove, initialImage }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImagePreview, setCroppedImagePreview] = useState<string | null>(initialImage || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCropComplete = useCallback((croppedArea: unknown, croppedAreaPixels: { x: number, y: number, width: number, height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setCroppedImagePreview(croppedUrl);
      setIsModalOpen(false);
      onCropSave(croppedBlob);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, onCropSave]);

  const handleRemove = () => {
    setCroppedImagePreview(null);
    setImageSrc(null);
    onImageRemove();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative group w-32 h-32 rounded-full overflow-hidden bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer transition-all hover:border-yellow-500">
        {croppedImagePreview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={croppedImagePreview} alt="Profile" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
              <label className="cursor-pointer text-white hover:text-yellow-500 transition-colors">
                <Edit2 className="w-5 h-5" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <button type="button" onClick={handleRemove} className="text-white hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500 transition-colors">
            <Camera className="w-8 h-8 mb-1" />
            <span className="text-xs font-medium uppercase tracking-wider">Adicionar</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>

      {isModalOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121214] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Ajustar Foto</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative w-full h-80 bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-4 flex flex-col space-y-4 bg-[#121214]">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={showCroppedImage}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
