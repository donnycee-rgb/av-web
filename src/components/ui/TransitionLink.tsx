import { forwardRef } from 'react';
import { Link as RouterLink, NavLink as RouterNavLink, type LinkProps, type NavLinkProps } from 'react-router-dom';

/**
 * Router links with the camera-iris page transition switched on (View Transitions API —
 * the animation itself lives in styles/global.css). Browsers without support simply change page.
 * Use these instead of importing Link / NavLink from react-router-dom directly.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  return <RouterLink ref={ref} viewTransition {...props} />;
});

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(props, ref) {
  return <RouterNavLink ref={ref} viewTransition {...props} />;
});
