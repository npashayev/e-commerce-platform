import styles from '@/styles/resource-form.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Select from 'react-select';
import Image from 'next/image';
import { Category, Product } from '@prisma/client';
import { EditField } from '@/components/shared/FormField';

interface Props {
  product: Product;
  categories: Category[];
  onClose: () => void;
}

const UpdateProductInfo = ({ product, categories, onClose }: Props) => {
  const [tags, setTags] = useState<string[]>(product.tags);
  const [newTag, setNewTag] = useState('');
  const [images, setImages] = useState<string[]>(product.images);

  const categoryOptions = categories.map(cat => ({
    value: cat.slug,
    label: cat.name,
  }));

  const defaultCategoryOption = categoryOptions?.find(
    opt => opt.value === product.category,
  );

  const handleImageSelect = e => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file), // temporary URL for preview
    }));

    appendImage(newImages); // add to your useFieldArray
    e.target.value = null; // reset input
  };

  return (
    <form onSubmit={() => {}} className={styles.componentContainer}>
      <div className={styles.buttonsCnr}>
        <button className={styles.crossBtn} type="button" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <button className={styles.updateBtn} type="submit">
          Update
        </button>
      </div>

      {/* General Information */}
      <div className={styles.block}>
        <div className={styles.heading}>General information</div>
        <div className={styles.inputGroup}>
          <EditField label="Title" value={product.title} />
          <EditField label="Brand" value={product.brand} />
          <Select
            className={styles.selector}
            isSearchable={true}
            options={categoryOptions}
            defaultValue={defaultCategoryOption}
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputCnr}>
            <label>Description</label>
            <textarea
              rows={6}
              className={styles.textarea}
              name="description"
              value={product.description}
              readOnly
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <EditField label="Price" value={product.price} />
          <EditField
            label="Discount percentage"
            value={product.discountPercentage}
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.tagCnr}>
            <label>Tags</label>
            <div className={styles.tagsCnr}>
              {tags.map((tag, index) => (
                <div key={index} className={styles.tag}>
                  <p className={styles.tagName}>{tag}</p>
                  <button className={styles.xBtn}>
                    <FontAwesomeIcon
                      icon={faXmark}
                      onClick={() => setTags(tags.filter(t => t != tag))}
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
          <EditField label="Weight" value={product.weight} />
          <EditField label="Width" value={product.dimensions?.width} />
        </div>

        <div className={styles.inputGroup}>
          <EditField label="Height" value={product.dimensions?.height} />
          <EditField label="Depth" value={product.dimensions?.depth} />
        </div>
      </div>

      {/* Additional Information */}
      <div className={styles.block}>
        <div className={styles.heading}>Additional Information</div>
        <div className={styles.inputGroup}>
          <EditField
            label="Warranty information"
            value={product.warrantyInformation}
          />
          <EditField
            label="Shipping information"
            value={product.shippingInformation}
          />
        </div>

        <div className={styles.inputGroup}>
          <EditField label="Return policy" value={product.returnPolicy} />
          <EditField
            label="Minimum order quantity"
            value={product.minimumOrderQuantity}
          />
        </div>
      </div>

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
            />
          </div>
        </div>

        <div className={styles.imageList}>
          {imageFields.map((field, index) => (
            <div key={field.id} className={styles.imageCnr}>
              <button className={styles.xBtn}>
                <FontAwesomeIcon
                  className={styles.xIcon}
                  icon={faXmark}
                  onClick={() => removeImage(index)}
                />
              </button>
              <Image
                src={field.url}
                alt="image"
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
