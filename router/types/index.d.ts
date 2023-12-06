import {
  AnchorHTMLAttributes,
  ExoticComponent,
  HTMLAttributes,
  NixixNode,
  RouteExoticComponent,
  ValueType,
} from '../../types';

export interface LoaderProps {
  params: {
    [id: string]: string;
  }
  /**
   * Experimental *use at your own risk*
   */
  request: Request;
}


export interface LoaderFunction {
  (config: LoaderProps): Promise<any>;
}

export interface ActionFunction {
  (config: any): Promise<any>;
}

export type RoutePath = string;
export interface RouteLink<T extends string>
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: NixixNode;
  to: ValueType<T>;
}
export interface RouteConfig<T extends string> {
  element: NixixNode;
  children?: NixixNode;
  path?: T;
  errorRoute?: boolean;
  loader?: LoaderFunction;
  action?: ActionFunction;
}

export type PathToRoute = `/${string}`;
declare const Link: <T extends PathToRoute>(props: RouteLink<T>) => JSX.Element;
declare const Routes: ExoticComponent<{
  children?: NixixNode;
}>;
declare const Route: <T extends PathToRoute>(props: RouteConfig<T>) => someView;
declare const Outlet: (props?: HTMLAttributes<HTMLSpanElement>) => someView;
/**
 * ```jsx
 *  Should be used to programmatically switch routes.
 *
 *  import { Router } from 'nixix/router';
 *  function signUp() {
      // code goes here
      Router.push('/home')
 }
 * ```
 */
declare const Router: RouteExoticComponent<{
  push: <P extends PathToRoute>(path: P) => void;
}>;

declare const callRouter: () => { router: typeof Router; };

export { Link, Routes, Route, Outlet, Router, callRouter };
