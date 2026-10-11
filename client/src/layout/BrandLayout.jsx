// Brand sub-site wrapper (Book 1 Part B §4): scopes the accent tokens with data-brand and docks the sub-nav.
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PageLoader } from '../components';
import BrandSubNav from './BrandSubNav.jsx';

export default function BrandLayout({ brand }) {
  return (
    <div data-brand={brand} className="brand-layout">
      <BrandSubNav brand={brand} />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
