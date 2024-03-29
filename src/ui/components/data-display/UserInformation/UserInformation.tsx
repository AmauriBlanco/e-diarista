import { SystemProps } from "@mui/system";
import React, { PropsWithChildren } from "react";
//import {} from '@mui/material';
import {
  UseInformationContainer,
  UserName,
  UserDescription,
  AvatarStyled,
  RatingStyled,
} from "./UserInformation.styled";

export interface UserInformationProps {
  name: string;
  picture: string;
  rating: number;
  description?: string;
  isRating?: boolean;
  sx?: SystemProps;
}

const UserInformation: React.FC<PropsWithChildren<UserInformationProps>> = ({
  sx,
  picture,
  name,
  rating,
  description,
  isRating,
}) => {
  return (
    <UseInformationContainer sx={sx} isRating={isRating}>
      <AvatarStyled src={picture}>{name[0]}</AvatarStyled>
      <RatingStyled value={rating} readOnly />
      <UserName>{name}</UserName>
      <UserDescription>{description}</UserDescription>
    </UseInformationContainer>
  );
};

export default UserInformation;
