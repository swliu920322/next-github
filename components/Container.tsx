import { cloneElement } from 'react';

export function Container({ children, renderer = <div />, ...others }: any) {
  return cloneElement(renderer, {
    children,
    ...others
  });
}