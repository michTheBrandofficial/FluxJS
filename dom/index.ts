import { callEffect } from '../primitives';
import { Signal, Store } from '../primitives/classes';
import {
  raise,
  addChildren,
  handleDirectives_,
  warn,
  getStoreValue,
  getSignalValue,
  checkDataType,
} from './helpers';
import { PROP_ALIASES, SVG_ELEMENTTAGS, SVG_NAMESPACE } from './utilVars';

// Global store for the store class and signals.
window['$$__NixixStore'] = {};
export const nixixStore = window.$$__NixixStore;

const Nixix = {
  create: function (
    tagNameFC: target,
    props: Proptype,
    ...children: ChildrenType
  ): Element | Array<Element | string | Signal> | undefined {
    if (typeof tagNameFC === 'string') {
      if (tagNameFC === 'fragment') {
        if (children !== null) return children;
        return [];
      } else {
        const element = !SVG_ELEMENTTAGS.includes(tagNameFC)
          ? document.createElement(tagNameFC)
          : document.createElementNS(SVG_NAMESPACE, tagNameFC);
        setProps(props, element);
        setChildren(children, element);
        return element;
      }
    } else return buildComponent(tagNameFC, props, children);
  },
  handleDirectives: handleDirectives_,
  handleDynamicAttrs: ({
    element,
    attrPrefix,
    attrName,
    attrValue,
  }: DynamicAttrType) => {
    const attrSuffix = attrName.slice(attrPrefix.length);
    const newAttrName = `${attrPrefix.replace(':', '-')}${attrSuffix}`;
    setAttribute(element, newAttrName, attrValue);
  },
};

function isNull(value: any) {
  return value === null || value === undefined;
}

function entries(obj: object) {
  return Object.entries(obj);
}

function isReactiveValue(value: Signal | Store, prop: string) {
  if (value instanceof Signal || value instanceof Store) {
    raise(`The ${prop} prop value cannot be reactive.`);
    return true;
  }
}

function setAttribute(
  element: NixixElementType,
  attrName: string,
  attrValue: ValueType,
  type?: TypeOf
) {
  if (isNull(attrValue))
    return warn(
      `The ${attrName} prop cannot be null or undefined. Skipping attribute parsing.`
    );
  if (attrValue instanceof Signal) {
    callEffect(() => {
      type === 'propertyAttribute'
        ? (element[attrName] = getSignalValue(attrValue))
        : element.setAttribute(attrName, getSignalValue(attrValue));
    }, [attrValue]);
  } else if (attrValue instanceof Store) {
    callEffect(() => {
      type === 'propertyAttribute'
        ? (element[attrName] = getStoreValue(attrValue))
        : element.setAttribute(attrName, getStoreValue(attrValue));
    }, [attrValue]);
  } else if (checkDataType(attrValue)) {
    type === 'propertyAttribute'
      ? (element[attrName] = attrValue)
      : element.setAttribute(attrName, attrValue as any);
  }
}

function setStyle(element: NixixElementType, styleValue: StyleValueType) {
  if (isNull(styleValue))
    return warn(
      `The style prop cannot be null or undefined. Skipping attribute parsing.`
    );
  const cssStyleProperties = entries(styleValue) as [string, ValueType][];
  for (let [property, value] of cssStyleProperties) {
    if (isNull(value)) {
      warn(
        `The ${property} CSS property cannot be null or undefined. Skipping CSS property parsing.`
      );
      continue;
    }

    if (value instanceof Signal) {
      callEffect(() => {
        element['style'][property] = getSignalValue(value as Signal);
      }, [value]);
    } else if (value instanceof Store) {
      callEffect(() => {
        element['style'][property] = getStoreValue(value as Store);
      }, [value]);
    } else {
      element['style'][property] = value;
    }
  }
}

function setProps(props: Proptype | null, element: NixixElementType) {
  if (props) {
    props = Object.entries(props);
    for (const [k, v] of props as [string, StyleValueType | ValueType][]) {
      if (k in PROP_ALIASES) {
        const mayBeClass = PROP_ALIASES[k]['$'];
        setAttribute(
          element,
          mayBeClass === 'className' ? 'class' : mayBeClass,
          v as ValueType,
          mayBeClass === 'className' ? 'regularAttribute' : 'propertyAttribute'
        );
      } else if (k === 'style') {
        setStyle(element, v as unknown as StyleValueType);
      } else if (k.startsWith('on:')) {
        if (isNull(v))
          return warn(
            `The ${k} prop cannot be null or undefined. Skipping prop parsing`
          );
        isReactiveValue(v as any, k);
        const domAttribute = k.slice(3);
        element.addEventListener(domAttribute, v as any);
      } else if (k.startsWith('aria:')) {
        Nixix.handleDynamicAttrs({
          element,
          attrPrefix: 'aria:',
          attrName: k,
          attrValue: v as ValueType,
        });
      } else if (k.startsWith('stroke:')) {
        Nixix.handleDynamicAttrs({
          element,
          attrPrefix: 'stroke:',
          attrName: k,
          attrValue: v as ValueType,
        });
      } else if (k.startsWith('bind:')) {
        if (isNull(v))
          return raise(
            `The ${k} directive value cannot be null or undefined. Skipping directive parsing`
          );
        isReactiveValue(v as any, k);
        Nixix.handleDirectives(
          k.slice(5),
          v as unknown as MutableRefObject,
          element
        );
      } else {
        setAttribute(element, k, v as ValueType);
      }
    }
  }
}

function setChildren(children: ChildrenType | null, element: NixixElementType) {
  if (children != undefined || children != null) {
    addChildren(children, element);
  }
}

function buildComponent(
  tagNameFC: target,
  props: Proptype,
  ...children: ChildrenType
) {
  if (typeof tagNameFC === 'function') {
    if (props != null && props != undefined) {
      if (children.length !== 0) {
        props.children = children;
        return tagNameFC(props);
      }
      return tagNameFC(props);
    } else if (children.length !== 0) {
      props = { children: children };
      return tagNameFC(props);
    }
    return tagNameFC();
  }
}

function render(element: NixixNode, root: HTMLElement) {
  if (!Array.isArray(element)) {
    root.append(element);
  } else {
    element.forEach((el) => {
      render(el, root);
    });
  }
  doBgWork(root);
}

async function doBgWork(root: Element) {
  await Promise.resolve();
  nixixStore['$$__routeProvider'] = root;
}

export default Nixix;
export { render };
