import React, { useState } from 'react';
import { uploadImage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Loader2, X } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

interface ImageUploadProps {
  label: string;
  currentImageUrl: string | null;
  onImageChange: (url: string | null) => void;
  folder: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  currentImageUrl,
  onImageChange,
  folder
}) => {
  const { clerkUserId } = useAuthContext();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const mockEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(mockEvent);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!clerkUserId) {
      toast.error('Sessão não encontrada. Por favor, faça login novamente.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Tipo de arquivo inválido. Use JPG, PNG ou WEBP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Tamanho máximo: 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Upload agora vai para o R2 via backend Express
      const publicUrl = await uploadImage(clerkUserId, file, folder);
      setPreviewUrl(publicUrl);
      onImageChange(publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Erro no upload: ${error.message || 'Erro ao enviar imagem'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageChange(null);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt={label}
            className="w-full h-48 object-cover rounded-lg border shadow-sm"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 shadow-md hover:scale-105 transition-transform"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className={`h-8 w-8 mx-auto mb-2 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className="text-sm text-muted-foreground mb-4">
            {isDragging ? 'Solte para enviar' : 'Clique para selecionar ou arraste a imagem aqui'}
          </p>
          <Input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center text-sm text-primary font-medium animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Enviando imagem para o R2...
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
