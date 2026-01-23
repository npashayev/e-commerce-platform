'use client';

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
import Select from 'react-select';
import Image from 'next/image';
import type { Category, Product } from '@prisma/client';
import { EditField } from '@/components/shared/FormField';
import { updateProductAction } from '@/app/actions/product';
import { useCloudinaryUpload } from '@/lib/hooks/useCloudinaryUpload';
import { useInvalidateProducts } from '@/lib/hooks/useInvalidateProducts';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
  categories: Category[];
  onClose: () => void;
}

const UpdateProductInfo = ({ product, categories, onClose }: Props) => {
  const [tags, setTags] = useState<string[]>(product.tags);
  const [newTag, setNewTag] = useState('');
  const [images, setImages] = useState<string[]>(product.images);
  const [selectedCategory, setSelectedCategory] = useState(product.category);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { uploadImages, isUploading } = useCloudinaryUpload();
  const [state, formAction] = useActionState(updateProductAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  const { invalidateAllProductData } = useInvalidateProducts();

  const categoryOptions = categories.map(cat => ({
    value: cat.slug,
    label: cat.name,
  }));

  const defaultCategoryOption = categoryOptions?.find(
    opt => opt.value === product.category,
  );

  // Handle image file selection (for preview only)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Store files for upload later
    setNewImageFiles(prev => [...prev, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

    // Reset input
    e.target.value = '';
  };

  // Remove existing image
  const handleRemoveExistingImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove new image (not yet uploaded)
  const handleRemoveNewImage = (index: number) => {
    // Get the URL before removing it to revoke it
    const urlToRevoke = previewUrls[index];

    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Revoke the URL after state update
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
      return newUrls;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Upload new images to Cloudinary
      let uploadedImageUrls: string[] = [];
      if (newImageFiles.length > 0) {
        uploadedImageUrls = await uploadImages(newImageFiles);
      }

      // Combine existing images + newly uploaded images
      const allImages = [...images, ...uploadedImageUrls];

      // Build FormData
      const formData = new FormData(
        formRef.current || (e.currentTarget as HTMLFormElement),
      );

      // Add hidden fields
      formData.set('productId', product.id);
      formData.set('category', selectedCategory);
      formData.set('tags', JSON.stringify(tags));
      formData.set('images', JSON.stringify(allImages));

      // Submit via server action
      startTransition(async () => {
        try {
          await formAction(formData);
          invalidateAllProductData();
        } catch (error) {
          if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            invalidateAllProductData();
            throw error;
          }
          throw error;
        }
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to upload images. Please try again.');
      return;
    }
  };

  // Show error messages (success redirects, so no need to show success toast)
  useEffect(() => {
    if (state.error) {
      toast.error(`Error: ${state.error}`);
    }
  }, [state]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={styles.componentContainer}
    >
      <div className={styles.buttonsCnr}>
        <button className={styles.crossBtn} type="button" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <button
          className={styles.updateBtn}
          type="submit"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Update'}
        </button>
      </div>

      {/* General Information */}
      <div className={styles.block}>
        <div className={styles.heading}>General information</div>
        <div className={styles.inputGroup}>
          <EditField
            label="Title"
            value={product.title}
            name="title"
            required
          />
          <EditField label="Brand" value={product.brand} name="brand" />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputCnr}>
            <label>Category</label>
            <Select
              className={styles.selector}
              isSearchable={true}
              options={categoryOptions}
              defaultValue={defaultCategoryOption}
              onChange={option => setSelectedCategory(option?.value || '')}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputCnr}>
            <label>Description</label>
            <textarea
              rows={6}
              className={styles.textarea}
              name="description"
              defaultValue={product.description}
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <EditField
            label="Price"
            value={product.price}
            name="price"
            type="number"
            step="0.01"
            required
          />
          <EditField
            label="Discount percentage"
            value={product.discountPercentage}
            name="discountPercentage"
            type="number"
            step="0.01"
          />
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
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                  >
                    <FontAwesomeIcon icon={faXmark} className={styles.xIcon} />
                  </button>
                </div>
              ))}
            </div>

            <div className={`${styles.inputCnr} ${styles.addFieldCnr}`}>
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className={`${styles.info} ${styles.tagInput}`}
                placeholder="New tag name"
              />
              <button
                type="button"
                onClick={() => {
                  if (newTag.trim()) {
                    setTags([...tags, newTag.trim()]);
                    setNewTag('');
                  }
                }}
                className={styles.addFieldBtn}
                disabled={newTag.trim() === ''}
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
          <EditField
            label="Weight"
            value={product.weight}
            name="weight"
            type="number"
            step="0.01"
          />
          <EditField
            label="Width"
            value={product.dimensions?.width}
            name="width"
            type="number"
            step="0.01"
          />
        </div>

        <div className={styles.inputGroup}>
          <EditField
            label="Height"
            value={product.dimensions?.height}
            name="height"
            type="number"
            step="0.01"
          />
          <EditField
            label="Depth"
            value={product.dimensions?.depth}
            name="depth"
            type="number"
            step="0.01"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className={styles.block}>
        <div className={styles.heading}>Additional Information</div>
        <div className={styles.inputGroup}>
          <EditField
            label="Warranty information"
            value={product.warrantyInformation}
            name="warrantyInformation"
          />
          <EditField
            label="Shipping information"
            value={product.shippingInformation}
            name="shippingInformation"
          />
        </div>

        <div className={styles.inputGroup}>
          <EditField
            label="Return policy"
            value={product.returnPolicy}
            name="returnPolicy"
          />
          <EditField
            label="Minimum order quantity"
            value={product.minimumOrderQuantity}
            name="minimumOrderQuantity"
            type="number"
          />
        </div>
      </div>

      {/* Images */}
      <div className={styles.block}>
        <div className={styles.heading}>Images</div>
        <div className={styles.inputGroup}>
          <div className={styles.inputCnr}>
            <label htmlFor="imagePicker" className={styles.imagePickerLabel}>
              Add images
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
          {/* Existing images */}
          {images.map((url, index) => (
            <div key={`existing-${index}`} className={styles.imageCnr}>
              <div className={styles.imageBtnCnr}>
                <div></div>
                <button
                  type="button"
                  className={styles.xBtn}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveExistingImage(index);
                  }}
                >
                  <FontAwesomeIcon className={styles.xIcon} icon={faXmark} />
                </button>
              </div>
              <Image
                src={url}
                alt="Product image"
                className={styles.image}
                fill
              />
            </div>
          ))}

          {/* New images (preview) */}
          {previewUrls.map((url, index) => (
            <div key={`new-${index}`} className={styles.imageCnr}>
              <div className={styles.imageBtnCnr}>
                <div className={styles.newBadge}>New</div>
                <button
                  type="button"
                  className={styles.xBtn}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveNewImage(index);
                  }}
                >
                  <FontAwesomeIcon className={styles.xIcon} icon={faXmark} />
                </button>
              </div>
              <Image
                src={url}
                alt="New image preview"
                className={styles.image}
                fill
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};

export default UpdateProductInfo;
