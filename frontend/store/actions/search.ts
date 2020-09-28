import { inflateRaw } from 'zlib';
import * as types from '../types';

type SetSearchType = {
  type: typeof types.SET_SEARCH,
  search: string
}
export const setSearch = (search: string): SetSearchType => ({ type: types.SET_SEARCH, search});

export type SearchActionTypes = SetSearchType; 
