import LightRays from '@/components/react-bits/light-rays/LightRays';
import styles from './page.module.scss';
import TextType from '@/components/react-bits/text-type/TextType';
import SlideShow from './components/SlideShow';
import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants/seo';

export const metadata: Metadata = {
  title: `${SITE_NAME} - Discover Products You'll Love`,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} - Discover Products You'll Love`,
    description: SITE_DESCRIPTION,
  },
};

const HomePage = () => {
  return (
    <main className={styles.page}>
      <div className={styles.text}>
        <h1 className={styles.heading}>Discover Products You’ll Love</h1>
        <TextType
          text={[
            'Explore our carefully curated collection of top-quality products, each thoughtfully selected to make your life easier, more convenient, and enjoyable every day.',
            'From the latest cutting-edge technology to timeless classics, find exactly what you need with just a few clicks to enhance your home, work, or personal life with style and efficiency.',
          ]}
          className={styles.body}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
        <Link href="/products?category=all" className={styles.exploreBtn}>
          Explore
        </Link>
      </div>

      <SlideShow />

      <div className={styles.lightRaysCnr}>
        <LightRays
          className="custom-rays"
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>
    </main>
  );
};

export default HomePage;
