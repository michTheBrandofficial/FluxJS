import { LiveFragment } from '../../live-fragment/types';
import '../../types/index';
/**
 * jsxFactory - Nixix.create()
 */
declare const Nixix: {
  create: <T extends keyof JSX.IntrinsicElements>(
    target: T | ((props: {}) => JSX.Element) | 'fragment',
    props: JSX.IntrinsicElements[T] | null,
    ...children: (string | Node)[]
  ) => Element;
};
/**
 * render function
 * @param element JSX.Element to render
 * @param root element which element will be appended to
 */
export function render(element: JSX.Element, root: HTMLElement): void;

interface $$__NixixStore {
  $$__lastReactionProvider?: 'signal' | 'store';
  $$__routeStore?: {
    errorRoute?: string;
    provider?: LiveFragment;
    [path: string]: string | Node | (string | Node)[] | any;
  };
  $$__commonRouteProvider?: HTMLSpanElement;
  Store?: {
    // @ts-expect-error
    [index: string]: WindowStoreObject;
  };
  SignalStore?: {
    [index: string]: {
      value: any;
      effect?: CallableFunction[];
    };
  };
  storeCount?: number;
  diffStore?: (id: number) => void;
  signalCount?: number;
  diffSignal?: (id: number) => void;
  $$__For?: {
    [id: string]: string[] | Element[] | JSX.Element[];
  };

  refCount?: number;
}

export const nixixStore: $$__NixixStore;

export function getStoreValue(store: any): any;

export default Nixix;
