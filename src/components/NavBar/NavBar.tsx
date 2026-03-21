import { useScrollDir } from '../../hooks/useScrollDir';
import { StaggeredMenu, type StaggeredMenuItem, type StaggeredMenuSocialItem } from './StaggeredMenu';

export function NavBar() {
  const { visible } = useScrollDir(76);

  const items: StaggeredMenuItem[] = [
    { label: 'Gallery', ariaLabel: 'View Artwork Gallery', link: '/gallery' },
    { label: 'Exhibit', ariaLabel: 'Experience 3D Gallery', link: '/exhibit' },
    { label: 'About', ariaLabel: 'Learn about Deepak Patil', link: '/about' },
    { label: 'Inquiry', ariaLabel: 'Make an Inquiry', link: '/inquiry' },
    { label: 'Admin', ariaLabel: 'Admin Dashboard', link: '/admin' }
  ];

  const socialItems: StaggeredMenuSocialItem[] = [
    { label: 'Instagram', link: 'https://www.instagram.com/deepakpatil2430' },
    { label: 'Facebook', link: 'https://www.facebook.com/deepak.patil.621222' },
    { label: 'WhatsApp', link: 'https://wa.me/919890646123' }
  ];

  return (
    <StaggeredMenu
      items={items}
      socialItems={socialItems}
      logoLabel="Deepak Patil"
      isFixed={true}
      visible={visible}
    />
  );
}
