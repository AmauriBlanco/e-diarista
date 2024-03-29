import { Button, Grid, Skeleton, Typography } from '@mui/material';
import { UserInterface } from 'data/@Types/UserInterface';
import React, { PropsWithChildren } from 'react';
import { AvatarIcon, UserAvatar } from './UserProfileAvatar.styled';
//import {} from '@mui/material';
//import {} from './UserProfileAvatar.styled'

export interface UserProfileAvatarProps {
  user: UserInterface;
  onClick?: (event: React.MouseEvent) => void;
}

const UserProfileAvatar: React.FC<PropsWithChildren<UserProfileAvatarProps>> = (
  props
) => {
  const hasUser = props.user.nome_completo.length > 0;
  return (
    <Button onClick={props.onClick} color={'inherit'}>
      <Grid spacing={1} container wrap="nowrap">
        <Grid item>
          {hasUser ? (
            <UserAvatar
              alt={props.user.nome_completo}
              src={props.user.foto_usuario}
            >
              {props.user.nome_completo[0]}
            </UserAvatar>
          ) : (
            <Skeleton width={40} height={40} variant={'circular'} />
          )}
        </Grid>
        <Grid item container spacing={1} alignItems={'center'}>
          <Grid item>
            {hasUser ? (
              <Typography variant="body2" noWrap>
                {props.user.nome_completo}
              </Typography>
            ) : (
              <Skeleton width={100} variant={'text'} animation={'wave'} />
            )}
          </Grid>
          <Grid item>
            <AvatarIcon className="twf-caret-down" {...props} />
          </Grid>
        </Grid>
      </Grid>
    </Button>
  );
};

export default UserProfileAvatar;
