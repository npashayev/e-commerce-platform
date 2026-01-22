'use client';

import dynamic from 'next/dynamic';
import styles from '@/styles/resource-form.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  useState,
  useActionState,
  useEffect,
  useRef,
  startTransition,
} from 'react';
// Dynamically import react-select to disable SSR
const Select = dynamic(() => import('react-select'), { ssr: false });
import Image from 'next/image';
import type { Category } from '@prisma/client';
import { EditField } from '@/components/shared/FormField';
import { addProductAction } from '@/app/actions/product';
import { useCloudinaryUpload } from '@/lib/hooks/useCloudinaryUpload';
import toast from 'react-hot-toast';

interface Props {
  categories: Category[];
}


const AddProduct = ({ categories }: Props) => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { uploadImages, isUploading } = useCloudinaryUpload();
  const [state, formAction] = useActionState(addProductAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  const categoryOptions = categories.map(cat => ({
    value: cat.slug,
    label: cat.name,
  }));

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    try {
      // Upload images to Cloudinary before form submission
      let finalImageUrls: string[] = [];
      if (newImageFiles.length > 0) {
        const uploadedUrls = await uploadImages(newImageFiles);
        finalImageUrls = [...uploadedUrls];
      }

      // Add tags and uploaded images to form data
      formData.set('tags', JSON.stringify(tags));
      formData.set('images', JSON.stringify(finalImageUrls));

      startTransition(async () => {
        await formAction(formData);
      });
    } catch (error) {
      console.error('Upload failed during submission:', error);
      toast.error('Failed to upload images. Please try again.');
    }
  };

  // Handle image file selection (for preview only)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Create preview URLs for display only
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...urls]);
    setNewImageFiles(prev => [...prev, ...files]);
  };

  // Remove image
  const removeImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (selectedOption: unknown) => {
    const option = selectedOption as { value: string } | null;
    setSelectedCategory(option?.value || '');
  };

  // Show error messages
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <main className={styles.page}>
      <form
        ref={formRef}
        action={handleSubmit}
        className={styles.componentContainer}
      >
        <div className={styles.buttonsCnr}>
          <button
            className={styles.updateBtn}
            type="submit"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading Images...' : 'Add Product'}
          </button>
        </div>

        {/* General Information */}
        <div className={styles.block}>
          <div className={styles.heading}>General Information</div>

          <div className={styles.inputGroup}>
            <EditField label="Title" name="title" required />
            <EditField label="Brand" name="brand" />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputCnr}>
              <label>Category *</label>
              <Select
                name="category"
                className={styles.selector}
                options={categoryOptions}
                value={categoryOptions.find(opt => opt.value === selectedCategory)}
                onChange={handleCategoryChange}
                isSearchable={true}
                placeholder="Select category"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputCnr}>
              <label>Description</label>
              <textarea
                name="description"
                rows={6}
                className={styles.textarea}
                placeholder="Product description"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <EditField label="Price" name="price" type="number" step="0.01" required />
            <EditField label="Discount %" name="discountPercentage" type="number" step="0.01" />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.tagCnr}>
              <label>Tags</label>
              <div className={styles.tagsCnr}>
                {tags.map((tag, index) => (
                  <div key={index} className={styles.tag}>
                    <p className={styles.tagName}>{tag}</p>
                    <button
                      type="button"
                      className={styles.xBtn}
                      onClick={() => removeTag(index)}
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        className={styles.xIcon}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className={`${styles.inputCnr} ${styles.addFieldCnr}`}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className={`${styles.info} ${styles.tagInput}`}
                  placeholder="New tag name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className={styles.addFieldBtn}
                  disabled={!newTag.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Specifications */}
        <div className={styles.block}>
          <div className={styles.heading}>Physical Specifications</div>

          <div className={styles.inputGroup}>
            <EditField label="Weight (kg)" name="weight" type="number" step="0.01" />
            <EditField label="Width (cm)" name="width" type="number" step="0.01" />
          </div>

          <div className={styles.inputGroup}>
            <EditField label="Height (cm)" name="height" type="number" step="0.01" />
            <EditField label="Depth (cm)" name="depth" type="number" step="0.01" />
          </div>
        </div>

        {/* Additional Information */}
        <div className={styles.block}>
          <div className={styles.heading}>Additional Information</div>

          <div className={styles.inputGroup}>
            <EditField label="Warranty" name="warrantyInformation" />
            <EditField label="Shipping" name="shippingInformation" />
          </div>

          <div className={styles.inputGroup}>
            <EditField label="Return Policy" name="returnPolicy" />
            <EditField label="Min Order Qty" name="minimumOrderQuantity" type="number" />
          </div>
        </div>

        {/* Images */}
        <div className={styles.block}>
          <div className={styles.heading}>Images</div>

          <div className={styles.inputGroup}>
            <div className={styles.inputCnr}>
              <label htmlFor="imagePicker" className={styles.imagePickerLabel}>
                Add Images
              </label>
              <input
                id="imagePicker"
                className={styles.imagePicker}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                disabled={isUploading}
              />
            </div>
          </div>

          <div className={styles.imageList}>
            {/* Show preview images only */}
            {previewUrls.map((url, index) => (
              <div key={`preview-${index}`} className={styles.imageCnr}>
                <div className={styles.xBtn}>
                  <FontAwesomeIcon
                    className={styles.xIcon}
                    icon={faXmark}
                    onClick={() => removeImage(index)}
                  />
                </div>
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  width={100}
                  height={100}
                  className={styles.image}
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </main>
  );
};

export default AddProduct;