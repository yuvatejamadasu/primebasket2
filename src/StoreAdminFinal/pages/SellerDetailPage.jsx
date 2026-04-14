import React from 'react';
import Layout from '../components/Layout/Layout';
import ProfileHeader from '../components/SellerProfile/ProfileHeader';
import ProductsGrid from '../components/Products/ProductsGrid';
import { sellerData, productsData } from '../data/mockData';
export default function SellerDetailPage({ seller, products, onBack }) {
  const currentSeller = seller || sellerData;
  const currentProducts = products || productsData;

  return (
    <Layout>
      <ProfileHeader seller={currentSeller} onBack={onBack} />
      <ProductsGrid products={currentProducts} />
    </Layout>
  );
}
