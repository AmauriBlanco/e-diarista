import { ComponentMeta, ComponentStory } from "@storybook/react";
import { UserType } from "data/@Types/UserInterface";

import UserHeaderMenu from "./UserHeaderMenu";

export default {
  title: "navigation/UserHeaderMenu",
  component: UserHeaderMenu,
} as ComponentMeta<typeof UserHeaderMenu>;

const Template: ComponentStory<typeof UserHeaderMenu> = (args) => (
  <UserHeaderMenu {...args} />
);

export const Default = Template.bind({});

Default.args = {
  user: {
    nome_completo: 'Amauri Blanco',
    nascimento: '1990-07-07',
    cpf: '99999999999',
    email: 'abc@def.com',
    foto_usuario: 'https://github.com/amauriblanco.png',
    telefone: '(99) 99999-9999',
    tipo_usuario: UserType.Cliente,
    reputacao: 0,
    password: '',
    chave_pix: '',
  },
  isMenuOpen: false,
};