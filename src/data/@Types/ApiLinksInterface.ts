const links = [
  {
    type: 'Post',
    uri: '/api/cadastrar-cliente',
    rel: 'cadastrar',
  },
  {
    type: 'GET',
    uri: '/api/cadastrar-cliente',
    rel: 'buscar_cliente',
  },
];
export interface ApiLinksInterface {
  type: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  rel: string;
  uri: string;
}
