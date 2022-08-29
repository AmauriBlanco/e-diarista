import { UserInterface } from 'data/@Types/UserInterface';
import React, { PropsWithChildren, useRef } from 'react';
import UserProfileAvatar from 'ui/components/data-display/UserProfileAvatar/UserProfileAvatar';
import { UserHeaderMenuContainer, UserMenu } from './UserHeaderMenu.styled';
import Link from 'ui/components/navigation/Link/Link';

export interface UserHeaderMenuProps {
  user: UserInterface;
  isMenuOpen: boolean;
  onClick: (event: React.MouseEvent) => void;
  onLogout?: () => void;
  onMenuClick: (event: React.MouseEvent) => void;
  onMenuClose: (event: React.MouseEvent) => void;
}

const UserHeaderMenu: React.FC<PropsWithChildren<UserHeaderMenuProps>> = (
  props
) => {
  const containerRef = useRef(null);
  return (
    <UserHeaderMenuContainer ref={containerRef}>
      <UserProfileAvatar user={props.user} onClick={props.onClick} />
      <UserMenu
        open={props.isMenuOpen}
        anchorEl={containerRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={props.onMenuClose}
        onClick={props.onMenuClick}
      >
        <li>
          <Link href="/alterar-dados" mui={{ color: 'inherit' }}>
            Alterar Dados
          </Link>
        </li>
        <li>
          <Link href="" onClick={props.onLogout} mui={{ color: 'inherit' }}>
            Sair
          </Link>
        </li>
      </UserMenu>
    </UserHeaderMenuContainer>
  );
};

export default UserHeaderMenu;
