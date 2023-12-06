import {
  StoreObject as NixixStoreObject,
  Signal,
  Store,
} from './primitives/types';

// These global types are used for the development of this project.
declare global {
  type NixixElementType = HTMLElement | SVGElement;

  type target =
    | keyof HTMLElementTagNameMap
    | keyof SVGElementTagNameMap
    | ((props?: {} | null) => Element)
    | 'fragment';
  type Proptype = { children?: any; [index: string]: any } | null | undefined;
  type ChildrenType = Array<Element | string | Signal>;

  type ValueType = Signal | Store | string;

  type StyleValueType = { [key: string]: ValueType };

  type DynamicAttrType = {
    element: HTMLElement | SVGElement;
    attrPrefix: string;
    attrName: string;
    attrValue: ValueType;
  };

  type TypeOf =
    | 'propertyAttribute'
    | 'regularAttribute'
    | 'styleProp'
    | 'childTextNode';

  interface WindowStoreObject {
    value: any;
    effect?: CallableFunction[];
    cleanup?: () => void;
  }
  interface Window {
    $$__NixixStore?: {
      $$__lastReactionProvider?: 'signal' | 'store';
      commentForLF: boolean;
      $$__routeStore?: {
        errorPage?: {
          errorRoute: string;
        };
        common?: boolean;
        [path: string]: string | Node | (string | Node)[] | any;
      };
      Store?: {
        [index: string]: WindowStoreObject;
      };
      SignalStore?: {
        [index: string]: {
          value: any;
          effect?: CallableFunction[];
        };
      };
      storeCount?: number;
      signalCount?: number;
      refCount?: number;
    };
  }

  type SignalObject<S extends any> = { value: S; $$__id?: number };

  interface StoreObject {
    $$__id: string | number;
    $$__value?: any;
    $$__name?: string;
  }

  type SetSignalDispatcher<S> = (newValue: S | ((prev?: S) => S)) => void;
  type SetStoreDispatcher<S> = (newValue: S | (() => S)) => void;

  interface SuspenseProps {
    fallback: string | Element | Signal | (string | Element | Signal)[];
    children?: Promise<any>[];
    onError?: string | Element | Signal;
  }

  interface ForProps {
    fallback: string | Element | Signal;
    children?: ((value: any, index?: number) => JSX.Element)[];
    each: NixixStoreObject<any[]>;
  }

  interface ShowProps {
    when: () => boolean;
    switch: NixixStoreObject<any> | SignalObject<any>;
    children: any;
    fallback: any;
  }

  var window: Window & typeof globalThis;

  interface Current extends Element {}

  interface MutableRefObject {
    current: Current & object;
    refId: number;
    nextElementSibling: Element['nextElementSibling'] | null;
    prevElementSibling: Element['previousElementSibling'] | null;
    parent: Element['parentElement'] | null;
  }

  // @ts-ignore
  interface NixixNode extends Node, String, JSX.Element {}
}
