import { GetStaticProps } from 'next';
import api from './api';
import ApiProps from './api-props';

export const getStaticProps: GetStaticProps<ApiProps> = async () => ({
  props: { api }
})
