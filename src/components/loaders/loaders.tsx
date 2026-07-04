import React from 'react';
import styles from './loaders.module.css'; 

export const FlippingCubeLoader: React.FC = () => {
  return <div className={styles.flippingCube} aria-label="Loading content" />;
};

export const PolygonLoader: React.FC = () => {
  return <div className={styles.polygon} aria-label="Loading content" />;
};