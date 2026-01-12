'use client';
import styles from './slide-show.module.scss';
import headphone from '@/assets/slideshow/headphone.webp';
import asus from '@/assets/slideshow/asus.webp';
import chanel from '@/assets/slideshow/chanel.webp';
import iphone from '@/assets/slideshow/iphone-13.webp';
import rolex from '@/assets/slideshow/rolex.webp';
import Link from 'next/link';
import Image from 'next/image';
import useSlideshow from '@/lib/hooks/useSlideShow';

const slideShowImages = [
  { title: 'Apple AirPods Max Silver', link: '/products/101', src: headphone },
  {
    title: 'Asus Zenbook Pro Dual Screen Laptop',
    link: '/products/79',
    src: asus,
  },
  { title: 'Chanel Coco Noir Eau De', link: '/products/7', src: chanel },
  { title: 'iPhone 13 Pro', link: '/products/123', src: iphone },
  { title: 'Rolex Submariner Watch', link: '/products/98', src: rolex },
];

const SlideShow = () => {
  const { activeIndex } = useSlideshow({
    length: slideShowImages.length,
  });

  return (
    <div className={styles.slideshowCnr}>
      {slideShowImages.map((image, index) => (
        <Link className={`${styles.link} ${activeIndex === index ? styles.active : ''}`} key={index} href={image.link}>
          <Image className={styles.image} src={image.src} alt={image.title} title={image.title} />
        </Link>
      ))}
    </div>
  );
};

export default SlideShow;
