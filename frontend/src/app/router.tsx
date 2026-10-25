import { createBrowserRouter } from 'react-router-dom';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { HomePage } from '@/pages/home/HomePage';
import { WorkPage } from '@/pages/work/WorkPage';
import { ProjectPage } from '@/pages/project/ProjectPage';
import { StudioPage } from '@/pages/studio/StudioPage';
import { ContactPage } from '@/pages/contact/ContactPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

/** Every route on the site, in one place. */
export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/work', element: <WorkPage /> },
      { path: '/work/:slug', element: <ProjectPage /> },
      { path: '/studio', element: <StudioPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
