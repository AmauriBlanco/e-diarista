import {
  Toolbar,
  Container,
  MenuList,
  Divider,
  MenuItem,
  IconButton,
} from "@mui/material";
import Link from "ui/components/navigation/Link/Link";
import {
  HeaderAppBar,
  HeaderLogo,
  ButtonsContainer,
  HeaderDrawer,
} from "./Header.styled";
import RoundedButton from "ui/components/inputs/RoundedButton/RoundedButton";

const Header: React.FC = () => {
  return <HeaderMobile />;
};

export default Header;

const HeaderDesktop: React.FC = () => {
  return (
    <HeaderAppBar>
      <Toolbar component={Container}>
        <Link href="/">
          <HeaderLogo src="/img/logos/logo.svg" alt="E-diarista" />
        </Link>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        <ButtonsContainer>
          <Link
            Component={RoundedButton}
            mui={{ variant: "contained", color: "primary" }}
            href="/cadastro/diarista"
          >
            Seja um(a) diarista
          </Link>
          <Link href="/login">Login</Link>
        </ButtonsContainer>
      </Toolbar>
    </HeaderAppBar>
  );
};

const HeaderMobile: React.FC = () => {
  return (
    <HeaderAppBar>
      <Toolbar component={Container}>
        <IconButton color={"inherit"}>
          <i className="twf-bars" />
        </IconButton>
        <Link href="/">
          <HeaderLogo src="/img/logos/logo.svg" alt="E-diarista" />
        </Link>
        <HeaderDrawer open={false}>
          <MenuList>
            <Link href="/login" Component={MenuItem}>
              Login
            </Link>
            <Divider />
            <Link href="/cadastro/diarista" Component={MenuItem}>
              Seja um(a) diarista
            </Link>
          </MenuList>
        </HeaderDrawer>
      </Toolbar>
    </HeaderAppBar>
  );
};