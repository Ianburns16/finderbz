'use client';

import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/lib/contexts/ToastContext';

interface ImageUploadProps {
  bucket: 'jobs' | 'portfolio';
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUpload({ bucket, onUploadComplete, maxFiles = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const toast = useToast();
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (previews.length + files.length > maxFiles) {
      toast(`You can only upload up to ${maxFiles} images`, 'error');
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      setPreviews(prev => [...prev, ...newUrls]);
      onUploadComplete([...previews, ...newUrls]);
      toast('Images uploaded successfully', 'success');
    } catch (err: any) {
      toast(err.message || 'Error uploading images', 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onUploadComplete(updated);
  };

  return (
    <div className="image-upload-container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        {previews.map((url, index) => (
          <div key={index} style={{ position: 'relative', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              onClick={() => removeImage(index)}
              style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {previews.length < maxFiles && (
          <label style={{
            height: '100px',
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgba(0,0,0,0.02)',
            transition: 'all 0.2s'
          }}>
            <input type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
            {uploading ? (
              <div style={{ fontSize: '0.8rem' }}>Uploading...</div>
            ) : (
              <>
                <ImageIcon size={24} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>Add Photo</span>
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
