import type { Access } from 'payload';

/** Anyone, including logged-out readers. */
export const anyone: Access = () => true;

/** Any logged-in staff account (admin, editor, or author). */
export const staffOnly: Access = ({ req }) => Boolean(req.user);

export const adminOrEditor: Access = ({ req }) =>
  req.user?.role === 'admin' || req.user?.role === 'editor';

export const adminOnly: Access = ({ req }) => req.user?.role === 'admin';

/**
 * Public readers see only published docs; staff see drafts too.
 * Use on collections with versions.drafts enabled.
 */
export const publishedOrStaff: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: 'published' } };
};
