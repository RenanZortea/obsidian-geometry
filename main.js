"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => GeometryPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// node_modules/yaml/browser/dist/nodes/identity.js
var ALIAS = Symbol.for("yaml.alias");
var DOC = Symbol.for("yaml.document");
var MAP = Symbol.for("yaml.map");
var PAIR = Symbol.for("yaml.pair");
var SCALAR = Symbol.for("yaml.scalar");
var SEQ = Symbol.for("yaml.seq");
var NODE_TYPE = Symbol.for("yaml.node.type");
var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
function isCollection(node) {
  if (node && typeof node === "object")
    switch (node[NODE_TYPE]) {
      case MAP:
      case SEQ:
        return true;
    }
  return false;
}
function isNode(node) {
  if (node && typeof node === "object")
    switch (node[NODE_TYPE]) {
      case ALIAS:
      case MAP:
      case SCALAR:
      case SEQ:
        return true;
    }
  return false;
}
var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;

// node_modules/yaml/browser/dist/visit.js
var BREAK = Symbol("break visit");
var SKIP = Symbol("skip children");
var REMOVE = Symbol("remove node");
function visit(node, visitor) {
  const visitor_ = initVisitor(visitor);
  if (isDocument(node)) {
    const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
    if (cd === REMOVE)
      node.contents = null;
  } else
    visit_(null, node, visitor_, Object.freeze([]));
}
visit.BREAK = BREAK;
visit.SKIP = SKIP;
visit.REMOVE = REMOVE;
function visit_(key, node, visitor, path) {
  const ctrl = callVisitor(key, node, visitor, path);
  if (isNode(ctrl) || isPair(ctrl)) {
    replaceNode(key, path, ctrl);
    return visit_(key, ctrl, visitor, path);
  }
  if (typeof ctrl !== "symbol") {
    if (isCollection(node)) {
      path = Object.freeze(path.concat(node));
      for (let i = 0; i < node.items.length; ++i) {
        const ci = visit_(i, node.items[i], visitor, path);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK)
          return BREAK;
        else if (ci === REMOVE) {
          node.items.splice(i, 1);
          i -= 1;
        }
      }
    } else if (isPair(node)) {
      path = Object.freeze(path.concat(node));
      const ck = visit_("key", node.key, visitor, path);
      if (ck === BREAK)
        return BREAK;
      else if (ck === REMOVE)
        node.key = null;
      const cv = visit_("value", node.value, visitor, path);
      if (cv === BREAK)
        return BREAK;
      else if (cv === REMOVE)
        node.value = null;
    }
  }
  return ctrl;
}
async function visitAsync(node, visitor) {
  const visitor_ = initVisitor(visitor);
  if (isDocument(node)) {
    const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
    if (cd === REMOVE)
      node.contents = null;
  } else
    await visitAsync_(null, node, visitor_, Object.freeze([]));
}
visitAsync.BREAK = BREAK;
visitAsync.SKIP = SKIP;
visitAsync.REMOVE = REMOVE;
async function visitAsync_(key, node, visitor, path) {
  const ctrl = await callVisitor(key, node, visitor, path);
  if (isNode(ctrl) || isPair(ctrl)) {
    replaceNode(key, path, ctrl);
    return visitAsync_(key, ctrl, visitor, path);
  }
  if (typeof ctrl !== "symbol") {
    if (isCollection(node)) {
      path = Object.freeze(path.concat(node));
      for (let i = 0; i < node.items.length; ++i) {
        const ci = await visitAsync_(i, node.items[i], visitor, path);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK)
          return BREAK;
        else if (ci === REMOVE) {
          node.items.splice(i, 1);
          i -= 1;
        }
      }
    } else if (isPair(node)) {
      path = Object.freeze(path.concat(node));
      const ck = await visitAsync_("key", node.key, visitor, path);
      if (ck === BREAK)
        return BREAK;
      else if (ck === REMOVE)
        node.key = null;
      const cv = await visitAsync_("value", node.value, visitor, path);
      if (cv === BREAK)
        return BREAK;
      else if (cv === REMOVE)
        node.value = null;
    }
  }
  return ctrl;
}
function initVisitor(visitor) {
  if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
    return Object.assign({
      Alias: visitor.Node,
      Map: visitor.Node,
      Scalar: visitor.Node,
      Seq: visitor.Node
    }, visitor.Value && {
      Map: visitor.Value,
      Scalar: visitor.Value,
      Seq: visitor.Value
    }, visitor.Collection && {
      Map: visitor.Collection,
      Seq: visitor.Collection
    }, visitor);
  }
  return visitor;
}
function callVisitor(key, node, visitor, path) {
  if (typeof visitor === "function")
    return visitor(key, node, path);
  if (isMap(node))
    return visitor.Map?.(key, node, path);
  if (isSeq(node))
    return visitor.Seq?.(key, node, path);
  if (isPair(node))
    return visitor.Pair?.(key, node, path);
  if (isScalar(node))
    return visitor.Scalar?.(key, node, path);
  if (isAlias(node))
    return visitor.Alias?.(key, node, path);
  return void 0;
}
function replaceNode(key, path, node) {
  const parent = path[path.length - 1];
  if (isCollection(parent)) {
    parent.items[key] = node;
  } else if (isPair(parent)) {
    if (key === "key")
      parent.key = node;
    else
      parent.value = node;
  } else if (isDocument(parent)) {
    parent.contents = node;
  } else {
    const pt = isAlias(parent) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${pt} parent`);
  }
}

// node_modules/yaml/browser/dist/doc/directives.js
var escapeChars = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
};
var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
var Directives = class _Directives {
  constructor(yaml, tags) {
    this.docStart = null;
    this.docEnd = false;
    this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
    this.tags = Object.assign({}, _Directives.defaultTags, tags);
  }
  clone() {
    const copy = new _Directives(this.yaml, this.tags);
    copy.docStart = this.docStart;
    return copy;
  }
  /**
   * During parsing, get a Directives instance for the current document and
   * update the stream state according to the current version's spec.
   */
  atDocument() {
    const res = new _Directives(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = true;
        break;
      case "1.2":
        this.atNextDocument = false;
        this.yaml = {
          explicit: _Directives.defaultYaml.explicit,
          version: "1.2"
        };
        this.tags = Object.assign({}, _Directives.defaultTags);
        break;
    }
    return res;
  }
  /**
   * @param onError - May be called even if the action was successful
   * @returns `true` on success
   */
  add(line, onError) {
    if (this.atNextDocument) {
      this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
      this.tags = Object.assign({}, _Directives.defaultTags);
      this.atNextDocument = false;
    }
    const parts = line.trim().split(/[ \t]+/);
    const name = parts.shift();
    switch (name) {
      case "%TAG": {
        if (parts.length !== 2) {
          onError(0, "%TAG directive should contain exactly two parts");
          if (parts.length < 2)
            return false;
        }
        const [handle, prefix] = parts;
        this.tags[handle] = prefix;
        return true;
      }
      case "%YAML": {
        this.yaml.explicit = true;
        if (parts.length !== 1) {
          onError(0, "%YAML directive should contain exactly one part");
          return false;
        }
        const [version] = parts;
        if (version === "1.1" || version === "1.2") {
          this.yaml.version = version;
          return true;
        } else {
          const isValid = /^\d+\.\d+$/.test(version);
          onError(6, `Unsupported YAML version ${version}`, isValid);
          return false;
        }
      }
      default:
        onError(0, `Unknown directive ${name}`, true);
        return false;
    }
  }
  /**
   * Resolves a tag, matching handles to those defined in %TAG directives.
   *
   * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
   *   `'!local'` tag, or `null` if unresolvable.
   */
  tagName(source, onError) {
    if (source === "!")
      return "!";
    if (source[0] !== "!") {
      onError(`Not a valid tag: ${source}`);
      return null;
    }
    if (source[1] === "<") {
      const verbatim = source.slice(2, -1);
      if (verbatim === "!" || verbatim === "!!") {
        onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
        return null;
      }
      if (source[source.length - 1] !== ">")
        onError("Verbatim tags must end with a >");
      return verbatim;
    }
    const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
    if (!suffix)
      onError(`The ${source} tag has no suffix`);
    const prefix = this.tags[handle];
    if (prefix) {
      try {
        return prefix + decodeURIComponent(suffix);
      } catch (error) {
        onError(String(error));
        return null;
      }
    }
    if (handle === "!")
      return source;
    onError(`Could not resolve tag: ${source}`);
    return null;
  }
  /**
   * Given a fully resolved tag, returns its printable string form,
   * taking into account current tag prefixes and defaults.
   */
  tagString(tag) {
    for (const [handle, prefix] of Object.entries(this.tags)) {
      if (tag.startsWith(prefix))
        return handle + escapeTagName(tag.substring(prefix.length));
    }
    return tag[0] === "!" ? tag : `!<${tag}>`;
  }
  toString(doc) {
    const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
    const tagEntries = Object.entries(this.tags);
    let tagNames;
    if (doc && tagEntries.length > 0 && isNode(doc.contents)) {
      const tags = {};
      visit(doc.contents, (_key, node) => {
        if (isNode(node) && node.tag)
          tags[node.tag] = true;
      });
      tagNames = Object.keys(tags);
    } else
      tagNames = [];
    for (const [handle, prefix] of tagEntries) {
      if (handle === "!!" && prefix === "tag:yaml.org,2002:")
        continue;
      if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
        lines.push(`%TAG ${handle} ${prefix}`);
    }
    return lines.join("\n");
  }
};
Directives.defaultYaml = { explicit: false, version: "1.2" };
Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };

// node_modules/yaml/browser/dist/doc/anchors.js
function anchorIsValid(anchor) {
  if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
    const sa = JSON.stringify(anchor);
    const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
    throw new Error(msg);
  }
  return true;
}
function anchorNames(root) {
  const anchors = /* @__PURE__ */ new Set();
  visit(root, {
    Value(_key, node) {
      if (node.anchor)
        anchors.add(node.anchor);
    }
  });
  return anchors;
}
function findNewAnchor(prefix, exclude) {
  for (let i = 1; true; ++i) {
    const name = `${prefix}${i}`;
    if (!exclude.has(name))
      return name;
  }
}
function createNodeAnchors(doc, prefix) {
  const aliasObjects = [];
  const sourceObjects = /* @__PURE__ */ new Map();
  let prevAnchors = null;
  return {
    onAnchor: (source) => {
      aliasObjects.push(source);
      prevAnchors ?? (prevAnchors = anchorNames(doc));
      const anchor = findNewAnchor(prefix, prevAnchors);
      prevAnchors.add(anchor);
      return anchor;
    },
    /**
     * With circular references, the source node is only resolved after all
     * of its child nodes are. This is why anchors are set only after all of
     * the nodes have been created.
     */
    setAnchors: () => {
      for (const source of aliasObjects) {
        const ref = sourceObjects.get(source);
        if (typeof ref === "object" && ref.anchor && (isScalar(ref.node) || isCollection(ref.node))) {
          ref.node.anchor = ref.anchor;
        } else {
          const error = new Error("Failed to resolve repeated object (this should not happen)");
          error.source = source;
          throw error;
        }
      }
    },
    sourceObjects
  };
}

// node_modules/yaml/browser/dist/doc/applyReviver.js
function applyReviver(reviver, obj, key, val) {
  if (val && typeof val === "object") {
    if (Array.isArray(val)) {
      for (let i = 0, len = val.length; i < len; ++i) {
        const v0 = val[i];
        const v1 = applyReviver(reviver, val, String(i), v0);
        if (v1 === void 0)
          delete val[i];
        else if (v1 !== v0)
          val[i] = v1;
      }
    } else if (val instanceof Map) {
      for (const k of Array.from(val.keys())) {
        const v0 = val.get(k);
        const v1 = applyReviver(reviver, val, k, v0);
        if (v1 === void 0)
          val.delete(k);
        else if (v1 !== v0)
          val.set(k, v1);
      }
    } else if (val instanceof Set) {
      for (const v0 of Array.from(val)) {
        const v1 = applyReviver(reviver, val, v0, v0);
        if (v1 === void 0)
          val.delete(v0);
        else if (v1 !== v0) {
          val.delete(v0);
          val.add(v1);
        }
      }
    } else {
      for (const [k, v0] of Object.entries(val)) {
        const v1 = applyReviver(reviver, val, k, v0);
        if (v1 === void 0)
          delete val[k];
        else if (v1 !== v0)
          val[k] = v1;
      }
    }
  }
  return reviver.call(obj, key, val);
}

// node_modules/yaml/browser/dist/nodes/toJS.js
function toJS(value, arg, ctx) {
  if (Array.isArray(value))
    return value.map((v, i) => toJS(v, String(i), ctx));
  if (value && typeof value.toJSON === "function") {
    if (!ctx || !hasAnchor(value))
      return value.toJSON(arg, ctx);
    const data = { aliasCount: 0, count: 1, res: void 0 };
    ctx.anchors.set(value, data);
    ctx.onCreate = (res2) => {
      data.res = res2;
      delete ctx.onCreate;
    };
    const res = value.toJSON(arg, ctx);
    if (ctx.onCreate)
      ctx.onCreate(res);
    return res;
  }
  if (typeof value === "bigint" && !ctx?.keep)
    return Number(value);
  return value;
}

// node_modules/yaml/browser/dist/nodes/Node.js
var NodeBase = class {
  constructor(type) {
    Object.defineProperty(this, NODE_TYPE, { value: type });
  }
  /** Create a copy of this node.  */
  clone() {
    const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /** A plain JavaScript representation of this node. */
  toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
    if (!isDocument(doc))
      throw new TypeError("A document argument is required");
    const ctx = {
      anchors: /* @__PURE__ */ new Map(),
      doc,
      keep: true,
      mapAsMap: mapAsMap === true,
      mapKeyWarned: false,
      maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
    };
    const res = toJS(this, "", ctx);
    if (typeof onAnchor === "function")
      for (const { count, res: res2 } of ctx.anchors.values())
        onAnchor(res2, count);
    return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
  }
};

// node_modules/yaml/browser/dist/nodes/Alias.js
var Alias = class extends NodeBase {
  constructor(source) {
    super(ALIAS);
    this.source = source;
    Object.defineProperty(this, "tag", {
      set() {
        throw new Error("Alias nodes cannot have tags");
      }
    });
  }
  /**
   * Resolve the value of this alias within `doc`, finding the last
   * instance of the `source` anchor before this node.
   */
  resolve(doc, ctx) {
    let nodes;
    if (ctx?.aliasResolveCache) {
      nodes = ctx.aliasResolveCache;
    } else {
      nodes = [];
      visit(doc, {
        Node: (_key, node) => {
          if (isAlias(node) || hasAnchor(node))
            nodes.push(node);
        }
      });
      if (ctx)
        ctx.aliasResolveCache = nodes;
    }
    let found = void 0;
    for (const node of nodes) {
      if (node === this)
        break;
      if (node.anchor === this.source)
        found = node;
    }
    return found;
  }
  toJSON(_arg, ctx) {
    if (!ctx)
      return { source: this.source };
    const { anchors, doc, maxAliasCount } = ctx;
    const source = this.resolve(doc, ctx);
    if (!source) {
      const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(msg);
    }
    let data = anchors.get(source);
    if (!data) {
      toJS(source, null, ctx);
      data = anchors.get(source);
    }
    if (data?.res === void 0) {
      const msg = "This should not happen: Alias anchor was not resolved?";
      throw new ReferenceError(msg);
    }
    if (maxAliasCount >= 0) {
      data.count += 1;
      if (data.aliasCount === 0)
        data.aliasCount = getAliasCount(doc, source, anchors);
      if (data.count * data.aliasCount > maxAliasCount) {
        const msg = "Excessive alias count indicates a resource exhaustion attack";
        throw new ReferenceError(msg);
      }
    }
    return data.res;
  }
  toString(ctx, _onComment, _onChompKeep) {
    const src = `*${this.source}`;
    if (ctx) {
      anchorIsValid(this.source);
      if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
        const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(msg);
      }
      if (ctx.implicitKey)
        return `${src} `;
    }
    return src;
  }
};
function getAliasCount(doc, node, anchors) {
  if (isAlias(node)) {
    const source = node.resolve(doc);
    const anchor = anchors && source && anchors.get(source);
    return anchor ? anchor.count * anchor.aliasCount : 0;
  } else if (isCollection(node)) {
    let count = 0;
    for (const item of node.items) {
      const c = getAliasCount(doc, item, anchors);
      if (c > count)
        count = c;
    }
    return count;
  } else if (isPair(node)) {
    const kc = getAliasCount(doc, node.key, anchors);
    const vc = getAliasCount(doc, node.value, anchors);
    return Math.max(kc, vc);
  }
  return 1;
}

// node_modules/yaml/browser/dist/nodes/Scalar.js
var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
var Scalar = class extends NodeBase {
  constructor(value) {
    super(SCALAR);
    this.value = value;
  }
  toJSON(arg, ctx) {
    return ctx?.keep ? this.value : toJS(this.value, arg, ctx);
  }
  toString() {
    return String(this.value);
  }
};
Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
Scalar.PLAIN = "PLAIN";
Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";

// node_modules/yaml/browser/dist/doc/createNode.js
var defaultTagPrefix = "tag:yaml.org,2002:";
function findTagObject(value, tagName, tags) {
  if (tagName) {
    const match = tags.filter((t) => t.tag === tagName);
    const tagObj = match.find((t) => !t.format) ?? match[0];
    if (!tagObj)
      throw new Error(`Tag ${tagName} not found`);
    return tagObj;
  }
  return tags.find((t) => t.identify?.(value) && !t.format);
}
function createNode(value, tagName, ctx) {
  if (isDocument(value))
    value = value.contents;
  if (isNode(value))
    return value;
  if (isPair(value)) {
    const map2 = ctx.schema[MAP].createNode?.(ctx.schema, null, ctx);
    map2.items.push(value);
    return map2;
  }
  if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
    value = value.valueOf();
  }
  const { aliasDuplicateObjects, onAnchor, onTagObj, schema: schema4, sourceObjects } = ctx;
  let ref = void 0;
  if (aliasDuplicateObjects && value && typeof value === "object") {
    ref = sourceObjects.get(value);
    if (ref) {
      ref.anchor ?? (ref.anchor = onAnchor(value));
      return new Alias(ref.anchor);
    } else {
      ref = { anchor: null, node: null };
      sourceObjects.set(value, ref);
    }
  }
  if (tagName?.startsWith("!!"))
    tagName = defaultTagPrefix + tagName.slice(2);
  let tagObj = findTagObject(value, tagName, schema4.tags);
  if (!tagObj) {
    if (value && typeof value.toJSON === "function") {
      value = value.toJSON();
    }
    if (!value || typeof value !== "object") {
      const node2 = new Scalar(value);
      if (ref)
        ref.node = node2;
      return node2;
    }
    tagObj = value instanceof Map ? schema4[MAP] : Symbol.iterator in Object(value) ? schema4[SEQ] : schema4[MAP];
  }
  if (onTagObj) {
    onTagObj(tagObj);
    delete ctx.onTagObj;
  }
  const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar(value);
  if (tagName)
    node.tag = tagName;
  else if (!tagObj.default)
    node.tag = tagObj.tag;
  if (ref)
    ref.node = node;
  return node;
}

// node_modules/yaml/browser/dist/nodes/Collection.js
function collectionFromPath(schema4, path, value) {
  let v = value;
  for (let i = path.length - 1; i >= 0; --i) {
    const k = path[i];
    if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
      const a = [];
      a[k] = v;
      v = a;
    } else {
      v = /* @__PURE__ */ new Map([[k, v]]);
    }
  }
  return createNode(v, void 0, {
    aliasDuplicateObjects: false,
    keepUndefined: false,
    onAnchor: () => {
      throw new Error("This should not happen, please report a bug.");
    },
    schema: schema4,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
var Collection = class extends NodeBase {
  constructor(type, schema4) {
    super(type);
    Object.defineProperty(this, "schema", {
      value: schema4,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  /**
   * Create a copy of this collection.
   *
   * @param schema - If defined, overwrites the original's schema
   */
  clone(schema4) {
    const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    if (schema4)
      copy.schema = schema4;
    copy.items = copy.items.map((it) => isNode(it) || isPair(it) ? it.clone(schema4) : it);
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /**
   * Adds a value to the collection. For `!!map` and `!!omap` the value must
   * be a Pair instance or a `{ key, value }` object, which may not have a key
   * that already exists in the map.
   */
  addIn(path, value) {
    if (isEmptyPath(path))
      this.add(value);
    else {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (isCollection(node))
        node.addIn(rest, value);
      else if (node === void 0 && this.schema)
        this.set(key, collectionFromPath(this.schema, rest, value));
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }
  /**
   * Removes a value from the collection.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(path) {
    const [key, ...rest] = path;
    if (rest.length === 0)
      return this.delete(key);
    const node = this.get(key, true);
    if (isCollection(node))
      return node.deleteIn(rest);
    else
      throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(path, keepScalar) {
    const [key, ...rest] = path;
    const node = this.get(key, true);
    if (rest.length === 0)
      return !keepScalar && isScalar(node) ? node.value : node;
    else
      return isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
  }
  hasAllNullValues(allowScalar) {
    return this.items.every((node) => {
      if (!isPair(node))
        return false;
      const n = node.value;
      return n == null || allowScalar && isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   */
  hasIn(path) {
    const [key, ...rest] = path;
    if (rest.length === 0)
      return this.has(key);
    const node = this.get(key, true);
    return isCollection(node) ? node.hasIn(rest) : false;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(path, value) {
    const [key, ...rest] = path;
    if (rest.length === 0) {
      this.set(key, value);
    } else {
      const node = this.get(key, true);
      if (isCollection(node))
        node.setIn(rest, value);
      else if (node === void 0 && this.schema)
        this.set(key, collectionFromPath(this.schema, rest, value));
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyComment.js
var stringifyComment = (str2) => str2.replace(/^(?!$)(?: $)?/gm, "#");
function indentComment(comment, indent) {
  if (/^\n+$/.test(comment))
    return comment.substring(1);
  return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
}
var lineComment = (str2, indent, comment) => str2.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str2.endsWith(" ") ? "" : " ") + comment;

// node_modules/yaml/browser/dist/stringify/foldFlowLines.js
var FOLD_FLOW = "flow";
var FOLD_BLOCK = "block";
var FOLD_QUOTED = "quoted";
function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
  if (!lineWidth || lineWidth < 0)
    return text;
  if (lineWidth < minContentWidth)
    minContentWidth = 0;
  const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
  if (text.length <= endStep)
    return text;
  const folds = [];
  const escapedFolds = {};
  let end = lineWidth - indent.length;
  if (typeof indentAtStart === "number") {
    if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
      folds.push(0);
    else
      end = lineWidth - indentAtStart;
  }
  let split = void 0;
  let prev = void 0;
  let overflow = false;
  let i = -1;
  let escStart = -1;
  let escEnd = -1;
  if (mode === FOLD_BLOCK) {
    i = consumeMoreIndentedLines(text, i, indent.length);
    if (i !== -1)
      end = i + endStep;
  }
  for (let ch; ch = text[i += 1]; ) {
    if (mode === FOLD_QUOTED && ch === "\\") {
      escStart = i;
      switch (text[i + 1]) {
        case "x":
          i += 3;
          break;
        case "u":
          i += 5;
          break;
        case "U":
          i += 9;
          break;
        default:
          i += 1;
      }
      escEnd = i;
    }
    if (ch === "\n") {
      if (mode === FOLD_BLOCK)
        i = consumeMoreIndentedLines(text, i, indent.length);
      end = i + indent.length + endStep;
      split = void 0;
    } else {
      if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
        const next = text[i + 1];
        if (next && next !== " " && next !== "\n" && next !== "	")
          split = i;
      }
      if (i >= end) {
        if (split) {
          folds.push(split);
          end = split + endStep;
          split = void 0;
        } else if (mode === FOLD_QUOTED) {
          while (prev === " " || prev === "	") {
            prev = ch;
            ch = text[i += 1];
            overflow = true;
          }
          const j = i > escEnd + 1 ? i - 2 : escStart - 1;
          if (escapedFolds[j])
            return text;
          folds.push(j);
          escapedFolds[j] = true;
          end = j + endStep;
          split = void 0;
        } else {
          overflow = true;
        }
      }
    }
    prev = ch;
  }
  if (overflow && onOverflow)
    onOverflow();
  if (folds.length === 0)
    return text;
  if (onFold)
    onFold();
  let res = text.slice(0, folds[0]);
  for (let i2 = 0; i2 < folds.length; ++i2) {
    const fold = folds[i2];
    const end2 = folds[i2 + 1] || text.length;
    if (fold === 0)
      res = `
${indent}${text.slice(0, end2)}`;
    else {
      if (mode === FOLD_QUOTED && escapedFolds[fold])
        res += `${text[fold]}\\`;
      res += `
${indent}${text.slice(fold + 1, end2)}`;
    }
  }
  return res;
}
function consumeMoreIndentedLines(text, i, indent) {
  let end = i;
  let start = i + 1;
  let ch = text[start];
  while (ch === " " || ch === "	") {
    if (i < start + indent) {
      ch = text[++i];
    } else {
      do {
        ch = text[++i];
      } while (ch && ch !== "\n");
      end = i;
      start = i + 1;
      ch = text[start];
    }
  }
  return end;
}

// node_modules/yaml/browser/dist/stringify/stringifyString.js
var getFoldOptions = (ctx, isBlock2) => ({
  indentAtStart: isBlock2 ? ctx.indent.length : ctx.indentAtStart,
  lineWidth: ctx.options.lineWidth,
  minContentWidth: ctx.options.minContentWidth
});
var containsDocumentMarker = (str2) => /^(%|---|\.\.\.)/m.test(str2);
function lineLengthOverLimit(str2, lineWidth, indentLength) {
  if (!lineWidth || lineWidth < 0)
    return false;
  const limit = lineWidth - indentLength;
  const strLen = str2.length;
  if (strLen <= limit)
    return false;
  for (let i = 0, start = 0; i < strLen; ++i) {
    if (str2[i] === "\n") {
      if (i - start > limit)
        return true;
      start = i + 1;
      if (strLen - start <= limit)
        return false;
    }
  }
  return true;
}
function doubleQuotedString(value, ctx) {
  const json = JSON.stringify(value);
  if (ctx.options.doubleQuotedAsJSON)
    return json;
  const { implicitKey } = ctx;
  const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
  const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
  let str2 = "";
  let start = 0;
  for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
    if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
      str2 += json.slice(start, i) + "\\ ";
      i += 1;
      start = i;
      ch = "\\";
    }
    if (ch === "\\")
      switch (json[i + 1]) {
        case "u":
          {
            str2 += json.slice(start, i);
            const code = json.substr(i + 2, 4);
            switch (code) {
              case "0000":
                str2 += "\\0";
                break;
              case "0007":
                str2 += "\\a";
                break;
              case "000b":
                str2 += "\\v";
                break;
              case "001b":
                str2 += "\\e";
                break;
              case "0085":
                str2 += "\\N";
                break;
              case "00a0":
                str2 += "\\_";
                break;
              case "2028":
                str2 += "\\L";
                break;
              case "2029":
                str2 += "\\P";
                break;
              default:
                if (code.substr(0, 2) === "00")
                  str2 += "\\x" + code.substr(2);
                else
                  str2 += json.substr(i, 6);
            }
            i += 5;
            start = i + 1;
          }
          break;
        case "n":
          if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
            i += 1;
          } else {
            str2 += json.slice(start, i) + "\n\n";
            while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
              str2 += "\n";
              i += 2;
            }
            str2 += indent;
            if (json[i + 2] === " ")
              str2 += "\\";
            i += 1;
            start = i + 1;
          }
          break;
        default:
          i += 1;
      }
  }
  str2 = start ? str2 + json.slice(start) : json;
  return implicitKey ? str2 : foldFlowLines(str2, indent, FOLD_QUOTED, getFoldOptions(ctx, false));
}
function singleQuotedString(value, ctx) {
  if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
    return doubleQuotedString(value, ctx);
  const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
  const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
  return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
function quotedString(value, ctx) {
  const { singleQuote } = ctx.options;
  let qs;
  if (singleQuote === false)
    qs = doubleQuotedString;
  else {
    const hasDouble = value.includes('"');
    const hasSingle = value.includes("'");
    if (hasDouble && !hasSingle)
      qs = singleQuotedString;
    else if (hasSingle && !hasDouble)
      qs = doubleQuotedString;
    else
      qs = singleQuote ? singleQuotedString : doubleQuotedString;
  }
  return qs(value, ctx);
}
var blockEndNewlines;
try {
  blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
} catch {
  blockEndNewlines = /\n+(?!\n|$)/g;
}
function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
  const { blockQuote, commentString, lineWidth } = ctx.options;
  if (!blockQuote || /\n[\t ]+$/.test(value)) {
    return quotedString(value, ctx);
  }
  const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
  const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.BLOCK_FOLDED ? false : type === Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
  if (!value)
    return literal ? "|\n" : ">\n";
  let chomp;
  let endStart;
  for (endStart = value.length; endStart > 0; --endStart) {
    const ch = value[endStart - 1];
    if (ch !== "\n" && ch !== "	" && ch !== " ")
      break;
  }
  let end = value.substring(endStart);
  const endNlPos = end.indexOf("\n");
  if (endNlPos === -1) {
    chomp = "-";
  } else if (value === end || endNlPos !== end.length - 1) {
    chomp = "+";
    if (onChompKeep)
      onChompKeep();
  } else {
    chomp = "";
  }
  if (end) {
    value = value.slice(0, -end.length);
    if (end[end.length - 1] === "\n")
      end = end.slice(0, -1);
    end = end.replace(blockEndNewlines, `$&${indent}`);
  }
  let startWithSpace = false;
  let startEnd;
  let startNlPos = -1;
  for (startEnd = 0; startEnd < value.length; ++startEnd) {
    const ch = value[startEnd];
    if (ch === " ")
      startWithSpace = true;
    else if (ch === "\n")
      startNlPos = startEnd;
    else
      break;
  }
  let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
  if (start) {
    value = value.substring(start.length);
    start = start.replace(/\n+/g, `$&${indent}`);
  }
  const indentSize = indent ? "2" : "1";
  let header = (startWithSpace ? indentSize : "") + chomp;
  if (comment) {
    header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
    if (onComment)
      onComment();
  }
  if (!literal) {
    const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
    let literalFallback = false;
    const foldOptions = getFoldOptions(ctx, true);
    if (blockQuote !== "folded" && type !== Scalar.BLOCK_FOLDED) {
      foldOptions.onOverflow = () => {
        literalFallback = true;
      };
    }
    const body = foldFlowLines(`${start}${foldedValue}${end}`, indent, FOLD_BLOCK, foldOptions);
    if (!literalFallback)
      return `>${header}
${indent}${body}`;
  }
  value = value.replace(/\n+/g, `$&${indent}`);
  return `|${header}
${indent}${start}${value}${end}`;
}
function plainString(item, ctx, onComment, onChompKeep) {
  const { type, value } = item;
  const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
  if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
    return quotedString(value, ctx);
  }
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
    return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
  }
  if (!implicitKey && !inFlow && type !== Scalar.PLAIN && value.includes("\n")) {
    return blockString(item, ctx, onComment, onChompKeep);
  }
  if (containsDocumentMarker(value)) {
    if (indent === "") {
      ctx.forceBlockIndent = true;
      return blockString(item, ctx, onComment, onChompKeep);
    } else if (implicitKey && indent === indentStep) {
      return quotedString(value, ctx);
    }
  }
  const str2 = value.replace(/\n+/g, `$&
${indent}`);
  if (actualString) {
    const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str2);
    const { compat, tags } = ctx.doc.schema;
    if (tags.some(test) || compat?.some(test))
      return quotedString(value, ctx);
  }
  return implicitKey ? str2 : foldFlowLines(str2, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
function stringifyString(item, ctx, onComment, onChompKeep) {
  const { implicitKey, inFlow } = ctx;
  const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
  let { type } = item;
  if (type !== Scalar.QUOTE_DOUBLE) {
    if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
      type = Scalar.QUOTE_DOUBLE;
  }
  const _stringify = (_type) => {
    switch (_type) {
      case Scalar.BLOCK_FOLDED:
      case Scalar.BLOCK_LITERAL:
        return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
      case Scalar.QUOTE_DOUBLE:
        return doubleQuotedString(ss.value, ctx);
      case Scalar.QUOTE_SINGLE:
        return singleQuotedString(ss.value, ctx);
      case Scalar.PLAIN:
        return plainString(ss, ctx, onComment, onChompKeep);
      default:
        return null;
    }
  };
  let res = _stringify(type);
  if (res === null) {
    const { defaultKeyType, defaultStringType } = ctx.options;
    const t = implicitKey && defaultKeyType || defaultStringType;
    res = _stringify(t);
    if (res === null)
      throw new Error(`Unsupported default string type ${t}`);
  }
  return res;
}

// node_modules/yaml/browser/dist/stringify/stringify.js
function createStringifyContext(doc, options) {
  const opt = Object.assign({
    blockQuote: true,
    commentString: stringifyComment,
    defaultKeyType: null,
    defaultStringType: "PLAIN",
    directives: null,
    doubleQuotedAsJSON: false,
    doubleQuotedMinMultiLineLength: 40,
    falseStr: "false",
    flowCollectionPadding: true,
    indentSeq: true,
    lineWidth: 80,
    minContentWidth: 20,
    nullStr: "null",
    simpleKeys: false,
    singleQuote: null,
    trueStr: "true",
    verifyAliasOrder: true
  }, doc.schema.toStringOptions, options);
  let inFlow;
  switch (opt.collectionStyle) {
    case "block":
      inFlow = false;
      break;
    case "flow":
      inFlow = true;
      break;
    default:
      inFlow = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc,
    flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
    inFlow,
    options: opt
  };
}
function getTagObject(tags, item) {
  if (item.tag) {
    const match = tags.filter((t) => t.tag === item.tag);
    if (match.length > 0)
      return match.find((t) => t.format === item.format) ?? match[0];
  }
  let tagObj = void 0;
  let obj;
  if (isScalar(item)) {
    obj = item.value;
    let match = tags.filter((t) => t.identify?.(obj));
    if (match.length > 1) {
      const testMatch = match.filter((t) => t.test);
      if (testMatch.length > 0)
        match = testMatch;
    }
    tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
  } else {
    obj = item;
    tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
  }
  if (!tagObj) {
    const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
    throw new Error(`Tag not resolved for ${name} value`);
  }
  return tagObj;
}
function stringifyProps(node, tagObj, { anchors, doc }) {
  if (!doc.directives)
    return "";
  const props = [];
  const anchor = (isScalar(node) || isCollection(node)) && node.anchor;
  if (anchor && anchorIsValid(anchor)) {
    anchors.add(anchor);
    props.push(`&${anchor}`);
  }
  const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
  if (tag)
    props.push(doc.directives.tagString(tag));
  return props.join(" ");
}
function stringify(item, ctx, onComment, onChompKeep) {
  if (isPair(item))
    return item.toString(ctx, onComment, onChompKeep);
  if (isAlias(item)) {
    if (ctx.doc.directives)
      return item.toString(ctx);
    if (ctx.resolvedAliases?.has(item)) {
      throw new TypeError(`Cannot stringify circular structure without alias nodes`);
    } else {
      if (ctx.resolvedAliases)
        ctx.resolvedAliases.add(item);
      else
        ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
      item = item.resolve(ctx.doc);
    }
  }
  let tagObj = void 0;
  const node = isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
  tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
  const props = stringifyProps(node, tagObj, ctx);
  if (props.length > 0)
    ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
  const str2 = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : isScalar(node) ? stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
  if (!props)
    return str2;
  return isScalar(node) || str2[0] === "{" || str2[0] === "[" ? `${props} ${str2}` : `${props}
${ctx.indent}${str2}`;
}

// node_modules/yaml/browser/dist/stringify/stringifyPair.js
function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
  const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
  let keyComment = isNode(key) && key.comment || null;
  if (simpleKeys) {
    if (keyComment) {
      throw new Error("With simple keys, key nodes cannot have comments");
    }
    if (isCollection(key) || !isNode(key) && typeof key === "object") {
      const msg = "With simple keys, collection cannot be used as a key value";
      throw new Error(msg);
    }
  }
  let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || isCollection(key) || (isScalar(key) ? key.type === Scalar.BLOCK_FOLDED || key.type === Scalar.BLOCK_LITERAL : typeof key === "object"));
  ctx = Object.assign({}, ctx, {
    allNullValues: false,
    implicitKey: !explicitKey && (simpleKeys || !allNullValues),
    indent: indent + indentStep
  });
  let keyCommentDone = false;
  let chompKeep = false;
  let str2 = stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
  if (!explicitKey && !ctx.inFlow && str2.length > 1024) {
    if (simpleKeys)
      throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    explicitKey = true;
  }
  if (ctx.inFlow) {
    if (allNullValues || value == null) {
      if (keyCommentDone && onComment)
        onComment();
      return str2 === "" ? "?" : explicitKey ? `? ${str2}` : str2;
    }
  } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
    str2 = `? ${str2}`;
    if (keyComment && !keyCommentDone) {
      str2 += lineComment(str2, ctx.indent, commentString(keyComment));
    } else if (chompKeep && onChompKeep)
      onChompKeep();
    return str2;
  }
  if (keyCommentDone)
    keyComment = null;
  if (explicitKey) {
    if (keyComment)
      str2 += lineComment(str2, ctx.indent, commentString(keyComment));
    str2 = `? ${str2}
${indent}:`;
  } else {
    str2 = `${str2}:`;
    if (keyComment)
      str2 += lineComment(str2, ctx.indent, commentString(keyComment));
  }
  let vsb, vcb, valueComment;
  if (isNode(value)) {
    vsb = !!value.spaceBefore;
    vcb = value.commentBefore;
    valueComment = value.comment;
  } else {
    vsb = false;
    vcb = null;
    valueComment = null;
    if (value && typeof value === "object")
      value = doc.createNode(value);
  }
  ctx.implicitKey = false;
  if (!explicitKey && !keyComment && isScalar(value))
    ctx.indentAtStart = str2.length + 1;
  chompKeep = false;
  if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && isSeq(value) && !value.flow && !value.tag && !value.anchor) {
    ctx.indent = ctx.indent.substring(2);
  }
  let valueCommentDone = false;
  const valueStr = stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
  let ws = " ";
  if (keyComment || vsb || vcb) {
    ws = vsb ? "\n" : "";
    if (vcb) {
      const cs = commentString(vcb);
      ws += `
${indentComment(cs, ctx.indent)}`;
    }
    if (valueStr === "" && !ctx.inFlow) {
      if (ws === "\n" && valueComment)
        ws = "\n\n";
    } else {
      ws += `
${ctx.indent}`;
    }
  } else if (!explicitKey && isCollection(value)) {
    const vs0 = valueStr[0];
    const nl0 = valueStr.indexOf("\n");
    const hasNewline = nl0 !== -1;
    const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
    if (hasNewline || !flow) {
      let hasPropsLine = false;
      if (hasNewline && (vs0 === "&" || vs0 === "!")) {
        let sp0 = valueStr.indexOf(" ");
        if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
          sp0 = valueStr.indexOf(" ", sp0 + 1);
        }
        if (sp0 === -1 || nl0 < sp0)
          hasPropsLine = true;
      }
      if (!hasPropsLine)
        ws = `
${ctx.indent}`;
    }
  } else if (valueStr === "" || valueStr[0] === "\n") {
    ws = "";
  }
  str2 += ws + valueStr;
  if (ctx.inFlow) {
    if (valueCommentDone && onComment)
      onComment();
  } else if (valueComment && !valueCommentDone) {
    str2 += lineComment(str2, ctx.indent, commentString(valueComment));
  } else if (chompKeep && onChompKeep) {
    onChompKeep();
  }
  return str2;
}

// node_modules/yaml/browser/dist/log.js
function warn(logLevel, warning) {
  if (logLevel === "debug" || logLevel === "warn") {
    console.warn(warning);
  }
}

// node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
var MERGE_KEY = "<<";
var merge = {
  identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: () => Object.assign(new Scalar(Symbol(MERGE_KEY)), {
    addToJSMap: addMergeToJSMap
  }),
  stringify: () => MERGE_KEY
};
var isMergeKey = (ctx, key) => (merge.identify(key) || isScalar(key) && (!key.type || key.type === Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
function addMergeToJSMap(ctx, map2, value) {
  value = ctx && isAlias(value) ? value.resolve(ctx.doc) : value;
  if (isSeq(value))
    for (const it of value.items)
      mergeValue(ctx, map2, it);
  else if (Array.isArray(value))
    for (const it of value)
      mergeValue(ctx, map2, it);
  else
    mergeValue(ctx, map2, value);
}
function mergeValue(ctx, map2, value) {
  const source = ctx && isAlias(value) ? value.resolve(ctx.doc) : value;
  if (!isMap(source))
    throw new Error("Merge sources must be maps or map aliases");
  const srcMap = source.toJSON(null, ctx, Map);
  for (const [key, value2] of srcMap) {
    if (map2 instanceof Map) {
      if (!map2.has(key))
        map2.set(key, value2);
    } else if (map2 instanceof Set) {
      map2.add(key);
    } else if (!Object.prototype.hasOwnProperty.call(map2, key)) {
      Object.defineProperty(map2, key, {
        value: value2,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
  }
  return map2;
}

// node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
function addPairToJSMap(ctx, map2, { key, value }) {
  if (isNode(key) && key.addToJSMap)
    key.addToJSMap(ctx, map2, value);
  else if (isMergeKey(ctx, key))
    addMergeToJSMap(ctx, map2, value);
  else {
    const jsKey = toJS(key, "", ctx);
    if (map2 instanceof Map) {
      map2.set(jsKey, toJS(value, jsKey, ctx));
    } else if (map2 instanceof Set) {
      map2.add(jsKey);
    } else {
      const stringKey = stringifyKey(key, jsKey, ctx);
      const jsValue = toJS(value, stringKey, ctx);
      if (stringKey in map2)
        Object.defineProperty(map2, stringKey, {
          value: jsValue,
          writable: true,
          enumerable: true,
          configurable: true
        });
      else
        map2[stringKey] = jsValue;
    }
  }
  return map2;
}
function stringifyKey(key, jsKey, ctx) {
  if (jsKey === null)
    return "";
  if (typeof jsKey !== "object")
    return String(jsKey);
  if (isNode(key) && ctx?.doc) {
    const strCtx = createStringifyContext(ctx.doc, {});
    strCtx.anchors = /* @__PURE__ */ new Set();
    for (const node of ctx.anchors.keys())
      strCtx.anchors.add(node.anchor);
    strCtx.inFlow = true;
    strCtx.inStringifyKey = true;
    const strKey = key.toString(strCtx);
    if (!ctx.mapKeyWarned) {
      let jsonStr = JSON.stringify(strKey);
      if (jsonStr.length > 40)
        jsonStr = jsonStr.substring(0, 36) + '..."';
      warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
      ctx.mapKeyWarned = true;
    }
    return strKey;
  }
  return JSON.stringify(jsKey);
}

// node_modules/yaml/browser/dist/nodes/Pair.js
function createPair(key, value, ctx) {
  const k = createNode(key, void 0, ctx);
  const v = createNode(value, void 0, ctx);
  return new Pair(k, v);
}
var Pair = class _Pair {
  constructor(key, value = null) {
    Object.defineProperty(this, NODE_TYPE, { value: PAIR });
    this.key = key;
    this.value = value;
  }
  clone(schema4) {
    let { key, value } = this;
    if (isNode(key))
      key = key.clone(schema4);
    if (isNode(value))
      value = value.clone(schema4);
    return new _Pair(key, value);
  }
  toJSON(_, ctx) {
    const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    return addPairToJSMap(ctx, pair, this);
  }
  toString(ctx, onComment, onChompKeep) {
    return ctx?.doc ? stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyCollection.js
function stringifyCollection(collection, ctx, options) {
  const flow = ctx.inFlow ?? collection.flow;
  const stringify4 = flow ? stringifyFlowCollection : stringifyBlockCollection;
  return stringify4(collection, ctx, options);
}
function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
  const { indent, options: { commentString } } = ctx;
  const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
  let chompKeep = false;
  const lines = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    let comment2 = null;
    if (isNode(item)) {
      if (!chompKeep && item.spaceBefore)
        lines.push("");
      addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
      if (item.comment)
        comment2 = item.comment;
    } else if (isPair(item)) {
      const ik = isNode(item.key) ? item.key : null;
      if (ik) {
        if (!chompKeep && ik.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
      }
    }
    chompKeep = false;
    let str3 = stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
    if (comment2)
      str3 += lineComment(str3, itemIndent, commentString(comment2));
    if (chompKeep && comment2)
      chompKeep = false;
    lines.push(blockItemPrefix + str3);
  }
  let str2;
  if (lines.length === 0) {
    str2 = flowChars.start + flowChars.end;
  } else {
    str2 = lines[0];
    for (let i = 1; i < lines.length; ++i) {
      const line = lines[i];
      str2 += line ? `
${indent}${line}` : "\n";
    }
  }
  if (comment) {
    str2 += "\n" + indentComment(commentString(comment), indent);
    if (onComment)
      onComment();
  } else if (chompKeep && onChompKeep)
    onChompKeep();
  return str2;
}
function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
  const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
  itemIndent += indentStep;
  const itemCtx = Object.assign({}, ctx, {
    indent: itemIndent,
    inFlow: true,
    type: null
  });
  let reqNewline = false;
  let linesAtValue = 0;
  const lines = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    let comment = null;
    if (isNode(item)) {
      if (item.spaceBefore)
        lines.push("");
      addCommentBefore(ctx, lines, item.commentBefore, false);
      if (item.comment)
        comment = item.comment;
    } else if (isPair(item)) {
      const ik = isNode(item.key) ? item.key : null;
      if (ik) {
        if (ik.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, ik.commentBefore, false);
        if (ik.comment)
          reqNewline = true;
      }
      const iv = isNode(item.value) ? item.value : null;
      if (iv) {
        if (iv.comment)
          comment = iv.comment;
        if (iv.commentBefore)
          reqNewline = true;
      } else if (item.value == null && ik?.comment) {
        comment = ik.comment;
      }
    }
    if (comment)
      reqNewline = true;
    let str2 = stringify(item, itemCtx, () => comment = null);
    if (i < items.length - 1)
      str2 += ",";
    if (comment)
      str2 += lineComment(str2, itemIndent, commentString(comment));
    if (!reqNewline && (lines.length > linesAtValue || str2.includes("\n")))
      reqNewline = true;
    lines.push(str2);
    linesAtValue = lines.length;
  }
  const { start, end } = flowChars;
  if (lines.length === 0) {
    return start + end;
  } else {
    if (!reqNewline) {
      const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
      reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
    }
    if (reqNewline) {
      let str2 = start;
      for (const line of lines)
        str2 += line ? `
${indentStep}${indent}${line}` : "\n";
      return `${str2}
${indent}${end}`;
    } else {
      return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
    }
  }
}
function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
  if (comment && chompKeep)
    comment = comment.replace(/^\n+/, "");
  if (comment) {
    const ic = indentComment(commentString(comment), indent);
    lines.push(ic.trimStart());
  }
}

// node_modules/yaml/browser/dist/nodes/YAMLMap.js
function findPair(items, key) {
  const k = isScalar(key) ? key.value : key;
  for (const it of items) {
    if (isPair(it)) {
      if (it.key === key || it.key === k)
        return it;
      if (isScalar(it.key) && it.key.value === k)
        return it;
    }
  }
  return void 0;
}
var YAMLMap = class extends Collection {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(schema4) {
    super(MAP, schema4);
    this.items = [];
  }
  /**
   * A generic collection parsing method that can be extended
   * to other node classes that inherit from YAMLMap
   */
  static from(schema4, obj, ctx) {
    const { keepUndefined, replacer } = ctx;
    const map2 = new this(schema4);
    const add2 = (key, value) => {
      if (typeof replacer === "function")
        value = replacer.call(obj, key, value);
      else if (Array.isArray(replacer) && !replacer.includes(key))
        return;
      if (value !== void 0 || keepUndefined)
        map2.items.push(createPair(key, value, ctx));
    };
    if (obj instanceof Map) {
      for (const [key, value] of obj)
        add2(key, value);
    } else if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj))
        add2(key, obj[key]);
    }
    if (typeof schema4.sortMapEntries === "function") {
      map2.items.sort(schema4.sortMapEntries);
    }
    return map2;
  }
  /**
   * Adds a value to the collection.
   *
   * @param overwrite - If not set `true`, using a key that is already in the
   *   collection will throw. Otherwise, overwrites the previous value.
   */
  add(pair, overwrite) {
    let _pair;
    if (isPair(pair))
      _pair = pair;
    else if (!pair || typeof pair !== "object" || !("key" in pair)) {
      _pair = new Pair(pair, pair?.value);
    } else
      _pair = new Pair(pair.key, pair.value);
    const prev = findPair(this.items, _pair.key);
    const sortEntries = this.schema?.sortMapEntries;
    if (prev) {
      if (!overwrite)
        throw new Error(`Key ${_pair.key} already set`);
      if (isScalar(prev.value) && isScalarValue(_pair.value))
        prev.value.value = _pair.value;
      else
        prev.value = _pair.value;
    } else if (sortEntries) {
      const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
      if (i === -1)
        this.items.push(_pair);
      else
        this.items.splice(i, 0, _pair);
    } else {
      this.items.push(_pair);
    }
  }
  delete(key) {
    const it = findPair(this.items, key);
    if (!it)
      return false;
    const del = this.items.splice(this.items.indexOf(it), 1);
    return del.length > 0;
  }
  get(key, keepScalar) {
    const it = findPair(this.items, key);
    const node = it?.value;
    return (!keepScalar && isScalar(node) ? node.value : node) ?? void 0;
  }
  has(key) {
    return !!findPair(this.items, key);
  }
  set(key, value) {
    this.add(new Pair(key, value), true);
  }
  /**
   * @param ctx - Conversion context, originally set in Document#toJS()
   * @param {Class} Type - If set, forces the returned collection type
   * @returns Instance of Type, Map, or Object
   */
  toJSON(_, ctx, Type) {
    const map2 = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    if (ctx?.onCreate)
      ctx.onCreate(map2);
    for (const item of this.items)
      addPairToJSMap(ctx, map2, item);
    return map2;
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    for (const item of this.items) {
      if (!isPair(item))
        throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
    }
    if (!ctx.allNullValues && this.hasAllNullValues(false))
      ctx = Object.assign({}, ctx, { allNullValues: true });
    return stringifyCollection(this, ctx, {
      blockItemPrefix: "",
      flowChars: { start: "{", end: "}" },
      itemIndent: ctx.indent || "",
      onChompKeep,
      onComment
    });
  }
};

// node_modules/yaml/browser/dist/schema/common/map.js
var map = {
  collection: "map",
  default: true,
  nodeClass: YAMLMap,
  tag: "tag:yaml.org,2002:map",
  resolve(map2, onError) {
    if (!isMap(map2))
      onError("Expected a mapping for this tag");
    return map2;
  },
  createNode: (schema4, obj, ctx) => YAMLMap.from(schema4, obj, ctx)
};

// node_modules/yaml/browser/dist/nodes/YAMLSeq.js
var YAMLSeq = class extends Collection {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(schema4) {
    super(SEQ, schema4);
    this.items = [];
  }
  add(value) {
    this.items.push(value);
  }
  /**
   * Removes a value from the collection.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   *
   * @returns `true` if the item was found and removed.
   */
  delete(key) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      return false;
    const del = this.items.splice(idx, 1);
    return del.length > 0;
  }
  get(key, keepScalar) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      return void 0;
    const it = this.items[idx];
    return !keepScalar && isScalar(it) ? it.value : it;
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   */
  has(key) {
    const idx = asItemIndex(key);
    return typeof idx === "number" && idx < this.items.length;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   *
   * If `key` does not contain a representation of an integer, this will throw.
   * It may be wrapped in a `Scalar`.
   */
  set(key, value) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      throw new Error(`Expected a valid index, not ${key}.`);
    const prev = this.items[idx];
    if (isScalar(prev) && isScalarValue(value))
      prev.value = value;
    else
      this.items[idx] = value;
  }
  toJSON(_, ctx) {
    const seq2 = [];
    if (ctx?.onCreate)
      ctx.onCreate(seq2);
    let i = 0;
    for (const item of this.items)
      seq2.push(toJS(item, String(i++), ctx));
    return seq2;
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    return stringifyCollection(this, ctx, {
      blockItemPrefix: "- ",
      flowChars: { start: "[", end: "]" },
      itemIndent: (ctx.indent || "") + "  ",
      onChompKeep,
      onComment
    });
  }
  static from(schema4, obj, ctx) {
    const { replacer } = ctx;
    const seq2 = new this(schema4);
    if (obj && Symbol.iterator in Object(obj)) {
      let i = 0;
      for (let it of obj) {
        if (typeof replacer === "function") {
          const key = obj instanceof Set ? it : String(i++);
          it = replacer.call(obj, key, it);
        }
        seq2.items.push(createNode(it, void 0, ctx));
      }
    }
    return seq2;
  }
};
function asItemIndex(key) {
  let idx = isScalar(key) ? key.value : key;
  if (idx && typeof idx === "string")
    idx = Number(idx);
  return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
}

// node_modules/yaml/browser/dist/schema/common/seq.js
var seq = {
  collection: "seq",
  default: true,
  nodeClass: YAMLSeq,
  tag: "tag:yaml.org,2002:seq",
  resolve(seq2, onError) {
    if (!isSeq(seq2))
      onError("Expected a sequence for this tag");
    return seq2;
  },
  createNode: (schema4, obj, ctx) => YAMLSeq.from(schema4, obj, ctx)
};

// node_modules/yaml/browser/dist/schema/common/string.js
var string = {
  identify: (value) => typeof value === "string",
  default: true,
  tag: "tag:yaml.org,2002:str",
  resolve: (str2) => str2,
  stringify(item, ctx, onComment, onChompKeep) {
    ctx = Object.assign({ actualString: true }, ctx);
    return stringifyString(item, ctx, onComment, onChompKeep);
  }
};

// node_modules/yaml/browser/dist/schema/common/null.js
var nullTag = {
  identify: (value) => value == null,
  createNode: () => new Scalar(null),
  default: true,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => new Scalar(null),
  stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
};

// node_modules/yaml/browser/dist/schema/core/bool.js
var boolTag = {
  identify: (value) => typeof value === "boolean",
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: (str2) => new Scalar(str2[0] === "t" || str2[0] === "T"),
  stringify({ source, value }, ctx) {
    if (source && boolTag.test.test(source)) {
      const sv = source[0] === "t" || source[0] === "T";
      if (value === sv)
        return source;
    }
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyNumber.js
function stringifyNumber({ format, minFractionDigits, tag, value }) {
  if (typeof value === "bigint")
    return String(value);
  const num = typeof value === "number" ? value : Number(value);
  if (!isFinite(num))
    return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
  let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
  if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^\d/.test(n)) {
    let i = n.indexOf(".");
    if (i < 0) {
      i = n.length;
      n += ".";
    }
    let d = minFractionDigits - (n.length - i - 1);
    while (d-- > 0)
      n += "0";
  }
  return n;
}

// node_modules/yaml/browser/dist/schema/core/float.js
var floatNaN = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (str2) => str2.slice(-3).toLowerCase() === "nan" ? NaN : str2[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: stringifyNumber
};
var floatExp = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: (str2) => parseFloat(str2),
  stringify(node) {
    const num = Number(node.value);
    return isFinite(num) ? num.toExponential() : stringifyNumber(node);
  }
};
var float = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(str2) {
    const node = new Scalar(parseFloat(str2));
    const dot2 = str2.indexOf(".");
    if (dot2 !== -1 && str2[str2.length - 1] === "0")
      node.minFractionDigits = str2.length - dot2 - 1;
    return node;
  },
  stringify: stringifyNumber
};

// node_modules/yaml/browser/dist/schema/core/int.js
var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
var intResolve = (str2, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str2) : parseInt(str2.substring(offset), radix);
function intStringify(node, radix, prefix) {
  const { value } = node;
  if (intIdentify(value) && value >= 0)
    return prefix + value.toString(radix);
  return stringifyNumber(node);
}
var intOct = {
  identify: (value) => intIdentify(value) && value >= 0,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: (str2, _onError, opt) => intResolve(str2, 2, 8, opt),
  stringify: (node) => intStringify(node, 8, "0o")
};
var int = {
  identify: intIdentify,
  default: true,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: (str2, _onError, opt) => intResolve(str2, 0, 10, opt),
  stringify: stringifyNumber
};
var intHex = {
  identify: (value) => intIdentify(value) && value >= 0,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: (str2, _onError, opt) => intResolve(str2, 2, 16, opt),
  stringify: (node) => intStringify(node, 16, "0x")
};

// node_modules/yaml/browser/dist/schema/core/schema.js
var schema = [
  map,
  seq,
  string,
  nullTag,
  boolTag,
  intOct,
  int,
  intHex,
  floatNaN,
  floatExp,
  float
];

// node_modules/yaml/browser/dist/schema/json/schema.js
function intIdentify2(value) {
  return typeof value === "bigint" || Number.isInteger(value);
}
var stringifyJSON = ({ value }) => JSON.stringify(value);
var jsonScalars = [
  {
    identify: (value) => typeof value === "string",
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: (str2) => str2,
    stringify: stringifyJSON
  },
  {
    identify: (value) => value == null,
    createNode: () => new Scalar(null),
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: stringifyJSON
  },
  {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: (str2) => str2 === "true",
    stringify: stringifyJSON
  },
  {
    identify: intIdentify2,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (str2, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str2) : parseInt(str2, 10),
    stringify: ({ value }) => intIdentify2(value) ? value.toString() : JSON.stringify(value)
  },
  {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (str2) => parseFloat(str2),
    stringify: stringifyJSON
  }
];
var jsonError = {
  default: true,
  tag: "",
  test: /^/,
  resolve(str2, onError) {
    onError(`Unresolved plain scalar ${JSON.stringify(str2)}`);
    return str2;
  }
};
var schema2 = [map, seq].concat(jsonScalars, jsonError);

// node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js
var binary = {
  identify: (value) => value instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: false,
  tag: "tag:yaml.org,2002:binary",
  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve(src, onError) {
    if (typeof atob === "function") {
      const str2 = atob(src.replace(/[\n\r]/g, ""));
      const buffer = new Uint8Array(str2.length);
      for (let i = 0; i < str2.length; ++i)
        buffer[i] = str2.charCodeAt(i);
      return buffer;
    } else {
      onError("This environment does not support reading binary tags; either Buffer or atob is required");
      return src;
    }
  },
  stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
    if (!value)
      return "";
    const buf = value;
    let str2;
    if (typeof btoa === "function") {
      let s = "";
      for (let i = 0; i < buf.length; ++i)
        s += String.fromCharCode(buf[i]);
      str2 = btoa(s);
    } else {
      throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    }
    type ?? (type = Scalar.BLOCK_LITERAL);
    if (type !== Scalar.QUOTE_DOUBLE) {
      const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
      const n = Math.ceil(str2.length / lineWidth);
      const lines = new Array(n);
      for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
        lines[i] = str2.substr(o, lineWidth);
      }
      str2 = lines.join(type === Scalar.BLOCK_LITERAL ? "\n" : " ");
    }
    return stringifyString({ comment, type, value: str2 }, ctx, onComment, onChompKeep);
  }
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
function resolvePairs(seq2, onError) {
  if (isSeq(seq2)) {
    for (let i = 0; i < seq2.items.length; ++i) {
      let item = seq2.items[i];
      if (isPair(item))
        continue;
      else if (isMap(item)) {
        if (item.items.length > 1)
          onError("Each pair must have its own sequence indicator");
        const pair = item.items[0] || new Pair(new Scalar(null));
        if (item.commentBefore)
          pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
        if (item.comment) {
          const cn = pair.value ?? pair.key;
          cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
        }
        item = pair;
      }
      seq2.items[i] = isPair(item) ? item : new Pair(item);
    }
  } else
    onError("Expected a sequence for this tag");
  return seq2;
}
function createPairs(schema4, iterable, ctx) {
  const { replacer } = ctx;
  const pairs2 = new YAMLSeq(schema4);
  pairs2.tag = "tag:yaml.org,2002:pairs";
  let i = 0;
  if (iterable && Symbol.iterator in Object(iterable))
    for (let it of iterable) {
      if (typeof replacer === "function")
        it = replacer.call(iterable, String(i++), it);
      let key, value;
      if (Array.isArray(it)) {
        if (it.length === 2) {
          key = it[0];
          value = it[1];
        } else
          throw new TypeError(`Expected [key, value] tuple: ${it}`);
      } else if (it && it instanceof Object) {
        const keys = Object.keys(it);
        if (keys.length === 1) {
          key = keys[0];
          value = it[key];
        } else {
          throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
        }
      } else {
        key = it;
      }
      pairs2.items.push(createPair(key, value, ctx));
    }
  return pairs2;
}
var pairs = {
  collection: "seq",
  default: false,
  tag: "tag:yaml.org,2002:pairs",
  resolve: resolvePairs,
  createNode: createPairs
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js
var YAMLOMap = class _YAMLOMap extends YAMLSeq {
  constructor() {
    super();
    this.add = YAMLMap.prototype.add.bind(this);
    this.delete = YAMLMap.prototype.delete.bind(this);
    this.get = YAMLMap.prototype.get.bind(this);
    this.has = YAMLMap.prototype.has.bind(this);
    this.set = YAMLMap.prototype.set.bind(this);
    this.tag = _YAMLOMap.tag;
  }
  /**
   * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
   * but TypeScript won't allow widening the signature of a child method.
   */
  toJSON(_, ctx) {
    if (!ctx)
      return super.toJSON(_);
    const map2 = /* @__PURE__ */ new Map();
    if (ctx?.onCreate)
      ctx.onCreate(map2);
    for (const pair of this.items) {
      let key, value;
      if (isPair(pair)) {
        key = toJS(pair.key, "", ctx);
        value = toJS(pair.value, key, ctx);
      } else {
        key = toJS(pair, "", ctx);
      }
      if (map2.has(key))
        throw new Error("Ordered maps must not include duplicate keys");
      map2.set(key, value);
    }
    return map2;
  }
  static from(schema4, iterable, ctx) {
    const pairs2 = createPairs(schema4, iterable, ctx);
    const omap2 = new this();
    omap2.items = pairs2.items;
    return omap2;
  }
};
YAMLOMap.tag = "tag:yaml.org,2002:omap";
var omap = {
  collection: "seq",
  identify: (value) => value instanceof Map,
  nodeClass: YAMLOMap,
  default: false,
  tag: "tag:yaml.org,2002:omap",
  resolve(seq2, onError) {
    const pairs2 = resolvePairs(seq2, onError);
    const seenKeys = [];
    for (const { key } of pairs2.items) {
      if (isScalar(key)) {
        if (seenKeys.includes(key.value)) {
          onError(`Ordered maps must not include duplicate keys: ${key.value}`);
        } else {
          seenKeys.push(key.value);
        }
      }
    }
    return Object.assign(new YAMLOMap(), pairs2);
  },
  createNode: (schema4, iterable, ctx) => YAMLOMap.from(schema4, iterable, ctx)
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
function boolStringify({ value, source }, ctx) {
  const boolObj = value ? trueTag : falseTag;
  if (source && boolObj.test.test(source))
    return source;
  return value ? ctx.options.trueStr : ctx.options.falseStr;
}
var trueTag = {
  identify: (value) => value === true,
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => new Scalar(true),
  stringify: boolStringify
};
var falseTag = {
  identify: (value) => value === false,
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: () => new Scalar(false),
  stringify: boolStringify
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/float.js
var floatNaN2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (str2) => str2.slice(-3).toLowerCase() === "nan" ? NaN : str2[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: stringifyNumber
};
var floatExp2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: (str2) => parseFloat(str2.replace(/_/g, "")),
  stringify(node) {
    const num = Number(node.value);
    return isFinite(num) ? num.toExponential() : stringifyNumber(node);
  }
};
var float2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(str2) {
    const node = new Scalar(parseFloat(str2.replace(/_/g, "")));
    const dot2 = str2.indexOf(".");
    if (dot2 !== -1) {
      const f = str2.substring(dot2 + 1).replace(/_/g, "");
      if (f[f.length - 1] === "0")
        node.minFractionDigits = f.length;
    }
    return node;
  },
  stringify: stringifyNumber
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/int.js
var intIdentify3 = (value) => typeof value === "bigint" || Number.isInteger(value);
function intResolve2(str2, offset, radix, { intAsBigInt }) {
  const sign = str2[0];
  if (sign === "-" || sign === "+")
    offset += 1;
  str2 = str2.substring(offset).replace(/_/g, "");
  if (intAsBigInt) {
    switch (radix) {
      case 2:
        str2 = `0b${str2}`;
        break;
      case 8:
        str2 = `0o${str2}`;
        break;
      case 16:
        str2 = `0x${str2}`;
        break;
    }
    const n2 = BigInt(str2);
    return sign === "-" ? BigInt(-1) * n2 : n2;
  }
  const n = parseInt(str2, radix);
  return sign === "-" ? -1 * n : n;
}
function intStringify2(node, radix, prefix) {
  const { value } = node;
  if (intIdentify3(value)) {
    const str2 = value.toString(radix);
    return value < 0 ? "-" + prefix + str2.substr(1) : prefix + str2;
  }
  return stringifyNumber(node);
}
var intBin = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: (str2, _onError, opt) => intResolve2(str2, 2, 2, opt),
  stringify: (node) => intStringify2(node, 2, "0b")
};
var intOct2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: (str2, _onError, opt) => intResolve2(str2, 1, 8, opt),
  stringify: (node) => intStringify2(node, 8, "0")
};
var int2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: (str2, _onError, opt) => intResolve2(str2, 0, 10, opt),
  stringify: stringifyNumber
};
var intHex2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: (str2, _onError, opt) => intResolve2(str2, 2, 16, opt),
  stringify: (node) => intStringify2(node, 16, "0x")
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/set.js
var YAMLSet = class _YAMLSet extends YAMLMap {
  constructor(schema4) {
    super(schema4);
    this.tag = _YAMLSet.tag;
  }
  add(key) {
    let pair;
    if (isPair(key))
      pair = key;
    else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
      pair = new Pair(key.key, null);
    else
      pair = new Pair(key, null);
    const prev = findPair(this.items, pair.key);
    if (!prev)
      this.items.push(pair);
  }
  /**
   * If `keepPair` is `true`, returns the Pair matching `key`.
   * Otherwise, returns the value of that Pair's key.
   */
  get(key, keepPair) {
    const pair = findPair(this.items, key);
    return !keepPair && isPair(pair) ? isScalar(pair.key) ? pair.key.value : pair.key : pair;
  }
  set(key, value) {
    if (typeof value !== "boolean")
      throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
    const prev = findPair(this.items, key);
    if (prev && !value) {
      this.items.splice(this.items.indexOf(prev), 1);
    } else if (!prev && value) {
      this.items.push(new Pair(key));
    }
  }
  toJSON(_, ctx) {
    return super.toJSON(_, ctx, Set);
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    if (this.hasAllNullValues(true))
      return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
    else
      throw new Error("Set items must all have null values");
  }
  static from(schema4, iterable, ctx) {
    const { replacer } = ctx;
    const set2 = new this(schema4);
    if (iterable && Symbol.iterator in Object(iterable))
      for (let value of iterable) {
        if (typeof replacer === "function")
          value = replacer.call(iterable, value, value);
        set2.items.push(createPair(value, null, ctx));
      }
    return set2;
  }
};
YAMLSet.tag = "tag:yaml.org,2002:set";
var set = {
  collection: "map",
  identify: (value) => value instanceof Set,
  nodeClass: YAMLSet,
  default: false,
  tag: "tag:yaml.org,2002:set",
  createNode: (schema4, iterable, ctx) => YAMLSet.from(schema4, iterable, ctx),
  resolve(map2, onError) {
    if (isMap(map2)) {
      if (map2.hasAllNullValues(true))
        return Object.assign(new YAMLSet(), map2);
      else
        onError("Set items must all have null values");
    } else
      onError("Expected a mapping for this tag");
    return map2;
  }
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
function parseSexagesimal(str2, asBigInt) {
  const sign = str2[0];
  const parts = sign === "-" || sign === "+" ? str2.substring(1) : str2;
  const num = (n) => asBigInt ? BigInt(n) : Number(n);
  const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
  return sign === "-" ? num(-1) * res : res;
}
function stringifySexagesimal(node) {
  let { value } = node;
  let num = (n) => n;
  if (typeof value === "bigint")
    num = (n) => BigInt(n);
  else if (isNaN(value) || !isFinite(value))
    return stringifyNumber(node);
  let sign = "";
  if (value < 0) {
    sign = "-";
    value *= num(-1);
  }
  const _60 = num(60);
  const parts = [value % _60];
  if (value < 60) {
    parts.unshift(0);
  } else {
    value = (value - parts[0]) / _60;
    parts.unshift(value % _60);
    if (value >= 60) {
      value = (value - parts[0]) / _60;
      parts.unshift(value);
    }
  }
  return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
var intTime = {
  identify: (value) => typeof value === "bigint" || Number.isInteger(value),
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: (str2, _onError, { intAsBigInt }) => parseSexagesimal(str2, intAsBigInt),
  stringify: stringifySexagesimal
};
var floatTime = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: (str2) => parseSexagesimal(str2, false),
  stringify: stringifySexagesimal
};
var timestamp = {
  identify: (value) => value instanceof Date,
  default: true,
  tag: "tag:yaml.org,2002:timestamp",
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(str2) {
    const match = str2.match(timestamp.test);
    if (!match)
      throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, year, month, day, hour, minute, second] = match.map(Number);
    const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
    let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
    const tz = match[8];
    if (tz && tz !== "Z") {
      let d = parseSexagesimal(tz, false);
      if (Math.abs(d) < 30)
        d *= 60;
      date -= 6e4 * d;
    }
    return new Date(date);
  },
  stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/schema.js
var schema3 = [
  map,
  seq,
  string,
  nullTag,
  trueTag,
  falseTag,
  intBin,
  intOct2,
  int2,
  intHex2,
  floatNaN2,
  floatExp2,
  float2,
  binary,
  merge,
  omap,
  pairs,
  set,
  intTime,
  floatTime,
  timestamp
];

// node_modules/yaml/browser/dist/schema/tags.js
var schemas = /* @__PURE__ */ new Map([
  ["core", schema],
  ["failsafe", [map, seq, string]],
  ["json", schema2],
  ["yaml11", schema3],
  ["yaml-1.1", schema3]
]);
var tagsByName = {
  binary,
  bool: boolTag,
  float,
  floatExp,
  floatNaN,
  floatTime,
  int,
  intHex,
  intOct,
  intTime,
  map,
  merge,
  null: nullTag,
  omap,
  pairs,
  seq,
  set,
  timestamp
};
var coreKnownTags = {
  "tag:yaml.org,2002:binary": binary,
  "tag:yaml.org,2002:merge": merge,
  "tag:yaml.org,2002:omap": omap,
  "tag:yaml.org,2002:pairs": pairs,
  "tag:yaml.org,2002:set": set,
  "tag:yaml.org,2002:timestamp": timestamp
};
function getTags(customTags, schemaName, addMergeTag) {
  const schemaTags = schemas.get(schemaName);
  if (schemaTags && !customTags) {
    return addMergeTag && !schemaTags.includes(merge) ? schemaTags.concat(merge) : schemaTags.slice();
  }
  let tags = schemaTags;
  if (!tags) {
    if (Array.isArray(customTags))
      tags = [];
    else {
      const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
    }
  }
  if (Array.isArray(customTags)) {
    for (const tag of customTags)
      tags = tags.concat(tag);
  } else if (typeof customTags === "function") {
    tags = customTags(tags.slice());
  }
  if (addMergeTag)
    tags = tags.concat(merge);
  return tags.reduce((tags2, tag) => {
    const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
    if (!tagObj) {
      const tagName = JSON.stringify(tag);
      const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
    }
    if (!tags2.includes(tagObj))
      tags2.push(tagObj);
    return tags2;
  }, []);
}

// node_modules/yaml/browser/dist/schema/Schema.js
var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
var Schema = class _Schema {
  constructor({ compat, customTags, merge: merge2, resolveKnownTags, schema: schema4, sortMapEntries, toStringDefaults }) {
    this.compat = Array.isArray(compat) ? getTags(compat, "compat") : compat ? getTags(null, compat) : null;
    this.name = typeof schema4 === "string" && schema4 || "core";
    this.knownTags = resolveKnownTags ? coreKnownTags : {};
    this.tags = getTags(customTags, this.name, merge2);
    this.toStringOptions = toStringDefaults ?? null;
    Object.defineProperty(this, MAP, { value: map });
    Object.defineProperty(this, SCALAR, { value: string });
    Object.defineProperty(this, SEQ, { value: seq });
    this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
  }
  clone() {
    const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
    copy.tags = this.tags.slice();
    return copy;
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyDocument.js
function stringifyDocument(doc, options) {
  const lines = [];
  let hasDirectives = options.directives === true;
  if (options.directives !== false && doc.directives) {
    const dir = doc.directives.toString(doc);
    if (dir) {
      lines.push(dir);
      hasDirectives = true;
    } else if (doc.directives.docStart)
      hasDirectives = true;
  }
  if (hasDirectives)
    lines.push("---");
  const ctx = createStringifyContext(doc, options);
  const { commentString } = ctx.options;
  if (doc.commentBefore) {
    if (lines.length !== 1)
      lines.unshift("");
    const cs = commentString(doc.commentBefore);
    lines.unshift(indentComment(cs, ""));
  }
  let chompKeep = false;
  let contentComment = null;
  if (doc.contents) {
    if (isNode(doc.contents)) {
      if (doc.contents.spaceBefore && hasDirectives)
        lines.push("");
      if (doc.contents.commentBefore) {
        const cs = commentString(doc.contents.commentBefore);
        lines.push(indentComment(cs, ""));
      }
      ctx.forceBlockIndent = !!doc.comment;
      contentComment = doc.contents.comment;
    }
    const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
    let body = stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
    if (contentComment)
      body += lineComment(body, "", commentString(contentComment));
    if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
      lines[lines.length - 1] = `--- ${body}`;
    } else
      lines.push(body);
  } else {
    lines.push(stringify(doc.contents, ctx));
  }
  if (doc.directives?.docEnd) {
    if (doc.comment) {
      const cs = commentString(doc.comment);
      if (cs.includes("\n")) {
        lines.push("...");
        lines.push(indentComment(cs, ""));
      } else {
        lines.push(`... ${cs}`);
      }
    } else {
      lines.push("...");
    }
  } else {
    let dc = doc.comment;
    if (dc && chompKeep)
      dc = dc.replace(/^\n+/, "");
    if (dc) {
      if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
        lines.push("");
      lines.push(indentComment(commentString(dc), ""));
    }
  }
  return lines.join("\n") + "\n";
}

// node_modules/yaml/browser/dist/doc/Document.js
var Document = class _Document {
  constructor(value, replacer, options) {
    this.commentBefore = null;
    this.comment = null;
    this.errors = [];
    this.warnings = [];
    Object.defineProperty(this, NODE_TYPE, { value: DOC });
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer)) {
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
      replacer = void 0;
    }
    const opt = Object.assign({
      intAsBigInt: false,
      keepSourceTokens: false,
      logLevel: "warn",
      prettyErrors: true,
      strict: true,
      stringKeys: false,
      uniqueKeys: true,
      version: "1.2"
    }, options);
    this.options = opt;
    let { version } = opt;
    if (options?._directives) {
      this.directives = options._directives.atDocument();
      if (this.directives.yaml.explicit)
        version = this.directives.yaml.version;
    } else
      this.directives = new Directives({ version });
    this.setSchema(version, options);
    this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
  }
  /**
   * Create a deep copy of this Document and its contents.
   *
   * Custom Node values that inherit from `Object` still refer to their original instances.
   */
  clone() {
    const copy = Object.create(_Document.prototype, {
      [NODE_TYPE]: { value: DOC }
    });
    copy.commentBefore = this.commentBefore;
    copy.comment = this.comment;
    copy.errors = this.errors.slice();
    copy.warnings = this.warnings.slice();
    copy.options = Object.assign({}, this.options);
    if (this.directives)
      copy.directives = this.directives.clone();
    copy.schema = this.schema.clone();
    copy.contents = isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /** Adds a value to the document. */
  add(value) {
    if (assertCollection(this.contents))
      this.contents.add(value);
  }
  /** Adds a value to the document. */
  addIn(path, value) {
    if (assertCollection(this.contents))
      this.contents.addIn(path, value);
  }
  /**
   * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
   *
   * If `node` already has an anchor, `name` is ignored.
   * Otherwise, the `node.anchor` value will be set to `name`,
   * or if an anchor with that name is already present in the document,
   * `name` will be used as a prefix for a new unique anchor.
   * If `name` is undefined, the generated anchor will use 'a' as a prefix.
   */
  createAlias(node, name) {
    if (!node.anchor) {
      const prev = anchorNames(this);
      node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !name || prev.has(name) ? findNewAnchor(name || "a", prev) : name;
    }
    return new Alias(node.anchor);
  }
  createNode(value, replacer, options) {
    let _replacer = void 0;
    if (typeof replacer === "function") {
      value = replacer.call({ "": value }, "", value);
      _replacer = replacer;
    } else if (Array.isArray(replacer)) {
      const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
      const asStr = replacer.filter(keyToStr).map(String);
      if (asStr.length > 0)
        replacer = replacer.concat(asStr);
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
      replacer = void 0;
    }
    const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
    const { onAnchor, setAnchors, sourceObjects } = createNodeAnchors(
      this,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      anchorPrefix || "a"
    );
    const ctx = {
      aliasDuplicateObjects: aliasDuplicateObjects ?? true,
      keepUndefined: keepUndefined ?? false,
      onAnchor,
      onTagObj,
      replacer: _replacer,
      schema: this.schema,
      sourceObjects
    };
    const node = createNode(value, tag, ctx);
    if (flow && isCollection(node))
      node.flow = true;
    setAnchors();
    return node;
  }
  /**
   * Convert a key and a value into a `Pair` using the current schema,
   * recursively wrapping all values as `Scalar` or `Collection` nodes.
   */
  createPair(key, value, options = {}) {
    const k = this.createNode(key, null, options);
    const v = this.createNode(value, null, options);
    return new Pair(k, v);
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  delete(key) {
    return assertCollection(this.contents) ? this.contents.delete(key) : false;
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(path) {
    if (isEmptyPath(path)) {
      if (this.contents == null)
        return false;
      this.contents = null;
      return true;
    }
    return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  get(key, keepScalar) {
    return isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
  }
  /**
   * Returns item at `path`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(path, keepScalar) {
    if (isEmptyPath(path))
      return !keepScalar && isScalar(this.contents) ? this.contents.value : this.contents;
    return isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
  }
  /**
   * Checks if the document includes a value with the key `key`.
   */
  has(key) {
    return isCollection(this.contents) ? this.contents.has(key) : false;
  }
  /**
   * Checks if the document includes a value at `path`.
   */
  hasIn(path) {
    if (isEmptyPath(path))
      return this.contents !== void 0;
    return isCollection(this.contents) ? this.contents.hasIn(path) : false;
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  set(key, value) {
    if (this.contents == null) {
      this.contents = collectionFromPath(this.schema, [key], value);
    } else if (assertCollection(this.contents)) {
      this.contents.set(key, value);
    }
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(path, value) {
    if (isEmptyPath(path)) {
      this.contents = value;
    } else if (this.contents == null) {
      this.contents = collectionFromPath(this.schema, Array.from(path), value);
    } else if (assertCollection(this.contents)) {
      this.contents.setIn(path, value);
    }
  }
  /**
   * Change the YAML version and schema used by the document.
   * A `null` version disables support for directives, explicit tags, anchors, and aliases.
   * It also requires the `schema` option to be given as a `Schema` instance value.
   *
   * Overrides all previously set schema options.
   */
  setSchema(version, options = {}) {
    if (typeof version === "number")
      version = String(version);
    let opt;
    switch (version) {
      case "1.1":
        if (this.directives)
          this.directives.yaml.version = "1.1";
        else
          this.directives = new Directives({ version: "1.1" });
        opt = { resolveKnownTags: false, schema: "yaml-1.1" };
        break;
      case "1.2":
      case "next":
        if (this.directives)
          this.directives.yaml.version = version;
        else
          this.directives = new Directives({ version });
        opt = { resolveKnownTags: true, schema: "core" };
        break;
      case null:
        if (this.directives)
          delete this.directives;
        opt = null;
        break;
      default: {
        const sv = JSON.stringify(version);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
      }
    }
    if (options.schema instanceof Object)
      this.schema = options.schema;
    else if (opt)
      this.schema = new Schema(Object.assign(opt, options));
    else
      throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
  }
  // json & jsonArg are only used from toJSON()
  toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
    const ctx = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !json,
      mapAsMap: mapAsMap === true,
      mapKeyWarned: false,
      maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
    };
    const res = toJS(this.contents, jsonArg ?? "", ctx);
    if (typeof onAnchor === "function")
      for (const { count, res: res2 } of ctx.anchors.values())
        onAnchor(res2, count);
    return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
  }
  /**
   * A JSON representation of the document `contents`.
   *
   * @param jsonArg Used by `JSON.stringify` to indicate the array index or
   *   property name.
   */
  toJSON(jsonArg, onAnchor) {
    return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
  }
  /** A YAML representation of the document. */
  toString(options = {}) {
    if (this.errors.length > 0)
      throw new Error("Document with errors cannot be stringified");
    if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
      const s = JSON.stringify(options.indent);
      throw new Error(`"indent" option must be a positive integer, not ${s}`);
    }
    return stringifyDocument(this, options);
  }
};
function assertCollection(contents) {
  if (isCollection(contents))
    return true;
  throw new Error("Expected a YAML collection as document contents");
}

// node_modules/yaml/browser/dist/errors.js
var YAMLError = class extends Error {
  constructor(name, pos, code, message) {
    super();
    this.name = name;
    this.code = code;
    this.message = message;
    this.pos = pos;
  }
};
var YAMLParseError = class extends YAMLError {
  constructor(pos, code, message) {
    super("YAMLParseError", pos, code, message);
  }
};
var YAMLWarning = class extends YAMLError {
  constructor(pos, code, message) {
    super("YAMLWarning", pos, code, message);
  }
};
var prettifyError = (src, lc) => (error) => {
  if (error.pos[0] === -1)
    return;
  error.linePos = error.pos.map((pos) => lc.linePos(pos));
  const { line, col } = error.linePos[0];
  error.message += ` at line ${line}, column ${col}`;
  let ci = col - 1;
  let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
  if (ci >= 60 && lineStr.length > 80) {
    const trimStart = Math.min(ci - 39, lineStr.length - 79);
    lineStr = "\u2026" + lineStr.substring(trimStart);
    ci -= trimStart - 1;
  }
  if (lineStr.length > 80)
    lineStr = lineStr.substring(0, 79) + "\u2026";
  if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
    let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
    if (prev.length > 80)
      prev = prev.substring(0, 79) + "\u2026\n";
    lineStr = prev + lineStr;
  }
  if (/[^ ]/.test(lineStr)) {
    let count = 1;
    const end = error.linePos[1];
    if (end?.line === line && end.col > col) {
      count = Math.max(1, Math.min(end.col - col, 80 - ci));
    }
    const pointer = " ".repeat(ci) + "^".repeat(count);
    error.message += `:

${lineStr}
${pointer}
`;
  }
};

// node_modules/yaml/browser/dist/compose/resolve-props.js
function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
  let spaceBefore = false;
  let atNewline = startOnNewline;
  let hasSpace = startOnNewline;
  let comment = "";
  let commentSep = "";
  let hasNewline = false;
  let reqSpace = false;
  let tab = null;
  let anchor = null;
  let tag = null;
  let newlineAfterProp = null;
  let comma = null;
  let found = null;
  let start = null;
  for (const token of tokens) {
    if (reqSpace) {
      if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
        onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      reqSpace = false;
    }
    if (tab) {
      if (atNewline && token.type !== "comment" && token.type !== "newline") {
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      }
      tab = null;
    }
    switch (token.type) {
      case "space":
        if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
          tab = token;
        }
        hasSpace = true;
        break;
      case "comment": {
        if (!hasSpace)
          onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
        const cb = token.source.substring(1) || " ";
        if (!comment)
          comment = cb;
        else
          comment += commentSep + cb;
        commentSep = "";
        atNewline = false;
        break;
      }
      case "newline":
        if (atNewline) {
          if (comment)
            comment += token.source;
          else if (!found || indicator !== "seq-item-ind")
            spaceBefore = true;
        } else
          commentSep += token.source;
        atNewline = true;
        hasNewline = true;
        if (anchor || tag)
          newlineAfterProp = token;
        hasSpace = true;
        break;
      case "anchor":
        if (anchor)
          onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
        if (token.source.endsWith(":"))
          onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
        anchor = token;
        start ?? (start = token.offset);
        atNewline = false;
        hasSpace = false;
        reqSpace = true;
        break;
      case "tag": {
        if (tag)
          onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
        tag = token;
        start ?? (start = token.offset);
        atNewline = false;
        hasSpace = false;
        reqSpace = true;
        break;
      }
      case indicator:
        if (anchor || tag)
          onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
        if (found)
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
        found = token;
        atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
        hasSpace = false;
        break;
      case "comma":
        if (flow) {
          if (comma)
            onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
          comma = token;
          atNewline = false;
          hasSpace = false;
          break;
        }
      default:
        onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
        atNewline = false;
        hasSpace = false;
    }
  }
  const last = tokens[tokens.length - 1];
  const end = last ? last.offset + last.source.length : offset;
  if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
    onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
  }
  if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
    onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
  return {
    comma,
    found,
    spaceBefore,
    comment,
    hasNewline,
    anchor,
    tag,
    newlineAfterProp,
    end,
    start: start ?? end
  };
}

// node_modules/yaml/browser/dist/compose/util-contains-newline.js
function containsNewline(key) {
  if (!key)
    return null;
  switch (key.type) {
    case "alias":
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      if (key.source.includes("\n"))
        return true;
      if (key.end) {
        for (const st of key.end)
          if (st.type === "newline")
            return true;
      }
      return false;
    case "flow-collection":
      for (const it of key.items) {
        for (const st of it.start)
          if (st.type === "newline")
            return true;
        if (it.sep) {
          for (const st of it.sep)
            if (st.type === "newline")
              return true;
        }
        if (containsNewline(it.key) || containsNewline(it.value))
          return true;
      }
      return false;
    default:
      return true;
  }
}

// node_modules/yaml/browser/dist/compose/util-flow-indent-check.js
function flowIndentCheck(indent, fc, onError) {
  if (fc?.type === "flow-collection") {
    const end = fc.end[0];
    if (end.indent === indent && (end.source === "]" || end.source === "}") && containsNewline(fc)) {
      const msg = "Flow end indicator should be more indented than parent";
      onError(end, "BAD_INDENT", msg, true);
    }
  }
}

// node_modules/yaml/browser/dist/compose/util-map-includes.js
function mapIncludes(ctx, items, search) {
  const { uniqueKeys } = ctx.options;
  if (uniqueKeys === false)
    return false;
  const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || isScalar(a) && isScalar(b) && a.value === b.value;
  return items.some((pair) => isEqual(pair.key, search));
}

// node_modules/yaml/browser/dist/compose/resolve-block-map.js
var startColMsg = "All mapping items must start at the same column";
function resolveBlockMap({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bm, onError, tag) {
  const NodeClass = tag?.nodeClass ?? YAMLMap;
  const map2 = new NodeClass(ctx.schema);
  if (ctx.atRoot)
    ctx.atRoot = false;
  let offset = bm.offset;
  let commentEnd = null;
  for (const collItem of bm.items) {
    const { start, key, sep, value } = collItem;
    const keyProps = resolveProps(start, {
      indicator: "explicit-key-ind",
      next: key ?? sep?.[0],
      offset,
      onError,
      parentIndent: bm.indent,
      startOnNewline: true
    });
    const implicitKey = !keyProps.found;
    if (implicitKey) {
      if (key) {
        if (key.type === "block-seq")
          onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
        else if ("indent" in key && key.indent !== bm.indent)
          onError(offset, "BAD_INDENT", startColMsg);
      }
      if (!keyProps.anchor && !keyProps.tag && !sep) {
        commentEnd = keyProps.end;
        if (keyProps.comment) {
          if (map2.comment)
            map2.comment += "\n" + keyProps.comment;
          else
            map2.comment = keyProps.comment;
        }
        continue;
      }
      if (keyProps.newlineAfterProp || containsNewline(key)) {
        onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
      }
    } else if (keyProps.found?.indent !== bm.indent) {
      onError(offset, "BAD_INDENT", startColMsg);
    }
    ctx.atKey = true;
    const keyStart = keyProps.end;
    const keyNode = key ? composeNode2(ctx, key, keyProps, onError) : composeEmptyNode2(ctx, keyStart, start, null, keyProps, onError);
    if (ctx.schema.compat)
      flowIndentCheck(bm.indent, key, onError);
    ctx.atKey = false;
    if (mapIncludes(ctx, map2.items, keyNode))
      onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
    const valueProps = resolveProps(sep ?? [], {
      indicator: "map-value-ind",
      next: value,
      offset: keyNode.range[2],
      onError,
      parentIndent: bm.indent,
      startOnNewline: !key || key.type === "block-scalar"
    });
    offset = valueProps.end;
    if (valueProps.found) {
      if (implicitKey) {
        if (value?.type === "block-map" && !valueProps.hasNewline)
          onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
        if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
          onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
      }
      const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : composeEmptyNode2(ctx, offset, sep, null, valueProps, onError);
      if (ctx.schema.compat)
        flowIndentCheck(bm.indent, value, onError);
      offset = valueNode.range[2];
      const pair = new Pair(keyNode, valueNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      map2.items.push(pair);
    } else {
      if (implicitKey)
        onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
      if (valueProps.comment) {
        if (keyNode.comment)
          keyNode.comment += "\n" + valueProps.comment;
        else
          keyNode.comment = valueProps.comment;
      }
      const pair = new Pair(keyNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      map2.items.push(pair);
    }
  }
  if (commentEnd && commentEnd < offset)
    onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
  map2.range = [bm.offset, offset, commentEnd ?? offset];
  return map2;
}

// node_modules/yaml/browser/dist/compose/resolve-block-seq.js
function resolveBlockSeq({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bs, onError, tag) {
  const NodeClass = tag?.nodeClass ?? YAMLSeq;
  const seq2 = new NodeClass(ctx.schema);
  if (ctx.atRoot)
    ctx.atRoot = false;
  if (ctx.atKey)
    ctx.atKey = false;
  let offset = bs.offset;
  let commentEnd = null;
  for (const { start, value } of bs.items) {
    const props = resolveProps(start, {
      indicator: "seq-item-ind",
      next: value,
      offset,
      onError,
      parentIndent: bs.indent,
      startOnNewline: true
    });
    if (!props.found) {
      if (props.anchor || props.tag || value) {
        if (value?.type === "block-seq")
          onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
        else
          onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
      } else {
        commentEnd = props.end;
        if (props.comment)
          seq2.comment = props.comment;
        continue;
      }
    }
    const node = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, start, null, props, onError);
    if (ctx.schema.compat)
      flowIndentCheck(bs.indent, value, onError);
    offset = node.range[2];
    seq2.items.push(node);
  }
  seq2.range = [bs.offset, offset, commentEnd ?? offset];
  return seq2;
}

// node_modules/yaml/browser/dist/compose/resolve-end.js
function resolveEnd(end, offset, reqSpace, onError) {
  let comment = "";
  if (end) {
    let hasSpace = false;
    let sep = "";
    for (const token of end) {
      const { source, type } = token;
      switch (type) {
        case "space":
          hasSpace = true;
          break;
        case "comment": {
          if (reqSpace && !hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const cb = source.substring(1) || " ";
          if (!comment)
            comment = cb;
          else
            comment += sep + cb;
          sep = "";
          break;
        }
        case "newline":
          if (comment)
            sep += source;
          hasSpace = true;
          break;
        default:
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
      }
      offset += source.length;
    }
  }
  return { comment, offset };
}

// node_modules/yaml/browser/dist/compose/resolve-flow-collection.js
var blockMsg = "Block collections are not allowed within flow collections";
var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
function resolveFlowCollection({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, fc, onError, tag) {
  const isMap2 = fc.start.source === "{";
  const fcName = isMap2 ? "flow map" : "flow sequence";
  const NodeClass = tag?.nodeClass ?? (isMap2 ? YAMLMap : YAMLSeq);
  const coll = new NodeClass(ctx.schema);
  coll.flow = true;
  const atRoot = ctx.atRoot;
  if (atRoot)
    ctx.atRoot = false;
  if (ctx.atKey)
    ctx.atKey = false;
  let offset = fc.offset + fc.start.source.length;
  for (let i = 0; i < fc.items.length; ++i) {
    const collItem = fc.items[i];
    const { start, key, sep, value } = collItem;
    const props = resolveProps(start, {
      flow: fcName,
      indicator: "explicit-key-ind",
      next: key ?? sep?.[0],
      offset,
      onError,
      parentIndent: fc.indent,
      startOnNewline: false
    });
    if (!props.found) {
      if (!props.anchor && !props.tag && !sep && !value) {
        if (i === 0 && props.comma)
          onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        else if (i < fc.items.length - 1)
          onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
        if (props.comment) {
          if (coll.comment)
            coll.comment += "\n" + props.comment;
          else
            coll.comment = props.comment;
        }
        offset = props.end;
        continue;
      }
      if (!isMap2 && ctx.options.strict && containsNewline(key))
        onError(
          key,
          // checked by containsNewline()
          "MULTILINE_IMPLICIT_KEY",
          "Implicit keys of flow sequence pairs need to be on a single line"
        );
    }
    if (i === 0) {
      if (props.comma)
        onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
    } else {
      if (!props.comma)
        onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
      if (props.comment) {
        let prevItemComment = "";
        loop:
          for (const st of start) {
            switch (st.type) {
              case "comma":
              case "space":
                break;
              case "comment":
                prevItemComment = st.source.substring(1);
                break loop;
              default:
                break loop;
            }
          }
        if (prevItemComment) {
          let prev = coll.items[coll.items.length - 1];
          if (isPair(prev))
            prev = prev.value ?? prev.key;
          if (prev.comment)
            prev.comment += "\n" + prevItemComment;
          else
            prev.comment = prevItemComment;
          props.comment = props.comment.substring(prevItemComment.length + 1);
        }
      }
    }
    if (!isMap2 && !sep && !props.found) {
      const valueNode = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, sep, null, props, onError);
      coll.items.push(valueNode);
      offset = valueNode.range[2];
      if (isBlock(value))
        onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
    } else {
      ctx.atKey = true;
      const keyStart = props.end;
      const keyNode = key ? composeNode2(ctx, key, props, onError) : composeEmptyNode2(ctx, keyStart, start, null, props, onError);
      if (isBlock(key))
        onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
      ctx.atKey = false;
      const valueProps = resolveProps(sep ?? [], {
        flow: fcName,
        indicator: "map-value-ind",
        next: value,
        offset: keyNode.range[2],
        onError,
        parentIndent: fc.indent,
        startOnNewline: false
      });
      if (valueProps.found) {
        if (!isMap2 && !props.found && ctx.options.strict) {
          if (sep)
            for (const st of sep) {
              if (st === valueProps.found)
                break;
              if (st.type === "newline") {
                onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                break;
              }
            }
          if (props.start < valueProps.found.offset - 1024)
            onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
        }
      } else if (value) {
        if ("source" in value && value.source?.[0] === ":")
          onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
        else
          onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
      }
      const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode2(ctx, valueProps.end, sep, null, valueProps, onError) : null;
      if (valueNode) {
        if (isBlock(value))
          onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
      } else if (valueProps.comment) {
        if (keyNode.comment)
          keyNode.comment += "\n" + valueProps.comment;
        else
          keyNode.comment = valueProps.comment;
      }
      const pair = new Pair(keyNode, valueNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      if (isMap2) {
        const map2 = coll;
        if (mapIncludes(ctx, map2.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        map2.items.push(pair);
      } else {
        const map2 = new YAMLMap(ctx.schema);
        map2.flow = true;
        map2.items.push(pair);
        const endRange = (valueNode ?? keyNode).range;
        map2.range = [keyNode.range[0], endRange[1], endRange[2]];
        coll.items.push(map2);
      }
      offset = valueNode ? valueNode.range[2] : valueProps.end;
    }
  }
  const expectedEnd = isMap2 ? "}" : "]";
  const [ce, ...ee] = fc.end;
  let cePos = offset;
  if (ce?.source === expectedEnd)
    cePos = ce.offset + ce.source.length;
  else {
    const name = fcName[0].toUpperCase() + fcName.substring(1);
    const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
    onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
    if (ce && ce.source.length !== 1)
      ee.unshift(ce);
  }
  if (ee.length > 0) {
    const end = resolveEnd(ee, cePos, ctx.options.strict, onError);
    if (end.comment) {
      if (coll.comment)
        coll.comment += "\n" + end.comment;
      else
        coll.comment = end.comment;
    }
    coll.range = [fc.offset, cePos, end.offset];
  } else {
    coll.range = [fc.offset, cePos, cePos];
  }
  return coll;
}

// node_modules/yaml/browser/dist/compose/compose-collection.js
function resolveCollection(CN2, ctx, token, onError, tagName, tag) {
  const coll = token.type === "block-map" ? resolveBlockMap(CN2, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq(CN2, ctx, token, onError, tag) : resolveFlowCollection(CN2, ctx, token, onError, tag);
  const Coll = coll.constructor;
  if (tagName === "!" || tagName === Coll.tagName) {
    coll.tag = Coll.tagName;
    return coll;
  }
  if (tagName)
    coll.tag = tagName;
  return coll;
}
function composeCollection(CN2, ctx, token, props, onError) {
  const tagToken = props.tag;
  const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
  if (token.type === "block-seq") {
    const { anchor, newlineAfterProp: nl } = props;
    const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
    if (lastProp && (!nl || nl.offset < lastProp.offset)) {
      const message = "Missing newline after block sequence props";
      onError(lastProp, "MISSING_CHAR", message);
    }
  }
  const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
  if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.tagName && expType === "seq") {
    return resolveCollection(CN2, ctx, token, onError, tagName);
  }
  let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
  if (!tag) {
    const kt = ctx.schema.knownTags[tagName];
    if (kt?.collection === expType) {
      ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
      tag = kt;
    } else {
      if (kt) {
        onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
      } else {
        onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
      }
      return resolveCollection(CN2, ctx, token, onError, tagName);
    }
  }
  const coll = resolveCollection(CN2, ctx, token, onError, tagName, tag);
  const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
  const node = isNode(res) ? res : new Scalar(res);
  node.range = coll.range;
  node.tag = tagName;
  if (tag?.format)
    node.format = tag.format;
  return node;
}

// node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
function resolveBlockScalar(ctx, scalar, onError) {
  const start = scalar.offset;
  const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
  if (!header)
    return { value: "", type: null, comment: "", range: [start, start, start] };
  const type = header.mode === ">" ? Scalar.BLOCK_FOLDED : Scalar.BLOCK_LITERAL;
  const lines = scalar.source ? splitLines(scalar.source) : [];
  let chompStart = lines.length;
  for (let i = lines.length - 1; i >= 0; --i) {
    const content = lines[i][1];
    if (content === "" || content === "\r")
      chompStart = i;
    else
      break;
  }
  if (chompStart === 0) {
    const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
    let end2 = start + header.length;
    if (scalar.source)
      end2 += scalar.source.length;
    return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
  }
  let trimIndent = scalar.indent + header.indent;
  let offset = scalar.offset + header.length;
  let contentStart = 0;
  for (let i = 0; i < chompStart; ++i) {
    const [indent, content] = lines[i];
    if (content === "" || content === "\r") {
      if (header.indent === 0 && indent.length > trimIndent)
        trimIndent = indent.length;
    } else {
      if (indent.length < trimIndent) {
        const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
        onError(offset + indent.length, "MISSING_CHAR", message);
      }
      if (header.indent === 0)
        trimIndent = indent.length;
      contentStart = i;
      if (trimIndent === 0 && !ctx.atRoot) {
        const message = "Block scalar values in collections must be indented";
        onError(offset, "BAD_INDENT", message);
      }
      break;
    }
    offset += indent.length + content.length + 1;
  }
  for (let i = lines.length - 1; i >= chompStart; --i) {
    if (lines[i][0].length > trimIndent)
      chompStart = i + 1;
  }
  let value = "";
  let sep = "";
  let prevMoreIndented = false;
  for (let i = 0; i < contentStart; ++i)
    value += lines[i][0].slice(trimIndent) + "\n";
  for (let i = contentStart; i < chompStart; ++i) {
    let [indent, content] = lines[i];
    offset += indent.length + content.length + 1;
    const crlf = content[content.length - 1] === "\r";
    if (crlf)
      content = content.slice(0, -1);
    if (content && indent.length < trimIndent) {
      const src = header.indent ? "explicit indentation indicator" : "first line";
      const message = `Block scalar lines must not be less indented than their ${src}`;
      onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
      indent = "";
    }
    if (type === Scalar.BLOCK_LITERAL) {
      value += sep + indent.slice(trimIndent) + content;
      sep = "\n";
    } else if (indent.length > trimIndent || content[0] === "	") {
      if (sep === " ")
        sep = "\n";
      else if (!prevMoreIndented && sep === "\n")
        sep = "\n\n";
      value += sep + indent.slice(trimIndent) + content;
      sep = "\n";
      prevMoreIndented = true;
    } else if (content === "") {
      if (sep === "\n")
        value += "\n";
      else
        sep = "\n";
    } else {
      value += sep + content;
      sep = " ";
      prevMoreIndented = false;
    }
  }
  switch (header.chomp) {
    case "-":
      break;
    case "+":
      for (let i = chompStart; i < lines.length; ++i)
        value += "\n" + lines[i][0].slice(trimIndent);
      if (value[value.length - 1] !== "\n")
        value += "\n";
      break;
    default:
      value += "\n";
  }
  const end = start + header.length + scalar.source.length;
  return { value, type, comment: header.comment, range: [start, end, end] };
}
function parseBlockScalarHeader({ offset, props }, strict, onError) {
  if (props[0].type !== "block-scalar-header") {
    onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
    return null;
  }
  const { source } = props[0];
  const mode = source[0];
  let indent = 0;
  let chomp = "";
  let error = -1;
  for (let i = 1; i < source.length; ++i) {
    const ch = source[i];
    if (!chomp && (ch === "-" || ch === "+"))
      chomp = ch;
    else {
      const n = Number(ch);
      if (!indent && n)
        indent = n;
      else if (error === -1)
        error = offset + i;
    }
  }
  if (error !== -1)
    onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
  let hasSpace = false;
  let comment = "";
  let length2 = source.length;
  for (let i = 1; i < props.length; ++i) {
    const token = props[i];
    switch (token.type) {
      case "space":
        hasSpace = true;
      case "newline":
        length2 += token.source.length;
        break;
      case "comment":
        if (strict && !hasSpace) {
          const message = "Comments must be separated from other tokens by white space characters";
          onError(token, "MISSING_CHAR", message);
        }
        length2 += token.source.length;
        comment = token.source.substring(1);
        break;
      case "error":
        onError(token, "UNEXPECTED_TOKEN", token.message);
        length2 += token.source.length;
        break;
      default: {
        const message = `Unexpected token in block scalar header: ${token.type}`;
        onError(token, "UNEXPECTED_TOKEN", message);
        const ts = token.source;
        if (ts && typeof ts === "string")
          length2 += ts.length;
      }
    }
  }
  return { mode, indent, chomp, comment, length: length2 };
}
function splitLines(source) {
  const split = source.split(/\n( *)/);
  const first = split[0];
  const m = first.match(/^( *)/);
  const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
  const lines = [line0];
  for (let i = 1; i < split.length; i += 2)
    lines.push([split[i], split[i + 1]]);
  return lines;
}

// node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
function resolveFlowScalar(scalar, strict, onError) {
  const { offset, type, source, end } = scalar;
  let _type;
  let value;
  const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
  switch (type) {
    case "scalar":
      _type = Scalar.PLAIN;
      value = plainValue(source, _onError);
      break;
    case "single-quoted-scalar":
      _type = Scalar.QUOTE_SINGLE;
      value = singleQuotedValue(source, _onError);
      break;
    case "double-quoted-scalar":
      _type = Scalar.QUOTE_DOUBLE;
      value = doubleQuotedValue(source, _onError);
      break;
    default:
      onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
      return {
        value: "",
        type: null,
        comment: "",
        range: [offset, offset + source.length, offset + source.length]
      };
  }
  const valueEnd = offset + source.length;
  const re = resolveEnd(end, valueEnd, strict, onError);
  return {
    value,
    type: _type,
    comment: re.comment,
    range: [offset, valueEnd, re.offset]
  };
}
function plainValue(source, onError) {
  let badChar = "";
  switch (source[0]) {
    case "	":
      badChar = "a tab character";
      break;
    case ",":
      badChar = "flow indicator character ,";
      break;
    case "%":
      badChar = "directive indicator character %";
      break;
    case "|":
    case ">": {
      badChar = `block scalar indicator ${source[0]}`;
      break;
    }
    case "@":
    case "`": {
      badChar = `reserved character ${source[0]}`;
      break;
    }
  }
  if (badChar)
    onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
  return foldLines(source);
}
function singleQuotedValue(source, onError) {
  if (source[source.length - 1] !== "'" || source.length === 1)
    onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
  return foldLines(source.slice(1, -1)).replace(/''/g, "'");
}
function foldLines(source) {
  let first, line;
  try {
    first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
    line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
  } catch {
    first = /(.*?)[ \t]*\r?\n/sy;
    line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
  }
  let match = first.exec(source);
  if (!match)
    return source;
  let res = match[1];
  let sep = " ";
  let pos = first.lastIndex;
  line.lastIndex = pos;
  while (match = line.exec(source)) {
    if (match[1] === "") {
      if (sep === "\n")
        res += sep;
      else
        sep = "\n";
    } else {
      res += sep + match[1];
      sep = " ";
    }
    pos = line.lastIndex;
  }
  const last = /[ \t]*(.*)/sy;
  last.lastIndex = pos;
  match = last.exec(source);
  return res + sep + (match?.[1] ?? "");
}
function doubleQuotedValue(source, onError) {
  let res = "";
  for (let i = 1; i < source.length - 1; ++i) {
    const ch = source[i];
    if (ch === "\r" && source[i + 1] === "\n")
      continue;
    if (ch === "\n") {
      const { fold, offset } = foldNewline(source, i);
      res += fold;
      i = offset;
    } else if (ch === "\\") {
      let next = source[++i];
      const cc = escapeCodes[next];
      if (cc)
        res += cc;
      else if (next === "\n") {
        next = source[i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
      } else if (next === "\r" && source[i + 1] === "\n") {
        next = source[++i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
      } else if (next === "x" || next === "u" || next === "U") {
        const length2 = { x: 2, u: 4, U: 8 }[next];
        res += parseCharCode(source, i + 1, length2, onError);
        i += length2;
      } else {
        const raw = source.substr(i - 1, 2);
        onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        res += raw;
      }
    } else if (ch === " " || ch === "	") {
      const wsStart = i;
      let next = source[i + 1];
      while (next === " " || next === "	")
        next = source[++i + 1];
      if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
        res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
    } else {
      res += ch;
    }
  }
  if (source[source.length - 1] !== '"' || source.length === 1)
    onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
  return res;
}
function foldNewline(source, offset) {
  let fold = "";
  let ch = source[offset + 1];
  while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
    if (ch === "\r" && source[offset + 2] !== "\n")
      break;
    if (ch === "\n")
      fold += "\n";
    offset += 1;
    ch = source[offset + 1];
  }
  if (!fold)
    fold = " ";
  return { fold, offset };
}
var escapeCodes = {
  "0": "\0",
  // null character
  a: "\x07",
  // bell character
  b: "\b",
  // backspace
  e: "\x1B",
  // escape character
  f: "\f",
  // form feed
  n: "\n",
  // line feed
  r: "\r",
  // carriage return
  t: "	",
  // horizontal tab
  v: "\v",
  // vertical tab
  N: "\x85",
  // Unicode next line
  _: "\xA0",
  // Unicode non-breaking space
  L: "\u2028",
  // Unicode line separator
  P: "\u2029",
  // Unicode paragraph separator
  " ": " ",
  '"': '"',
  "/": "/",
  "\\": "\\",
  "	": "	"
};
function parseCharCode(source, offset, length2, onError) {
  const cc = source.substr(offset, length2);
  const ok = cc.length === length2 && /^[0-9a-fA-F]+$/.test(cc);
  const code = ok ? parseInt(cc, 16) : NaN;
  if (isNaN(code)) {
    const raw = source.substr(offset - 2, length2 + 2);
    onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
    return raw;
  }
  return String.fromCodePoint(code);
}

// node_modules/yaml/browser/dist/compose/compose-scalar.js
function composeScalar(ctx, token, tagToken, onError) {
  const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar(ctx, token, onError) : resolveFlowScalar(token, ctx.options.strict, onError);
  const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
  let tag;
  if (ctx.options.stringKeys && ctx.atKey) {
    tag = ctx.schema[SCALAR];
  } else if (tagName)
    tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
  else if (token.type === "scalar")
    tag = findScalarTagByTest(ctx, value, token, onError);
  else
    tag = ctx.schema[SCALAR];
  let scalar;
  try {
    const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
    scalar = isScalar(res) ? res : new Scalar(res);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
    scalar = new Scalar(value);
  }
  scalar.range = range;
  scalar.source = value;
  if (type)
    scalar.type = type;
  if (tagName)
    scalar.tag = tagName;
  if (tag.format)
    scalar.format = tag.format;
  if (comment)
    scalar.comment = comment;
  return scalar;
}
function findScalarTagByName(schema4, value, tagName, tagToken, onError) {
  if (tagName === "!")
    return schema4[SCALAR];
  const matchWithTest = [];
  for (const tag of schema4.tags) {
    if (!tag.collection && tag.tag === tagName) {
      if (tag.default && tag.test)
        matchWithTest.push(tag);
      else
        return tag;
    }
  }
  for (const tag of matchWithTest)
    if (tag.test?.test(value))
      return tag;
  const kt = schema4.knownTags[tagName];
  if (kt && !kt.collection) {
    schema4.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
    return kt;
  }
  onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
  return schema4[SCALAR];
}
function findScalarTagByTest({ atKey, directives, schema: schema4 }, value, token, onError) {
  const tag = schema4.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema4[SCALAR];
  if (schema4.compat) {
    const compat = schema4.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema4[SCALAR];
    if (tag.tag !== compat.tag) {
      const ts = directives.tagString(tag.tag);
      const cs = directives.tagString(compat.tag);
      const msg = `Value may be parsed as either ${ts} or ${cs}`;
      onError(token, "TAG_RESOLVE_FAILED", msg, true);
    }
  }
  return tag;
}

// node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js
function emptyScalarPosition(offset, before, pos) {
  if (before) {
    pos ?? (pos = before.length);
    for (let i = pos - 1; i >= 0; --i) {
      let st = before[i];
      switch (st.type) {
        case "space":
        case "comment":
        case "newline":
          offset -= st.source.length;
          continue;
      }
      st = before[++i];
      while (st?.type === "space") {
        offset += st.source.length;
        st = before[++i];
      }
      break;
    }
  }
  return offset;
}

// node_modules/yaml/browser/dist/compose/compose-node.js
var CN = { composeNode, composeEmptyNode };
function composeNode(ctx, token, props, onError) {
  const atKey = ctx.atKey;
  const { spaceBefore, comment, anchor, tag } = props;
  let node;
  let isSrcToken = true;
  switch (token.type) {
    case "alias":
      node = composeAlias(ctx, token, onError);
      if (anchor || tag)
        onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
      break;
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "block-scalar":
      node = composeScalar(ctx, token, tag, onError);
      if (anchor)
        node.anchor = anchor.source.substring(1);
      break;
    case "block-map":
    case "block-seq":
    case "flow-collection":
      node = composeCollection(CN, ctx, token, props, onError);
      if (anchor)
        node.anchor = anchor.source.substring(1);
      break;
    default: {
      const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
      onError(token, "UNEXPECTED_TOKEN", message);
      node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError);
      isSrcToken = false;
    }
  }
  if (anchor && node.anchor === "")
    onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
  if (atKey && ctx.options.stringKeys && (!isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
    const msg = "With stringKeys, all keys must be strings";
    onError(tag ?? token, "NON_STRING_KEY", msg);
  }
  if (spaceBefore)
    node.spaceBefore = true;
  if (comment) {
    if (token.type === "scalar" && token.source === "")
      node.comment = comment;
    else
      node.commentBefore = comment;
  }
  if (ctx.options.keepSourceTokens && isSrcToken)
    node.srcToken = token;
  return node;
}
function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
  const token = {
    type: "scalar",
    offset: emptyScalarPosition(offset, before, pos),
    indent: -1,
    source: ""
  };
  const node = composeScalar(ctx, token, tag, onError);
  if (anchor) {
    node.anchor = anchor.source.substring(1);
    if (node.anchor === "")
      onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
  }
  if (spaceBefore)
    node.spaceBefore = true;
  if (comment) {
    node.comment = comment;
    node.range[2] = end;
  }
  return node;
}
function composeAlias({ options }, { offset, source, end }, onError) {
  const alias = new Alias(source.substring(1));
  if (alias.source === "")
    onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
  if (alias.source.endsWith(":"))
    onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
  const valueEnd = offset + source.length;
  const re = resolveEnd(end, valueEnd, options.strict, onError);
  alias.range = [offset, valueEnd, re.offset];
  if (re.comment)
    alias.comment = re.comment;
  return alias;
}

// node_modules/yaml/browser/dist/compose/compose-doc.js
function composeDoc(options, directives, { offset, start, value, end }, onError) {
  const opts = Object.assign({ _directives: directives }, options);
  const doc = new Document(void 0, opts);
  const ctx = {
    atKey: false,
    atRoot: true,
    directives: doc.directives,
    options: doc.options,
    schema: doc.schema
  };
  const props = resolveProps(start, {
    indicator: "doc-start",
    next: value ?? end?.[0],
    offset,
    onError,
    parentIndent: 0,
    startOnNewline: true
  });
  if (props.found) {
    doc.directives.docStart = true;
    if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
      onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
  }
  doc.contents = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
  const contentEnd = doc.contents.range[2];
  const re = resolveEnd(end, contentEnd, false, onError);
  if (re.comment)
    doc.comment = re.comment;
  doc.range = [offset, contentEnd, re.offset];
  return doc;
}

// node_modules/yaml/browser/dist/compose/composer.js
function getErrorPos(src) {
  if (typeof src === "number")
    return [src, src + 1];
  if (Array.isArray(src))
    return src.length === 2 ? src : [src[0], src[1]];
  const { offset, source } = src;
  return [offset, offset + (typeof source === "string" ? source.length : 1)];
}
function parsePrelude(prelude) {
  let comment = "";
  let atComment = false;
  let afterEmptyLine = false;
  for (let i = 0; i < prelude.length; ++i) {
    const source = prelude[i];
    switch (source[0]) {
      case "#":
        comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
        atComment = true;
        afterEmptyLine = false;
        break;
      case "%":
        if (prelude[i + 1]?.[0] !== "#")
          i += 1;
        atComment = false;
        break;
      default:
        if (!atComment)
          afterEmptyLine = true;
        atComment = false;
    }
  }
  return { comment, afterEmptyLine };
}
var Composer = class {
  constructor(options = {}) {
    this.doc = null;
    this.atDirectives = false;
    this.prelude = [];
    this.errors = [];
    this.warnings = [];
    this.onError = (source, code, message, warning) => {
      const pos = getErrorPos(source);
      if (warning)
        this.warnings.push(new YAMLWarning(pos, code, message));
      else
        this.errors.push(new YAMLParseError(pos, code, message));
    };
    this.directives = new Directives({ version: options.version || "1.2" });
    this.options = options;
  }
  decorate(doc, afterDoc) {
    const { comment, afterEmptyLine } = parsePrelude(this.prelude);
    if (comment) {
      const dc = doc.contents;
      if (afterDoc) {
        doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
      } else if (afterEmptyLine || doc.directives.docStart || !dc) {
        doc.commentBefore = comment;
      } else if (isCollection(dc) && !dc.flow && dc.items.length > 0) {
        let it = dc.items[0];
        if (isPair(it))
          it = it.key;
        const cb = it.commentBefore;
        it.commentBefore = cb ? `${comment}
${cb}` : comment;
      } else {
        const cb = dc.commentBefore;
        dc.commentBefore = cb ? `${comment}
${cb}` : comment;
      }
    }
    if (afterDoc) {
      Array.prototype.push.apply(doc.errors, this.errors);
      Array.prototype.push.apply(doc.warnings, this.warnings);
    } else {
      doc.errors = this.errors;
      doc.warnings = this.warnings;
    }
    this.prelude = [];
    this.errors = [];
    this.warnings = [];
  }
  /**
   * Current stream status information.
   *
   * Mostly useful at the end of input for an empty stream.
   */
  streamInfo() {
    return {
      comment: parsePrelude(this.prelude).comment,
      directives: this.directives,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  /**
   * Compose tokens into documents.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *compose(tokens, forceDoc = false, endOffset = -1) {
    for (const token of tokens)
      yield* this.next(token);
    yield* this.end(forceDoc, endOffset);
  }
  /** Advance the composer by one CST token. */
  *next(token) {
    switch (token.type) {
      case "directive":
        this.directives.add(token.source, (offset, message, warning) => {
          const pos = getErrorPos(token);
          pos[0] += offset;
          this.onError(pos, "BAD_DIRECTIVE", message, warning);
        });
        this.prelude.push(token.source);
        this.atDirectives = true;
        break;
      case "document": {
        const doc = composeDoc(this.options, this.directives, token, this.onError);
        if (this.atDirectives && !doc.directives.docStart)
          this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
        this.decorate(doc, false);
        if (this.doc)
          yield this.doc;
        this.doc = doc;
        this.atDirectives = false;
        break;
      }
      case "byte-order-mark":
      case "space":
        break;
      case "comment":
      case "newline":
        this.prelude.push(token.source);
        break;
      case "error": {
        const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
        const error = new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
        if (this.atDirectives || !this.doc)
          this.errors.push(error);
        else
          this.doc.errors.push(error);
        break;
      }
      case "doc-end": {
        if (!this.doc) {
          const msg = "Unexpected doc-end without preceding document";
          this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
          break;
        }
        this.doc.directives.docEnd = true;
        const end = resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
        this.decorate(this.doc, true);
        if (end.comment) {
          const dc = this.doc.comment;
          this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
        }
        this.doc.range[2] = end.offset;
        break;
      }
      default:
        this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
    }
  }
  /**
   * Call at end of input to yield any remaining document.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *end(forceDoc = false, endOffset = -1) {
    if (this.doc) {
      this.decorate(this.doc, true);
      yield this.doc;
      this.doc = null;
    } else if (forceDoc) {
      const opts = Object.assign({ _directives: this.directives }, this.options);
      const doc = new Document(void 0, opts);
      if (this.atDirectives)
        this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
      doc.range = [0, endOffset, endOffset];
      this.decorate(doc, false);
      yield doc;
    }
  }
};

// node_modules/yaml/browser/dist/parse/cst-visit.js
var BREAK2 = Symbol("break visit");
var SKIP2 = Symbol("skip children");
var REMOVE2 = Symbol("remove item");
function visit2(cst, visitor) {
  if ("type" in cst && cst.type === "document")
    cst = { start: cst.start, value: cst.value };
  _visit(Object.freeze([]), cst, visitor);
}
visit2.BREAK = BREAK2;
visit2.SKIP = SKIP2;
visit2.REMOVE = REMOVE2;
visit2.itemAtPath = (cst, path) => {
  let item = cst;
  for (const [field, index] of path) {
    const tok = item?.[field];
    if (tok && "items" in tok) {
      item = tok.items[index];
    } else
      return void 0;
  }
  return item;
};
visit2.parentCollection = (cst, path) => {
  const parent = visit2.itemAtPath(cst, path.slice(0, -1));
  const field = path[path.length - 1][0];
  const coll = parent?.[field];
  if (coll && "items" in coll)
    return coll;
  throw new Error("Parent collection not found");
};
function _visit(path, item, visitor) {
  let ctrl = visitor(item, path);
  if (typeof ctrl === "symbol")
    return ctrl;
  for (const field of ["key", "value"]) {
    const token = item[field];
    if (token && "items" in token) {
      for (let i = 0; i < token.items.length; ++i) {
        const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK2)
          return BREAK2;
        else if (ci === REMOVE2) {
          token.items.splice(i, 1);
          i -= 1;
        }
      }
      if (typeof ctrl === "function" && field === "key")
        ctrl = ctrl(item, path);
    }
  }
  return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
}

// node_modules/yaml/browser/dist/parse/cst.js
var BOM = "\uFEFF";
var DOCUMENT = "";
var FLOW_END = "";
var SCALAR2 = "";
function tokenType(source) {
  switch (source) {
    case BOM:
      return "byte-order-mark";
    case DOCUMENT:
      return "doc-mode";
    case FLOW_END:
      return "flow-error-end";
    case SCALAR2:
      return "scalar";
    case "---":
      return "doc-start";
    case "...":
      return "doc-end";
    case "":
    case "\n":
    case "\r\n":
      return "newline";
    case "-":
      return "seq-item-ind";
    case "?":
      return "explicit-key-ind";
    case ":":
      return "map-value-ind";
    case "{":
      return "flow-map-start";
    case "}":
      return "flow-map-end";
    case "[":
      return "flow-seq-start";
    case "]":
      return "flow-seq-end";
    case ",":
      return "comma";
  }
  switch (source[0]) {
    case " ":
    case "	":
      return "space";
    case "#":
      return "comment";
    case "%":
      return "directive-line";
    case "*":
      return "alias";
    case "&":
      return "anchor";
    case "!":
      return "tag";
    case "'":
      return "single-quoted-scalar";
    case '"':
      return "double-quoted-scalar";
    case "|":
    case ">":
      return "block-scalar-header";
  }
  return null;
}

// node_modules/yaml/browser/dist/parse/lexer.js
function isEmpty(ch) {
  switch (ch) {
    case void 0:
    case " ":
    case "\n":
    case "\r":
    case "	":
      return true;
    default:
      return false;
  }
}
var hexDigits = new Set("0123456789ABCDEFabcdef");
var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
var flowIndicatorChars = new Set(",[]{}");
var invalidAnchorChars = new Set(" ,[]{}\n\r	");
var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
var Lexer = class {
  constructor() {
    this.atEnd = false;
    this.blockScalarIndent = -1;
    this.blockScalarKeep = false;
    this.buffer = "";
    this.flowKey = false;
    this.flowLevel = 0;
    this.indentNext = 0;
    this.indentValue = 0;
    this.lineEndPos = null;
    this.next = null;
    this.pos = 0;
  }
  /**
   * Generate YAML tokens from the `source` string. If `incomplete`,
   * a part of the last line may be left as a buffer for the next call.
   *
   * @returns A generator of lexical tokens
   */
  *lex(source, incomplete = false) {
    if (source) {
      if (typeof source !== "string")
        throw TypeError("source is not a string");
      this.buffer = this.buffer ? this.buffer + source : source;
      this.lineEndPos = null;
    }
    this.atEnd = !incomplete;
    let next = this.next ?? "stream";
    while (next && (incomplete || this.hasChars(1)))
      next = yield* this.parseNext(next);
  }
  atLineEnd() {
    let i = this.pos;
    let ch = this.buffer[i];
    while (ch === " " || ch === "	")
      ch = this.buffer[++i];
    if (!ch || ch === "#" || ch === "\n")
      return true;
    if (ch === "\r")
      return this.buffer[i + 1] === "\n";
    return false;
  }
  charAt(n) {
    return this.buffer[this.pos + n];
  }
  continueScalar(offset) {
    let ch = this.buffer[offset];
    if (this.indentNext > 0) {
      let indent = 0;
      while (ch === " ")
        ch = this.buffer[++indent + offset];
      if (ch === "\r") {
        const next = this.buffer[indent + offset + 1];
        if (next === "\n" || !next && !this.atEnd)
          return offset + indent + 1;
      }
      return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
    }
    if (ch === "-" || ch === ".") {
      const dt = this.buffer.substr(offset, 3);
      if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
        return -1;
    }
    return offset;
  }
  getLine() {
    let end = this.lineEndPos;
    if (typeof end !== "number" || end !== -1 && end < this.pos) {
      end = this.buffer.indexOf("\n", this.pos);
      this.lineEndPos = end;
    }
    if (end === -1)
      return this.atEnd ? this.buffer.substring(this.pos) : null;
    if (this.buffer[end - 1] === "\r")
      end -= 1;
    return this.buffer.substring(this.pos, end);
  }
  hasChars(n) {
    return this.pos + n <= this.buffer.length;
  }
  setNext(state) {
    this.buffer = this.buffer.substring(this.pos);
    this.pos = 0;
    this.lineEndPos = null;
    this.next = state;
    return null;
  }
  peek(n) {
    return this.buffer.substr(this.pos, n);
  }
  *parseNext(next) {
    switch (next) {
      case "stream":
        return yield* this.parseStream();
      case "line-start":
        return yield* this.parseLineStart();
      case "block-start":
        return yield* this.parseBlockStart();
      case "doc":
        return yield* this.parseDocument();
      case "flow":
        return yield* this.parseFlowCollection();
      case "quoted-scalar":
        return yield* this.parseQuotedScalar();
      case "block-scalar":
        return yield* this.parseBlockScalar();
      case "plain-scalar":
        return yield* this.parsePlainScalar();
    }
  }
  *parseStream() {
    let line = this.getLine();
    if (line === null)
      return this.setNext("stream");
    if (line[0] === BOM) {
      yield* this.pushCount(1);
      line = line.substring(1);
    }
    if (line[0] === "%") {
      let dirEnd = line.length;
      let cs = line.indexOf("#");
      while (cs !== -1) {
        const ch = line[cs - 1];
        if (ch === " " || ch === "	") {
          dirEnd = cs - 1;
          break;
        } else {
          cs = line.indexOf("#", cs + 1);
        }
      }
      while (true) {
        const ch = line[dirEnd - 1];
        if (ch === " " || ch === "	")
          dirEnd -= 1;
        else
          break;
      }
      const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
      yield* this.pushCount(line.length - n);
      this.pushNewline();
      return "stream";
    }
    if (this.atLineEnd()) {
      const sp = yield* this.pushSpaces(true);
      yield* this.pushCount(line.length - sp);
      yield* this.pushNewline();
      return "stream";
    }
    yield DOCUMENT;
    return yield* this.parseLineStart();
  }
  *parseLineStart() {
    const ch = this.charAt(0);
    if (!ch && !this.atEnd)
      return this.setNext("line-start");
    if (ch === "-" || ch === ".") {
      if (!this.atEnd && !this.hasChars(4))
        return this.setNext("line-start");
      const s = this.peek(3);
      if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
        yield* this.pushCount(3);
        this.indentValue = 0;
        this.indentNext = 0;
        return s === "---" ? "doc" : "stream";
      }
    }
    this.indentValue = yield* this.pushSpaces(false);
    if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
      this.indentNext = this.indentValue;
    return yield* this.parseBlockStart();
  }
  *parseBlockStart() {
    const [ch0, ch1] = this.peek(2);
    if (!ch1 && !this.atEnd)
      return this.setNext("block-start");
    if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
      const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
      this.indentNext = this.indentValue + 1;
      this.indentValue += n;
      return yield* this.parseBlockStart();
    }
    return "doc";
  }
  *parseDocument() {
    yield* this.pushSpaces(true);
    const line = this.getLine();
    if (line === null)
      return this.setNext("doc");
    let n = yield* this.pushIndicators();
    switch (line[n]) {
      case "#":
        yield* this.pushCount(line.length - n);
      case void 0:
        yield* this.pushNewline();
        return yield* this.parseLineStart();
      case "{":
      case "[":
        yield* this.pushCount(1);
        this.flowKey = false;
        this.flowLevel = 1;
        return "flow";
      case "}":
      case "]":
        yield* this.pushCount(1);
        return "doc";
      case "*":
        yield* this.pushUntil(isNotAnchorChar);
        return "doc";
      case '"':
      case "'":
        return yield* this.parseQuotedScalar();
      case "|":
      case ">":
        n += yield* this.parseBlockScalarHeader();
        n += yield* this.pushSpaces(true);
        yield* this.pushCount(line.length - n);
        yield* this.pushNewline();
        return yield* this.parseBlockScalar();
      default:
        return yield* this.parsePlainScalar();
    }
  }
  *parseFlowCollection() {
    let nl, sp;
    let indent = -1;
    do {
      nl = yield* this.pushNewline();
      if (nl > 0) {
        sp = yield* this.pushSpaces(false);
        this.indentValue = indent = sp;
      } else {
        sp = 0;
      }
      sp += yield* this.pushSpaces(true);
    } while (nl + sp > 0);
    const line = this.getLine();
    if (line === null)
      return this.setNext("flow");
    if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
      const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
      if (!atFlowEndMarker) {
        this.flowLevel = 0;
        yield FLOW_END;
        return yield* this.parseLineStart();
      }
    }
    let n = 0;
    while (line[n] === ",") {
      n += yield* this.pushCount(1);
      n += yield* this.pushSpaces(true);
      this.flowKey = false;
    }
    n += yield* this.pushIndicators();
    switch (line[n]) {
      case void 0:
        return "flow";
      case "#":
        yield* this.pushCount(line.length - n);
        return "flow";
      case "{":
      case "[":
        yield* this.pushCount(1);
        this.flowKey = false;
        this.flowLevel += 1;
        return "flow";
      case "}":
      case "]":
        yield* this.pushCount(1);
        this.flowKey = true;
        this.flowLevel -= 1;
        return this.flowLevel ? "flow" : "doc";
      case "*":
        yield* this.pushUntil(isNotAnchorChar);
        return "flow";
      case '"':
      case "'":
        this.flowKey = true;
        return yield* this.parseQuotedScalar();
      case ":": {
        const next = this.charAt(1);
        if (this.flowKey || isEmpty(next) || next === ",") {
          this.flowKey = false;
          yield* this.pushCount(1);
          yield* this.pushSpaces(true);
          return "flow";
        }
      }
      default:
        this.flowKey = false;
        return yield* this.parsePlainScalar();
    }
  }
  *parseQuotedScalar() {
    const quote = this.charAt(0);
    let end = this.buffer.indexOf(quote, this.pos + 1);
    if (quote === "'") {
      while (end !== -1 && this.buffer[end + 1] === "'")
        end = this.buffer.indexOf("'", end + 2);
    } else {
      while (end !== -1) {
        let n = 0;
        while (this.buffer[end - 1 - n] === "\\")
          n += 1;
        if (n % 2 === 0)
          break;
        end = this.buffer.indexOf('"', end + 1);
      }
    }
    const qb = this.buffer.substring(0, end);
    let nl = qb.indexOf("\n", this.pos);
    if (nl !== -1) {
      while (nl !== -1) {
        const cs = this.continueScalar(nl + 1);
        if (cs === -1)
          break;
        nl = qb.indexOf("\n", cs);
      }
      if (nl !== -1) {
        end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
      }
    }
    if (end === -1) {
      if (!this.atEnd)
        return this.setNext("quoted-scalar");
      end = this.buffer.length;
    }
    yield* this.pushToIndex(end + 1, false);
    return this.flowLevel ? "flow" : "doc";
  }
  *parseBlockScalarHeader() {
    this.blockScalarIndent = -1;
    this.blockScalarKeep = false;
    let i = this.pos;
    while (true) {
      const ch = this.buffer[++i];
      if (ch === "+")
        this.blockScalarKeep = true;
      else if (ch > "0" && ch <= "9")
        this.blockScalarIndent = Number(ch) - 1;
      else if (ch !== "-")
        break;
    }
    return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
  }
  *parseBlockScalar() {
    let nl = this.pos - 1;
    let indent = 0;
    let ch;
    loop:
      for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
        switch (ch) {
          case " ":
            indent += 1;
            break;
          case "\n":
            nl = i2;
            indent = 0;
            break;
          case "\r": {
            const next = this.buffer[i2 + 1];
            if (!next && !this.atEnd)
              return this.setNext("block-scalar");
            if (next === "\n")
              break;
          }
          default:
            break loop;
        }
      }
    if (!ch && !this.atEnd)
      return this.setNext("block-scalar");
    if (indent >= this.indentNext) {
      if (this.blockScalarIndent === -1)
        this.indentNext = indent;
      else {
        this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
      }
      do {
        const cs = this.continueScalar(nl + 1);
        if (cs === -1)
          break;
        nl = this.buffer.indexOf("\n", cs);
      } while (nl !== -1);
      if (nl === -1) {
        if (!this.atEnd)
          return this.setNext("block-scalar");
        nl = this.buffer.length;
      }
    }
    let i = nl + 1;
    ch = this.buffer[i];
    while (ch === " ")
      ch = this.buffer[++i];
    if (ch === "	") {
      while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
        ch = this.buffer[++i];
      nl = i - 1;
    } else if (!this.blockScalarKeep) {
      do {
        let i2 = nl - 1;
        let ch2 = this.buffer[i2];
        if (ch2 === "\r")
          ch2 = this.buffer[--i2];
        const lastChar = i2;
        while (ch2 === " ")
          ch2 = this.buffer[--i2];
        if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
          nl = i2;
        else
          break;
      } while (true);
    }
    yield SCALAR2;
    yield* this.pushToIndex(nl + 1, true);
    return yield* this.parseLineStart();
  }
  *parsePlainScalar() {
    const inFlow = this.flowLevel > 0;
    let end = this.pos - 1;
    let i = this.pos - 1;
    let ch;
    while (ch = this.buffer[++i]) {
      if (ch === ":") {
        const next = this.buffer[i + 1];
        if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
          break;
        end = i;
      } else if (isEmpty(ch)) {
        let next = this.buffer[i + 1];
        if (ch === "\r") {
          if (next === "\n") {
            i += 1;
            ch = "\n";
            next = this.buffer[i + 1];
          } else
            end = i;
        }
        if (next === "#" || inFlow && flowIndicatorChars.has(next))
          break;
        if (ch === "\n") {
          const cs = this.continueScalar(i + 1);
          if (cs === -1)
            break;
          i = Math.max(i, cs - 2);
        }
      } else {
        if (inFlow && flowIndicatorChars.has(ch))
          break;
        end = i;
      }
    }
    if (!ch && !this.atEnd)
      return this.setNext("plain-scalar");
    yield SCALAR2;
    yield* this.pushToIndex(end + 1, true);
    return inFlow ? "flow" : "doc";
  }
  *pushCount(n) {
    if (n > 0) {
      yield this.buffer.substr(this.pos, n);
      this.pos += n;
      return n;
    }
    return 0;
  }
  *pushToIndex(i, allowEmpty) {
    const s = this.buffer.slice(this.pos, i);
    if (s) {
      yield s;
      this.pos += s.length;
      return s.length;
    } else if (allowEmpty)
      yield "";
    return 0;
  }
  *pushIndicators() {
    switch (this.charAt(0)) {
      case "!":
        return (yield* this.pushTag()) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
      case "&":
        return (yield* this.pushUntil(isNotAnchorChar)) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
      case "-":
      case "?":
      case ":": {
        const inFlow = this.flowLevel > 0;
        const ch1 = this.charAt(1);
        if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
          if (!inFlow)
            this.indentNext = this.indentValue + 1;
          else if (this.flowKey)
            this.flowKey = false;
          return (yield* this.pushCount(1)) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
        }
      }
    }
    return 0;
  }
  *pushTag() {
    if (this.charAt(1) === "<") {
      let i = this.pos + 2;
      let ch = this.buffer[i];
      while (!isEmpty(ch) && ch !== ">")
        ch = this.buffer[++i];
      return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
    } else {
      let i = this.pos + 1;
      let ch = this.buffer[i];
      while (ch) {
        if (tagChars.has(ch))
          ch = this.buffer[++i];
        else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
          ch = this.buffer[i += 3];
        } else
          break;
      }
      return yield* this.pushToIndex(i, false);
    }
  }
  *pushNewline() {
    const ch = this.buffer[this.pos];
    if (ch === "\n")
      return yield* this.pushCount(1);
    else if (ch === "\r" && this.charAt(1) === "\n")
      return yield* this.pushCount(2);
    else
      return 0;
  }
  *pushSpaces(allowTabs) {
    let i = this.pos - 1;
    let ch;
    do {
      ch = this.buffer[++i];
    } while (ch === " " || allowTabs && ch === "	");
    const n = i - this.pos;
    if (n > 0) {
      yield this.buffer.substr(this.pos, n);
      this.pos = i;
    }
    return n;
  }
  *pushUntil(test) {
    let i = this.pos;
    let ch = this.buffer[i];
    while (!test(ch))
      ch = this.buffer[++i];
    return yield* this.pushToIndex(i, false);
  }
};

// node_modules/yaml/browser/dist/parse/line-counter.js
var LineCounter = class {
  constructor() {
    this.lineStarts = [];
    this.addNewLine = (offset) => this.lineStarts.push(offset);
    this.linePos = (offset) => {
      let low = 0;
      let high = this.lineStarts.length;
      while (low < high) {
        const mid = low + high >> 1;
        if (this.lineStarts[mid] < offset)
          low = mid + 1;
        else
          high = mid;
      }
      if (this.lineStarts[low] === offset)
        return { line: low + 1, col: 1 };
      if (low === 0)
        return { line: 0, col: offset };
      const start = this.lineStarts[low - 1];
      return { line: low, col: offset - start + 1 };
    };
  }
};

// node_modules/yaml/browser/dist/parse/parser.js
function includesToken(list, type) {
  for (let i = 0; i < list.length; ++i)
    if (list[i].type === type)
      return true;
  return false;
}
function findNonEmptyIndex(list) {
  for (let i = 0; i < list.length; ++i) {
    switch (list[i].type) {
      case "space":
      case "comment":
      case "newline":
        break;
      default:
        return i;
    }
  }
  return -1;
}
function isFlowToken(token) {
  switch (token?.type) {
    case "alias":
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "flow-collection":
      return true;
    default:
      return false;
  }
}
function getPrevProps(parent) {
  switch (parent.type) {
    case "document":
      return parent.start;
    case "block-map": {
      const it = parent.items[parent.items.length - 1];
      return it.sep ?? it.start;
    }
    case "block-seq":
      return parent.items[parent.items.length - 1].start;
    default:
      return [];
  }
}
function getFirstKeyStartProps(prev) {
  if (prev.length === 0)
    return [];
  let i = prev.length;
  loop:
    while (--i >= 0) {
      switch (prev[i].type) {
        case "doc-start":
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
        case "newline":
          break loop;
      }
    }
  while (prev[++i]?.type === "space") {
  }
  return prev.splice(i, prev.length);
}
function fixFlowSeqItems(fc) {
  if (fc.start.type === "flow-seq-start") {
    for (const it of fc.items) {
      if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
        if (it.key)
          it.value = it.key;
        delete it.key;
        if (isFlowToken(it.value)) {
          if (it.value.end)
            Array.prototype.push.apply(it.value.end, it.sep);
          else
            it.value.end = it.sep;
        } else
          Array.prototype.push.apply(it.start, it.sep);
        delete it.sep;
      }
    }
  }
}
var Parser = class {
  /**
   * @param onNewLine - If defined, called separately with the start position of
   *   each new line (in `parse()`, including the start of input).
   */
  constructor(onNewLine) {
    this.atNewLine = true;
    this.atScalar = false;
    this.indent = 0;
    this.offset = 0;
    this.onKeyLine = false;
    this.stack = [];
    this.source = "";
    this.type = "";
    this.lexer = new Lexer();
    this.onNewLine = onNewLine;
  }
  /**
   * Parse `source` as a YAML stream.
   * If `incomplete`, a part of the last line may be left as a buffer for the next call.
   *
   * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
   *
   * @returns A generator of tokens representing each directive, document, and other structure.
   */
  *parse(source, incomplete = false) {
    if (this.onNewLine && this.offset === 0)
      this.onNewLine(0);
    for (const lexeme of this.lexer.lex(source, incomplete))
      yield* this.next(lexeme);
    if (!incomplete)
      yield* this.end();
  }
  /**
   * Advance the parser by the `source` of one lexical token.
   */
  *next(source) {
    this.source = source;
    if (this.atScalar) {
      this.atScalar = false;
      yield* this.step();
      this.offset += source.length;
      return;
    }
    const type = tokenType(source);
    if (!type) {
      const message = `Not a YAML token: ${source}`;
      yield* this.pop({ type: "error", offset: this.offset, message, source });
      this.offset += source.length;
    } else if (type === "scalar") {
      this.atNewLine = false;
      this.atScalar = true;
      this.type = "scalar";
    } else {
      this.type = type;
      yield* this.step();
      switch (type) {
        case "newline":
          this.atNewLine = true;
          this.indent = 0;
          if (this.onNewLine)
            this.onNewLine(this.offset + source.length);
          break;
        case "space":
          if (this.atNewLine && source[0] === " ")
            this.indent += source.length;
          break;
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
          if (this.atNewLine)
            this.indent += source.length;
          break;
        case "doc-mode":
        case "flow-error-end":
          return;
        default:
          this.atNewLine = false;
      }
      this.offset += source.length;
    }
  }
  /** Call at end of input to push out any remaining constructions */
  *end() {
    while (this.stack.length > 0)
      yield* this.pop();
  }
  get sourceToken() {
    const st = {
      type: this.type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
    return st;
  }
  *step() {
    const top = this.peek(1);
    if (this.type === "doc-end" && top?.type !== "doc-end") {
      while (this.stack.length > 0)
        yield* this.pop();
      this.stack.push({
        type: "doc-end",
        offset: this.offset,
        source: this.source
      });
      return;
    }
    if (!top)
      return yield* this.stream();
    switch (top.type) {
      case "document":
        return yield* this.document(top);
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return yield* this.scalar(top);
      case "block-scalar":
        return yield* this.blockScalar(top);
      case "block-map":
        return yield* this.blockMap(top);
      case "block-seq":
        return yield* this.blockSequence(top);
      case "flow-collection":
        return yield* this.flowCollection(top);
      case "doc-end":
        return yield* this.documentEnd(top);
    }
    yield* this.pop();
  }
  peek(n) {
    return this.stack[this.stack.length - n];
  }
  *pop(error) {
    const token = error ?? this.stack.pop();
    if (!token) {
      const message = "Tried to pop an empty stack";
      yield { type: "error", offset: this.offset, source: "", message };
    } else if (this.stack.length === 0) {
      yield token;
    } else {
      const top = this.peek(1);
      if (token.type === "block-scalar") {
        token.indent = "indent" in top ? top.indent : 0;
      } else if (token.type === "flow-collection" && top.type === "document") {
        token.indent = 0;
      }
      if (token.type === "flow-collection")
        fixFlowSeqItems(token);
      switch (top.type) {
        case "document":
          top.value = token;
          break;
        case "block-scalar":
          top.props.push(token);
          break;
        case "block-map": {
          const it = top.items[top.items.length - 1];
          if (it.value) {
            top.items.push({ start: [], key: token, sep: [] });
            this.onKeyLine = true;
            return;
          } else if (it.sep) {
            it.value = token;
          } else {
            Object.assign(it, { key: token, sep: [] });
            this.onKeyLine = !it.explicitKey;
            return;
          }
          break;
        }
        case "block-seq": {
          const it = top.items[top.items.length - 1];
          if (it.value)
            top.items.push({ start: [], value: token });
          else
            it.value = token;
          break;
        }
        case "flow-collection": {
          const it = top.items[top.items.length - 1];
          if (!it || it.value)
            top.items.push({ start: [], key: token, sep: [] });
          else if (it.sep)
            it.value = token;
          else
            Object.assign(it, { key: token, sep: [] });
          return;
        }
        default:
          yield* this.pop();
          yield* this.pop(token);
      }
      if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
        const last = token.items[token.items.length - 1];
        if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
          if (top.type === "document")
            top.end = last.start;
          else
            top.items.push({ start: last.start });
          token.items.splice(-1, 1);
        }
      }
    }
  }
  *stream() {
    switch (this.type) {
      case "directive-line":
        yield { type: "directive", offset: this.offset, source: this.source };
        return;
      case "byte-order-mark":
      case "space":
      case "comment":
      case "newline":
        yield this.sourceToken;
        return;
      case "doc-mode":
      case "doc-start": {
        const doc = {
          type: "document",
          offset: this.offset,
          start: []
        };
        if (this.type === "doc-start")
          doc.start.push(this.sourceToken);
        this.stack.push(doc);
        return;
      }
    }
    yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML stream`,
      source: this.source
    };
  }
  *document(doc) {
    if (doc.value)
      return yield* this.lineEnd(doc);
    switch (this.type) {
      case "doc-start": {
        if (findNonEmptyIndex(doc.start) !== -1) {
          yield* this.pop();
          yield* this.step();
        } else
          doc.start.push(this.sourceToken);
        return;
      }
      case "anchor":
      case "tag":
      case "space":
      case "comment":
      case "newline":
        doc.start.push(this.sourceToken);
        return;
    }
    const bv = this.startBlockValue(doc);
    if (bv)
      this.stack.push(bv);
    else {
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML document`,
        source: this.source
      };
    }
  }
  *scalar(scalar) {
    if (this.type === "map-value-ind") {
      const prev = getPrevProps(this.peek(2));
      const start = getFirstKeyStartProps(prev);
      let sep;
      if (scalar.end) {
        sep = scalar.end;
        sep.push(this.sourceToken);
        delete scalar.end;
      } else
        sep = [this.sourceToken];
      const map2 = {
        type: "block-map",
        offset: scalar.offset,
        indent: scalar.indent,
        items: [{ start, key: scalar, sep }]
      };
      this.onKeyLine = true;
      this.stack[this.stack.length - 1] = map2;
    } else
      yield* this.lineEnd(scalar);
  }
  *blockScalar(scalar) {
    switch (this.type) {
      case "space":
      case "comment":
      case "newline":
        scalar.props.push(this.sourceToken);
        return;
      case "scalar":
        scalar.source = this.source;
        this.atNewLine = true;
        this.indent = 0;
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        yield* this.pop();
        break;
      default:
        yield* this.pop();
        yield* this.step();
    }
  }
  *blockMap(map2) {
    const it = map2.items[map2.items.length - 1];
    switch (this.type) {
      case "newline":
        this.onKeyLine = false;
        if (it.value) {
          const end = "end" in it.value ? it.value.end : void 0;
          const last = Array.isArray(end) ? end[end.length - 1] : void 0;
          if (last?.type === "comment")
            end?.push(this.sourceToken);
          else
            map2.items.push({ start: [this.sourceToken] });
        } else if (it.sep) {
          it.sep.push(this.sourceToken);
        } else {
          it.start.push(this.sourceToken);
        }
        return;
      case "space":
      case "comment":
        if (it.value) {
          map2.items.push({ start: [this.sourceToken] });
        } else if (it.sep) {
          it.sep.push(this.sourceToken);
        } else {
          if (this.atIndentedComment(it.start, map2.indent)) {
            const prev = map2.items[map2.items.length - 2];
            const end = prev?.value?.end;
            if (Array.isArray(end)) {
              Array.prototype.push.apply(end, it.start);
              end.push(this.sourceToken);
              map2.items.pop();
              return;
            }
          }
          it.start.push(this.sourceToken);
        }
        return;
    }
    if (this.indent >= map2.indent) {
      const atMapIndent = !this.onKeyLine && this.indent === map2.indent;
      const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
      let start = [];
      if (atNextItem && it.sep && !it.value) {
        const nl = [];
        for (let i = 0; i < it.sep.length; ++i) {
          const st = it.sep[i];
          switch (st.type) {
            case "newline":
              nl.push(i);
              break;
            case "space":
              break;
            case "comment":
              if (st.indent > map2.indent)
                nl.length = 0;
              break;
            default:
              nl.length = 0;
          }
        }
        if (nl.length >= 2)
          start = it.sep.splice(nl[1]);
      }
      switch (this.type) {
        case "anchor":
        case "tag":
          if (atNextItem || it.value) {
            start.push(this.sourceToken);
            map2.items.push({ start });
            this.onKeyLine = true;
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            it.start.push(this.sourceToken);
          }
          return;
        case "explicit-key-ind":
          if (!it.sep && !it.explicitKey) {
            it.start.push(this.sourceToken);
            it.explicitKey = true;
          } else if (atNextItem || it.value) {
            start.push(this.sourceToken);
            map2.items.push({ start, explicitKey: true });
          } else {
            this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken], explicitKey: true }]
            });
          }
          this.onKeyLine = true;
          return;
        case "map-value-ind":
          if (it.explicitKey) {
            if (!it.sep) {
              if (includesToken(it.start, "newline")) {
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              } else {
                const start2 = getFirstKeyStartProps(it.start);
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                });
              }
            } else if (it.value) {
              map2.items.push({ start: [], key: null, sep: [this.sourceToken] });
            } else if (includesToken(it.sep, "map-value-ind")) {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start, key: null, sep: [this.sourceToken] }]
              });
            } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
              const start2 = getFirstKeyStartProps(it.start);
              const key = it.key;
              const sep = it.sep;
              sep.push(this.sourceToken);
              delete it.key;
              delete it.sep;
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: start2, key, sep }]
              });
            } else if (start.length > 0) {
              it.sep = it.sep.concat(start, this.sourceToken);
            } else {
              it.sep.push(this.sourceToken);
            }
          } else {
            if (!it.sep) {
              Object.assign(it, { key: null, sep: [this.sourceToken] });
            } else if (it.value || atNextItem) {
              map2.items.push({ start, key: null, sep: [this.sourceToken] });
            } else if (includesToken(it.sep, "map-value-ind")) {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [], key: null, sep: [this.sourceToken] }]
              });
            } else {
              it.sep.push(this.sourceToken);
            }
          }
          this.onKeyLine = true;
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const fs = this.flowScalar(this.type);
          if (atNextItem || it.value) {
            map2.items.push({ start, key: fs, sep: [] });
            this.onKeyLine = true;
          } else if (it.sep) {
            this.stack.push(fs);
          } else {
            Object.assign(it, { key: fs, sep: [] });
            this.onKeyLine = true;
          }
          return;
        }
        default: {
          const bv = this.startBlockValue(map2);
          if (bv) {
            if (bv.type === "block-seq") {
              if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                yield* this.pop({
                  type: "error",
                  offset: this.offset,
                  message: "Unexpected block-seq-ind on same line with key",
                  source: this.source
                });
                return;
              }
            } else if (atMapIndent) {
              map2.items.push({ start });
            }
            this.stack.push(bv);
            return;
          }
        }
      }
    }
    yield* this.pop();
    yield* this.step();
  }
  *blockSequence(seq2) {
    const it = seq2.items[seq2.items.length - 1];
    switch (this.type) {
      case "newline":
        if (it.value) {
          const end = "end" in it.value ? it.value.end : void 0;
          const last = Array.isArray(end) ? end[end.length - 1] : void 0;
          if (last?.type === "comment")
            end?.push(this.sourceToken);
          else
            seq2.items.push({ start: [this.sourceToken] });
        } else
          it.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (it.value)
          seq2.items.push({ start: [this.sourceToken] });
        else {
          if (this.atIndentedComment(it.start, seq2.indent)) {
            const prev = seq2.items[seq2.items.length - 2];
            const end = prev?.value?.end;
            if (Array.isArray(end)) {
              Array.prototype.push.apply(end, it.start);
              end.push(this.sourceToken);
              seq2.items.pop();
              return;
            }
          }
          it.start.push(this.sourceToken);
        }
        return;
      case "anchor":
      case "tag":
        if (it.value || this.indent <= seq2.indent)
          break;
        it.start.push(this.sourceToken);
        return;
      case "seq-item-ind":
        if (this.indent !== seq2.indent)
          break;
        if (it.value || includesToken(it.start, "seq-item-ind"))
          seq2.items.push({ start: [this.sourceToken] });
        else
          it.start.push(this.sourceToken);
        return;
    }
    if (this.indent > seq2.indent) {
      const bv = this.startBlockValue(seq2);
      if (bv) {
        this.stack.push(bv);
        return;
      }
    }
    yield* this.pop();
    yield* this.step();
  }
  *flowCollection(fc) {
    const it = fc.items[fc.items.length - 1];
    if (this.type === "flow-error-end") {
      let top;
      do {
        yield* this.pop();
        top = this.peek(1);
      } while (top?.type === "flow-collection");
    } else if (fc.end.length === 0) {
      switch (this.type) {
        case "comma":
        case "explicit-key-ind":
          if (!it || it.sep)
            fc.items.push({ start: [this.sourceToken] });
          else
            it.start.push(this.sourceToken);
          return;
        case "map-value-ind":
          if (!it || it.value)
            fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
          else if (it.sep)
            it.sep.push(this.sourceToken);
          else
            Object.assign(it, { key: null, sep: [this.sourceToken] });
          return;
        case "space":
        case "comment":
        case "newline":
        case "anchor":
        case "tag":
          if (!it || it.value)
            fc.items.push({ start: [this.sourceToken] });
          else if (it.sep)
            it.sep.push(this.sourceToken);
          else
            it.start.push(this.sourceToken);
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const fs = this.flowScalar(this.type);
          if (!it || it.value)
            fc.items.push({ start: [], key: fs, sep: [] });
          else if (it.sep)
            this.stack.push(fs);
          else
            Object.assign(it, { key: fs, sep: [] });
          return;
        }
        case "flow-map-end":
        case "flow-seq-end":
          fc.end.push(this.sourceToken);
          return;
      }
      const bv = this.startBlockValue(fc);
      if (bv)
        this.stack.push(bv);
      else {
        yield* this.pop();
        yield* this.step();
      }
    } else {
      const parent = this.peek(2);
      if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
        yield* this.pop();
        yield* this.step();
      } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        fixFlowSeqItems(fc);
        const sep = fc.end.splice(1, fc.end.length);
        sep.push(this.sourceToken);
        const map2 = {
          type: "block-map",
          offset: fc.offset,
          indent: fc.indent,
          items: [{ start, key: fc, sep }]
        };
        this.onKeyLine = true;
        this.stack[this.stack.length - 1] = map2;
      } else {
        yield* this.lineEnd(fc);
      }
    }
  }
  flowScalar(type) {
    if (this.onNewLine) {
      let nl = this.source.indexOf("\n") + 1;
      while (nl !== 0) {
        this.onNewLine(this.offset + nl);
        nl = this.source.indexOf("\n", nl) + 1;
      }
    }
    return {
      type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  startBlockValue(parent) {
    switch (this.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return this.flowScalar(this.type);
      case "block-scalar-header":
        return {
          type: "block-scalar",
          offset: this.offset,
          indent: this.indent,
          props: [this.sourceToken],
          source: ""
        };
      case "flow-map-start":
      case "flow-seq-start":
        return {
          type: "flow-collection",
          offset: this.offset,
          indent: this.indent,
          start: this.sourceToken,
          items: [],
          end: []
        };
      case "seq-item-ind":
        return {
          type: "block-seq",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: [this.sourceToken] }]
        };
      case "explicit-key-ind": {
        this.onKeyLine = true;
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        start.push(this.sourceToken);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start, explicitKey: true }]
        };
      }
      case "map-value-ind": {
        this.onKeyLine = true;
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start, key: null, sep: [this.sourceToken] }]
        };
      }
    }
    return null;
  }
  atIndentedComment(start, indent) {
    if (this.type !== "comment")
      return false;
    if (this.indent <= indent)
      return false;
    return start.every((st) => st.type === "newline" || st.type === "space");
  }
  *documentEnd(docEnd) {
    if (this.type !== "doc-mode") {
      if (docEnd.end)
        docEnd.end.push(this.sourceToken);
      else
        docEnd.end = [this.sourceToken];
      if (this.type === "newline")
        yield* this.pop();
    }
  }
  *lineEnd(token) {
    switch (this.type) {
      case "comma":
      case "doc-start":
      case "doc-end":
      case "flow-seq-end":
      case "flow-map-end":
      case "map-value-ind":
        yield* this.pop();
        yield* this.step();
        break;
      case "newline":
        this.onKeyLine = false;
      case "space":
      case "comment":
      default:
        if (token.end)
          token.end.push(this.sourceToken);
        else
          token.end = [this.sourceToken];
        if (this.type === "newline")
          yield* this.pop();
    }
  }
};

// node_modules/yaml/browser/dist/public-api.js
function parseOptions(options) {
  const prettyErrors = options.prettyErrors !== false;
  const lineCounter = options.lineCounter || prettyErrors && new LineCounter() || null;
  return { lineCounter, prettyErrors };
}
function parseDocument(source, options = {}) {
  const { lineCounter, prettyErrors } = parseOptions(options);
  const parser = new Parser(lineCounter?.addNewLine);
  const composer = new Composer(options);
  let doc = null;
  for (const _doc of composer.compose(parser.parse(source), true, source.length)) {
    if (!doc)
      doc = _doc;
    else if (doc.options.logLevel !== "silent") {
      doc.errors.push(new YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
      break;
    }
  }
  if (prettyErrors && lineCounter) {
    doc.errors.forEach(prettifyError(source, lineCounter));
    doc.warnings.forEach(prettifyError(source, lineCounter));
  }
  return doc;
}
function parse(src, reviver, options) {
  let _reviver = void 0;
  if (typeof reviver === "function") {
    _reviver = reviver;
  } else if (options === void 0 && reviver && typeof reviver === "object") {
    options = reviver;
  }
  const doc = parseDocument(src, options);
  if (!doc)
    return null;
  doc.warnings.forEach((warning) => warn(doc.options.logLevel, warning));
  if (doc.errors.length > 0) {
    if (doc.options.logLevel !== "silent")
      throw doc.errors[0];
    else
      doc.errors = [];
  }
  return doc.toJS(Object.assign({ reviver: _reviver }, options));
}

// src/parser.ts
var DEFAULT_CONFIG = {
  grid: false,
  axes: false,
  width: 600,
  height: 400,
  scale: 50,
  interactive: true
};
function parseGeometry(source) {
  const trimmed = source.trim();
  if (!trimmed) {
    return {
      points: {},
      constructions: [],
      style: {},
      config: { ...DEFAULT_CONFIG }
    };
  }
  const raw = parse(trimmed);
  if (!raw || typeof raw !== "object") {
    return {
      points: {},
      constructions: [],
      style: {},
      config: { ...DEFAULT_CONFIG }
    };
  }
  const points = parsePoints(raw.points);
  const constructions = parseConstructions(raw.constructions);
  const style = parseStyles(raw.style);
  const config = { ...DEFAULT_CONFIG, ...raw.config ?? {} };
  return {
    title: raw.title ?? void 0,
    points,
    constructions,
    style,
    config
  };
}
function parsePoints(raw) {
  if (!raw)
    return {};
  if (typeof raw !== "object")
    throw new Error("'points' must be an object");
  const result = {};
  for (const [id, val] of Object.entries(raw)) {
    if (!Array.isArray(val) || val.length !== 2 || typeof val[0] !== "number" || typeof val[1] !== "number") {
      throw new Error(`Point '${id}' must be [x, y] with numeric coordinates`);
    }
    result[id] = [val[0], val[1]];
  }
  return result;
}
function parseConstructions(raw) {
  if (!raw)
    return [];
  if (!Array.isArray(raw))
    throw new Error("'constructions' must be a list");
  return raw.map((item, i) => parseOneConstruction(item, i));
}
function parseOneConstruction(item, index) {
  if (!item || typeof item !== "object") {
    throw new Error(`Construction #${index + 1}: expected an object`);
  }
  const obj = item;
  if (obj.line)
    return parseLineStep(obj.line);
  if (obj.segment)
    return parseSegmentStep(obj.segment);
  if (obj.ray)
    return parseRayStep(obj.ray);
  if (obj.circle)
    return parseCircleStep(obj.circle);
  if (obj.intersect)
    return parseIntersectStep(obj.intersect);
  if (obj.midpoint)
    return parseMidpointStep(obj.midpoint);
  if (obj.perpendicular)
    return parsePerpendicularStep(obj.perpendicular);
  if (obj.parallel)
    return parseParallelStep(obj.parallel);
  if (obj.angle_bisector)
    return parseAngleBisectorStep(obj.angle_bisector);
  if (obj.polygon)
    return parsePolygonStep(obj.polygon);
  throw new Error(`Construction #${index + 1}: unknown type. Keys: ${Object.keys(obj).join(", ")}`);
}
function parseLineStep(raw) {
  const o = raw;
  const through = o.through;
  if (!Array.isArray(through) || through.length !== 2) {
    throw new Error("line: 'through' must be [pointA, pointB]");
  }
  return { type: "line", through: [through[0], through[1]], id: str(o.id) };
}
function parseSegmentStep(raw) {
  const o = raw;
  return { type: "segment", from: str(o.from), to: str(o.to), id: str(o.id) };
}
function parseRayStep(raw) {
  const o = raw;
  return { type: "ray", from: str(o.from), through: str(o.through), id: str(o.id) };
}
function parseCircleStep(raw) {
  const o = raw;
  const step = {
    type: "circle",
    center: str(o.center),
    id: str(o.id)
  };
  if (o.through !== void 0)
    step.through = str(o.through);
  if (o.radius !== void 0)
    step.radius = o.radius;
  return step;
}
function parseIntersectStep(raw) {
  const o = raw;
  const of_ = o.of;
  if (!Array.isArray(of_) || of_.length !== 2) {
    throw new Error("intersect: 'of' must be [objA, objB]");
  }
  const id = o.id;
  const step = {
    type: "intersect",
    of: [of_[0], of_[1]],
    id: Array.isArray(id) ? [str(id[0]), str(id[1])] : str(id)
  };
  if (o.which !== void 0)
    step.which = o.which;
  return step;
}
function parseMidpointStep(raw) {
  const o = raw;
  const of_ = o.of;
  if (!Array.isArray(of_) || of_.length !== 2) {
    throw new Error("midpoint: 'of' must be [pointA, pointB]");
  }
  return { type: "midpoint", of: [of_[0], of_[1]], id: str(o.id) };
}
function parsePerpendicularStep(raw) {
  const o = raw;
  return { type: "perpendicular", to: str(o.to), through: str(o.through), id: str(o.id) };
}
function parseParallelStep(raw) {
  const o = raw;
  return { type: "parallel", to: str(o.to), through: str(o.through), id: str(o.id) };
}
function parseAngleBisectorStep(raw) {
  const o = raw;
  const pts = o.points;
  if (!Array.isArray(pts) || pts.length !== 3) {
    throw new Error("angle_bisector: 'points' must be [A, vertex, B]");
  }
  return { type: "angle_bisector", points: [pts[0], pts[1], pts[2]], id: str(o.id) };
}
function parsePolygonStep(raw) {
  const o = raw;
  const vertices = o.vertices;
  if (!Array.isArray(vertices) || vertices.length < 3) {
    throw new Error("polygon: 'vertices' must have at least 3 points");
  }
  return { type: "polygon", vertices, id: str(o.id) };
}
function parseStyles(raw) {
  if (!raw)
    return {};
  if (typeof raw !== "object")
    throw new Error("'style' must be an object");
  const result = {};
  for (const [id, val] of Object.entries(raw)) {
    result[id] = val;
  }
  return result;
}
function str(val) {
  if (typeof val === "string")
    return val;
  if (typeof val === "number")
    return String(val);
  throw new Error(`Expected a string, got ${typeof val}: ${JSON.stringify(val)}`);
}

// src/engine/geo.ts
var EPSILON = 1e-10;
function add(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}
function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}
function scale(v, s) {
  return [v[0] * s, v[1] * s];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}
function length(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}
function dist(a, b) {
  return length(sub(b, a));
}
function normalize(v) {
  const len = length(v);
  if (len < EPSILON)
    return [0, 0];
  return [v[0] / len, v[1] / len];
}
function perpVec(v) {
  return [-v[1], v[0]];
}
function midpoint(a, b) {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}
function lineFromTwoPoints(p1, p2) {
  return { point: p1, dir: normalize(sub(p2, p1)) };
}
function lineLineIntersection(l1, l2) {
  const d = cross(l1.dir, l2.dir);
  if (Math.abs(d) < EPSILON)
    return null;
  const diff = sub(l2.point, l1.point);
  const t = cross(diff, l2.dir) / d;
  return add(l1.point, scale(l1.dir, t));
}
function lineCircleIntersection(line, center, radius) {
  const oc = sub(line.point, center);
  const a = dot(line.dir, line.dir);
  const b = 2 * dot(oc, line.dir);
  const c = dot(oc, oc) - radius * radius;
  const disc = b * b - 4 * a * c;
  if (disc < -EPSILON)
    return [];
  if (disc < EPSILON) {
    const t = -b / (2 * a);
    return [add(line.point, scale(line.dir, t))];
  }
  const sqrtDisc = Math.sqrt(disc);
  const t1 = (-b - sqrtDisc) / (2 * a);
  const t2 = (-b + sqrtDisc) / (2 * a);
  return [
    add(line.point, scale(line.dir, t1)),
    add(line.point, scale(line.dir, t2))
  ];
}
function circleCircleIntersection(c1, r1, c2, r2) {
  const d = dist(c1, c2);
  if (d < EPSILON)
    return [];
  if (d > r1 + r2 + EPSILON)
    return [];
  if (d < Math.abs(r1 - r2) - EPSILON)
    return [];
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const hSq = r1 * r1 - a * a;
  if (hSq < -EPSILON)
    return [];
  const h = hSq < 0 ? 0 : Math.sqrt(hSq);
  const dir = normalize(sub(c2, c1));
  const p = add(c1, scale(dir, a));
  if (h < EPSILON)
    return [p];
  const perp = perpVec(dir);
  return [
    add(p, scale(perp, h)),
    add(p, scale(perp, -h))
  ];
}
function paramOnLine(line, point) {
  const diff = sub(point, line.point);
  return dot(diff, line.dir);
}
function filterSegment(points, from, to) {
  const line = lineFromTwoPoints(from, to);
  const len = dist(from, to);
  return points.filter((p) => {
    const t = paramOnLine(line, p);
    return t >= -EPSILON && t <= len + EPSILON;
  });
}
function filterRay(points, origin, dir) {
  const line = { point: origin, dir: normalize(dir) };
  return points.filter((p) => paramOnLine(line, p) >= -EPSILON);
}
function sortIntersections(points) {
  return [...points].sort((a, b) => {
    if (Math.abs(a[0] - b[0]) > EPSILON)
      return a[0] - b[0];
    return a[1] - b[1];
  });
}
function perpendicularThrough(line, point) {
  return { point, dir: normalize(perpVec(line.dir)) };
}
function parallelThrough(line, point) {
  return { point, dir: line.dir };
}
function angleBisectorThrough(a, vertex, b) {
  const da = normalize(sub(a, vertex));
  const db = normalize(sub(b, vertex));
  let bisDir = add(da, db);
  if (length(bisDir) < 1e-10) {
    bisDir = perpVec(da);
  }
  return { point: vertex, dir: normalize(bisDir) };
}

// src/engine/expressions.ts
function evaluateExpression(expr, resolvedPoints) {
  if (typeof expr === "number")
    return expr;
  const match = expr.match(/^distance\(\s*(\w+)\s*,\s*(\w+)\s*\)$/);
  if (match) {
    const p1 = resolvedPoints.get(match[1]);
    const p2 = resolvedPoints.get(match[2]);
    if (!p1)
      throw new Error(`distance(): unknown point '${match[1]}'`);
    if (!p2)
      throw new Error(`distance(): unknown point '${match[2]}'`);
    return dist(p1, p2);
  }
  throw new Error(`Unknown expression: '${expr}'`);
}

// src/engine/solver.ts
function solve(scene, pointOverrides) {
  const objects = /* @__PURE__ */ new Map();
  const resolvedPoints = /* @__PURE__ */ new Map();
  for (const [id, coords] of Object.entries(scene.points)) {
    const pos = pointOverrides?.get(id) ?? coords;
    const point = { type: "point", id, pos, draggable: true };
    objects.set(id, point);
    resolvedPoints.set(id, pos);
  }
  for (const step of scene.constructions) {
    resolveStep(step, objects, resolvedPoints);
  }
  return {
    objects,
    config: scene.config,
    style: scene.style,
    title: scene.title
  };
}
function resolveStep(step, objects, points) {
  switch (step.type) {
    case "line":
      return resolveLine(step, objects, points);
    case "segment":
      return resolveSegment(step, objects, points);
    case "ray":
      return resolveRay(step, objects, points);
    case "circle":
      return resolveCircle(step, objects, points);
    case "intersect":
      return resolveIntersect(step, objects, points);
    case "midpoint":
      return resolveMidpoint(step, objects, points);
    case "perpendicular":
      return resolvePerpendicular(step, objects, points);
    case "parallel":
      return resolveParallel(step, objects, points);
    case "angle_bisector":
      return resolveAngleBisector(step, objects, points);
    case "polygon":
      return resolvePolygon(step, objects, points);
  }
}
function getPoint(id, points) {
  const p = points.get(id);
  if (!p)
    throw new Error(`Unknown point '${id}'`);
  return p;
}
function getObject(id, objects) {
  const obj = objects.get(id);
  if (!obj)
    throw new Error(`Unknown object '${id}'`);
  return obj;
}
function resolveLine(step, objects, points) {
  const p1 = getPoint(step.through[0], points);
  const p2 = getPoint(step.through[1], points);
  const line = lineFromTwoPoints(p1, p2);
  objects.set(step.id, {
    type: "line",
    id: step.id,
    point: line.point,
    dir: line.dir
  });
}
function resolveSegment(step, objects, points) {
  objects.set(step.id, {
    type: "segment",
    id: step.id,
    from: getPoint(step.from, points),
    to: getPoint(step.to, points)
  });
}
function resolveRay(step, objects, points) {
  const origin = getPoint(step.from, points);
  const through = getPoint(step.through, points);
  objects.set(step.id, {
    type: "ray",
    id: step.id,
    origin,
    dir: normalize(sub(through, origin))
  });
}
function resolveCircle(step, objects, points) {
  const center = getPoint(step.center, points);
  let radius;
  if (step.through) {
    radius = dist(center, getPoint(step.through, points));
  } else if (step.radius !== void 0) {
    radius = evaluateExpression(step.radius, points);
  } else {
    throw new Error(`Circle '${step.id}': need 'through' or 'radius'`);
  }
  objects.set(step.id, { type: "circle", id: step.id, center, radius });
}
function resolveIntersect(step, objects, points) {
  const obj1 = getObject(step.of[0], objects);
  const obj2 = getObject(step.of[1], objects);
  let rawPoints = computeIntersection(obj1, obj2);
  rawPoints = sortIntersections(rawPoints);
  if (Array.isArray(step.id)) {
    for (let i = 0; i < step.id.length; i++) {
      const pos = i < rawPoints.length ? rawPoints[i] : [NaN, NaN];
      const pt = { type: "point", id: step.id[i], pos, draggable: false };
      objects.set(step.id[i], pt);
      points.set(step.id[i], pos);
    }
  } else {
    const idx = (step.which ?? 1) - 1;
    const pos = idx < rawPoints.length ? rawPoints[idx] : [NaN, NaN];
    const pt = { type: "point", id: step.id, pos, draggable: false };
    objects.set(step.id, pt);
    points.set(step.id, pos);
  }
}
function computeIntersection(a, b) {
  const aLine = toLineInfo(a);
  const bLine = toLineInfo(b);
  const aCircle = a.type === "circle" ? a : null;
  const bCircle = b.type === "circle" ? b : null;
  if (aLine && bLine) {
    const p = lineLineIntersection(aLine.line, bLine.line);
    if (!p)
      return [];
    let pts = [p];
    pts = filterByKind(pts, a, aLine);
    pts = filterByKind(pts, b, bLine);
    return pts;
  }
  if (aLine && bCircle) {
    let pts = lineCircleIntersection(aLine.line, bCircle.center, bCircle.radius);
    pts = filterByKind(pts, a, aLine);
    return pts;
  }
  if (aCircle && bLine) {
    let pts = lineCircleIntersection(bLine.line, aCircle.center, aCircle.radius);
    pts = filterByKind(pts, b, bLine);
    return pts;
  }
  if (aCircle && bCircle) {
    return circleCircleIntersection(aCircle.center, aCircle.radius, bCircle.center, bCircle.radius);
  }
  throw new Error(`Cannot intersect '${a.type}' with '${b.type}'`);
}
function toLineInfo(obj) {
  switch (obj.type) {
    case "line":
      return { line: { point: obj.point, dir: obj.dir } };
    case "segment":
      return { line: lineFromTwoPoints(obj.from, obj.to) };
    case "ray":
      return { line: { point: obj.origin, dir: obj.dir } };
    default:
      return null;
  }
}
function filterByKind(pts, obj, _info) {
  if (obj.type === "segment") {
    return filterSegment(pts, obj.from, obj.to);
  }
  if (obj.type === "ray") {
    return filterRay(pts, obj.origin, obj.dir);
  }
  return pts;
}
function resolveMidpoint(step, objects, points) {
  const p1 = getPoint(step.of[0], points);
  const p2 = getPoint(step.of[1], points);
  const pos = midpoint(p1, p2);
  objects.set(step.id, { type: "point", id: step.id, pos, draggable: false });
  points.set(step.id, pos);
}
function resolvePerpendicular(step, objects, points) {
  const lineObj = getObject(step.to, objects);
  const lineInfo = toLineInfo(lineObj);
  if (!lineInfo)
    throw new Error(`'${step.to}' is not a line-like object`);
  const throughPt = getPoint(step.through, points);
  const result = perpendicularThrough(lineInfo.line, throughPt);
  objects.set(step.id, { type: "line", id: step.id, point: result.point, dir: result.dir });
}
function resolveParallel(step, objects, points) {
  const lineObj = getObject(step.to, objects);
  const lineInfo = toLineInfo(lineObj);
  if (!lineInfo)
    throw new Error(`'${step.to}' is not a line-like object`);
  const throughPt = getPoint(step.through, points);
  const result = parallelThrough(lineInfo.line, throughPt);
  objects.set(step.id, { type: "line", id: step.id, point: result.point, dir: result.dir });
}
function resolveAngleBisector(step, objects, points) {
  const a = getPoint(step.points[0], points);
  const vertex = getPoint(step.points[1], points);
  const b = getPoint(step.points[2], points);
  const result = angleBisectorThrough(a, vertex, b);
  objects.set(step.id, { type: "line", id: step.id, point: result.point, dir: result.dir });
}
function resolvePolygon(step, objects, points) {
  const verts = step.vertices.map((id) => getPoint(id, points));
  objects.set(step.id, { type: "polygon", id: step.id, vertices: verts });
}

// src/renderer/canvas.ts
var Transform = class {
  constructor(config) {
    /** Camera offset in math-space coordinates */
    this.panX = 0;
    this.panY = 0;
    this.config = config;
    this.scale = config.scale;
  }
  get bounds() {
    const cx = this.config.width / 2;
    const cy = this.config.height / 2;
    return {
      minX: this.panX - cx / this.scale,
      maxX: this.panX + cx / this.scale,
      minY: this.panY - cy / this.scale,
      maxY: this.panY + cy / this.scale
    };
  }
  toPixel([x, y]) {
    const cx = this.config.width / 2;
    const cy = this.config.height / 2;
    return [
      cx + (x - this.panX) * this.scale,
      cy - (y - this.panY) * this.scale
    ];
  }
  toMath([px, py]) {
    const cx = this.config.width / 2;
    const cy = this.config.height / 2;
    return [
      (px - cx) / this.scale + this.panX,
      (cy - py) / this.scale + this.panY
    ];
  }
};
function createCanvas(container, config) {
  const canvas = document.createElement("canvas");
  canvas.width = config.width;
  canvas.height = config.height;
  canvas.classList.add("geometry-canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const transform = new Transform(config);
  return { canvas, ctx, transform };
}

// src/renderer/grid.ts
function drawGrid(ctx, transform, theme) {
  const { bounds, config } = transform;
  ctx.save();
  if (config.grid) {
    ctx.strokeStyle = theme.gridLine;
    ctx.lineWidth = 0.5;
    const startX = Math.ceil(bounds.minX);
    const endX = Math.floor(bounds.maxX);
    const startY = Math.ceil(bounds.minY);
    const endY = Math.floor(bounds.maxY);
    for (let x = startX; x <= endX; x++) {
      const [px] = transform.toPixel([x, 0]);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, config.height);
      ctx.stroke();
    }
    for (let y = startY; y <= endY; y++) {
      const [, py] = transform.toPixel([0, y]);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(config.width, py);
      ctx.stroke();
    }
  }
  if (config.axes) {
    ctx.strokeStyle = theme.axis;
    ctx.lineWidth = 1.5;
    const [, yAxisPx] = transform.toPixel([0, 0]);
    ctx.beginPath();
    ctx.moveTo(0, yAxisPx);
    ctx.lineTo(config.width, yAxisPx);
    ctx.stroke();
    const [xAxisPx] = transform.toPixel([0, 0]);
    ctx.beginPath();
    ctx.moveTo(xAxisPx, 0);
    ctx.lineTo(xAxisPx, config.height);
    ctx.stroke();
    ctx.fillStyle = theme.tickLabel;
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const startX = Math.ceil(bounds.minX);
    const endX = Math.floor(bounds.maxX);
    for (let x = startX; x <= endX; x++) {
      if (x === 0)
        continue;
      const [px] = transform.toPixel([x, 0]);
      ctx.beginPath();
      ctx.moveTo(px, yAxisPx - 3);
      ctx.lineTo(px, yAxisPx + 3);
      ctx.stroke();
      ctx.fillText(String(x), px, yAxisPx + 5);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const startY = Math.ceil(bounds.minY);
    const endY = Math.floor(bounds.maxY);
    for (let y = startY; y <= endY; y++) {
      if (y === 0)
        continue;
      const [, py] = transform.toPixel([0, y]);
      ctx.beginPath();
      ctx.moveTo(xAxisPx - 3, py);
      ctx.lineTo(xAxisPx + 3, py);
      ctx.stroke();
      ctx.fillText(String(y), xAxisPx - 6, py);
    }
  }
  ctx.restore();
}

// src/renderer/draw.ts
var DEFAULT_POINT_SIZE = 4;
var DEFAULT_LINE_WIDTH = 1.5;
var LABEL_OFFSET = 10;
function renderScene(ctx, scene, transform, theme) {
  const { width, height } = scene.config;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, width, height);
  drawGrid(ctx, transform, theme);
  if (scene.title) {
    ctx.save();
    ctx.fillStyle = theme.text;
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(scene.title, 8, 8);
    ctx.restore();
  }
  const ordered = sortByZOrder([...scene.objects.values()]);
  for (const obj of ordered) {
    const style = scene.style[obj.id] ?? {};
    drawObject(ctx, obj, style, transform, theme);
  }
}
var Z_ORDER = {
  polygon: 0,
  circle: 1,
  line: 2,
  segment: 2,
  ray: 2,
  point: 3
};
function sortByZOrder(objects) {
  return objects.sort((a, b) => (Z_ORDER[a.type] ?? 2) - (Z_ORDER[b.type] ?? 2));
}
function drawObject(ctx, obj, style, transform, theme) {
  switch (obj.type) {
    case "point":
      return drawPoint(ctx, obj.pos, obj.id, style, transform, theme);
    case "segment":
      return drawSegment(ctx, obj.from, obj.to, style, transform, theme);
    case "line":
      return drawLine(ctx, obj.point, obj.dir, style, transform, theme);
    case "ray":
      return drawRay(ctx, obj.origin, obj.dir, style, transform, theme);
    case "circle":
      return drawCircle(ctx, obj.center, obj.radius, style, transform, theme);
    case "polygon":
      return drawPolygon(ctx, obj.vertices, style, transform, theme);
  }
}
function applyStroke(ctx, style, theme) {
  ctx.strokeStyle = style.color ?? theme.text;
  ctx.lineWidth = style.width ?? DEFAULT_LINE_WIDTH;
  ctx.setLineDash(style.dash ? [6, 4] : []);
}
function drawPoint(ctx, pos, id, style, transform, theme) {
  if (isNaN(pos[0]) || isNaN(pos[1]))
    return;
  const [px, py] = transform.toPixel(pos);
  const r2 = style.size ?? DEFAULT_POINT_SIZE;
  ctx.save();
  ctx.fillStyle = style.color ?? theme.text;
  ctx.beginPath();
  ctx.arc(px, py, r2, 0, Math.PI * 2);
  ctx.fill();
  const label = style.label ?? id;
  ctx.fillStyle = style.color ?? theme.text;
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(label, px + LABEL_OFFSET, py - LABEL_OFFSET / 2);
  ctx.restore();
}
function drawSegment(ctx, from, to, style, transform, theme) {
  const [x1, y1] = transform.toPixel(from);
  const [x2, y2] = transform.toPixel(to);
  ctx.save();
  applyStroke(ctx, style, theme);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}
function drawLine(ctx, point, dir, style, transform, theme) {
  const { width, height } = transform.config;
  const diagonal = Math.sqrt(width * width + height * height) / transform.scale;
  const t1 = -diagonal * 2;
  const t2 = diagonal * 2;
  const p1 = [point[0] + dir[0] * t1, point[1] + dir[1] * t1];
  const p2 = [point[0] + dir[0] * t2, point[1] + dir[1] * t2];
  const [x1, y1] = transform.toPixel(p1);
  const [x2, y2] = transform.toPixel(p2);
  ctx.save();
  applyStroke(ctx, style, theme);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}
function drawRay(ctx, origin, dir, style, transform, theme) {
  const { width, height } = transform.config;
  const diagonal = Math.sqrt(width * width + height * height) / transform.scale;
  const farPoint = [origin[0] + dir[0] * diagonal * 2, origin[1] + dir[1] * diagonal * 2];
  const [x1, y1] = transform.toPixel(origin);
  const [x2, y2] = transform.toPixel(farPoint);
  ctx.save();
  applyStroke(ctx, style, theme);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}
function drawCircle(ctx, center, radius, style, transform, theme) {
  const [cx, cy] = transform.toPixel(center);
  const rPx = radius * transform.scale;
  ctx.save();
  if (style.fill) {
    ctx.fillStyle = style.fill;
    ctx.beginPath();
    ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
    ctx.fill();
  }
  applyStroke(ctx, style, theme);
  ctx.beginPath();
  ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
function drawPolygon(ctx, vertices, style, transform, theme) {
  if (vertices.length < 3)
    return;
  const pixelVerts = vertices.map((v) => transform.toPixel(v));
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pixelVerts[0][0], pixelVerts[0][1]);
  for (let i = 1; i < pixelVerts.length; i++) {
    ctx.lineTo(pixelVerts[i][0], pixelVerts[i][1]);
  }
  ctx.closePath();
  if (style.fill) {
    ctx.fillStyle = style.fill;
    ctx.fill();
  }
  applyStroke(ctx, style, theme);
  ctx.stroke();
  ctx.restore();
}

// src/renderer/theme.ts
var FALLBACK_LIGHT = {
  bg: "#ffffff",
  text: "#333333",
  textMuted: "#666666",
  gridLine: "#e0e0e0",
  axis: "#999999",
  tickLabel: "#666666"
};
var FALLBACK_DARK = {
  bg: "#1e1e1e",
  text: "#dcddde",
  textMuted: "#999999",
  gridLine: "#333333",
  axis: "#555555",
  tickLabel: "#888888"
};
function getThemeColors() {
  const el = document.body;
  const style = getComputedStyle(el);
  const isDark = el.classList.contains("theme-dark");
  const fallback = isDark ? FALLBACK_DARK : FALLBACK_LIGHT;
  return {
    bg: readVar(style, "--background-primary") || fallback.bg,
    text: readVar(style, "--text-normal") || fallback.text,
    textMuted: readVar(style, "--text-muted") || fallback.textMuted,
    gridLine: isDark ? fallback.gridLine : fallback.gridLine,
    axis: readVar(style, "--text-muted") || fallback.axis,
    tickLabel: readVar(style, "--text-muted") || fallback.tickLabel
  };
}
function readVar(style, varName) {
  return style.getPropertyValue(varName).trim();
}

// src/interaction/drag.ts
var HIT_RADIUS_PX = 10;
var ZOOM_FACTOR = 1.1;
var MIN_SCALE = 5;
var MAX_SCALE = 500;
var SNAP_RADIUS_PX = 14;
var SNAP_RING_RADIUS = 8;
var LINE_HIT_PX = 8;
var MAX_UNDO = 100;
function setupInteraction(canvas, ctx, scene, transform, initialTheme, onToolChange, onSceneChange) {
  const pointOverrides = /* @__PURE__ */ new Map();
  let drag = null;
  let activeTool = "pointer";
  let pending = { pointIds: [], lineId: null };
  let counters = recalcCounters(scene);
  let resolved = solve(scene, pointOverrides);
  let theme = initialTheme;
  let ghostPos = null;
  let currentSnap = null;
  let highlightLineId = null;
  const undoStack = [];
  const redoStack = [];
  function takeSnapshot() {
    return {
      points: { ...scene.points },
      constructions: scene.constructions.map((c) => ({ ...c }))
    };
  }
  function pushUndo() {
    undoStack.push(takeSnapshot());
    if (undoStack.length > MAX_UNDO)
      undoStack.shift();
    redoStack.length = 0;
  }
  function restoreSnapshot(snap) {
    scene.points = { ...snap.points };
    scene.constructions = snap.constructions.map((c) => ({ ...c }));
    counters = recalcCounters(scene);
    pointOverrides.clear();
    resetPending();
  }
  function undo() {
    if (undoStack.length === 0)
      return;
    redoStack.push(takeSnapshot());
    restoreSnapshot(undoStack.pop());
    rerender();
    notifyChange();
  }
  function redo() {
    if (redoStack.length === 0)
      return;
    undoStack.push(takeSnapshot());
    restoreSnapshot(redoStack.pop());
    rerender();
    notifyChange();
  }
  function resetPending() {
    pending = { pointIds: [], lineId: null };
    ghostPos = null;
    currentSnap = null;
    highlightLineId = null;
  }
  function refreshTheme() {
    theme = getThemeColors();
  }
  function rerender() {
    resolved = solve(scene, pointOverrides);
    renderScene(ctx, resolved, transform, theme);
    if (highlightLineId) {
      drawLineHighlight(ctx, transform, resolved, highlightLineId);
    }
    if (currentSnap && activeTool !== "pointer") {
      drawSnapRing(ctx, transform, currentSnap.pos);
    }
    drawGhostForTool(ctx, transform, resolved, activeTool, pending, ghostPos, currentSnap);
  }
  function setTool(t) {
    activeTool = t;
    resetPending();
    refreshTheme();
    rerender();
    onToolChange?.(t);
  }
  function findSnapTarget(pxPos) {
    const mathPos = transform.toMath(pxPos);
    const snapRadius = SNAP_RADIUS_PX / transform.scale;
    let best = null;
    let bestDist = Infinity;
    for (const [, obj] of resolved.objects) {
      if (obj.type !== "point")
        continue;
      const d = dist(mathPos, obj.pos);
      if (d < snapRadius && d < bestDist) {
        best = { pos: obj.pos, pointId: obj.id };
        bestDist = d;
      }
    }
    if (best && bestDist < snapRadius * 0.6)
      return best;
    const intersections = computeAllIntersections(resolved);
    for (const pos of intersections) {
      const d = dist(mathPos, pos);
      if (d < snapRadius && d < bestDist) {
        best = { pos, pointId: null };
        bestDist = d;
      }
    }
    return best;
  }
  function hitTestLine(pxPos) {
    const mathPos = transform.toMath(pxPos);
    const hitRadius = LINE_HIT_PX / transform.scale;
    let closest = null;
    let closestDist = Infinity;
    for (const [, obj] of resolved.objects) {
      const d = distToObject(mathPos, obj);
      if (d !== null && d < hitRadius && d < closestDist) {
        closest = obj.id;
        closestDist = d;
      }
    }
    return closest;
  }
  function hitTestDraggable(px) {
    const mathPos = transform.toMath(px);
    const hitRadius = HIT_RADIUS_PX / transform.scale;
    let closest = null;
    let closestDist = Infinity;
    for (const [, obj] of resolved.objects) {
      if (obj.type !== "point" || !obj.draggable)
        continue;
      const d = dist(mathPos, obj.pos);
      if (d < hitRadius && d < closestDist) {
        closest = obj.id;
        closestDist = d;
      }
    }
    return closest;
  }
  function getEventPos(e) {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0] ?? e.changedTouches[0];
      return [touch.clientX - rect.left, touch.clientY - rect.top];
    }
    return [e.clientX - rect.left, e.clientY - rect.top];
  }
  function getOrCreatePoint(pxPos) {
    const snap = findSnapTarget(pxPos);
    if (snap) {
      if (snap.pointId)
        return snap.pointId;
      const id2 = `P${counters.point++}`;
      scene.points[id2] = snap.pos;
      return id2;
    }
    const mathPos = transform.toMath(pxPos);
    const id = `P${counters.point++}`;
    scene.points[id] = mathPos;
    return id;
  }
  function notifyChange() {
    onSceneChange?.();
  }
  function toolNeedsLineNext() {
    if (activeTool === "perpendicular" || activeTool === "parallel") {
      return pending.lineId === null;
    }
    return false;
  }
  function toolPointCount() {
    switch (activeTool) {
      case "point":
        return 1;
      case "line":
      case "segment":
      case "circle":
      case "midpoint":
      case "perp_bisector":
        return 2;
      case "perpendicular":
      case "parallel":
        return 1;
      case "angle_bisector":
        return 3;
      case "compass":
        return 3;
      default:
        return 0;
    }
  }
  function handleToolClick(pxPos) {
    if (toolNeedsLineNext()) {
      const lineId = hitTestLine(pxPos);
      if (!lineId)
        return;
      pushUndo();
      pending.lineId = lineId;
      rerender();
      return;
    }
    const needed = toolPointCount();
    const have = pending.pointIds.length;
    if (have === 0)
      pushUndo();
    const ptId = getOrCreatePoint(pxPos);
    if (pending.pointIds.length > 0 && pending.pointIds[pending.pointIds.length - 1] === ptId)
      return;
    pending.pointIds.push(ptId);
    if (pending.pointIds.length < needed) {
      rerender();
      notifyChange();
      return;
    }
    executeConstruction();
    resetPending();
    rerender();
    notifyChange();
  }
  function executeConstruction() {
    const pts = pending.pointIds;
    switch (activeTool) {
      case "point":
        break;
      case "line":
        scene.constructions.push({
          type: "line",
          through: [pts[0], pts[1]],
          id: `L${counters.line++}`
        });
        break;
      case "segment":
        scene.constructions.push({
          type: "segment",
          from: pts[0],
          to: pts[1],
          id: `S${counters.segment++}`
        });
        break;
      case "circle":
        scene.constructions.push({
          type: "circle",
          center: pts[0],
          through: pts[1],
          id: `C${counters.circle++}`
        });
        break;
      case "midpoint":
        scene.constructions.push({
          type: "midpoint",
          of: [pts[0], pts[1]],
          id: `M${counters.midpoint++}`
        });
        break;
      case "perp_bisector": {
        const midId = `M${counters.midpoint++}`;
        const lineId = `PB${counters.perpBisector++}`;
        scene.constructions.push({
          type: "midpoint",
          of: [pts[0], pts[1]],
          id: midId
        });
        const tempLineId = `_pb_ref_${lineId}`;
        scene.constructions.push({
          type: "line",
          through: [pts[0], pts[1]],
          id: tempLineId
        });
        scene.constructions.push({
          type: "perpendicular",
          to: tempLineId,
          through: midId,
          id: lineId
        });
        scene.style[tempLineId] = { color: "transparent", width: 0 };
        break;
      }
      case "perpendicular":
        scene.constructions.push({
          type: "perpendicular",
          to: pending.lineId,
          through: pts[0],
          id: `Perp${counters.perpendicular++}`
        });
        break;
      case "parallel":
        scene.constructions.push({
          type: "parallel",
          to: pending.lineId,
          through: pts[0],
          id: `Par${counters.parallel++}`
        });
        break;
      case "angle_bisector":
        scene.constructions.push({
          type: "angle_bisector",
          points: [pts[0], pts[1], pts[2]],
          id: `AB${counters.angleBisector++}`
        });
        break;
      case "compass": {
        const radiusExpr = `distance(${pts[0]}, ${pts[1]})`;
        scene.constructions.push({
          type: "circle",
          center: pts[2],
          radius: radiusExpr,
          id: `C${counters.circle++}`
        });
        break;
      }
    }
  }
  function onDown(e) {
    const pos = getEventPos(e);
    if (activeTool === "pointer") {
      const pointId = hitTestDraggable(pos);
      if (pointId) {
        pushUndo();
        drag = { kind: "point", id: pointId };
        canvas.style.cursor = "grabbing";
      } else {
        drag = { kind: "pan", lastPx: pos };
        canvas.style.cursor = "move";
      }
      e.preventDefault();
      return;
    }
    handleToolClick(pos);
    e.preventDefault();
  }
  function onMove(e) {
    const pos = getEventPos(e);
    if (activeTool === "pointer") {
      if (!drag) {
        const hoverId = hitTestDraggable(pos);
        canvas.style.cursor = hoverId ? "grab" : "default";
        return;
      }
      if (drag.kind === "point") {
        const mathPos = transform.toMath(pos);
        pointOverrides.set(drag.id, mathPos);
        rerender();
      } else {
        const dx = (pos[0] - drag.lastPx[0]) / transform.scale;
        const dy = (pos[1] - drag.lastPx[1]) / transform.scale;
        transform.panX -= dx;
        transform.panY += dy;
        drag.lastPx = pos;
        rerender();
      }
      e.preventDefault();
      return;
    }
    canvas.style.cursor = "crosshair";
    if (toolNeedsLineNext()) {
      highlightLineId = hitTestLine(pos);
      currentSnap = null;
    } else {
      highlightLineId = null;
      currentSnap = findSnapTarget(pos);
    }
    ghostPos = transform.toMath(pos);
    rerender();
  }
  function onUp() {
    if (drag) {
      if (drag.kind === "point") {
        const override = pointOverrides.get(drag.id);
        if (override) {
          scene.points[drag.id] = override;
          pointOverrides.delete(drag.id);
          notifyChange();
        } else {
          undoStack.pop();
        }
      }
      canvas.style.cursor = drag.kind === "point" ? "grab" : "default";
      drag = null;
    }
  }
  function onWheel(e) {
    e.preventDefault();
    const direction = e.deltaY < 0 ? 1 : -1;
    const factor = direction > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, transform.scale * factor));
    const pos = getEventPos(e);
    const mathBefore = transform.toMath(pos);
    transform.scale = newScale;
    const mathAfter = transform.toMath(pos);
    transform.panX -= mathAfter[0] - mathBefore[0];
    transform.panY -= mathAfter[1] - mathBefore[1];
    rerender();
  }
  function onKeyDown(e) {
    if (e.key === "Escape") {
      if (pending.pointIds.length > 0 || pending.lineId) {
        if (undoStack.length > 0) {
          restoreSnapshot(undoStack.pop());
        }
        resetPending();
        rerender();
        notifyChange();
      } else {
        setTool("pointer");
      }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
      e.preventDefault();
      e.stopPropagation();
      undo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z" || (e.ctrlKey || e.metaKey) && e.key === "y") {
      e.preventDefault();
      e.stopPropagation();
      redo();
      return;
    }
  }
  canvas.addEventListener("mousedown", onDown);
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mouseup", onUp);
  canvas.addEventListener("mouseleave", () => {
    onUp();
    currentSnap = null;
    ghostPos = null;
    highlightLineId = null;
    if (activeTool !== "pointer")
      rerender();
  });
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("touchstart", onDown, { passive: false });
  canvas.addEventListener("touchmove", onMove, { passive: false });
  canvas.addEventListener("touchend", onUp);
  canvas.tabIndex = 0;
  canvas.addEventListener("keydown", onKeyDown);
  return { setTool };
}
function distToObject(p, obj) {
  switch (obj.type) {
    case "line": {
      const line = { point: obj.point, dir: obj.dir };
      return distPointToLine(p, line);
    }
    case "segment": {
      return distPointToSegment(p, obj.from, obj.to);
    }
    case "ray": {
      return distPointToRay(p, obj.origin, obj.dir);
    }
    case "circle": {
      const dCenter = dist(p, obj.center);
      return Math.abs(dCenter - obj.radius);
    }
    default:
      return null;
  }
}
function distPointToLine(p, line) {
  const v = sub(p, line.point);
  const proj = dot(v, line.dir);
  const closest = add(line.point, scale(line.dir, proj));
  return dist(p, closest);
}
function distPointToSegment(p, a, b) {
  const line = lineFromTwoPoints(a, b);
  const len = dist(a, b);
  const v = sub(p, a);
  const t = Math.max(0, Math.min(len, dot(v, line.dir)));
  const closest = add(a, scale(line.dir, t));
  return dist(p, closest);
}
function distPointToRay(p, origin, dir) {
  const normDir = normalize(dir);
  const v = sub(p, origin);
  const t = Math.max(0, dot(v, normDir));
  const closest = add(origin, scale(normDir, t));
  return dist(p, closest);
}
function computeAllIntersections(resolved) {
  const intersectables = [];
  for (const [, obj] of resolved.objects) {
    if (obj.type === "line" || obj.type === "segment" || obj.type === "ray" || obj.type === "circle") {
      intersectables.push(obj);
    }
  }
  const results = [];
  for (let i = 0; i < intersectables.length; i++) {
    for (let j = i + 1; j < intersectables.length; j++) {
      const pts = intersectPair(intersectables[i], intersectables[j]);
      for (const p of pts) {
        if (!isNaN(p[0]) && !isNaN(p[1])) {
          results.push(p);
        }
      }
    }
  }
  return results;
}
function toGeoLine(obj) {
  switch (obj.type) {
    case "line":
      return { point: obj.point, dir: obj.dir };
    case "segment":
      return lineFromTwoPoints(obj.from, obj.to);
    case "ray":
      return { point: obj.origin, dir: obj.dir };
    default:
      return null;
  }
}
function intersectPair(a, b) {
  const aLine = toGeoLine(a);
  const bLine = toGeoLine(b);
  const aCircle = a.type === "circle" ? a : null;
  const bCircle = b.type === "circle" ? b : null;
  let pts = [];
  if (aLine && bLine) {
    const p = lineLineIntersection(aLine, bLine);
    if (p)
      pts = [p];
  } else if (aLine && bCircle) {
    pts = lineCircleIntersection(aLine, bCircle.center, bCircle.radius);
  } else if (aCircle && bLine) {
    pts = lineCircleIntersection(bLine, aCircle.center, aCircle.radius);
  } else if (aCircle && bCircle) {
    pts = circleCircleIntersection(aCircle.center, aCircle.radius, bCircle.center, bCircle.radius);
  }
  pts = filterByBounds(pts, a);
  pts = filterByBounds(pts, b);
  return pts;
}
function filterByBounds(pts, obj) {
  if (obj.type === "segment")
    return filterSegment(pts, obj.from, obj.to);
  if (obj.type === "ray")
    return filterRay(pts, obj.origin, obj.dir);
  return pts;
}
function drawSnapRing(ctx, transform, pos) {
  const [px, py] = transform.toPixel(pos);
  ctx.save();
  ctx.strokeStyle = "rgba(70, 130, 240, 0.8)";
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(px, py, SNAP_RING_RADIUS, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(70, 130, 240, 0.12)";
  ctx.fill();
  ctx.restore();
}
function drawLineHighlight(ctx, transform, resolved, lineId) {
  const obj = resolved.objects.get(lineId);
  if (!obj)
    return;
  ctx.save();
  ctx.strokeStyle = "rgba(70, 130, 240, 0.4)";
  ctx.lineWidth = 6;
  ctx.setLineDash([]);
  if (obj.type === "line") {
    const { width, height } = transform.config;
    const diag = Math.sqrt(width * width + height * height) / transform.scale * 2;
    const p1 = transform.toPixel([obj.point[0] + obj.dir[0] * -diag, obj.point[1] + obj.dir[1] * -diag]);
    const p2 = transform.toPixel([obj.point[0] + obj.dir[0] * diag, obj.point[1] + obj.dir[1] * diag]);
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
  } else if (obj.type === "segment") {
    const p1 = transform.toPixel(obj.from);
    const p2 = transform.toPixel(obj.to);
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
  } else if (obj.type === "ray") {
    const { width, height } = transform.config;
    const diag = Math.sqrt(width * width + height * height) / transform.scale * 2;
    const p1 = transform.toPixel(obj.origin);
    const p2 = transform.toPixel([obj.origin[0] + obj.dir[0] * diag, obj.origin[1] + obj.dir[1] * diag]);
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
  } else if (obj.type === "circle") {
    const [cx, cy] = transform.toPixel(obj.center);
    const rPx = obj.radius * transform.scale;
    ctx.beginPath();
    ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}
function drawGhostForTool(ctx, transform, resolved, tool, pending, ghostPos, snap) {
  if (!ghostPos || pending.pointIds.length === 0)
    return;
  const targetPos = snap ? snap.pos : ghostPos;
  ctx.save();
  ctx.strokeStyle = "rgba(70, 130, 240, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  const firstPt = getResolvedPos(resolved, pending.pointIds[0]);
  if (!firstPt) {
    ctx.restore();
    return;
  }
  const [x1, y1] = transform.toPixel(firstPt);
  const [x2, y2] = transform.toPixel(targetPos);
  switch (tool) {
    case "line":
    case "segment":
    case "perp_bisector": {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      if (tool === "perp_bisector") {
        const mid = transform.toPixel(midpoint(firstPt, targetPos));
        ctx.beginPath();
        ctx.arc(mid[0], mid[1], 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(70, 130, 240, 0.6)";
        ctx.fill();
      }
      break;
    }
    case "circle": {
      const r2 = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      ctx.beginPath();
      ctx.arc(x1, y1, r2, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "midpoint": {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const mid = transform.toPixel(midpoint(firstPt, targetPos));
      ctx.beginPath();
      ctx.arc(mid[0], mid[1], 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(70, 130, 240, 0.6)";
      ctx.fill();
      break;
    }
    case "compass": {
      if (pending.pointIds.length === 1) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (pending.pointIds.length === 2) {
        const p0 = getResolvedPos(resolved, pending.pointIds[0]);
        const p1 = getResolvedPos(resolved, pending.pointIds[1]);
        if (p0 && p1) {
          const r2 = dist(p0, p1) * transform.scale;
          ctx.beginPath();
          ctx.arc(x2, y2, r2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      break;
    }
    case "angle_bisector": {
      if (pending.pointIds.length === 1) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (pending.pointIds.length === 2) {
        const secondPt = getResolvedPos(resolved, pending.pointIds[1]);
        if (secondPt) {
          const [sx, sy] = transform.toPixel(secondPt);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(sx, sy);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
      break;
    }
    case "perpendicular":
    case "parallel": {
      ctx.beginPath();
      ctx.arc(x2, y2, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(70, 130, 240, 0.6)";
      ctx.fill();
      break;
    }
  }
  ctx.restore();
}
function getResolvedPos(resolved, id) {
  const obj = resolved.objects.get(id);
  if (!obj || obj.type !== "point")
    return null;
  return obj.pos;
}
function recalcCounters(scene) {
  return {
    point: Object.keys(scene.points).length + 1,
    line: scene.constructions.filter((c) => c.type === "line").length + 1,
    segment: scene.constructions.filter((c) => c.type === "segment").length + 1,
    circle: scene.constructions.filter((c) => c.type === "circle").length + 1,
    midpoint: scene.constructions.filter((c) => c.type === "midpoint").length + 1,
    perpBisector: scene.constructions.filter((c) => c.type === "perpendicular").length + 1,
    perpendicular: scene.constructions.filter((c) => c.type === "perpendicular").length + 1,
    parallel: scene.constructions.filter((c) => c.type === "parallel").length + 1,
    angleBisector: scene.constructions.filter((c) => c.type === "angle_bisector").length + 1
  };
}

// src/serializer.ts
function r(n) {
  return Math.round(n * 100) / 100;
}
function vec(v) {
  return `[${r(v[0])}, ${r(v[1])}]`;
}
function serializeScene(scene) {
  const lines = [];
  if (scene.title) {
    lines.push(`title: ${scene.title}`);
  }
  const pointEntries = Object.entries(scene.points);
  if (pointEntries.length > 0) {
    lines.push("points:");
    for (const [id, coords] of pointEntries) {
      lines.push(`  ${id}: ${vec(coords)}`);
    }
  }
  if (scene.constructions.length > 0) {
    lines.push("constructions:");
    for (const step of scene.constructions) {
      lines.push(`  - ${serializeStep(step)}`);
    }
  }
  const styleEntries = Object.entries(scene.style);
  if (styleEntries.length > 0) {
    lines.push("style:");
    for (const [id, s] of styleEntries) {
      const props = [];
      if (s.color)
        props.push(`color: ${s.color}`);
      if (s.width !== void 0)
        props.push(`width: ${s.width}`);
      if (s.dash)
        props.push(`dash: true`);
      if (s.fill)
        props.push(`fill: "${s.fill}"`);
      if (s.size !== void 0)
        props.push(`size: ${s.size}`);
      if (s.label)
        props.push(`label: "${s.label}"`);
      lines.push(`  ${id}: {${props.join(", ")}}`);
    }
  }
  const cfgParts = [];
  if (scene.config.grid)
    cfgParts.push("grid: true");
  if (scene.config.axes)
    cfgParts.push("axes: true");
  if (scene.config.width !== 600)
    cfgParts.push(`width: ${scene.config.width}`);
  if (scene.config.height !== 400)
    cfgParts.push(`height: ${scene.config.height}`);
  if (scene.config.scale !== 50)
    cfgParts.push(`scale: ${scene.config.scale}`);
  if (!scene.config.interactive)
    cfgParts.push("interactive: false");
  if (cfgParts.length > 0) {
    lines.push("config:");
    for (const p of cfgParts) {
      lines.push(`  ${p}`);
    }
  }
  return lines.join("\n") + "\n";
}
function serializeStep(step) {
  switch (step.type) {
    case "line":
      return `line: {through: [${step.through[0]}, ${step.through[1]}], id: ${step.id}}`;
    case "segment":
      return `segment: {from: ${step.from}, to: ${step.to}, id: ${step.id}}`;
    case "ray":
      return `ray: {from: ${step.from}, through: ${step.through}, id: ${step.id}}`;
    case "circle": {
      const parts = [`center: ${step.center}`];
      if (step.through)
        parts.push(`through: ${step.through}`);
      if (step.radius !== void 0) {
        parts.push(`radius: ${typeof step.radius === "string" ? `"${step.radius}"` : step.radius}`);
      }
      parts.push(`id: ${step.id}`);
      return `circle: {${parts.join(", ")}}`;
    }
    case "intersect": {
      const idStr = Array.isArray(step.id) ? `[${step.id[0]}, ${step.id[1]}]` : step.id;
      const parts = [`of: [${step.of[0]}, ${step.of[1]}]`, `id: ${idStr}`];
      if (step.which !== void 0)
        parts.push(`which: ${step.which}`);
      return `intersect: {${parts.join(", ")}}`;
    }
    case "midpoint":
      return `midpoint: {of: [${step.of[0]}, ${step.of[1]}], id: ${step.id}}`;
    case "perpendicular":
      return `perpendicular: {to: ${step.to}, through: ${step.through}, id: ${step.id}}`;
    case "parallel":
      return `parallel: {to: ${step.to}, through: ${step.through}, id: ${step.id}}`;
    case "angle_bisector":
      return `angle_bisector: {points: [${step.points[0]}, ${step.points[1]}, ${step.points[2]}], id: ${step.id}}`;
    case "polygon":
      return `polygon: {vertices: [${step.vertices.join(", ")}], id: ${step.id}}`;
  }
}

// src/main.ts
var TOOLS = [
  { id: "pointer", label: "Select / Pan", icon: "\u2196" },
  { id: "point", label: "Point", icon: "\u2022" },
  { id: "line", label: "Line", icon: "\u2571" },
  { id: "segment", label: "Segment", icon: "\u2014" },
  { id: "circle", label: "Circle", icon: "\u25CB" },
  { id: "midpoint", label: "Midpoint", icon: "\u25E6" },
  { id: "perp_bisector", label: "Perpendicular Bisector", icon: "\u22A5" },
  { id: "perpendicular", label: "Perpendicular", icon: "\u221F" },
  { id: "parallel", label: "Parallel", icon: "\u2225" },
  { id: "angle_bisector", label: "Angle Bisector", icon: "\u2220" },
  { id: "compass", label: "Compass", icon: "\u2299" }
];
var GeometryPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor(
      "geometry",
      (source, el, ctx) => {
        try {
          this.renderGeometry(source, el, ctx);
        } catch (err) {
          this.renderError(el, err);
        }
      }
    );
  }
  renderGeometry(source, el, mdCtx) {
    const scene = parseGeometry(source);
    const resolved = solve(scene);
    const container = el.createDiv({ cls: "geometry-container" });
    const { canvas, ctx, transform } = createCanvas(container, scene.config);
    const theme = getThemeColors();
    renderScene(ctx, resolved, transform, theme);
    if (!scene.config.interactive)
      return;
    const toolbar = container.createDiv({ cls: "geometry-toolbar" });
    const buttons = /* @__PURE__ */ new Map();
    for (const tool of TOOLS) {
      const btn = toolbar.createEl("button", {
        cls: "geometry-tool-btn",
        attr: { title: tool.label }
      });
      btn.createSpan({ cls: "geometry-tool-icon", text: tool.icon });
      if (tool.id === "pointer")
        btn.classList.add("is-active");
      buttons.set(tool.id, btn);
    }
    const syncToSource = () => {
      this.updateCodeBlock(scene, el, mdCtx);
    };
    const { setTool } = setupInteraction(
      canvas,
      ctx,
      scene,
      transform,
      theme,
      (t) => {
        for (const [id, btn] of buttons) {
          btn.classList.toggle("is-active", id === t);
        }
      },
      syncToSource
    );
    for (const [id, btn] of buttons) {
      btn.addEventListener("click", () => setTool(id));
    }
  }
  updateCodeBlock(scene, el, mdCtx) {
    const sectionInfo = mdCtx.getSectionInfo(el);
    if (!sectionInfo)
      return;
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view)
      return;
    const editor = view.editor;
    const { lineStart, lineEnd } = sectionInfo;
    const newYaml = serializeScene(scene);
    const from = { line: lineStart + 1, ch: 0 };
    const to = { line: lineEnd, ch: 0 };
    editor.replaceRange(newYaml, from, to);
  }
  renderError(el, err) {
    const msg = err instanceof Error ? err.message : String(err);
    const pre = el.createEl("pre", { cls: "geometry-error" });
    pre.setText(`Geometry Error: ${msg}`);
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL2lkZW50aXR5LmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC92aXNpdC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvZG9jL2RpcmVjdGl2ZXMuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2RvYy9hbmNob3JzLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9kb2MvYXBwbHlSZXZpdmVyLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9ub2Rlcy90b0pTLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9ub2Rlcy9Ob2RlLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9ub2Rlcy9BbGlhcy5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvbm9kZXMvU2NhbGFyLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9kb2MvY3JlYXRlTm9kZS5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvbm9kZXMvQ29sbGVjdGlvbi5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc3RyaW5naWZ5L3N0cmluZ2lmeUNvbW1lbnQuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9mb2xkRmxvd0xpbmVzLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zdHJpbmdpZnkvc3RyaW5naWZ5U3RyaW5nLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zdHJpbmdpZnkvc3RyaW5naWZ5LmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zdHJpbmdpZnkvc3RyaW5naWZ5UGFpci5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvbG9nLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvbWVyZ2UuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL2FkZFBhaXJUb0pTTWFwLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9ub2Rlcy9QYWlyLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zdHJpbmdpZnkvc3RyaW5naWZ5Q29sbGVjdGlvbi5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvbm9kZXMvWUFNTE1hcC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL2NvbW1vbi9tYXAuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL1lBTUxTZXEuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9jb21tb24vc2VxLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvY29tbW9uL3N0cmluZy5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL2NvbW1vbi9udWxsLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvY29yZS9ib29sLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zdHJpbmdpZnkvc3RyaW5naWZ5TnVtYmVyLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvY29yZS9mbG9hdC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL2NvcmUvaW50LmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvY29yZS9zY2hlbWEuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9qc29uL3NjaGVtYS5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL3lhbWwtMS4xL2JpbmFyeS5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL3lhbWwtMS4xL3BhaXJzLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvb21hcC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL3lhbWwtMS4xL2Jvb2wuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS95YW1sLTEuMS9mbG9hdC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL3lhbWwtMS4xL2ludC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL3lhbWwtMS4xL3NldC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL3lhbWwtMS4xL3RpbWVzdGFtcC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL3lhbWwtMS4xL3NjaGVtYS5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL3RhZ3MuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9TY2hlbWEuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnlEb2N1bWVudC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvZG9jL0RvY3VtZW50LmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9lcnJvcnMuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2NvbXBvc2UvcmVzb2x2ZS1wcm9wcy5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS91dGlsLWNvbnRhaW5zLW5ld2xpbmUuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2NvbXBvc2UvdXRpbC1mbG93LWluZGVudC1jaGVjay5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS91dGlsLW1hcC1pbmNsdWRlcy5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9yZXNvbHZlLWJsb2NrLW1hcC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9yZXNvbHZlLWJsb2NrLXNlcS5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9yZXNvbHZlLWVuZC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9yZXNvbHZlLWZsb3ctY29sbGVjdGlvbi5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9jb21wb3NlLWNvbGxlY3Rpb24uanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2NvbXBvc2UvcmVzb2x2ZS1ibG9jay1zY2FsYXIuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2NvbXBvc2UvcmVzb2x2ZS1mbG93LXNjYWxhci5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9jb21wb3NlLXNjYWxhci5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS91dGlsLWVtcHR5LXNjYWxhci1wb3NpdGlvbi5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9jb21wb3NlLW5vZGUuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2NvbXBvc2UvY29tcG9zZS1kb2MuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2NvbXBvc2UvY29tcG9zZXIuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3BhcnNlL2NzdC12aXNpdC5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvcGFyc2UvY3N0LmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9wYXJzZS9sZXhlci5qcyIsICJub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvcGFyc2UvbGluZS1jb3VudGVyLmpzIiwgIm5vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9wYXJzZS9wYXJzZXIuanMiLCAibm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3B1YmxpYy1hcGkuanMiLCAic3JjL3BhcnNlci50cyIsICJzcmMvZW5naW5lL2dlby50cyIsICJzcmMvZW5naW5lL2V4cHJlc3Npb25zLnRzIiwgInNyYy9lbmdpbmUvc29sdmVyLnRzIiwgInNyYy9yZW5kZXJlci9jYW52YXMudHMiLCAic3JjL3JlbmRlcmVyL2dyaWQudHMiLCAic3JjL3JlbmRlcmVyL2RyYXcudHMiLCAic3JjL3JlbmRlcmVyL3RoZW1lLnRzIiwgInNyYy9pbnRlcmFjdGlvbi9kcmFnLnRzIiwgInNyYy9zZXJpYWxpemVyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LCBNYXJrZG93blZpZXcsIFBsdWdpbiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgcGFyc2VHZW9tZXRyeSB9IGZyb20gXCIuL3BhcnNlclwiO1xuaW1wb3J0IHsgc29sdmUgfSBmcm9tIFwiLi9lbmdpbmUvc29sdmVyXCI7XG5pbXBvcnQgeyBjcmVhdGVDYW52YXMgfSBmcm9tIFwiLi9yZW5kZXJlci9jYW52YXNcIjtcbmltcG9ydCB7IHJlbmRlclNjZW5lIH0gZnJvbSBcIi4vcmVuZGVyZXIvZHJhd1wiO1xuaW1wb3J0IHsgZ2V0VGhlbWVDb2xvcnMgfSBmcm9tIFwiLi9yZW5kZXJlci90aGVtZVwiO1xuaW1wb3J0IHsgc2V0dXBJbnRlcmFjdGlvbiwgVG9vbFR5cGUgfSBmcm9tIFwiLi9pbnRlcmFjdGlvbi9kcmFnXCI7XG5pbXBvcnQgeyBzZXJpYWxpemVTY2VuZSB9IGZyb20gXCIuL3NlcmlhbGl6ZXJcIjtcbmltcG9ydCB7IEdlb21ldHJ5U2NlbmUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5jb25zdCBUT09MUzogeyBpZDogVG9vbFR5cGU7IGxhYmVsOiBzdHJpbmc7IGljb246IHN0cmluZyB9W10gPSBbXG4gIHsgaWQ6IFwicG9pbnRlclwiLCBsYWJlbDogXCJTZWxlY3QgLyBQYW5cIiwgaWNvbjogXCJcdTIxOTZcIiB9LFxuICB7IGlkOiBcInBvaW50XCIsIGxhYmVsOiBcIlBvaW50XCIsIGljb246IFwiXHUyMDIyXCIgfSxcbiAgeyBpZDogXCJsaW5lXCIsIGxhYmVsOiBcIkxpbmVcIiwgaWNvbjogXCJcdTI1NzFcIiB9LFxuICB7IGlkOiBcInNlZ21lbnRcIiwgbGFiZWw6IFwiU2VnbWVudFwiLCBpY29uOiBcIlx1MjAxNFwiIH0sXG4gIHsgaWQ6IFwiY2lyY2xlXCIsIGxhYmVsOiBcIkNpcmNsZVwiLCBpY29uOiBcIlx1MjVDQlwiIH0sXG4gIHsgaWQ6IFwibWlkcG9pbnRcIiwgbGFiZWw6IFwiTWlkcG9pbnRcIiwgaWNvbjogXCJcdTI1RTZcIiB9LFxuICB7IGlkOiBcInBlcnBfYmlzZWN0b3JcIiwgbGFiZWw6IFwiUGVycGVuZGljdWxhciBCaXNlY3RvclwiLCBpY29uOiBcIlx1MjJBNVwiIH0sXG4gIHsgaWQ6IFwicGVycGVuZGljdWxhclwiLCBsYWJlbDogXCJQZXJwZW5kaWN1bGFyXCIsIGljb246IFwiXHUyMjFGXCIgfSxcbiAgeyBpZDogXCJwYXJhbGxlbFwiLCBsYWJlbDogXCJQYXJhbGxlbFwiLCBpY29uOiBcIlx1MjIyNVwiIH0sXG4gIHsgaWQ6IFwiYW5nbGVfYmlzZWN0b3JcIiwgbGFiZWw6IFwiQW5nbGUgQmlzZWN0b3JcIiwgaWNvbjogXCJcdTIyMjBcIiB9LFxuICB7IGlkOiBcImNvbXBhc3NcIiwgbGFiZWw6IFwiQ29tcGFzc1wiLCBpY29uOiBcIlx1MjI5OVwiIH0sXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW9tZXRyeVBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICB0aGlzLnJlZ2lzdGVyTWFya2Rvd25Db2RlQmxvY2tQcm9jZXNzb3IoXG4gICAgICBcImdlb21ldHJ5XCIsXG4gICAgICAoc291cmNlOiBzdHJpbmcsIGVsOiBIVE1MRWxlbWVudCwgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJHZW9tZXRyeShzb3VyY2UsIGVsLCBjdHgpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlckVycm9yKGVsLCBlcnIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyR2VvbWV0cnkoXG4gICAgc291cmNlOiBzdHJpbmcsXG4gICAgZWw6IEhUTUxFbGVtZW50LFxuICAgIG1kQ3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0XG4gICk6IHZvaWQge1xuICAgIGNvbnN0IHNjZW5lID0gcGFyc2VHZW9tZXRyeShzb3VyY2UpO1xuICAgIGNvbnN0IHJlc29sdmVkID0gc29sdmUoc2NlbmUpO1xuXG4gICAgY29uc3QgY29udGFpbmVyID0gZWwuY3JlYXRlRGl2KHsgY2xzOiBcImdlb21ldHJ5LWNvbnRhaW5lclwiIH0pO1xuXG4gICAgLy8gQ2FudmFzXG4gICAgY29uc3QgeyBjYW52YXMsIGN0eCwgdHJhbnNmb3JtIH0gPSBjcmVhdGVDYW52YXMoY29udGFpbmVyLCBzY2VuZS5jb25maWcpO1xuXG4gICAgLy8gUmVhZCB0aGVtZSBmcm9tIE9ic2lkaWFuJ3MgYm9keSBjbGFzc2VzICsgQ1NTIHZhcmlhYmxlc1xuICAgIGNvbnN0IHRoZW1lID0gZ2V0VGhlbWVDb2xvcnMoKTtcblxuICAgIHJlbmRlclNjZW5lKGN0eCwgcmVzb2x2ZWQsIHRyYW5zZm9ybSwgdGhlbWUpO1xuXG4gICAgaWYgKCFzY2VuZS5jb25maWcuaW50ZXJhY3RpdmUpIHJldHVybjtcblxuICAgIC8vIFRvb2xiYXIgKG92ZXJsYWlkKVxuICAgIGNvbnN0IHRvb2xiYXIgPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcImdlb21ldHJ5LXRvb2xiYXJcIiB9KTtcbiAgICBjb25zdCBidXR0b25zID0gbmV3IE1hcDxUb29sVHlwZSwgSFRNTEJ1dHRvbkVsZW1lbnQ+KCk7XG5cbiAgICBmb3IgKGNvbnN0IHRvb2wgb2YgVE9PTFMpIHtcbiAgICAgIGNvbnN0IGJ0biA9IHRvb2xiYXIuY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgICAgICBjbHM6IFwiZ2VvbWV0cnktdG9vbC1idG5cIixcbiAgICAgICAgYXR0cjogeyB0aXRsZTogdG9vbC5sYWJlbCB9LFxuICAgICAgfSk7XG4gICAgICBidG4uY3JlYXRlU3Bhbih7IGNsczogXCJnZW9tZXRyeS10b29sLWljb25cIiwgdGV4dDogdG9vbC5pY29uIH0pO1xuICAgICAgaWYgKHRvb2wuaWQgPT09IFwicG9pbnRlclwiKSBidG4uY2xhc3NMaXN0LmFkZChcImlzLWFjdGl2ZVwiKTtcbiAgICAgIGJ1dHRvbnMuc2V0KHRvb2wuaWQsIGJ0bik7XG4gICAgfVxuXG4gICAgLy8gU3luYyBjYWxsYmFjazogd3JpdGUgc2NlbmUgYmFjayB0byB0aGUgY29kZSBibG9ja1xuICAgIGNvbnN0IHN5bmNUb1NvdXJjZSA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlQ29kZUJsb2NrKHNjZW5lLCBlbCwgbWRDdHgpO1xuICAgIH07XG5cbiAgICBjb25zdCB7IHNldFRvb2wgfSA9IHNldHVwSW50ZXJhY3Rpb24oXG4gICAgICBjYW52YXMsXG4gICAgICBjdHgsXG4gICAgICBzY2VuZSxcbiAgICAgIHRyYW5zZm9ybSxcbiAgICAgIHRoZW1lLFxuICAgICAgKHQpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBbaWQsIGJ0bl0gb2YgYnV0dG9ucykge1xuICAgICAgICAgIGJ0bi5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtYWN0aXZlXCIsIGlkID09PSB0KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN5bmNUb1NvdXJjZVxuICAgICk7XG5cbiAgICBmb3IgKGNvbnN0IFtpZCwgYnRuXSBvZiBidXR0b25zKSB7XG4gICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHNldFRvb2woaWQpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNvZGVCbG9jayhcbiAgICBzY2VuZTogR2VvbWV0cnlTY2VuZSxcbiAgICBlbDogSFRNTEVsZW1lbnQsXG4gICAgbWRDdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHRcbiAgKTogdm9pZCB7XG4gICAgY29uc3Qgc2VjdGlvbkluZm8gPSBtZEN0eC5nZXRTZWN0aW9uSW5mbyhlbCk7XG4gICAgaWYgKCFzZWN0aW9uSW5mbykgcmV0dXJuO1xuXG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgaWYgKCF2aWV3KSByZXR1cm47XG5cbiAgICBjb25zdCBlZGl0b3IgPSB2aWV3LmVkaXRvcjtcbiAgICBjb25zdCB7IGxpbmVTdGFydCwgbGluZUVuZCB9ID0gc2VjdGlvbkluZm87XG5cbiAgICBjb25zdCBuZXdZYW1sID0gc2VyaWFsaXplU2NlbmUoc2NlbmUpO1xuICAgIGNvbnN0IGZyb20gPSB7IGxpbmU6IGxpbmVTdGFydCArIDEsIGNoOiAwIH07XG4gICAgY29uc3QgdG8gPSB7IGxpbmU6IGxpbmVFbmQsIGNoOiAwIH07XG4gICAgZWRpdG9yLnJlcGxhY2VSYW5nZShuZXdZYW1sLCBmcm9tLCB0byk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckVycm9yKGVsOiBIVE1MRWxlbWVudCwgZXJyOiB1bmtub3duKTogdm9pZCB7XG4gICAgY29uc3QgbXNnID0gZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFN0cmluZyhlcnIpO1xuICAgIGNvbnN0IHByZSA9IGVsLmNyZWF0ZUVsKFwicHJlXCIsIHsgY2xzOiBcImdlb21ldHJ5LWVycm9yXCIgfSk7XG4gICAgcHJlLnNldFRleHQoYEdlb21ldHJ5IEVycm9yOiAke21zZ31gKTtcbiAgfVxufVxuIiwgImNvbnN0IEFMSUFTID0gU3ltYm9sLmZvcigneWFtbC5hbGlhcycpO1xuY29uc3QgRE9DID0gU3ltYm9sLmZvcigneWFtbC5kb2N1bWVudCcpO1xuY29uc3QgTUFQID0gU3ltYm9sLmZvcigneWFtbC5tYXAnKTtcbmNvbnN0IFBBSVIgPSBTeW1ib2wuZm9yKCd5YW1sLnBhaXInKTtcbmNvbnN0IFNDQUxBUiA9IFN5bWJvbC5mb3IoJ3lhbWwuc2NhbGFyJyk7XG5jb25zdCBTRVEgPSBTeW1ib2wuZm9yKCd5YW1sLnNlcScpO1xuY29uc3QgTk9ERV9UWVBFID0gU3ltYm9sLmZvcigneWFtbC5ub2RlLnR5cGUnKTtcbmNvbnN0IGlzQWxpYXMgPSAobm9kZSkgPT4gISFub2RlICYmIHR5cGVvZiBub2RlID09PSAnb2JqZWN0JyAmJiBub2RlW05PREVfVFlQRV0gPT09IEFMSUFTO1xuY29uc3QgaXNEb2N1bWVudCA9IChub2RlKSA9PiAhIW5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmIG5vZGVbTk9ERV9UWVBFXSA9PT0gRE9DO1xuY29uc3QgaXNNYXAgPSAobm9kZSkgPT4gISFub2RlICYmIHR5cGVvZiBub2RlID09PSAnb2JqZWN0JyAmJiBub2RlW05PREVfVFlQRV0gPT09IE1BUDtcbmNvbnN0IGlzUGFpciA9IChub2RlKSA9PiAhIW5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmIG5vZGVbTk9ERV9UWVBFXSA9PT0gUEFJUjtcbmNvbnN0IGlzU2NhbGFyID0gKG5vZGUpID0+ICEhbm9kZSAmJiB0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcgJiYgbm9kZVtOT0RFX1RZUEVdID09PSBTQ0FMQVI7XG5jb25zdCBpc1NlcSA9IChub2RlKSA9PiAhIW5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmIG5vZGVbTk9ERV9UWVBFXSA9PT0gU0VRO1xuZnVuY3Rpb24gaXNDb2xsZWN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZSAmJiB0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcpXG4gICAgICAgIHN3aXRjaCAobm9kZVtOT0RFX1RZUEVdKSB7XG4gICAgICAgICAgICBjYXNlIE1BUDpcbiAgICAgICAgICAgIGNhc2UgU0VROlxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNOb2RlKG5vZGUpIHtcbiAgICBpZiAobm9kZSAmJiB0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcpXG4gICAgICAgIHN3aXRjaCAobm9kZVtOT0RFX1RZUEVdKSB7XG4gICAgICAgICAgICBjYXNlIEFMSUFTOlxuICAgICAgICAgICAgY2FzZSBNQVA6XG4gICAgICAgICAgICBjYXNlIFNDQUxBUjpcbiAgICAgICAgICAgIGNhc2UgU0VROlxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuY29uc3QgaGFzQW5jaG9yID0gKG5vZGUpID0+IChpc1NjYWxhcihub2RlKSB8fCBpc0NvbGxlY3Rpb24obm9kZSkpICYmICEhbm9kZS5hbmNob3I7XG5cbmV4cG9ydCB7IEFMSUFTLCBET0MsIE1BUCwgTk9ERV9UWVBFLCBQQUlSLCBTQ0FMQVIsIFNFUSwgaGFzQW5jaG9yLCBpc0FsaWFzLCBpc0NvbGxlY3Rpb24sIGlzRG9jdW1lbnQsIGlzTWFwLCBpc05vZGUsIGlzUGFpciwgaXNTY2FsYXIsIGlzU2VxIH07XG4iLCAiaW1wb3J0IHsgaXNEb2N1bWVudCwgaXNOb2RlLCBpc1BhaXIsIGlzQ29sbGVjdGlvbiwgaXNNYXAsIGlzU2VxLCBpc1NjYWxhciwgaXNBbGlhcyB9IGZyb20gJy4vbm9kZXMvaWRlbnRpdHkuanMnO1xuXG5jb25zdCBCUkVBSyA9IFN5bWJvbCgnYnJlYWsgdmlzaXQnKTtcbmNvbnN0IFNLSVAgPSBTeW1ib2woJ3NraXAgY2hpbGRyZW4nKTtcbmNvbnN0IFJFTU9WRSA9IFN5bWJvbCgncmVtb3ZlIG5vZGUnKTtcbi8qKlxuICogQXBwbHkgYSB2aXNpdG9yIHRvIGFuIEFTVCBub2RlIG9yIGRvY3VtZW50LlxuICpcbiAqIFdhbGtzIHRocm91Z2ggdGhlIHRyZWUgKGRlcHRoLWZpcnN0KSBzdGFydGluZyBmcm9tIGBub2RlYCwgY2FsbGluZyBhXG4gKiBgdmlzaXRvcmAgZnVuY3Rpb24gd2l0aCB0aHJlZSBhcmd1bWVudHM6XG4gKiAgIC0gYGtleWA6IEZvciBzZXF1ZW5jZSB2YWx1ZXMgYW5kIG1hcCBgUGFpcmAsIHRoZSBub2RlJ3MgaW5kZXggaW4gdGhlXG4gKiAgICAgY29sbGVjdGlvbi4gV2l0aGluIGEgYFBhaXJgLCBgJ2tleSdgIG9yIGAndmFsdWUnYCwgY29ycmVzcG9uZGluZ2x5LlxuICogICAgIGBudWxsYCBmb3IgdGhlIHJvb3Qgbm9kZS5cbiAqICAgLSBgbm9kZWA6IFRoZSBjdXJyZW50IG5vZGUuXG4gKiAgIC0gYHBhdGhgOiBUaGUgYW5jZXN0cnkgb2YgdGhlIGN1cnJlbnQgbm9kZS5cbiAqXG4gKiBUaGUgcmV0dXJuIHZhbHVlIG9mIHRoZSB2aXNpdG9yIG1heSBiZSB1c2VkIHRvIGNvbnRyb2wgdGhlIHRyYXZlcnNhbDpcbiAqICAgLSBgdW5kZWZpbmVkYCAoZGVmYXVsdCk6IERvIG5vdGhpbmcgYW5kIGNvbnRpbnVlXG4gKiAgIC0gYHZpc2l0LlNLSVBgOiBEbyBub3QgdmlzaXQgdGhlIGNoaWxkcmVuIG9mIHRoaXMgbm9kZSwgY29udGludWUgd2l0aCBuZXh0XG4gKiAgICAgc2libGluZ1xuICogICAtIGB2aXNpdC5CUkVBS2A6IFRlcm1pbmF0ZSB0cmF2ZXJzYWwgY29tcGxldGVseVxuICogICAtIGB2aXNpdC5SRU1PVkVgOiBSZW1vdmUgdGhlIGN1cnJlbnQgbm9kZSwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBuZXh0IG9uZVxuICogICAtIGBOb2RlYDogUmVwbGFjZSB0aGUgY3VycmVudCBub2RlLCB0aGVuIGNvbnRpbnVlIGJ5IHZpc2l0aW5nIGl0XG4gKiAgIC0gYG51bWJlcmA6IFdoaWxlIGl0ZXJhdGluZyB0aGUgaXRlbXMgb2YgYSBzZXF1ZW5jZSBvciBtYXAsIHNldCB0aGUgaW5kZXhcbiAqICAgICBvZiB0aGUgbmV4dCBzdGVwLiBUaGlzIGlzIHVzZWZ1bCBlc3BlY2lhbGx5IGlmIHRoZSBpbmRleCBvZiB0aGUgY3VycmVudFxuICogICAgIG5vZGUgaGFzIGNoYW5nZWQuXG4gKlxuICogSWYgYHZpc2l0b3JgIGlzIGEgc2luZ2xlIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIGFsbCB2YWx1ZXNcbiAqIGVuY291bnRlcmVkIGluIHRoZSB0cmVlLCBpbmNsdWRpbmcgZS5nLiBgbnVsbGAgdmFsdWVzLiBBbHRlcm5hdGl2ZWx5LFxuICogc2VwYXJhdGUgdmlzaXRvciBmdW5jdGlvbnMgbWF5IGJlIGRlZmluZWQgZm9yIGVhY2ggYE1hcGAsIGBQYWlyYCwgYFNlcWAsXG4gKiBgQWxpYXNgIGFuZCBgU2NhbGFyYCBub2RlLiBUbyBkZWZpbmUgdGhlIHNhbWUgdmlzaXRvciBmdW5jdGlvbiBmb3IgbW9yZSB0aGFuXG4gKiBvbmUgbm9kZSB0eXBlLCB1c2UgdGhlIGBDb2xsZWN0aW9uYCAobWFwIGFuZCBzZXEpLCBgVmFsdWVgIChtYXAsIHNlcSAmIHNjYWxhcilcbiAqIGFuZCBgTm9kZWAgKGFsaWFzLCBtYXAsIHNlcSAmIHNjYWxhcikgdGFyZ2V0cy4gT2YgYWxsIHRoZXNlLCBvbmx5IHRoZSBtb3N0XG4gKiBzcGVjaWZpYyBkZWZpbmVkIG9uZSB3aWxsIGJlIHVzZWQgZm9yIGVhY2ggbm9kZS5cbiAqL1xuZnVuY3Rpb24gdmlzaXQobm9kZSwgdmlzaXRvcikge1xuICAgIGNvbnN0IHZpc2l0b3JfID0gaW5pdFZpc2l0b3IodmlzaXRvcik7XG4gICAgaWYgKGlzRG9jdW1lbnQobm9kZSkpIHtcbiAgICAgICAgY29uc3QgY2QgPSB2aXNpdF8obnVsbCwgbm9kZS5jb250ZW50cywgdmlzaXRvcl8sIE9iamVjdC5mcmVlemUoW25vZGVdKSk7XG4gICAgICAgIGlmIChjZCA9PT0gUkVNT1ZFKVxuICAgICAgICAgICAgbm9kZS5jb250ZW50cyA9IG51bGw7XG4gICAgfVxuICAgIGVsc2VcbiAgICAgICAgdmlzaXRfKG51bGwsIG5vZGUsIHZpc2l0b3JfLCBPYmplY3QuZnJlZXplKFtdKSk7XG59XG4vLyBXaXRob3V0IHRoZSBgYXMgc3ltYm9sYCBjYXN0cywgVFMgZGVjbGFyZXMgdGhlc2UgaW4gdGhlIGB2aXNpdGBcbi8vIG5hbWVzcGFjZSB1c2luZyBgdmFyYCwgYnV0IHRoZW4gY29tcGxhaW5zIGFib3V0IHRoYXQgYmVjYXVzZVxuLy8gYHVuaXF1ZSBzeW1ib2xgIG11c3QgYmUgYGNvbnN0YC5cbi8qKiBUZXJtaW5hdGUgdmlzaXQgdHJhdmVyc2FsIGNvbXBsZXRlbHkgKi9cbnZpc2l0LkJSRUFLID0gQlJFQUs7XG4vKiogRG8gbm90IHZpc2l0IHRoZSBjaGlsZHJlbiBvZiB0aGUgY3VycmVudCBub2RlICovXG52aXNpdC5TS0lQID0gU0tJUDtcbi8qKiBSZW1vdmUgdGhlIGN1cnJlbnQgbm9kZSAqL1xudmlzaXQuUkVNT1ZFID0gUkVNT1ZFO1xuZnVuY3Rpb24gdmlzaXRfKGtleSwgbm9kZSwgdmlzaXRvciwgcGF0aCkge1xuICAgIGNvbnN0IGN0cmwgPSBjYWxsVmlzaXRvcihrZXksIG5vZGUsIHZpc2l0b3IsIHBhdGgpO1xuICAgIGlmIChpc05vZGUoY3RybCkgfHwgaXNQYWlyKGN0cmwpKSB7XG4gICAgICAgIHJlcGxhY2VOb2RlKGtleSwgcGF0aCwgY3RybCk7XG4gICAgICAgIHJldHVybiB2aXNpdF8oa2V5LCBjdHJsLCB2aXNpdG9yLCBwYXRoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjdHJsICE9PSAnc3ltYm9sJykge1xuICAgICAgICBpZiAoaXNDb2xsZWN0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgICBwYXRoID0gT2JqZWN0LmZyZWV6ZShwYXRoLmNvbmNhdChub2RlKSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuaXRlbXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaSA9IHZpc2l0XyhpLCBub2RlLml0ZW1zW2ldLCB2aXNpdG9yLCBwYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNpID09PSAnbnVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgaSA9IGNpIC0gMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaSA9PT0gQlJFQUspXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCUkVBSztcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaSA9PT0gUkVNT1ZFKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaXRlbXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBpIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzUGFpcihub2RlKSkge1xuICAgICAgICAgICAgcGF0aCA9IE9iamVjdC5mcmVlemUocGF0aC5jb25jYXQobm9kZSkpO1xuICAgICAgICAgICAgY29uc3QgY2sgPSB2aXNpdF8oJ2tleScsIG5vZGUua2V5LCB2aXNpdG9yLCBwYXRoKTtcbiAgICAgICAgICAgIGlmIChjayA9PT0gQlJFQUspXG4gICAgICAgICAgICAgICAgcmV0dXJuIEJSRUFLO1xuICAgICAgICAgICAgZWxzZSBpZiAoY2sgPT09IFJFTU9WRSlcbiAgICAgICAgICAgICAgICBub2RlLmtleSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCBjdiA9IHZpc2l0XygndmFsdWUnLCBub2RlLnZhbHVlLCB2aXNpdG9yLCBwYXRoKTtcbiAgICAgICAgICAgIGlmIChjdiA9PT0gQlJFQUspXG4gICAgICAgICAgICAgICAgcmV0dXJuIEJSRUFLO1xuICAgICAgICAgICAgZWxzZSBpZiAoY3YgPT09IFJFTU9WRSlcbiAgICAgICAgICAgICAgICBub2RlLnZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY3RybDtcbn1cbi8qKlxuICogQXBwbHkgYW4gYXN5bmMgdmlzaXRvciB0byBhbiBBU1Qgbm9kZSBvciBkb2N1bWVudC5cbiAqXG4gKiBXYWxrcyB0aHJvdWdoIHRoZSB0cmVlIChkZXB0aC1maXJzdCkgc3RhcnRpbmcgZnJvbSBgbm9kZWAsIGNhbGxpbmcgYVxuICogYHZpc2l0b3JgIGZ1bmN0aW9uIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICogICAtIGBrZXlgOiBGb3Igc2VxdWVuY2UgdmFsdWVzIGFuZCBtYXAgYFBhaXJgLCB0aGUgbm9kZSdzIGluZGV4IGluIHRoZVxuICogICAgIGNvbGxlY3Rpb24uIFdpdGhpbiBhIGBQYWlyYCwgYCdrZXknYCBvciBgJ3ZhbHVlJ2AsIGNvcnJlc3BvbmRpbmdseS5cbiAqICAgICBgbnVsbGAgZm9yIHRoZSByb290IG5vZGUuXG4gKiAgIC0gYG5vZGVgOiBUaGUgY3VycmVudCBub2RlLlxuICogICAtIGBwYXRoYDogVGhlIGFuY2VzdHJ5IG9mIHRoZSBjdXJyZW50IG5vZGUuXG4gKlxuICogVGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgdmlzaXRvciBtYXkgYmUgdXNlZCB0byBjb250cm9sIHRoZSB0cmF2ZXJzYWw6XG4gKiAgIC0gYFByb21pc2VgOiBNdXN0IHJlc29sdmUgdG8gb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzXG4gKiAgIC0gYHVuZGVmaW5lZGAgKGRlZmF1bHQpOiBEbyBub3RoaW5nIGFuZCBjb250aW51ZVxuICogICAtIGB2aXNpdC5TS0lQYDogRG8gbm90IHZpc2l0IHRoZSBjaGlsZHJlbiBvZiB0aGlzIG5vZGUsIGNvbnRpbnVlIHdpdGggbmV4dFxuICogICAgIHNpYmxpbmdcbiAqICAgLSBgdmlzaXQuQlJFQUtgOiBUZXJtaW5hdGUgdHJhdmVyc2FsIGNvbXBsZXRlbHlcbiAqICAgLSBgdmlzaXQuUkVNT1ZFYDogUmVtb3ZlIHRoZSBjdXJyZW50IG5vZGUsIHRoZW4gY29udGludWUgd2l0aCB0aGUgbmV4dCBvbmVcbiAqICAgLSBgTm9kZWA6IFJlcGxhY2UgdGhlIGN1cnJlbnQgbm9kZSwgdGhlbiBjb250aW51ZSBieSB2aXNpdGluZyBpdFxuICogICAtIGBudW1iZXJgOiBXaGlsZSBpdGVyYXRpbmcgdGhlIGl0ZW1zIG9mIGEgc2VxdWVuY2Ugb3IgbWFwLCBzZXQgdGhlIGluZGV4XG4gKiAgICAgb2YgdGhlIG5leHQgc3RlcC4gVGhpcyBpcyB1c2VmdWwgZXNwZWNpYWxseSBpZiB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnRcbiAqICAgICBub2RlIGhhcyBjaGFuZ2VkLlxuICpcbiAqIElmIGB2aXNpdG9yYCBpcyBhIHNpbmdsZSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBhbGwgdmFsdWVzXG4gKiBlbmNvdW50ZXJlZCBpbiB0aGUgdHJlZSwgaW5jbHVkaW5nIGUuZy4gYG51bGxgIHZhbHVlcy4gQWx0ZXJuYXRpdmVseSxcbiAqIHNlcGFyYXRlIHZpc2l0b3IgZnVuY3Rpb25zIG1heSBiZSBkZWZpbmVkIGZvciBlYWNoIGBNYXBgLCBgUGFpcmAsIGBTZXFgLFxuICogYEFsaWFzYCBhbmQgYFNjYWxhcmAgbm9kZS4gVG8gZGVmaW5lIHRoZSBzYW1lIHZpc2l0b3IgZnVuY3Rpb24gZm9yIG1vcmUgdGhhblxuICogb25lIG5vZGUgdHlwZSwgdXNlIHRoZSBgQ29sbGVjdGlvbmAgKG1hcCBhbmQgc2VxKSwgYFZhbHVlYCAobWFwLCBzZXEgJiBzY2FsYXIpXG4gKiBhbmQgYE5vZGVgIChhbGlhcywgbWFwLCBzZXEgJiBzY2FsYXIpIHRhcmdldHMuIE9mIGFsbCB0aGVzZSwgb25seSB0aGUgbW9zdFxuICogc3BlY2lmaWMgZGVmaW5lZCBvbmUgd2lsbCBiZSB1c2VkIGZvciBlYWNoIG5vZGUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHZpc2l0QXN5bmMobm9kZSwgdmlzaXRvcikge1xuICAgIGNvbnN0IHZpc2l0b3JfID0gaW5pdFZpc2l0b3IodmlzaXRvcik7XG4gICAgaWYgKGlzRG9jdW1lbnQobm9kZSkpIHtcbiAgICAgICAgY29uc3QgY2QgPSBhd2FpdCB2aXNpdEFzeW5jXyhudWxsLCBub2RlLmNvbnRlbnRzLCB2aXNpdG9yXywgT2JqZWN0LmZyZWV6ZShbbm9kZV0pKTtcbiAgICAgICAgaWYgKGNkID09PSBSRU1PVkUpXG4gICAgICAgICAgICBub2RlLmNvbnRlbnRzID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZVxuICAgICAgICBhd2FpdCB2aXNpdEFzeW5jXyhudWxsLCBub2RlLCB2aXNpdG9yXywgT2JqZWN0LmZyZWV6ZShbXSkpO1xufVxuLy8gV2l0aG91dCB0aGUgYGFzIHN5bWJvbGAgY2FzdHMsIFRTIGRlY2xhcmVzIHRoZXNlIGluIHRoZSBgdmlzaXRgXG4vLyBuYW1lc3BhY2UgdXNpbmcgYHZhcmAsIGJ1dCB0aGVuIGNvbXBsYWlucyBhYm91dCB0aGF0IGJlY2F1c2Vcbi8vIGB1bmlxdWUgc3ltYm9sYCBtdXN0IGJlIGBjb25zdGAuXG4vKiogVGVybWluYXRlIHZpc2l0IHRyYXZlcnNhbCBjb21wbGV0ZWx5ICovXG52aXNpdEFzeW5jLkJSRUFLID0gQlJFQUs7XG4vKiogRG8gbm90IHZpc2l0IHRoZSBjaGlsZHJlbiBvZiB0aGUgY3VycmVudCBub2RlICovXG52aXNpdEFzeW5jLlNLSVAgPSBTS0lQO1xuLyoqIFJlbW92ZSB0aGUgY3VycmVudCBub2RlICovXG52aXNpdEFzeW5jLlJFTU9WRSA9IFJFTU9WRTtcbmFzeW5jIGZ1bmN0aW9uIHZpc2l0QXN5bmNfKGtleSwgbm9kZSwgdmlzaXRvciwgcGF0aCkge1xuICAgIGNvbnN0IGN0cmwgPSBhd2FpdCBjYWxsVmlzaXRvcihrZXksIG5vZGUsIHZpc2l0b3IsIHBhdGgpO1xuICAgIGlmIChpc05vZGUoY3RybCkgfHwgaXNQYWlyKGN0cmwpKSB7XG4gICAgICAgIHJlcGxhY2VOb2RlKGtleSwgcGF0aCwgY3RybCk7XG4gICAgICAgIHJldHVybiB2aXNpdEFzeW5jXyhrZXksIGN0cmwsIHZpc2l0b3IsIHBhdGgpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGN0cmwgIT09ICdzeW1ib2wnKSB7XG4gICAgICAgIGlmIChpc0NvbGxlY3Rpb24obm9kZSkpIHtcbiAgICAgICAgICAgIHBhdGggPSBPYmplY3QuZnJlZXplKHBhdGguY29uY2F0KG5vZGUpKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5pdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNpID0gYXdhaXQgdmlzaXRBc3luY18oaSwgbm9kZS5pdGVtc1tpXSwgdmlzaXRvciwgcGF0aCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjaSA9PT0gJ251bWJlcicpXG4gICAgICAgICAgICAgICAgICAgIGkgPSBjaSAtIDE7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2kgPT09IEJSRUFLKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQlJFQUs7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2kgPT09IFJFTU9WRSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLml0ZW1zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1BhaXIobm9kZSkpIHtcbiAgICAgICAgICAgIHBhdGggPSBPYmplY3QuZnJlZXplKHBhdGguY29uY2F0KG5vZGUpKTtcbiAgICAgICAgICAgIGNvbnN0IGNrID0gYXdhaXQgdmlzaXRBc3luY18oJ2tleScsIG5vZGUua2V5LCB2aXNpdG9yLCBwYXRoKTtcbiAgICAgICAgICAgIGlmIChjayA9PT0gQlJFQUspXG4gICAgICAgICAgICAgICAgcmV0dXJuIEJSRUFLO1xuICAgICAgICAgICAgZWxzZSBpZiAoY2sgPT09IFJFTU9WRSlcbiAgICAgICAgICAgICAgICBub2RlLmtleSA9IG51bGw7XG4gICAgICAgICAgICBjb25zdCBjdiA9IGF3YWl0IHZpc2l0QXN5bmNfKCd2YWx1ZScsIG5vZGUudmFsdWUsIHZpc2l0b3IsIHBhdGgpO1xuICAgICAgICAgICAgaWYgKGN2ID09PSBCUkVBSylcbiAgICAgICAgICAgICAgICByZXR1cm4gQlJFQUs7XG4gICAgICAgICAgICBlbHNlIGlmIChjdiA9PT0gUkVNT1ZFKVxuICAgICAgICAgICAgICAgIG5vZGUudmFsdWUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjdHJsO1xufVxuZnVuY3Rpb24gaW5pdFZpc2l0b3IodmlzaXRvcikge1xuICAgIGlmICh0eXBlb2YgdmlzaXRvciA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgKHZpc2l0b3IuQ29sbGVjdGlvbiB8fCB2aXNpdG9yLk5vZGUgfHwgdmlzaXRvci5WYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgQWxpYXM6IHZpc2l0b3IuTm9kZSxcbiAgICAgICAgICAgIE1hcDogdmlzaXRvci5Ob2RlLFxuICAgICAgICAgICAgU2NhbGFyOiB2aXNpdG9yLk5vZGUsXG4gICAgICAgICAgICBTZXE6IHZpc2l0b3IuTm9kZVxuICAgICAgICB9LCB2aXNpdG9yLlZhbHVlICYmIHtcbiAgICAgICAgICAgIE1hcDogdmlzaXRvci5WYWx1ZSxcbiAgICAgICAgICAgIFNjYWxhcjogdmlzaXRvci5WYWx1ZSxcbiAgICAgICAgICAgIFNlcTogdmlzaXRvci5WYWx1ZVxuICAgICAgICB9LCB2aXNpdG9yLkNvbGxlY3Rpb24gJiYge1xuICAgICAgICAgICAgTWFwOiB2aXNpdG9yLkNvbGxlY3Rpb24sXG4gICAgICAgICAgICBTZXE6IHZpc2l0b3IuQ29sbGVjdGlvblxuICAgICAgICB9LCB2aXNpdG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIHZpc2l0b3I7XG59XG5mdW5jdGlvbiBjYWxsVmlzaXRvcihrZXksIG5vZGUsIHZpc2l0b3IsIHBhdGgpIHtcbiAgICBpZiAodHlwZW9mIHZpc2l0b3IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHJldHVybiB2aXNpdG9yKGtleSwgbm9kZSwgcGF0aCk7XG4gICAgaWYgKGlzTWFwKG5vZGUpKVxuICAgICAgICByZXR1cm4gdmlzaXRvci5NYXA/LihrZXksIG5vZGUsIHBhdGgpO1xuICAgIGlmIChpc1NlcShub2RlKSlcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IuU2VxPy4oa2V5LCBub2RlLCBwYXRoKTtcbiAgICBpZiAoaXNQYWlyKG5vZGUpKVxuICAgICAgICByZXR1cm4gdmlzaXRvci5QYWlyPy4oa2V5LCBub2RlLCBwYXRoKTtcbiAgICBpZiAoaXNTY2FsYXIobm9kZSkpXG4gICAgICAgIHJldHVybiB2aXNpdG9yLlNjYWxhcj8uKGtleSwgbm9kZSwgcGF0aCk7XG4gICAgaWYgKGlzQWxpYXMobm9kZSkpXG4gICAgICAgIHJldHVybiB2aXNpdG9yLkFsaWFzPy4oa2V5LCBub2RlLCBwYXRoKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gcmVwbGFjZU5vZGUoa2V5LCBwYXRoLCBub2RlKSB7XG4gICAgY29uc3QgcGFyZW50ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdO1xuICAgIGlmIChpc0NvbGxlY3Rpb24ocGFyZW50KSkge1xuICAgICAgICBwYXJlbnQuaXRlbXNba2V5XSA9IG5vZGU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUGFpcihwYXJlbnQpKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdrZXknKVxuICAgICAgICAgICAgcGFyZW50LmtleSA9IG5vZGU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhcmVudC52YWx1ZSA9IG5vZGU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzRG9jdW1lbnQocGFyZW50KSkge1xuICAgICAgICBwYXJlbnQuY29udGVudHMgPSBub2RlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgcHQgPSBpc0FsaWFzKHBhcmVudCkgPyAnYWxpYXMnIDogJ3NjYWxhcic7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHJlcGxhY2Ugbm9kZSB3aXRoICR7cHR9IHBhcmVudGApO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgdmlzaXQsIHZpc2l0QXN5bmMgfTtcbiIsICJpbXBvcnQgeyBpc05vZGUgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyB2aXNpdCB9IGZyb20gJy4uL3Zpc2l0LmpzJztcblxuY29uc3QgZXNjYXBlQ2hhcnMgPSB7XG4gICAgJyEnOiAnJTIxJyxcbiAgICAnLCc6ICclMkMnLFxuICAgICdbJzogJyU1QicsXG4gICAgJ10nOiAnJTVEJyxcbiAgICAneyc6ICclN0InLFxuICAgICd9JzogJyU3RCdcbn07XG5jb25zdCBlc2NhcGVUYWdOYW1lID0gKHRuKSA9PiB0bi5yZXBsYWNlKC9bISxbXFxde31dL2csIGNoID0+IGVzY2FwZUNoYXJzW2NoXSk7XG5jbGFzcyBEaXJlY3RpdmVzIHtcbiAgICBjb25zdHJ1Y3Rvcih5YW1sLCB0YWdzKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZGlyZWN0aXZlcy1lbmQvZG9jLXN0YXJ0IG1hcmtlciBgLS0tYC4gSWYgYG51bGxgLCBhIG1hcmtlciBtYXkgc3RpbGwgYmVcbiAgICAgICAgICogaW5jbHVkZWQgaW4gdGhlIGRvY3VtZW50J3Mgc3RyaW5naWZpZWQgcmVwcmVzZW50YXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRvY1N0YXJ0ID0gbnVsbDtcbiAgICAgICAgLyoqIFRoZSBkb2MtZW5kIG1hcmtlciBgLi4uYC4gICovXG4gICAgICAgIHRoaXMuZG9jRW5kID0gZmFsc2U7XG4gICAgICAgIHRoaXMueWFtbCA9IE9iamVjdC5hc3NpZ24oe30sIERpcmVjdGl2ZXMuZGVmYXVsdFlhbWwsIHlhbWwpO1xuICAgICAgICB0aGlzLnRhZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBEaXJlY3RpdmVzLmRlZmF1bHRUYWdzLCB0YWdzKTtcbiAgICB9XG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBuZXcgRGlyZWN0aXZlcyh0aGlzLnlhbWwsIHRoaXMudGFncyk7XG4gICAgICAgIGNvcHkuZG9jU3RhcnQgPSB0aGlzLmRvY1N0YXJ0O1xuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRHVyaW5nIHBhcnNpbmcsIGdldCBhIERpcmVjdGl2ZXMgaW5zdGFuY2UgZm9yIHRoZSBjdXJyZW50IGRvY3VtZW50IGFuZFxuICAgICAqIHVwZGF0ZSB0aGUgc3RyZWFtIHN0YXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCB2ZXJzaW9uJ3Mgc3BlYy5cbiAgICAgKi9cbiAgICBhdERvY3VtZW50KCkge1xuICAgICAgICBjb25zdCByZXMgPSBuZXcgRGlyZWN0aXZlcyh0aGlzLnlhbWwsIHRoaXMudGFncyk7XG4gICAgICAgIHN3aXRjaCAodGhpcy55YW1sLnZlcnNpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJzEuMSc6XG4gICAgICAgICAgICAgICAgdGhpcy5hdE5leHREb2N1bWVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcxLjInOlxuICAgICAgICAgICAgICAgIHRoaXMuYXROZXh0RG9jdW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnlhbWwgPSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cGxpY2l0OiBEaXJlY3RpdmVzLmRlZmF1bHRZYW1sLmV4cGxpY2l0LFxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiAnMS4yJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy50YWdzID0gT2JqZWN0LmFzc2lnbih7fSwgRGlyZWN0aXZlcy5kZWZhdWx0VGFncyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIG9uRXJyb3IgLSBNYXkgYmUgY2FsbGVkIGV2ZW4gaWYgdGhlIGFjdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgICAqIEByZXR1cm5zIGB0cnVlYCBvbiBzdWNjZXNzXG4gICAgICovXG4gICAgYWRkKGxpbmUsIG9uRXJyb3IpIHtcbiAgICAgICAgaWYgKHRoaXMuYXROZXh0RG9jdW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMueWFtbCA9IHsgZXhwbGljaXQ6IERpcmVjdGl2ZXMuZGVmYXVsdFlhbWwuZXhwbGljaXQsIHZlcnNpb246ICcxLjEnIH07XG4gICAgICAgICAgICB0aGlzLnRhZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBEaXJlY3RpdmVzLmRlZmF1bHRUYWdzKTtcbiAgICAgICAgICAgIHRoaXMuYXROZXh0RG9jdW1lbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXJ0cyA9IGxpbmUudHJpbSgpLnNwbGl0KC9bIFxcdF0rLyk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBwYXJ0cy5zaGlmdCgpO1xuICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJyVUQUcnOiB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gMikge1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKDAsICclVEFHIGRpcmVjdGl2ZSBzaG91bGQgY29udGFpbiBleGFjdGx5IHR3byBwYXJ0cycpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoIDwgMilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgW2hhbmRsZSwgcHJlZml4XSA9IHBhcnRzO1xuICAgICAgICAgICAgICAgIHRoaXMudGFnc1toYW5kbGVdID0gcHJlZml4O1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnJVlBTUwnOiB7XG4gICAgICAgICAgICAgICAgdGhpcy55YW1sLmV4cGxpY2l0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoMCwgJyVZQU1MIGRpcmVjdGl2ZSBzaG91bGQgY29udGFpbiBleGFjdGx5IG9uZSBwYXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgW3ZlcnNpb25dID0gcGFydHM7XG4gICAgICAgICAgICAgICAgaWYgKHZlcnNpb24gPT09ICcxLjEnIHx8IHZlcnNpb24gPT09ICcxLjInKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMueWFtbC52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gL15cXGQrXFwuXFxkKyQvLnRlc3QodmVyc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoNiwgYFVuc3VwcG9ydGVkIFlBTUwgdmVyc2lvbiAke3ZlcnNpb259YCwgaXNWYWxpZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG9uRXJyb3IoMCwgYFVua25vd24gZGlyZWN0aXZlICR7bmFtZX1gLCB0cnVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgYSB0YWcsIG1hdGNoaW5nIGhhbmRsZXMgdG8gdGhvc2UgZGVmaW5lZCBpbiAlVEFHIGRpcmVjdGl2ZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBSZXNvbHZlZCB0YWcsIHdoaWNoIG1heSBhbHNvIGJlIHRoZSBub24tc3BlY2lmaWMgdGFnIGAnISdgIG9yIGFcbiAgICAgKiAgIGAnIWxvY2FsJ2AgdGFnLCBvciBgbnVsbGAgaWYgdW5yZXNvbHZhYmxlLlxuICAgICAqL1xuICAgIHRhZ05hbWUoc291cmNlLCBvbkVycm9yKSB7XG4gICAgICAgIGlmIChzb3VyY2UgPT09ICchJylcbiAgICAgICAgICAgIHJldHVybiAnISc7IC8vIG5vbi1zcGVjaWZpYyB0YWdcbiAgICAgICAgaWYgKHNvdXJjZVswXSAhPT0gJyEnKSB7XG4gICAgICAgICAgICBvbkVycm9yKGBOb3QgYSB2YWxpZCB0YWc6ICR7c291cmNlfWApO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNvdXJjZVsxXSA9PT0gJzwnKSB7XG4gICAgICAgICAgICBjb25zdCB2ZXJiYXRpbSA9IHNvdXJjZS5zbGljZSgyLCAtMSk7XG4gICAgICAgICAgICBpZiAodmVyYmF0aW0gPT09ICchJyB8fCB2ZXJiYXRpbSA9PT0gJyEhJykge1xuICAgICAgICAgICAgICAgIG9uRXJyb3IoYFZlcmJhdGltIHRhZ3MgYXJlbid0IHJlc29sdmVkLCBzbyAke3NvdXJjZX0gaXMgaW52YWxpZC5gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzb3VyY2Vbc291cmNlLmxlbmd0aCAtIDFdICE9PSAnPicpXG4gICAgICAgICAgICAgICAgb25FcnJvcignVmVyYmF0aW0gdGFncyBtdXN0IGVuZCB3aXRoIGEgPicpO1xuICAgICAgICAgICAgcmV0dXJuIHZlcmJhdGltO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFssIGhhbmRsZSwgc3VmZml4XSA9IHNvdXJjZS5tYXRjaCgvXiguKiEpKFteIV0qKSQvcyk7XG4gICAgICAgIGlmICghc3VmZml4KVxuICAgICAgICAgICAgb25FcnJvcihgVGhlICR7c291cmNlfSB0YWcgaGFzIG5vIHN1ZmZpeGApO1xuICAgICAgICBjb25zdCBwcmVmaXggPSB0aGlzLnRhZ3NbaGFuZGxlXTtcbiAgICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgZGVjb2RlVVJJQ29tcG9uZW50KHN1ZmZpeCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBvbkVycm9yKFN0cmluZyhlcnJvcikpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChoYW5kbGUgPT09ICchJylcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7IC8vIGxvY2FsIHRhZ1xuICAgICAgICBvbkVycm9yKGBDb3VsZCBub3QgcmVzb2x2ZSB0YWc6ICR7c291cmNlfWApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSBmdWxseSByZXNvbHZlZCB0YWcsIHJldHVybnMgaXRzIHByaW50YWJsZSBzdHJpbmcgZm9ybSxcbiAgICAgKiB0YWtpbmcgaW50byBhY2NvdW50IGN1cnJlbnQgdGFnIHByZWZpeGVzIGFuZCBkZWZhdWx0cy5cbiAgICAgKi9cbiAgICB0YWdTdHJpbmcodGFnKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2hhbmRsZSwgcHJlZml4XSBvZiBPYmplY3QuZW50cmllcyh0aGlzLnRhZ3MpKSB7XG4gICAgICAgICAgICBpZiAodGFnLnN0YXJ0c1dpdGgocHJlZml4KSlcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlICsgZXNjYXBlVGFnTmFtZSh0YWcuc3Vic3RyaW5nKHByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFnWzBdID09PSAnIScgPyB0YWcgOiBgITwke3RhZ30+YDtcbiAgICB9XG4gICAgdG9TdHJpbmcoZG9jKSB7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy55YW1sLmV4cGxpY2l0XG4gICAgICAgICAgICA/IFtgJVlBTUwgJHt0aGlzLnlhbWwudmVyc2lvbiB8fCAnMS4yJ31gXVxuICAgICAgICAgICAgOiBbXTtcbiAgICAgICAgY29uc3QgdGFnRW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMudGFncyk7XG4gICAgICAgIGxldCB0YWdOYW1lcztcbiAgICAgICAgaWYgKGRvYyAmJiB0YWdFbnRyaWVzLmxlbmd0aCA+IDAgJiYgaXNOb2RlKGRvYy5jb250ZW50cykpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhZ3MgPSB7fTtcbiAgICAgICAgICAgIHZpc2l0KGRvYy5jb250ZW50cywgKF9rZXksIG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNOb2RlKG5vZGUpICYmIG5vZGUudGFnKVxuICAgICAgICAgICAgICAgICAgICB0YWdzW25vZGUudGFnXSA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRhZ05hbWVzID0gT2JqZWN0LmtleXModGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGFnTmFtZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBbaGFuZGxlLCBwcmVmaXhdIG9mIHRhZ0VudHJpZXMpIHtcbiAgICAgICAgICAgIGlmIChoYW5kbGUgPT09ICchIScgJiYgcHJlZml4ID09PSAndGFnOnlhbWwub3JnLDIwMDI6JylcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICghZG9jIHx8IHRhZ05hbWVzLnNvbWUodG4gPT4gdG4uc3RhcnRzV2l0aChwcmVmaXgpKSlcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGAlVEFHICR7aGFuZGxlfSAke3ByZWZpeH1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG4gICAgfVxufVxuRGlyZWN0aXZlcy5kZWZhdWx0WWFtbCA9IHsgZXhwbGljaXQ6IGZhbHNlLCB2ZXJzaW9uOiAnMS4yJyB9O1xuRGlyZWN0aXZlcy5kZWZhdWx0VGFncyA9IHsgJyEhJzogJ3RhZzp5YW1sLm9yZywyMDAyOicgfTtcblxuZXhwb3J0IHsgRGlyZWN0aXZlcyB9O1xuIiwgImltcG9ydCB7IGlzU2NhbGFyLCBpc0NvbGxlY3Rpb24gfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyB2aXNpdCB9IGZyb20gJy4uL3Zpc2l0LmpzJztcblxuLyoqXG4gKiBWZXJpZnkgdGhhdCB0aGUgaW5wdXQgc3RyaW5nIGlzIGEgdmFsaWQgYW5jaG9yLlxuICpcbiAqIFdpbGwgdGhyb3cgb24gZXJyb3JzLlxuICovXG5mdW5jdGlvbiBhbmNob3JJc1ZhbGlkKGFuY2hvcikge1xuICAgIGlmICgvW1xceDAwLVxceDE5XFxzLFtcXF17fV0vLnRlc3QoYW5jaG9yKSkge1xuICAgICAgICBjb25zdCBzYSA9IEpTT04uc3RyaW5naWZ5KGFuY2hvcik7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBBbmNob3IgbXVzdCBub3QgY29udGFpbiB3aGl0ZXNwYWNlIG9yIGNvbnRyb2wgY2hhcmFjdGVyczogJHtzYX1gO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBhbmNob3JOYW1lcyhyb290KSB7XG4gICAgY29uc3QgYW5jaG9ycyA9IG5ldyBTZXQoKTtcbiAgICB2aXNpdChyb290LCB7XG4gICAgICAgIFZhbHVlKF9rZXksIG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChub2RlLmFuY2hvcilcbiAgICAgICAgICAgICAgICBhbmNob3JzLmFkZChub2RlLmFuY2hvcik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYW5jaG9ycztcbn1cbi8qKiBGaW5kIGEgbmV3IGFuY2hvciBuYW1lIHdpdGggdGhlIGdpdmVuIGBwcmVmaXhgIGFuZCBhIG9uZS1pbmRleGVkIHN1ZmZpeC4gKi9cbmZ1bmN0aW9uIGZpbmROZXdBbmNob3IocHJlZml4LCBleGNsdWRlKSB7XG4gICAgZm9yIChsZXQgaSA9IDE7IHRydWU7ICsraSkge1xuICAgICAgICBjb25zdCBuYW1lID0gYCR7cHJlZml4fSR7aX1gO1xuICAgICAgICBpZiAoIWV4Y2x1ZGUuaGFzKG5hbWUpKVxuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlTm9kZUFuY2hvcnMoZG9jLCBwcmVmaXgpIHtcbiAgICBjb25zdCBhbGlhc09iamVjdHMgPSBbXTtcbiAgICBjb25zdCBzb3VyY2VPYmplY3RzID0gbmV3IE1hcCgpO1xuICAgIGxldCBwcmV2QW5jaG9ycyA9IG51bGw7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgb25BbmNob3I6IChzb3VyY2UpID0+IHtcbiAgICAgICAgICAgIGFsaWFzT2JqZWN0cy5wdXNoKHNvdXJjZSk7XG4gICAgICAgICAgICBwcmV2QW5jaG9ycyA/PyAocHJldkFuY2hvcnMgPSBhbmNob3JOYW1lcyhkb2MpKTtcbiAgICAgICAgICAgIGNvbnN0IGFuY2hvciA9IGZpbmROZXdBbmNob3IocHJlZml4LCBwcmV2QW5jaG9ycyk7XG4gICAgICAgICAgICBwcmV2QW5jaG9ycy5hZGQoYW5jaG9yKTtcbiAgICAgICAgICAgIHJldHVybiBhbmNob3I7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaXRoIGNpcmN1bGFyIHJlZmVyZW5jZXMsIHRoZSBzb3VyY2Ugbm9kZSBpcyBvbmx5IHJlc29sdmVkIGFmdGVyIGFsbFxuICAgICAgICAgKiBvZiBpdHMgY2hpbGQgbm9kZXMgYXJlLiBUaGlzIGlzIHdoeSBhbmNob3JzIGFyZSBzZXQgb25seSBhZnRlciBhbGwgb2ZcbiAgICAgICAgICogdGhlIG5vZGVzIGhhdmUgYmVlbiBjcmVhdGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0QW5jaG9yczogKCkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBzb3VyY2Ugb2YgYWxpYXNPYmplY3RzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVmID0gc291cmNlT2JqZWN0cy5nZXQoc291cmNlKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlZiA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAgICAgcmVmLmFuY2hvciAmJlxuICAgICAgICAgICAgICAgICAgICAoaXNTY2FsYXIocmVmLm5vZGUpIHx8IGlzQ29sbGVjdGlvbihyZWYubm9kZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlZi5ub2RlLmFuY2hvciA9IHJlZi5hbmNob3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignRmFpbGVkIHRvIHJlc29sdmUgcmVwZWF0ZWQgb2JqZWN0ICh0aGlzIHNob3VsZCBub3QgaGFwcGVuKScpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvci5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc291cmNlT2JqZWN0c1xuICAgIH07XG59XG5cbmV4cG9ydCB7IGFuY2hvcklzVmFsaWQsIGFuY2hvck5hbWVzLCBjcmVhdGVOb2RlQW5jaG9ycywgZmluZE5ld0FuY2hvciB9O1xuIiwgIi8qKlxuICogQXBwbGllcyB0aGUgSlNPTi5wYXJzZSByZXZpdmVyIGFsZ29yaXRobSBhcyBkZWZpbmVkIGluIHRoZSBFQ01BLTI2MiBzcGVjLFxuICogaW4gc2VjdGlvbiAyNC41LjEuMSBcIlJ1bnRpbWUgU2VtYW50aWNzOiBJbnRlcm5hbGl6ZUpTT05Qcm9wZXJ0eVwiIG9mIHRoZVxuICogMjAyMSBlZGl0aW9uOiBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWpzb24ucGFyc2VcbiAqXG4gKiBJbmNsdWRlcyBleHRlbnNpb25zIGZvciBoYW5kbGluZyBNYXAgYW5kIFNldCBvYmplY3RzLlxuICovXG5mdW5jdGlvbiBhcHBseVJldml2ZXIocmV2aXZlciwgb2JqLCBrZXksIHZhbCkge1xuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHZhbC5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYwID0gdmFsW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IHYxID0gYXBwbHlSZXZpdmVyKHJldml2ZXIsIHZhbCwgU3RyaW5nKGkpLCB2MCk7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1hcnJheS1kZWxldGVcbiAgICAgICAgICAgICAgICBpZiAodjEgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbFtpXTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2MSAhPT0gdjApXG4gICAgICAgICAgICAgICAgICAgIHZhbFtpXSA9IHYxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbCBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIEFycmF5LmZyb20odmFsLmtleXMoKSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2MCA9IHZhbC5nZXQoayk7XG4gICAgICAgICAgICAgICAgY29uc3QgdjEgPSBhcHBseVJldml2ZXIocmV2aXZlciwgdmFsLCBrLCB2MCk7XG4gICAgICAgICAgICAgICAgaWYgKHYxID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHZhbC5kZWxldGUoayk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodjEgIT09IHYwKVxuICAgICAgICAgICAgICAgICAgICB2YWwuc2V0KGssIHYxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWwgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdjAgb2YgQXJyYXkuZnJvbSh2YWwpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdjEgPSBhcHBseVJldml2ZXIocmV2aXZlciwgdmFsLCB2MCwgdjApO1xuICAgICAgICAgICAgICAgIGlmICh2MSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB2YWwuZGVsZXRlKHYwKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2MSAhPT0gdjApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsLmRlbGV0ZSh2MCk7XG4gICAgICAgICAgICAgICAgICAgIHZhbC5hZGQodjEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2ssIHYwXSBvZiBPYmplY3QuZW50cmllcyh2YWwpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdjEgPSBhcHBseVJldml2ZXIocmV2aXZlciwgdmFsLCBrLCB2MCk7XG4gICAgICAgICAgICAgICAgaWYgKHYxID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWxba107XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodjEgIT09IHYwKVxuICAgICAgICAgICAgICAgICAgICB2YWxba10gPSB2MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV2aXZlci5jYWxsKG9iaiwga2V5LCB2YWwpO1xufVxuXG5leHBvcnQgeyBhcHBseVJldml2ZXIgfTtcbiIsICJpbXBvcnQgeyBoYXNBbmNob3IgfSBmcm9tICcuL2lkZW50aXR5LmpzJztcblxuLyoqXG4gKiBSZWN1cnNpdmVseSBjb252ZXJ0IGFueSBub2RlIG9yIGl0cyBjb250ZW50cyB0byBuYXRpdmUgSmF2YVNjcmlwdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIFRoZSBpbnB1dCB2YWx1ZVxuICogQHBhcmFtIGFyZyAtIElmIGB2YWx1ZWAgZGVmaW5lcyBhIGB0b0pTT04oKWAgbWV0aG9kLCB1c2UgdGhpc1xuICogICBhcyBpdHMgZmlyc3QgYXJndW1lbnRcbiAqIEBwYXJhbSBjdHggLSBDb252ZXJzaW9uIGNvbnRleHQsIG9yaWdpbmFsbHkgc2V0IGluIERvY3VtZW50I3RvSlMoKS4gSWZcbiAqICAgYHsga2VlcDogdHJ1ZSB9YCBpcyBub3Qgc2V0LCBvdXRwdXQgc2hvdWxkIGJlIHN1aXRhYmxlIGZvciBKU09OXG4gKiAgIHN0cmluZ2lmaWNhdGlvbi5cbiAqL1xuZnVuY3Rpb24gdG9KUyh2YWx1ZSwgYXJnLCBjdHgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1yZXR1cm5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpXG4gICAgICAgIHJldHVybiB2YWx1ZS5tYXAoKHYsIGkpID0+IHRvSlModiwgU3RyaW5nKGkpLCBjdHgpKTtcbiAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1jYWxsXG4gICAgICAgIGlmICghY3R4IHx8ICFoYXNBbmNob3IodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvSlNPTihhcmcsIGN0eCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7IGFsaWFzQ291bnQ6IDAsIGNvdW50OiAxLCByZXM6IHVuZGVmaW5lZCB9O1xuICAgICAgICBjdHguYW5jaG9ycy5zZXQodmFsdWUsIGRhdGEpO1xuICAgICAgICBjdHgub25DcmVhdGUgPSByZXMgPT4ge1xuICAgICAgICAgICAgZGF0YS5yZXMgPSByZXM7XG4gICAgICAgICAgICBkZWxldGUgY3R4Lm9uQ3JlYXRlO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXMgPSB2YWx1ZS50b0pTT04oYXJnLCBjdHgpO1xuICAgICAgICBpZiAoY3R4Lm9uQ3JlYXRlKVxuICAgICAgICAgICAgY3R4Lm9uQ3JlYXRlKHJlcyk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdiaWdpbnQnICYmICFjdHg/LmtlZXApXG4gICAgICAgIHJldHVybiBOdW1iZXIodmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IHsgdG9KUyB9O1xuIiwgImltcG9ydCB7IGFwcGx5UmV2aXZlciB9IGZyb20gJy4uL2RvYy9hcHBseVJldml2ZXIuanMnO1xuaW1wb3J0IHsgTk9ERV9UWVBFLCBpc0RvY3VtZW50IH0gZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyB0b0pTIH0gZnJvbSAnLi90b0pTLmpzJztcblxuY2xhc3MgTm9kZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIE5PREVfVFlQRSwgeyB2YWx1ZTogdHlwZSB9KTtcbiAgICB9XG4gICAgLyoqIENyZWF0ZSBhIGNvcHkgb2YgdGhpcyBub2RlLiAgKi9cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY29weSA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh0aGlzKSk7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlKVxuICAgICAgICAgICAgY29weS5yYW5nZSA9IHRoaXMucmFuZ2Uuc2xpY2UoKTtcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxuICAgIC8qKiBBIHBsYWluIEphdmFTY3JpcHQgcmVwcmVzZW50YXRpb24gb2YgdGhpcyBub2RlLiAqL1xuICAgIHRvSlMoZG9jLCB7IG1hcEFzTWFwLCBtYXhBbGlhc0NvdW50LCBvbkFuY2hvciwgcmV2aXZlciB9ID0ge30pIHtcbiAgICAgICAgaWYgKCFpc0RvY3VtZW50KGRvYykpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIGRvY3VtZW50IGFyZ3VtZW50IGlzIHJlcXVpcmVkJyk7XG4gICAgICAgIGNvbnN0IGN0eCA9IHtcbiAgICAgICAgICAgIGFuY2hvcnM6IG5ldyBNYXAoKSxcbiAgICAgICAgICAgIGRvYyxcbiAgICAgICAgICAgIGtlZXA6IHRydWUsXG4gICAgICAgICAgICBtYXBBc01hcDogbWFwQXNNYXAgPT09IHRydWUsXG4gICAgICAgICAgICBtYXBLZXlXYXJuZWQ6IGZhbHNlLFxuICAgICAgICAgICAgbWF4QWxpYXNDb3VudDogdHlwZW9mIG1heEFsaWFzQ291bnQgPT09ICdudW1iZXInID8gbWF4QWxpYXNDb3VudCA6IDEwMFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXMgPSB0b0pTKHRoaXMsICcnLCBjdHgpO1xuICAgICAgICBpZiAodHlwZW9mIG9uQW5jaG9yID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgZm9yIChjb25zdCB7IGNvdW50LCByZXMgfSBvZiBjdHguYW5jaG9ycy52YWx1ZXMoKSlcbiAgICAgICAgICAgICAgICBvbkFuY2hvcihyZXMsIGNvdW50KTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiByZXZpdmVyID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICA/IGFwcGx5UmV2aXZlcihyZXZpdmVyLCB7ICcnOiByZXMgfSwgJycsIHJlcylcbiAgICAgICAgICAgIDogcmVzO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgTm9kZUJhc2UgfTtcbiIsICJpbXBvcnQgeyBhbmNob3JJc1ZhbGlkIH0gZnJvbSAnLi4vZG9jL2FuY2hvcnMuanMnO1xuaW1wb3J0IHsgdmlzaXQgfSBmcm9tICcuLi92aXNpdC5qcyc7XG5pbXBvcnQgeyBBTElBUywgaXNBbGlhcywgaXNDb2xsZWN0aW9uLCBpc1BhaXIsIGhhc0FuY2hvciB9IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgTm9kZUJhc2UgfSBmcm9tICcuL05vZGUuanMnO1xuaW1wb3J0IHsgdG9KUyB9IGZyb20gJy4vdG9KUy5qcyc7XG5cbmNsYXNzIEFsaWFzIGV4dGVuZHMgTm9kZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuICAgICAgICBzdXBlcihBTElBUyk7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3RhZycsIHtcbiAgICAgICAgICAgIHNldCgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FsaWFzIG5vZGVzIGNhbm5vdCBoYXZlIHRhZ3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlc29sdmUgdGhlIHZhbHVlIG9mIHRoaXMgYWxpYXMgd2l0aGluIGBkb2NgLCBmaW5kaW5nIHRoZSBsYXN0XG4gICAgICogaW5zdGFuY2Ugb2YgdGhlIGBzb3VyY2VgIGFuY2hvciBiZWZvcmUgdGhpcyBub2RlLlxuICAgICAqL1xuICAgIHJlc29sdmUoZG9jLCBjdHgpIHtcbiAgICAgICAgbGV0IG5vZGVzO1xuICAgICAgICBpZiAoY3R4Py5hbGlhc1Jlc29sdmVDYWNoZSkge1xuICAgICAgICAgICAgbm9kZXMgPSBjdHguYWxpYXNSZXNvbHZlQ2FjaGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBub2RlcyA9IFtdO1xuICAgICAgICAgICAgdmlzaXQoZG9jLCB7XG4gICAgICAgICAgICAgICAgTm9kZTogKF9rZXksIG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQWxpYXMobm9kZSkgfHwgaGFzQW5jaG9yKG5vZGUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChjdHgpXG4gICAgICAgICAgICAgICAgY3R4LmFsaWFzUmVzb2x2ZUNhY2hlID0gbm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZvdW5kID0gdW5kZWZpbmVkO1xuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChub2RlID09PSB0aGlzKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgaWYgKG5vZGUuYW5jaG9yID09PSB0aGlzLnNvdXJjZSlcbiAgICAgICAgICAgICAgICBmb3VuZCA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH1cbiAgICB0b0pTT04oX2FyZywgY3R4KSB7XG4gICAgICAgIGlmICghY3R4KVxuICAgICAgICAgICAgcmV0dXJuIHsgc291cmNlOiB0aGlzLnNvdXJjZSB9O1xuICAgICAgICBjb25zdCB7IGFuY2hvcnMsIGRvYywgbWF4QWxpYXNDb3VudCB9ID0gY3R4O1xuICAgICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLnJlc29sdmUoZG9jLCBjdHgpO1xuICAgICAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgICAgICAgY29uc3QgbXNnID0gYFVucmVzb2x2ZWQgYWxpYXMgKHRoZSBhbmNob3IgbXVzdCBiZSBzZXQgYmVmb3JlIHRoZSBhbGlhcyk6ICR7dGhpcy5zb3VyY2V9YDtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhID0gYW5jaG9ycy5nZXQoc291cmNlKTtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAvLyBSZXNvbHZlIGFuY2hvcnMgZm9yIE5vZGUucHJvdG90eXBlLnRvSlMoKVxuICAgICAgICAgICAgdG9KUyhzb3VyY2UsIG51bGwsIGN0eCk7XG4gICAgICAgICAgICBkYXRhID0gYW5jaG9ycy5nZXQoc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKGRhdGE/LnJlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBtc2cgPSAnVGhpcyBzaG91bGQgbm90IGhhcHBlbjogQWxpYXMgYW5jaG9yIHdhcyBub3QgcmVzb2x2ZWQ/JztcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXhBbGlhc0NvdW50ID49IDApIHtcbiAgICAgICAgICAgIGRhdGEuY291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLmFsaWFzQ291bnQgPT09IDApXG4gICAgICAgICAgICAgICAgZGF0YS5hbGlhc0NvdW50ID0gZ2V0QWxpYXNDb3VudChkb2MsIHNvdXJjZSwgYW5jaG9ycyk7XG4gICAgICAgICAgICBpZiAoZGF0YS5jb3VudCAqIGRhdGEuYWxpYXNDb3VudCA+IG1heEFsaWFzQ291bnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSAnRXhjZXNzaXZlIGFsaWFzIGNvdW50IGluZGljYXRlcyBhIHJlc291cmNlIGV4aGF1c3Rpb24gYXR0YWNrJztcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IobXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YS5yZXM7XG4gICAgfVxuICAgIHRvU3RyaW5nKGN0eCwgX29uQ29tbWVudCwgX29uQ2hvbXBLZWVwKSB7XG4gICAgICAgIGNvbnN0IHNyYyA9IGAqJHt0aGlzLnNvdXJjZX1gO1xuICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBhbmNob3JJc1ZhbGlkKHRoaXMuc291cmNlKTtcbiAgICAgICAgICAgIGlmIChjdHgub3B0aW9ucy52ZXJpZnlBbGlhc09yZGVyICYmICFjdHguYW5jaG9ycy5oYXModGhpcy5zb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gYFVucmVzb2x2ZWQgYWxpYXMgKHRoZSBhbmNob3IgbXVzdCBiZSBzZXQgYmVmb3JlIHRoZSBhbGlhcyk6ICR7dGhpcy5zb3VyY2V9YDtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdHguaW1wbGljaXRLZXkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3NyY30gYDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3JjO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldEFsaWFzQ291bnQoZG9jLCBub2RlLCBhbmNob3JzKSB7XG4gICAgaWYgKGlzQWxpYXMobm9kZSkpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gbm9kZS5yZXNvbHZlKGRvYyk7XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IGFuY2hvcnMgJiYgc291cmNlICYmIGFuY2hvcnMuZ2V0KHNvdXJjZSk7XG4gICAgICAgIHJldHVybiBhbmNob3IgPyBhbmNob3IuY291bnQgKiBhbmNob3IuYWxpYXNDb3VudCA6IDA7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQ29sbGVjdGlvbihub2RlKSkge1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygbm9kZS5pdGVtcykge1xuICAgICAgICAgICAgY29uc3QgYyA9IGdldEFsaWFzQ291bnQoZG9jLCBpdGVtLCBhbmNob3JzKTtcbiAgICAgICAgICAgIGlmIChjID4gY291bnQpXG4gICAgICAgICAgICAgICAgY291bnQgPSBjO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQYWlyKG5vZGUpKSB7XG4gICAgICAgIGNvbnN0IGtjID0gZ2V0QWxpYXNDb3VudChkb2MsIG5vZGUua2V5LCBhbmNob3JzKTtcbiAgICAgICAgY29uc3QgdmMgPSBnZXRBbGlhc0NvdW50KGRvYywgbm9kZS52YWx1ZSwgYW5jaG9ycyk7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChrYywgdmMpO1xuICAgIH1cbiAgICByZXR1cm4gMTtcbn1cblxuZXhwb3J0IHsgQWxpYXMgfTtcbiIsICJpbXBvcnQgeyBTQ0FMQVIgfSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IE5vZGVCYXNlIH0gZnJvbSAnLi9Ob2RlLmpzJztcbmltcG9ydCB7IHRvSlMgfSBmcm9tICcuL3RvSlMuanMnO1xuXG5jb25zdCBpc1NjYWxhclZhbHVlID0gKHZhbHVlKSA9PiAhdmFsdWUgfHwgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKTtcbmNsYXNzIFNjYWxhciBleHRlbmRzIE5vZGVCYXNlIHtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgICAgICBzdXBlcihTQ0FMQVIpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIHRvSlNPTihhcmcsIGN0eCkge1xuICAgICAgICByZXR1cm4gY3R4Py5rZWVwID8gdGhpcy52YWx1ZSA6IHRvSlModGhpcy52YWx1ZSwgYXJnLCBjdHgpO1xuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlKTtcbiAgICB9XG59XG5TY2FsYXIuQkxPQ0tfRk9MREVEID0gJ0JMT0NLX0ZPTERFRCc7XG5TY2FsYXIuQkxPQ0tfTElURVJBTCA9ICdCTE9DS19MSVRFUkFMJztcblNjYWxhci5QTEFJTiA9ICdQTEFJTic7XG5TY2FsYXIuUVVPVEVfRE9VQkxFID0gJ1FVT1RFX0RPVUJMRSc7XG5TY2FsYXIuUVVPVEVfU0lOR0xFID0gJ1FVT1RFX1NJTkdMRSc7XG5cbmV4cG9ydCB7IFNjYWxhciwgaXNTY2FsYXJWYWx1ZSB9O1xuIiwgImltcG9ydCB7IEFsaWFzIH0gZnJvbSAnLi4vbm9kZXMvQWxpYXMuanMnO1xuaW1wb3J0IHsgaXNOb2RlLCBpc1BhaXIsIE1BUCwgU0VRLCBpc0RvY3VtZW50IH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vbm9kZXMvU2NhbGFyLmpzJztcblxuY29uc3QgZGVmYXVsdFRhZ1ByZWZpeCA9ICd0YWc6eWFtbC5vcmcsMjAwMjonO1xuZnVuY3Rpb24gZmluZFRhZ09iamVjdCh2YWx1ZSwgdGFnTmFtZSwgdGFncykge1xuICAgIGlmICh0YWdOYW1lKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdGFncy5maWx0ZXIodCA9PiB0LnRhZyA9PT0gdGFnTmFtZSk7XG4gICAgICAgIGNvbnN0IHRhZ09iaiA9IG1hdGNoLmZpbmQodCA9PiAhdC5mb3JtYXQpID8/IG1hdGNoWzBdO1xuICAgICAgICBpZiAoIXRhZ09iailcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGFnICR7dGFnTmFtZX0gbm90IGZvdW5kYCk7XG4gICAgICAgIHJldHVybiB0YWdPYmo7XG4gICAgfVxuICAgIHJldHVybiB0YWdzLmZpbmQodCA9PiB0LmlkZW50aWZ5Py4odmFsdWUpICYmICF0LmZvcm1hdCk7XG59XG5mdW5jdGlvbiBjcmVhdGVOb2RlKHZhbHVlLCB0YWdOYW1lLCBjdHgpIHtcbiAgICBpZiAoaXNEb2N1bWVudCh2YWx1ZSkpXG4gICAgICAgIHZhbHVlID0gdmFsdWUuY29udGVudHM7XG4gICAgaWYgKGlzTm9kZSh2YWx1ZSkpXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBpZiAoaXNQYWlyKHZhbHVlKSkge1xuICAgICAgICBjb25zdCBtYXAgPSBjdHguc2NoZW1hW01BUF0uY3JlYXRlTm9kZT8uKGN0eC5zY2hlbWEsIG51bGwsIGN0eCk7XG4gICAgICAgIG1hcC5pdGVtcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8XG4gICAgICAgIHZhbHVlIGluc3RhbmNlb2YgTnVtYmVyIHx8XG4gICAgICAgIHZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbiB8fFxuICAgICAgICAodHlwZW9mIEJpZ0ludCAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBCaWdJbnQpIC8vIG5vdCBzdXBwb3J0ZWQgZXZlcnl3aGVyZVxuICAgICkge1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNlcmlhbGl6ZWpzb25wcm9wZXJ0eVxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgY29uc3QgeyBhbGlhc0R1cGxpY2F0ZU9iamVjdHMsIG9uQW5jaG9yLCBvblRhZ09iaiwgc2NoZW1hLCBzb3VyY2VPYmplY3RzIH0gPSBjdHg7XG4gICAgLy8gRGV0ZWN0IGR1cGxpY2F0ZSByZWZlcmVuY2VzIHRvIHRoZSBzYW1lIG9iamVjdCAmIHVzZSBBbGlhcyBub2RlcyBmb3IgYWxsXG4gICAgLy8gYWZ0ZXIgZmlyc3QuIFRoZSBgcmVmYCB3cmFwcGVyIGFsbG93cyBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyB0byByZXNvbHZlLlxuICAgIGxldCByZWYgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGFsaWFzRHVwbGljYXRlT2JqZWN0cyAmJiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJlZiA9IHNvdXJjZU9iamVjdHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgaWYgKHJlZikge1xuICAgICAgICAgICAgcmVmLmFuY2hvciA/PyAocmVmLmFuY2hvciA9IG9uQW5jaG9yKHZhbHVlKSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFsaWFzKHJlZi5hbmNob3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVmID0geyBhbmNob3I6IG51bGwsIG5vZGU6IG51bGwgfTtcbiAgICAgICAgICAgIHNvdXJjZU9iamVjdHMuc2V0KHZhbHVlLCByZWYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0YWdOYW1lPy5zdGFydHNXaXRoKCchIScpKVxuICAgICAgICB0YWdOYW1lID0gZGVmYXVsdFRhZ1ByZWZpeCArIHRhZ05hbWUuc2xpY2UoMik7XG4gICAgbGV0IHRhZ09iaiA9IGZpbmRUYWdPYmplY3QodmFsdWUsIHRhZ05hbWUsIHNjaGVtYS50YWdzKTtcbiAgICBpZiAoIXRhZ09iaikge1xuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtY2FsbFxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgU2NhbGFyKHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChyZWYpXG4gICAgICAgICAgICAgICAgcmVmLm5vZGUgPSBub2RlO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgdGFnT2JqID1cbiAgICAgICAgICAgIHZhbHVlIGluc3RhbmNlb2YgTWFwXG4gICAgICAgICAgICAgICAgPyBzY2hlbWFbTUFQXVxuICAgICAgICAgICAgICAgIDogU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdCh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgPyBzY2hlbWFbU0VRXVxuICAgICAgICAgICAgICAgICAgICA6IHNjaGVtYVtNQVBdO1xuICAgIH1cbiAgICBpZiAob25UYWdPYmopIHtcbiAgICAgICAgb25UYWdPYmoodGFnT2JqKTtcbiAgICAgICAgZGVsZXRlIGN0eC5vblRhZ09iajtcbiAgICB9XG4gICAgY29uc3Qgbm9kZSA9IHRhZ09iaj8uY3JlYXRlTm9kZVxuICAgICAgICA/IHRhZ09iai5jcmVhdGVOb2RlKGN0eC5zY2hlbWEsIHZhbHVlLCBjdHgpXG4gICAgICAgIDogdHlwZW9mIHRhZ09iaj8ubm9kZUNsYXNzPy5mcm9tID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICA/IHRhZ09iai5ub2RlQ2xhc3MuZnJvbShjdHguc2NoZW1hLCB2YWx1ZSwgY3R4KVxuICAgICAgICAgICAgOiBuZXcgU2NhbGFyKHZhbHVlKTtcbiAgICBpZiAodGFnTmFtZSlcbiAgICAgICAgbm9kZS50YWcgPSB0YWdOYW1lO1xuICAgIGVsc2UgaWYgKCF0YWdPYmouZGVmYXVsdClcbiAgICAgICAgbm9kZS50YWcgPSB0YWdPYmoudGFnO1xuICAgIGlmIChyZWYpXG4gICAgICAgIHJlZi5ub2RlID0gbm9kZTtcbiAgICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlTm9kZSB9O1xuIiwgImltcG9ydCB7IGNyZWF0ZU5vZGUgfSBmcm9tICcuLi9kb2MvY3JlYXRlTm9kZS5qcyc7XG5pbXBvcnQgeyBpc05vZGUsIGlzUGFpciwgaXNDb2xsZWN0aW9uLCBpc1NjYWxhciB9IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgTm9kZUJhc2UgfSBmcm9tICcuL05vZGUuanMnO1xuXG5mdW5jdGlvbiBjb2xsZWN0aW9uRnJvbVBhdGgoc2NoZW1hLCBwYXRoLCB2YWx1ZSkge1xuICAgIGxldCB2ID0gdmFsdWU7XG4gICAgZm9yIChsZXQgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgY29uc3QgayA9IHBhdGhbaV07XG4gICAgICAgIGlmICh0eXBlb2YgayA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzSW50ZWdlcihrKSAmJiBrID49IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBbXTtcbiAgICAgICAgICAgIGFba10gPSB2O1xuICAgICAgICAgICAgdiA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2ID0gbmV3IE1hcChbW2ssIHZdXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZU5vZGUodiwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGFsaWFzRHVwbGljYXRlT2JqZWN0czogZmFsc2UsXG4gICAgICAgIGtlZXBVbmRlZmluZWQ6IGZhbHNlLFxuICAgICAgICBvbkFuY2hvcjogKCkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIHNob3VsZCBub3QgaGFwcGVuLCBwbGVhc2UgcmVwb3J0IGEgYnVnLicpO1xuICAgICAgICB9LFxuICAgICAgICBzY2hlbWEsXG4gICAgICAgIHNvdXJjZU9iamVjdHM6IG5ldyBNYXAoKVxuICAgIH0pO1xufVxuLy8gVHlwZSBndWFyZCBpcyBpbnRlbnRpb25hbGx5IGEgbGl0dGxlIHdyb25nIHNvIGFzIHRvIGJlIG1vcmUgdXNlZnVsLFxuLy8gYXMgaXQgZG9lcyBub3QgY292ZXIgdW50eXBhYmxlIGVtcHR5IG5vbi1zdHJpbmcgaXRlcmFibGVzIChlLmcuIFtdKS5cbmNvbnN0IGlzRW1wdHlQYXRoID0gKHBhdGgpID0+IHBhdGggPT0gbnVsbCB8fFxuICAgICh0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgISFwYXRoW1N5bWJvbC5pdGVyYXRvcl0oKS5uZXh0KCkuZG9uZSk7XG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgTm9kZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKHR5cGUsIHNjaGVtYSkge1xuICAgICAgICBzdXBlcih0eXBlKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzY2hlbWEnLCB7XG4gICAgICAgICAgICB2YWx1ZTogc2NoZW1hLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgY29weSBvZiB0aGlzIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NoZW1hIC0gSWYgZGVmaW5lZCwgb3ZlcndyaXRlcyB0aGUgb3JpZ2luYWwncyBzY2hlbWFcbiAgICAgKi9cbiAgICBjbG9uZShzY2hlbWEpIHtcbiAgICAgICAgY29uc3QgY29weSA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh0aGlzKSk7XG4gICAgICAgIGlmIChzY2hlbWEpXG4gICAgICAgICAgICBjb3B5LnNjaGVtYSA9IHNjaGVtYTtcbiAgICAgICAgY29weS5pdGVtcyA9IGNvcHkuaXRlbXMubWFwKGl0ID0+IGlzTm9kZShpdCkgfHwgaXNQYWlyKGl0KSA/IGl0LmNsb25lKHNjaGVtYSkgOiBpdCk7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlKVxuICAgICAgICAgICAgY29weS5yYW5nZSA9IHRoaXMucmFuZ2Uuc2xpY2UoKTtcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYSB2YWx1ZSB0byB0aGUgY29sbGVjdGlvbi4gRm9yIGAhIW1hcGAgYW5kIGAhIW9tYXBgIHRoZSB2YWx1ZSBtdXN0XG4gICAgICogYmUgYSBQYWlyIGluc3RhbmNlIG9yIGEgYHsga2V5LCB2YWx1ZSB9YCBvYmplY3QsIHdoaWNoIG1heSBub3QgaGF2ZSBhIGtleVxuICAgICAqIHRoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIG1hcC5cbiAgICAgKi9cbiAgICBhZGRJbihwYXRoLCB2YWx1ZSkge1xuICAgICAgICBpZiAoaXNFbXB0eVBhdGgocGF0aCkpXG4gICAgICAgICAgICB0aGlzLmFkZCh2YWx1ZSk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgW2tleSwgLi4ucmVzdF0gPSBwYXRoO1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0KGtleSwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoaXNDb2xsZWN0aW9uKG5vZGUpKVxuICAgICAgICAgICAgICAgIG5vZGUuYWRkSW4ocmVzdCwgdmFsdWUpO1xuICAgICAgICAgICAgZWxzZSBpZiAobm9kZSA9PT0gdW5kZWZpbmVkICYmIHRoaXMuc2NoZW1hKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgY29sbGVjdGlvbkZyb21QYXRoKHRoaXMuc2NoZW1hLCByZXN0LCB2YWx1ZSkpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgWUFNTCBjb2xsZWN0aW9uIGF0ICR7a2V5fS4gUmVtYWluaW5nIHBhdGg6ICR7cmVzdH1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgdmFsdWUgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGl0ZW0gd2FzIGZvdW5kIGFuZCByZW1vdmVkLlxuICAgICAqL1xuICAgIGRlbGV0ZUluKHBhdGgpIHtcbiAgICAgICAgY29uc3QgW2tleSwgLi4ucmVzdF0gPSBwYXRoO1xuICAgICAgICBpZiAocmVzdC5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWxldGUoa2V5KTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0KGtleSwgdHJ1ZSk7XG4gICAgICAgIGlmIChpc0NvbGxlY3Rpb24obm9kZSkpXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5kZWxldGVJbihyZXN0KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBZQU1MIGNvbGxlY3Rpb24gYXQgJHtrZXl9LiBSZW1haW5pbmcgcGF0aDogJHtyZXN0fWApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGl0ZW0gYXQgYGtleWAsIG9yIGB1bmRlZmluZWRgIGlmIG5vdCBmb3VuZC4gQnkgZGVmYXVsdCB1bndyYXBzXG4gICAgICogc2NhbGFyIHZhbHVlcyBmcm9tIHRoZWlyIHN1cnJvdW5kaW5nIG5vZGU7IHRvIGRpc2FibGUgc2V0IGBrZWVwU2NhbGFyYCB0b1xuICAgICAqIGB0cnVlYCAoY29sbGVjdGlvbnMgYXJlIGFsd2F5cyByZXR1cm5lZCBpbnRhY3QpLlxuICAgICAqL1xuICAgIGdldEluKHBhdGgsIGtlZXBTY2FsYXIpIHtcbiAgICAgICAgY29uc3QgW2tleSwgLi4ucmVzdF0gPSBwYXRoO1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5nZXQoa2V5LCB0cnVlKTtcbiAgICAgICAgaWYgKHJlc3QubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuICFrZWVwU2NhbGFyICYmIGlzU2NhbGFyKG5vZGUpID8gbm9kZS52YWx1ZSA6IG5vZGU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBpc0NvbGxlY3Rpb24obm9kZSkgPyBub2RlLmdldEluKHJlc3QsIGtlZXBTY2FsYXIpIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBoYXNBbGxOdWxsVmFsdWVzKGFsbG93U2NhbGFyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmV2ZXJ5KG5vZGUgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc1BhaXIobm9kZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgbiA9IG5vZGUudmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gKG4gPT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgIChhbGxvd1NjYWxhciAmJlxuICAgICAgICAgICAgICAgICAgICBpc1NjYWxhcihuKSAmJlxuICAgICAgICAgICAgICAgICAgICBuLnZhbHVlID09IG51bGwgJiZcbiAgICAgICAgICAgICAgICAgICAgIW4uY29tbWVudEJlZm9yZSAmJlxuICAgICAgICAgICAgICAgICAgICAhbi5jb21tZW50ICYmXG4gICAgICAgICAgICAgICAgICAgICFuLnRhZykpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBjb2xsZWN0aW9uIGluY2x1ZGVzIGEgdmFsdWUgd2l0aCB0aGUga2V5IGBrZXlgLlxuICAgICAqL1xuICAgIGhhc0luKHBhdGgpIHtcbiAgICAgICAgY29uc3QgW2tleSwgLi4ucmVzdF0gPSBwYXRoO1xuICAgICAgICBpZiAocmVzdC5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYXMoa2V5KTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0KGtleSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBpc0NvbGxlY3Rpb24obm9kZSkgPyBub2RlLmhhc0luKHJlc3QpIDogZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSB2YWx1ZSBpbiB0aGlzIGNvbGxlY3Rpb24uIEZvciBgISFzZXRgLCBgdmFsdWVgIG5lZWRzIHRvIGJlIGFcbiAgICAgKiBib29sZWFuIHRvIGFkZC9yZW1vdmUgdGhlIGl0ZW0gZnJvbSB0aGUgc2V0LlxuICAgICAqL1xuICAgIHNldEluKHBhdGgsIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IFtrZXksIC4uLnJlc3RdID0gcGF0aDtcbiAgICAgICAgaWYgKHJlc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldChrZXksIHRydWUpO1xuICAgICAgICAgICAgaWYgKGlzQ29sbGVjdGlvbihub2RlKSlcbiAgICAgICAgICAgICAgICBub2RlLnNldEluKHJlc3QsIHZhbHVlKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnNjaGVtYSlcbiAgICAgICAgICAgICAgICB0aGlzLnNldChrZXksIGNvbGxlY3Rpb25Gcm9tUGF0aCh0aGlzLnNjaGVtYSwgcmVzdCwgdmFsdWUpKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIFlBTUwgY29sbGVjdGlvbiBhdCAke2tleX0uIFJlbWFpbmluZyBwYXRoOiAke3Jlc3R9YCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IENvbGxlY3Rpb24sIGNvbGxlY3Rpb25Gcm9tUGF0aCwgaXNFbXB0eVBhdGggfTtcbiIsICIvKipcbiAqIFN0cmluZ2lmaWVzIGEgY29tbWVudC5cbiAqXG4gKiBFbXB0eSBjb21tZW50IGxpbmVzIGFyZSBsZWZ0IGVtcHR5LFxuICogbGluZXMgY29uc2lzdGluZyBvZiBhIHNpbmdsZSBzcGFjZSBhcmUgcmVwbGFjZWQgYnkgYCNgLFxuICogYW5kIGFsbCBvdGhlciBsaW5lcyBhcmUgcHJlZml4ZWQgd2l0aCBhIGAjYC5cbiAqL1xuY29uc3Qgc3RyaW5naWZ5Q29tbWVudCA9IChzdHIpID0+IHN0ci5yZXBsYWNlKC9eKD8hJCkoPzogJCk/L2dtLCAnIycpO1xuZnVuY3Rpb24gaW5kZW50Q29tbWVudChjb21tZW50LCBpbmRlbnQpIHtcbiAgICBpZiAoL15cXG4rJC8udGVzdChjb21tZW50KSlcbiAgICAgICAgcmV0dXJuIGNvbW1lbnQuc3Vic3RyaW5nKDEpO1xuICAgIHJldHVybiBpbmRlbnQgPyBjb21tZW50LnJlcGxhY2UoL14oPyEgKiQpL2dtLCBpbmRlbnQpIDogY29tbWVudDtcbn1cbmNvbnN0IGxpbmVDb21tZW50ID0gKHN0ciwgaW5kZW50LCBjb21tZW50KSA9PiBzdHIuZW5kc1dpdGgoJ1xcbicpXG4gICAgPyBpbmRlbnRDb21tZW50KGNvbW1lbnQsIGluZGVudClcbiAgICA6IGNvbW1lbnQuaW5jbHVkZXMoJ1xcbicpXG4gICAgICAgID8gJ1xcbicgKyBpbmRlbnRDb21tZW50KGNvbW1lbnQsIGluZGVudClcbiAgICAgICAgOiAoc3RyLmVuZHNXaXRoKCcgJykgPyAnJyA6ICcgJykgKyBjb21tZW50O1xuXG5leHBvcnQgeyBpbmRlbnRDb21tZW50LCBsaW5lQ29tbWVudCwgc3RyaW5naWZ5Q29tbWVudCB9O1xuIiwgImNvbnN0IEZPTERfRkxPVyA9ICdmbG93JztcbmNvbnN0IEZPTERfQkxPQ0sgPSAnYmxvY2snO1xuY29uc3QgRk9MRF9RVU9URUQgPSAncXVvdGVkJztcbi8qKlxuICogVHJpZXMgdG8ga2VlcCBpbnB1dCBhdCB1cCB0byBgbGluZVdpZHRoYCBjaGFyYWN0ZXJzLCBzcGxpdHRpbmcgb25seSBvbiBzcGFjZXNcbiAqIG5vdCBmb2xsb3dlZCBieSBuZXdsaW5lcyBvciBzcGFjZXMgdW5sZXNzIGBtb2RlYCBpcyBgJ3F1b3RlZCdgLiBMaW5lcyBhcmVcbiAqIHRlcm1pbmF0ZWQgd2l0aCBgXFxuYCBhbmQgc3RhcnRlZCB3aXRoIGBpbmRlbnRgLlxuICovXG5mdW5jdGlvbiBmb2xkRmxvd0xpbmVzKHRleHQsIGluZGVudCwgbW9kZSA9ICdmbG93JywgeyBpbmRlbnRBdFN0YXJ0LCBsaW5lV2lkdGggPSA4MCwgbWluQ29udGVudFdpZHRoID0gMjAsIG9uRm9sZCwgb25PdmVyZmxvdyB9ID0ge30pIHtcbiAgICBpZiAoIWxpbmVXaWR0aCB8fCBsaW5lV2lkdGggPCAwKVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICBpZiAobGluZVdpZHRoIDwgbWluQ29udGVudFdpZHRoKVxuICAgICAgICBtaW5Db250ZW50V2lkdGggPSAwO1xuICAgIGNvbnN0IGVuZFN0ZXAgPSBNYXRoLm1heCgxICsgbWluQ29udGVudFdpZHRoLCAxICsgbGluZVdpZHRoIC0gaW5kZW50Lmxlbmd0aCk7XG4gICAgaWYgKHRleHQubGVuZ3RoIDw9IGVuZFN0ZXApXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIGNvbnN0IGZvbGRzID0gW107XG4gICAgY29uc3QgZXNjYXBlZEZvbGRzID0ge307XG4gICAgbGV0IGVuZCA9IGxpbmVXaWR0aCAtIGluZGVudC5sZW5ndGg7XG4gICAgaWYgKHR5cGVvZiBpbmRlbnRBdFN0YXJ0ID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoaW5kZW50QXRTdGFydCA+IGxpbmVXaWR0aCAtIE1hdGgubWF4KDIsIG1pbkNvbnRlbnRXaWR0aCkpXG4gICAgICAgICAgICBmb2xkcy5wdXNoKDApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBlbmQgPSBsaW5lV2lkdGggLSBpbmRlbnRBdFN0YXJ0O1xuICAgIH1cbiAgICBsZXQgc3BsaXQgPSB1bmRlZmluZWQ7XG4gICAgbGV0IHByZXYgPSB1bmRlZmluZWQ7XG4gICAgbGV0IG92ZXJmbG93ID0gZmFsc2U7XG4gICAgbGV0IGkgPSAtMTtcbiAgICBsZXQgZXNjU3RhcnQgPSAtMTtcbiAgICBsZXQgZXNjRW5kID0gLTE7XG4gICAgaWYgKG1vZGUgPT09IEZPTERfQkxPQ0spIHtcbiAgICAgICAgaSA9IGNvbnN1bWVNb3JlSW5kZW50ZWRMaW5lcyh0ZXh0LCBpLCBpbmRlbnQubGVuZ3RoKTtcbiAgICAgICAgaWYgKGkgIT09IC0xKVxuICAgICAgICAgICAgZW5kID0gaSArIGVuZFN0ZXA7XG4gICAgfVxuICAgIGZvciAobGV0IGNoOyAoY2ggPSB0ZXh0WyhpICs9IDEpXSk7KSB7XG4gICAgICAgIGlmIChtb2RlID09PSBGT0xEX1FVT1RFRCAmJiBjaCA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICBlc2NTdGFydCA9IGk7XG4gICAgICAgICAgICBzd2l0Y2ggKHRleHRbaSArIDFdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndSc6XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gNTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnVSc6XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gOTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXNjRW5kID0gaTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2ggPT09ICdcXG4nKSB7XG4gICAgICAgICAgICBpZiAobW9kZSA9PT0gRk9MRF9CTE9DSylcbiAgICAgICAgICAgICAgICBpID0gY29uc3VtZU1vcmVJbmRlbnRlZExpbmVzKHRleHQsIGksIGluZGVudC5sZW5ndGgpO1xuICAgICAgICAgICAgZW5kID0gaSArIGluZGVudC5sZW5ndGggKyBlbmRTdGVwO1xuICAgICAgICAgICAgc3BsaXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2ggPT09ICcgJyAmJlxuICAgICAgICAgICAgICAgIHByZXYgJiZcbiAgICAgICAgICAgICAgICBwcmV2ICE9PSAnICcgJiZcbiAgICAgICAgICAgICAgICBwcmV2ICE9PSAnXFxuJyAmJlxuICAgICAgICAgICAgICAgIHByZXYgIT09ICdcXHQnKSB7XG4gICAgICAgICAgICAgICAgLy8gc3BhY2Ugc3Vycm91bmRlZCBieSBub24tc3BhY2UgY2FuIGJlIHJlcGxhY2VkIHdpdGggbmV3bGluZSArIGluZGVudFxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB0ZXh0W2kgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0ICE9PSAnICcgJiYgbmV4dCAhPT0gJ1xcbicgJiYgbmV4dCAhPT0gJ1xcdCcpXG4gICAgICAgICAgICAgICAgICAgIHNwbGl0ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpID49IGVuZCkge1xuICAgICAgICAgICAgICAgIGlmIChzcGxpdCkge1xuICAgICAgICAgICAgICAgICAgICBmb2xkcy5wdXNoKHNwbGl0KTtcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gc3BsaXQgKyBlbmRTdGVwO1xuICAgICAgICAgICAgICAgICAgICBzcGxpdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobW9kZSA9PT0gRk9MRF9RVU9URUQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpdGUtc3BhY2UgY29sbGVjdGVkIGF0IGVuZCBtYXkgc3RyZXRjaCBwYXN0IGxpbmVXaWR0aFxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAocHJldiA9PT0gJyAnIHx8IHByZXYgPT09ICdcXHQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2ID0gY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IHRleHRbKGkgKz0gMSldO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIEFjY291bnQgZm9yIG5ld2xpbmUgZXNjYXBlLCBidXQgZG9uJ3QgYnJlYWsgcHJlY2VkaW5nIGVzY2FwZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBqID0gaSA+IGVzY0VuZCArIDEgPyBpIC0gMiA6IGVzY1N0YXJ0IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQmFpbCBvdXQgaWYgbGluZVdpZHRoICYgbWluQ29udGVudFdpZHRoIGFyZSBzaG9ydGVyIHRoYW4gYW4gZXNjYXBlIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXNjYXBlZEZvbGRzW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICAgICAgICAgIGZvbGRzLnB1c2goaik7XG4gICAgICAgICAgICAgICAgICAgIGVzY2FwZWRGb2xkc1tqXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IGogKyBlbmRTdGVwO1xuICAgICAgICAgICAgICAgICAgICBzcGxpdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IGNoO1xuICAgIH1cbiAgICBpZiAob3ZlcmZsb3cgJiYgb25PdmVyZmxvdylcbiAgICAgICAgb25PdmVyZmxvdygpO1xuICAgIGlmIChmb2xkcy5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIGlmIChvbkZvbGQpXG4gICAgICAgIG9uRm9sZCgpO1xuICAgIGxldCByZXMgPSB0ZXh0LnNsaWNlKDAsIGZvbGRzWzBdKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvbGRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGZvbGQgPSBmb2xkc1tpXTtcbiAgICAgICAgY29uc3QgZW5kID0gZm9sZHNbaSArIDFdIHx8IHRleHQubGVuZ3RoO1xuICAgICAgICBpZiAoZm9sZCA9PT0gMClcbiAgICAgICAgICAgIHJlcyA9IGBcXG4ke2luZGVudH0ke3RleHQuc2xpY2UoMCwgZW5kKX1gO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtb2RlID09PSBGT0xEX1FVT1RFRCAmJiBlc2NhcGVkRm9sZHNbZm9sZF0pXG4gICAgICAgICAgICAgICAgcmVzICs9IGAke3RleHRbZm9sZF19XFxcXGA7XG4gICAgICAgICAgICByZXMgKz0gYFxcbiR7aW5kZW50fSR7dGV4dC5zbGljZShmb2xkICsgMSwgZW5kKX1gO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG4vKipcbiAqIFByZXN1bWVzIGBpICsgMWAgaXMgYXQgdGhlIHN0YXJ0IG9mIGEgbGluZVxuICogQHJldHVybnMgaW5kZXggb2YgbGFzdCBuZXdsaW5lIGluIG1vcmUtaW5kZW50ZWQgYmxvY2tcbiAqL1xuZnVuY3Rpb24gY29uc3VtZU1vcmVJbmRlbnRlZExpbmVzKHRleHQsIGksIGluZGVudCkge1xuICAgIGxldCBlbmQgPSBpO1xuICAgIGxldCBzdGFydCA9IGkgKyAxO1xuICAgIGxldCBjaCA9IHRleHRbc3RhcnRdO1xuICAgIHdoaWxlIChjaCA9PT0gJyAnIHx8IGNoID09PSAnXFx0Jykge1xuICAgICAgICBpZiAoaSA8IHN0YXJ0ICsgaW5kZW50KSB7XG4gICAgICAgICAgICBjaCA9IHRleHRbKytpXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBjaCA9IHRleHRbKytpXTtcbiAgICAgICAgICAgIH0gd2hpbGUgKGNoICYmIGNoICE9PSAnXFxuJyk7XG4gICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGNoID0gdGV4dFtzdGFydF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVuZDtcbn1cblxuZXhwb3J0IHsgRk9MRF9CTE9DSywgRk9MRF9GTE9XLCBGT0xEX1FVT1RFRCwgZm9sZEZsb3dMaW5lcyB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyBmb2xkRmxvd0xpbmVzLCBGT0xEX0ZMT1csIEZPTERfUVVPVEVELCBGT0xEX0JMT0NLIH0gZnJvbSAnLi9mb2xkRmxvd0xpbmVzLmpzJztcblxuY29uc3QgZ2V0Rm9sZE9wdGlvbnMgPSAoY3R4LCBpc0Jsb2NrKSA9PiAoe1xuICAgIGluZGVudEF0U3RhcnQ6IGlzQmxvY2sgPyBjdHguaW5kZW50Lmxlbmd0aCA6IGN0eC5pbmRlbnRBdFN0YXJ0LFxuICAgIGxpbmVXaWR0aDogY3R4Lm9wdGlvbnMubGluZVdpZHRoLFxuICAgIG1pbkNvbnRlbnRXaWR0aDogY3R4Lm9wdGlvbnMubWluQ29udGVudFdpZHRoXG59KTtcbi8vIEFsc28gY2hlY2tzIGZvciBsaW5lcyBzdGFydGluZyB3aXRoICUsIGFzIHBhcnNpbmcgdGhlIG91dHB1dCBhcyBZQU1MIDEuMSB3aWxsXG4vLyBwcmVzdW1lIHRoYXQncyBzdGFydGluZyBhIG5ldyBkb2N1bWVudC5cbmNvbnN0IGNvbnRhaW5zRG9jdW1lbnRNYXJrZXIgPSAoc3RyKSA9PiAvXiglfC0tLXxcXC5cXC5cXC4pL20udGVzdChzdHIpO1xuZnVuY3Rpb24gbGluZUxlbmd0aE92ZXJMaW1pdChzdHIsIGxpbmVXaWR0aCwgaW5kZW50TGVuZ3RoKSB7XG4gICAgaWYgKCFsaW5lV2lkdGggfHwgbGluZVdpZHRoIDwgMClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGxpbWl0ID0gbGluZVdpZHRoIC0gaW5kZW50TGVuZ3RoO1xuICAgIGNvbnN0IHN0ckxlbiA9IHN0ci5sZW5ndGg7XG4gICAgaWYgKHN0ckxlbiA8PSBsaW1pdClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwLCBzdGFydCA9IDA7IGkgPCBzdHJMZW47ICsraSkge1xuICAgICAgICBpZiAoc3RyW2ldID09PSAnXFxuJykge1xuICAgICAgICAgICAgaWYgKGkgLSBzdGFydCA+IGxpbWl0KVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGlmIChzdHJMZW4gLSBzdGFydCA8PSBsaW1pdClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBkb3VibGVRdW90ZWRTdHJpbmcodmFsdWUsIGN0eCkge1xuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgaWYgKGN0eC5vcHRpb25zLmRvdWJsZVF1b3RlZEFzSlNPTilcbiAgICAgICAgcmV0dXJuIGpzb247XG4gICAgY29uc3QgeyBpbXBsaWNpdEtleSB9ID0gY3R4O1xuICAgIGNvbnN0IG1pbk11bHRpTGluZUxlbmd0aCA9IGN0eC5vcHRpb25zLmRvdWJsZVF1b3RlZE1pbk11bHRpTGluZUxlbmd0aDtcbiAgICBjb25zdCBpbmRlbnQgPSBjdHguaW5kZW50IHx8IChjb250YWluc0RvY3VtZW50TWFya2VyKHZhbHVlKSA/ICcgICcgOiAnJyk7XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIGxldCBzdGFydCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDAsIGNoID0ganNvbltpXTsgY2g7IGNoID0ganNvblsrK2ldKSB7XG4gICAgICAgIGlmIChjaCA9PT0gJyAnICYmIGpzb25baSArIDFdID09PSAnXFxcXCcgJiYganNvbltpICsgMl0gPT09ICduJykge1xuICAgICAgICAgICAgLy8gc3BhY2UgYmVmb3JlIG5ld2xpbmUgbmVlZHMgdG8gYmUgZXNjYXBlZCB0byBub3QgYmUgZm9sZGVkXG4gICAgICAgICAgICBzdHIgKz0ganNvbi5zbGljZShzdGFydCwgaSkgKyAnXFxcXCAnO1xuICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgc3RhcnQgPSBpO1xuICAgICAgICAgICAgY2ggPSAnXFxcXCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoID09PSAnXFxcXCcpXG4gICAgICAgICAgICBzd2l0Y2ggKGpzb25baSArIDFdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndSc6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBqc29uLnNsaWNlKHN0YXJ0LCBpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBqc29uLnN1YnN0cihpICsgMiwgNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcwMDAwJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcMCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzAwMDcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFxhJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnMDAwYic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxcXHYnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcwMDFiJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzAwODUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFxOJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnMDBhMCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxcXF8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcyMDI4JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcTCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzIwMjknOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFxQJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUuc3Vic3RyKDAsIDIpID09PSAnMDAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxceCcgKyBjb2RlLnN1YnN0cigyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGpzb24uc3Vic3RyKGksIDYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaSArPSA1O1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICduJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGltcGxpY2l0S2V5IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uW2kgKyAyXSA9PT0gJ1wiJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5sZW5ndGggPCBtaW5NdWx0aUxpbmVMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvbGRpbmcgd2lsbCBlYXQgZmlyc3QgbmV3bGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGpzb24uc2xpY2Uoc3RhcnQsIGkpICsgJ1xcblxcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoanNvbltpICsgMl0gPT09ICdcXFxcJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb25baSArIDNdID09PSAnbicgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uW2kgKyA0XSAhPT0gJ1wiJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxuJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gaW5kZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3BhY2UgYWZ0ZXIgbmV3bGluZSBuZWVkcyB0byBiZSBlc2NhcGVkIHRvIG5vdCBiZSBmb2xkZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqc29uW2kgKyAyXSA9PT0gJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxcXCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICB9XG4gICAgc3RyID0gc3RhcnQgPyBzdHIgKyBqc29uLnNsaWNlKHN0YXJ0KSA6IGpzb247XG4gICAgcmV0dXJuIGltcGxpY2l0S2V5XG4gICAgICAgID8gc3RyXG4gICAgICAgIDogZm9sZEZsb3dMaW5lcyhzdHIsIGluZGVudCwgRk9MRF9RVU9URUQsIGdldEZvbGRPcHRpb25zKGN0eCwgZmFsc2UpKTtcbn1cbmZ1bmN0aW9uIHNpbmdsZVF1b3RlZFN0cmluZyh2YWx1ZSwgY3R4KSB7XG4gICAgaWYgKGN0eC5vcHRpb25zLnNpbmdsZVF1b3RlID09PSBmYWxzZSB8fFxuICAgICAgICAoY3R4LmltcGxpY2l0S2V5ICYmIHZhbHVlLmluY2x1ZGVzKCdcXG4nKSkgfHxcbiAgICAgICAgL1sgXFx0XVxcbnxcXG5bIFxcdF0vLnRlc3QodmFsdWUpIC8vIHNpbmdsZSBxdW90ZWQgc3RyaW5nIGNhbid0IGhhdmUgbGVhZGluZyBvciB0cmFpbGluZyB3aGl0ZXNwYWNlIGFyb3VuZCBuZXdsaW5lXG4gICAgKVxuICAgICAgICByZXR1cm4gZG91YmxlUXVvdGVkU3RyaW5nKHZhbHVlLCBjdHgpO1xuICAgIGNvbnN0IGluZGVudCA9IGN0eC5pbmRlbnQgfHwgKGNvbnRhaW5zRG9jdW1lbnRNYXJrZXIodmFsdWUpID8gJyAgJyA6ICcnKTtcbiAgICBjb25zdCByZXMgPSBcIidcIiArIHZhbHVlLnJlcGxhY2UoLycvZywgXCInJ1wiKS5yZXBsYWNlKC9cXG4rL2csIGAkJlxcbiR7aW5kZW50fWApICsgXCInXCI7XG4gICAgcmV0dXJuIGN0eC5pbXBsaWNpdEtleVxuICAgICAgICA/IHJlc1xuICAgICAgICA6IGZvbGRGbG93TGluZXMocmVzLCBpbmRlbnQsIEZPTERfRkxPVywgZ2V0Rm9sZE9wdGlvbnMoY3R4LCBmYWxzZSkpO1xufVxuZnVuY3Rpb24gcXVvdGVkU3RyaW5nKHZhbHVlLCBjdHgpIHtcbiAgICBjb25zdCB7IHNpbmdsZVF1b3RlIH0gPSBjdHgub3B0aW9ucztcbiAgICBsZXQgcXM7XG4gICAgaWYgKHNpbmdsZVF1b3RlID09PSBmYWxzZSlcbiAgICAgICAgcXMgPSBkb3VibGVRdW90ZWRTdHJpbmc7XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IGhhc0RvdWJsZSA9IHZhbHVlLmluY2x1ZGVzKCdcIicpO1xuICAgICAgICBjb25zdCBoYXNTaW5nbGUgPSB2YWx1ZS5pbmNsdWRlcyhcIidcIik7XG4gICAgICAgIGlmIChoYXNEb3VibGUgJiYgIWhhc1NpbmdsZSlcbiAgICAgICAgICAgIHFzID0gc2luZ2xlUXVvdGVkU3RyaW5nO1xuICAgICAgICBlbHNlIGlmIChoYXNTaW5nbGUgJiYgIWhhc0RvdWJsZSlcbiAgICAgICAgICAgIHFzID0gZG91YmxlUXVvdGVkU3RyaW5nO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBxcyA9IHNpbmdsZVF1b3RlID8gc2luZ2xlUXVvdGVkU3RyaW5nIDogZG91YmxlUXVvdGVkU3RyaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcXModmFsdWUsIGN0eCk7XG59XG4vLyBUaGUgbmVnYXRpdmUgbG9va2JlaGluZCBhdm9pZHMgYSBwb2x5bm9taWFsIHNlYXJjaCxcbi8vIGJ1dCBpc24ndCBzdXBwb3J0ZWQgeWV0IG9uIFNhZmFyaTogaHR0cHM6Ly9jYW5pdXNlLmNvbS9qcy1yZWdleHAtbG9va2JlaGluZFxubGV0IGJsb2NrRW5kTmV3bGluZXM7XG50cnkge1xuICAgIGJsb2NrRW5kTmV3bGluZXMgPSBuZXcgUmVnRXhwKCcoXnwoPzwhXFxuKSlcXG4rKD8hXFxufCQpJywgJ2cnKTtcbn1cbmNhdGNoIHtcbiAgICBibG9ja0VuZE5ld2xpbmVzID0gL1xcbisoPyFcXG58JCkvZztcbn1cbmZ1bmN0aW9uIGJsb2NrU3RyaW5nKHsgY29tbWVudCwgdHlwZSwgdmFsdWUgfSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgY29uc3QgeyBibG9ja1F1b3RlLCBjb21tZW50U3RyaW5nLCBsaW5lV2lkdGggfSA9IGN0eC5vcHRpb25zO1xuICAgIC8vIDEuIEJsb2NrIGNhbid0IGVuZCBpbiB3aGl0ZXNwYWNlIHVubGVzcyB0aGUgbGFzdCBsaW5lIGlzIG5vbi1lbXB0eS5cbiAgICAvLyAyLiBTdHJpbmdzIGNvbnNpc3Rpbmcgb2Ygb25seSB3aGl0ZXNwYWNlIGFyZSBiZXN0IHJlbmRlcmVkIGV4cGxpY2l0bHkuXG4gICAgaWYgKCFibG9ja1F1b3RlIHx8IC9cXG5bXFx0IF0rJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHF1b3RlZFN0cmluZyh2YWx1ZSwgY3R4KTtcbiAgICB9XG4gICAgY29uc3QgaW5kZW50ID0gY3R4LmluZGVudCB8fFxuICAgICAgICAoY3R4LmZvcmNlQmxvY2tJbmRlbnQgfHwgY29udGFpbnNEb2N1bWVudE1hcmtlcih2YWx1ZSkgPyAnICAnIDogJycpO1xuICAgIGNvbnN0IGxpdGVyYWwgPSBibG9ja1F1b3RlID09PSAnbGl0ZXJhbCdcbiAgICAgICAgPyB0cnVlXG4gICAgICAgIDogYmxvY2tRdW90ZSA9PT0gJ2ZvbGRlZCcgfHwgdHlwZSA9PT0gU2NhbGFyLkJMT0NLX0ZPTERFRFxuICAgICAgICAgICAgPyBmYWxzZVxuICAgICAgICAgICAgOiB0eXBlID09PSBTY2FsYXIuQkxPQ0tfTElURVJBTFxuICAgICAgICAgICAgICAgID8gdHJ1ZVxuICAgICAgICAgICAgICAgIDogIWxpbmVMZW5ndGhPdmVyTGltaXQodmFsdWUsIGxpbmVXaWR0aCwgaW5kZW50Lmxlbmd0aCk7XG4gICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgcmV0dXJuIGxpdGVyYWwgPyAnfFxcbicgOiAnPlxcbic7XG4gICAgLy8gZGV0ZXJtaW5lIGNob21waW5nIGZyb20gd2hpdGVzcGFjZSBhdCB2YWx1ZSBlbmRcbiAgICBsZXQgY2hvbXA7XG4gICAgbGV0IGVuZFN0YXJ0O1xuICAgIGZvciAoZW5kU3RhcnQgPSB2YWx1ZS5sZW5ndGg7IGVuZFN0YXJ0ID4gMDsgLS1lbmRTdGFydCkge1xuICAgICAgICBjb25zdCBjaCA9IHZhbHVlW2VuZFN0YXJ0IC0gMV07XG4gICAgICAgIGlmIChjaCAhPT0gJ1xcbicgJiYgY2ggIT09ICdcXHQnICYmIGNoICE9PSAnICcpXG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgbGV0IGVuZCA9IHZhbHVlLnN1YnN0cmluZyhlbmRTdGFydCk7XG4gICAgY29uc3QgZW5kTmxQb3MgPSBlbmQuaW5kZXhPZignXFxuJyk7XG4gICAgaWYgKGVuZE5sUG9zID09PSAtMSkge1xuICAgICAgICBjaG9tcCA9ICctJzsgLy8gc3RyaXBcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWUgPT09IGVuZCB8fCBlbmRObFBvcyAhPT0gZW5kLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgY2hvbXAgPSAnKyc7IC8vIGtlZXBcbiAgICAgICAgaWYgKG9uQ2hvbXBLZWVwKVxuICAgICAgICAgICAgb25DaG9tcEtlZXAoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNob21wID0gJyc7IC8vIGNsaXBcbiAgICB9XG4gICAgaWYgKGVuZCkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIC1lbmQubGVuZ3RoKTtcbiAgICAgICAgaWYgKGVuZFtlbmQubGVuZ3RoIC0gMV0gPT09ICdcXG4nKVxuICAgICAgICAgICAgZW5kID0gZW5kLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgZW5kID0gZW5kLnJlcGxhY2UoYmxvY2tFbmROZXdsaW5lcywgYCQmJHtpbmRlbnR9YCk7XG4gICAgfVxuICAgIC8vIGRldGVybWluZSBpbmRlbnQgaW5kaWNhdG9yIGZyb20gd2hpdGVzcGFjZSBhdCB2YWx1ZSBzdGFydFxuICAgIGxldCBzdGFydFdpdGhTcGFjZSA9IGZhbHNlO1xuICAgIGxldCBzdGFydEVuZDtcbiAgICBsZXQgc3RhcnRObFBvcyA9IC0xO1xuICAgIGZvciAoc3RhcnRFbmQgPSAwOyBzdGFydEVuZCA8IHZhbHVlLmxlbmd0aDsgKytzdGFydEVuZCkge1xuICAgICAgICBjb25zdCBjaCA9IHZhbHVlW3N0YXJ0RW5kXTtcbiAgICAgICAgaWYgKGNoID09PSAnICcpXG4gICAgICAgICAgICBzdGFydFdpdGhTcGFjZSA9IHRydWU7XG4gICAgICAgIGVsc2UgaWYgKGNoID09PSAnXFxuJylcbiAgICAgICAgICAgIHN0YXJ0TmxQb3MgPSBzdGFydEVuZDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxldCBzdGFydCA9IHZhbHVlLnN1YnN0cmluZygwLCBzdGFydE5sUG9zIDwgc3RhcnRFbmQgPyBzdGFydE5sUG9zICsgMSA6IHN0YXJ0RW5kKTtcbiAgICBpZiAoc3RhcnQpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoc3RhcnQubGVuZ3RoKTtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5yZXBsYWNlKC9cXG4rL2csIGAkJiR7aW5kZW50fWApO1xuICAgIH1cbiAgICBjb25zdCBpbmRlbnRTaXplID0gaW5kZW50ID8gJzInIDogJzEnOyAvLyByb290IGlzIGF0IC0xXG4gICAgLy8gTGVhZGluZyB8IG9yID4gaXMgYWRkZWQgbGF0ZXJcbiAgICBsZXQgaGVhZGVyID0gKHN0YXJ0V2l0aFNwYWNlID8gaW5kZW50U2l6ZSA6ICcnKSArIGNob21wO1xuICAgIGlmIChjb21tZW50KSB7XG4gICAgICAgIGhlYWRlciArPSAnICcgKyBjb21tZW50U3RyaW5nKGNvbW1lbnQucmVwbGFjZSgvID9bXFxyXFxuXSsvZywgJyAnKSk7XG4gICAgICAgIGlmIChvbkNvbW1lbnQpXG4gICAgICAgICAgICBvbkNvbW1lbnQoKTtcbiAgICB9XG4gICAgaWYgKCFsaXRlcmFsKSB7XG4gICAgICAgIGNvbnN0IGZvbGRlZFZhbHVlID0gdmFsdWVcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4rL2csICdcXG4kJicpXG4gICAgICAgICAgICAucmVwbGFjZSgvKD86XnxcXG4pKFtcXHQgXS4qKSg/OihbXFxuXFx0IF0qKVxcbig/IVtcXG5cXHQgXSkpPy9nLCAnJDEkMicpIC8vIG1vcmUtaW5kZW50ZWQgbGluZXMgYXJlbid0IGZvbGRlZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgXiBtb3JlLWluZC4gXiBlbXB0eSAgICAgXiBjYXB0dXJlIG5leHQgZW1wdHkgbGluZXMgb25seSBhdCBlbmQgb2YgaW5kZW50XG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuKy9nLCBgJCYke2luZGVudH1gKTtcbiAgICAgICAgbGV0IGxpdGVyYWxGYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICBjb25zdCBmb2xkT3B0aW9ucyA9IGdldEZvbGRPcHRpb25zKGN0eCwgdHJ1ZSk7XG4gICAgICAgIGlmIChibG9ja1F1b3RlICE9PSAnZm9sZGVkJyAmJiB0eXBlICE9PSBTY2FsYXIuQkxPQ0tfRk9MREVEKSB7XG4gICAgICAgICAgICBmb2xkT3B0aW9ucy5vbk92ZXJmbG93ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxpdGVyYWxGYWxsYmFjayA9IHRydWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJvZHkgPSBmb2xkRmxvd0xpbmVzKGAke3N0YXJ0fSR7Zm9sZGVkVmFsdWV9JHtlbmR9YCwgaW5kZW50LCBGT0xEX0JMT0NLLCBmb2xkT3B0aW9ucyk7XG4gICAgICAgIGlmICghbGl0ZXJhbEZhbGxiYWNrKVxuICAgICAgICAgICAgcmV0dXJuIGA+JHtoZWFkZXJ9XFxuJHtpbmRlbnR9JHtib2R5fWA7XG4gICAgfVxuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxuKy9nLCBgJCYke2luZGVudH1gKTtcbiAgICByZXR1cm4gYHwke2hlYWRlcn1cXG4ke2luZGVudH0ke3N0YXJ0fSR7dmFsdWV9JHtlbmR9YDtcbn1cbmZ1bmN0aW9uIHBsYWluU3RyaW5nKGl0ZW0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgIGNvbnN0IHsgdHlwZSwgdmFsdWUgfSA9IGl0ZW07XG4gICAgY29uc3QgeyBhY3R1YWxTdHJpbmcsIGltcGxpY2l0S2V5LCBpbmRlbnQsIGluZGVudFN0ZXAsIGluRmxvdyB9ID0gY3R4O1xuICAgIGlmICgoaW1wbGljaXRLZXkgJiYgdmFsdWUuaW5jbHVkZXMoJ1xcbicpKSB8fFxuICAgICAgICAoaW5GbG93ICYmIC9bW1xcXXt9LF0vLnRlc3QodmFsdWUpKSkge1xuICAgICAgICByZXR1cm4gcXVvdGVkU3RyaW5nKHZhbHVlLCBjdHgpO1xuICAgIH1cbiAgICBpZiAoL15bXFxuXFx0ICxbXFxde30jJiohfD4nXCIlQGBdfF5bPy1dJHxeWz8tXVsgXFx0XXxbXFxuOl1bIFxcdF18WyBcXHRdXFxufFtcXG5cXHQgXSN8W1xcblxcdCA6XSQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIC8vIG5vdCBhbGxvd2VkOlxuICAgICAgICAvLyAtICctJyBvciAnPydcbiAgICAgICAgLy8gLSBzdGFydCB3aXRoIGFuIGluZGljYXRvciBjaGFyYWN0ZXIgKGV4Y2VwdCBbPzotXSkgb3IgL1s/LV0gL1xuICAgICAgICAvLyAtICdcXG4gJywgJzogJyBvciAnIFxcbicgYW55d2hlcmVcbiAgICAgICAgLy8gLSAnIycgbm90IHByZWNlZGVkIGJ5IGEgbm9uLXNwYWNlIGNoYXJcbiAgICAgICAgLy8gLSBlbmQgd2l0aCAnICcgb3IgJzonXG4gICAgICAgIHJldHVybiBpbXBsaWNpdEtleSB8fCBpbkZsb3cgfHwgIXZhbHVlLmluY2x1ZGVzKCdcXG4nKVxuICAgICAgICAgICAgPyBxdW90ZWRTdHJpbmcodmFsdWUsIGN0eClcbiAgICAgICAgICAgIDogYmxvY2tTdHJpbmcoaXRlbSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICB9XG4gICAgaWYgKCFpbXBsaWNpdEtleSAmJlxuICAgICAgICAhaW5GbG93ICYmXG4gICAgICAgIHR5cGUgIT09IFNjYWxhci5QTEFJTiAmJlxuICAgICAgICB2YWx1ZS5pbmNsdWRlcygnXFxuJykpIHtcbiAgICAgICAgLy8gV2hlcmUgYWxsb3dlZCAmIHR5cGUgbm90IHNldCBleHBsaWNpdGx5LCBwcmVmZXIgYmxvY2sgc3R5bGUgZm9yIG11bHRpbGluZSBzdHJpbmdzXG4gICAgICAgIHJldHVybiBibG9ja1N0cmluZyhpdGVtLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgIH1cbiAgICBpZiAoY29udGFpbnNEb2N1bWVudE1hcmtlcih2YWx1ZSkpIHtcbiAgICAgICAgaWYgKGluZGVudCA9PT0gJycpIHtcbiAgICAgICAgICAgIGN0eC5mb3JjZUJsb2NrSW5kZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBibG9ja1N0cmluZyhpdGVtLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGltcGxpY2l0S2V5ICYmIGluZGVudCA9PT0gaW5kZW50U3RlcCkge1xuICAgICAgICAgICAgcmV0dXJuIHF1b3RlZFN0cmluZyh2YWx1ZSwgY3R4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzdHIgPSB2YWx1ZS5yZXBsYWNlKC9cXG4rL2csIGAkJlxcbiR7aW5kZW50fWApO1xuICAgIC8vIFZlcmlmeSB0aGF0IG91dHB1dCB3aWxsIGJlIHBhcnNlZCBhcyBhIHN0cmluZywgYXMgZS5nLiBwbGFpbiBudW1iZXJzIGFuZFxuICAgIC8vIGJvb2xlYW5zIGdldCBwYXJzZWQgd2l0aCB0aG9zZSB0eXBlcyBpbiB2MS4yIChlLmcuICc0MicsICd0cnVlJyAmICcwLjllLTMnKSxcbiAgICAvLyBhbmQgb3RoZXJzIGluIHYxLjEuXG4gICAgaWYgKGFjdHVhbFN0cmluZykge1xuICAgICAgICBjb25zdCB0ZXN0ID0gKHRhZykgPT4gdGFnLmRlZmF1bHQgJiYgdGFnLnRhZyAhPT0gJ3RhZzp5YW1sLm9yZywyMDAyOnN0cicgJiYgdGFnLnRlc3Q/LnRlc3Qoc3RyKTtcbiAgICAgICAgY29uc3QgeyBjb21wYXQsIHRhZ3MgfSA9IGN0eC5kb2Muc2NoZW1hO1xuICAgICAgICBpZiAodGFncy5zb21lKHRlc3QpIHx8IGNvbXBhdD8uc29tZSh0ZXN0KSlcbiAgICAgICAgICAgIHJldHVybiBxdW90ZWRTdHJpbmcodmFsdWUsIGN0eCk7XG4gICAgfVxuICAgIHJldHVybiBpbXBsaWNpdEtleVxuICAgICAgICA/IHN0clxuICAgICAgICA6IGZvbGRGbG93TGluZXMoc3RyLCBpbmRlbnQsIEZPTERfRkxPVywgZ2V0Rm9sZE9wdGlvbnMoY3R4LCBmYWxzZSkpO1xufVxuZnVuY3Rpb24gc3RyaW5naWZ5U3RyaW5nKGl0ZW0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgIGNvbnN0IHsgaW1wbGljaXRLZXksIGluRmxvdyB9ID0gY3R4O1xuICAgIGNvbnN0IHNzID0gdHlwZW9mIGl0ZW0udmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICAgID8gaXRlbVxuICAgICAgICA6IE9iamVjdC5hc3NpZ24oe30sIGl0ZW0sIHsgdmFsdWU6IFN0cmluZyhpdGVtLnZhbHVlKSB9KTtcbiAgICBsZXQgeyB0eXBlIH0gPSBpdGVtO1xuICAgIGlmICh0eXBlICE9PSBTY2FsYXIuUVVPVEVfRE9VQkxFKSB7XG4gICAgICAgIC8vIGZvcmNlIGRvdWJsZSBxdW90ZXMgb24gY29udHJvbCBjaGFyYWN0ZXJzICYgdW5wYWlyZWQgc3Vycm9nYXRlc1xuICAgICAgICBpZiAoL1tcXHgwMC1cXHgwOFxceDBiLVxceDFmXFx4N2YtXFx4OWZcXHV7RDgwMH0tXFx1e0RGRkZ9XS91LnRlc3Qoc3MudmFsdWUpKVxuICAgICAgICAgICAgdHlwZSA9IFNjYWxhci5RVU9URV9ET1VCTEU7XG4gICAgfVxuICAgIGNvbnN0IF9zdHJpbmdpZnkgPSAoX3R5cGUpID0+IHtcbiAgICAgICAgc3dpdGNoIChfdHlwZSkge1xuICAgICAgICAgICAgY2FzZSBTY2FsYXIuQkxPQ0tfRk9MREVEOlxuICAgICAgICAgICAgY2FzZSBTY2FsYXIuQkxPQ0tfTElURVJBTDpcbiAgICAgICAgICAgICAgICByZXR1cm4gaW1wbGljaXRLZXkgfHwgaW5GbG93XG4gICAgICAgICAgICAgICAgICAgID8gcXVvdGVkU3RyaW5nKHNzLnZhbHVlLCBjdHgpIC8vIGJsb2NrcyBhcmUgbm90IHZhbGlkIGluc2lkZSBmbG93IGNvbnRhaW5lcnNcbiAgICAgICAgICAgICAgICAgICAgOiBibG9ja1N0cmluZyhzcywgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICAgICAgICAgIGNhc2UgU2NhbGFyLlFVT1RFX0RPVUJMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gZG91YmxlUXVvdGVkU3RyaW5nKHNzLnZhbHVlLCBjdHgpO1xuICAgICAgICAgICAgY2FzZSBTY2FsYXIuUVVPVEVfU0lOR0xFOlxuICAgICAgICAgICAgICAgIHJldHVybiBzaW5nbGVRdW90ZWRTdHJpbmcoc3MudmFsdWUsIGN0eCk7XG4gICAgICAgICAgICBjYXNlIFNjYWxhci5QTEFJTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxhaW5TdHJpbmcoc3MsIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBsZXQgcmVzID0gX3N0cmluZ2lmeSh0eXBlKTtcbiAgICBpZiAocmVzID09PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHsgZGVmYXVsdEtleVR5cGUsIGRlZmF1bHRTdHJpbmdUeXBlIH0gPSBjdHgub3B0aW9ucztcbiAgICAgICAgY29uc3QgdCA9IChpbXBsaWNpdEtleSAmJiBkZWZhdWx0S2V5VHlwZSkgfHwgZGVmYXVsdFN0cmluZ1R5cGU7XG4gICAgICAgIHJlcyA9IF9zdHJpbmdpZnkodCk7XG4gICAgICAgIGlmIChyZXMgPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGRlZmF1bHQgc3RyaW5nIHR5cGUgJHt0fWApO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgeyBzdHJpbmdpZnlTdHJpbmcgfTtcbiIsICJpbXBvcnQgeyBhbmNob3JJc1ZhbGlkIH0gZnJvbSAnLi4vZG9jL2FuY2hvcnMuanMnO1xuaW1wb3J0IHsgaXNQYWlyLCBpc0FsaWFzLCBpc05vZGUsIGlzU2NhbGFyLCBpc0NvbGxlY3Rpb24gfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnlDb21tZW50IH0gZnJvbSAnLi9zdHJpbmdpZnlDb21tZW50LmpzJztcbmltcG9ydCB7IHN0cmluZ2lmeVN0cmluZyB9IGZyb20gJy4vc3RyaW5naWZ5U3RyaW5nLmpzJztcblxuZnVuY3Rpb24gY3JlYXRlU3RyaW5naWZ5Q29udGV4dChkb2MsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgYmxvY2tRdW90ZTogdHJ1ZSxcbiAgICAgICAgY29tbWVudFN0cmluZzogc3RyaW5naWZ5Q29tbWVudCxcbiAgICAgICAgZGVmYXVsdEtleVR5cGU6IG51bGwsXG4gICAgICAgIGRlZmF1bHRTdHJpbmdUeXBlOiAnUExBSU4nLFxuICAgICAgICBkaXJlY3RpdmVzOiBudWxsLFxuICAgICAgICBkb3VibGVRdW90ZWRBc0pTT046IGZhbHNlLFxuICAgICAgICBkb3VibGVRdW90ZWRNaW5NdWx0aUxpbmVMZW5ndGg6IDQwLFxuICAgICAgICBmYWxzZVN0cjogJ2ZhbHNlJyxcbiAgICAgICAgZmxvd0NvbGxlY3Rpb25QYWRkaW5nOiB0cnVlLFxuICAgICAgICBpbmRlbnRTZXE6IHRydWUsXG4gICAgICAgIGxpbmVXaWR0aDogODAsXG4gICAgICAgIG1pbkNvbnRlbnRXaWR0aDogMjAsXG4gICAgICAgIG51bGxTdHI6ICdudWxsJyxcbiAgICAgICAgc2ltcGxlS2V5czogZmFsc2UsXG4gICAgICAgIHNpbmdsZVF1b3RlOiBudWxsLFxuICAgICAgICB0cnVlU3RyOiAndHJ1ZScsXG4gICAgICAgIHZlcmlmeUFsaWFzT3JkZXI6IHRydWVcbiAgICB9LCBkb2Muc2NoZW1hLnRvU3RyaW5nT3B0aW9ucywgb3B0aW9ucyk7XG4gICAgbGV0IGluRmxvdztcbiAgICBzd2l0Y2ggKG9wdC5jb2xsZWN0aW9uU3R5bGUpIHtcbiAgICAgICAgY2FzZSAnYmxvY2snOlxuICAgICAgICAgICAgaW5GbG93ID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZmxvdyc6XG4gICAgICAgICAgICBpbkZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBpbkZsb3cgPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBhbmNob3JzOiBuZXcgU2V0KCksXG4gICAgICAgIGRvYyxcbiAgICAgICAgZmxvd0NvbGxlY3Rpb25QYWRkaW5nOiBvcHQuZmxvd0NvbGxlY3Rpb25QYWRkaW5nID8gJyAnIDogJycsXG4gICAgICAgIGluZGVudDogJycsXG4gICAgICAgIGluZGVudFN0ZXA6IHR5cGVvZiBvcHQuaW5kZW50ID09PSAnbnVtYmVyJyA/ICcgJy5yZXBlYXQob3B0LmluZGVudCkgOiAnICAnLFxuICAgICAgICBpbkZsb3csXG4gICAgICAgIG9wdGlvbnM6IG9wdFxuICAgIH07XG59XG5mdW5jdGlvbiBnZXRUYWdPYmplY3QodGFncywgaXRlbSkge1xuICAgIGlmIChpdGVtLnRhZykge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHRhZ3MuZmlsdGVyKHQgPT4gdC50YWcgPT09IGl0ZW0udGFnKTtcbiAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCA+IDApXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2guZmluZCh0ID0+IHQuZm9ybWF0ID09PSBpdGVtLmZvcm1hdCkgPz8gbWF0Y2hbMF07XG4gICAgfVxuICAgIGxldCB0YWdPYmogPSB1bmRlZmluZWQ7XG4gICAgbGV0IG9iajtcbiAgICBpZiAoaXNTY2FsYXIoaXRlbSkpIHtcbiAgICAgICAgb2JqID0gaXRlbS52YWx1ZTtcbiAgICAgICAgbGV0IG1hdGNoID0gdGFncy5maWx0ZXIodCA9PiB0LmlkZW50aWZ5Py4ob2JqKSk7XG4gICAgICAgIGlmIChtYXRjaC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXN0TWF0Y2ggPSBtYXRjaC5maWx0ZXIodCA9PiB0LnRlc3QpO1xuICAgICAgICAgICAgaWYgKHRlc3RNYXRjaC5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgIG1hdGNoID0gdGVzdE1hdGNoO1xuICAgICAgICB9XG4gICAgICAgIHRhZ09iaiA9XG4gICAgICAgICAgICBtYXRjaC5maW5kKHQgPT4gdC5mb3JtYXQgPT09IGl0ZW0uZm9ybWF0KSA/PyBtYXRjaC5maW5kKHQgPT4gIXQuZm9ybWF0KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG9iaiA9IGl0ZW07XG4gICAgICAgIHRhZ09iaiA9IHRhZ3MuZmluZCh0ID0+IHQubm9kZUNsYXNzICYmIG9iaiBpbnN0YW5jZW9mIHQubm9kZUNsYXNzKTtcbiAgICB9XG4gICAgaWYgKCF0YWdPYmopIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IG9iaj8uY29uc3RydWN0b3I/Lm5hbWUgPz8gKG9iaiA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiBvYmopO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRhZyBub3QgcmVzb2x2ZWQgZm9yICR7bmFtZX0gdmFsdWVgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhZ09iajtcbn1cbi8vIG5lZWRzIHRvIGJlIGNhbGxlZCBiZWZvcmUgdmFsdWUgc3RyaW5naWZpZXIgdG8gYWxsb3cgZm9yIGNpcmN1bGFyIGFuY2hvciByZWZzXG5mdW5jdGlvbiBzdHJpbmdpZnlQcm9wcyhub2RlLCB0YWdPYmosIHsgYW5jaG9ycywgZG9jIH0pIHtcbiAgICBpZiAoIWRvYy5kaXJlY3RpdmVzKVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgY29uc3QgcHJvcHMgPSBbXTtcbiAgICBjb25zdCBhbmNob3IgPSAoaXNTY2FsYXIobm9kZSkgfHwgaXNDb2xsZWN0aW9uKG5vZGUpKSAmJiBub2RlLmFuY2hvcjtcbiAgICBpZiAoYW5jaG9yICYmIGFuY2hvcklzVmFsaWQoYW5jaG9yKSkge1xuICAgICAgICBhbmNob3JzLmFkZChhbmNob3IpO1xuICAgICAgICBwcm9wcy5wdXNoKGAmJHthbmNob3J9YCk7XG4gICAgfVxuICAgIGNvbnN0IHRhZyA9IG5vZGUudGFnID8/ICh0YWdPYmouZGVmYXVsdCA/IG51bGwgOiB0YWdPYmoudGFnKTtcbiAgICBpZiAodGFnKVxuICAgICAgICBwcm9wcy5wdXNoKGRvYy5kaXJlY3RpdmVzLnRhZ1N0cmluZyh0YWcpKTtcbiAgICByZXR1cm4gcHJvcHMuam9pbignICcpO1xufVxuZnVuY3Rpb24gc3RyaW5naWZ5KGl0ZW0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgIGlmIChpc1BhaXIoaXRlbSkpXG4gICAgICAgIHJldHVybiBpdGVtLnRvU3RyaW5nKGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCk7XG4gICAgaWYgKGlzQWxpYXMoaXRlbSkpIHtcbiAgICAgICAgaWYgKGN0eC5kb2MuZGlyZWN0aXZlcylcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnRvU3RyaW5nKGN0eCk7XG4gICAgICAgIGlmIChjdHgucmVzb2x2ZWRBbGlhc2VzPy5oYXMoaXRlbSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYENhbm5vdCBzdHJpbmdpZnkgY2lyY3VsYXIgc3RydWN0dXJlIHdpdGhvdXQgYWxpYXMgbm9kZXNgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjdHgucmVzb2x2ZWRBbGlhc2VzKVxuICAgICAgICAgICAgICAgIGN0eC5yZXNvbHZlZEFsaWFzZXMuYWRkKGl0ZW0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGN0eC5yZXNvbHZlZEFsaWFzZXMgPSBuZXcgU2V0KFtpdGVtXSk7XG4gICAgICAgICAgICBpdGVtID0gaXRlbS5yZXNvbHZlKGN0eC5kb2MpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCB0YWdPYmogPSB1bmRlZmluZWQ7XG4gICAgY29uc3Qgbm9kZSA9IGlzTm9kZShpdGVtKVxuICAgICAgICA/IGl0ZW1cbiAgICAgICAgOiBjdHguZG9jLmNyZWF0ZU5vZGUoaXRlbSwgeyBvblRhZ09iajogbyA9PiAodGFnT2JqID0gbykgfSk7XG4gICAgdGFnT2JqID8/ICh0YWdPYmogPSBnZXRUYWdPYmplY3QoY3R4LmRvYy5zY2hlbWEudGFncywgbm9kZSkpO1xuICAgIGNvbnN0IHByb3BzID0gc3RyaW5naWZ5UHJvcHMobm9kZSwgdGFnT2JqLCBjdHgpO1xuICAgIGlmIChwcm9wcy5sZW5ndGggPiAwKVxuICAgICAgICBjdHguaW5kZW50QXRTdGFydCA9IChjdHguaW5kZW50QXRTdGFydCA/PyAwKSArIHByb3BzLmxlbmd0aCArIDE7XG4gICAgY29uc3Qgc3RyID0gdHlwZW9mIHRhZ09iai5zdHJpbmdpZnkgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyB0YWdPYmouc3RyaW5naWZ5KG5vZGUsIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcClcbiAgICAgICAgOiBpc1NjYWxhcihub2RlKVxuICAgICAgICAgICAgPyBzdHJpbmdpZnlTdHJpbmcobm9kZSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKVxuICAgICAgICAgICAgOiBub2RlLnRvU3RyaW5nKGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCk7XG4gICAgaWYgKCFwcm9wcylcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICByZXR1cm4gaXNTY2FsYXIobm9kZSkgfHwgc3RyWzBdID09PSAneycgfHwgc3RyWzBdID09PSAnWydcbiAgICAgICAgPyBgJHtwcm9wc30gJHtzdHJ9YFxuICAgICAgICA6IGAke3Byb3BzfVxcbiR7Y3R4LmluZGVudH0ke3N0cn1gO1xufVxuXG5leHBvcnQgeyBjcmVhdGVTdHJpbmdpZnlDb250ZXh0LCBzdHJpbmdpZnkgfTtcbiIsICJpbXBvcnQgeyBpc0NvbGxlY3Rpb24sIGlzTm9kZSwgaXNTY2FsYXIsIGlzU2VxIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vbm9kZXMvU2NhbGFyLmpzJztcbmltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmltcG9ydCB7IGxpbmVDb21tZW50LCBpbmRlbnRDb21tZW50IH0gZnJvbSAnLi9zdHJpbmdpZnlDb21tZW50LmpzJztcblxuZnVuY3Rpb24gc3RyaW5naWZ5UGFpcih7IGtleSwgdmFsdWUgfSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgY29uc3QgeyBhbGxOdWxsVmFsdWVzLCBkb2MsIGluZGVudCwgaW5kZW50U3RlcCwgb3B0aW9uczogeyBjb21tZW50U3RyaW5nLCBpbmRlbnRTZXEsIHNpbXBsZUtleXMgfSB9ID0gY3R4O1xuICAgIGxldCBrZXlDb21tZW50ID0gKGlzTm9kZShrZXkpICYmIGtleS5jb21tZW50KSB8fCBudWxsO1xuICAgIGlmIChzaW1wbGVLZXlzKSB7XG4gICAgICAgIGlmIChrZXlDb21tZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dpdGggc2ltcGxlIGtleXMsIGtleSBub2RlcyBjYW5ub3QgaGF2ZSBjb21tZW50cycpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0NvbGxlY3Rpb24oa2V5KSB8fCAoIWlzTm9kZShrZXkpICYmIHR5cGVvZiBrZXkgPT09ICdvYmplY3QnKSkge1xuICAgICAgICAgICAgY29uc3QgbXNnID0gJ1dpdGggc2ltcGxlIGtleXMsIGNvbGxlY3Rpb24gY2Fubm90IGJlIHVzZWQgYXMgYSBrZXkgdmFsdWUnO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGV4cGxpY2l0S2V5ID0gIXNpbXBsZUtleXMgJiZcbiAgICAgICAgKCFrZXkgfHxcbiAgICAgICAgICAgIChrZXlDb21tZW50ICYmIHZhbHVlID09IG51bGwgJiYgIWN0eC5pbkZsb3cpIHx8XG4gICAgICAgICAgICBpc0NvbGxlY3Rpb24oa2V5KSB8fFxuICAgICAgICAgICAgKGlzU2NhbGFyKGtleSlcbiAgICAgICAgICAgICAgICA/IGtleS50eXBlID09PSBTY2FsYXIuQkxPQ0tfRk9MREVEIHx8IGtleS50eXBlID09PSBTY2FsYXIuQkxPQ0tfTElURVJBTFxuICAgICAgICAgICAgICAgIDogdHlwZW9mIGtleSA9PT0gJ29iamVjdCcpKTtcbiAgICBjdHggPSBPYmplY3QuYXNzaWduKHt9LCBjdHgsIHtcbiAgICAgICAgYWxsTnVsbFZhbHVlczogZmFsc2UsXG4gICAgICAgIGltcGxpY2l0S2V5OiAhZXhwbGljaXRLZXkgJiYgKHNpbXBsZUtleXMgfHwgIWFsbE51bGxWYWx1ZXMpLFxuICAgICAgICBpbmRlbnQ6IGluZGVudCArIGluZGVudFN0ZXBcbiAgICB9KTtcbiAgICBsZXQga2V5Q29tbWVudERvbmUgPSBmYWxzZTtcbiAgICBsZXQgY2hvbXBLZWVwID0gZmFsc2U7XG4gICAgbGV0IHN0ciA9IHN0cmluZ2lmeShrZXksIGN0eCwgKCkgPT4gKGtleUNvbW1lbnREb25lID0gdHJ1ZSksICgpID0+IChjaG9tcEtlZXAgPSB0cnVlKSk7XG4gICAgaWYgKCFleHBsaWNpdEtleSAmJiAhY3R4LmluRmxvdyAmJiBzdHIubGVuZ3RoID4gMTAyNCkge1xuICAgICAgICBpZiAoc2ltcGxlS2V5cylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignV2l0aCBzaW1wbGUga2V5cywgc2luZ2xlIGxpbmUgc2NhbGFyIG11c3Qgbm90IHNwYW4gbW9yZSB0aGFuIDEwMjQgY2hhcmFjdGVycycpO1xuICAgICAgICBleHBsaWNpdEtleSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChjdHguaW5GbG93KSB7XG4gICAgICAgIGlmIChhbGxOdWxsVmFsdWVzIHx8IHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChrZXlDb21tZW50RG9uZSAmJiBvbkNvbW1lbnQpXG4gICAgICAgICAgICAgICAgb25Db21tZW50KCk7XG4gICAgICAgICAgICByZXR1cm4gc3RyID09PSAnJyA/ICc/JyA6IGV4cGxpY2l0S2V5ID8gYD8gJHtzdHJ9YCA6IHN0cjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgoYWxsTnVsbFZhbHVlcyAmJiAhc2ltcGxlS2V5cykgfHwgKHZhbHVlID09IG51bGwgJiYgZXhwbGljaXRLZXkpKSB7XG4gICAgICAgIHN0ciA9IGA/ICR7c3RyfWA7XG4gICAgICAgIGlmIChrZXlDb21tZW50ICYmICFrZXlDb21tZW50RG9uZSkge1xuICAgICAgICAgICAgc3RyICs9IGxpbmVDb21tZW50KHN0ciwgY3R4LmluZGVudCwgY29tbWVudFN0cmluZyhrZXlDb21tZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2hvbXBLZWVwICYmIG9uQ2hvbXBLZWVwKVxuICAgICAgICAgICAgb25DaG9tcEtlZXAoKTtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgaWYgKGtleUNvbW1lbnREb25lKVxuICAgICAgICBrZXlDb21tZW50ID0gbnVsbDtcbiAgICBpZiAoZXhwbGljaXRLZXkpIHtcbiAgICAgICAgaWYgKGtleUNvbW1lbnQpXG4gICAgICAgICAgICBzdHIgKz0gbGluZUNvbW1lbnQoc3RyLCBjdHguaW5kZW50LCBjb21tZW50U3RyaW5nKGtleUNvbW1lbnQpKTtcbiAgICAgICAgc3RyID0gYD8gJHtzdHJ9XFxuJHtpbmRlbnR9OmA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdHIgPSBgJHtzdHJ9OmA7XG4gICAgICAgIGlmIChrZXlDb21tZW50KVxuICAgICAgICAgICAgc3RyICs9IGxpbmVDb21tZW50KHN0ciwgY3R4LmluZGVudCwgY29tbWVudFN0cmluZyhrZXlDb21tZW50KSk7XG4gICAgfVxuICAgIGxldCB2c2IsIHZjYiwgdmFsdWVDb21tZW50O1xuICAgIGlmIChpc05vZGUodmFsdWUpKSB7XG4gICAgICAgIHZzYiA9ICEhdmFsdWUuc3BhY2VCZWZvcmU7XG4gICAgICAgIHZjYiA9IHZhbHVlLmNvbW1lbnRCZWZvcmU7XG4gICAgICAgIHZhbHVlQ29tbWVudCA9IHZhbHVlLmNvbW1lbnQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2c2IgPSBmYWxzZTtcbiAgICAgICAgdmNiID0gbnVsbDtcbiAgICAgICAgdmFsdWVDb21tZW50ID0gbnVsbDtcbiAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpXG4gICAgICAgICAgICB2YWx1ZSA9IGRvYy5jcmVhdGVOb2RlKHZhbHVlKTtcbiAgICB9XG4gICAgY3R4LmltcGxpY2l0S2V5ID0gZmFsc2U7XG4gICAgaWYgKCFleHBsaWNpdEtleSAmJiAha2V5Q29tbWVudCAmJiBpc1NjYWxhcih2YWx1ZSkpXG4gICAgICAgIGN0eC5pbmRlbnRBdFN0YXJ0ID0gc3RyLmxlbmd0aCArIDE7XG4gICAgY2hvbXBLZWVwID0gZmFsc2U7XG4gICAgaWYgKCFpbmRlbnRTZXEgJiZcbiAgICAgICAgaW5kZW50U3RlcC5sZW5ndGggPj0gMiAmJlxuICAgICAgICAhY3R4LmluRmxvdyAmJlxuICAgICAgICAhZXhwbGljaXRLZXkgJiZcbiAgICAgICAgaXNTZXEodmFsdWUpICYmXG4gICAgICAgICF2YWx1ZS5mbG93ICYmXG4gICAgICAgICF2YWx1ZS50YWcgJiZcbiAgICAgICAgIXZhbHVlLmFuY2hvcikge1xuICAgICAgICAvLyBJZiBpbmRlbnRTZXEgPT09IGZhbHNlLCBjb25zaWRlciAnLSAnIGFzIHBhcnQgb2YgaW5kZW50YXRpb24gd2hlcmUgcG9zc2libGVcbiAgICAgICAgY3R4LmluZGVudCA9IGN0eC5pbmRlbnQuc3Vic3RyaW5nKDIpO1xuICAgIH1cbiAgICBsZXQgdmFsdWVDb21tZW50RG9uZSA9IGZhbHNlO1xuICAgIGNvbnN0IHZhbHVlU3RyID0gc3RyaW5naWZ5KHZhbHVlLCBjdHgsICgpID0+ICh2YWx1ZUNvbW1lbnREb25lID0gdHJ1ZSksICgpID0+IChjaG9tcEtlZXAgPSB0cnVlKSk7XG4gICAgbGV0IHdzID0gJyAnO1xuICAgIGlmIChrZXlDb21tZW50IHx8IHZzYiB8fCB2Y2IpIHtcbiAgICAgICAgd3MgPSB2c2IgPyAnXFxuJyA6ICcnO1xuICAgICAgICBpZiAodmNiKSB7XG4gICAgICAgICAgICBjb25zdCBjcyA9IGNvbW1lbnRTdHJpbmcodmNiKTtcbiAgICAgICAgICAgIHdzICs9IGBcXG4ke2luZGVudENvbW1lbnQoY3MsIGN0eC5pbmRlbnQpfWA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlU3RyID09PSAnJyAmJiAhY3R4LmluRmxvdykge1xuICAgICAgICAgICAgaWYgKHdzID09PSAnXFxuJyAmJiB2YWx1ZUNvbW1lbnQpXG4gICAgICAgICAgICAgICAgd3MgPSAnXFxuXFxuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdzICs9IGBcXG4ke2N0eC5pbmRlbnR9YDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICghZXhwbGljaXRLZXkgJiYgaXNDb2xsZWN0aW9uKHZhbHVlKSkge1xuICAgICAgICBjb25zdCB2czAgPSB2YWx1ZVN0clswXTtcbiAgICAgICAgY29uc3QgbmwwID0gdmFsdWVTdHIuaW5kZXhPZignXFxuJyk7XG4gICAgICAgIGNvbnN0IGhhc05ld2xpbmUgPSBubDAgIT09IC0xO1xuICAgICAgICBjb25zdCBmbG93ID0gY3R4LmluRmxvdyA/PyB2YWx1ZS5mbG93ID8/IHZhbHVlLml0ZW1zLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgaWYgKGhhc05ld2xpbmUgfHwgIWZsb3cpIHtcbiAgICAgICAgICAgIGxldCBoYXNQcm9wc0xpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChoYXNOZXdsaW5lICYmICh2czAgPT09ICcmJyB8fCB2czAgPT09ICchJykpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3AwID0gdmFsdWVTdHIuaW5kZXhPZignICcpO1xuICAgICAgICAgICAgICAgIGlmICh2czAgPT09ICcmJyAmJlxuICAgICAgICAgICAgICAgICAgICBzcDAgIT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIHNwMCA8IG5sMCAmJlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVN0cltzcDAgKyAxXSA9PT0gJyEnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwMCA9IHZhbHVlU3RyLmluZGV4T2YoJyAnLCBzcDAgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNwMCA9PT0gLTEgfHwgbmwwIDwgc3AwKVxuICAgICAgICAgICAgICAgICAgICBoYXNQcm9wc0xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYXNQcm9wc0xpbmUpXG4gICAgICAgICAgICAgICAgd3MgPSBgXFxuJHtjdHguaW5kZW50fWA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWVTdHIgPT09ICcnIHx8IHZhbHVlU3RyWzBdID09PSAnXFxuJykge1xuICAgICAgICB3cyA9ICcnO1xuICAgIH1cbiAgICBzdHIgKz0gd3MgKyB2YWx1ZVN0cjtcbiAgICBpZiAoY3R4LmluRmxvdykge1xuICAgICAgICBpZiAodmFsdWVDb21tZW50RG9uZSAmJiBvbkNvbW1lbnQpXG4gICAgICAgICAgICBvbkNvbW1lbnQoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWVDb21tZW50ICYmICF2YWx1ZUNvbW1lbnREb25lKSB7XG4gICAgICAgIHN0ciArPSBsaW5lQ29tbWVudChzdHIsIGN0eC5pbmRlbnQsIGNvbW1lbnRTdHJpbmcodmFsdWVDb21tZW50KSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGNob21wS2VlcCAmJiBvbkNob21wS2VlcCkge1xuICAgICAgICBvbkNob21wS2VlcCgpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuXG5leHBvcnQgeyBzdHJpbmdpZnlQYWlyIH07XG4iLCAiZnVuY3Rpb24gZGVidWcobG9nTGV2ZWwsIC4uLm1lc3NhZ2VzKSB7XG4gICAgaWYgKGxvZ0xldmVsID09PSAnZGVidWcnKVxuICAgICAgICBjb25zb2xlLmxvZyguLi5tZXNzYWdlcyk7XG59XG5mdW5jdGlvbiB3YXJuKGxvZ0xldmVsLCB3YXJuaW5nKSB7XG4gICAgaWYgKGxvZ0xldmVsID09PSAnZGVidWcnIHx8IGxvZ0xldmVsID09PSAnd2FybicpIHtcbiAgICAgICAgY29uc29sZS53YXJuKHdhcm5pbmcpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgZGVidWcsIHdhcm4gfTtcbiIsICJpbXBvcnQgeyBpc1NjYWxhciwgaXNBbGlhcywgaXNTZXEsIGlzTWFwIH0gZnJvbSAnLi4vLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vLi4vbm9kZXMvU2NhbGFyLmpzJztcblxuLy8gSWYgdGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCBhIG1lcmdlIGtleSBpcyBhIHNpbmdsZSBtYXBwaW5nIG5vZGUsIGVhY2ggb2Zcbi8vIGl0cyBrZXkvdmFsdWUgcGFpcnMgaXMgaW5zZXJ0ZWQgaW50byB0aGUgY3VycmVudCBtYXBwaW5nLCB1bmxlc3MgdGhlIGtleVxuLy8gYWxyZWFkeSBleGlzdHMgaW4gaXQuIElmIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhlIG1lcmdlIGtleSBpcyBhXG4vLyBzZXF1ZW5jZSwgdGhlbiB0aGlzIHNlcXVlbmNlIGlzIGV4cGVjdGVkIHRvIGNvbnRhaW4gbWFwcGluZyBub2RlcyBhbmQgZWFjaFxuLy8gb2YgdGhlc2Ugbm9kZXMgaXMgbWVyZ2VkIGluIHR1cm4gYWNjb3JkaW5nIHRvIGl0cyBvcmRlciBpbiB0aGUgc2VxdWVuY2UuXG4vLyBLZXlzIGluIG1hcHBpbmcgbm9kZXMgZWFybGllciBpbiB0aGUgc2VxdWVuY2Ugb3ZlcnJpZGUga2V5cyBzcGVjaWZpZWQgaW5cbi8vIGxhdGVyIG1hcHBpbmcgbm9kZXMuIC0tIGh0dHA6Ly95YW1sLm9yZy90eXBlL21lcmdlLmh0bWxcbmNvbnN0IE1FUkdFX0tFWSA9ICc8PCc7XG5jb25zdCBtZXJnZSA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdmFsdWUgPT09IE1FUkdFX0tFWSB8fFxuICAgICAgICAodHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJyAmJiB2YWx1ZS5kZXNjcmlwdGlvbiA9PT0gTUVSR0VfS0VZKSxcbiAgICBkZWZhdWx0OiAna2V5JyxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjptZXJnZScsXG4gICAgdGVzdDogL148PCQvLFxuICAgIHJlc29sdmU6ICgpID0+IE9iamVjdC5hc3NpZ24obmV3IFNjYWxhcihTeW1ib2woTUVSR0VfS0VZKSksIHtcbiAgICAgICAgYWRkVG9KU01hcDogYWRkTWVyZ2VUb0pTTWFwXG4gICAgfSksXG4gICAgc3RyaW5naWZ5OiAoKSA9PiBNRVJHRV9LRVlcbn07XG5jb25zdCBpc01lcmdlS2V5ID0gKGN0eCwga2V5KSA9PiAobWVyZ2UuaWRlbnRpZnkoa2V5KSB8fFxuICAgIChpc1NjYWxhcihrZXkpICYmXG4gICAgICAgICgha2V5LnR5cGUgfHwga2V5LnR5cGUgPT09IFNjYWxhci5QTEFJTikgJiZcbiAgICAgICAgbWVyZ2UuaWRlbnRpZnkoa2V5LnZhbHVlKSkpICYmXG4gICAgY3R4Py5kb2Muc2NoZW1hLnRhZ3Muc29tZSh0YWcgPT4gdGFnLnRhZyA9PT0gbWVyZ2UudGFnICYmIHRhZy5kZWZhdWx0KTtcbmZ1bmN0aW9uIGFkZE1lcmdlVG9KU01hcChjdHgsIG1hcCwgdmFsdWUpIHtcbiAgICB2YWx1ZSA9IGN0eCAmJiBpc0FsaWFzKHZhbHVlKSA/IHZhbHVlLnJlc29sdmUoY3R4LmRvYykgOiB2YWx1ZTtcbiAgICBpZiAoaXNTZXEodmFsdWUpKVxuICAgICAgICBmb3IgKGNvbnN0IGl0IG9mIHZhbHVlLml0ZW1zKVxuICAgICAgICAgICAgbWVyZ2VWYWx1ZShjdHgsIG1hcCwgaXQpO1xuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKVxuICAgICAgICBmb3IgKGNvbnN0IGl0IG9mIHZhbHVlKVxuICAgICAgICAgICAgbWVyZ2VWYWx1ZShjdHgsIG1hcCwgaXQpO1xuICAgIGVsc2VcbiAgICAgICAgbWVyZ2VWYWx1ZShjdHgsIG1hcCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gbWVyZ2VWYWx1ZShjdHgsIG1hcCwgdmFsdWUpIHtcbiAgICBjb25zdCBzb3VyY2UgPSBjdHggJiYgaXNBbGlhcyh2YWx1ZSkgPyB2YWx1ZS5yZXNvbHZlKGN0eC5kb2MpIDogdmFsdWU7XG4gICAgaWYgKCFpc01hcChzb3VyY2UpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lcmdlIHNvdXJjZXMgbXVzdCBiZSBtYXBzIG9yIG1hcCBhbGlhc2VzJyk7XG4gICAgY29uc3Qgc3JjTWFwID0gc291cmNlLnRvSlNPTihudWxsLCBjdHgsIE1hcCk7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2Ygc3JjTWFwKSB7XG4gICAgICAgIGlmIChtYXAgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgIGlmICghbWFwLmhhcyhrZXkpKVxuICAgICAgICAgICAgICAgIG1hcC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobWFwIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgICAgICBtYXAuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtYXAsIGtleSkpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtYXAsIGtleSwge1xuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwO1xufVxuXG5leHBvcnQgeyBhZGRNZXJnZVRvSlNNYXAsIGlzTWVyZ2VLZXksIG1lcmdlIH07XG4iLCAiaW1wb3J0IHsgd2FybiB9IGZyb20gJy4uL2xvZy5qcyc7XG5pbXBvcnQgeyBpc01lcmdlS2V5LCBhZGRNZXJnZVRvSlNNYXAgfSBmcm9tICcuLi9zY2hlbWEveWFtbC0xLjEvbWVyZ2UuanMnO1xuaW1wb3J0IHsgY3JlYXRlU3RyaW5naWZ5Q29udGV4dCB9IGZyb20gJy4uL3N0cmluZ2lmeS9zdHJpbmdpZnkuanMnO1xuaW1wb3J0IHsgaXNOb2RlIH0gZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyB0b0pTIH0gZnJvbSAnLi90b0pTLmpzJztcblxuZnVuY3Rpb24gYWRkUGFpclRvSlNNYXAoY3R4LCBtYXAsIHsga2V5LCB2YWx1ZSB9KSB7XG4gICAgaWYgKGlzTm9kZShrZXkpICYmIGtleS5hZGRUb0pTTWFwKVxuICAgICAgICBrZXkuYWRkVG9KU01hcChjdHgsIG1hcCwgdmFsdWUpO1xuICAgIC8vIFRPRE86IFNob3VsZCBkcm9wIHRoaXMgc3BlY2lhbCBjYXNlIGZvciBiYXJlIDw8IGhhbmRsaW5nXG4gICAgZWxzZSBpZiAoaXNNZXJnZUtleShjdHgsIGtleSkpXG4gICAgICAgIGFkZE1lcmdlVG9KU01hcChjdHgsIG1hcCwgdmFsdWUpO1xuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBqc0tleSA9IHRvSlMoa2V5LCAnJywgY3R4KTtcbiAgICAgICAgaWYgKG1hcCBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICAgICAgbWFwLnNldChqc0tleSwgdG9KUyh2YWx1ZSwganNLZXksIGN0eCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1hcCBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgICAgICAgbWFwLmFkZChqc0tleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdHJpbmdLZXkgPSBzdHJpbmdpZnlLZXkoa2V5LCBqc0tleSwgY3R4KTtcbiAgICAgICAgICAgIGNvbnN0IGpzVmFsdWUgPSB0b0pTKHZhbHVlLCBzdHJpbmdLZXksIGN0eCk7XG4gICAgICAgICAgICBpZiAoc3RyaW5nS2V5IGluIG1hcClcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobWFwLCBzdHJpbmdLZXksIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGpzVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtYXBbc3RyaW5nS2V5XSA9IGpzVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcDtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeUtleShrZXksIGpzS2V5LCBjdHgpIHtcbiAgICBpZiAoanNLZXkgPT09IG51bGwpXG4gICAgICAgIHJldHVybiAnJztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWJhc2UtdG8tc3RyaW5nXG4gICAgaWYgKHR5cGVvZiBqc0tleSAhPT0gJ29iamVjdCcpXG4gICAgICAgIHJldHVybiBTdHJpbmcoanNLZXkpO1xuICAgIGlmIChpc05vZGUoa2V5KSAmJiBjdHg/LmRvYykge1xuICAgICAgICBjb25zdCBzdHJDdHggPSBjcmVhdGVTdHJpbmdpZnlDb250ZXh0KGN0eC5kb2MsIHt9KTtcbiAgICAgICAgc3RyQ3R4LmFuY2hvcnMgPSBuZXcgU2V0KCk7XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBjdHguYW5jaG9ycy5rZXlzKCkpXG4gICAgICAgICAgICBzdHJDdHguYW5jaG9ycy5hZGQobm9kZS5hbmNob3IpO1xuICAgICAgICBzdHJDdHguaW5GbG93ID0gdHJ1ZTtcbiAgICAgICAgc3RyQ3R4LmluU3RyaW5naWZ5S2V5ID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgc3RyS2V5ID0ga2V5LnRvU3RyaW5nKHN0ckN0eCk7XG4gICAgICAgIGlmICghY3R4Lm1hcEtleVdhcm5lZCkge1xuICAgICAgICAgICAgbGV0IGpzb25TdHIgPSBKU09OLnN0cmluZ2lmeShzdHJLZXkpO1xuICAgICAgICAgICAgaWYgKGpzb25TdHIubGVuZ3RoID4gNDApXG4gICAgICAgICAgICAgICAganNvblN0ciA9IGpzb25TdHIuc3Vic3RyaW5nKDAsIDM2KSArICcuLi5cIic7XG4gICAgICAgICAgICB3YXJuKGN0eC5kb2Mub3B0aW9ucy5sb2dMZXZlbCwgYEtleXMgd2l0aCBjb2xsZWN0aW9uIHZhbHVlcyB3aWxsIGJlIHN0cmluZ2lmaWVkIGR1ZSB0byBKUyBPYmplY3QgcmVzdHJpY3Rpb25zOiAke2pzb25TdHJ9LiBTZXQgbWFwQXNNYXA6IHRydWUgdG8gdXNlIG9iamVjdCBrZXlzLmApO1xuICAgICAgICAgICAgY3R4Lm1hcEtleVdhcm5lZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cktleTtcbiAgICB9XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGpzS2V5KTtcbn1cblxuZXhwb3J0IHsgYWRkUGFpclRvSlNNYXAgfTtcbiIsICJpbXBvcnQgeyBjcmVhdGVOb2RlIH0gZnJvbSAnLi4vZG9jL2NyZWF0ZU5vZGUuanMnO1xuaW1wb3J0IHsgc3RyaW5naWZ5UGFpciB9IGZyb20gJy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlQYWlyLmpzJztcbmltcG9ydCB7IGFkZFBhaXJUb0pTTWFwIH0gZnJvbSAnLi9hZGRQYWlyVG9KU01hcC5qcyc7XG5pbXBvcnQgeyBOT0RFX1RZUEUsIFBBSVIsIGlzTm9kZSB9IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVQYWlyKGtleSwgdmFsdWUsIGN0eCkge1xuICAgIGNvbnN0IGsgPSBjcmVhdGVOb2RlKGtleSwgdW5kZWZpbmVkLCBjdHgpO1xuICAgIGNvbnN0IHYgPSBjcmVhdGVOb2RlKHZhbHVlLCB1bmRlZmluZWQsIGN0eCk7XG4gICAgcmV0dXJuIG5ldyBQYWlyKGssIHYpO1xufVxuY2xhc3MgUGFpciB7XG4gICAgY29uc3RydWN0b3Ioa2V5LCB2YWx1ZSA9IG51bGwpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIE5PREVfVFlQRSwgeyB2YWx1ZTogUEFJUiB9KTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgY2xvbmUoc2NoZW1hKSB7XG4gICAgICAgIGxldCB7IGtleSwgdmFsdWUgfSA9IHRoaXM7XG4gICAgICAgIGlmIChpc05vZGUoa2V5KSlcbiAgICAgICAgICAgIGtleSA9IGtleS5jbG9uZShzY2hlbWEpO1xuICAgICAgICBpZiAoaXNOb2RlKHZhbHVlKSlcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuY2xvbmUoc2NoZW1hKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQYWlyKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICB0b0pTT04oXywgY3R4KSB7XG4gICAgICAgIGNvbnN0IHBhaXIgPSBjdHg/Lm1hcEFzTWFwID8gbmV3IE1hcCgpIDoge307XG4gICAgICAgIHJldHVybiBhZGRQYWlyVG9KU01hcChjdHgsIHBhaXIsIHRoaXMpO1xuICAgIH1cbiAgICB0b1N0cmluZyhjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApIHtcbiAgICAgICAgcmV0dXJuIGN0eD8uZG9jXG4gICAgICAgICAgICA/IHN0cmluZ2lmeVBhaXIodGhpcywgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKVxuICAgICAgICAgICAgOiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFBhaXIsIGNyZWF0ZVBhaXIgfTtcbiIsICJpbXBvcnQgeyBpc05vZGUsIGlzUGFpciB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmltcG9ydCB7IGxpbmVDb21tZW50LCBpbmRlbnRDb21tZW50IH0gZnJvbSAnLi9zdHJpbmdpZnlDb21tZW50LmpzJztcblxuZnVuY3Rpb24gc3RyaW5naWZ5Q29sbGVjdGlvbihjb2xsZWN0aW9uLCBjdHgsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBmbG93ID0gY3R4LmluRmxvdyA/PyBjb2xsZWN0aW9uLmZsb3c7XG4gICAgY29uc3Qgc3RyaW5naWZ5ID0gZmxvdyA/IHN0cmluZ2lmeUZsb3dDb2xsZWN0aW9uIDogc3RyaW5naWZ5QmxvY2tDb2xsZWN0aW9uO1xuICAgIHJldHVybiBzdHJpbmdpZnkoY29sbGVjdGlvbiwgY3R4LCBvcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeUJsb2NrQ29sbGVjdGlvbih7IGNvbW1lbnQsIGl0ZW1zIH0sIGN0eCwgeyBibG9ja0l0ZW1QcmVmaXgsIGZsb3dDaGFycywgaXRlbUluZGVudCwgb25DaG9tcEtlZXAsIG9uQ29tbWVudCB9KSB7XG4gICAgY29uc3QgeyBpbmRlbnQsIG9wdGlvbnM6IHsgY29tbWVudFN0cmluZyB9IH0gPSBjdHg7XG4gICAgY29uc3QgaXRlbUN0eCA9IE9iamVjdC5hc3NpZ24oe30sIGN0eCwgeyBpbmRlbnQ6IGl0ZW1JbmRlbnQsIHR5cGU6IG51bGwgfSk7XG4gICAgbGV0IGNob21wS2VlcCA9IGZhbHNlOyAvLyBmbGFnIGZvciB0aGUgcHJlY2VkaW5nIG5vZGUncyBzdGF0dXNcbiAgICBjb25zdCBsaW5lcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2ldO1xuICAgICAgICBsZXQgY29tbWVudCA9IG51bGw7XG4gICAgICAgIGlmIChpc05vZGUoaXRlbSkpIHtcbiAgICAgICAgICAgIGlmICghY2hvbXBLZWVwICYmIGl0ZW0uc3BhY2VCZWZvcmUpXG4gICAgICAgICAgICAgICAgbGluZXMucHVzaCgnJyk7XG4gICAgICAgICAgICBhZGRDb21tZW50QmVmb3JlKGN0eCwgbGluZXMsIGl0ZW0uY29tbWVudEJlZm9yZSwgY2hvbXBLZWVwKTtcbiAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQpXG4gICAgICAgICAgICAgICAgY29tbWVudCA9IGl0ZW0uY29tbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1BhaXIoaXRlbSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGlrID0gaXNOb2RlKGl0ZW0ua2V5KSA/IGl0ZW0ua2V5IDogbnVsbDtcbiAgICAgICAgICAgIGlmIChpaykge1xuICAgICAgICAgICAgICAgIGlmICghY2hvbXBLZWVwICYmIGlrLnNwYWNlQmVmb3JlKVxuICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKCcnKTtcbiAgICAgICAgICAgICAgICBhZGRDb21tZW50QmVmb3JlKGN0eCwgbGluZXMsIGlrLmNvbW1lbnRCZWZvcmUsIGNob21wS2VlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2hvbXBLZWVwID0gZmFsc2U7XG4gICAgICAgIGxldCBzdHIgPSBzdHJpbmdpZnkoaXRlbSwgaXRlbUN0eCwgKCkgPT4gKGNvbW1lbnQgPSBudWxsKSwgKCkgPT4gKGNob21wS2VlcCA9IHRydWUpKTtcbiAgICAgICAgaWYgKGNvbW1lbnQpXG4gICAgICAgICAgICBzdHIgKz0gbGluZUNvbW1lbnQoc3RyLCBpdGVtSW5kZW50LCBjb21tZW50U3RyaW5nKGNvbW1lbnQpKTtcbiAgICAgICAgaWYgKGNob21wS2VlcCAmJiBjb21tZW50KVxuICAgICAgICAgICAgY2hvbXBLZWVwID0gZmFsc2U7XG4gICAgICAgIGxpbmVzLnB1c2goYmxvY2tJdGVtUHJlZml4ICsgc3RyKTtcbiAgICB9XG4gICAgbGV0IHN0cjtcbiAgICBpZiAobGluZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHN0ciA9IGZsb3dDaGFycy5zdGFydCArIGZsb3dDaGFycy5lbmQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdHIgPSBsaW5lc1swXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgc3RyICs9IGxpbmUgPyBgXFxuJHtpbmRlbnR9JHtsaW5lfWAgOiAnXFxuJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29tbWVudCkge1xuICAgICAgICBzdHIgKz0gJ1xcbicgKyBpbmRlbnRDb21tZW50KGNvbW1lbnRTdHJpbmcoY29tbWVudCksIGluZGVudCk7XG4gICAgICAgIGlmIChvbkNvbW1lbnQpXG4gICAgICAgICAgICBvbkNvbW1lbnQoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY2hvbXBLZWVwICYmIG9uQ2hvbXBLZWVwKVxuICAgICAgICBvbkNob21wS2VlcCgpO1xuICAgIHJldHVybiBzdHI7XG59XG5mdW5jdGlvbiBzdHJpbmdpZnlGbG93Q29sbGVjdGlvbih7IGl0ZW1zIH0sIGN0eCwgeyBmbG93Q2hhcnMsIGl0ZW1JbmRlbnQgfSkge1xuICAgIGNvbnN0IHsgaW5kZW50LCBpbmRlbnRTdGVwLCBmbG93Q29sbGVjdGlvblBhZGRpbmc6IGZjUGFkZGluZywgb3B0aW9uczogeyBjb21tZW50U3RyaW5nIH0gfSA9IGN0eDtcbiAgICBpdGVtSW5kZW50ICs9IGluZGVudFN0ZXA7XG4gICAgY29uc3QgaXRlbUN0eCA9IE9iamVjdC5hc3NpZ24oe30sIGN0eCwge1xuICAgICAgICBpbmRlbnQ6IGl0ZW1JbmRlbnQsXG4gICAgICAgIGluRmxvdzogdHJ1ZSxcbiAgICAgICAgdHlwZTogbnVsbFxuICAgIH0pO1xuICAgIGxldCByZXFOZXdsaW5lID0gZmFsc2U7XG4gICAgbGV0IGxpbmVzQXRWYWx1ZSA9IDA7XG4gICAgY29uc3QgbGluZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgICAgbGV0IGNvbW1lbnQgPSBudWxsO1xuICAgICAgICBpZiAoaXNOb2RlKGl0ZW0pKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5zcGFjZUJlZm9yZSlcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKCcnKTtcbiAgICAgICAgICAgIGFkZENvbW1lbnRCZWZvcmUoY3R4LCBsaW5lcywgaXRlbS5jb21tZW50QmVmb3JlLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50KVxuICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBpdGVtLmNvbW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNQYWlyKGl0ZW0pKSB7XG4gICAgICAgICAgICBjb25zdCBpayA9IGlzTm9kZShpdGVtLmtleSkgPyBpdGVtLmtleSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoaWspIHtcbiAgICAgICAgICAgICAgICBpZiAoaWsuc3BhY2VCZWZvcmUpXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goJycpO1xuICAgICAgICAgICAgICAgIGFkZENvbW1lbnRCZWZvcmUoY3R4LCBsaW5lcywgaWsuY29tbWVudEJlZm9yZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChpay5jb21tZW50KVxuICAgICAgICAgICAgICAgICAgICByZXFOZXdsaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGl2ID0gaXNOb2RlKGl0ZW0udmFsdWUpID8gaXRlbS52YWx1ZSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoaXYpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXYuY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudCA9IGl2LmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGl2LmNvbW1lbnRCZWZvcmUpXG4gICAgICAgICAgICAgICAgICAgIHJlcU5ld2xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXRlbS52YWx1ZSA9PSBudWxsICYmIGlrPy5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgY29tbWVudCA9IGlrLmNvbW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbW1lbnQpXG4gICAgICAgICAgICByZXFOZXdsaW5lID0gdHJ1ZTtcbiAgICAgICAgbGV0IHN0ciA9IHN0cmluZ2lmeShpdGVtLCBpdGVtQ3R4LCAoKSA9PiAoY29tbWVudCA9IG51bGwpKTtcbiAgICAgICAgaWYgKGkgPCBpdGVtcy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgc3RyICs9ICcsJztcbiAgICAgICAgaWYgKGNvbW1lbnQpXG4gICAgICAgICAgICBzdHIgKz0gbGluZUNvbW1lbnQoc3RyLCBpdGVtSW5kZW50LCBjb21tZW50U3RyaW5nKGNvbW1lbnQpKTtcbiAgICAgICAgaWYgKCFyZXFOZXdsaW5lICYmIChsaW5lcy5sZW5ndGggPiBsaW5lc0F0VmFsdWUgfHwgc3RyLmluY2x1ZGVzKCdcXG4nKSkpXG4gICAgICAgICAgICByZXFOZXdsaW5lID0gdHJ1ZTtcbiAgICAgICAgbGluZXMucHVzaChzdHIpO1xuICAgICAgICBsaW5lc0F0VmFsdWUgPSBsaW5lcy5sZW5ndGg7XG4gICAgfVxuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gZmxvd0NoYXJzO1xuICAgIGlmIChsaW5lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHN0YXJ0ICsgZW5kO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKCFyZXFOZXdsaW5lKSB7XG4gICAgICAgICAgICBjb25zdCBsZW4gPSBsaW5lcy5yZWR1Y2UoKHN1bSwgbGluZSkgPT4gc3VtICsgbGluZS5sZW5ndGggKyAyLCAyKTtcbiAgICAgICAgICAgIHJlcU5ld2xpbmUgPSBjdHgub3B0aW9ucy5saW5lV2lkdGggPiAwICYmIGxlbiA+IGN0eC5vcHRpb25zLmxpbmVXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxTmV3bGluZSkge1xuICAgICAgICAgICAgbGV0IHN0ciA9IHN0YXJ0O1xuICAgICAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKVxuICAgICAgICAgICAgICAgIHN0ciArPSBsaW5lID8gYFxcbiR7aW5kZW50U3RlcH0ke2luZGVudH0ke2xpbmV9YCA6ICdcXG4nO1xuICAgICAgICAgICAgcmV0dXJuIGAke3N0cn1cXG4ke2luZGVudH0ke2VuZH1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGAke3N0YXJ0fSR7ZmNQYWRkaW5nfSR7bGluZXMuam9pbignICcpfSR7ZmNQYWRkaW5nfSR7ZW5kfWA7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBhZGRDb21tZW50QmVmb3JlKHsgaW5kZW50LCBvcHRpb25zOiB7IGNvbW1lbnRTdHJpbmcgfSB9LCBsaW5lcywgY29tbWVudCwgY2hvbXBLZWVwKSB7XG4gICAgaWYgKGNvbW1lbnQgJiYgY2hvbXBLZWVwKVxuICAgICAgICBjb21tZW50ID0gY29tbWVudC5yZXBsYWNlKC9eXFxuKy8sICcnKTtcbiAgICBpZiAoY29tbWVudCkge1xuICAgICAgICBjb25zdCBpYyA9IGluZGVudENvbW1lbnQoY29tbWVudFN0cmluZyhjb21tZW50KSwgaW5kZW50KTtcbiAgICAgICAgbGluZXMucHVzaChpYy50cmltU3RhcnQoKSk7IC8vIEF2b2lkIGRvdWJsZSBpbmRlbnQgb24gZmlyc3QgbGluZVxuICAgIH1cbn1cblxuZXhwb3J0IHsgc3RyaW5naWZ5Q29sbGVjdGlvbiB9O1xuIiwgImltcG9ydCB7IHN0cmluZ2lmeUNvbGxlY3Rpb24gfSBmcm9tICcuLi9zdHJpbmdpZnkvc3RyaW5naWZ5Q29sbGVjdGlvbi5qcyc7XG5pbXBvcnQgeyBhZGRQYWlyVG9KU01hcCB9IGZyb20gJy4vYWRkUGFpclRvSlNNYXAuanMnO1xuaW1wb3J0IHsgQ29sbGVjdGlvbiB9IGZyb20gJy4vQ29sbGVjdGlvbi5qcyc7XG5pbXBvcnQgeyBNQVAsIGlzUGFpciwgaXNTY2FsYXIgfSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFBhaXIsIGNyZWF0ZVBhaXIgfSBmcm9tICcuL1BhaXIuanMnO1xuaW1wb3J0IHsgaXNTY2FsYXJWYWx1ZSB9IGZyb20gJy4vU2NhbGFyLmpzJztcblxuZnVuY3Rpb24gZmluZFBhaXIoaXRlbXMsIGtleSkge1xuICAgIGNvbnN0IGsgPSBpc1NjYWxhcihrZXkpID8ga2V5LnZhbHVlIDoga2V5O1xuICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICAgICAgaWYgKGlzUGFpcihpdCkpIHtcbiAgICAgICAgICAgIGlmIChpdC5rZXkgPT09IGtleSB8fCBpdC5rZXkgPT09IGspXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0O1xuICAgICAgICAgICAgaWYgKGlzU2NhbGFyKGl0LmtleSkgJiYgaXQua2V5LnZhbHVlID09PSBrKVxuICAgICAgICAgICAgICAgIHJldHVybiBpdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuY2xhc3MgWUFNTE1hcCBleHRlbmRzIENvbGxlY3Rpb24ge1xuICAgIHN0YXRpYyBnZXQgdGFnTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICd0YWc6eWFtbC5vcmcsMjAwMjptYXAnO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcbiAgICAgICAgc3VwZXIoTUFQLCBzY2hlbWEpO1xuICAgICAgICB0aGlzLml0ZW1zID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgZ2VuZXJpYyBjb2xsZWN0aW9uIHBhcnNpbmcgbWV0aG9kIHRoYXQgY2FuIGJlIGV4dGVuZGVkXG4gICAgICogdG8gb3RoZXIgbm9kZSBjbGFzc2VzIHRoYXQgaW5oZXJpdCBmcm9tIFlBTUxNYXBcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbShzY2hlbWEsIG9iaiwgY3R4KSB7XG4gICAgICAgIGNvbnN0IHsga2VlcFVuZGVmaW5lZCwgcmVwbGFjZXIgfSA9IGN0eDtcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IHRoaXMoc2NoZW1hKTtcbiAgICAgICAgY29uc3QgYWRkID0gKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXBsYWNlci5jYWxsKG9iaiwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJlcGxhY2VyKSAmJiAhcmVwbGFjZXIuaW5jbHVkZXMoa2V5KSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCB8fCBrZWVwVW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKGNyZWF0ZVBhaXIoa2V5LCB2YWx1ZSwgY3R4KSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIG9iailcbiAgICAgICAgICAgICAgICBhZGQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKVxuICAgICAgICAgICAgICAgIGFkZChrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHNjaGVtYS5zb3J0TWFwRW50cmllcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWFwLml0ZW1zLnNvcnQoc2NoZW1hLnNvcnRNYXBFbnRyaWVzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3ZlcndyaXRlIC0gSWYgbm90IHNldCBgdHJ1ZWAsIHVzaW5nIGEga2V5IHRoYXQgaXMgYWxyZWFkeSBpbiB0aGVcbiAgICAgKiAgIGNvbGxlY3Rpb24gd2lsbCB0aHJvdy4gT3RoZXJ3aXNlLCBvdmVyd3JpdGVzIHRoZSBwcmV2aW91cyB2YWx1ZS5cbiAgICAgKi9cbiAgICBhZGQocGFpciwgb3ZlcndyaXRlKSB7XG4gICAgICAgIGxldCBfcGFpcjtcbiAgICAgICAgaWYgKGlzUGFpcihwYWlyKSlcbiAgICAgICAgICAgIF9wYWlyID0gcGFpcjtcbiAgICAgICAgZWxzZSBpZiAoIXBhaXIgfHwgdHlwZW9mIHBhaXIgIT09ICdvYmplY3QnIHx8ICEoJ2tleScgaW4gcGFpcikpIHtcbiAgICAgICAgICAgIC8vIEluIFR5cGVTY3JpcHQsIHRoaXMgbmV2ZXIgaGFwcGVucy5cbiAgICAgICAgICAgIF9wYWlyID0gbmV3IFBhaXIocGFpciwgcGFpcj8udmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIF9wYWlyID0gbmV3IFBhaXIocGFpci5rZXksIHBhaXIudmFsdWUpO1xuICAgICAgICBjb25zdCBwcmV2ID0gZmluZFBhaXIodGhpcy5pdGVtcywgX3BhaXIua2V5KTtcbiAgICAgICAgY29uc3Qgc29ydEVudHJpZXMgPSB0aGlzLnNjaGVtYT8uc29ydE1hcEVudHJpZXM7XG4gICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgICBpZiAoIW92ZXJ3cml0ZSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEtleSAke19wYWlyLmtleX0gYWxyZWFkeSBzZXRgKTtcbiAgICAgICAgICAgIC8vIEZvciBzY2FsYXJzLCBrZWVwIHRoZSBvbGQgbm9kZSAmIGl0cyBjb21tZW50cyBhbmQgYW5jaG9yc1xuICAgICAgICAgICAgaWYgKGlzU2NhbGFyKHByZXYudmFsdWUpICYmIGlzU2NhbGFyVmFsdWUoX3BhaXIudmFsdWUpKVxuICAgICAgICAgICAgICAgIHByZXYudmFsdWUudmFsdWUgPSBfcGFpci52YWx1ZTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBwcmV2LnZhbHVlID0gX3BhaXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc29ydEVudHJpZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLml0ZW1zLmZpbmRJbmRleChpdGVtID0+IHNvcnRFbnRyaWVzKF9wYWlyLCBpdGVtKSA8IDApO1xuICAgICAgICAgICAgaWYgKGkgPT09IC0xKVxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChfcGFpcik7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoaSwgMCwgX3BhaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoKF9wYWlyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkZWxldGUoa2V5KSB7XG4gICAgICAgIGNvbnN0IGl0ID0gZmluZFBhaXIodGhpcy5pdGVtcywga2V5KTtcbiAgICAgICAgaWYgKCFpdClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgY29uc3QgZGVsID0gdGhpcy5pdGVtcy5zcGxpY2UodGhpcy5pdGVtcy5pbmRleE9mKGl0KSwgMSk7XG4gICAgICAgIHJldHVybiBkZWwubGVuZ3RoID4gMDtcbiAgICB9XG4gICAgZ2V0KGtleSwga2VlcFNjYWxhcikge1xuICAgICAgICBjb25zdCBpdCA9IGZpbmRQYWlyKHRoaXMuaXRlbXMsIGtleSk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBpdD8udmFsdWU7XG4gICAgICAgIHJldHVybiAoIWtlZXBTY2FsYXIgJiYgaXNTY2FsYXIobm9kZSkgPyBub2RlLnZhbHVlIDogbm9kZSkgPz8gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiAhIWZpbmRQYWlyKHRoaXMuaXRlbXMsIGtleSk7XG4gICAgfVxuICAgIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuYWRkKG5ldyBQYWlyKGtleSwgdmFsdWUpLCB0cnVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGN0eCAtIENvbnZlcnNpb24gY29udGV4dCwgb3JpZ2luYWxseSBzZXQgaW4gRG9jdW1lbnQjdG9KUygpXG4gICAgICogQHBhcmFtIHtDbGFzc30gVHlwZSAtIElmIHNldCwgZm9yY2VzIHRoZSByZXR1cm5lZCBjb2xsZWN0aW9uIHR5cGVcbiAgICAgKiBAcmV0dXJucyBJbnN0YW5jZSBvZiBUeXBlLCBNYXAsIG9yIE9iamVjdFxuICAgICAqL1xuICAgIHRvSlNPTihfLCBjdHgsIFR5cGUpIHtcbiAgICAgICAgY29uc3QgbWFwID0gVHlwZSA/IG5ldyBUeXBlKCkgOiBjdHg/Lm1hcEFzTWFwID8gbmV3IE1hcCgpIDoge307XG4gICAgICAgIGlmIChjdHg/Lm9uQ3JlYXRlKVxuICAgICAgICAgICAgY3R4Lm9uQ3JlYXRlKG1hcCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKVxuICAgICAgICAgICAgYWRkUGFpclRvSlNNYXAoY3R4LCBtYXAsIGl0ZW0pO1xuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cbiAgICB0b1N0cmluZyhjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApIHtcbiAgICAgICAgaWYgKCFjdHgpXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKSB7XG4gICAgICAgICAgICBpZiAoIWlzUGFpcihpdGVtKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcCBpdGVtcyBtdXN0IGFsbCBiZSBwYWlyczsgZm91bmQgJHtKU09OLnN0cmluZ2lmeShpdGVtKX0gaW5zdGVhZGApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY3R4LmFsbE51bGxWYWx1ZXMgJiYgdGhpcy5oYXNBbGxOdWxsVmFsdWVzKGZhbHNlKSlcbiAgICAgICAgICAgIGN0eCA9IE9iamVjdC5hc3NpZ24oe30sIGN0eCwgeyBhbGxOdWxsVmFsdWVzOiB0cnVlIH0pO1xuICAgICAgICByZXR1cm4gc3RyaW5naWZ5Q29sbGVjdGlvbih0aGlzLCBjdHgsIHtcbiAgICAgICAgICAgIGJsb2NrSXRlbVByZWZpeDogJycsXG4gICAgICAgICAgICBmbG93Q2hhcnM6IHsgc3RhcnQ6ICd7JywgZW5kOiAnfScgfSxcbiAgICAgICAgICAgIGl0ZW1JbmRlbnQ6IGN0eC5pbmRlbnQgfHwgJycsXG4gICAgICAgICAgICBvbkNob21wS2VlcCxcbiAgICAgICAgICAgIG9uQ29tbWVudFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFlBTUxNYXAsIGZpbmRQYWlyIH07XG4iLCAiaW1wb3J0IHsgaXNNYXAgfSBmcm9tICcuLi8uLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBZQU1MTWFwIH0gZnJvbSAnLi4vLi4vbm9kZXMvWUFNTE1hcC5qcyc7XG5cbmNvbnN0IG1hcCA9IHtcbiAgICBjb2xsZWN0aW9uOiAnbWFwJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG5vZGVDbGFzczogWUFNTE1hcCxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjptYXAnLFxuICAgIHJlc29sdmUobWFwLCBvbkVycm9yKSB7XG4gICAgICAgIGlmICghaXNNYXAobWFwKSlcbiAgICAgICAgICAgIG9uRXJyb3IoJ0V4cGVjdGVkIGEgbWFwcGluZyBmb3IgdGhpcyB0YWcnKTtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9LFxuICAgIGNyZWF0ZU5vZGU6IChzY2hlbWEsIG9iaiwgY3R4KSA9PiBZQU1MTWFwLmZyb20oc2NoZW1hLCBvYmosIGN0eClcbn07XG5cbmV4cG9ydCB7IG1hcCB9O1xuIiwgImltcG9ydCB7IGNyZWF0ZU5vZGUgfSBmcm9tICcuLi9kb2MvY3JlYXRlTm9kZS5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnlDb2xsZWN0aW9uIH0gZnJvbSAnLi4vc3RyaW5naWZ5L3N0cmluZ2lmeUNvbGxlY3Rpb24uanMnO1xuaW1wb3J0IHsgQ29sbGVjdGlvbiB9IGZyb20gJy4vQ29sbGVjdGlvbi5qcyc7XG5pbXBvcnQgeyBTRVEsIGlzU2NhbGFyIH0gZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBpc1NjYWxhclZhbHVlIH0gZnJvbSAnLi9TY2FsYXIuanMnO1xuaW1wb3J0IHsgdG9KUyB9IGZyb20gJy4vdG9KUy5qcyc7XG5cbmNsYXNzIFlBTUxTZXEgZXh0ZW5kcyBDb2xsZWN0aW9uIHtcbiAgICBzdGF0aWMgZ2V0IHRhZ05hbWUoKSB7XG4gICAgICAgIHJldHVybiAndGFnOnlhbWwub3JnLDIwMDI6c2VxJztcbiAgICB9XG4gICAgY29uc3RydWN0b3Ioc2NoZW1hKSB7XG4gICAgICAgIHN1cGVyKFNFUSwgc2NoZW1hKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIH1cbiAgICBhZGQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHZhbHVlIGZyb20gdGhlIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBga2V5YCBtdXN0IGNvbnRhaW4gYSByZXByZXNlbnRhdGlvbiBvZiBhbiBpbnRlZ2VyIGZvciB0aGlzIHRvIHN1Y2NlZWQuXG4gICAgICogSXQgbWF5IGJlIHdyYXBwZWQgaW4gYSBgU2NhbGFyYC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgaXRlbSB3YXMgZm91bmQgYW5kIHJlbW92ZWQuXG4gICAgICovXG4gICAgZGVsZXRlKGtleSkge1xuICAgICAgICBjb25zdCBpZHggPSBhc0l0ZW1JbmRleChrZXkpO1xuICAgICAgICBpZiAodHlwZW9mIGlkeCAhPT0gJ251bWJlcicpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IGRlbCA9IHRoaXMuaXRlbXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIHJldHVybiBkZWwubGVuZ3RoID4gMDtcbiAgICB9XG4gICAgZ2V0KGtleSwga2VlcFNjYWxhcikge1xuICAgICAgICBjb25zdCBpZHggPSBhc0l0ZW1JbmRleChrZXkpO1xuICAgICAgICBpZiAodHlwZW9mIGlkeCAhPT0gJ251bWJlcicpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBpdCA9IHRoaXMuaXRlbXNbaWR4XTtcbiAgICAgICAgcmV0dXJuICFrZWVwU2NhbGFyICYmIGlzU2NhbGFyKGl0KSA/IGl0LnZhbHVlIDogaXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgY29sbGVjdGlvbiBpbmNsdWRlcyBhIHZhbHVlIHdpdGggdGhlIGtleSBga2V5YC5cbiAgICAgKlxuICAgICAqIGBrZXlgIG11c3QgY29udGFpbiBhIHJlcHJlc2VudGF0aW9uIG9mIGFuIGludGVnZXIgZm9yIHRoaXMgdG8gc3VjY2VlZC5cbiAgICAgKiBJdCBtYXkgYmUgd3JhcHBlZCBpbiBhIGBTY2FsYXJgLlxuICAgICAqL1xuICAgIGhhcyhrZXkpIHtcbiAgICAgICAgY29uc3QgaWR4ID0gYXNJdGVtSW5kZXgoa2V5KTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpZHggPT09ICdudW1iZXInICYmIGlkeCA8IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgdmFsdWUgaW4gdGhpcyBjb2xsZWN0aW9uLiBGb3IgYCEhc2V0YCwgYHZhbHVlYCBuZWVkcyB0byBiZSBhXG4gICAgICogYm9vbGVhbiB0byBhZGQvcmVtb3ZlIHRoZSBpdGVtIGZyb20gdGhlIHNldC5cbiAgICAgKlxuICAgICAqIElmIGBrZXlgIGRvZXMgbm90IGNvbnRhaW4gYSByZXByZXNlbnRhdGlvbiBvZiBhbiBpbnRlZ2VyLCB0aGlzIHdpbGwgdGhyb3cuXG4gICAgICogSXQgbWF5IGJlIHdyYXBwZWQgaW4gYSBgU2NhbGFyYC5cbiAgICAgKi9cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBpZHggPSBhc0l0ZW1JbmRleChrZXkpO1xuICAgICAgICBpZiAodHlwZW9mIGlkeCAhPT0gJ251bWJlcicpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGEgdmFsaWQgaW5kZXgsIG5vdCAke2tleX0uYCk7XG4gICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLml0ZW1zW2lkeF07XG4gICAgICAgIGlmIChpc1NjYWxhcihwcmV2KSAmJiBpc1NjYWxhclZhbHVlKHZhbHVlKSlcbiAgICAgICAgICAgIHByZXYudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5pdGVtc1tpZHhdID0gdmFsdWU7XG4gICAgfVxuICAgIHRvSlNPTihfLCBjdHgpIHtcbiAgICAgICAgY29uc3Qgc2VxID0gW107XG4gICAgICAgIGlmIChjdHg/Lm9uQ3JlYXRlKVxuICAgICAgICAgICAgY3R4Lm9uQ3JlYXRlKHNlcSk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlbXMpXG4gICAgICAgICAgICBzZXEucHVzaCh0b0pTKGl0ZW0sIFN0cmluZyhpKyspLCBjdHgpKTtcbiAgICAgICAgcmV0dXJuIHNlcTtcbiAgICB9XG4gICAgdG9TdHJpbmcoY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgICAgIGlmICghY3R4KVxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgICAgICByZXR1cm4gc3RyaW5naWZ5Q29sbGVjdGlvbih0aGlzLCBjdHgsIHtcbiAgICAgICAgICAgIGJsb2NrSXRlbVByZWZpeDogJy0gJyxcbiAgICAgICAgICAgIGZsb3dDaGFyczogeyBzdGFydDogJ1snLCBlbmQ6ICddJyB9LFxuICAgICAgICAgICAgaXRlbUluZGVudDogKGN0eC5pbmRlbnQgfHwgJycpICsgJyAgJyxcbiAgICAgICAgICAgIG9uQ2hvbXBLZWVwLFxuICAgICAgICAgICAgb25Db21tZW50XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbShzY2hlbWEsIG9iaiwgY3R4KSB7XG4gICAgICAgIGNvbnN0IHsgcmVwbGFjZXIgfSA9IGN0eDtcbiAgICAgICAgY29uc3Qgc2VxID0gbmV3IHRoaXMoc2NoZW1hKTtcbiAgICAgICAgaWYgKG9iaiAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGl0IG9mIG9iaikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gb2JqIGluc3RhbmNlb2YgU2V0ID8gaXQgOiBTdHJpbmcoaSsrKTtcbiAgICAgICAgICAgICAgICAgICAgaXQgPSByZXBsYWNlci5jYWxsKG9iaiwga2V5LCBpdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlcS5pdGVtcy5wdXNoKGNyZWF0ZU5vZGUoaXQsIHVuZGVmaW5lZCwgY3R4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlcTtcbiAgICB9XG59XG5mdW5jdGlvbiBhc0l0ZW1JbmRleChrZXkpIHtcbiAgICBsZXQgaWR4ID0gaXNTY2FsYXIoa2V5KSA/IGtleS52YWx1ZSA6IGtleTtcbiAgICBpZiAoaWR4ICYmIHR5cGVvZiBpZHggPT09ICdzdHJpbmcnKVxuICAgICAgICBpZHggPSBOdW1iZXIoaWR4KTtcbiAgICByZXR1cm4gdHlwZW9mIGlkeCA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzSW50ZWdlcihpZHgpICYmIGlkeCA+PSAwXG4gICAgICAgID8gaWR4XG4gICAgICAgIDogbnVsbDtcbn1cblxuZXhwb3J0IHsgWUFNTFNlcSB9O1xuIiwgImltcG9ydCB7IGlzU2VxIH0gZnJvbSAnLi4vLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgWUFNTFNlcSB9IGZyb20gJy4uLy4uL25vZGVzL1lBTUxTZXEuanMnO1xuXG5jb25zdCBzZXEgPSB7XG4gICAgY29sbGVjdGlvbjogJ3NlcScsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBub2RlQ2xhc3M6IFlBTUxTZXEsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6c2VxJyxcbiAgICByZXNvbHZlKHNlcSwgb25FcnJvcikge1xuICAgICAgICBpZiAoIWlzU2VxKHNlcSkpXG4gICAgICAgICAgICBvbkVycm9yKCdFeHBlY3RlZCBhIHNlcXVlbmNlIGZvciB0aGlzIHRhZycpO1xuICAgICAgICByZXR1cm4gc2VxO1xuICAgIH0sXG4gICAgY3JlYXRlTm9kZTogKHNjaGVtYSwgb2JqLCBjdHgpID0+IFlBTUxTZXEuZnJvbShzY2hlbWEsIG9iaiwgY3R4KVxufTtcblxuZXhwb3J0IHsgc2VxIH07XG4iLCAiaW1wb3J0IHsgc3RyaW5naWZ5U3RyaW5nIH0gZnJvbSAnLi4vLi4vc3RyaW5naWZ5L3N0cmluZ2lmeVN0cmluZy5qcyc7XG5cbmNvbnN0IHN0cmluZyA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOnN0cicsXG4gICAgcmVzb2x2ZTogc3RyID0+IHN0cixcbiAgICBzdHJpbmdpZnkoaXRlbSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgICAgIGN0eCA9IE9iamVjdC5hc3NpZ24oeyBhY3R1YWxTdHJpbmc6IHRydWUgfSwgY3R4KTtcbiAgICAgICAgcmV0dXJuIHN0cmluZ2lmeVN0cmluZyhpdGVtLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IHN0cmluZyB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5cbmNvbnN0IG51bGxUYWcgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHZhbHVlID09IG51bGwsXG4gICAgY3JlYXRlTm9kZTogKCkgPT4gbmV3IFNjYWxhcihudWxsKSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOm51bGwnLFxuICAgIHRlc3Q6IC9eKD86fnxbTm5ddWxsfE5VTEwpPyQvLFxuICAgIHJlc29sdmU6ICgpID0+IG5ldyBTY2FsYXIobnVsbCksXG4gICAgc3RyaW5naWZ5OiAoeyBzb3VyY2UgfSwgY3R4KSA9PiB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyAmJiBudWxsVGFnLnRlc3QudGVzdChzb3VyY2UpXG4gICAgICAgID8gc291cmNlXG4gICAgICAgIDogY3R4Lm9wdGlvbnMubnVsbFN0clxufTtcblxuZXhwb3J0IHsgbnVsbFRhZyB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5cbmNvbnN0IGJvb2xUYWcgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6Ym9vbCcsXG4gICAgdGVzdDogL14oPzpbVHRdcnVlfFRSVUV8W0ZmXWFsc2V8RkFMU0UpJC8sXG4gICAgcmVzb2x2ZTogc3RyID0+IG5ldyBTY2FsYXIoc3RyWzBdID09PSAndCcgfHwgc3RyWzBdID09PSAnVCcpLFxuICAgIHN0cmluZ2lmeSh7IHNvdXJjZSwgdmFsdWUgfSwgY3R4KSB7XG4gICAgICAgIGlmIChzb3VyY2UgJiYgYm9vbFRhZy50ZXN0LnRlc3Qoc291cmNlKSkge1xuICAgICAgICAgICAgY29uc3Qgc3YgPSBzb3VyY2VbMF0gPT09ICd0JyB8fCBzb3VyY2VbMF0gPT09ICdUJztcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gc3YpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWUgPyBjdHgub3B0aW9ucy50cnVlU3RyIDogY3R4Lm9wdGlvbnMuZmFsc2VTdHI7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgYm9vbFRhZyB9O1xuIiwgImZ1bmN0aW9uIHN0cmluZ2lmeU51bWJlcih7IGZvcm1hdCwgbWluRnJhY3Rpb25EaWdpdHMsIHRhZywgdmFsdWUgfSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdiaWdpbnQnKVxuICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICBjb25zdCBudW0gPSB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInID8gdmFsdWUgOiBOdW1iZXIodmFsdWUpO1xuICAgIGlmICghaXNGaW5pdGUobnVtKSlcbiAgICAgICAgcmV0dXJuIGlzTmFOKG51bSkgPyAnLm5hbicgOiBudW0gPCAwID8gJy0uaW5mJyA6ICcuaW5mJztcbiAgICBsZXQgbiA9IE9iamVjdC5pcyh2YWx1ZSwgLTApID8gJy0wJyA6IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICBpZiAoIWZvcm1hdCAmJlxuICAgICAgICBtaW5GcmFjdGlvbkRpZ2l0cyAmJlxuICAgICAgICAoIXRhZyB8fCB0YWcgPT09ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCcpICYmXG4gICAgICAgIC9eXFxkLy50ZXN0KG4pKSB7XG4gICAgICAgIGxldCBpID0gbi5pbmRleE9mKCcuJyk7XG4gICAgICAgIGlmIChpIDwgMCkge1xuICAgICAgICAgICAgaSA9IG4ubGVuZ3RoO1xuICAgICAgICAgICAgbiArPSAnLic7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGQgPSBtaW5GcmFjdGlvbkRpZ2l0cyAtIChuLmxlbmd0aCAtIGkgLSAxKTtcbiAgICAgICAgd2hpbGUgKGQtLSA+IDApXG4gICAgICAgICAgICBuICs9ICcwJztcbiAgICB9XG4gICAgcmV0dXJuIG47XG59XG5cbmV4cG9ydCB7IHN0cmluZ2lmeU51bWJlciB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnlOdW1iZXIgfSBmcm9tICcuLi8uLi9zdHJpbmdpZnkvc3RyaW5naWZ5TnVtYmVyLmpzJztcblxuY29uc3QgZmxvYXROYU4gPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCcsXG4gICAgdGVzdDogL14oPzpbLStdP1xcLig/OmluZnxJbmZ8SU5GKXxcXC5uYW58XFwuTmFOfFxcLk5BTikkLyxcbiAgICByZXNvbHZlOiBzdHIgPT4gc3RyLnNsaWNlKC0zKS50b0xvd2VyQ2FzZSgpID09PSAnbmFuJ1xuICAgICAgICA/IE5hTlxuICAgICAgICA6IHN0clswXSA9PT0gJy0nXG4gICAgICAgICAgICA/IE51bWJlci5ORUdBVElWRV9JTkZJTklUWVxuICAgICAgICAgICAgOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlOdW1iZXJcbn07XG5jb25zdCBmbG9hdEV4cCA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JyxcbiAgICBmb3JtYXQ6ICdFWFAnLFxuICAgIHRlc3Q6IC9eWy0rXT8oPzpcXC5bMC05XSt8WzAtOV0rKD86XFwuWzAtOV0qKT8pW2VFXVstK10/WzAtOV0rJC8sXG4gICAgcmVzb2x2ZTogc3RyID0+IHBhcnNlRmxvYXQoc3RyKSxcbiAgICBzdHJpbmdpZnkobm9kZSkge1xuICAgICAgICBjb25zdCBudW0gPSBOdW1iZXIobm9kZS52YWx1ZSk7XG4gICAgICAgIHJldHVybiBpc0Zpbml0ZShudW0pID8gbnVtLnRvRXhwb25lbnRpYWwoKSA6IHN0cmluZ2lmeU51bWJlcihub2RlKTtcbiAgICB9XG59O1xuY29uc3QgZmxvYXQgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCcsXG4gICAgdGVzdDogL15bLStdPyg/OlxcLlswLTldK3xbMC05XStcXC5bMC05XSopJC8sXG4gICAgcmVzb2x2ZShzdHIpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBTY2FsYXIocGFyc2VGbG9hdChzdHIpKTtcbiAgICAgICAgY29uc3QgZG90ID0gc3RyLmluZGV4T2YoJy4nKTtcbiAgICAgICAgaWYgKGRvdCAhPT0gLTEgJiYgc3RyW3N0ci5sZW5ndGggLSAxXSA9PT0gJzAnKVxuICAgICAgICAgICAgbm9kZS5taW5GcmFjdGlvbkRpZ2l0cyA9IHN0ci5sZW5ndGggLSBkb3QgLSAxO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9LFxuICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5TnVtYmVyXG59O1xuXG5leHBvcnQgeyBmbG9hdCwgZmxvYXRFeHAsIGZsb2F0TmFOIH07XG4iLCAiaW1wb3J0IHsgc3RyaW5naWZ5TnVtYmVyIH0gZnJvbSAnLi4vLi4vc3RyaW5naWZ5L3N0cmluZ2lmeU51bWJlci5qcyc7XG5cbmNvbnN0IGludElkZW50aWZ5ID0gKHZhbHVlKSA9PiB0eXBlb2YgdmFsdWUgPT09ICdiaWdpbnQnIHx8IE51bWJlci5pc0ludGVnZXIodmFsdWUpO1xuY29uc3QgaW50UmVzb2x2ZSA9IChzdHIsIG9mZnNldCwgcmFkaXgsIHsgaW50QXNCaWdJbnQgfSkgPT4gKGludEFzQmlnSW50ID8gQmlnSW50KHN0cikgOiBwYXJzZUludChzdHIuc3Vic3RyaW5nKG9mZnNldCksIHJhZGl4KSk7XG5mdW5jdGlvbiBpbnRTdHJpbmdpZnkobm9kZSwgcmFkaXgsIHByZWZpeCkge1xuICAgIGNvbnN0IHsgdmFsdWUgfSA9IG5vZGU7XG4gICAgaWYgKGludElkZW50aWZ5KHZhbHVlKSAmJiB2YWx1ZSA+PSAwKVxuICAgICAgICByZXR1cm4gcHJlZml4ICsgdmFsdWUudG9TdHJpbmcocmFkaXgpO1xuICAgIHJldHVybiBzdHJpbmdpZnlOdW1iZXIobm9kZSk7XG59XG5jb25zdCBpbnRPY3QgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IGludElkZW50aWZ5KHZhbHVlKSAmJiB2YWx1ZSA+PSAwLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6aW50JyxcbiAgICBmb3JtYXQ6ICdPQ1QnLFxuICAgIHRlc3Q6IC9eMG9bMC03XSskLyxcbiAgICByZXNvbHZlOiAoc3RyLCBfb25FcnJvciwgb3B0KSA9PiBpbnRSZXNvbHZlKHN0ciwgMiwgOCwgb3B0KSxcbiAgICBzdHJpbmdpZnk6IG5vZGUgPT4gaW50U3RyaW5naWZ5KG5vZGUsIDgsICcwbycpXG59O1xuY29uc3QgaW50ID0ge1xuICAgIGlkZW50aWZ5OiBpbnRJZGVudGlmeSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmludCcsXG4gICAgdGVzdDogL15bLStdP1swLTldKyQvLFxuICAgIHJlc29sdmU6IChzdHIsIF9vbkVycm9yLCBvcHQpID0+IGludFJlc29sdmUoc3RyLCAwLCAxMCwgb3B0KSxcbiAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeU51bWJlclxufTtcbmNvbnN0IGludEhleCA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gaW50SWRlbnRpZnkodmFsdWUpICYmIHZhbHVlID49IDAsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLFxuICAgIGZvcm1hdDogJ0hFWCcsXG4gICAgdGVzdDogL14weFswLTlhLWZBLUZdKyQvLFxuICAgIHJlc29sdmU6IChzdHIsIF9vbkVycm9yLCBvcHQpID0+IGludFJlc29sdmUoc3RyLCAyLCAxNiwgb3B0KSxcbiAgICBzdHJpbmdpZnk6IG5vZGUgPT4gaW50U3RyaW5naWZ5KG5vZGUsIDE2LCAnMHgnKVxufTtcblxuZXhwb3J0IHsgaW50LCBpbnRIZXgsIGludE9jdCB9O1xuIiwgImltcG9ydCB7IG1hcCB9IGZyb20gJy4uL2NvbW1vbi9tYXAuanMnO1xuaW1wb3J0IHsgbnVsbFRhZyB9IGZyb20gJy4uL2NvbW1vbi9udWxsLmpzJztcbmltcG9ydCB7IHNlcSB9IGZyb20gJy4uL2NvbW1vbi9zZXEuanMnO1xuaW1wb3J0IHsgc3RyaW5nIH0gZnJvbSAnLi4vY29tbW9uL3N0cmluZy5qcyc7XG5pbXBvcnQgeyBib29sVGFnIH0gZnJvbSAnLi9ib29sLmpzJztcbmltcG9ydCB7IGZsb2F0TmFOLCBmbG9hdEV4cCwgZmxvYXQgfSBmcm9tICcuL2Zsb2F0LmpzJztcbmltcG9ydCB7IGludE9jdCwgaW50LCBpbnRIZXggfSBmcm9tICcuL2ludC5qcyc7XG5cbmNvbnN0IHNjaGVtYSA9IFtcbiAgICBtYXAsXG4gICAgc2VxLFxuICAgIHN0cmluZyxcbiAgICBudWxsVGFnLFxuICAgIGJvb2xUYWcsXG4gICAgaW50T2N0LFxuICAgIGludCxcbiAgICBpbnRIZXgsXG4gICAgZmxvYXROYU4sXG4gICAgZmxvYXRFeHAsXG4gICAgZmxvYXRcbl07XG5cbmV4cG9ydCB7IHNjaGVtYSB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9jb21tb24vbWFwLmpzJztcbmltcG9ydCB7IHNlcSB9IGZyb20gJy4uL2NvbW1vbi9zZXEuanMnO1xuXG5mdW5jdGlvbiBpbnRJZGVudGlmeSh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdiaWdpbnQnIHx8IE51bWJlci5pc0ludGVnZXIodmFsdWUpO1xufVxuY29uc3Qgc3RyaW5naWZ5SlNPTiA9ICh7IHZhbHVlIH0pID0+IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbmNvbnN0IGpzb25TY2FsYXJzID0gW1xuICAgIHtcbiAgICAgICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycsXG4gICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOnN0cicsXG4gICAgICAgIHJlc29sdmU6IHN0ciA9PiBzdHIsXG4gICAgICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5SlNPTlxuICAgIH0sXG4gICAge1xuICAgICAgICBpZGVudGlmeTogdmFsdWUgPT4gdmFsdWUgPT0gbnVsbCxcbiAgICAgICAgY3JlYXRlTm9kZTogKCkgPT4gbmV3IFNjYWxhcihudWxsKSxcbiAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6bnVsbCcsXG4gICAgICAgIHRlc3Q6IC9ebnVsbCQvLFxuICAgICAgICByZXNvbHZlOiAoKSA9PiBudWxsLFxuICAgICAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeUpTT05cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpib29sJyxcbiAgICAgICAgdGVzdDogL150cnVlJHxeZmFsc2UkLyxcbiAgICAgICAgcmVzb2x2ZTogc3RyID0+IHN0ciA9PT0gJ3RydWUnLFxuICAgICAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeUpTT05cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWRlbnRpZnk6IGludElkZW50aWZ5LFxuICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLFxuICAgICAgICB0ZXN0OiAvXi0/KD86MHxbMS05XVswLTldKikkLyxcbiAgICAgICAgcmVzb2x2ZTogKHN0ciwgX29uRXJyb3IsIHsgaW50QXNCaWdJbnQgfSkgPT4gaW50QXNCaWdJbnQgPyBCaWdJbnQoc3RyKSA6IHBhcnNlSW50KHN0ciwgMTApLFxuICAgICAgICBzdHJpbmdpZnk6ICh7IHZhbHVlIH0pID0+IGludElkZW50aWZ5KHZhbHVlKSA/IHZhbHVlLnRvU3RyaW5nKCkgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSlcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsXG4gICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JyxcbiAgICAgICAgdGVzdDogL14tPyg/OjB8WzEtOV1bMC05XSopKD86XFwuWzAtOV0qKT8oPzpbZUVdWy0rXT9bMC05XSspPyQvLFxuICAgICAgICByZXNvbHZlOiBzdHIgPT4gcGFyc2VGbG9hdChzdHIpLFxuICAgICAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeUpTT05cbiAgICB9XG5dO1xuY29uc3QganNvbkVycm9yID0ge1xuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAnJyxcbiAgICB0ZXN0OiAvXi8sXG4gICAgcmVzb2x2ZShzdHIsIG9uRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihgVW5yZXNvbHZlZCBwbGFpbiBzY2FsYXIgJHtKU09OLnN0cmluZ2lmeShzdHIpfWApO1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cbn07XG5jb25zdCBzY2hlbWEgPSBbbWFwLCBzZXFdLmNvbmNhdChqc29uU2NhbGFycywganNvbkVycm9yKTtcblxuZXhwb3J0IHsgc2NoZW1hIH07XG4iLCAiaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vLi4vbm9kZXMvU2NhbGFyLmpzJztcbmltcG9ydCB7IHN0cmluZ2lmeVN0cmluZyB9IGZyb20gJy4uLy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlTdHJpbmcuanMnO1xuXG5jb25zdCBiaW5hcnkgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHZhbHVlIGluc3RhbmNlb2YgVWludDhBcnJheSwgLy8gQnVmZmVyIGluaGVyaXRzIGZyb20gVWludDhBcnJheVxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmJpbmFyeScsXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIEJ1ZmZlciBpbiBub2RlIGFuZCBhbiBVaW50OEFycmF5IGluIGJyb3dzZXJzXG4gICAgICpcbiAgICAgKiBUbyB1c2UgdGhlIHJlc3VsdGluZyBidWZmZXIgYXMgYW4gaW1hZ2UsIHlvdSdsbCB3YW50IHRvIGRvIHNvbWV0aGluZyBsaWtlOlxuICAgICAqXG4gICAgICogICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2J1ZmZlcl0sIHsgdHlwZTogJ2ltYWdlL2pwZWcnIH0pXG4gICAgICogICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGhvdG8nKS5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpXG4gICAgICovXG4gICAgcmVzb2x2ZShzcmMsIG9uRXJyb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhdG9iID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBPbiBJRSAxMSwgYXRvYigpIGNhbid0IGhhbmRsZSBuZXdsaW5lc1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gYXRvYihzcmMucmVwbGFjZSgvW1xcblxccl0vZywgJycpKTtcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KHN0ci5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgYnVmZmVyW2ldID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb25FcnJvcignVGhpcyBlbnZpcm9ubWVudCBkb2VzIG5vdCBzdXBwb3J0IHJlYWRpbmcgYmluYXJ5IHRhZ3M7IGVpdGhlciBCdWZmZXIgb3IgYXRvYiBpcyByZXF1aXJlZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHNyYztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3RyaW5naWZ5KHsgY29tbWVudCwgdHlwZSwgdmFsdWUgfSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgICAgIGlmICghdmFsdWUpXG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IHZhbHVlOyAvLyBjaGVja2VkIGVhcmxpZXIgYnkgYmluYXJ5LmlkZW50aWZ5KClcbiAgICAgICAgbGV0IHN0cjtcbiAgICAgICAgaWYgKHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsZXQgcyA9ICcnO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWYubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSk7XG4gICAgICAgICAgICBzdHIgPSBidG9hKHMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGVudmlyb25tZW50IGRvZXMgbm90IHN1cHBvcnQgd3JpdGluZyBiaW5hcnkgdGFnczsgZWl0aGVyIEJ1ZmZlciBvciBidG9hIGlzIHJlcXVpcmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdHlwZSA/PyAodHlwZSA9IFNjYWxhci5CTE9DS19MSVRFUkFMKTtcbiAgICAgICAgaWYgKHR5cGUgIT09IFNjYWxhci5RVU9URV9ET1VCTEUpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVXaWR0aCA9IE1hdGgubWF4KGN0eC5vcHRpb25zLmxpbmVXaWR0aCAtIGN0eC5pbmRlbnQubGVuZ3RoLCBjdHgub3B0aW9ucy5taW5Db250ZW50V2lkdGgpO1xuICAgICAgICAgICAgY29uc3QgbiA9IE1hdGguY2VpbChzdHIubGVuZ3RoIC8gbGluZVdpZHRoKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gbmV3IEFycmF5KG4pO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG8gPSAwOyBpIDwgbjsgKytpLCBvICs9IGxpbmVXaWR0aCkge1xuICAgICAgICAgICAgICAgIGxpbmVzW2ldID0gc3RyLnN1YnN0cihvLCBsaW5lV2lkdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyID0gbGluZXMuam9pbih0eXBlID09PSBTY2FsYXIuQkxPQ0tfTElURVJBTCA/ICdcXG4nIDogJyAnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyaW5naWZ5U3RyaW5nKHsgY29tbWVudCwgdHlwZSwgdmFsdWU6IHN0ciB9LCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGJpbmFyeSB9O1xuIiwgImltcG9ydCB7IGlzU2VxLCBpc1BhaXIsIGlzTWFwIH0gZnJvbSAnLi4vLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgY3JlYXRlUGFpciwgUGFpciB9IGZyb20gJy4uLy4uL25vZGVzL1BhaXIuanMnO1xuaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vLi4vbm9kZXMvU2NhbGFyLmpzJztcbmltcG9ydCB7IFlBTUxTZXEgfSBmcm9tICcuLi8uLi9ub2Rlcy9ZQU1MU2VxLmpzJztcblxuZnVuY3Rpb24gcmVzb2x2ZVBhaXJzKHNlcSwgb25FcnJvcikge1xuICAgIGlmIChpc1NlcShzZXEpKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VxLml0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHNlcS5pdGVtc1tpXTtcbiAgICAgICAgICAgIGlmIChpc1BhaXIoaXRlbSkpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBlbHNlIGlmIChpc01hcChpdGVtKSkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLml0ZW1zLmxlbmd0aCA+IDEpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoJ0VhY2ggcGFpciBtdXN0IGhhdmUgaXRzIG93biBzZXF1ZW5jZSBpbmRpY2F0b3InKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWlyID0gaXRlbS5pdGVtc1swXSB8fCBuZXcgUGFpcihuZXcgU2NhbGFyKG51bGwpKTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50QmVmb3JlKVxuICAgICAgICAgICAgICAgICAgICBwYWlyLmtleS5jb21tZW50QmVmb3JlID0gcGFpci5rZXkuY29tbWVudEJlZm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBgJHtpdGVtLmNvbW1lbnRCZWZvcmV9XFxuJHtwYWlyLmtleS5jb21tZW50QmVmb3JlfWBcbiAgICAgICAgICAgICAgICAgICAgICAgIDogaXRlbS5jb21tZW50QmVmb3JlO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY24gPSBwYWlyLnZhbHVlID8/IHBhaXIua2V5O1xuICAgICAgICAgICAgICAgICAgICBjbi5jb21tZW50ID0gY24uY29tbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBgJHtpdGVtLmNvbW1lbnR9XFxuJHtjbi5jb21tZW50fWBcbiAgICAgICAgICAgICAgICAgICAgICAgIDogaXRlbS5jb21tZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpdGVtID0gcGFpcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlcS5pdGVtc1tpXSA9IGlzUGFpcihpdGVtKSA/IGl0ZW0gOiBuZXcgUGFpcihpdGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAgICAgIG9uRXJyb3IoJ0V4cGVjdGVkIGEgc2VxdWVuY2UgZm9yIHRoaXMgdGFnJyk7XG4gICAgcmV0dXJuIHNlcTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVBhaXJzKHNjaGVtYSwgaXRlcmFibGUsIGN0eCkge1xuICAgIGNvbnN0IHsgcmVwbGFjZXIgfSA9IGN0eDtcbiAgICBjb25zdCBwYWlycyA9IG5ldyBZQU1MU2VxKHNjaGVtYSk7XG4gICAgcGFpcnMudGFnID0gJ3RhZzp5YW1sLm9yZywyMDAyOnBhaXJzJztcbiAgICBsZXQgaSA9IDA7XG4gICAgaWYgKGl0ZXJhYmxlICYmIFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcmFibGUpKVxuICAgICAgICBmb3IgKGxldCBpdCBvZiBpdGVyYWJsZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBsYWNlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICBpdCA9IHJlcGxhY2VyLmNhbGwoaXRlcmFibGUsIFN0cmluZyhpKyspLCBpdCk7XG4gICAgICAgICAgICBsZXQga2V5LCB2YWx1ZTtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0KSkge1xuICAgICAgICAgICAgICAgIGlmIChpdC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gaXRbMF07XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaXRbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRXhwZWN0ZWQgW2tleSwgdmFsdWVdIHR1cGxlOiAke2l0fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXQgJiYgaXQgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoaXQpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBrZXlzWzBdO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGl0W2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBFeHBlY3RlZCB0dXBsZSB3aXRoIG9uZSBrZXksIG5vdCAke2tleXMubGVuZ3RofSBrZXlzYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAga2V5ID0gaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYWlycy5pdGVtcy5wdXNoKGNyZWF0ZVBhaXIoa2V5LCB2YWx1ZSwgY3R4KSk7XG4gICAgICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG59XG5jb25zdCBwYWlycyA9IHtcbiAgICBjb2xsZWN0aW9uOiAnc2VxJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpwYWlycycsXG4gICAgcmVzb2x2ZTogcmVzb2x2ZVBhaXJzLFxuICAgIGNyZWF0ZU5vZGU6IGNyZWF0ZVBhaXJzXG59O1xuXG5leHBvcnQgeyBjcmVhdGVQYWlycywgcGFpcnMsIHJlc29sdmVQYWlycyB9O1xuIiwgImltcG9ydCB7IGlzU2NhbGFyLCBpc1BhaXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyB0b0pTIH0gZnJvbSAnLi4vLi4vbm9kZXMvdG9KUy5qcyc7XG5pbXBvcnQgeyBZQU1MTWFwIH0gZnJvbSAnLi4vLi4vbm9kZXMvWUFNTE1hcC5qcyc7XG5pbXBvcnQgeyBZQU1MU2VxIH0gZnJvbSAnLi4vLi4vbm9kZXMvWUFNTFNlcS5qcyc7XG5pbXBvcnQgeyByZXNvbHZlUGFpcnMsIGNyZWF0ZVBhaXJzIH0gZnJvbSAnLi9wYWlycy5qcyc7XG5cbmNsYXNzIFlBTUxPTWFwIGV4dGVuZHMgWUFNTFNlcSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuYWRkID0gWUFNTE1hcC5wcm90b3R5cGUuYWRkLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGVsZXRlID0gWUFNTE1hcC5wcm90b3R5cGUuZGVsZXRlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZ2V0ID0gWUFNTE1hcC5wcm90b3R5cGUuZ2V0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFzID0gWUFNTE1hcC5wcm90b3R5cGUuaGFzLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc2V0ID0gWUFNTE1hcC5wcm90b3R5cGUuc2V0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudGFnID0gWUFNTE9NYXAudGFnO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJZiBgY3R4YCBpcyBnaXZlbiwgdGhlIHJldHVybiB0eXBlIGlzIGFjdHVhbGx5IGBNYXA8dW5rbm93biwgdW5rbm93bj5gLFxuICAgICAqIGJ1dCBUeXBlU2NyaXB0IHdvbid0IGFsbG93IHdpZGVuaW5nIHRoZSBzaWduYXR1cmUgb2YgYSBjaGlsZCBtZXRob2QuXG4gICAgICovXG4gICAgdG9KU09OKF8sIGN0eCkge1xuICAgICAgICBpZiAoIWN0eClcbiAgICAgICAgICAgIHJldHVybiBzdXBlci50b0pTT04oXyk7XG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgaWYgKGN0eD8ub25DcmVhdGUpXG4gICAgICAgICAgICBjdHgub25DcmVhdGUobWFwKTtcbiAgICAgICAgZm9yIChjb25zdCBwYWlyIG9mIHRoaXMuaXRlbXMpIHtcbiAgICAgICAgICAgIGxldCBrZXksIHZhbHVlO1xuICAgICAgICAgICAgaWYgKGlzUGFpcihwYWlyKSkge1xuICAgICAgICAgICAgICAgIGtleSA9IHRvSlMocGFpci5rZXksICcnLCBjdHgpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdG9KUyhwYWlyLnZhbHVlLCBrZXksIGN0eCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBrZXkgPSB0b0pTKHBhaXIsICcnLCBjdHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hcC5oYXMoa2V5KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09yZGVyZWQgbWFwcyBtdXN0IG5vdCBpbmNsdWRlIGR1cGxpY2F0ZSBrZXlzJyk7XG4gICAgICAgICAgICBtYXAuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tKHNjaGVtYSwgaXRlcmFibGUsIGN0eCkge1xuICAgICAgICBjb25zdCBwYWlycyA9IGNyZWF0ZVBhaXJzKHNjaGVtYSwgaXRlcmFibGUsIGN0eCk7XG4gICAgICAgIGNvbnN0IG9tYXAgPSBuZXcgdGhpcygpO1xuICAgICAgICBvbWFwLml0ZW1zID0gcGFpcnMuaXRlbXM7XG4gICAgICAgIHJldHVybiBvbWFwO1xuICAgIH1cbn1cbllBTUxPTWFwLnRhZyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpvbWFwJztcbmNvbnN0IG9tYXAgPSB7XG4gICAgY29sbGVjdGlvbjogJ3NlcScsXG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHZhbHVlIGluc3RhbmNlb2YgTWFwLFxuICAgIG5vZGVDbGFzczogWUFNTE9NYXAsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6b21hcCcsXG4gICAgcmVzb2x2ZShzZXEsIG9uRXJyb3IpIHtcbiAgICAgICAgY29uc3QgcGFpcnMgPSByZXNvbHZlUGFpcnMoc2VxLCBvbkVycm9yKTtcbiAgICAgICAgY29uc3Qgc2VlbktleXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCB7IGtleSB9IG9mIHBhaXJzLml0ZW1zKSB7XG4gICAgICAgICAgICBpZiAoaXNTY2FsYXIoa2V5KSkge1xuICAgICAgICAgICAgICAgIGlmIChzZWVuS2V5cy5pbmNsdWRlcyhrZXkudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoYE9yZGVyZWQgbWFwcyBtdXN0IG5vdCBpbmNsdWRlIGR1cGxpY2F0ZSBrZXlzOiAke2tleS52YWx1ZX1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlZW5LZXlzLnB1c2goa2V5LnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IFlBTUxPTWFwKCksIHBhaXJzKTtcbiAgICB9LFxuICAgIGNyZWF0ZU5vZGU6IChzY2hlbWEsIGl0ZXJhYmxlLCBjdHgpID0+IFlBTUxPTWFwLmZyb20oc2NoZW1hLCBpdGVyYWJsZSwgY3R4KVxufTtcblxuZXhwb3J0IHsgWUFNTE9NYXAsIG9tYXAgfTtcbiIsICJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9TY2FsYXIuanMnO1xuXG5mdW5jdGlvbiBib29sU3RyaW5naWZ5KHsgdmFsdWUsIHNvdXJjZSB9LCBjdHgpIHtcbiAgICBjb25zdCBib29sT2JqID0gdmFsdWUgPyB0cnVlVGFnIDogZmFsc2VUYWc7XG4gICAgaWYgKHNvdXJjZSAmJiBib29sT2JqLnRlc3QudGVzdChzb3VyY2UpKVxuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgIHJldHVybiB2YWx1ZSA/IGN0eC5vcHRpb25zLnRydWVTdHIgOiBjdHgub3B0aW9ucy5mYWxzZVN0cjtcbn1cbmNvbnN0IHRydWVUYWcgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHZhbHVlID09PSB0cnVlLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6Ym9vbCcsXG4gICAgdGVzdDogL14oPzpZfHl8W1l5XWVzfFlFU3xbVHRdcnVlfFRSVUV8W09vXW58T04pJC8sXG4gICAgcmVzb2x2ZTogKCkgPT4gbmV3IFNjYWxhcih0cnVlKSxcbiAgICBzdHJpbmdpZnk6IGJvb2xTdHJpbmdpZnlcbn07XG5jb25zdCBmYWxzZVRhZyA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdmFsdWUgPT09IGZhbHNlLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6Ym9vbCcsXG4gICAgdGVzdDogL14oPzpOfG58W05uXW98Tk98W0ZmXWFsc2V8RkFMU0V8W09vXWZmfE9GRikkLyxcbiAgICByZXNvbHZlOiAoKSA9PiBuZXcgU2NhbGFyKGZhbHNlKSxcbiAgICBzdHJpbmdpZnk6IGJvb2xTdHJpbmdpZnlcbn07XG5cbmV4cG9ydCB7IGZhbHNlVGFnLCB0cnVlVGFnIH07XG4iLCAiaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vLi4vbm9kZXMvU2NhbGFyLmpzJztcbmltcG9ydCB7IHN0cmluZ2lmeU51bWJlciB9IGZyb20gJy4uLy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlOdW1iZXIuanMnO1xuXG5jb25zdCBmbG9hdE5hTiA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JyxcbiAgICB0ZXN0OiAvXig/OlstK10/XFwuKD86aW5mfEluZnxJTkYpfFxcLm5hbnxcXC5OYU58XFwuTkFOKSQvLFxuICAgIHJlc29sdmU6IChzdHIpID0+IHN0ci5zbGljZSgtMykudG9Mb3dlckNhc2UoKSA9PT0gJ25hbidcbiAgICAgICAgPyBOYU5cbiAgICAgICAgOiBzdHJbMF0gPT09ICctJ1xuICAgICAgICAgICAgPyBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFlcbiAgICAgICAgICAgIDogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5TnVtYmVyXG59O1xuY29uc3QgZmxvYXRFeHAgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCcsXG4gICAgZm9ybWF0OiAnRVhQJyxcbiAgICB0ZXN0OiAvXlstK10/KD86WzAtOV1bMC05X10qKT8oPzpcXC5bMC05X10qKT9bZUVdWy0rXT9bMC05XSskLyxcbiAgICByZXNvbHZlOiAoc3RyKSA9PiBwYXJzZUZsb2F0KHN0ci5yZXBsYWNlKC9fL2csICcnKSksXG4gICAgc3RyaW5naWZ5KG5vZGUpIHtcbiAgICAgICAgY29uc3QgbnVtID0gTnVtYmVyKG5vZGUudmFsdWUpO1xuICAgICAgICByZXR1cm4gaXNGaW5pdGUobnVtKSA/IG51bS50b0V4cG9uZW50aWFsKCkgOiBzdHJpbmdpZnlOdW1iZXIobm9kZSk7XG4gICAgfVxufTtcbmNvbnN0IGZsb2F0ID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnLFxuICAgIHRlc3Q6IC9eWy0rXT8oPzpbMC05XVswLTlfXSopP1xcLlswLTlfXSokLyxcbiAgICByZXNvbHZlKHN0cikge1xuICAgICAgICBjb25zdCBub2RlID0gbmV3IFNjYWxhcihwYXJzZUZsb2F0KHN0ci5yZXBsYWNlKC9fL2csICcnKSkpO1xuICAgICAgICBjb25zdCBkb3QgPSBzdHIuaW5kZXhPZignLicpO1xuICAgICAgICBpZiAoZG90ICE9PSAtMSkge1xuICAgICAgICAgICAgY29uc3QgZiA9IHN0ci5zdWJzdHJpbmcoZG90ICsgMSkucmVwbGFjZSgvXy9nLCAnJyk7XG4gICAgICAgICAgICBpZiAoZltmLmxlbmd0aCAtIDFdID09PSAnMCcpXG4gICAgICAgICAgICAgICAgbm9kZS5taW5GcmFjdGlvbkRpZ2l0cyA9IGYubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH0sXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlOdW1iZXJcbn07XG5cbmV4cG9ydCB7IGZsb2F0LCBmbG9hdEV4cCwgZmxvYXROYU4gfTtcbiIsICJpbXBvcnQgeyBzdHJpbmdpZnlOdW1iZXIgfSBmcm9tICcuLi8uLi9zdHJpbmdpZnkvc3RyaW5naWZ5TnVtYmVyLmpzJztcblxuY29uc3QgaW50SWRlbnRpZnkgPSAodmFsdWUpID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ2JpZ2ludCcgfHwgTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSk7XG5mdW5jdGlvbiBpbnRSZXNvbHZlKHN0ciwgb2Zmc2V0LCByYWRpeCwgeyBpbnRBc0JpZ0ludCB9KSB7XG4gICAgY29uc3Qgc2lnbiA9IHN0clswXTtcbiAgICBpZiAoc2lnbiA9PT0gJy0nIHx8IHNpZ24gPT09ICcrJylcbiAgICAgICAgb2Zmc2V0ICs9IDE7XG4gICAgc3RyID0gc3RyLnN1YnN0cmluZyhvZmZzZXQpLnJlcGxhY2UoL18vZywgJycpO1xuICAgIGlmIChpbnRBc0JpZ0ludCkge1xuICAgICAgICBzd2l0Y2ggKHJhZGl4KSB7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgc3RyID0gYDBiJHtzdHJ9YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICBzdHIgPSBgMG8ke3N0cn1gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxNjpcbiAgICAgICAgICAgICAgICBzdHIgPSBgMHgke3N0cn1gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG4gPSBCaWdJbnQoc3RyKTtcbiAgICAgICAgcmV0dXJuIHNpZ24gPT09ICctJyA/IEJpZ0ludCgtMSkgKiBuIDogbjtcbiAgICB9XG4gICAgY29uc3QgbiA9IHBhcnNlSW50KHN0ciwgcmFkaXgpO1xuICAgIHJldHVybiBzaWduID09PSAnLScgPyAtMSAqIG4gOiBuO1xufVxuZnVuY3Rpb24gaW50U3RyaW5naWZ5KG5vZGUsIHJhZGl4LCBwcmVmaXgpIHtcbiAgICBjb25zdCB7IHZhbHVlIH0gPSBub2RlO1xuICAgIGlmIChpbnRJZGVudGlmeSh2YWx1ZSkpIHtcbiAgICAgICAgY29uc3Qgc3RyID0gdmFsdWUudG9TdHJpbmcocmFkaXgpO1xuICAgICAgICByZXR1cm4gdmFsdWUgPCAwID8gJy0nICsgcHJlZml4ICsgc3RyLnN1YnN0cigxKSA6IHByZWZpeCArIHN0cjtcbiAgICB9XG4gICAgcmV0dXJuIHN0cmluZ2lmeU51bWJlcihub2RlKTtcbn1cbmNvbnN0IGludEJpbiA9IHtcbiAgICBpZGVudGlmeTogaW50SWRlbnRpZnksXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLFxuICAgIGZvcm1hdDogJ0JJTicsXG4gICAgdGVzdDogL15bLStdPzBiWzAtMV9dKyQvLFxuICAgIHJlc29sdmU6IChzdHIsIF9vbkVycm9yLCBvcHQpID0+IGludFJlc29sdmUoc3RyLCAyLCAyLCBvcHQpLFxuICAgIHN0cmluZ2lmeTogbm9kZSA9PiBpbnRTdHJpbmdpZnkobm9kZSwgMiwgJzBiJylcbn07XG5jb25zdCBpbnRPY3QgPSB7XG4gICAgaWRlbnRpZnk6IGludElkZW50aWZ5LFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6aW50JyxcbiAgICBmb3JtYXQ6ICdPQ1QnLFxuICAgIHRlc3Q6IC9eWy0rXT8wWzAtN19dKyQvLFxuICAgIHJlc29sdmU6IChzdHIsIF9vbkVycm9yLCBvcHQpID0+IGludFJlc29sdmUoc3RyLCAxLCA4LCBvcHQpLFxuICAgIHN0cmluZ2lmeTogbm9kZSA9PiBpbnRTdHJpbmdpZnkobm9kZSwgOCwgJzAnKVxufTtcbmNvbnN0IGludCA9IHtcbiAgICBpZGVudGlmeTogaW50SWRlbnRpZnksXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLFxuICAgIHRlc3Q6IC9eWy0rXT9bMC05XVswLTlfXSokLyxcbiAgICByZXNvbHZlOiAoc3RyLCBfb25FcnJvciwgb3B0KSA9PiBpbnRSZXNvbHZlKHN0ciwgMCwgMTAsIG9wdCksXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlOdW1iZXJcbn07XG5jb25zdCBpbnRIZXggPSB7XG4gICAgaWRlbnRpZnk6IGludElkZW50aWZ5LFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6aW50JyxcbiAgICBmb3JtYXQ6ICdIRVgnLFxuICAgIHRlc3Q6IC9eWy0rXT8weFswLTlhLWZBLUZfXSskLyxcbiAgICByZXNvbHZlOiAoc3RyLCBfb25FcnJvciwgb3B0KSA9PiBpbnRSZXNvbHZlKHN0ciwgMiwgMTYsIG9wdCksXG4gICAgc3RyaW5naWZ5OiBub2RlID0+IGludFN0cmluZ2lmeShub2RlLCAxNiwgJzB4Jylcbn07XG5cbmV4cG9ydCB7IGludCwgaW50QmluLCBpbnRIZXgsIGludE9jdCB9O1xuIiwgImltcG9ydCB7IGlzTWFwLCBpc1BhaXIsIGlzU2NhbGFyIH0gZnJvbSAnLi4vLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgUGFpciwgY3JlYXRlUGFpciB9IGZyb20gJy4uLy4uL25vZGVzL1BhaXIuanMnO1xuaW1wb3J0IHsgWUFNTE1hcCwgZmluZFBhaXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9ZQU1MTWFwLmpzJztcblxuY2xhc3MgWUFNTFNldCBleHRlbmRzIFlBTUxNYXAge1xuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xuICAgICAgICBzdXBlcihzY2hlbWEpO1xuICAgICAgICB0aGlzLnRhZyA9IFlBTUxTZXQudGFnO1xuICAgIH1cbiAgICBhZGQoa2V5KSB7XG4gICAgICAgIGxldCBwYWlyO1xuICAgICAgICBpZiAoaXNQYWlyKGtleSkpXG4gICAgICAgICAgICBwYWlyID0ga2V5O1xuICAgICAgICBlbHNlIGlmIChrZXkgJiZcbiAgICAgICAgICAgIHR5cGVvZiBrZXkgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAna2V5JyBpbiBrZXkgJiZcbiAgICAgICAgICAgICd2YWx1ZScgaW4ga2V5ICYmXG4gICAgICAgICAgICBrZXkudmFsdWUgPT09IG51bGwpXG4gICAgICAgICAgICBwYWlyID0gbmV3IFBhaXIoa2V5LmtleSwgbnVsbCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHBhaXIgPSBuZXcgUGFpcihrZXksIG51bGwpO1xuICAgICAgICBjb25zdCBwcmV2ID0gZmluZFBhaXIodGhpcy5pdGVtcywgcGFpci5rZXkpO1xuICAgICAgICBpZiAoIXByZXYpXG4gICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2gocGFpcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIElmIGBrZWVwUGFpcmAgaXMgYHRydWVgLCByZXR1cm5zIHRoZSBQYWlyIG1hdGNoaW5nIGBrZXlgLlxuICAgICAqIE90aGVyd2lzZSwgcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhhdCBQYWlyJ3Mga2V5LlxuICAgICAqL1xuICAgIGdldChrZXksIGtlZXBQYWlyKSB7XG4gICAgICAgIGNvbnN0IHBhaXIgPSBmaW5kUGFpcih0aGlzLml0ZW1zLCBrZXkpO1xuICAgICAgICByZXR1cm4gIWtlZXBQYWlyICYmIGlzUGFpcihwYWlyKVxuICAgICAgICAgICAgPyBpc1NjYWxhcihwYWlyLmtleSlcbiAgICAgICAgICAgICAgICA/IHBhaXIua2V5LnZhbHVlXG4gICAgICAgICAgICAgICAgOiBwYWlyLmtleVxuICAgICAgICAgICAgOiBwYWlyO1xuICAgIH1cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGJvb2xlYW4gdmFsdWUgZm9yIHNldChrZXksIHZhbHVlKSBpbiBhIFlBTUwgc2V0LCBub3QgJHt0eXBlb2YgdmFsdWV9YCk7XG4gICAgICAgIGNvbnN0IHByZXYgPSBmaW5kUGFpcih0aGlzLml0ZW1zLCBrZXkpO1xuICAgICAgICBpZiAocHJldiAmJiAhdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKHRoaXMuaXRlbXMuaW5kZXhPZihwcmV2KSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXByZXYgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChuZXcgUGFpcihrZXkpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b0pTT04oXywgY3R4KSB7XG4gICAgICAgIHJldHVybiBzdXBlci50b0pTT04oXywgY3R4LCBTZXQpO1xuICAgIH1cbiAgICB0b1N0cmluZyhjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApIHtcbiAgICAgICAgaWYgKCFjdHgpXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLmhhc0FsbE51bGxWYWx1ZXModHJ1ZSkpXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIudG9TdHJpbmcoT2JqZWN0LmFzc2lnbih7fSwgY3R4LCB7IGFsbE51bGxWYWx1ZXM6IHRydWUgfSksIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldCBpdGVtcyBtdXN0IGFsbCBoYXZlIG51bGwgdmFsdWVzJyk7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tKHNjaGVtYSwgaXRlcmFibGUsIGN0eCkge1xuICAgICAgICBjb25zdCB7IHJlcGxhY2VyIH0gPSBjdHg7XG4gICAgICAgIGNvbnN0IHNldCA9IG5ldyB0aGlzKHNjaGVtYSk7XG4gICAgICAgIGlmIChpdGVyYWJsZSAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXJhYmxlKSlcbiAgICAgICAgICAgIGZvciAobGV0IHZhbHVlIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBsYWNlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSByZXBsYWNlci5jYWxsKGl0ZXJhYmxlLCB2YWx1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHNldC5pdGVtcy5wdXNoKGNyZWF0ZVBhaXIodmFsdWUsIG51bGwsIGN0eCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0O1xuICAgIH1cbn1cbllBTUxTZXQudGFnID0gJ3RhZzp5YW1sLm9yZywyMDAyOnNldCc7XG5jb25zdCBzZXQgPSB7XG4gICAgY29sbGVjdGlvbjogJ21hcCcsXG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHZhbHVlIGluc3RhbmNlb2YgU2V0LFxuICAgIG5vZGVDbGFzczogWUFNTFNldCxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpzZXQnLFxuICAgIGNyZWF0ZU5vZGU6IChzY2hlbWEsIGl0ZXJhYmxlLCBjdHgpID0+IFlBTUxTZXQuZnJvbShzY2hlbWEsIGl0ZXJhYmxlLCBjdHgpLFxuICAgIHJlc29sdmUobWFwLCBvbkVycm9yKSB7XG4gICAgICAgIGlmIChpc01hcChtYXApKSB7XG4gICAgICAgICAgICBpZiAobWFwLmhhc0FsbE51bGxWYWx1ZXModHJ1ZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IFlBTUxTZXQoKSwgbWFwKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBvbkVycm9yKCdTZXQgaXRlbXMgbXVzdCBhbGwgaGF2ZSBudWxsIHZhbHVlcycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG9uRXJyb3IoJ0V4cGVjdGVkIGEgbWFwcGluZyBmb3IgdGhpcyB0YWcnKTtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBZQU1MU2V0LCBzZXQgfTtcbiIsICJpbXBvcnQgeyBzdHJpbmdpZnlOdW1iZXIgfSBmcm9tICcuLi8uLi9zdHJpbmdpZnkvc3RyaW5naWZ5TnVtYmVyLmpzJztcblxuLyoqIEludGVybmFsIHR5cGVzIGhhbmRsZSBiaWdpbnQgYXMgbnVtYmVyLCBiZWNhdXNlIFRTIGNhbid0IGZpZ3VyZSBpdCBvdXQuICovXG5mdW5jdGlvbiBwYXJzZVNleGFnZXNpbWFsKHN0ciwgYXNCaWdJbnQpIHtcbiAgICBjb25zdCBzaWduID0gc3RyWzBdO1xuICAgIGNvbnN0IHBhcnRzID0gc2lnbiA9PT0gJy0nIHx8IHNpZ24gPT09ICcrJyA/IHN0ci5zdWJzdHJpbmcoMSkgOiBzdHI7XG4gICAgY29uc3QgbnVtID0gKG4pID0+IGFzQmlnSW50ID8gQmlnSW50KG4pIDogTnVtYmVyKG4pO1xuICAgIGNvbnN0IHJlcyA9IHBhcnRzXG4gICAgICAgIC5yZXBsYWNlKC9fL2csICcnKVxuICAgICAgICAuc3BsaXQoJzonKVxuICAgICAgICAucmVkdWNlKChyZXMsIHApID0+IHJlcyAqIG51bSg2MCkgKyBudW0ocCksIG51bSgwKSk7XG4gICAgcmV0dXJuIChzaWduID09PSAnLScgPyBudW0oLTEpICogcmVzIDogcmVzKTtcbn1cbi8qKlxuICogaGhoaDptbTpzcy5zc3NcbiAqXG4gKiBJbnRlcm5hbCB0eXBlcyBoYW5kbGUgYmlnaW50IGFzIG51bWJlciwgYmVjYXVzZSBUUyBjYW4ndCBmaWd1cmUgaXQgb3V0LlxuICovXG5mdW5jdGlvbiBzdHJpbmdpZnlTZXhhZ2VzaW1hbChub2RlKSB7XG4gICAgbGV0IHsgdmFsdWUgfSA9IG5vZGU7XG4gICAgbGV0IG51bSA9IChuKSA9PiBuO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdiaWdpbnQnKVxuICAgICAgICBudW0gPSBuID0+IEJpZ0ludChuKTtcbiAgICBlbHNlIGlmIChpc05hTih2YWx1ZSkgfHwgIWlzRmluaXRlKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIHN0cmluZ2lmeU51bWJlcihub2RlKTtcbiAgICBsZXQgc2lnbiA9ICcnO1xuICAgIGlmICh2YWx1ZSA8IDApIHtcbiAgICAgICAgc2lnbiA9ICctJztcbiAgICAgICAgdmFsdWUgKj0gbnVtKC0xKTtcbiAgICB9XG4gICAgY29uc3QgXzYwID0gbnVtKDYwKTtcbiAgICBjb25zdCBwYXJ0cyA9IFt2YWx1ZSAlIF82MF07IC8vIHNlY29uZHMsIGluY2x1ZGluZyBtc1xuICAgIGlmICh2YWx1ZSA8IDYwKSB7XG4gICAgICAgIHBhcnRzLnVuc2hpZnQoMCk7IC8vIGF0IGxlYXN0IG9uZSA6IGlzIHJlcXVpcmVkXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YWx1ZSA9ICh2YWx1ZSAtIHBhcnRzWzBdKSAvIF82MDtcbiAgICAgICAgcGFydHMudW5zaGlmdCh2YWx1ZSAlIF82MCk7IC8vIG1pbnV0ZXNcbiAgICAgICAgaWYgKHZhbHVlID49IDYwKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSAtIHBhcnRzWzBdKSAvIF82MDtcbiAgICAgICAgICAgIHBhcnRzLnVuc2hpZnQodmFsdWUpOyAvLyBob3Vyc1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoc2lnbiArXG4gICAgICAgIHBhcnRzXG4gICAgICAgICAgICAubWFwKG4gPT4gU3RyaW5nKG4pLnBhZFN0YXJ0KDIsICcwJykpXG4gICAgICAgICAgICAuam9pbignOicpXG4gICAgICAgICAgICAucmVwbGFjZSgvMDAwMDAwXFxkKiQvLCAnJykgLy8gJSA2MCBtYXkgaW50cm9kdWNlIGVycm9yXG4gICAgKTtcbn1cbmNvbnN0IGludFRpbWUgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ2JpZ2ludCcgfHwgTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSksXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLFxuICAgIGZvcm1hdDogJ1RJTUUnLFxuICAgIHRlc3Q6IC9eWy0rXT9bMC05XVswLTlfXSooPzo6WzAtNV0/WzAtOV0pKyQvLFxuICAgIHJlc29sdmU6IChzdHIsIF9vbkVycm9yLCB7IGludEFzQmlnSW50IH0pID0+IHBhcnNlU2V4YWdlc2ltYWwoc3RyLCBpbnRBc0JpZ0ludCksXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlTZXhhZ2VzaW1hbFxufTtcbmNvbnN0IGZsb2F0VGltZSA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JyxcbiAgICBmb3JtYXQ6ICdUSU1FJyxcbiAgICB0ZXN0OiAvXlstK10/WzAtOV1bMC05X10qKD86OlswLTVdP1swLTldKStcXC5bMC05X10qJC8sXG4gICAgcmVzb2x2ZTogc3RyID0+IHBhcnNlU2V4YWdlc2ltYWwoc3RyLCBmYWxzZSksXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlTZXhhZ2VzaW1hbFxufTtcbmNvbnN0IHRpbWVzdGFtcCA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6dGltZXN0YW1wJyxcbiAgICAvLyBJZiB0aGUgdGltZSB6b25lIGlzIG9taXR0ZWQsIHRoZSB0aW1lc3RhbXAgaXMgYXNzdW1lZCB0byBiZSBzcGVjaWZpZWQgaW4gVVRDLiBUaGUgdGltZSBwYXJ0XG4gICAgLy8gbWF5IGJlIG9taXR0ZWQgYWx0b2dldGhlciwgcmVzdWx0aW5nIGluIGEgZGF0ZSBmb3JtYXQuIEluIHN1Y2ggYSBjYXNlLCB0aGUgdGltZSBwYXJ0IGlzXG4gICAgLy8gYXNzdW1lZCB0byBiZSAwMDowMDowMFogKHN0YXJ0IG9mIGRheSwgVVRDKS5cbiAgICB0ZXN0OiBSZWdFeHAoJ14oWzAtOV17NH0pLShbMC05XXsxLDJ9KS0oWzAtOV17MSwyfSknICsgLy8gWVlZWS1NbS1EZFxuICAgICAgICAnKD86JyArIC8vIHRpbWUgaXMgb3B0aW9uYWxcbiAgICAgICAgJyg/OnR8VHxbIFxcXFx0XSspJyArIC8vIHQgfCBUIHwgd2hpdGVzcGFjZVxuICAgICAgICAnKFswLTldezEsMn0pOihbMC05XXsxLDJ9KTooWzAtOV17MSwyfShcXFxcLlswLTldKyk/KScgKyAvLyBIaDpNbTpTcyguc3MpP1xuICAgICAgICAnKD86WyBcXFxcdF0qKFp8Wy0rXVswMTJdP1swLTldKD86OlswLTldezJ9KT8pKT8nICsgLy8gWiB8ICs1IHwgLTAzOjMwXG4gICAgICAgICcpPyQnKSxcbiAgICByZXNvbHZlKHN0cikge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHN0ci5tYXRjaCh0aW1lc3RhbXAudGVzdCk7XG4gICAgICAgIGlmICghbWF0Y2gpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJyEhdGltZXN0YW1wIGV4cGVjdHMgYSBkYXRlLCBzdGFydGluZyB3aXRoIHl5eXktbW0tZGQnKTtcbiAgICAgICAgY29uc3QgWywgeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmRdID0gbWF0Y2gubWFwKE51bWJlcik7XG4gICAgICAgIGNvbnN0IG1pbGxpc2VjID0gbWF0Y2hbN10gPyBOdW1iZXIoKG1hdGNoWzddICsgJzAwJykuc3Vic3RyKDEsIDMpKSA6IDA7XG4gICAgICAgIGxldCBkYXRlID0gRGF0ZS5VVEMoeWVhciwgbW9udGggLSAxLCBkYXksIGhvdXIgfHwgMCwgbWludXRlIHx8IDAsIHNlY29uZCB8fCAwLCBtaWxsaXNlYyk7XG4gICAgICAgIGNvbnN0IHR6ID0gbWF0Y2hbOF07XG4gICAgICAgIGlmICh0eiAmJiB0eiAhPT0gJ1onKSB7XG4gICAgICAgICAgICBsZXQgZCA9IHBhcnNlU2V4YWdlc2ltYWwodHosIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhkKSA8IDMwKVxuICAgICAgICAgICAgICAgIGQgKj0gNjA7XG4gICAgICAgICAgICBkYXRlIC09IDYwMDAwICogZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZSk7XG4gICAgfSxcbiAgICBzdHJpbmdpZnk6ICh7IHZhbHVlIH0pID0+IHZhbHVlPy50b0lTT1N0cmluZygpLnJlcGxhY2UoLyhUMDA6MDA6MDApP1xcLjAwMFokLywgJycpID8/ICcnXG59O1xuXG5leHBvcnQgeyBmbG9hdFRpbWUsIGludFRpbWUsIHRpbWVzdGFtcCB9O1xuIiwgImltcG9ydCB7IG1hcCB9IGZyb20gJy4uL2NvbW1vbi9tYXAuanMnO1xuaW1wb3J0IHsgbnVsbFRhZyB9IGZyb20gJy4uL2NvbW1vbi9udWxsLmpzJztcbmltcG9ydCB7IHNlcSB9IGZyb20gJy4uL2NvbW1vbi9zZXEuanMnO1xuaW1wb3J0IHsgc3RyaW5nIH0gZnJvbSAnLi4vY29tbW9uL3N0cmluZy5qcyc7XG5pbXBvcnQgeyBiaW5hcnkgfSBmcm9tICcuL2JpbmFyeS5qcyc7XG5pbXBvcnQgeyB0cnVlVGFnLCBmYWxzZVRhZyB9IGZyb20gJy4vYm9vbC5qcyc7XG5pbXBvcnQgeyBmbG9hdE5hTiwgZmxvYXRFeHAsIGZsb2F0IH0gZnJvbSAnLi9mbG9hdC5qcyc7XG5pbXBvcnQgeyBpbnRCaW4sIGludE9jdCwgaW50LCBpbnRIZXggfSBmcm9tICcuL2ludC5qcyc7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4vbWVyZ2UuanMnO1xuaW1wb3J0IHsgb21hcCB9IGZyb20gJy4vb21hcC5qcyc7XG5pbXBvcnQgeyBwYWlycyB9IGZyb20gJy4vcGFpcnMuanMnO1xuaW1wb3J0IHsgc2V0IH0gZnJvbSAnLi9zZXQuanMnO1xuaW1wb3J0IHsgaW50VGltZSwgZmxvYXRUaW1lLCB0aW1lc3RhbXAgfSBmcm9tICcuL3RpbWVzdGFtcC5qcyc7XG5cbmNvbnN0IHNjaGVtYSA9IFtcbiAgICBtYXAsXG4gICAgc2VxLFxuICAgIHN0cmluZyxcbiAgICBudWxsVGFnLFxuICAgIHRydWVUYWcsXG4gICAgZmFsc2VUYWcsXG4gICAgaW50QmluLFxuICAgIGludE9jdCxcbiAgICBpbnQsXG4gICAgaW50SGV4LFxuICAgIGZsb2F0TmFOLFxuICAgIGZsb2F0RXhwLFxuICAgIGZsb2F0LFxuICAgIGJpbmFyeSxcbiAgICBtZXJnZSxcbiAgICBvbWFwLFxuICAgIHBhaXJzLFxuICAgIHNldCxcbiAgICBpbnRUaW1lLFxuICAgIGZsb2F0VGltZSxcbiAgICB0aW1lc3RhbXBcbl07XG5cbmV4cG9ydCB7IHNjaGVtYSB9O1xuIiwgImltcG9ydCB7IG1hcCB9IGZyb20gJy4vY29tbW9uL21hcC5qcyc7XG5pbXBvcnQgeyBudWxsVGFnIH0gZnJvbSAnLi9jb21tb24vbnVsbC5qcyc7XG5pbXBvcnQgeyBzZXEgfSBmcm9tICcuL2NvbW1vbi9zZXEuanMnO1xuaW1wb3J0IHsgc3RyaW5nIH0gZnJvbSAnLi9jb21tb24vc3RyaW5nLmpzJztcbmltcG9ydCB7IGJvb2xUYWcgfSBmcm9tICcuL2NvcmUvYm9vbC5qcyc7XG5pbXBvcnQgeyBmbG9hdE5hTiwgZmxvYXRFeHAsIGZsb2F0IH0gZnJvbSAnLi9jb3JlL2Zsb2F0LmpzJztcbmltcG9ydCB7IGludE9jdCwgaW50SGV4LCBpbnQgfSBmcm9tICcuL2NvcmUvaW50LmpzJztcbmltcG9ydCB7IHNjaGVtYSB9IGZyb20gJy4vY29yZS9zY2hlbWEuanMnO1xuaW1wb3J0IHsgc2NoZW1hIGFzIHNjaGVtYSQxIH0gZnJvbSAnLi9qc29uL3NjaGVtYS5qcyc7XG5pbXBvcnQgeyBiaW5hcnkgfSBmcm9tICcuL3lhbWwtMS4xL2JpbmFyeS5qcyc7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4veWFtbC0xLjEvbWVyZ2UuanMnO1xuaW1wb3J0IHsgb21hcCB9IGZyb20gJy4veWFtbC0xLjEvb21hcC5qcyc7XG5pbXBvcnQgeyBwYWlycyB9IGZyb20gJy4veWFtbC0xLjEvcGFpcnMuanMnO1xuaW1wb3J0IHsgc2NoZW1hIGFzIHNjaGVtYSQyIH0gZnJvbSAnLi95YW1sLTEuMS9zY2hlbWEuanMnO1xuaW1wb3J0IHsgc2V0IH0gZnJvbSAnLi95YW1sLTEuMS9zZXQuanMnO1xuaW1wb3J0IHsgdGltZXN0YW1wLCBpbnRUaW1lLCBmbG9hdFRpbWUgfSBmcm9tICcuL3lhbWwtMS4xL3RpbWVzdGFtcC5qcyc7XG5cbmNvbnN0IHNjaGVtYXMgPSBuZXcgTWFwKFtcbiAgICBbJ2NvcmUnLCBzY2hlbWFdLFxuICAgIFsnZmFpbHNhZmUnLCBbbWFwLCBzZXEsIHN0cmluZ11dLFxuICAgIFsnanNvbicsIHNjaGVtYSQxXSxcbiAgICBbJ3lhbWwxMScsIHNjaGVtYSQyXSxcbiAgICBbJ3lhbWwtMS4xJywgc2NoZW1hJDJdXG5dKTtcbmNvbnN0IHRhZ3NCeU5hbWUgPSB7XG4gICAgYmluYXJ5LFxuICAgIGJvb2w6IGJvb2xUYWcsXG4gICAgZmxvYXQsXG4gICAgZmxvYXRFeHAsXG4gICAgZmxvYXROYU4sXG4gICAgZmxvYXRUaW1lLFxuICAgIGludCxcbiAgICBpbnRIZXgsXG4gICAgaW50T2N0LFxuICAgIGludFRpbWUsXG4gICAgbWFwLFxuICAgIG1lcmdlLFxuICAgIG51bGw6IG51bGxUYWcsXG4gICAgb21hcCxcbiAgICBwYWlycyxcbiAgICBzZXEsXG4gICAgc2V0LFxuICAgIHRpbWVzdGFtcFxufTtcbmNvbnN0IGNvcmVLbm93blRhZ3MgPSB7XG4gICAgJ3RhZzp5YW1sLm9yZywyMDAyOmJpbmFyeSc6IGJpbmFyeSxcbiAgICAndGFnOnlhbWwub3JnLDIwMDI6bWVyZ2UnOiBtZXJnZSxcbiAgICAndGFnOnlhbWwub3JnLDIwMDI6b21hcCc6IG9tYXAsXG4gICAgJ3RhZzp5YW1sLm9yZywyMDAyOnBhaXJzJzogcGFpcnMsXG4gICAgJ3RhZzp5YW1sLm9yZywyMDAyOnNldCc6IHNldCxcbiAgICAndGFnOnlhbWwub3JnLDIwMDI6dGltZXN0YW1wJzogdGltZXN0YW1wXG59O1xuZnVuY3Rpb24gZ2V0VGFncyhjdXN0b21UYWdzLCBzY2hlbWFOYW1lLCBhZGRNZXJnZVRhZykge1xuICAgIGNvbnN0IHNjaGVtYVRhZ3MgPSBzY2hlbWFzLmdldChzY2hlbWFOYW1lKTtcbiAgICBpZiAoc2NoZW1hVGFncyAmJiAhY3VzdG9tVGFncykge1xuICAgICAgICByZXR1cm4gYWRkTWVyZ2VUYWcgJiYgIXNjaGVtYVRhZ3MuaW5jbHVkZXMobWVyZ2UpXG4gICAgICAgICAgICA/IHNjaGVtYVRhZ3MuY29uY2F0KG1lcmdlKVxuICAgICAgICAgICAgOiBzY2hlbWFUYWdzLnNsaWNlKCk7XG4gICAgfVxuICAgIGxldCB0YWdzID0gc2NoZW1hVGFncztcbiAgICBpZiAoIXRhZ3MpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY3VzdG9tVGFncykpXG4gICAgICAgICAgICB0YWdzID0gW107XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IEFycmF5LmZyb20oc2NoZW1hcy5rZXlzKCkpXG4gICAgICAgICAgICAgICAgLmZpbHRlcihrZXkgPT4ga2V5ICE9PSAneWFtbDExJylcbiAgICAgICAgICAgICAgICAubWFwKGtleSA9PiBKU09OLnN0cmluZ2lmeShrZXkpKVxuICAgICAgICAgICAgICAgIC5qb2luKCcsICcpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHNjaGVtYSBcIiR7c2NoZW1hTmFtZX1cIjsgdXNlIG9uZSBvZiAke2tleXN9IG9yIGRlZmluZSBjdXN0b21UYWdzIGFycmF5YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY3VzdG9tVGFncykpIHtcbiAgICAgICAgZm9yIChjb25zdCB0YWcgb2YgY3VzdG9tVGFncylcbiAgICAgICAgICAgIHRhZ3MgPSB0YWdzLmNvbmNhdCh0YWcpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgY3VzdG9tVGFncyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0YWdzID0gY3VzdG9tVGFncyh0YWdzLnNsaWNlKCkpO1xuICAgIH1cbiAgICBpZiAoYWRkTWVyZ2VUYWcpXG4gICAgICAgIHRhZ3MgPSB0YWdzLmNvbmNhdChtZXJnZSk7XG4gICAgcmV0dXJuIHRhZ3MucmVkdWNlKCh0YWdzLCB0YWcpID0+IHtcbiAgICAgICAgY29uc3QgdGFnT2JqID0gdHlwZW9mIHRhZyA9PT0gJ3N0cmluZycgPyB0YWdzQnlOYW1lW3RhZ10gOiB0YWc7XG4gICAgICAgIGlmICghdGFnT2JqKSB7XG4gICAgICAgICAgICBjb25zdCB0YWdOYW1lID0gSlNPTi5zdHJpbmdpZnkodGFnKTtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0YWdzQnlOYW1lKVxuICAgICAgICAgICAgICAgIC5tYXAoa2V5ID0+IEpTT04uc3RyaW5naWZ5KGtleSkpXG4gICAgICAgICAgICAgICAgLmpvaW4oJywgJyk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gY3VzdG9tIHRhZyAke3RhZ05hbWV9OyB1c2Ugb25lIG9mICR7a2V5c31gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRhZ3MuaW5jbHVkZXModGFnT2JqKSlcbiAgICAgICAgICAgIHRhZ3MucHVzaCh0YWdPYmopO1xuICAgICAgICByZXR1cm4gdGFncztcbiAgICB9LCBbXSk7XG59XG5cbmV4cG9ydCB7IGNvcmVLbm93blRhZ3MsIGdldFRhZ3MgfTtcbiIsICJpbXBvcnQgeyBNQVAsIFNDQUxBUiwgU0VRIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9jb21tb24vbWFwLmpzJztcbmltcG9ydCB7IHNlcSB9IGZyb20gJy4vY29tbW9uL3NlcS5qcyc7XG5pbXBvcnQgeyBzdHJpbmcgfSBmcm9tICcuL2NvbW1vbi9zdHJpbmcuanMnO1xuaW1wb3J0IHsgZ2V0VGFncywgY29yZUtub3duVGFncyB9IGZyb20gJy4vdGFncy5qcyc7XG5cbmNvbnN0IHNvcnRNYXBFbnRyaWVzQnlLZXkgPSAoYSwgYikgPT4gYS5rZXkgPCBiLmtleSA/IC0xIDogYS5rZXkgPiBiLmtleSA/IDEgOiAwO1xuY2xhc3MgU2NoZW1hIHtcbiAgICBjb25zdHJ1Y3Rvcih7IGNvbXBhdCwgY3VzdG9tVGFncywgbWVyZ2UsIHJlc29sdmVLbm93blRhZ3MsIHNjaGVtYSwgc29ydE1hcEVudHJpZXMsIHRvU3RyaW5nRGVmYXVsdHMgfSkge1xuICAgICAgICB0aGlzLmNvbXBhdCA9IEFycmF5LmlzQXJyYXkoY29tcGF0KVxuICAgICAgICAgICAgPyBnZXRUYWdzKGNvbXBhdCwgJ2NvbXBhdCcpXG4gICAgICAgICAgICA6IGNvbXBhdFxuICAgICAgICAgICAgICAgID8gZ2V0VGFncyhudWxsLCBjb21wYXQpXG4gICAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICB0aGlzLm5hbWUgPSAodHlwZW9mIHNjaGVtYSA9PT0gJ3N0cmluZycgJiYgc2NoZW1hKSB8fCAnY29yZSc7XG4gICAgICAgIHRoaXMua25vd25UYWdzID0gcmVzb2x2ZUtub3duVGFncyA/IGNvcmVLbm93blRhZ3MgOiB7fTtcbiAgICAgICAgdGhpcy50YWdzID0gZ2V0VGFncyhjdXN0b21UYWdzLCB0aGlzLm5hbWUsIG1lcmdlKTtcbiAgICAgICAgdGhpcy50b1N0cmluZ09wdGlvbnMgPSB0b1N0cmluZ0RlZmF1bHRzID8/IG51bGw7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBNQVAsIHsgdmFsdWU6IG1hcCB9KTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFNDQUxBUiwgeyB2YWx1ZTogc3RyaW5nIH0pO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgU0VRLCB7IHZhbHVlOiBzZXEgfSk7XG4gICAgICAgIC8vIFVzZWQgYnkgY3JlYXRlTWFwKClcbiAgICAgICAgdGhpcy5zb3J0TWFwRW50cmllcyA9XG4gICAgICAgICAgICB0eXBlb2Ygc29ydE1hcEVudHJpZXMgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgICAgICA/IHNvcnRNYXBFbnRyaWVzXG4gICAgICAgICAgICAgICAgOiBzb3J0TWFwRW50cmllcyA9PT0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICA/IHNvcnRNYXBFbnRyaWVzQnlLZXlcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsO1xuICAgIH1cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY29weSA9IE9iamVjdC5jcmVhdGUoU2NoZW1hLnByb3RvdHlwZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnModGhpcykpO1xuICAgICAgICBjb3B5LnRhZ3MgPSB0aGlzLnRhZ3Muc2xpY2UoKTtcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBTY2hlbWEgfTtcbiIsICJpbXBvcnQgeyBpc05vZGUgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVTdHJpbmdpZnlDb250ZXh0LCBzdHJpbmdpZnkgfSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5pbXBvcnQgeyBpbmRlbnRDb21tZW50LCBsaW5lQ29tbWVudCB9IGZyb20gJy4vc3RyaW5naWZ5Q29tbWVudC5qcyc7XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeURvY3VtZW50KGRvYywgb3B0aW9ucykge1xuICAgIGNvbnN0IGxpbmVzID0gW107XG4gICAgbGV0IGhhc0RpcmVjdGl2ZXMgPSBvcHRpb25zLmRpcmVjdGl2ZXMgPT09IHRydWU7XG4gICAgaWYgKG9wdGlvbnMuZGlyZWN0aXZlcyAhPT0gZmFsc2UgJiYgZG9jLmRpcmVjdGl2ZXMpIHtcbiAgICAgICAgY29uc3QgZGlyID0gZG9jLmRpcmVjdGl2ZXMudG9TdHJpbmcoZG9jKTtcbiAgICAgICAgaWYgKGRpcikge1xuICAgICAgICAgICAgbGluZXMucHVzaChkaXIpO1xuICAgICAgICAgICAgaGFzRGlyZWN0aXZlcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZG9jLmRpcmVjdGl2ZXMuZG9jU3RhcnQpXG4gICAgICAgICAgICBoYXNEaXJlY3RpdmVzID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGhhc0RpcmVjdGl2ZXMpXG4gICAgICAgIGxpbmVzLnB1c2goJy0tLScpO1xuICAgIGNvbnN0IGN0eCA9IGNyZWF0ZVN0cmluZ2lmeUNvbnRleHQoZG9jLCBvcHRpb25zKTtcbiAgICBjb25zdCB7IGNvbW1lbnRTdHJpbmcgfSA9IGN0eC5vcHRpb25zO1xuICAgIGlmIChkb2MuY29tbWVudEJlZm9yZSkge1xuICAgICAgICBpZiAobGluZXMubGVuZ3RoICE9PSAxKVxuICAgICAgICAgICAgbGluZXMudW5zaGlmdCgnJyk7XG4gICAgICAgIGNvbnN0IGNzID0gY29tbWVudFN0cmluZyhkb2MuY29tbWVudEJlZm9yZSk7XG4gICAgICAgIGxpbmVzLnVuc2hpZnQoaW5kZW50Q29tbWVudChjcywgJycpKTtcbiAgICB9XG4gICAgbGV0IGNob21wS2VlcCA9IGZhbHNlO1xuICAgIGxldCBjb250ZW50Q29tbWVudCA9IG51bGw7XG4gICAgaWYgKGRvYy5jb250ZW50cykge1xuICAgICAgICBpZiAoaXNOb2RlKGRvYy5jb250ZW50cykpIHtcbiAgICAgICAgICAgIGlmIChkb2MuY29udGVudHMuc3BhY2VCZWZvcmUgJiYgaGFzRGlyZWN0aXZlcylcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKCcnKTtcbiAgICAgICAgICAgIGlmIChkb2MuY29udGVudHMuY29tbWVudEJlZm9yZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNzID0gY29tbWVudFN0cmluZyhkb2MuY29udGVudHMuY29tbWVudEJlZm9yZSk7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaChpbmRlbnRDb21tZW50KGNzLCAnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdG9wLWxldmVsIGJsb2NrIHNjYWxhcnMgbmVlZCB0byBiZSBpbmRlbnRlZCBpZiBmb2xsb3dlZCBieSBhIGNvbW1lbnRcbiAgICAgICAgICAgIGN0eC5mb3JjZUJsb2NrSW5kZW50ID0gISFkb2MuY29tbWVudDtcbiAgICAgICAgICAgIGNvbnRlbnRDb21tZW50ID0gZG9jLmNvbnRlbnRzLmNvbW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb25DaG9tcEtlZXAgPSBjb250ZW50Q29tbWVudCA/IHVuZGVmaW5lZCA6ICgpID0+IChjaG9tcEtlZXAgPSB0cnVlKTtcbiAgICAgICAgbGV0IGJvZHkgPSBzdHJpbmdpZnkoZG9jLmNvbnRlbnRzLCBjdHgsICgpID0+IChjb250ZW50Q29tbWVudCA9IG51bGwpLCBvbkNob21wS2VlcCk7XG4gICAgICAgIGlmIChjb250ZW50Q29tbWVudClcbiAgICAgICAgICAgIGJvZHkgKz0gbGluZUNvbW1lbnQoYm9keSwgJycsIGNvbW1lbnRTdHJpbmcoY29udGVudENvbW1lbnQpKTtcbiAgICAgICAgaWYgKChib2R5WzBdID09PSAnfCcgfHwgYm9keVswXSA9PT0gJz4nKSAmJlxuICAgICAgICAgICAgbGluZXNbbGluZXMubGVuZ3RoIC0gMV0gPT09ICctLS0nKSB7XG4gICAgICAgICAgICAvLyBUb3AtbGV2ZWwgYmxvY2sgc2NhbGFycyB3aXRoIGEgcHJlY2VkaW5nIGRvYyBtYXJrZXIgb3VnaHQgdG8gdXNlIHRoZVxuICAgICAgICAgICAgLy8gc2FtZSBsaW5lIGZvciB0aGVpciBoZWFkZXIuXG4gICAgICAgICAgICBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXSA9IGAtLS0gJHtib2R5fWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGluZXMucHVzaChib2R5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxpbmVzLnB1c2goc3RyaW5naWZ5KGRvYy5jb250ZW50cywgY3R4KSk7XG4gICAgfVxuICAgIGlmIChkb2MuZGlyZWN0aXZlcz8uZG9jRW5kKSB7XG4gICAgICAgIGlmIChkb2MuY29tbWVudCkge1xuICAgICAgICAgICAgY29uc3QgY3MgPSBjb21tZW50U3RyaW5nKGRvYy5jb21tZW50KTtcbiAgICAgICAgICAgIGlmIChjcy5pbmNsdWRlcygnXFxuJykpIHtcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKCcuLi4nKTtcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGluZGVudENvbW1lbnQoY3MsICcnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGAuLi4gJHtjc31gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goJy4uLicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsZXQgZGMgPSBkb2MuY29tbWVudDtcbiAgICAgICAgaWYgKGRjICYmIGNob21wS2VlcClcbiAgICAgICAgICAgIGRjID0gZGMucmVwbGFjZSgvXlxcbisvLCAnJyk7XG4gICAgICAgIGlmIChkYykge1xuICAgICAgICAgICAgaWYgKCghY2hvbXBLZWVwIHx8IGNvbnRlbnRDb21tZW50KSAmJiBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXSAhPT0gJycpXG4gICAgICAgICAgICAgICAgbGluZXMucHVzaCgnJyk7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKGluZGVudENvbW1lbnQoY29tbWVudFN0cmluZyhkYyksICcnKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpICsgJ1xcbic7XG59XG5cbmV4cG9ydCB7IHN0cmluZ2lmeURvY3VtZW50IH07XG4iLCAiaW1wb3J0IHsgQWxpYXMgfSBmcm9tICcuLi9ub2Rlcy9BbGlhcy5qcyc7XG5pbXBvcnQgeyBpc0VtcHR5UGF0aCwgY29sbGVjdGlvbkZyb21QYXRoIH0gZnJvbSAnLi4vbm9kZXMvQ29sbGVjdGlvbi5qcyc7XG5pbXBvcnQgeyBOT0RFX1RZUEUsIERPQywgaXNOb2RlLCBpc0NvbGxlY3Rpb24sIGlzU2NhbGFyIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgUGFpciB9IGZyb20gJy4uL25vZGVzL1BhaXIuanMnO1xuaW1wb3J0IHsgdG9KUyB9IGZyb20gJy4uL25vZGVzL3RvSlMuanMnO1xuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi4vc2NoZW1hL1NjaGVtYS5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnlEb2N1bWVudCB9IGZyb20gJy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlEb2N1bWVudC5qcyc7XG5pbXBvcnQgeyBhbmNob3JOYW1lcywgZmluZE5ld0FuY2hvciwgY3JlYXRlTm9kZUFuY2hvcnMgfSBmcm9tICcuL2FuY2hvcnMuanMnO1xuaW1wb3J0IHsgYXBwbHlSZXZpdmVyIH0gZnJvbSAnLi9hcHBseVJldml2ZXIuanMnO1xuaW1wb3J0IHsgY3JlYXRlTm9kZSB9IGZyb20gJy4vY3JlYXRlTm9kZS5qcyc7XG5pbXBvcnQgeyBEaXJlY3RpdmVzIH0gZnJvbSAnLi9kaXJlY3RpdmVzLmpzJztcblxuY2xhc3MgRG9jdW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKHZhbHVlLCByZXBsYWNlciwgb3B0aW9ucykge1xuICAgICAgICAvKiogQSBjb21tZW50IGJlZm9yZSB0aGlzIERvY3VtZW50ICovXG4gICAgICAgIHRoaXMuY29tbWVudEJlZm9yZSA9IG51bGw7XG4gICAgICAgIC8qKiBBIGNvbW1lbnQgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhpcyBEb2N1bWVudCAqL1xuICAgICAgICB0aGlzLmNvbW1lbnQgPSBudWxsO1xuICAgICAgICAvKiogRXJyb3JzIGVuY291bnRlcmVkIGR1cmluZyBwYXJzaW5nLiAqL1xuICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgICAgICAvKiogV2FybmluZ3MgZW5jb3VudGVyZWQgZHVyaW5nIHBhcnNpbmcuICovXG4gICAgICAgIHRoaXMud2FybmluZ3MgPSBbXTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIE5PREVfVFlQRSwgeyB2YWx1ZTogRE9DIH0pO1xuICAgICAgICBsZXQgX3JlcGxhY2VyID0gbnVsbDtcbiAgICAgICAgaWYgKHR5cGVvZiByZXBsYWNlciA9PT0gJ2Z1bmN0aW9uJyB8fCBBcnJheS5pc0FycmF5KHJlcGxhY2VyKSkge1xuICAgICAgICAgICAgX3JlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkICYmIHJlcGxhY2VyKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gcmVwbGFjZXI7XG4gICAgICAgICAgICByZXBsYWNlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIGludEFzQmlnSW50OiBmYWxzZSxcbiAgICAgICAgICAgIGtlZXBTb3VyY2VUb2tlbnM6IGZhbHNlLFxuICAgICAgICAgICAgbG9nTGV2ZWw6ICd3YXJuJyxcbiAgICAgICAgICAgIHByZXR0eUVycm9yczogdHJ1ZSxcbiAgICAgICAgICAgIHN0cmljdDogdHJ1ZSxcbiAgICAgICAgICAgIHN0cmluZ0tleXM6IGZhbHNlLFxuICAgICAgICAgICAgdW5pcXVlS2V5czogdHJ1ZSxcbiAgICAgICAgICAgIHZlcnNpb246ICcxLjInXG4gICAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHQ7XG4gICAgICAgIGxldCB7IHZlcnNpb24gfSA9IG9wdDtcbiAgICAgICAgaWYgKG9wdGlvbnM/Ll9kaXJlY3RpdmVzKSB7XG4gICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMgPSBvcHRpb25zLl9kaXJlY3RpdmVzLmF0RG9jdW1lbnQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGl2ZXMueWFtbC5leHBsaWNpdClcbiAgICAgICAgICAgICAgICB2ZXJzaW9uID0gdGhpcy5kaXJlY3RpdmVzLnlhbWwudmVyc2lvbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMgPSBuZXcgRGlyZWN0aXZlcyh7IHZlcnNpb24gfSk7XG4gICAgICAgIHRoaXMuc2V0U2NoZW1hKHZlcnNpb24sIG9wdGlvbnMpO1xuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFdlIGNhbid0IHJlYWxseSBrbm93IHRoYXQgdGhpcyBtYXRjaGVzIENvbnRlbnRzLlxuICAgICAgICB0aGlzLmNvbnRlbnRzID1cbiAgICAgICAgICAgIHZhbHVlID09PSB1bmRlZmluZWQgPyBudWxsIDogdGhpcy5jcmVhdGVOb2RlKHZhbHVlLCBfcmVwbGFjZXIsIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBkZWVwIGNvcHkgb2YgdGhpcyBEb2N1bWVudCBhbmQgaXRzIGNvbnRlbnRzLlxuICAgICAqXG4gICAgICogQ3VzdG9tIE5vZGUgdmFsdWVzIHRoYXQgaW5oZXJpdCBmcm9tIGBPYmplY3RgIHN0aWxsIHJlZmVyIHRvIHRoZWlyIG9yaWdpbmFsIGluc3RhbmNlcy5cbiAgICAgKi9cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY29weSA9IE9iamVjdC5jcmVhdGUoRG9jdW1lbnQucHJvdG90eXBlLCB7XG4gICAgICAgICAgICBbTk9ERV9UWVBFXTogeyB2YWx1ZTogRE9DIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvcHkuY29tbWVudEJlZm9yZSA9IHRoaXMuY29tbWVudEJlZm9yZTtcbiAgICAgICAgY29weS5jb21tZW50ID0gdGhpcy5jb21tZW50O1xuICAgICAgICBjb3B5LmVycm9ycyA9IHRoaXMuZXJyb3JzLnNsaWNlKCk7XG4gICAgICAgIGNvcHkud2FybmluZ3MgPSB0aGlzLndhcm5pbmdzLnNsaWNlKCk7XG4gICAgICAgIGNvcHkub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGl2ZXMpXG4gICAgICAgICAgICBjb3B5LmRpcmVjdGl2ZXMgPSB0aGlzLmRpcmVjdGl2ZXMuY2xvbmUoKTtcbiAgICAgICAgY29weS5zY2hlbWEgPSB0aGlzLnNjaGVtYS5jbG9uZSgpO1xuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFdlIGNhbid0IHJlYWxseSBrbm93IHRoYXQgdGhpcyBtYXRjaGVzIENvbnRlbnRzLlxuICAgICAgICBjb3B5LmNvbnRlbnRzID0gaXNOb2RlKHRoaXMuY29udGVudHMpXG4gICAgICAgICAgICA/IHRoaXMuY29udGVudHMuY2xvbmUoY29weS5zY2hlbWEpXG4gICAgICAgICAgICA6IHRoaXMuY29udGVudHM7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlKVxuICAgICAgICAgICAgY29weS5yYW5nZSA9IHRoaXMucmFuZ2Uuc2xpY2UoKTtcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxuICAgIC8qKiBBZGRzIGEgdmFsdWUgdG8gdGhlIGRvY3VtZW50LiAqL1xuICAgIGFkZCh2YWx1ZSkge1xuICAgICAgICBpZiAoYXNzZXJ0Q29sbGVjdGlvbih0aGlzLmNvbnRlbnRzKSlcbiAgICAgICAgICAgIHRoaXMuY29udGVudHMuYWRkKHZhbHVlKTtcbiAgICB9XG4gICAgLyoqIEFkZHMgYSB2YWx1ZSB0byB0aGUgZG9jdW1lbnQuICovXG4gICAgYWRkSW4ocGF0aCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGFzc2VydENvbGxlY3Rpb24odGhpcy5jb250ZW50cykpXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzLmFkZEluKHBhdGgsIHZhbHVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBbGlhc2Agbm9kZSwgZW5zdXJpbmcgdGhhdCB0aGUgdGFyZ2V0IGBub2RlYCBoYXMgdGhlIHJlcXVpcmVkIGFuY2hvci5cbiAgICAgKlxuICAgICAqIElmIGBub2RlYCBhbHJlYWR5IGhhcyBhbiBhbmNob3IsIGBuYW1lYCBpcyBpZ25vcmVkLlxuICAgICAqIE90aGVyd2lzZSwgdGhlIGBub2RlLmFuY2hvcmAgdmFsdWUgd2lsbCBiZSBzZXQgdG8gYG5hbWVgLFxuICAgICAqIG9yIGlmIGFuIGFuY2hvciB3aXRoIHRoYXQgbmFtZSBpcyBhbHJlYWR5IHByZXNlbnQgaW4gdGhlIGRvY3VtZW50LFxuICAgICAqIGBuYW1lYCB3aWxsIGJlIHVzZWQgYXMgYSBwcmVmaXggZm9yIGEgbmV3IHVuaXF1ZSBhbmNob3IuXG4gICAgICogSWYgYG5hbWVgIGlzIHVuZGVmaW5lZCwgdGhlIGdlbmVyYXRlZCBhbmNob3Igd2lsbCB1c2UgJ2EnIGFzIGEgcHJlZml4LlxuICAgICAqL1xuICAgIGNyZWF0ZUFsaWFzKG5vZGUsIG5hbWUpIHtcbiAgICAgICAgaWYgKCFub2RlLmFuY2hvcikge1xuICAgICAgICAgICAgY29uc3QgcHJldiA9IGFuY2hvck5hbWVzKHRoaXMpO1xuICAgICAgICAgICAgbm9kZS5hbmNob3IgPVxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLW51bGxpc2gtY29hbGVzY2luZ1xuICAgICAgICAgICAgICAgICFuYW1lIHx8IHByZXYuaGFzKG5hbWUpID8gZmluZE5ld0FuY2hvcihuYW1lIHx8ICdhJywgcHJldikgOiBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQWxpYXMobm9kZS5hbmNob3IpO1xuICAgIH1cbiAgICBjcmVhdGVOb2RlKHZhbHVlLCByZXBsYWNlciwgb3B0aW9ucykge1xuICAgICAgICBsZXQgX3JlcGxhY2VyID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodHlwZW9mIHJlcGxhY2VyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHJlcGxhY2VyLmNhbGwoeyAnJzogdmFsdWUgfSwgJycsIHZhbHVlKTtcbiAgICAgICAgICAgIF9yZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmVwbGFjZXIpKSB7XG4gICAgICAgICAgICBjb25zdCBrZXlUb1N0ciA9ICh2KSA9PiB0eXBlb2YgdiA9PT0gJ251bWJlcicgfHwgdiBpbnN0YW5jZW9mIFN0cmluZyB8fCB2IGluc3RhbmNlb2YgTnVtYmVyO1xuICAgICAgICAgICAgY29uc3QgYXNTdHIgPSByZXBsYWNlci5maWx0ZXIoa2V5VG9TdHIpLm1hcChTdHJpbmcpO1xuICAgICAgICAgICAgaWYgKGFzU3RyLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgcmVwbGFjZXIgPSByZXBsYWNlci5jb25jYXQoYXNTdHIpO1xuICAgICAgICAgICAgX3JlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkICYmIHJlcGxhY2VyKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gcmVwbGFjZXI7XG4gICAgICAgICAgICByZXBsYWNlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGFsaWFzRHVwbGljYXRlT2JqZWN0cywgYW5jaG9yUHJlZml4LCBmbG93LCBrZWVwVW5kZWZpbmVkLCBvblRhZ09iaiwgdGFnIH0gPSBvcHRpb25zID8/IHt9O1xuICAgICAgICBjb25zdCB7IG9uQW5jaG9yLCBzZXRBbmNob3JzLCBzb3VyY2VPYmplY3RzIH0gPSBjcmVhdGVOb2RlQW5jaG9ycyh0aGlzLCBcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9wcmVmZXItbnVsbGlzaC1jb2FsZXNjaW5nXG4gICAgICAgIGFuY2hvclByZWZpeCB8fCAnYScpO1xuICAgICAgICBjb25zdCBjdHggPSB7XG4gICAgICAgICAgICBhbGlhc0R1cGxpY2F0ZU9iamVjdHM6IGFsaWFzRHVwbGljYXRlT2JqZWN0cyA/PyB0cnVlLFxuICAgICAgICAgICAga2VlcFVuZGVmaW5lZDoga2VlcFVuZGVmaW5lZCA/PyBmYWxzZSxcbiAgICAgICAgICAgIG9uQW5jaG9yLFxuICAgICAgICAgICAgb25UYWdPYmosXG4gICAgICAgICAgICByZXBsYWNlcjogX3JlcGxhY2VyLFxuICAgICAgICAgICAgc2NoZW1hOiB0aGlzLnNjaGVtYSxcbiAgICAgICAgICAgIHNvdXJjZU9iamVjdHNcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGNyZWF0ZU5vZGUodmFsdWUsIHRhZywgY3R4KTtcbiAgICAgICAgaWYgKGZsb3cgJiYgaXNDb2xsZWN0aW9uKG5vZGUpKVxuICAgICAgICAgICAgbm9kZS5mbG93ID0gdHJ1ZTtcbiAgICAgICAgc2V0QW5jaG9ycygpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29udmVydCBhIGtleSBhbmQgYSB2YWx1ZSBpbnRvIGEgYFBhaXJgIHVzaW5nIHRoZSBjdXJyZW50IHNjaGVtYSxcbiAgICAgKiByZWN1cnNpdmVseSB3cmFwcGluZyBhbGwgdmFsdWVzIGFzIGBTY2FsYXJgIG9yIGBDb2xsZWN0aW9uYCBub2Rlcy5cbiAgICAgKi9cbiAgICBjcmVhdGVQYWlyKGtleSwgdmFsdWUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBjb25zdCBrID0gdGhpcy5jcmVhdGVOb2RlKGtleSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IHYgPSB0aGlzLmNyZWF0ZU5vZGUodmFsdWUsIG51bGwsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gbmV3IFBhaXIoaywgdik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSB2YWx1ZSBmcm9tIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGl0ZW0gd2FzIGZvdW5kIGFuZCByZW1vdmVkLlxuICAgICAqL1xuICAgIGRlbGV0ZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIGFzc2VydENvbGxlY3Rpb24odGhpcy5jb250ZW50cykgPyB0aGlzLmNvbnRlbnRzLmRlbGV0ZShrZXkpIDogZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSB2YWx1ZSBmcm9tIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGl0ZW0gd2FzIGZvdW5kIGFuZCByZW1vdmVkLlxuICAgICAqL1xuICAgIGRlbGV0ZUluKHBhdGgpIHtcbiAgICAgICAgaWYgKGlzRW1wdHlQYXRoKHBhdGgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb250ZW50cyA9PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgUHJlc3VtZWQgaW1wb3NzaWJsZSBpZiBTdHJpY3QgZXh0ZW5kcyBmYWxzZVxuICAgICAgICAgICAgdGhpcy5jb250ZW50cyA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXNzZXJ0Q29sbGVjdGlvbih0aGlzLmNvbnRlbnRzKVxuICAgICAgICAgICAgPyB0aGlzLmNvbnRlbnRzLmRlbGV0ZUluKHBhdGgpXG4gICAgICAgICAgICA6IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGl0ZW0gYXQgYGtleWAsIG9yIGB1bmRlZmluZWRgIGlmIG5vdCBmb3VuZC4gQnkgZGVmYXVsdCB1bndyYXBzXG4gICAgICogc2NhbGFyIHZhbHVlcyBmcm9tIHRoZWlyIHN1cnJvdW5kaW5nIG5vZGU7IHRvIGRpc2FibGUgc2V0IGBrZWVwU2NhbGFyYCB0b1xuICAgICAqIGB0cnVlYCAoY29sbGVjdGlvbnMgYXJlIGFsd2F5cyByZXR1cm5lZCBpbnRhY3QpLlxuICAgICAqL1xuICAgIGdldChrZXksIGtlZXBTY2FsYXIpIHtcbiAgICAgICAgcmV0dXJuIGlzQ29sbGVjdGlvbih0aGlzLmNvbnRlbnRzKVxuICAgICAgICAgICAgPyB0aGlzLmNvbnRlbnRzLmdldChrZXksIGtlZXBTY2FsYXIpXG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpdGVtIGF0IGBwYXRoYCwgb3IgYHVuZGVmaW5lZGAgaWYgbm90IGZvdW5kLiBCeSBkZWZhdWx0IHVud3JhcHNcbiAgICAgKiBzY2FsYXIgdmFsdWVzIGZyb20gdGhlaXIgc3Vycm91bmRpbmcgbm9kZTsgdG8gZGlzYWJsZSBzZXQgYGtlZXBTY2FsYXJgIHRvXG4gICAgICogYHRydWVgIChjb2xsZWN0aW9ucyBhcmUgYWx3YXlzIHJldHVybmVkIGludGFjdCkuXG4gICAgICovXG4gICAgZ2V0SW4ocGF0aCwga2VlcFNjYWxhcikge1xuICAgICAgICBpZiAoaXNFbXB0eVBhdGgocGF0aCkpXG4gICAgICAgICAgICByZXR1cm4gIWtlZXBTY2FsYXIgJiYgaXNTY2FsYXIodGhpcy5jb250ZW50cylcbiAgICAgICAgICAgICAgICA/IHRoaXMuY29udGVudHMudmFsdWVcbiAgICAgICAgICAgICAgICA6IHRoaXMuY29udGVudHM7XG4gICAgICAgIHJldHVybiBpc0NvbGxlY3Rpb24odGhpcy5jb250ZW50cylcbiAgICAgICAgICAgID8gdGhpcy5jb250ZW50cy5nZXRJbihwYXRoLCBrZWVwU2NhbGFyKVxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZG9jdW1lbnQgaW5jbHVkZXMgYSB2YWx1ZSB3aXRoIHRoZSBrZXkgYGtleWAuXG4gICAgICovXG4gICAgaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gaXNDb2xsZWN0aW9uKHRoaXMuY29udGVudHMpID8gdGhpcy5jb250ZW50cy5oYXMoa2V5KSA6IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGRvY3VtZW50IGluY2x1ZGVzIGEgdmFsdWUgYXQgYHBhdGhgLlxuICAgICAqL1xuICAgIGhhc0luKHBhdGgpIHtcbiAgICAgICAgaWYgKGlzRW1wdHlQYXRoKHBhdGgpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudHMgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIGlzQ29sbGVjdGlvbih0aGlzLmNvbnRlbnRzKSA/IHRoaXMuY29udGVudHMuaGFzSW4ocGF0aCkgOiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIHZhbHVlIGluIHRoaXMgZG9jdW1lbnQuIEZvciBgISFzZXRgLCBgdmFsdWVgIG5lZWRzIHRvIGJlIGFcbiAgICAgKiBib29sZWFuIHRvIGFkZC9yZW1vdmUgdGhlIGl0ZW0gZnJvbSB0aGUgc2V0LlxuICAgICAqL1xuICAgIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRzID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgV2UgY2FuJ3QgcmVhbGx5IGtub3cgdGhhdCB0aGlzIG1hdGNoZXMgQ29udGVudHMuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzID0gY29sbGVjdGlvbkZyb21QYXRoKHRoaXMuc2NoZW1hLCBba2V5XSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFzc2VydENvbGxlY3Rpb24odGhpcy5jb250ZW50cykpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGVudHMuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSB2YWx1ZSBpbiB0aGlzIGRvY3VtZW50LiBGb3IgYCEhc2V0YCwgYHZhbHVlYCBuZWVkcyB0byBiZSBhXG4gICAgICogYm9vbGVhbiB0byBhZGQvcmVtb3ZlIHRoZSBpdGVtIGZyb20gdGhlIHNldC5cbiAgICAgKi9cbiAgICBzZXRJbihwYXRoLCB2YWx1ZSkge1xuICAgICAgICBpZiAoaXNFbXB0eVBhdGgocGF0aCkpIHtcbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgV2UgY2FuJ3QgcmVhbGx5IGtub3cgdGhhdCB0aGlzIG1hdGNoZXMgQ29udGVudHMuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5jb250ZW50cyA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFdlIGNhbid0IHJlYWxseSBrbm93IHRoYXQgdGhpcyBtYXRjaGVzIENvbnRlbnRzLlxuICAgICAgICAgICAgdGhpcy5jb250ZW50cyA9IGNvbGxlY3Rpb25Gcm9tUGF0aCh0aGlzLnNjaGVtYSwgQXJyYXkuZnJvbShwYXRoKSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFzc2VydENvbGxlY3Rpb24odGhpcy5jb250ZW50cykpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGVudHMuc2V0SW4ocGF0aCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgWUFNTCB2ZXJzaW9uIGFuZCBzY2hlbWEgdXNlZCBieSB0aGUgZG9jdW1lbnQuXG4gICAgICogQSBgbnVsbGAgdmVyc2lvbiBkaXNhYmxlcyBzdXBwb3J0IGZvciBkaXJlY3RpdmVzLCBleHBsaWNpdCB0YWdzLCBhbmNob3JzLCBhbmQgYWxpYXNlcy5cbiAgICAgKiBJdCBhbHNvIHJlcXVpcmVzIHRoZSBgc2NoZW1hYCBvcHRpb24gdG8gYmUgZ2l2ZW4gYXMgYSBgU2NoZW1hYCBpbnN0YW5jZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIE92ZXJyaWRlcyBhbGwgcHJldmlvdXNseSBzZXQgc2NoZW1hIG9wdGlvbnMuXG4gICAgICovXG4gICAgc2V0U2NoZW1hKHZlcnNpb24sIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBpZiAodHlwZW9mIHZlcnNpb24gPT09ICdudW1iZXInKVxuICAgICAgICAgICAgdmVyc2lvbiA9IFN0cmluZyh2ZXJzaW9uKTtcbiAgICAgICAgbGV0IG9wdDtcbiAgICAgICAgc3dpdGNoICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICBjYXNlICcxLjEnOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGl2ZXMpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aXZlcy55YW1sLnZlcnNpb24gPSAnMS4xJztcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aXZlcyA9IG5ldyBEaXJlY3RpdmVzKHsgdmVyc2lvbjogJzEuMScgfSk7XG4gICAgICAgICAgICAgICAgb3B0ID0geyByZXNvbHZlS25vd25UYWdzOiBmYWxzZSwgc2NoZW1hOiAneWFtbC0xLjEnIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICcxLjInOlxuICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aXZlcylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3RpdmVzLnlhbWwudmVyc2lvbiA9IHZlcnNpb247XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMgPSBuZXcgRGlyZWN0aXZlcyh7IHZlcnNpb24gfSk7XG4gICAgICAgICAgICAgICAgb3B0ID0geyByZXNvbHZlS25vd25UYWdzOiB0cnVlLCBzY2hlbWE6ICdjb3JlJyB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBudWxsOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGl2ZXMpXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmRpcmVjdGl2ZXM7XG4gICAgICAgICAgICAgICAgb3B0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdiA9IEpTT04uc3RyaW5naWZ5KHZlcnNpb24pO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgJzEuMScsICcxLjInIG9yIG51bGwgYXMgZmlyc3QgYXJndW1lbnQsIGJ1dCBmb3VuZDogJHtzdn1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBOb3QgdXNpbmcgYGluc3RhbmNlb2YgU2NoZW1hYCB0byBhbGxvdyBmb3IgZHVjayB0eXBpbmdcbiAgICAgICAgaWYgKG9wdGlvbnMuc2NoZW1hIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgICAgICAgdGhpcy5zY2hlbWEgPSBvcHRpb25zLnNjaGVtYTtcbiAgICAgICAgZWxzZSBpZiAob3B0KVxuICAgICAgICAgICAgdGhpcy5zY2hlbWEgPSBuZXcgU2NoZW1hKE9iamVjdC5hc3NpZ24ob3B0LCBvcHRpb25zKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2l0aCBhIG51bGwgWUFNTCB2ZXJzaW9uLCB0aGUgeyBzY2hlbWE6IFNjaGVtYSB9IG9wdGlvbiBpcyByZXF1aXJlZGApO1xuICAgIH1cbiAgICAvLyBqc29uICYganNvbkFyZyBhcmUgb25seSB1c2VkIGZyb20gdG9KU09OKClcbiAgICB0b0pTKHsganNvbiwganNvbkFyZywgbWFwQXNNYXAsIG1heEFsaWFzQ291bnQsIG9uQW5jaG9yLCByZXZpdmVyIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBjdHggPSB7XG4gICAgICAgICAgICBhbmNob3JzOiBuZXcgTWFwKCksXG4gICAgICAgICAgICBkb2M6IHRoaXMsXG4gICAgICAgICAgICBrZWVwOiAhanNvbixcbiAgICAgICAgICAgIG1hcEFzTWFwOiBtYXBBc01hcCA9PT0gdHJ1ZSxcbiAgICAgICAgICAgIG1hcEtleVdhcm5lZDogZmFsc2UsXG4gICAgICAgICAgICBtYXhBbGlhc0NvdW50OiB0eXBlb2YgbWF4QWxpYXNDb3VudCA9PT0gJ251bWJlcicgPyBtYXhBbGlhc0NvdW50IDogMTAwXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlcyA9IHRvSlModGhpcy5jb250ZW50cywganNvbkFyZyA/PyAnJywgY3R4KTtcbiAgICAgICAgaWYgKHR5cGVvZiBvbkFuY2hvciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIGZvciAoY29uc3QgeyBjb3VudCwgcmVzIH0gb2YgY3R4LmFuY2hvcnMudmFsdWVzKCkpXG4gICAgICAgICAgICAgICAgb25BbmNob3IocmVzLCBjb3VudCk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgPyBhcHBseVJldml2ZXIocmV2aXZlciwgeyAnJzogcmVzIH0sICcnLCByZXMpXG4gICAgICAgICAgICA6IHJlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkb2N1bWVudCBgY29udGVudHNgLlxuICAgICAqXG4gICAgICogQHBhcmFtIGpzb25BcmcgVXNlZCBieSBgSlNPTi5zdHJpbmdpZnlgIHRvIGluZGljYXRlIHRoZSBhcnJheSBpbmRleCBvclxuICAgICAqICAgcHJvcGVydHkgbmFtZS5cbiAgICAgKi9cbiAgICB0b0pTT04oanNvbkFyZywgb25BbmNob3IpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9KUyh7IGpzb246IHRydWUsIGpzb25BcmcsIG1hcEFzTWFwOiBmYWxzZSwgb25BbmNob3IgfSk7XG4gICAgfVxuICAgIC8qKiBBIFlBTUwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGRvY3VtZW50LiAqL1xuICAgIHRvU3RyaW5nKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRG9jdW1lbnQgd2l0aCBlcnJvcnMgY2Fubm90IGJlIHN0cmluZ2lmaWVkJyk7XG4gICAgICAgIGlmICgnaW5kZW50JyBpbiBvcHRpb25zICYmXG4gICAgICAgICAgICAoIU51bWJlci5pc0ludGVnZXIob3B0aW9ucy5pbmRlbnQpIHx8IE51bWJlcihvcHRpb25zLmluZGVudCkgPD0gMCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmluZGVudCk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFwiaW5kZW50XCIgb3B0aW9uIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLCBub3QgJHtzfWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHJpbmdpZnlEb2N1bWVudCh0aGlzLCBvcHRpb25zKTtcbiAgICB9XG59XG5mdW5jdGlvbiBhc3NlcnRDb2xsZWN0aW9uKGNvbnRlbnRzKSB7XG4gICAgaWYgKGlzQ29sbGVjdGlvbihjb250ZW50cykpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYSBZQU1MIGNvbGxlY3Rpb24gYXMgZG9jdW1lbnQgY29udGVudHMnKTtcbn1cblxuZXhwb3J0IHsgRG9jdW1lbnQgfTtcbiIsICJjbGFzcyBZQU1MRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgcG9zLCBjb2RlLCBtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgIH1cbn1cbmNsYXNzIFlBTUxQYXJzZUVycm9yIGV4dGVuZHMgWUFNTEVycm9yIHtcbiAgICBjb25zdHJ1Y3Rvcihwb3MsIGNvZGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIoJ1lBTUxQYXJzZUVycm9yJywgcG9zLCBjb2RlLCBtZXNzYWdlKTtcbiAgICB9XG59XG5jbGFzcyBZQU1MV2FybmluZyBleHRlbmRzIFlBTUxFcnJvciB7XG4gICAgY29uc3RydWN0b3IocG9zLCBjb2RlLCBtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKCdZQU1MV2FybmluZycsIHBvcywgY29kZSwgbWVzc2FnZSk7XG4gICAgfVxufVxuY29uc3QgcHJldHRpZnlFcnJvciA9IChzcmMsIGxjKSA9PiAoZXJyb3IpID0+IHtcbiAgICBpZiAoZXJyb3IucG9zWzBdID09PSAtMSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGVycm9yLmxpbmVQb3MgPSBlcnJvci5wb3MubWFwKHBvcyA9PiBsYy5saW5lUG9zKHBvcykpO1xuICAgIGNvbnN0IHsgbGluZSwgY29sIH0gPSBlcnJvci5saW5lUG9zWzBdO1xuICAgIGVycm9yLm1lc3NhZ2UgKz0gYCBhdCBsaW5lICR7bGluZX0sIGNvbHVtbiAke2NvbH1gO1xuICAgIGxldCBjaSA9IGNvbCAtIDE7XG4gICAgbGV0IGxpbmVTdHIgPSBzcmNcbiAgICAgICAgLnN1YnN0cmluZyhsYy5saW5lU3RhcnRzW2xpbmUgLSAxXSwgbGMubGluZVN0YXJ0c1tsaW5lXSlcbiAgICAgICAgLnJlcGxhY2UoL1tcXG5cXHJdKyQvLCAnJyk7XG4gICAgLy8gVHJpbSB0byBtYXggODAgY2hhcnMsIGtlZXBpbmcgY29sIHBvc2l0aW9uIG5lYXIgdGhlIG1pZGRsZVxuICAgIGlmIChjaSA+PSA2MCAmJiBsaW5lU3RyLmxlbmd0aCA+IDgwKSB7XG4gICAgICAgIGNvbnN0IHRyaW1TdGFydCA9IE1hdGgubWluKGNpIC0gMzksIGxpbmVTdHIubGVuZ3RoIC0gNzkpO1xuICAgICAgICBsaW5lU3RyID0gJ1x1MjAyNicgKyBsaW5lU3RyLnN1YnN0cmluZyh0cmltU3RhcnQpO1xuICAgICAgICBjaSAtPSB0cmltU3RhcnQgLSAxO1xuICAgIH1cbiAgICBpZiAobGluZVN0ci5sZW5ndGggPiA4MClcbiAgICAgICAgbGluZVN0ciA9IGxpbmVTdHIuc3Vic3RyaW5nKDAsIDc5KSArICdcdTIwMjYnO1xuICAgIC8vIEluY2x1ZGUgcHJldmlvdXMgbGluZSBpbiBjb250ZXh0IGlmIHBvaW50aW5nIGF0IGxpbmUgc3RhcnRcbiAgICBpZiAobGluZSA+IDEgJiYgL14gKiQvLnRlc3QobGluZVN0ci5zdWJzdHJpbmcoMCwgY2kpKSkge1xuICAgICAgICAvLyBSZWdleHAgd29uJ3QgbWF0Y2ggaWYgc3RhcnQgaXMgdHJpbW1lZFxuICAgICAgICBsZXQgcHJldiA9IHNyYy5zdWJzdHJpbmcobGMubGluZVN0YXJ0c1tsaW5lIC0gMl0sIGxjLmxpbmVTdGFydHNbbGluZSAtIDFdKTtcbiAgICAgICAgaWYgKHByZXYubGVuZ3RoID4gODApXG4gICAgICAgICAgICBwcmV2ID0gcHJldi5zdWJzdHJpbmcoMCwgNzkpICsgJ1x1MjAyNlxcbic7XG4gICAgICAgIGxpbmVTdHIgPSBwcmV2ICsgbGluZVN0cjtcbiAgICB9XG4gICAgaWYgKC9bXiBdLy50ZXN0KGxpbmVTdHIpKSB7XG4gICAgICAgIGxldCBjb3VudCA9IDE7XG4gICAgICAgIGNvbnN0IGVuZCA9IGVycm9yLmxpbmVQb3NbMV07XG4gICAgICAgIGlmIChlbmQ/LmxpbmUgPT09IGxpbmUgJiYgZW5kLmNvbCA+IGNvbCkge1xuICAgICAgICAgICAgY291bnQgPSBNYXRoLm1heCgxLCBNYXRoLm1pbihlbmQuY29sIC0gY29sLCA4MCAtIGNpKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcG9pbnRlciA9ICcgJy5yZXBlYXQoY2kpICsgJ14nLnJlcGVhdChjb3VudCk7XG4gICAgICAgIGVycm9yLm1lc3NhZ2UgKz0gYDpcXG5cXG4ke2xpbmVTdHJ9XFxuJHtwb2ludGVyfVxcbmA7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgWUFNTEVycm9yLCBZQU1MUGFyc2VFcnJvciwgWUFNTFdhcm5pbmcsIHByZXR0aWZ5RXJyb3IgfTtcbiIsICJmdW5jdGlvbiByZXNvbHZlUHJvcHModG9rZW5zLCB7IGZsb3csIGluZGljYXRvciwgbmV4dCwgb2Zmc2V0LCBvbkVycm9yLCBwYXJlbnRJbmRlbnQsIHN0YXJ0T25OZXdsaW5lIH0pIHtcbiAgICBsZXQgc3BhY2VCZWZvcmUgPSBmYWxzZTtcbiAgICBsZXQgYXROZXdsaW5lID0gc3RhcnRPbk5ld2xpbmU7XG4gICAgbGV0IGhhc1NwYWNlID0gc3RhcnRPbk5ld2xpbmU7XG4gICAgbGV0IGNvbW1lbnQgPSAnJztcbiAgICBsZXQgY29tbWVudFNlcCA9ICcnO1xuICAgIGxldCBoYXNOZXdsaW5lID0gZmFsc2U7XG4gICAgbGV0IHJlcVNwYWNlID0gZmFsc2U7XG4gICAgbGV0IHRhYiA9IG51bGw7XG4gICAgbGV0IGFuY2hvciA9IG51bGw7XG4gICAgbGV0IHRhZyA9IG51bGw7XG4gICAgbGV0IG5ld2xpbmVBZnRlclByb3AgPSBudWxsO1xuICAgIGxldCBjb21tYSA9IG51bGw7XG4gICAgbGV0IGZvdW5kID0gbnVsbDtcbiAgICBsZXQgc3RhcnQgPSBudWxsO1xuICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdG9rZW5zKSB7XG4gICAgICAgIGlmIChyZXFTcGFjZSkge1xuICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09ICdzcGFjZScgJiZcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlICE9PSAnbmV3bGluZScgJiZcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlICE9PSAnY29tbWEnKVxuICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4ub2Zmc2V0LCAnTUlTU0lOR19DSEFSJywgJ1RhZ3MgYW5kIGFuY2hvcnMgbXVzdCBiZSBzZXBhcmF0ZWQgZnJvbSB0aGUgbmV4dCB0b2tlbiBieSB3aGl0ZSBzcGFjZScpO1xuICAgICAgICAgICAgcmVxU3BhY2UgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFiKSB7XG4gICAgICAgICAgICBpZiAoYXROZXdsaW5lICYmIHRva2VuLnR5cGUgIT09ICdjb21tZW50JyAmJiB0b2tlbi50eXBlICE9PSAnbmV3bGluZScpIHtcbiAgICAgICAgICAgICAgICBvbkVycm9yKHRhYiwgJ1RBQl9BU19JTkRFTlQnLCAnVGFicyBhcmUgbm90IGFsbG93ZWQgYXMgaW5kZW50YXRpb24nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhYiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICAgICAgLy8gQXQgdGhlIGRvYyBsZXZlbCwgdGFicyBhdCBsaW5lIHN0YXJ0IG1heSBiZSBwYXJzZWRcbiAgICAgICAgICAgICAgICAvLyBhcyBsZWFkaW5nIHdoaXRlIHNwYWNlIHJhdGhlciB0aGFuIGluZGVudGF0aW9uLlxuICAgICAgICAgICAgICAgIC8vIEluIGEgZmxvdyBjb2xsZWN0aW9uLCBvbmx5IHRoZSBwYXJzZXIgaGFuZGxlcyBpbmRlbnQuXG4gICAgICAgICAgICAgICAgaWYgKCFmbG93ICYmXG4gICAgICAgICAgICAgICAgICAgIChpbmRpY2F0b3IgIT09ICdkb2Mtc3RhcnQnIHx8IG5leHQ/LnR5cGUgIT09ICdmbG93LWNvbGxlY3Rpb24nKSAmJlxuICAgICAgICAgICAgICAgICAgICB0b2tlbi5zb3VyY2UuaW5jbHVkZXMoJ1xcdCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhYiA9IHRva2VuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBoYXNTcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb21tZW50Jzoge1xuICAgICAgICAgICAgICAgIGlmICghaGFzU3BhY2UpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdNSVNTSU5HX0NIQVInLCAnQ29tbWVudHMgbXVzdCBiZSBzZXBhcmF0ZWQgZnJvbSBvdGhlciB0b2tlbnMgYnkgd2hpdGUgc3BhY2UgY2hhcmFjdGVycycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNiID0gdG9rZW4uc291cmNlLnN1YnN0cmluZygxKSB8fCAnICc7XG4gICAgICAgICAgICAgICAgaWYgKCFjb21tZW50KVxuICAgICAgICAgICAgICAgICAgICBjb21tZW50ID0gY2I7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjb21tZW50ICs9IGNvbW1lbnRTZXAgKyBjYjtcbiAgICAgICAgICAgICAgICBjb21tZW50U2VwID0gJyc7XG4gICAgICAgICAgICAgICAgYXROZXdsaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICBpZiAoYXROZXdsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudCArPSB0b2tlbi5zb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFmb3VuZCB8fCBpbmRpY2F0b3IgIT09ICdzZXEtaXRlbS1pbmQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2VCZWZvcmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnRTZXAgKz0gdG9rZW4uc291cmNlO1xuICAgICAgICAgICAgICAgIGF0TmV3bGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaGFzTmV3bGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGFuY2hvciB8fCB0YWcpXG4gICAgICAgICAgICAgICAgICAgIG5ld2xpbmVBZnRlclByb3AgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICBoYXNTcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhbmNob3InOlxuICAgICAgICAgICAgICAgIGlmIChhbmNob3IpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdNVUxUSVBMRV9BTkNIT1JTJywgJ0Egbm9kZSBjYW4gaGF2ZSBhdCBtb3N0IG9uZSBhbmNob3InKTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uc291cmNlLmVuZHNXaXRoKCc6JykpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4ub2Zmc2V0ICsgdG9rZW4uc291cmNlLmxlbmd0aCAtIDEsICdCQURfQUxJQVMnLCAnQW5jaG9yIGVuZGluZyBpbiA6IGlzIGFtYmlndW91cycsIHRydWUpO1xuICAgICAgICAgICAgICAgIGFuY2hvciA9IHRva2VuO1xuICAgICAgICAgICAgICAgIHN0YXJ0ID8/IChzdGFydCA9IHRva2VuLm9mZnNldCk7XG4gICAgICAgICAgICAgICAgYXROZXdsaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaGFzU3BhY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXFTcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0YWcnOiB7XG4gICAgICAgICAgICAgICAgaWYgKHRhZylcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ01VTFRJUExFX1RBR1MnLCAnQSBub2RlIGNhbiBoYXZlIGF0IG1vc3Qgb25lIHRhZycpO1xuICAgICAgICAgICAgICAgIHRhZyA9IHRva2VuO1xuICAgICAgICAgICAgICAgIHN0YXJ0ID8/IChzdGFydCA9IHRva2VuLm9mZnNldCk7XG4gICAgICAgICAgICAgICAgYXROZXdsaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaGFzU3BhY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXFTcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIGluZGljYXRvcjpcbiAgICAgICAgICAgICAgICAvLyBDb3VsZCBoZXJlIGhhbmRsZSBwcmVjZWRpbmcgY29tbWVudHMgZGlmZmVyZW50bHlcbiAgICAgICAgICAgICAgICBpZiAoYW5jaG9yIHx8IHRhZylcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ0JBRF9QUk9QX09SREVSJywgYEFuY2hvcnMgYW5kIHRhZ3MgbXVzdCBiZSBhZnRlciB0aGUgJHt0b2tlbi5zb3VyY2V9IGluZGljYXRvcmApO1xuICAgICAgICAgICAgICAgIGlmIChmb3VuZClcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ1VORVhQRUNURURfVE9LRU4nLCBgVW5leHBlY3RlZCAke3Rva2VuLnNvdXJjZX0gaW4gJHtmbG93ID8/ICdjb2xsZWN0aW9uJ31gKTtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRva2VuO1xuICAgICAgICAgICAgICAgIGF0TmV3bGluZSA9XG4gICAgICAgICAgICAgICAgICAgIGluZGljYXRvciA9PT0gJ3NlcS1pdGVtLWluZCcgfHwgaW5kaWNhdG9yID09PSAnZXhwbGljaXQta2V5LWluZCc7XG4gICAgICAgICAgICAgICAgaGFzU3BhY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1hJzpcbiAgICAgICAgICAgICAgICBpZiAoZmxvdykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWEpXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnVU5FWFBFQ1RFRF9UT0tFTicsIGBVbmV4cGVjdGVkICwgaW4gJHtmbG93fWApO1xuICAgICAgICAgICAgICAgICAgICBjb21tYSA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICBhdE5ld2xpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaGFzU3BhY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZWxzZSBmYWxsdGhyb3VnaFxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnVU5FWFBFQ1RFRF9UT0tFTicsIGBVbmV4cGVjdGVkICR7dG9rZW4udHlwZX0gdG9rZW5gKTtcbiAgICAgICAgICAgICAgICBhdE5ld2xpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBoYXNTcGFjZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGxhc3QgPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IGVuZCA9IGxhc3QgPyBsYXN0Lm9mZnNldCArIGxhc3Quc291cmNlLmxlbmd0aCA6IG9mZnNldDtcbiAgICBpZiAocmVxU3BhY2UgJiZcbiAgICAgICAgbmV4dCAmJlxuICAgICAgICBuZXh0LnR5cGUgIT09ICdzcGFjZScgJiZcbiAgICAgICAgbmV4dC50eXBlICE9PSAnbmV3bGluZScgJiZcbiAgICAgICAgbmV4dC50eXBlICE9PSAnY29tbWEnICYmXG4gICAgICAgIChuZXh0LnR5cGUgIT09ICdzY2FsYXInIHx8IG5leHQuc291cmNlICE9PSAnJykpIHtcbiAgICAgICAgb25FcnJvcihuZXh0Lm9mZnNldCwgJ01JU1NJTkdfQ0hBUicsICdUYWdzIGFuZCBhbmNob3JzIG11c3QgYmUgc2VwYXJhdGVkIGZyb20gdGhlIG5leHQgdG9rZW4gYnkgd2hpdGUgc3BhY2UnKTtcbiAgICB9XG4gICAgaWYgKHRhYiAmJlxuICAgICAgICAoKGF0TmV3bGluZSAmJiB0YWIuaW5kZW50IDw9IHBhcmVudEluZGVudCkgfHxcbiAgICAgICAgICAgIG5leHQ/LnR5cGUgPT09ICdibG9jay1tYXAnIHx8XG4gICAgICAgICAgICBuZXh0Py50eXBlID09PSAnYmxvY2stc2VxJykpXG4gICAgICAgIG9uRXJyb3IodGFiLCAnVEFCX0FTX0lOREVOVCcsICdUYWJzIGFyZSBub3QgYWxsb3dlZCBhcyBpbmRlbnRhdGlvbicpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNvbW1hLFxuICAgICAgICBmb3VuZCxcbiAgICAgICAgc3BhY2VCZWZvcmUsXG4gICAgICAgIGNvbW1lbnQsXG4gICAgICAgIGhhc05ld2xpbmUsXG4gICAgICAgIGFuY2hvcixcbiAgICAgICAgdGFnLFxuICAgICAgICBuZXdsaW5lQWZ0ZXJQcm9wLFxuICAgICAgICBlbmQsXG4gICAgICAgIHN0YXJ0OiBzdGFydCA/PyBlbmRcbiAgICB9O1xufVxuXG5leHBvcnQgeyByZXNvbHZlUHJvcHMgfTtcbiIsICJmdW5jdGlvbiBjb250YWluc05ld2xpbmUoa2V5KSB7XG4gICAgaWYgKCFrZXkpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIHN3aXRjaCAoa2V5LnR5cGUpIHtcbiAgICAgICAgY2FzZSAnYWxpYXMnOlxuICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICBjYXNlICdkb3VibGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgIGNhc2UgJ3NpbmdsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgICAgIGlmIChrZXkuc291cmNlLmluY2x1ZGVzKCdcXG4nKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChrZXkuZW5kKVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc3Qgb2Yga2V5LmVuZClcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0LnR5cGUgPT09ICduZXdsaW5lJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjYXNlICdmbG93LWNvbGxlY3Rpb24nOlxuICAgICAgICAgICAgZm9yIChjb25zdCBpdCBvZiBrZXkuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN0IG9mIGl0LnN0YXJ0KVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3QudHlwZSA9PT0gJ25ld2xpbmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGl0LnNlcClcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBzdCBvZiBpdC5zZXApXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3QudHlwZSA9PT0gJ25ld2xpbmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChjb250YWluc05ld2xpbmUoaXQua2V5KSB8fCBjb250YWluc05ld2xpbmUoaXQudmFsdWUpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgY29udGFpbnNOZXdsaW5lIH07XG4iLCAiaW1wb3J0IHsgY29udGFpbnNOZXdsaW5lIH0gZnJvbSAnLi91dGlsLWNvbnRhaW5zLW5ld2xpbmUuanMnO1xuXG5mdW5jdGlvbiBmbG93SW5kZW50Q2hlY2soaW5kZW50LCBmYywgb25FcnJvcikge1xuICAgIGlmIChmYz8udHlwZSA9PT0gJ2Zsb3ctY29sbGVjdGlvbicpIHtcbiAgICAgICAgY29uc3QgZW5kID0gZmMuZW5kWzBdO1xuICAgICAgICBpZiAoZW5kLmluZGVudCA9PT0gaW5kZW50ICYmXG4gICAgICAgICAgICAoZW5kLnNvdXJjZSA9PT0gJ10nIHx8IGVuZC5zb3VyY2UgPT09ICd9JykgJiZcbiAgICAgICAgICAgIGNvbnRhaW5zTmV3bGluZShmYykpIHtcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9ICdGbG93IGVuZCBpbmRpY2F0b3Igc2hvdWxkIGJlIG1vcmUgaW5kZW50ZWQgdGhhbiBwYXJlbnQnO1xuICAgICAgICAgICAgb25FcnJvcihlbmQsICdCQURfSU5ERU5UJywgbXNnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgZmxvd0luZGVudENoZWNrIH07XG4iLCAiaW1wb3J0IHsgaXNTY2FsYXIgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5cbmZ1bmN0aW9uIG1hcEluY2x1ZGVzKGN0eCwgaXRlbXMsIHNlYXJjaCkge1xuICAgIGNvbnN0IHsgdW5pcXVlS2V5cyB9ID0gY3R4Lm9wdGlvbnM7XG4gICAgaWYgKHVuaXF1ZUtleXMgPT09IGZhbHNlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgaXNFcXVhbCA9IHR5cGVvZiB1bmlxdWVLZXlzID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gdW5pcXVlS2V5c1xuICAgICAgICA6IChhLCBiKSA9PiBhID09PSBiIHx8IChpc1NjYWxhcihhKSAmJiBpc1NjYWxhcihiKSAmJiBhLnZhbHVlID09PSBiLnZhbHVlKTtcbiAgICByZXR1cm4gaXRlbXMuc29tZShwYWlyID0+IGlzRXF1YWwocGFpci5rZXksIHNlYXJjaCkpO1xufVxuXG5leHBvcnQgeyBtYXBJbmNsdWRlcyB9O1xuIiwgImltcG9ydCB7IFBhaXIgfSBmcm9tICcuLi9ub2Rlcy9QYWlyLmpzJztcbmltcG9ydCB7IFlBTUxNYXAgfSBmcm9tICcuLi9ub2Rlcy9ZQU1MTWFwLmpzJztcbmltcG9ydCB7IHJlc29sdmVQcm9wcyB9IGZyb20gJy4vcmVzb2x2ZS1wcm9wcy5qcyc7XG5pbXBvcnQgeyBjb250YWluc05ld2xpbmUgfSBmcm9tICcuL3V0aWwtY29udGFpbnMtbmV3bGluZS5qcyc7XG5pbXBvcnQgeyBmbG93SW5kZW50Q2hlY2sgfSBmcm9tICcuL3V0aWwtZmxvdy1pbmRlbnQtY2hlY2suanMnO1xuaW1wb3J0IHsgbWFwSW5jbHVkZXMgfSBmcm9tICcuL3V0aWwtbWFwLWluY2x1ZGVzLmpzJztcblxuY29uc3Qgc3RhcnRDb2xNc2cgPSAnQWxsIG1hcHBpbmcgaXRlbXMgbXVzdCBzdGFydCBhdCB0aGUgc2FtZSBjb2x1bW4nO1xuZnVuY3Rpb24gcmVzb2x2ZUJsb2NrTWFwKHsgY29tcG9zZU5vZGUsIGNvbXBvc2VFbXB0eU5vZGUgfSwgY3R4LCBibSwgb25FcnJvciwgdGFnKSB7XG4gICAgY29uc3QgTm9kZUNsYXNzID0gdGFnPy5ub2RlQ2xhc3MgPz8gWUFNTE1hcDtcbiAgICBjb25zdCBtYXAgPSBuZXcgTm9kZUNsYXNzKGN0eC5zY2hlbWEpO1xuICAgIGlmIChjdHguYXRSb290KVxuICAgICAgICBjdHguYXRSb290ID0gZmFsc2U7XG4gICAgbGV0IG9mZnNldCA9IGJtLm9mZnNldDtcbiAgICBsZXQgY29tbWVudEVuZCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBjb2xsSXRlbSBvZiBibS5pdGVtcykge1xuICAgICAgICBjb25zdCB7IHN0YXJ0LCBrZXksIHNlcCwgdmFsdWUgfSA9IGNvbGxJdGVtO1xuICAgICAgICAvLyBrZXkgcHJvcGVydGllc1xuICAgICAgICBjb25zdCBrZXlQcm9wcyA9IHJlc29sdmVQcm9wcyhzdGFydCwge1xuICAgICAgICAgICAgaW5kaWNhdG9yOiAnZXhwbGljaXQta2V5LWluZCcsXG4gICAgICAgICAgICBuZXh0OiBrZXkgPz8gc2VwPy5bMF0sXG4gICAgICAgICAgICBvZmZzZXQsXG4gICAgICAgICAgICBvbkVycm9yLFxuICAgICAgICAgICAgcGFyZW50SW5kZW50OiBibS5pbmRlbnQsXG4gICAgICAgICAgICBzdGFydE9uTmV3bGluZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgaW1wbGljaXRLZXkgPSAha2V5UHJvcHMuZm91bmQ7XG4gICAgICAgIGlmIChpbXBsaWNpdEtleSkge1xuICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkudHlwZSA9PT0gJ2Jsb2NrLXNlcScpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3Iob2Zmc2V0LCAnQkxPQ0tfQVNfSU1QTElDSVRfS0VZJywgJ0EgYmxvY2sgc2VxdWVuY2UgbWF5IG5vdCBiZSB1c2VkIGFzIGFuIGltcGxpY2l0IG1hcCBrZXknKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICgnaW5kZW50JyBpbiBrZXkgJiYga2V5LmluZGVudCAhPT0gYm0uaW5kZW50KVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKG9mZnNldCwgJ0JBRF9JTkRFTlQnLCBzdGFydENvbE1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWtleVByb3BzLmFuY2hvciAmJiAha2V5UHJvcHMudGFnICYmICFzZXApIHtcbiAgICAgICAgICAgICAgICBjb21tZW50RW5kID0ga2V5UHJvcHMuZW5kO1xuICAgICAgICAgICAgICAgIGlmIChrZXlQcm9wcy5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXAuY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5jb21tZW50ICs9ICdcXG4nICsga2V5UHJvcHMuY29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwLmNvbW1lbnQgPSBrZXlQcm9wcy5jb21tZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChrZXlQcm9wcy5uZXdsaW5lQWZ0ZXJQcm9wIHx8IGNvbnRhaW5zTmV3bGluZShrZXkpKSB7XG4gICAgICAgICAgICAgICAgb25FcnJvcihrZXkgPz8gc3RhcnRbc3RhcnQubGVuZ3RoIC0gMV0sICdNVUxUSUxJTkVfSU1QTElDSVRfS0VZJywgJ0ltcGxpY2l0IGtleXMgbmVlZCB0byBiZSBvbiBhIHNpbmdsZSBsaW5lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5UHJvcHMuZm91bmQ/LmluZGVudCAhPT0gYm0uaW5kZW50KSB7XG4gICAgICAgICAgICBvbkVycm9yKG9mZnNldCwgJ0JBRF9JTkRFTlQnLCBzdGFydENvbE1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8ga2V5IHZhbHVlXG4gICAgICAgIGN0eC5hdEtleSA9IHRydWU7XG4gICAgICAgIGNvbnN0IGtleVN0YXJ0ID0ga2V5UHJvcHMuZW5kO1xuICAgICAgICBjb25zdCBrZXlOb2RlID0ga2V5XG4gICAgICAgICAgICA/IGNvbXBvc2VOb2RlKGN0eCwga2V5LCBrZXlQcm9wcywgb25FcnJvcilcbiAgICAgICAgICAgIDogY29tcG9zZUVtcHR5Tm9kZShjdHgsIGtleVN0YXJ0LCBzdGFydCwgbnVsbCwga2V5UHJvcHMsIG9uRXJyb3IpO1xuICAgICAgICBpZiAoY3R4LnNjaGVtYS5jb21wYXQpXG4gICAgICAgICAgICBmbG93SW5kZW50Q2hlY2soYm0uaW5kZW50LCBrZXksIG9uRXJyb3IpO1xuICAgICAgICBjdHguYXRLZXkgPSBmYWxzZTtcbiAgICAgICAgaWYgKG1hcEluY2x1ZGVzKGN0eCwgbWFwLml0ZW1zLCBrZXlOb2RlKSlcbiAgICAgICAgICAgIG9uRXJyb3Ioa2V5U3RhcnQsICdEVVBMSUNBVEVfS0VZJywgJ01hcCBrZXlzIG11c3QgYmUgdW5pcXVlJyk7XG4gICAgICAgIC8vIHZhbHVlIHByb3BlcnRpZXNcbiAgICAgICAgY29uc3QgdmFsdWVQcm9wcyA9IHJlc29sdmVQcm9wcyhzZXAgPz8gW10sIHtcbiAgICAgICAgICAgIGluZGljYXRvcjogJ21hcC12YWx1ZS1pbmQnLFxuICAgICAgICAgICAgbmV4dDogdmFsdWUsXG4gICAgICAgICAgICBvZmZzZXQ6IGtleU5vZGUucmFuZ2VbMl0sXG4gICAgICAgICAgICBvbkVycm9yLFxuICAgICAgICAgICAgcGFyZW50SW5kZW50OiBibS5pbmRlbnQsXG4gICAgICAgICAgICBzdGFydE9uTmV3bGluZTogIWtleSB8fCBrZXkudHlwZSA9PT0gJ2Jsb2NrLXNjYWxhcidcbiAgICAgICAgfSk7XG4gICAgICAgIG9mZnNldCA9IHZhbHVlUHJvcHMuZW5kO1xuICAgICAgICBpZiAodmFsdWVQcm9wcy5mb3VuZCkge1xuICAgICAgICAgICAgaWYgKGltcGxpY2l0S2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlPy50eXBlID09PSAnYmxvY2stbWFwJyAmJiAhdmFsdWVQcm9wcy5oYXNOZXdsaW5lKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKG9mZnNldCwgJ0JMT0NLX0FTX0lNUExJQ0lUX0tFWScsICdOZXN0ZWQgbWFwcGluZ3MgYXJlIG5vdCBhbGxvd2VkIGluIGNvbXBhY3QgbWFwcGluZ3MnKTtcbiAgICAgICAgICAgICAgICBpZiAoY3R4Lm9wdGlvbnMuc3RyaWN0ICYmXG4gICAgICAgICAgICAgICAgICAgIGtleVByb3BzLnN0YXJ0IDwgdmFsdWVQcm9wcy5mb3VuZC5vZmZzZXQgLSAxMDI0KVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKGtleU5vZGUucmFuZ2UsICdLRVlfT1ZFUl8xMDI0X0NIQVJTJywgJ1RoZSA6IGluZGljYXRvciBtdXN0IGJlIGF0IG1vc3QgMTAyNCBjaGFycyBhZnRlciB0aGUgc3RhcnQgb2YgYW4gaW1wbGljaXQgYmxvY2sgbWFwcGluZyBrZXknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHZhbHVlIHZhbHVlXG4gICAgICAgICAgICBjb25zdCB2YWx1ZU5vZGUgPSB2YWx1ZVxuICAgICAgICAgICAgICAgID8gY29tcG9zZU5vZGUoY3R4LCB2YWx1ZSwgdmFsdWVQcm9wcywgb25FcnJvcilcbiAgICAgICAgICAgICAgICA6IGNvbXBvc2VFbXB0eU5vZGUoY3R4LCBvZmZzZXQsIHNlcCwgbnVsbCwgdmFsdWVQcm9wcywgb25FcnJvcik7XG4gICAgICAgICAgICBpZiAoY3R4LnNjaGVtYS5jb21wYXQpXG4gICAgICAgICAgICAgICAgZmxvd0luZGVudENoZWNrKGJtLmluZGVudCwgdmFsdWUsIG9uRXJyb3IpO1xuICAgICAgICAgICAgb2Zmc2V0ID0gdmFsdWVOb2RlLnJhbmdlWzJdO1xuICAgICAgICAgICAgY29uc3QgcGFpciA9IG5ldyBQYWlyKGtleU5vZGUsIHZhbHVlTm9kZSk7XG4gICAgICAgICAgICBpZiAoY3R4Lm9wdGlvbnMua2VlcFNvdXJjZVRva2VucylcbiAgICAgICAgICAgICAgICBwYWlyLnNyY1Rva2VuID0gY29sbEl0ZW07XG4gICAgICAgICAgICBtYXAuaXRlbXMucHVzaChwYWlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGtleSB3aXRoIG5vIHZhbHVlXG4gICAgICAgICAgICBpZiAoaW1wbGljaXRLZXkpXG4gICAgICAgICAgICAgICAgb25FcnJvcihrZXlOb2RlLnJhbmdlLCAnTUlTU0lOR19DSEFSJywgJ0ltcGxpY2l0IG1hcCBrZXlzIG5lZWQgdG8gYmUgZm9sbG93ZWQgYnkgbWFwIHZhbHVlcycpO1xuICAgICAgICAgICAgaWYgKHZhbHVlUHJvcHMuY29tbWVudCkge1xuICAgICAgICAgICAgICAgIGlmIChrZXlOb2RlLmNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGtleU5vZGUuY29tbWVudCArPSAnXFxuJyArIHZhbHVlUHJvcHMuY29tbWVudDtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGtleU5vZGUuY29tbWVudCA9IHZhbHVlUHJvcHMuY29tbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhaXIgPSBuZXcgUGFpcihrZXlOb2RlKTtcbiAgICAgICAgICAgIGlmIChjdHgub3B0aW9ucy5rZWVwU291cmNlVG9rZW5zKVxuICAgICAgICAgICAgICAgIHBhaXIuc3JjVG9rZW4gPSBjb2xsSXRlbTtcbiAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHBhaXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChjb21tZW50RW5kICYmIGNvbW1lbnRFbmQgPCBvZmZzZXQpXG4gICAgICAgIG9uRXJyb3IoY29tbWVudEVuZCwgJ0lNUE9TU0lCTEUnLCAnTWFwIGNvbW1lbnQgd2l0aCB0cmFpbGluZyBjb250ZW50Jyk7XG4gICAgbWFwLnJhbmdlID0gW2JtLm9mZnNldCwgb2Zmc2V0LCBjb21tZW50RW5kID8/IG9mZnNldF07XG4gICAgcmV0dXJuIG1hcDtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZUJsb2NrTWFwIH07XG4iLCAiaW1wb3J0IHsgWUFNTFNlcSB9IGZyb20gJy4uL25vZGVzL1lBTUxTZXEuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZVByb3BzIH0gZnJvbSAnLi9yZXNvbHZlLXByb3BzLmpzJztcbmltcG9ydCB7IGZsb3dJbmRlbnRDaGVjayB9IGZyb20gJy4vdXRpbC1mbG93LWluZGVudC1jaGVjay5qcyc7XG5cbmZ1bmN0aW9uIHJlc29sdmVCbG9ja1NlcSh7IGNvbXBvc2VOb2RlLCBjb21wb3NlRW1wdHlOb2RlIH0sIGN0eCwgYnMsIG9uRXJyb3IsIHRhZykge1xuICAgIGNvbnN0IE5vZGVDbGFzcyA9IHRhZz8ubm9kZUNsYXNzID8/IFlBTUxTZXE7XG4gICAgY29uc3Qgc2VxID0gbmV3IE5vZGVDbGFzcyhjdHguc2NoZW1hKTtcbiAgICBpZiAoY3R4LmF0Um9vdClcbiAgICAgICAgY3R4LmF0Um9vdCA9IGZhbHNlO1xuICAgIGlmIChjdHguYXRLZXkpXG4gICAgICAgIGN0eC5hdEtleSA9IGZhbHNlO1xuICAgIGxldCBvZmZzZXQgPSBicy5vZmZzZXQ7XG4gICAgbGV0IGNvbW1lbnRFbmQgPSBudWxsO1xuICAgIGZvciAoY29uc3QgeyBzdGFydCwgdmFsdWUgfSBvZiBicy5pdGVtcykge1xuICAgICAgICBjb25zdCBwcm9wcyA9IHJlc29sdmVQcm9wcyhzdGFydCwge1xuICAgICAgICAgICAgaW5kaWNhdG9yOiAnc2VxLWl0ZW0taW5kJyxcbiAgICAgICAgICAgIG5leHQ6IHZhbHVlLFxuICAgICAgICAgICAgb2Zmc2V0LFxuICAgICAgICAgICAgb25FcnJvcixcbiAgICAgICAgICAgIHBhcmVudEluZGVudDogYnMuaW5kZW50LFxuICAgICAgICAgICAgc3RhcnRPbk5ld2xpbmU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghcHJvcHMuZm91bmQpIHtcbiAgICAgICAgICAgIGlmIChwcm9wcy5hbmNob3IgfHwgcHJvcHMudGFnIHx8IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlPy50eXBlID09PSAnYmxvY2stc2VxJylcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihwcm9wcy5lbmQsICdCQURfSU5ERU5UJywgJ0FsbCBzZXF1ZW5jZSBpdGVtcyBtdXN0IHN0YXJ0IGF0IHRoZSBzYW1lIGNvbHVtbicpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihvZmZzZXQsICdNSVNTSU5HX0NIQVInLCAnU2VxdWVuY2UgaXRlbSB3aXRob3V0IC0gaW5kaWNhdG9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb21tZW50RW5kID0gcHJvcHMuZW5kO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wcy5jb21tZW50KVxuICAgICAgICAgICAgICAgICAgICBzZXEuY29tbWVudCA9IHByb3BzLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kZSA9IHZhbHVlXG4gICAgICAgICAgICA/IGNvbXBvc2VOb2RlKGN0eCwgdmFsdWUsIHByb3BzLCBvbkVycm9yKVxuICAgICAgICAgICAgOiBjb21wb3NlRW1wdHlOb2RlKGN0eCwgcHJvcHMuZW5kLCBzdGFydCwgbnVsbCwgcHJvcHMsIG9uRXJyb3IpO1xuICAgICAgICBpZiAoY3R4LnNjaGVtYS5jb21wYXQpXG4gICAgICAgICAgICBmbG93SW5kZW50Q2hlY2soYnMuaW5kZW50LCB2YWx1ZSwgb25FcnJvcik7XG4gICAgICAgIG9mZnNldCA9IG5vZGUucmFuZ2VbMl07XG4gICAgICAgIHNlcS5pdGVtcy5wdXNoKG5vZGUpO1xuICAgIH1cbiAgICBzZXEucmFuZ2UgPSBbYnMub2Zmc2V0LCBvZmZzZXQsIGNvbW1lbnRFbmQgPz8gb2Zmc2V0XTtcbiAgICByZXR1cm4gc2VxO1xufVxuXG5leHBvcnQgeyByZXNvbHZlQmxvY2tTZXEgfTtcbiIsICJmdW5jdGlvbiByZXNvbHZlRW5kKGVuZCwgb2Zmc2V0LCByZXFTcGFjZSwgb25FcnJvcikge1xuICAgIGxldCBjb21tZW50ID0gJyc7XG4gICAgaWYgKGVuZCkge1xuICAgICAgICBsZXQgaGFzU3BhY2UgPSBmYWxzZTtcbiAgICAgICAgbGV0IHNlcCA9ICcnO1xuICAgICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIGVuZCkge1xuICAgICAgICAgICAgY29uc3QgeyBzb3VyY2UsIHR5cGUgfSA9IHRva2VuO1xuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICBoYXNTcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXFTcGFjZSAmJiAhaGFzU3BhY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnTUlTU0lOR19DSEFSJywgJ0NvbW1lbnRzIG11c3QgYmUgc2VwYXJhdGVkIGZyb20gb3RoZXIgdG9rZW5zIGJ5IHdoaXRlIHNwYWNlIGNoYXJhY3RlcnMnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2IgPSBzb3VyY2Uuc3Vic3RyaW5nKDEpIHx8ICcgJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb21tZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudCA9IGNiO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50ICs9IHNlcCArIGNiO1xuICAgICAgICAgICAgICAgICAgICBzZXAgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcCArPSBzb3VyY2U7XG4gICAgICAgICAgICAgICAgICAgIGhhc1NwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ1VORVhQRUNURURfVE9LRU4nLCBgVW5leHBlY3RlZCAke3R5cGV9IGF0IG5vZGUgZW5kYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvZmZzZXQgKz0gc291cmNlLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBjb21tZW50LCBvZmZzZXQgfTtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZUVuZCB9O1xuIiwgImltcG9ydCB7IGlzUGFpciB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFBhaXIgfSBmcm9tICcuLi9ub2Rlcy9QYWlyLmpzJztcbmltcG9ydCB7IFlBTUxNYXAgfSBmcm9tICcuLi9ub2Rlcy9ZQU1MTWFwLmpzJztcbmltcG9ydCB7IFlBTUxTZXEgfSBmcm9tICcuLi9ub2Rlcy9ZQU1MU2VxLmpzJztcbmltcG9ydCB7IHJlc29sdmVFbmQgfSBmcm9tICcuL3Jlc29sdmUtZW5kLmpzJztcbmltcG9ydCB7IHJlc29sdmVQcm9wcyB9IGZyb20gJy4vcmVzb2x2ZS1wcm9wcy5qcyc7XG5pbXBvcnQgeyBjb250YWluc05ld2xpbmUgfSBmcm9tICcuL3V0aWwtY29udGFpbnMtbmV3bGluZS5qcyc7XG5pbXBvcnQgeyBtYXBJbmNsdWRlcyB9IGZyb20gJy4vdXRpbC1tYXAtaW5jbHVkZXMuanMnO1xuXG5jb25zdCBibG9ja01zZyA9ICdCbG9jayBjb2xsZWN0aW9ucyBhcmUgbm90IGFsbG93ZWQgd2l0aGluIGZsb3cgY29sbGVjdGlvbnMnO1xuY29uc3QgaXNCbG9jayA9ICh0b2tlbikgPT4gdG9rZW4gJiYgKHRva2VuLnR5cGUgPT09ICdibG9jay1tYXAnIHx8IHRva2VuLnR5cGUgPT09ICdibG9jay1zZXEnKTtcbmZ1bmN0aW9uIHJlc29sdmVGbG93Q29sbGVjdGlvbih7IGNvbXBvc2VOb2RlLCBjb21wb3NlRW1wdHlOb2RlIH0sIGN0eCwgZmMsIG9uRXJyb3IsIHRhZykge1xuICAgIGNvbnN0IGlzTWFwID0gZmMuc3RhcnQuc291cmNlID09PSAneyc7XG4gICAgY29uc3QgZmNOYW1lID0gaXNNYXAgPyAnZmxvdyBtYXAnIDogJ2Zsb3cgc2VxdWVuY2UnO1xuICAgIGNvbnN0IE5vZGVDbGFzcyA9ICh0YWc/Lm5vZGVDbGFzcyA/PyAoaXNNYXAgPyBZQU1MTWFwIDogWUFNTFNlcSkpO1xuICAgIGNvbnN0IGNvbGwgPSBuZXcgTm9kZUNsYXNzKGN0eC5zY2hlbWEpO1xuICAgIGNvbGwuZmxvdyA9IHRydWU7XG4gICAgY29uc3QgYXRSb290ID0gY3R4LmF0Um9vdDtcbiAgICBpZiAoYXRSb290KVxuICAgICAgICBjdHguYXRSb290ID0gZmFsc2U7XG4gICAgaWYgKGN0eC5hdEtleSlcbiAgICAgICAgY3R4LmF0S2V5ID0gZmFsc2U7XG4gICAgbGV0IG9mZnNldCA9IGZjLm9mZnNldCArIGZjLnN0YXJ0LnNvdXJjZS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmYy5pdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBjb2xsSXRlbSA9IGZjLml0ZW1zW2ldO1xuICAgICAgICBjb25zdCB7IHN0YXJ0LCBrZXksIHNlcCwgdmFsdWUgfSA9IGNvbGxJdGVtO1xuICAgICAgICBjb25zdCBwcm9wcyA9IHJlc29sdmVQcm9wcyhzdGFydCwge1xuICAgICAgICAgICAgZmxvdzogZmNOYW1lLFxuICAgICAgICAgICAgaW5kaWNhdG9yOiAnZXhwbGljaXQta2V5LWluZCcsXG4gICAgICAgICAgICBuZXh0OiBrZXkgPz8gc2VwPy5bMF0sXG4gICAgICAgICAgICBvZmZzZXQsXG4gICAgICAgICAgICBvbkVycm9yLFxuICAgICAgICAgICAgcGFyZW50SW5kZW50OiBmYy5pbmRlbnQsXG4gICAgICAgICAgICBzdGFydE9uTmV3bGluZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghcHJvcHMuZm91bmQpIHtcbiAgICAgICAgICAgIGlmICghcHJvcHMuYW5jaG9yICYmICFwcm9wcy50YWcgJiYgIXNlcCAmJiAhdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCAmJiBwcm9wcy5jb21tYSlcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihwcm9wcy5jb21tYSwgJ1VORVhQRUNURURfVE9LRU4nLCBgVW5leHBlY3RlZCAsIGluICR7ZmNOYW1lfWApO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGkgPCBmYy5pdGVtcy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHByb3BzLnN0YXJ0LCAnVU5FWFBFQ1RFRF9UT0tFTicsIGBVbmV4cGVjdGVkIGVtcHR5IGl0ZW0gaW4gJHtmY05hbWV9YCk7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BzLmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbGwuY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGwuY29tbWVudCArPSAnXFxuJyArIHByb3BzLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGwuY29tbWVudCA9IHByb3BzLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9mZnNldCA9IHByb3BzLmVuZDtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNNYXAgJiYgY3R4Lm9wdGlvbnMuc3RyaWN0ICYmIGNvbnRhaW5zTmV3bGluZShrZXkpKVxuICAgICAgICAgICAgICAgIG9uRXJyb3Ioa2V5LCAvLyBjaGVja2VkIGJ5IGNvbnRhaW5zTmV3bGluZSgpXG4gICAgICAgICAgICAgICAgJ01VTFRJTElORV9JTVBMSUNJVF9LRVknLCAnSW1wbGljaXQga2V5cyBvZiBmbG93IHNlcXVlbmNlIHBhaXJzIG5lZWQgdG8gYmUgb24gYSBzaW5nbGUgbGluZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICBpZiAocHJvcHMuY29tbWEpXG4gICAgICAgICAgICAgICAgb25FcnJvcihwcm9wcy5jb21tYSwgJ1VORVhQRUNURURfVE9LRU4nLCBgVW5leHBlY3RlZCAsIGluICR7ZmNOYW1lfWApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFwcm9wcy5jb21tYSlcbiAgICAgICAgICAgICAgICBvbkVycm9yKHByb3BzLnN0YXJ0LCAnTUlTU0lOR19DSEFSJywgYE1pc3NpbmcgLCBiZXR3ZWVuICR7ZmNOYW1lfSBpdGVtc2ApO1xuICAgICAgICAgICAgaWYgKHByb3BzLmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJldkl0ZW1Db21tZW50ID0gJyc7XG4gICAgICAgICAgICAgICAgbG9vcDogZm9yIChjb25zdCBzdCBvZiBzdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHN0LnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbW1hJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZJdGVtQ29tbWVudCA9IHN0LnNvdXJjZS5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJldkl0ZW1Db21tZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwcmV2ID0gY29sbC5pdGVtc1tjb2xsLml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNQYWlyKHByZXYpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldiA9IHByZXYudmFsdWUgPz8gcHJldi5rZXk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2LmNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2LmNvbW1lbnQgKz0gJ1xcbicgKyBwcmV2SXRlbUNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXYuY29tbWVudCA9IHByZXZJdGVtQ29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMuY29tbWVudCA9IHByb3BzLmNvbW1lbnQuc3Vic3RyaW5nKHByZXZJdGVtQ29tbWVudC5sZW5ndGggKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc01hcCAmJiAhc2VwICYmICFwcm9wcy5mb3VuZCkge1xuICAgICAgICAgICAgLy8gaXRlbSBpcyBhIHZhbHVlIGluIGEgc2VxXG4gICAgICAgICAgICAvLyBcdTIxOTIga2V5ICYgc2VwIGFyZSBlbXB0eSwgc3RhcnQgZG9lcyBub3QgaW5jbHVkZSA/IG9yIDpcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlTm9kZSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgPyBjb21wb3NlTm9kZShjdHgsIHZhbHVlLCBwcm9wcywgb25FcnJvcilcbiAgICAgICAgICAgICAgICA6IGNvbXBvc2VFbXB0eU5vZGUoY3R4LCBwcm9wcy5lbmQsIHNlcCwgbnVsbCwgcHJvcHMsIG9uRXJyb3IpO1xuICAgICAgICAgICAgY29sbC5pdGVtcy5wdXNoKHZhbHVlTm9kZSk7XG4gICAgICAgICAgICBvZmZzZXQgPSB2YWx1ZU5vZGUucmFuZ2VbMl07XG4gICAgICAgICAgICBpZiAoaXNCbG9jayh2YWx1ZSkpXG4gICAgICAgICAgICAgICAgb25FcnJvcih2YWx1ZU5vZGUucmFuZ2UsICdCTE9DS19JTl9GTE9XJywgYmxvY2tNc2cpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gaXRlbSBpcyBhIGtleSt2YWx1ZSBwYWlyXG4gICAgICAgICAgICAvLyBrZXkgdmFsdWVcbiAgICAgICAgICAgIGN0eC5hdEtleSA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBrZXlTdGFydCA9IHByb3BzLmVuZDtcbiAgICAgICAgICAgIGNvbnN0IGtleU5vZGUgPSBrZXlcbiAgICAgICAgICAgICAgICA/IGNvbXBvc2VOb2RlKGN0eCwga2V5LCBwcm9wcywgb25FcnJvcilcbiAgICAgICAgICAgICAgICA6IGNvbXBvc2VFbXB0eU5vZGUoY3R4LCBrZXlTdGFydCwgc3RhcnQsIG51bGwsIHByb3BzLCBvbkVycm9yKTtcbiAgICAgICAgICAgIGlmIChpc0Jsb2NrKGtleSkpXG4gICAgICAgICAgICAgICAgb25FcnJvcihrZXlOb2RlLnJhbmdlLCAnQkxPQ0tfSU5fRkxPVycsIGJsb2NrTXNnKTtcbiAgICAgICAgICAgIGN0eC5hdEtleSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gdmFsdWUgcHJvcGVydGllc1xuICAgICAgICAgICAgY29uc3QgdmFsdWVQcm9wcyA9IHJlc29sdmVQcm9wcyhzZXAgPz8gW10sIHtcbiAgICAgICAgICAgICAgICBmbG93OiBmY05hbWUsXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9yOiAnbWFwLXZhbHVlLWluZCcsXG4gICAgICAgICAgICAgICAgbmV4dDogdmFsdWUsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBrZXlOb2RlLnJhbmdlWzJdLFxuICAgICAgICAgICAgICAgIG9uRXJyb3IsXG4gICAgICAgICAgICAgICAgcGFyZW50SW5kZW50OiBmYy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgc3RhcnRPbk5ld2xpbmU6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh2YWx1ZVByb3BzLmZvdW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc01hcCAmJiAhcHJvcHMuZm91bmQgJiYgY3R4Lm9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXApXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN0IG9mIHNlcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdCA9PT0gdmFsdWVQcm9wcy5mb3VuZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0LnR5cGUgPT09ICduZXdsaW5lJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHN0LCAnTVVMVElMSU5FX0lNUExJQ0lUX0tFWScsICdJbXBsaWNpdCBrZXlzIG9mIGZsb3cgc2VxdWVuY2UgcGFpcnMgbmVlZCB0byBiZSBvbiBhIHNpbmdsZSBsaW5lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BzLnN0YXJ0IDwgdmFsdWVQcm9wcy5mb3VuZC5vZmZzZXQgLSAxMDI0KVxuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcih2YWx1ZVByb3BzLmZvdW5kLCAnS0VZX09WRVJfMTAyNF9DSEFSUycsICdUaGUgOiBpbmRpY2F0b3IgbXVzdCBiZSBhdCBtb3N0IDEwMjQgY2hhcnMgYWZ0ZXIgdGhlIHN0YXJ0IG9mIGFuIGltcGxpY2l0IGZsb3cgc2VxdWVuY2Uga2V5Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJ3NvdXJjZScgaW4gdmFsdWUgJiYgdmFsdWUuc291cmNlPy5bMF0gPT09ICc6JylcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih2YWx1ZSwgJ01JU1NJTkdfQ0hBUicsIGBNaXNzaW5nIHNwYWNlIGFmdGVyIDogaW4gJHtmY05hbWV9YCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHZhbHVlUHJvcHMuc3RhcnQsICdNSVNTSU5HX0NIQVInLCBgTWlzc2luZyAsIG9yIDogYmV0d2VlbiAke2ZjTmFtZX0gaXRlbXNgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHZhbHVlIHZhbHVlXG4gICAgICAgICAgICBjb25zdCB2YWx1ZU5vZGUgPSB2YWx1ZVxuICAgICAgICAgICAgICAgID8gY29tcG9zZU5vZGUoY3R4LCB2YWx1ZSwgdmFsdWVQcm9wcywgb25FcnJvcilcbiAgICAgICAgICAgICAgICA6IHZhbHVlUHJvcHMuZm91bmRcbiAgICAgICAgICAgICAgICAgICAgPyBjb21wb3NlRW1wdHlOb2RlKGN0eCwgdmFsdWVQcm9wcy5lbmQsIHNlcCwgbnVsbCwgdmFsdWVQcm9wcywgb25FcnJvcilcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICAgICAgaWYgKHZhbHVlTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0Jsb2NrKHZhbHVlKSlcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih2YWx1ZU5vZGUucmFuZ2UsICdCTE9DS19JTl9GTE9XJywgYmxvY2tNc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFsdWVQcm9wcy5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleU5vZGUuY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAga2V5Tm9kZS5jb21tZW50ICs9ICdcXG4nICsgdmFsdWVQcm9wcy5jb21tZW50O1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAga2V5Tm9kZS5jb21tZW50ID0gdmFsdWVQcm9wcy5jb21tZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcGFpciA9IG5ldyBQYWlyKGtleU5vZGUsIHZhbHVlTm9kZSk7XG4gICAgICAgICAgICBpZiAoY3R4Lm9wdGlvbnMua2VlcFNvdXJjZVRva2VucylcbiAgICAgICAgICAgICAgICBwYWlyLnNyY1Rva2VuID0gY29sbEl0ZW07XG4gICAgICAgICAgICBpZiAoaXNNYXApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSBjb2xsO1xuICAgICAgICAgICAgICAgIGlmIChtYXBJbmNsdWRlcyhjdHgsIG1hcC5pdGVtcywga2V5Tm9kZSkpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3Ioa2V5U3RhcnQsICdEVVBMSUNBVEVfS0VZJywgJ01hcCBrZXlzIG11c3QgYmUgdW5pcXVlJyk7XG4gICAgICAgICAgICAgICAgbWFwLml0ZW1zLnB1c2gocGFpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSBuZXcgWUFNTE1hcChjdHguc2NoZW1hKTtcbiAgICAgICAgICAgICAgICBtYXAuZmxvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgbWFwLml0ZW1zLnB1c2gocGFpcik7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kUmFuZ2UgPSAodmFsdWVOb2RlID8/IGtleU5vZGUpLnJhbmdlO1xuICAgICAgICAgICAgICAgIG1hcC5yYW5nZSA9IFtrZXlOb2RlLnJhbmdlWzBdLCBlbmRSYW5nZVsxXSwgZW5kUmFuZ2VbMl1dO1xuICAgICAgICAgICAgICAgIGNvbGwuaXRlbXMucHVzaChtYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2Zmc2V0ID0gdmFsdWVOb2RlID8gdmFsdWVOb2RlLnJhbmdlWzJdIDogdmFsdWVQcm9wcy5lbmQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgZXhwZWN0ZWRFbmQgPSBpc01hcCA/ICd9JyA6ICddJztcbiAgICBjb25zdCBbY2UsIC4uLmVlXSA9IGZjLmVuZDtcbiAgICBsZXQgY2VQb3MgPSBvZmZzZXQ7XG4gICAgaWYgKGNlPy5zb3VyY2UgPT09IGV4cGVjdGVkRW5kKVxuICAgICAgICBjZVBvcyA9IGNlLm9mZnNldCArIGNlLnNvdXJjZS5sZW5ndGg7XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBmY05hbWVbMF0udG9VcHBlckNhc2UoKSArIGZjTmFtZS5zdWJzdHJpbmcoMSk7XG4gICAgICAgIGNvbnN0IG1zZyA9IGF0Um9vdFxuICAgICAgICAgICAgPyBgJHtuYW1lfSBtdXN0IGVuZCB3aXRoIGEgJHtleHBlY3RlZEVuZH1gXG4gICAgICAgICAgICA6IGAke25hbWV9IGluIGJsb2NrIGNvbGxlY3Rpb24gbXVzdCBiZSBzdWZmaWNpZW50bHkgaW5kZW50ZWQgYW5kIGVuZCB3aXRoIGEgJHtleHBlY3RlZEVuZH1gO1xuICAgICAgICBvbkVycm9yKG9mZnNldCwgYXRSb290ID8gJ01JU1NJTkdfQ0hBUicgOiAnQkFEX0lOREVOVCcsIG1zZyk7XG4gICAgICAgIGlmIChjZSAmJiBjZS5zb3VyY2UubGVuZ3RoICE9PSAxKVxuICAgICAgICAgICAgZWUudW5zaGlmdChjZSk7XG4gICAgfVxuICAgIGlmIChlZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IHJlc29sdmVFbmQoZWUsIGNlUG9zLCBjdHgub3B0aW9ucy5zdHJpY3QsIG9uRXJyb3IpO1xuICAgICAgICBpZiAoZW5kLmNvbW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb2xsLmNvbW1lbnQpXG4gICAgICAgICAgICAgICAgY29sbC5jb21tZW50ICs9ICdcXG4nICsgZW5kLmNvbW1lbnQ7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY29sbC5jb21tZW50ID0gZW5kLmNvbW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgY29sbC5yYW5nZSA9IFtmYy5vZmZzZXQsIGNlUG9zLCBlbmQub2Zmc2V0XTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbGwucmFuZ2UgPSBbZmMub2Zmc2V0LCBjZVBvcywgY2VQb3NdO1xuICAgIH1cbiAgICByZXR1cm4gY29sbDtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZUZsb3dDb2xsZWN0aW9uIH07XG4iLCAiaW1wb3J0IHsgaXNOb2RlIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vbm9kZXMvU2NhbGFyLmpzJztcbmltcG9ydCB7IFlBTUxNYXAgfSBmcm9tICcuLi9ub2Rlcy9ZQU1MTWFwLmpzJztcbmltcG9ydCB7IFlBTUxTZXEgfSBmcm9tICcuLi9ub2Rlcy9ZQU1MU2VxLmpzJztcbmltcG9ydCB7IHJlc29sdmVCbG9ja01hcCB9IGZyb20gJy4vcmVzb2x2ZS1ibG9jay1tYXAuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUJsb2NrU2VxIH0gZnJvbSAnLi9yZXNvbHZlLWJsb2NrLXNlcS5qcyc7XG5pbXBvcnQgeyByZXNvbHZlRmxvd0NvbGxlY3Rpb24gfSBmcm9tICcuL3Jlc29sdmUtZmxvdy1jb2xsZWN0aW9uLmpzJztcblxuZnVuY3Rpb24gcmVzb2x2ZUNvbGxlY3Rpb24oQ04sIGN0eCwgdG9rZW4sIG9uRXJyb3IsIHRhZ05hbWUsIHRhZykge1xuICAgIGNvbnN0IGNvbGwgPSB0b2tlbi50eXBlID09PSAnYmxvY2stbWFwJ1xuICAgICAgICA/IHJlc29sdmVCbG9ja01hcChDTiwgY3R4LCB0b2tlbiwgb25FcnJvciwgdGFnKVxuICAgICAgICA6IHRva2VuLnR5cGUgPT09ICdibG9jay1zZXEnXG4gICAgICAgICAgICA/IHJlc29sdmVCbG9ja1NlcShDTiwgY3R4LCB0b2tlbiwgb25FcnJvciwgdGFnKVxuICAgICAgICAgICAgOiByZXNvbHZlRmxvd0NvbGxlY3Rpb24oQ04sIGN0eCwgdG9rZW4sIG9uRXJyb3IsIHRhZyk7XG4gICAgY29uc3QgQ29sbCA9IGNvbGwuY29uc3RydWN0b3I7XG4gICAgLy8gSWYgd2UgZ290IGEgdGFnTmFtZSBtYXRjaGluZyB0aGUgY2xhc3MsIG9yIHRoZSB0YWcgbmFtZSBpcyAnIScsXG4gICAgLy8gdGhlbiB1c2UgdGhlIHRhZ05hbWUgZnJvbSB0aGUgbm9kZSBjbGFzcyB1c2VkIHRvIGNyZWF0ZSBpdC5cbiAgICBpZiAodGFnTmFtZSA9PT0gJyEnIHx8IHRhZ05hbWUgPT09IENvbGwudGFnTmFtZSkge1xuICAgICAgICBjb2xsLnRhZyA9IENvbGwudGFnTmFtZTtcbiAgICAgICAgcmV0dXJuIGNvbGw7XG4gICAgfVxuICAgIGlmICh0YWdOYW1lKVxuICAgICAgICBjb2xsLnRhZyA9IHRhZ05hbWU7XG4gICAgcmV0dXJuIGNvbGw7XG59XG5mdW5jdGlvbiBjb21wb3NlQ29sbGVjdGlvbihDTiwgY3R4LCB0b2tlbiwgcHJvcHMsIG9uRXJyb3IpIHtcbiAgICBjb25zdCB0YWdUb2tlbiA9IHByb3BzLnRhZztcbiAgICBjb25zdCB0YWdOYW1lID0gIXRhZ1Rva2VuXG4gICAgICAgID8gbnVsbFxuICAgICAgICA6IGN0eC5kaXJlY3RpdmVzLnRhZ05hbWUodGFnVG9rZW4uc291cmNlLCBtc2cgPT4gb25FcnJvcih0YWdUb2tlbiwgJ1RBR19SRVNPTFZFX0ZBSUxFRCcsIG1zZykpO1xuICAgIGlmICh0b2tlbi50eXBlID09PSAnYmxvY2stc2VxJykge1xuICAgICAgICBjb25zdCB7IGFuY2hvciwgbmV3bGluZUFmdGVyUHJvcDogbmwgfSA9IHByb3BzO1xuICAgICAgICBjb25zdCBsYXN0UHJvcCA9IGFuY2hvciAmJiB0YWdUb2tlblxuICAgICAgICAgICAgPyBhbmNob3Iub2Zmc2V0ID4gdGFnVG9rZW4ub2Zmc2V0XG4gICAgICAgICAgICAgICAgPyBhbmNob3JcbiAgICAgICAgICAgICAgICA6IHRhZ1Rva2VuXG4gICAgICAgICAgICA6IChhbmNob3IgPz8gdGFnVG9rZW4pO1xuICAgICAgICBpZiAobGFzdFByb3AgJiYgKCFubCB8fCBubC5vZmZzZXQgPCBsYXN0UHJvcC5vZmZzZXQpKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJ01pc3NpbmcgbmV3bGluZSBhZnRlciBibG9jayBzZXF1ZW5jZSBwcm9wcyc7XG4gICAgICAgICAgICBvbkVycm9yKGxhc3RQcm9wLCAnTUlTU0lOR19DSEFSJywgbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgZXhwVHlwZSA9IHRva2VuLnR5cGUgPT09ICdibG9jay1tYXAnXG4gICAgICAgID8gJ21hcCdcbiAgICAgICAgOiB0b2tlbi50eXBlID09PSAnYmxvY2stc2VxJ1xuICAgICAgICAgICAgPyAnc2VxJ1xuICAgICAgICAgICAgOiB0b2tlbi5zdGFydC5zb3VyY2UgPT09ICd7J1xuICAgICAgICAgICAgICAgID8gJ21hcCdcbiAgICAgICAgICAgICAgICA6ICdzZXEnO1xuICAgIC8vIHNob3J0Y3V0OiBjaGVjayBpZiBpdCdzIGEgZ2VuZXJpYyBZQU1MTWFwIG9yIFlBTUxTZXFcbiAgICAvLyBiZWZvcmUganVtcGluZyBpbnRvIHRoZSBjdXN0b20gdGFnIGxvZ2ljLlxuICAgIGlmICghdGFnVG9rZW4gfHxcbiAgICAgICAgIXRhZ05hbWUgfHxcbiAgICAgICAgdGFnTmFtZSA9PT0gJyEnIHx8XG4gICAgICAgICh0YWdOYW1lID09PSBZQU1MTWFwLnRhZ05hbWUgJiYgZXhwVHlwZSA9PT0gJ21hcCcpIHx8XG4gICAgICAgICh0YWdOYW1lID09PSBZQU1MU2VxLnRhZ05hbWUgJiYgZXhwVHlwZSA9PT0gJ3NlcScpKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlQ29sbGVjdGlvbihDTiwgY3R4LCB0b2tlbiwgb25FcnJvciwgdGFnTmFtZSk7XG4gICAgfVxuICAgIGxldCB0YWcgPSBjdHguc2NoZW1hLnRhZ3MuZmluZCh0ID0+IHQudGFnID09PSB0YWdOYW1lICYmIHQuY29sbGVjdGlvbiA9PT0gZXhwVHlwZSk7XG4gICAgaWYgKCF0YWcpIHtcbiAgICAgICAgY29uc3Qga3QgPSBjdHguc2NoZW1hLmtub3duVGFnc1t0YWdOYW1lXTtcbiAgICAgICAgaWYgKGt0Py5jb2xsZWN0aW9uID09PSBleHBUeXBlKSB7XG4gICAgICAgICAgICBjdHguc2NoZW1hLnRhZ3MucHVzaChPYmplY3QuYXNzaWduKHt9LCBrdCwgeyBkZWZhdWx0OiBmYWxzZSB9KSk7XG4gICAgICAgICAgICB0YWcgPSBrdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChrdCkge1xuICAgICAgICAgICAgICAgIG9uRXJyb3IodGFnVG9rZW4sICdCQURfQ09MTEVDVElPTl9UWVBFJywgYCR7a3QudGFnfSB1c2VkIGZvciAke2V4cFR5cGV9IGNvbGxlY3Rpb24sIGJ1dCBleHBlY3RzICR7a3QuY29sbGVjdGlvbiA/PyAnc2NhbGFyJ31gLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9uRXJyb3IodGFnVG9rZW4sICdUQUdfUkVTT0xWRV9GQUlMRUQnLCBgVW5yZXNvbHZlZCB0YWc6ICR7dGFnTmFtZX1gLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlQ29sbGVjdGlvbihDTiwgY3R4LCB0b2tlbiwgb25FcnJvciwgdGFnTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgY29sbCA9IHJlc29sdmVDb2xsZWN0aW9uKENOLCBjdHgsIHRva2VuLCBvbkVycm9yLCB0YWdOYW1lLCB0YWcpO1xuICAgIGNvbnN0IHJlcyA9IHRhZy5yZXNvbHZlPy4oY29sbCwgbXNnID0+IG9uRXJyb3IodGFnVG9rZW4sICdUQUdfUkVTT0xWRV9GQUlMRUQnLCBtc2cpLCBjdHgub3B0aW9ucykgPz8gY29sbDtcbiAgICBjb25zdCBub2RlID0gaXNOb2RlKHJlcylcbiAgICAgICAgPyByZXNcbiAgICAgICAgOiBuZXcgU2NhbGFyKHJlcyk7XG4gICAgbm9kZS5yYW5nZSA9IGNvbGwucmFuZ2U7XG4gICAgbm9kZS50YWcgPSB0YWdOYW1lO1xuICAgIGlmICh0YWc/LmZvcm1hdClcbiAgICAgICAgbm9kZS5mb3JtYXQgPSB0YWcuZm9ybWF0O1xuICAgIHJldHVybiBub2RlO1xufVxuXG5leHBvcnQgeyBjb21wb3NlQ29sbGVjdGlvbiB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uL25vZGVzL1NjYWxhci5qcyc7XG5cbmZ1bmN0aW9uIHJlc29sdmVCbG9ja1NjYWxhcihjdHgsIHNjYWxhciwgb25FcnJvcikge1xuICAgIGNvbnN0IHN0YXJ0ID0gc2NhbGFyLm9mZnNldDtcbiAgICBjb25zdCBoZWFkZXIgPSBwYXJzZUJsb2NrU2NhbGFySGVhZGVyKHNjYWxhciwgY3R4Lm9wdGlvbnMuc3RyaWN0LCBvbkVycm9yKTtcbiAgICBpZiAoIWhlYWRlcilcbiAgICAgICAgcmV0dXJuIHsgdmFsdWU6ICcnLCB0eXBlOiBudWxsLCBjb21tZW50OiAnJywgcmFuZ2U6IFtzdGFydCwgc3RhcnQsIHN0YXJ0XSB9O1xuICAgIGNvbnN0IHR5cGUgPSBoZWFkZXIubW9kZSA9PT0gJz4nID8gU2NhbGFyLkJMT0NLX0ZPTERFRCA6IFNjYWxhci5CTE9DS19MSVRFUkFMO1xuICAgIGNvbnN0IGxpbmVzID0gc2NhbGFyLnNvdXJjZSA/IHNwbGl0TGluZXMoc2NhbGFyLnNvdXJjZSkgOiBbXTtcbiAgICAvLyBkZXRlcm1pbmUgdGhlIGVuZCBvZiBjb250ZW50ICYgc3RhcnQgb2YgY2hvbXBpbmdcbiAgICBsZXQgY2hvbXBTdGFydCA9IGxpbmVzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gbGluZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IGxpbmVzW2ldWzFdO1xuICAgICAgICBpZiAoY29udGVudCA9PT0gJycgfHwgY29udGVudCA9PT0gJ1xccicpXG4gICAgICAgICAgICBjaG9tcFN0YXJ0ID0gaTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIHNob3J0Y3V0IGZvciBlbXB0eSBjb250ZW50c1xuICAgIGlmIChjaG9tcFN0YXJ0ID09PSAwKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaGVhZGVyLmNob21wID09PSAnKycgJiYgbGluZXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgPyAnXFxuJy5yZXBlYXQoTWF0aC5tYXgoMSwgbGluZXMubGVuZ3RoIC0gMSkpXG4gICAgICAgICAgICA6ICcnO1xuICAgICAgICBsZXQgZW5kID0gc3RhcnQgKyBoZWFkZXIubGVuZ3RoO1xuICAgICAgICBpZiAoc2NhbGFyLnNvdXJjZSlcbiAgICAgICAgICAgIGVuZCArPSBzY2FsYXIuc291cmNlLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHsgdmFsdWUsIHR5cGUsIGNvbW1lbnQ6IGhlYWRlci5jb21tZW50LCByYW5nZTogW3N0YXJ0LCBlbmQsIGVuZF0gfTtcbiAgICB9XG4gICAgLy8gZmluZCB0aGUgaW5kZW50YXRpb24gbGV2ZWwgdG8gdHJpbSBmcm9tIHN0YXJ0XG4gICAgbGV0IHRyaW1JbmRlbnQgPSBzY2FsYXIuaW5kZW50ICsgaGVhZGVyLmluZGVudDtcbiAgICBsZXQgb2Zmc2V0ID0gc2NhbGFyLm9mZnNldCArIGhlYWRlci5sZW5ndGg7XG4gICAgbGV0IGNvbnRlbnRTdGFydCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaG9tcFN0YXJ0OyArK2kpIHtcbiAgICAgICAgY29uc3QgW2luZGVudCwgY29udGVudF0gPSBsaW5lc1tpXTtcbiAgICAgICAgaWYgKGNvbnRlbnQgPT09ICcnIHx8IGNvbnRlbnQgPT09ICdcXHInKSB7XG4gICAgICAgICAgICBpZiAoaGVhZGVyLmluZGVudCA9PT0gMCAmJiBpbmRlbnQubGVuZ3RoID4gdHJpbUluZGVudClcbiAgICAgICAgICAgICAgICB0cmltSW5kZW50ID0gaW5kZW50Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpbmRlbnQubGVuZ3RoIDwgdHJpbUluZGVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnQmxvY2sgc2NhbGFycyB3aXRoIG1vcmUtaW5kZW50ZWQgbGVhZGluZyBlbXB0eSBsaW5lcyBtdXN0IHVzZSBhbiBleHBsaWNpdCBpbmRlbnRhdGlvbiBpbmRpY2F0b3InO1xuICAgICAgICAgICAgICAgIG9uRXJyb3Iob2Zmc2V0ICsgaW5kZW50Lmxlbmd0aCwgJ01JU1NJTkdfQ0hBUicsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhlYWRlci5pbmRlbnQgPT09IDApXG4gICAgICAgICAgICAgICAgdHJpbUluZGVudCA9IGluZGVudC5sZW5ndGg7XG4gICAgICAgICAgICBjb250ZW50U3RhcnQgPSBpO1xuICAgICAgICAgICAgaWYgKHRyaW1JbmRlbnQgPT09IDAgJiYgIWN0eC5hdFJvb3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJ0Jsb2NrIHNjYWxhciB2YWx1ZXMgaW4gY29sbGVjdGlvbnMgbXVzdCBiZSBpbmRlbnRlZCc7XG4gICAgICAgICAgICAgICAgb25FcnJvcihvZmZzZXQsICdCQURfSU5ERU5UJywgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBvZmZzZXQgKz0gaW5kZW50Lmxlbmd0aCArIGNvbnRlbnQubGVuZ3RoICsgMTtcbiAgICB9XG4gICAgLy8gaW5jbHVkZSB0cmFpbGluZyBtb3JlLWluZGVudGVkIGVtcHR5IGxpbmVzIGluIGNvbnRlbnRcbiAgICBmb3IgKGxldCBpID0gbGluZXMubGVuZ3RoIC0gMTsgaSA+PSBjaG9tcFN0YXJ0OyAtLWkpIHtcbiAgICAgICAgaWYgKGxpbmVzW2ldWzBdLmxlbmd0aCA+IHRyaW1JbmRlbnQpXG4gICAgICAgICAgICBjaG9tcFN0YXJ0ID0gaSArIDE7XG4gICAgfVxuICAgIGxldCB2YWx1ZSA9ICcnO1xuICAgIGxldCBzZXAgPSAnJztcbiAgICBsZXQgcHJldk1vcmVJbmRlbnRlZCA9IGZhbHNlO1xuICAgIC8vIGxlYWRpbmcgd2hpdGVzcGFjZSBpcyBrZXB0IGludGFjdFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udGVudFN0YXJ0OyArK2kpXG4gICAgICAgIHZhbHVlICs9IGxpbmVzW2ldWzBdLnNsaWNlKHRyaW1JbmRlbnQpICsgJ1xcbic7XG4gICAgZm9yIChsZXQgaSA9IGNvbnRlbnRTdGFydDsgaSA8IGNob21wU3RhcnQ7ICsraSkge1xuICAgICAgICBsZXQgW2luZGVudCwgY29udGVudF0gPSBsaW5lc1tpXTtcbiAgICAgICAgb2Zmc2V0ICs9IGluZGVudC5sZW5ndGggKyBjb250ZW50Lmxlbmd0aCArIDE7XG4gICAgICAgIGNvbnN0IGNybGYgPSBjb250ZW50W2NvbnRlbnQubGVuZ3RoIC0gMV0gPT09ICdcXHInO1xuICAgICAgICBpZiAoY3JsZilcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmIGFscmVhZHkgY2F1Z2h0IGluIGxleGVyICovXG4gICAgICAgIGlmIChjb250ZW50ICYmIGluZGVudC5sZW5ndGggPCB0cmltSW5kZW50KSB7XG4gICAgICAgICAgICBjb25zdCBzcmMgPSBoZWFkZXIuaW5kZW50XG4gICAgICAgICAgICAgICAgPyAnZXhwbGljaXQgaW5kZW50YXRpb24gaW5kaWNhdG9yJ1xuICAgICAgICAgICAgICAgIDogJ2ZpcnN0IGxpbmUnO1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGBCbG9jayBzY2FsYXIgbGluZXMgbXVzdCBub3QgYmUgbGVzcyBpbmRlbnRlZCB0aGFuIHRoZWlyICR7c3JjfWA7XG4gICAgICAgICAgICBvbkVycm9yKG9mZnNldCAtIGNvbnRlbnQubGVuZ3RoIC0gKGNybGYgPyAyIDogMSksICdCQURfSU5ERU5UJywgbWVzc2FnZSk7XG4gICAgICAgICAgICBpbmRlbnQgPSAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PT0gU2NhbGFyLkJMT0NLX0xJVEVSQUwpIHtcbiAgICAgICAgICAgIHZhbHVlICs9IHNlcCArIGluZGVudC5zbGljZSh0cmltSW5kZW50KSArIGNvbnRlbnQ7XG4gICAgICAgICAgICBzZXAgPSAnXFxuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbmRlbnQubGVuZ3RoID4gdHJpbUluZGVudCB8fCBjb250ZW50WzBdID09PSAnXFx0Jykge1xuICAgICAgICAgICAgLy8gbW9yZS1pbmRlbnRlZCBjb250ZW50IHdpdGhpbiBhIGZvbGRlZCBibG9ja1xuICAgICAgICAgICAgaWYgKHNlcCA9PT0gJyAnKVxuICAgICAgICAgICAgICAgIHNlcCA9ICdcXG4nO1xuICAgICAgICAgICAgZWxzZSBpZiAoIXByZXZNb3JlSW5kZW50ZWQgJiYgc2VwID09PSAnXFxuJylcbiAgICAgICAgICAgICAgICBzZXAgPSAnXFxuXFxuJztcbiAgICAgICAgICAgIHZhbHVlICs9IHNlcCArIGluZGVudC5zbGljZSh0cmltSW5kZW50KSArIGNvbnRlbnQ7XG4gICAgICAgICAgICBzZXAgPSAnXFxuJztcbiAgICAgICAgICAgIHByZXZNb3JlSW5kZW50ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbnRlbnQgPT09ICcnKSB7XG4gICAgICAgICAgICAvLyBlbXB0eSBsaW5lXG4gICAgICAgICAgICBpZiAoc2VwID09PSAnXFxuJylcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSAnXFxuJztcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzZXAgPSAnXFxuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlICs9IHNlcCArIGNvbnRlbnQ7XG4gICAgICAgICAgICBzZXAgPSAnICc7XG4gICAgICAgICAgICBwcmV2TW9yZUluZGVudGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3dpdGNoIChoZWFkZXIuY2hvbXApIHtcbiAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gY2hvbXBTdGFydDsgaSA8IGxpbmVzLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgIHZhbHVlICs9ICdcXG4nICsgbGluZXNbaV1bMF0uc2xpY2UodHJpbUluZGVudCk7XG4gICAgICAgICAgICBpZiAodmFsdWVbdmFsdWUubGVuZ3RoIC0gMV0gIT09ICdcXG4nKVxuICAgICAgICAgICAgICAgIHZhbHVlICs9ICdcXG4nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YWx1ZSArPSAnXFxuJztcbiAgICB9XG4gICAgY29uc3QgZW5kID0gc3RhcnQgKyBoZWFkZXIubGVuZ3RoICsgc2NhbGFyLnNvdXJjZS5sZW5ndGg7XG4gICAgcmV0dXJuIHsgdmFsdWUsIHR5cGUsIGNvbW1lbnQ6IGhlYWRlci5jb21tZW50LCByYW5nZTogW3N0YXJ0LCBlbmQsIGVuZF0gfTtcbn1cbmZ1bmN0aW9uIHBhcnNlQmxvY2tTY2FsYXJIZWFkZXIoeyBvZmZzZXQsIHByb3BzIH0sIHN0cmljdCwgb25FcnJvcikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgIGlmIChwcm9wc1swXS50eXBlICE9PSAnYmxvY2stc2NhbGFyLWhlYWRlcicpIHtcbiAgICAgICAgb25FcnJvcihwcm9wc1swXSwgJ0lNUE9TU0lCTEUnLCAnQmxvY2sgc2NhbGFyIGhlYWRlciBub3QgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHsgc291cmNlIH0gPSBwcm9wc1swXTtcbiAgICBjb25zdCBtb2RlID0gc291cmNlWzBdO1xuICAgIGxldCBpbmRlbnQgPSAwO1xuICAgIGxldCBjaG9tcCA9ICcnO1xuICAgIGxldCBlcnJvciA9IC0xO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc291cmNlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGNoID0gc291cmNlW2ldO1xuICAgICAgICBpZiAoIWNob21wICYmIChjaCA9PT0gJy0nIHx8IGNoID09PSAnKycpKVxuICAgICAgICAgICAgY2hvbXAgPSBjaDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBuID0gTnVtYmVyKGNoKTtcbiAgICAgICAgICAgIGlmICghaW5kZW50ICYmIG4pXG4gICAgICAgICAgICAgICAgaW5kZW50ID0gbjtcbiAgICAgICAgICAgIGVsc2UgaWYgKGVycm9yID09PSAtMSlcbiAgICAgICAgICAgICAgICBlcnJvciA9IG9mZnNldCArIGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVycm9yICE9PSAtMSlcbiAgICAgICAgb25FcnJvcihlcnJvciwgJ1VORVhQRUNURURfVE9LRU4nLCBgQmxvY2sgc2NhbGFyIGhlYWRlciBpbmNsdWRlcyBleHRyYSBjaGFyYWN0ZXJzOiAke3NvdXJjZX1gKTtcbiAgICBsZXQgaGFzU3BhY2UgPSBmYWxzZTtcbiAgICBsZXQgY29tbWVudCA9ICcnO1xuICAgIGxldCBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcHJvcHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSBwcm9wc1tpXTtcbiAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICAgICAgaGFzU3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgLy8gZmFsbHRocm91Z2hcbiAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIGxlbmd0aCArPSB0b2tlbi5zb3VyY2UubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICAgICAgaWYgKHN0cmljdCAmJiAhaGFzU3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdDb21tZW50cyBtdXN0IGJlIHNlcGFyYXRlZCBmcm9tIG90aGVyIHRva2VucyBieSB3aGl0ZSBzcGFjZSBjaGFyYWN0ZXJzJztcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ01JU1NJTkdfQ0hBUicsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZW5ndGggKz0gdG9rZW4uc291cmNlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb21tZW50ID0gdG9rZW4uc291cmNlLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnVU5FWFBFQ1RFRF9UT0tFTicsIHRva2VuLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIGxlbmd0aCArPSB0b2tlbi5zb3VyY2UubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgc2hvdWxkIG5vdCBoYXBwZW4gKi9cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYFVuZXhwZWN0ZWQgdG9rZW4gaW4gYmxvY2sgc2NhbGFyIGhlYWRlcjogJHt0b2tlbi50eXBlfWA7XG4gICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ1VORVhQRUNURURfVE9LRU4nLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0cyA9IHRva2VuLnNvdXJjZTtcbiAgICAgICAgICAgICAgICBpZiAodHMgJiYgdHlwZW9mIHRzID09PSAnc3RyaW5nJylcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoICs9IHRzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBtb2RlLCBpbmRlbnQsIGNob21wLCBjb21tZW50LCBsZW5ndGggfTtcbn1cbi8qKiBAcmV0dXJucyBBcnJheSBvZiBsaW5lcyBzcGxpdCB1cCBhcyBgW2luZGVudCwgY29udGVudF1gICovXG5mdW5jdGlvbiBzcGxpdExpbmVzKHNvdXJjZSkge1xuICAgIGNvbnN0IHNwbGl0ID0gc291cmNlLnNwbGl0KC9cXG4oICopLyk7XG4gICAgY29uc3QgZmlyc3QgPSBzcGxpdFswXTtcbiAgICBjb25zdCBtID0gZmlyc3QubWF0Y2goL14oICopLyk7XG4gICAgY29uc3QgbGluZTAgPSBtPy5bMV1cbiAgICAgICAgPyBbbVsxXSwgZmlyc3Quc2xpY2UobVsxXS5sZW5ndGgpXVxuICAgICAgICA6IFsnJywgZmlyc3RdO1xuICAgIGNvbnN0IGxpbmVzID0gW2xpbmUwXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNwbGl0Lmxlbmd0aDsgaSArPSAyKVxuICAgICAgICBsaW5lcy5wdXNoKFtzcGxpdFtpXSwgc3BsaXRbaSArIDFdXSk7XG4gICAgcmV0dXJuIGxpbmVzO1xufVxuXG5leHBvcnQgeyByZXNvbHZlQmxvY2tTY2FsYXIgfTtcbiIsICJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi9ub2Rlcy9TY2FsYXIuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUVuZCB9IGZyb20gJy4vcmVzb2x2ZS1lbmQuanMnO1xuXG5mdW5jdGlvbiByZXNvbHZlRmxvd1NjYWxhcihzY2FsYXIsIHN0cmljdCwgb25FcnJvcikge1xuICAgIGNvbnN0IHsgb2Zmc2V0LCB0eXBlLCBzb3VyY2UsIGVuZCB9ID0gc2NhbGFyO1xuICAgIGxldCBfdHlwZTtcbiAgICBsZXQgdmFsdWU7XG4gICAgY29uc3QgX29uRXJyb3IgPSAocmVsLCBjb2RlLCBtc2cpID0+IG9uRXJyb3Iob2Zmc2V0ICsgcmVsLCBjb2RlLCBtc2cpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICAgICAgX3R5cGUgPSBTY2FsYXIuUExBSU47XG4gICAgICAgICAgICB2YWx1ZSA9IHBsYWluVmFsdWUoc291cmNlLCBfb25FcnJvcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc2luZ2xlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICAgICAgX3R5cGUgPSBTY2FsYXIuUVVPVEVfU0lOR0xFO1xuICAgICAgICAgICAgdmFsdWUgPSBzaW5nbGVRdW90ZWRWYWx1ZShzb3VyY2UsIF9vbkVycm9yKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkb3VibGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICBfdHlwZSA9IFNjYWxhci5RVU9URV9ET1VCTEU7XG4gICAgICAgICAgICB2YWx1ZSA9IGRvdWJsZVF1b3RlZFZhbHVlKHNvdXJjZSwgX29uRXJyb3IpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBvbkVycm9yKHNjYWxhciwgJ1VORVhQRUNURURfVE9LRU4nLCBgRXhwZWN0ZWQgYSBmbG93IHNjYWxhciB2YWx1ZSwgYnV0IGZvdW5kOiAke3R5cGV9YCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6ICcnLFxuICAgICAgICAgICAgICAgIHJhbmdlOiBbb2Zmc2V0LCBvZmZzZXQgKyBzb3VyY2UubGVuZ3RoLCBvZmZzZXQgKyBzb3VyY2UubGVuZ3RoXVxuICAgICAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgdmFsdWVFbmQgPSBvZmZzZXQgKyBzb3VyY2UubGVuZ3RoO1xuICAgIGNvbnN0IHJlID0gcmVzb2x2ZUVuZChlbmQsIHZhbHVlRW5kLCBzdHJpY3QsIG9uRXJyb3IpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICB0eXBlOiBfdHlwZSxcbiAgICAgICAgY29tbWVudDogcmUuY29tbWVudCxcbiAgICAgICAgcmFuZ2U6IFtvZmZzZXQsIHZhbHVlRW5kLCByZS5vZmZzZXRdXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHBsYWluVmFsdWUoc291cmNlLCBvbkVycm9yKSB7XG4gICAgbGV0IGJhZENoYXIgPSAnJztcbiAgICBzd2l0Y2ggKHNvdXJjZVswXSkge1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgICAgICBjYXNlICdcXHQnOlxuICAgICAgICAgICAgYmFkQ2hhciA9ICdhIHRhYiBjaGFyYWN0ZXInO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJywnOlxuICAgICAgICAgICAgYmFkQ2hhciA9ICdmbG93IGluZGljYXRvciBjaGFyYWN0ZXIgLCc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnJSc6XG4gICAgICAgICAgICBiYWRDaGFyID0gJ2RpcmVjdGl2ZSBpbmRpY2F0b3IgY2hhcmFjdGVyICUnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICBjYXNlICc+Jzoge1xuICAgICAgICAgICAgYmFkQ2hhciA9IGBibG9jayBzY2FsYXIgaW5kaWNhdG9yICR7c291cmNlWzBdfWA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdAJzpcbiAgICAgICAgY2FzZSAnYCc6IHtcbiAgICAgICAgICAgIGJhZENoYXIgPSBgcmVzZXJ2ZWQgY2hhcmFjdGVyICR7c291cmNlWzBdfWA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoYmFkQ2hhcilcbiAgICAgICAgb25FcnJvcigwLCAnQkFEX1NDQUxBUl9TVEFSVCcsIGBQbGFpbiB2YWx1ZSBjYW5ub3Qgc3RhcnQgd2l0aCAke2JhZENoYXJ9YCk7XG4gICAgcmV0dXJuIGZvbGRMaW5lcyhzb3VyY2UpO1xufVxuZnVuY3Rpb24gc2luZ2xlUXVvdGVkVmFsdWUoc291cmNlLCBvbkVycm9yKSB7XG4gICAgaWYgKHNvdXJjZVtzb3VyY2UubGVuZ3RoIC0gMV0gIT09IFwiJ1wiIHx8IHNvdXJjZS5sZW5ndGggPT09IDEpXG4gICAgICAgIG9uRXJyb3Ioc291cmNlLmxlbmd0aCwgJ01JU1NJTkdfQ0hBUicsIFwiTWlzc2luZyBjbG9zaW5nICdxdW90ZVwiKTtcbiAgICByZXR1cm4gZm9sZExpbmVzKHNvdXJjZS5zbGljZSgxLCAtMSkpLnJlcGxhY2UoLycnL2csIFwiJ1wiKTtcbn1cbmZ1bmN0aW9uIGZvbGRMaW5lcyhzb3VyY2UpIHtcbiAgICAvKipcbiAgICAgKiBUaGUgbmVnYXRpdmUgbG9va2JlaGluZCBoZXJlIGFuZCBpbiB0aGUgYHJlYCBSZWdFeHAgaXMgdG9cbiAgICAgKiBwcmV2ZW50IGNhdXNpbmcgYSBwb2x5bm9taWFsIHNlYXJjaCB0aW1lIGluIGNlcnRhaW4gY2FzZXMuXG4gICAgICpcbiAgICAgKiBUaGUgdHJ5LWNhdGNoIGlzIGZvciBTYWZhcmksIHdoaWNoIGRvZXNuJ3Qgc3VwcG9ydCB0aGlzIHlldDpcbiAgICAgKiBodHRwczovL2Nhbml1c2UuY29tL2pzLXJlZ2V4cC1sb29rYmVoaW5kXG4gICAgICovXG4gICAgbGV0IGZpcnN0LCBsaW5lO1xuICAgIHRyeSB7XG4gICAgICAgIGZpcnN0ID0gbmV3IFJlZ0V4cCgnKC4qPykoPzwhWyBcXHRdKVsgXFx0XSpcXHI/XFxuJywgJ3N5Jyk7XG4gICAgICAgIGxpbmUgPSBuZXcgUmVnRXhwKCdbIFxcdF0qKC4qPykoPzooPzwhWyBcXHRdKVsgXFx0XSopP1xccj9cXG4nLCAnc3knKTtcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICBmaXJzdCA9IC8oLio/KVsgXFx0XSpcXHI/XFxuL3N5O1xuICAgICAgICBsaW5lID0gL1sgXFx0XSooLio/KVsgXFx0XSpcXHI/XFxuL3N5O1xuICAgIH1cbiAgICBsZXQgbWF0Y2ggPSBmaXJzdC5leGVjKHNvdXJjZSk7XG4gICAgaWYgKCFtYXRjaClcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICBsZXQgcmVzID0gbWF0Y2hbMV07XG4gICAgbGV0IHNlcCA9ICcgJztcbiAgICBsZXQgcG9zID0gZmlyc3QubGFzdEluZGV4O1xuICAgIGxpbmUubGFzdEluZGV4ID0gcG9zO1xuICAgIHdoaWxlICgobWF0Y2ggPSBsaW5lLmV4ZWMoc291cmNlKSkpIHtcbiAgICAgICAgaWYgKG1hdGNoWzFdID09PSAnJykge1xuICAgICAgICAgICAgaWYgKHNlcCA9PT0gJ1xcbicpXG4gICAgICAgICAgICAgICAgcmVzICs9IHNlcDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzZXAgPSAnXFxuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcyArPSBzZXAgKyBtYXRjaFsxXTtcbiAgICAgICAgICAgIHNlcCA9ICcgJztcbiAgICAgICAgfVxuICAgICAgICBwb3MgPSBsaW5lLmxhc3RJbmRleDtcbiAgICB9XG4gICAgY29uc3QgbGFzdCA9IC9bIFxcdF0qKC4qKS9zeTtcbiAgICBsYXN0Lmxhc3RJbmRleCA9IHBvcztcbiAgICBtYXRjaCA9IGxhc3QuZXhlYyhzb3VyY2UpO1xuICAgIHJldHVybiByZXMgKyBzZXAgKyAobWF0Y2g/LlsxXSA/PyAnJyk7XG59XG5mdW5jdGlvbiBkb3VibGVRdW90ZWRWYWx1ZShzb3VyY2UsIG9uRXJyb3IpIHtcbiAgICBsZXQgcmVzID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzb3VyY2UubGVuZ3RoIC0gMTsgKytpKSB7XG4gICAgICAgIGNvbnN0IGNoID0gc291cmNlW2ldO1xuICAgICAgICBpZiAoY2ggPT09ICdcXHInICYmIHNvdXJjZVtpICsgMV0gPT09ICdcXG4nKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIGlmIChjaCA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgZm9sZCwgb2Zmc2V0IH0gPSBmb2xkTmV3bGluZShzb3VyY2UsIGkpO1xuICAgICAgICAgICAgcmVzICs9IGZvbGQ7XG4gICAgICAgICAgICBpID0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNoID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgIGxldCBuZXh0ID0gc291cmNlWysraV07XG4gICAgICAgICAgICBjb25zdCBjYyA9IGVzY2FwZUNvZGVzW25leHRdO1xuICAgICAgICAgICAgaWYgKGNjKVxuICAgICAgICAgICAgICAgIHJlcyArPSBjYztcbiAgICAgICAgICAgIGVsc2UgaWYgKG5leHQgPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgLy8gc2tpcCBlc2NhcGVkIG5ld2xpbmVzLCBidXQgc3RpbGwgdHJpbSB0aGUgZm9sbG93aW5nIGxpbmVcbiAgICAgICAgICAgICAgICBuZXh0ID0gc291cmNlW2kgKyAxXTtcbiAgICAgICAgICAgICAgICB3aGlsZSAobmV4dCA9PT0gJyAnIHx8IG5leHQgPT09ICdcXHQnKVxuICAgICAgICAgICAgICAgICAgICBuZXh0ID0gc291cmNlWysraSArIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobmV4dCA9PT0gJ1xccicgJiYgc291cmNlW2kgKyAxXSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAvLyBza2lwIGVzY2FwZWQgQ1JMRiBuZXdsaW5lcywgYnV0IHN0aWxsIHRyaW0gdGhlIGZvbGxvd2luZyBsaW5lXG4gICAgICAgICAgICAgICAgbmV4dCA9IHNvdXJjZVsrK2kgKyAxXTtcbiAgICAgICAgICAgICAgICB3aGlsZSAobmV4dCA9PT0gJyAnIHx8IG5leHQgPT09ICdcXHQnKVxuICAgICAgICAgICAgICAgICAgICBuZXh0ID0gc291cmNlWysraSArIDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobmV4dCA9PT0gJ3gnIHx8IG5leHQgPT09ICd1JyB8fCBuZXh0ID09PSAnVScpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsZW5ndGggPSB7IHg6IDIsIHU6IDQsIFU6IDggfVtuZXh0XTtcbiAgICAgICAgICAgICAgICByZXMgKz0gcGFyc2VDaGFyQ29kZShzb3VyY2UsIGkgKyAxLCBsZW5ndGgsIG9uRXJyb3IpO1xuICAgICAgICAgICAgICAgIGkgKz0gbGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmF3ID0gc291cmNlLnN1YnN0cihpIC0gMSwgMik7XG4gICAgICAgICAgICAgICAgb25FcnJvcihpIC0gMSwgJ0JBRF9EUV9FU0NBUEUnLCBgSW52YWxpZCBlc2NhcGUgc2VxdWVuY2UgJHtyYXd9YCk7XG4gICAgICAgICAgICAgICAgcmVzICs9IHJhdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gJyAnIHx8IGNoID09PSAnXFx0Jykge1xuICAgICAgICAgICAgLy8gdHJpbSB0cmFpbGluZyB3aGl0ZXNwYWNlXG4gICAgICAgICAgICBjb25zdCB3c1N0YXJ0ID0gaTtcbiAgICAgICAgICAgIGxldCBuZXh0ID0gc291cmNlW2kgKyAxXTtcbiAgICAgICAgICAgIHdoaWxlIChuZXh0ID09PSAnICcgfHwgbmV4dCA9PT0gJ1xcdCcpXG4gICAgICAgICAgICAgICAgbmV4dCA9IHNvdXJjZVsrK2kgKyAxXTtcbiAgICAgICAgICAgIGlmIChuZXh0ICE9PSAnXFxuJyAmJiAhKG5leHQgPT09ICdcXHInICYmIHNvdXJjZVtpICsgMl0gPT09ICdcXG4nKSlcbiAgICAgICAgICAgICAgICByZXMgKz0gaSA+IHdzU3RhcnQgPyBzb3VyY2Uuc2xpY2Uod3NTdGFydCwgaSArIDEpIDogY2g7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXMgKz0gY2g7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNvdXJjZVtzb3VyY2UubGVuZ3RoIC0gMV0gIT09ICdcIicgfHwgc291cmNlLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgb25FcnJvcihzb3VyY2UubGVuZ3RoLCAnTUlTU0lOR19DSEFSJywgJ01pc3NpbmcgY2xvc2luZyBcInF1b3RlJyk7XG4gICAgcmV0dXJuIHJlcztcbn1cbi8qKlxuICogRm9sZCBhIHNpbmdsZSBuZXdsaW5lIGludG8gYSBzcGFjZSwgbXVsdGlwbGUgbmV3bGluZXMgdG8gTiAtIDEgbmV3bGluZXMuXG4gKiBQcmVzdW1lcyBgc291cmNlW29mZnNldF0gPT09ICdcXG4nYFxuICovXG5mdW5jdGlvbiBmb2xkTmV3bGluZShzb3VyY2UsIG9mZnNldCkge1xuICAgIGxldCBmb2xkID0gJyc7XG4gICAgbGV0IGNoID0gc291cmNlW29mZnNldCArIDFdO1xuICAgIHdoaWxlIChjaCA9PT0gJyAnIHx8IGNoID09PSAnXFx0JyB8fCBjaCA9PT0gJ1xcbicgfHwgY2ggPT09ICdcXHInKSB7XG4gICAgICAgIGlmIChjaCA9PT0gJ1xccicgJiYgc291cmNlW29mZnNldCArIDJdICE9PSAnXFxuJylcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBpZiAoY2ggPT09ICdcXG4nKVxuICAgICAgICAgICAgZm9sZCArPSAnXFxuJztcbiAgICAgICAgb2Zmc2V0ICs9IDE7XG4gICAgICAgIGNoID0gc291cmNlW29mZnNldCArIDFdO1xuICAgIH1cbiAgICBpZiAoIWZvbGQpXG4gICAgICAgIGZvbGQgPSAnICc7XG4gICAgcmV0dXJuIHsgZm9sZCwgb2Zmc2V0IH07XG59XG5jb25zdCBlc2NhcGVDb2RlcyA9IHtcbiAgICAnMCc6ICdcXDAnLCAvLyBudWxsIGNoYXJhY3RlclxuICAgIGE6ICdcXHgwNycsIC8vIGJlbGwgY2hhcmFjdGVyXG4gICAgYjogJ1xcYicsIC8vIGJhY2tzcGFjZVxuICAgIGU6ICdcXHgxYicsIC8vIGVzY2FwZSBjaGFyYWN0ZXJcbiAgICBmOiAnXFxmJywgLy8gZm9ybSBmZWVkXG4gICAgbjogJ1xcbicsIC8vIGxpbmUgZmVlZFxuICAgIHI6ICdcXHInLCAvLyBjYXJyaWFnZSByZXR1cm5cbiAgICB0OiAnXFx0JywgLy8gaG9yaXpvbnRhbCB0YWJcbiAgICB2OiAnXFx2JywgLy8gdmVydGljYWwgdGFiXG4gICAgTjogJ1xcdTAwODUnLCAvLyBVbmljb2RlIG5leHQgbGluZVxuICAgIF86ICdcXHUwMGEwJywgLy8gVW5pY29kZSBub24tYnJlYWtpbmcgc3BhY2VcbiAgICBMOiAnXFx1MjAyOCcsIC8vIFVuaWNvZGUgbGluZSBzZXBhcmF0b3JcbiAgICBQOiAnXFx1MjAyOScsIC8vIFVuaWNvZGUgcGFyYWdyYXBoIHNlcGFyYXRvclxuICAgICcgJzogJyAnLFxuICAgICdcIic6ICdcIicsXG4gICAgJy8nOiAnLycsXG4gICAgJ1xcXFwnOiAnXFxcXCcsXG4gICAgJ1xcdCc6ICdcXHQnXG59O1xuZnVuY3Rpb24gcGFyc2VDaGFyQ29kZShzb3VyY2UsIG9mZnNldCwgbGVuZ3RoLCBvbkVycm9yKSB7XG4gICAgY29uc3QgY2MgPSBzb3VyY2Uuc3Vic3RyKG9mZnNldCwgbGVuZ3RoKTtcbiAgICBjb25zdCBvayA9IGNjLmxlbmd0aCA9PT0gbGVuZ3RoICYmIC9eWzAtOWEtZkEtRl0rJC8udGVzdChjYyk7XG4gICAgY29uc3QgY29kZSA9IG9rID8gcGFyc2VJbnQoY2MsIDE2KSA6IE5hTjtcbiAgICBpZiAoaXNOYU4oY29kZSkpIHtcbiAgICAgICAgY29uc3QgcmF3ID0gc291cmNlLnN1YnN0cihvZmZzZXQgLSAyLCBsZW5ndGggKyAyKTtcbiAgICAgICAgb25FcnJvcihvZmZzZXQgLSAyLCAnQkFEX0RRX0VTQ0FQRScsIGBJbnZhbGlkIGVzY2FwZSBzZXF1ZW5jZSAke3Jhd31gKTtcbiAgICAgICAgcmV0dXJuIHJhdztcbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ29kZVBvaW50KGNvZGUpO1xufVxuXG5leHBvcnQgeyByZXNvbHZlRmxvd1NjYWxhciB9O1xuIiwgImltcG9ydCB7IGlzU2NhbGFyLCBTQ0FMQVIgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi9ub2Rlcy9TY2FsYXIuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUJsb2NrU2NhbGFyIH0gZnJvbSAnLi9yZXNvbHZlLWJsb2NrLXNjYWxhci5qcyc7XG5pbXBvcnQgeyByZXNvbHZlRmxvd1NjYWxhciB9IGZyb20gJy4vcmVzb2x2ZS1mbG93LXNjYWxhci5qcyc7XG5cbmZ1bmN0aW9uIGNvbXBvc2VTY2FsYXIoY3R4LCB0b2tlbiwgdGFnVG9rZW4sIG9uRXJyb3IpIHtcbiAgICBjb25zdCB7IHZhbHVlLCB0eXBlLCBjb21tZW50LCByYW5nZSB9ID0gdG9rZW4udHlwZSA9PT0gJ2Jsb2NrLXNjYWxhcidcbiAgICAgICAgPyByZXNvbHZlQmxvY2tTY2FsYXIoY3R4LCB0b2tlbiwgb25FcnJvcilcbiAgICAgICAgOiByZXNvbHZlRmxvd1NjYWxhcih0b2tlbiwgY3R4Lm9wdGlvbnMuc3RyaWN0LCBvbkVycm9yKTtcbiAgICBjb25zdCB0YWdOYW1lID0gdGFnVG9rZW5cbiAgICAgICAgPyBjdHguZGlyZWN0aXZlcy50YWdOYW1lKHRhZ1Rva2VuLnNvdXJjZSwgbXNnID0+IG9uRXJyb3IodGFnVG9rZW4sICdUQUdfUkVTT0xWRV9GQUlMRUQnLCBtc2cpKVxuICAgICAgICA6IG51bGw7XG4gICAgbGV0IHRhZztcbiAgICBpZiAoY3R4Lm9wdGlvbnMuc3RyaW5nS2V5cyAmJiBjdHguYXRLZXkpIHtcbiAgICAgICAgdGFnID0gY3R4LnNjaGVtYVtTQ0FMQVJdO1xuICAgIH1cbiAgICBlbHNlIGlmICh0YWdOYW1lKVxuICAgICAgICB0YWcgPSBmaW5kU2NhbGFyVGFnQnlOYW1lKGN0eC5zY2hlbWEsIHZhbHVlLCB0YWdOYW1lLCB0YWdUb2tlbiwgb25FcnJvcik7XG4gICAgZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gJ3NjYWxhcicpXG4gICAgICAgIHRhZyA9IGZpbmRTY2FsYXJUYWdCeVRlc3QoY3R4LCB2YWx1ZSwgdG9rZW4sIG9uRXJyb3IpO1xuICAgIGVsc2VcbiAgICAgICAgdGFnID0gY3R4LnNjaGVtYVtTQ0FMQVJdO1xuICAgIGxldCBzY2FsYXI7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzID0gdGFnLnJlc29sdmUodmFsdWUsIG1zZyA9PiBvbkVycm9yKHRhZ1Rva2VuID8/IHRva2VuLCAnVEFHX1JFU09MVkVfRkFJTEVEJywgbXNnKSwgY3R4Lm9wdGlvbnMpO1xuICAgICAgICBzY2FsYXIgPSBpc1NjYWxhcihyZXMpID8gcmVzIDogbmV3IFNjYWxhcihyZXMpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc3QgbXNnID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpO1xuICAgICAgICBvbkVycm9yKHRhZ1Rva2VuID8/IHRva2VuLCAnVEFHX1JFU09MVkVfRkFJTEVEJywgbXNnKTtcbiAgICAgICAgc2NhbGFyID0gbmV3IFNjYWxhcih2YWx1ZSk7XG4gICAgfVxuICAgIHNjYWxhci5yYW5nZSA9IHJhbmdlO1xuICAgIHNjYWxhci5zb3VyY2UgPSB2YWx1ZTtcbiAgICBpZiAodHlwZSlcbiAgICAgICAgc2NhbGFyLnR5cGUgPSB0eXBlO1xuICAgIGlmICh0YWdOYW1lKVxuICAgICAgICBzY2FsYXIudGFnID0gdGFnTmFtZTtcbiAgICBpZiAodGFnLmZvcm1hdClcbiAgICAgICAgc2NhbGFyLmZvcm1hdCA9IHRhZy5mb3JtYXQ7XG4gICAgaWYgKGNvbW1lbnQpXG4gICAgICAgIHNjYWxhci5jb21tZW50ID0gY29tbWVudDtcbiAgICByZXR1cm4gc2NhbGFyO1xufVxuZnVuY3Rpb24gZmluZFNjYWxhclRhZ0J5TmFtZShzY2hlbWEsIHZhbHVlLCB0YWdOYW1lLCB0YWdUb2tlbiwgb25FcnJvcikge1xuICAgIGlmICh0YWdOYW1lID09PSAnIScpXG4gICAgICAgIHJldHVybiBzY2hlbWFbU0NBTEFSXTsgLy8gbm9uLXNwZWNpZmljIHRhZ1xuICAgIGNvbnN0IG1hdGNoV2l0aFRlc3QgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiBzY2hlbWEudGFncykge1xuICAgICAgICBpZiAoIXRhZy5jb2xsZWN0aW9uICYmIHRhZy50YWcgPT09IHRhZ05hbWUpIHtcbiAgICAgICAgICAgIGlmICh0YWcuZGVmYXVsdCAmJiB0YWcudGVzdClcbiAgICAgICAgICAgICAgICBtYXRjaFdpdGhUZXN0LnB1c2godGFnKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgdGFnIG9mIG1hdGNoV2l0aFRlc3QpXG4gICAgICAgIGlmICh0YWcudGVzdD8udGVzdCh2YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm4gdGFnO1xuICAgIGNvbnN0IGt0ID0gc2NoZW1hLmtub3duVGFnc1t0YWdOYW1lXTtcbiAgICBpZiAoa3QgJiYgIWt0LmNvbGxlY3Rpb24pIHtcbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgdGhlIGtub3duIHRhZyBpcyBhdmFpbGFibGUgZm9yIHN0cmluZ2lmeWluZyxcbiAgICAgICAgLy8gYnV0IGRvZXMgbm90IGdldCB1c2VkIGJ5IGRlZmF1bHQuXG4gICAgICAgIHNjaGVtYS50YWdzLnB1c2goT2JqZWN0LmFzc2lnbih7fSwga3QsIHsgZGVmYXVsdDogZmFsc2UsIHRlc3Q6IHVuZGVmaW5lZCB9KSk7XG4gICAgICAgIHJldHVybiBrdDtcbiAgICB9XG4gICAgb25FcnJvcih0YWdUb2tlbiwgJ1RBR19SRVNPTFZFX0ZBSUxFRCcsIGBVbnJlc29sdmVkIHRhZzogJHt0YWdOYW1lfWAsIHRhZ05hbWUgIT09ICd0YWc6eWFtbC5vcmcsMjAwMjpzdHInKTtcbiAgICByZXR1cm4gc2NoZW1hW1NDQUxBUl07XG59XG5mdW5jdGlvbiBmaW5kU2NhbGFyVGFnQnlUZXN0KHsgYXRLZXksIGRpcmVjdGl2ZXMsIHNjaGVtYSB9LCB2YWx1ZSwgdG9rZW4sIG9uRXJyb3IpIHtcbiAgICBjb25zdCB0YWcgPSBzY2hlbWEudGFncy5maW5kKHRhZyA9PiAodGFnLmRlZmF1bHQgPT09IHRydWUgfHwgKGF0S2V5ICYmIHRhZy5kZWZhdWx0ID09PSAna2V5JykpICYmXG4gICAgICAgIHRhZy50ZXN0Py50ZXN0KHZhbHVlKSkgfHwgc2NoZW1hW1NDQUxBUl07XG4gICAgaWYgKHNjaGVtYS5jb21wYXQpIHtcbiAgICAgICAgY29uc3QgY29tcGF0ID0gc2NoZW1hLmNvbXBhdC5maW5kKHRhZyA9PiB0YWcuZGVmYXVsdCAmJiB0YWcudGVzdD8udGVzdCh2YWx1ZSkpID8/XG4gICAgICAgICAgICBzY2hlbWFbU0NBTEFSXTtcbiAgICAgICAgaWYgKHRhZy50YWcgIT09IGNvbXBhdC50YWcpIHtcbiAgICAgICAgICAgIGNvbnN0IHRzID0gZGlyZWN0aXZlcy50YWdTdHJpbmcodGFnLnRhZyk7XG4gICAgICAgICAgICBjb25zdCBjcyA9IGRpcmVjdGl2ZXMudGFnU3RyaW5nKGNvbXBhdC50YWcpO1xuICAgICAgICAgICAgY29uc3QgbXNnID0gYFZhbHVlIG1heSBiZSBwYXJzZWQgYXMgZWl0aGVyICR7dHN9IG9yICR7Y3N9YDtcbiAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdUQUdfUkVTT0xWRV9GQUlMRUQnLCBtc2csIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YWc7XG59XG5cbmV4cG9ydCB7IGNvbXBvc2VTY2FsYXIgfTtcbiIsICJmdW5jdGlvbiBlbXB0eVNjYWxhclBvc2l0aW9uKG9mZnNldCwgYmVmb3JlLCBwb3MpIHtcbiAgICBpZiAoYmVmb3JlKSB7XG4gICAgICAgIHBvcyA/PyAocG9zID0gYmVmb3JlLmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGkgPSBwb3MgLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgbGV0IHN0ID0gYmVmb3JlW2ldO1xuICAgICAgICAgICAgc3dpdGNoIChzdC50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgLT0gc3Quc291cmNlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUZWNobmljYWxseSwgYW4gZW1wdHkgc2NhbGFyIGlzIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBsYXN0IG5vbi1lbXB0eVxuICAgICAgICAgICAgLy8gbm9kZSwgYnV0IGl0J3MgbW9yZSB1c2VmdWwgdG8gcGxhY2UgaXQgYWZ0ZXIgYW55IHdoaXRlc3BhY2UuXG4gICAgICAgICAgICBzdCA9IGJlZm9yZVsrK2ldO1xuICAgICAgICAgICAgd2hpbGUgKHN0Py50eXBlID09PSAnc3BhY2UnKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ICs9IHN0LnNvdXJjZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgc3QgPSBiZWZvcmVbKytpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvZmZzZXQ7XG59XG5cbmV4cG9ydCB7IGVtcHR5U2NhbGFyUG9zaXRpb24gfTtcbiIsICJpbXBvcnQgeyBBbGlhcyB9IGZyb20gJy4uL25vZGVzL0FsaWFzLmpzJztcbmltcG9ydCB7IGlzU2NhbGFyIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgY29tcG9zZUNvbGxlY3Rpb24gfSBmcm9tICcuL2NvbXBvc2UtY29sbGVjdGlvbi5qcyc7XG5pbXBvcnQgeyBjb21wb3NlU2NhbGFyIH0gZnJvbSAnLi9jb21wb3NlLXNjYWxhci5qcyc7XG5pbXBvcnQgeyByZXNvbHZlRW5kIH0gZnJvbSAnLi9yZXNvbHZlLWVuZC5qcyc7XG5pbXBvcnQgeyBlbXB0eVNjYWxhclBvc2l0aW9uIH0gZnJvbSAnLi91dGlsLWVtcHR5LXNjYWxhci1wb3NpdGlvbi5qcyc7XG5cbmNvbnN0IENOID0geyBjb21wb3NlTm9kZSwgY29tcG9zZUVtcHR5Tm9kZSB9O1xuZnVuY3Rpb24gY29tcG9zZU5vZGUoY3R4LCB0b2tlbiwgcHJvcHMsIG9uRXJyb3IpIHtcbiAgICBjb25zdCBhdEtleSA9IGN0eC5hdEtleTtcbiAgICBjb25zdCB7IHNwYWNlQmVmb3JlLCBjb21tZW50LCBhbmNob3IsIHRhZyB9ID0gcHJvcHM7XG4gICAgbGV0IG5vZGU7XG4gICAgbGV0IGlzU3JjVG9rZW4gPSB0cnVlO1xuICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICBjYXNlICdhbGlhcyc6XG4gICAgICAgICAgICBub2RlID0gY29tcG9zZUFsaWFzKGN0eCwgdG9rZW4sIG9uRXJyb3IpO1xuICAgICAgICAgICAgaWYgKGFuY2hvciB8fCB0YWcpXG4gICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ0FMSUFTX1BST1BTJywgJ0FuIGFsaWFzIG5vZGUgbXVzdCBub3Qgc3BlY2lmeSBhbnkgcHJvcGVydGllcycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgIGNhc2UgJ3NpbmdsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgY2FzZSAnZG91YmxlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICBjYXNlICdibG9jay1zY2FsYXInOlxuICAgICAgICAgICAgbm9kZSA9IGNvbXBvc2VTY2FsYXIoY3R4LCB0b2tlbiwgdGFnLCBvbkVycm9yKTtcbiAgICAgICAgICAgIGlmIChhbmNob3IpXG4gICAgICAgICAgICAgICAgbm9kZS5hbmNob3IgPSBhbmNob3Iuc291cmNlLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdibG9jay1tYXAnOlxuICAgICAgICBjYXNlICdibG9jay1zZXEnOlxuICAgICAgICBjYXNlICdmbG93LWNvbGxlY3Rpb24nOlxuICAgICAgICAgICAgbm9kZSA9IGNvbXBvc2VDb2xsZWN0aW9uKENOLCBjdHgsIHRva2VuLCBwcm9wcywgb25FcnJvcik7XG4gICAgICAgICAgICBpZiAoYW5jaG9yKVxuICAgICAgICAgICAgICAgIG5vZGUuYW5jaG9yID0gYW5jaG9yLnNvdXJjZS5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRva2VuLnR5cGUgPT09ICdlcnJvcidcbiAgICAgICAgICAgICAgICA/IHRva2VuLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICA6IGBVbnN1cHBvcnRlZCB0b2tlbiAodHlwZTogJHt0b2tlbi50eXBlfSlgO1xuICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ1VORVhQRUNURURfVE9LRU4nLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIG5vZGUgPSBjb21wb3NlRW1wdHlOb2RlKGN0eCwgdG9rZW4ub2Zmc2V0LCB1bmRlZmluZWQsIG51bGwsIHByb3BzLCBvbkVycm9yKTtcbiAgICAgICAgICAgIGlzU3JjVG9rZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoYW5jaG9yICYmIG5vZGUuYW5jaG9yID09PSAnJylcbiAgICAgICAgb25FcnJvcihhbmNob3IsICdCQURfQUxJQVMnLCAnQW5jaG9yIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmcnKTtcbiAgICBpZiAoYXRLZXkgJiZcbiAgICAgICAgY3R4Lm9wdGlvbnMuc3RyaW5nS2V5cyAmJlxuICAgICAgICAoIWlzU2NhbGFyKG5vZGUpIHx8XG4gICAgICAgICAgICB0eXBlb2Ygbm9kZS52YWx1ZSAhPT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAgIChub2RlLnRhZyAmJiBub2RlLnRhZyAhPT0gJ3RhZzp5YW1sLm9yZywyMDAyOnN0cicpKSkge1xuICAgICAgICBjb25zdCBtc2cgPSAnV2l0aCBzdHJpbmdLZXlzLCBhbGwga2V5cyBtdXN0IGJlIHN0cmluZ3MnO1xuICAgICAgICBvbkVycm9yKHRhZyA/PyB0b2tlbiwgJ05PTl9TVFJJTkdfS0VZJywgbXNnKTtcbiAgICB9XG4gICAgaWYgKHNwYWNlQmVmb3JlKVxuICAgICAgICBub2RlLnNwYWNlQmVmb3JlID0gdHJ1ZTtcbiAgICBpZiAoY29tbWVudCkge1xuICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gJ3NjYWxhcicgJiYgdG9rZW4uc291cmNlID09PSAnJylcbiAgICAgICAgICAgIG5vZGUuY29tbWVudCA9IGNvbW1lbnQ7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5vZGUuY29tbWVudEJlZm9yZSA9IGNvbW1lbnQ7XG4gICAgfVxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgVHlwZSBjaGVja2luZyBtaXNzZXMgbWVhbmluZyBvZiBpc1NyY1Rva2VuXG4gICAgaWYgKGN0eC5vcHRpb25zLmtlZXBTb3VyY2VUb2tlbnMgJiYgaXNTcmNUb2tlbilcbiAgICAgICAgbm9kZS5zcmNUb2tlbiA9IHRva2VuO1xuICAgIHJldHVybiBub2RlO1xufVxuZnVuY3Rpb24gY29tcG9zZUVtcHR5Tm9kZShjdHgsIG9mZnNldCwgYmVmb3JlLCBwb3MsIHsgc3BhY2VCZWZvcmUsIGNvbW1lbnQsIGFuY2hvciwgdGFnLCBlbmQgfSwgb25FcnJvcikge1xuICAgIGNvbnN0IHRva2VuID0ge1xuICAgICAgICB0eXBlOiAnc2NhbGFyJyxcbiAgICAgICAgb2Zmc2V0OiBlbXB0eVNjYWxhclBvc2l0aW9uKG9mZnNldCwgYmVmb3JlLCBwb3MpLFxuICAgICAgICBpbmRlbnQ6IC0xLFxuICAgICAgICBzb3VyY2U6ICcnXG4gICAgfTtcbiAgICBjb25zdCBub2RlID0gY29tcG9zZVNjYWxhcihjdHgsIHRva2VuLCB0YWcsIG9uRXJyb3IpO1xuICAgIGlmIChhbmNob3IpIHtcbiAgICAgICAgbm9kZS5hbmNob3IgPSBhbmNob3Iuc291cmNlLnN1YnN0cmluZygxKTtcbiAgICAgICAgaWYgKG5vZGUuYW5jaG9yID09PSAnJylcbiAgICAgICAgICAgIG9uRXJyb3IoYW5jaG9yLCAnQkFEX0FMSUFTJywgJ0FuY2hvciBjYW5ub3QgYmUgYW4gZW1wdHkgc3RyaW5nJyk7XG4gICAgfVxuICAgIGlmIChzcGFjZUJlZm9yZSlcbiAgICAgICAgbm9kZS5zcGFjZUJlZm9yZSA9IHRydWU7XG4gICAgaWYgKGNvbW1lbnQpIHtcbiAgICAgICAgbm9kZS5jb21tZW50ID0gY29tbWVudDtcbiAgICAgICAgbm9kZS5yYW5nZVsyXSA9IGVuZDtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG59XG5mdW5jdGlvbiBjb21wb3NlQWxpYXMoeyBvcHRpb25zIH0sIHsgb2Zmc2V0LCBzb3VyY2UsIGVuZCB9LCBvbkVycm9yKSB7XG4gICAgY29uc3QgYWxpYXMgPSBuZXcgQWxpYXMoc291cmNlLnN1YnN0cmluZygxKSk7XG4gICAgaWYgKGFsaWFzLnNvdXJjZSA9PT0gJycpXG4gICAgICAgIG9uRXJyb3Iob2Zmc2V0LCAnQkFEX0FMSUFTJywgJ0FsaWFzIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmcnKTtcbiAgICBpZiAoYWxpYXMuc291cmNlLmVuZHNXaXRoKCc6JykpXG4gICAgICAgIG9uRXJyb3Iob2Zmc2V0ICsgc291cmNlLmxlbmd0aCAtIDEsICdCQURfQUxJQVMnLCAnQWxpYXMgZW5kaW5nIGluIDogaXMgYW1iaWd1b3VzJywgdHJ1ZSk7XG4gICAgY29uc3QgdmFsdWVFbmQgPSBvZmZzZXQgKyBzb3VyY2UubGVuZ3RoO1xuICAgIGNvbnN0IHJlID0gcmVzb2x2ZUVuZChlbmQsIHZhbHVlRW5kLCBvcHRpb25zLnN0cmljdCwgb25FcnJvcik7XG4gICAgYWxpYXMucmFuZ2UgPSBbb2Zmc2V0LCB2YWx1ZUVuZCwgcmUub2Zmc2V0XTtcbiAgICBpZiAocmUuY29tbWVudClcbiAgICAgICAgYWxpYXMuY29tbWVudCA9IHJlLmNvbW1lbnQ7XG4gICAgcmV0dXJuIGFsaWFzO1xufVxuXG5leHBvcnQgeyBjb21wb3NlRW1wdHlOb2RlLCBjb21wb3NlTm9kZSB9O1xuIiwgImltcG9ydCB7IERvY3VtZW50IH0gZnJvbSAnLi4vZG9jL0RvY3VtZW50LmpzJztcbmltcG9ydCB7IGNvbXBvc2VOb2RlLCBjb21wb3NlRW1wdHlOb2RlIH0gZnJvbSAnLi9jb21wb3NlLW5vZGUuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUVuZCB9IGZyb20gJy4vcmVzb2x2ZS1lbmQuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZVByb3BzIH0gZnJvbSAnLi9yZXNvbHZlLXByb3BzLmpzJztcblxuZnVuY3Rpb24gY29tcG9zZURvYyhvcHRpb25zLCBkaXJlY3RpdmVzLCB7IG9mZnNldCwgc3RhcnQsIHZhbHVlLCBlbmQgfSwgb25FcnJvcikge1xuICAgIGNvbnN0IG9wdHMgPSBPYmplY3QuYXNzaWduKHsgX2RpcmVjdGl2ZXM6IGRpcmVjdGl2ZXMgfSwgb3B0aW9ucyk7XG4gICAgY29uc3QgZG9jID0gbmV3IERvY3VtZW50KHVuZGVmaW5lZCwgb3B0cyk7XG4gICAgY29uc3QgY3R4ID0ge1xuICAgICAgICBhdEtleTogZmFsc2UsXG4gICAgICAgIGF0Um9vdDogdHJ1ZSxcbiAgICAgICAgZGlyZWN0aXZlczogZG9jLmRpcmVjdGl2ZXMsXG4gICAgICAgIG9wdGlvbnM6IGRvYy5vcHRpb25zLFxuICAgICAgICBzY2hlbWE6IGRvYy5zY2hlbWFcbiAgICB9O1xuICAgIGNvbnN0IHByb3BzID0gcmVzb2x2ZVByb3BzKHN0YXJ0LCB7XG4gICAgICAgIGluZGljYXRvcjogJ2RvYy1zdGFydCcsXG4gICAgICAgIG5leHQ6IHZhbHVlID8/IGVuZD8uWzBdLFxuICAgICAgICBvZmZzZXQsXG4gICAgICAgIG9uRXJyb3IsXG4gICAgICAgIHBhcmVudEluZGVudDogMCxcbiAgICAgICAgc3RhcnRPbk5ld2xpbmU6IHRydWVcbiAgICB9KTtcbiAgICBpZiAocHJvcHMuZm91bmQpIHtcbiAgICAgICAgZG9jLmRpcmVjdGl2ZXMuZG9jU3RhcnQgPSB0cnVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgICh2YWx1ZS50eXBlID09PSAnYmxvY2stbWFwJyB8fCB2YWx1ZS50eXBlID09PSAnYmxvY2stc2VxJykgJiZcbiAgICAgICAgICAgICFwcm9wcy5oYXNOZXdsaW5lKVxuICAgICAgICAgICAgb25FcnJvcihwcm9wcy5lbmQsICdNSVNTSU5HX0NIQVInLCAnQmxvY2sgY29sbGVjdGlvbiBjYW5ub3Qgc3RhcnQgb24gc2FtZSBsaW5lIHdpdGggZGlyZWN0aXZlcy1lbmQgbWFya2VyJyk7XG4gICAgfVxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgSWYgQ29udGVudHMgaXMgc2V0LCBsZXQncyB0cnVzdCB0aGUgdXNlclxuICAgIGRvYy5jb250ZW50cyA9IHZhbHVlXG4gICAgICAgID8gY29tcG9zZU5vZGUoY3R4LCB2YWx1ZSwgcHJvcHMsIG9uRXJyb3IpXG4gICAgICAgIDogY29tcG9zZUVtcHR5Tm9kZShjdHgsIHByb3BzLmVuZCwgc3RhcnQsIG51bGwsIHByb3BzLCBvbkVycm9yKTtcbiAgICBjb25zdCBjb250ZW50RW5kID0gZG9jLmNvbnRlbnRzLnJhbmdlWzJdO1xuICAgIGNvbnN0IHJlID0gcmVzb2x2ZUVuZChlbmQsIGNvbnRlbnRFbmQsIGZhbHNlLCBvbkVycm9yKTtcbiAgICBpZiAocmUuY29tbWVudClcbiAgICAgICAgZG9jLmNvbW1lbnQgPSByZS5jb21tZW50O1xuICAgIGRvYy5yYW5nZSA9IFtvZmZzZXQsIGNvbnRlbnRFbmQsIHJlLm9mZnNldF07XG4gICAgcmV0dXJuIGRvYztcbn1cblxuZXhwb3J0IHsgY29tcG9zZURvYyB9O1xuIiwgImltcG9ydCB7IERpcmVjdGl2ZXMgfSBmcm9tICcuLi9kb2MvZGlyZWN0aXZlcy5qcyc7XG5pbXBvcnQgeyBEb2N1bWVudCB9IGZyb20gJy4uL2RvYy9Eb2N1bWVudC5qcyc7XG5pbXBvcnQgeyBZQU1MV2FybmluZywgWUFNTFBhcnNlRXJyb3IgfSBmcm9tICcuLi9lcnJvcnMuanMnO1xuaW1wb3J0IHsgaXNDb2xsZWN0aW9uLCBpc1BhaXIgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBjb21wb3NlRG9jIH0gZnJvbSAnLi9jb21wb3NlLWRvYy5qcyc7XG5pbXBvcnQgeyByZXNvbHZlRW5kIH0gZnJvbSAnLi9yZXNvbHZlLWVuZC5qcyc7XG5cbmZ1bmN0aW9uIGdldEVycm9yUG9zKHNyYykge1xuICAgIGlmICh0eXBlb2Ygc3JjID09PSAnbnVtYmVyJylcbiAgICAgICAgcmV0dXJuIFtzcmMsIHNyYyArIDFdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHNyYykpXG4gICAgICAgIHJldHVybiBzcmMubGVuZ3RoID09PSAyID8gc3JjIDogW3NyY1swXSwgc3JjWzFdXTtcbiAgICBjb25zdCB7IG9mZnNldCwgc291cmNlIH0gPSBzcmM7XG4gICAgcmV0dXJuIFtvZmZzZXQsIG9mZnNldCArICh0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyA/IHNvdXJjZS5sZW5ndGggOiAxKV07XG59XG5mdW5jdGlvbiBwYXJzZVByZWx1ZGUocHJlbHVkZSkge1xuICAgIGxldCBjb21tZW50ID0gJyc7XG4gICAgbGV0IGF0Q29tbWVudCA9IGZhbHNlO1xuICAgIGxldCBhZnRlckVtcHR5TGluZSA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJlbHVkZS5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBzb3VyY2UgPSBwcmVsdWRlW2ldO1xuICAgICAgICBzd2l0Y2ggKHNvdXJjZVswXSkge1xuICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICAgICAgY29tbWVudCArPVxuICAgICAgICAgICAgICAgICAgICAoY29tbWVudCA9PT0gJycgPyAnJyA6IGFmdGVyRW1wdHlMaW5lID8gJ1xcblxcbicgOiAnXFxuJykgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKHNvdXJjZS5zdWJzdHJpbmcoMSkgfHwgJyAnKTtcbiAgICAgICAgICAgICAgICBhdENvbW1lbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFmdGVyRW1wdHlMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICclJzpcbiAgICAgICAgICAgICAgICBpZiAocHJlbHVkZVtpICsgMV0/LlswXSAhPT0gJyMnKVxuICAgICAgICAgICAgICAgICAgICBpICs9IDE7XG4gICAgICAgICAgICAgICAgYXRDb21tZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8vIFRoaXMgbWF5IGJlIHdyb25nIGFmdGVyIGRvYy1lbmQsIGJ1dCBpbiB0aGF0IGNhc2UgaXQgZG9lc24ndCBtYXR0ZXJcbiAgICAgICAgICAgICAgICBpZiAoIWF0Q29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJFbXB0eUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGF0Q29tbWVudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IGNvbW1lbnQsIGFmdGVyRW1wdHlMaW5lIH07XG59XG4vKipcbiAqIENvbXBvc2UgYSBzdHJlYW0gb2YgQ1NUIG5vZGVzIGludG8gYSBzdHJlYW0gb2YgWUFNTCBEb2N1bWVudHMuXG4gKlxuICogYGBgdHNcbiAqIGltcG9ydCB7IENvbXBvc2VyLCBQYXJzZXIgfSBmcm9tICd5YW1sJ1xuICpcbiAqIGNvbnN0IHNyYzogc3RyaW5nID0gLi4uXG4gKiBjb25zdCB0b2tlbnMgPSBuZXcgUGFyc2VyKCkucGFyc2Uoc3JjKVxuICogY29uc3QgZG9jcyA9IG5ldyBDb21wb3NlcigpLmNvbXBvc2UodG9rZW5zKVxuICogYGBgXG4gKi9cbmNsYXNzIENvbXBvc2VyIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5kb2MgPSBudWxsO1xuICAgICAgICB0aGlzLmF0RGlyZWN0aXZlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnByZWx1ZGUgPSBbXTtcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICAgICAgdGhpcy53YXJuaW5ncyA9IFtdO1xuICAgICAgICB0aGlzLm9uRXJyb3IgPSAoc291cmNlLCBjb2RlLCBtZXNzYWdlLCB3YXJuaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3MgPSBnZXRFcnJvclBvcyhzb3VyY2UpO1xuICAgICAgICAgICAgaWYgKHdhcm5pbmcpXG4gICAgICAgICAgICAgICAgdGhpcy53YXJuaW5ncy5wdXNoKG5ldyBZQU1MV2FybmluZyhwb3MsIGNvZGUsIG1lc3NhZ2UpKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBZQU1MUGFyc2VFcnJvcihwb3MsIGNvZGUsIG1lc3NhZ2UpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9wcmVmZXItbnVsbGlzaC1jb2FsZXNjaW5nXG4gICAgICAgIHRoaXMuZGlyZWN0aXZlcyA9IG5ldyBEaXJlY3RpdmVzKHsgdmVyc2lvbjogb3B0aW9ucy52ZXJzaW9uIHx8ICcxLjInIH0pO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICBkZWNvcmF0ZShkb2MsIGFmdGVyRG9jKSB7XG4gICAgICAgIGNvbnN0IHsgY29tbWVudCwgYWZ0ZXJFbXB0eUxpbmUgfSA9IHBhcnNlUHJlbHVkZSh0aGlzLnByZWx1ZGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHsgZGM6IGRvYy5jb21tZW50LCBwcmVsdWRlLCBjb21tZW50IH0pXG4gICAgICAgIGlmIChjb21tZW50KSB7XG4gICAgICAgICAgICBjb25zdCBkYyA9IGRvYy5jb250ZW50cztcbiAgICAgICAgICAgIGlmIChhZnRlckRvYykge1xuICAgICAgICAgICAgICAgIGRvYy5jb21tZW50ID0gZG9jLmNvbW1lbnQgPyBgJHtkb2MuY29tbWVudH1cXG4ke2NvbW1lbnR9YCA6IGNvbW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhZnRlckVtcHR5TGluZSB8fCBkb2MuZGlyZWN0aXZlcy5kb2NTdGFydCB8fCAhZGMpIHtcbiAgICAgICAgICAgICAgICBkb2MuY29tbWVudEJlZm9yZSA9IGNvbW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0NvbGxlY3Rpb24oZGMpICYmICFkYy5mbG93ICYmIGRjLml0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgaXQgPSBkYy5pdGVtc1swXTtcbiAgICAgICAgICAgICAgICBpZiAoaXNQYWlyKGl0KSlcbiAgICAgICAgICAgICAgICAgICAgaXQgPSBpdC5rZXk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2IgPSBpdC5jb21tZW50QmVmb3JlO1xuICAgICAgICAgICAgICAgIGl0LmNvbW1lbnRCZWZvcmUgPSBjYiA/IGAke2NvbW1lbnR9XFxuJHtjYn1gIDogY29tbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNiID0gZGMuY29tbWVudEJlZm9yZTtcbiAgICAgICAgICAgICAgICBkYy5jb21tZW50QmVmb3JlID0gY2IgPyBgJHtjb21tZW50fVxcbiR7Y2J9YCA6IGNvbW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFmdGVyRG9jKSB7XG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShkb2MuZXJyb3JzLCB0aGlzLmVycm9ycyk7XG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShkb2Mud2FybmluZ3MsIHRoaXMud2FybmluZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZG9jLmVycm9ycyA9IHRoaXMuZXJyb3JzO1xuICAgICAgICAgICAgZG9jLndhcm5pbmdzID0gdGhpcy53YXJuaW5ncztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZWx1ZGUgPSBbXTtcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICAgICAgdGhpcy53YXJuaW5ncyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDdXJyZW50IHN0cmVhbSBzdGF0dXMgaW5mb3JtYXRpb24uXG4gICAgICpcbiAgICAgKiBNb3N0bHkgdXNlZnVsIGF0IHRoZSBlbmQgb2YgaW5wdXQgZm9yIGFuIGVtcHR5IHN0cmVhbS5cbiAgICAgKi9cbiAgICBzdHJlYW1JbmZvKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tbWVudDogcGFyc2VQcmVsdWRlKHRoaXMucHJlbHVkZSkuY29tbWVudCxcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IHRoaXMuZGlyZWN0aXZlcyxcbiAgICAgICAgICAgIGVycm9yczogdGhpcy5lcnJvcnMsXG4gICAgICAgICAgICB3YXJuaW5nczogdGhpcy53YXJuaW5nc1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wb3NlIHRva2VucyBpbnRvIGRvY3VtZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JjZURvYyAtIElmIHRoZSBzdHJlYW0gY29udGFpbnMgbm8gZG9jdW1lbnQsIHN0aWxsIGVtaXQgYSBmaW5hbCBkb2N1bWVudCBpbmNsdWRpbmcgYW55IGNvbW1lbnRzIGFuZCBkaXJlY3RpdmVzIHRoYXQgd291bGQgYmUgYXBwbGllZCB0byBhIHN1YnNlcXVlbnQgZG9jdW1lbnQuXG4gICAgICogQHBhcmFtIGVuZE9mZnNldCAtIFNob3VsZCBiZSBzZXQgaWYgYGZvcmNlRG9jYCBpcyBhbHNvIHNldCwgdG8gc2V0IHRoZSBkb2N1bWVudCByYW5nZSBlbmQgYW5kIHRvIGluZGljYXRlIGVycm9ycyBjb3JyZWN0bHkuXG4gICAgICovXG4gICAgKmNvbXBvc2UodG9rZW5zLCBmb3JjZURvYyA9IGZhbHNlLCBlbmRPZmZzZXQgPSAtMSkge1xuICAgICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2VucylcbiAgICAgICAgICAgIHlpZWxkKiB0aGlzLm5leHQodG9rZW4pO1xuICAgICAgICB5aWVsZCogdGhpcy5lbmQoZm9yY2VEb2MsIGVuZE9mZnNldCk7XG4gICAgfVxuICAgIC8qKiBBZHZhbmNlIHRoZSBjb21wb3NlciBieSBvbmUgQ1NUIHRva2VuLiAqL1xuICAgICpuZXh0KHRva2VuKSB7XG4gICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aXZlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMuYWRkKHRva2VuLnNvdXJjZSwgKG9mZnNldCwgbWVzc2FnZSwgd2FybmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSBnZXRFcnJvclBvcyh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHBvc1swXSArPSBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcihwb3MsICdCQURfRElSRUNUSVZFJywgbWVzc2FnZSwgd2FybmluZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVsdWRlLnB1c2godG9rZW4uc291cmNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF0RGlyZWN0aXZlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkb2MgPSBjb21wb3NlRG9jKHRoaXMub3B0aW9ucywgdGhpcy5kaXJlY3RpdmVzLCB0b2tlbiwgdGhpcy5vbkVycm9yKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdERpcmVjdGl2ZXMgJiYgIWRvYy5kaXJlY3RpdmVzLmRvY1N0YXJ0KVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IodG9rZW4sICdNSVNTSU5HX0NIQVInLCAnTWlzc2luZyBkaXJlY3RpdmVzLWVuZC9kb2Mtc3RhcnQgaW5kaWNhdG9yIGxpbmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY29yYXRlKGRvYywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvYylcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdGhpcy5kb2M7XG4gICAgICAgICAgICAgICAgdGhpcy5kb2MgPSBkb2M7XG4gICAgICAgICAgICAgICAgdGhpcy5hdERpcmVjdGl2ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ2J5dGUtb3JkZXItbWFyayc6XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlbHVkZS5wdXNoKHRva2VuLnNvdXJjZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlcnJvcic6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSB0b2tlbi5zb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgPyBgJHt0b2tlbi5tZXNzYWdlfTogJHtKU09OLnN0cmluZ2lmeSh0b2tlbi5zb3VyY2UpfWBcbiAgICAgICAgICAgICAgICAgICAgOiB0b2tlbi5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IFlBTUxQYXJzZUVycm9yKGdldEVycm9yUG9zKHRva2VuKSwgJ1VORVhQRUNURURfVE9LRU4nLCBtc2cpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0RGlyZWN0aXZlcyB8fCAhdGhpcy5kb2MpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb2MuZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnZG9jLWVuZCc6IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZG9jKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9ICdVbmV4cGVjdGVkIGRvYy1lbmQgd2l0aG91dCBwcmVjZWRpbmcgZG9jdW1lbnQnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBZQU1MUGFyc2VFcnJvcihnZXRFcnJvclBvcyh0b2tlbiksICdVTkVYUEVDVEVEX1RPS0VOJywgbXNnKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRvYy5kaXJlY3RpdmVzLmRvY0VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kID0gcmVzb2x2ZUVuZCh0b2tlbi5lbmQsIHRva2VuLm9mZnNldCArIHRva2VuLnNvdXJjZS5sZW5ndGgsIHRoaXMuZG9jLm9wdGlvbnMuc3RyaWN0LCB0aGlzLm9uRXJyb3IpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjb3JhdGUodGhpcy5kb2MsIHRydWUpO1xuICAgICAgICAgICAgICAgIGlmIChlbmQuY29tbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYyA9IHRoaXMuZG9jLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9jLmNvbW1lbnQgPSBkYyA/IGAke2RjfVxcbiR7ZW5kLmNvbW1lbnR9YCA6IGVuZC5jb21tZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRvYy5yYW5nZVsyXSA9IGVuZC5vZmZzZXQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IFlBTUxQYXJzZUVycm9yKGdldEVycm9yUG9zKHRva2VuKSwgJ1VORVhQRUNURURfVE9LRU4nLCBgVW5zdXBwb3J0ZWQgdG9rZW4gJHt0b2tlbi50eXBlfWApKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsIGF0IGVuZCBvZiBpbnB1dCB0byB5aWVsZCBhbnkgcmVtYWluaW5nIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIGZvcmNlRG9jIC0gSWYgdGhlIHN0cmVhbSBjb250YWlucyBubyBkb2N1bWVudCwgc3RpbGwgZW1pdCBhIGZpbmFsIGRvY3VtZW50IGluY2x1ZGluZyBhbnkgY29tbWVudHMgYW5kIGRpcmVjdGl2ZXMgdGhhdCB3b3VsZCBiZSBhcHBsaWVkIHRvIGEgc3Vic2VxdWVudCBkb2N1bWVudC5cbiAgICAgKiBAcGFyYW0gZW5kT2Zmc2V0IC0gU2hvdWxkIGJlIHNldCBpZiBgZm9yY2VEb2NgIGlzIGFsc28gc2V0LCB0byBzZXQgdGhlIGRvY3VtZW50IHJhbmdlIGVuZCBhbmQgdG8gaW5kaWNhdGUgZXJyb3JzIGNvcnJlY3RseS5cbiAgICAgKi9cbiAgICAqZW5kKGZvcmNlRG9jID0gZmFsc2UsIGVuZE9mZnNldCA9IC0xKSB7XG4gICAgICAgIGlmICh0aGlzLmRvYykge1xuICAgICAgICAgICAgdGhpcy5kZWNvcmF0ZSh0aGlzLmRvYywgdHJ1ZSk7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLmRvYztcbiAgICAgICAgICAgIHRoaXMuZG9jID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmb3JjZURvYykge1xuICAgICAgICAgICAgY29uc3Qgb3B0cyA9IE9iamVjdC5hc3NpZ24oeyBfZGlyZWN0aXZlczogdGhpcy5kaXJlY3RpdmVzIH0sIHRoaXMub3B0aW9ucyk7XG4gICAgICAgICAgICBjb25zdCBkb2MgPSBuZXcgRG9jdW1lbnQodW5kZWZpbmVkLCBvcHRzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0RGlyZWN0aXZlcylcbiAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IoZW5kT2Zmc2V0LCAnTUlTU0lOR19DSEFSJywgJ01pc3NpbmcgZGlyZWN0aXZlcy1lbmQgaW5kaWNhdG9yIGxpbmUnKTtcbiAgICAgICAgICAgIGRvYy5yYW5nZSA9IFswLCBlbmRPZmZzZXQsIGVuZE9mZnNldF07XG4gICAgICAgICAgICB0aGlzLmRlY29yYXRlKGRvYywgZmFsc2UpO1xuICAgICAgICAgICAgeWllbGQgZG9jO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb3NlciB9O1xuIiwgImNvbnN0IEJSRUFLID0gU3ltYm9sKCdicmVhayB2aXNpdCcpO1xuY29uc3QgU0tJUCA9IFN5bWJvbCgnc2tpcCBjaGlsZHJlbicpO1xuY29uc3QgUkVNT1ZFID0gU3ltYm9sKCdyZW1vdmUgaXRlbScpO1xuLyoqXG4gKiBBcHBseSBhIHZpc2l0b3IgdG8gYSBDU1QgZG9jdW1lbnQgb3IgaXRlbS5cbiAqXG4gKiBXYWxrcyB0aHJvdWdoIHRoZSB0cmVlIChkZXB0aC1maXJzdCkgc3RhcnRpbmcgZnJvbSB0aGUgcm9vdCwgY2FsbGluZyBhXG4gKiBgdmlzaXRvcmAgZnVuY3Rpb24gd2l0aCB0d28gYXJndW1lbnRzIHdoZW4gZW50ZXJpbmcgZWFjaCBpdGVtOlxuICogICAtIGBpdGVtYDogVGhlIGN1cnJlbnQgaXRlbSwgd2hpY2ggaW5jbHVkZWQgdGhlIGZvbGxvd2luZyBtZW1iZXJzOlxuICogICAgIC0gYHN0YXJ0OiBTb3VyY2VUb2tlbltdYCBcdTIwMTMgU291cmNlIHRva2VucyBiZWZvcmUgdGhlIGtleSBvciB2YWx1ZSxcbiAqICAgICAgIHBvc3NpYmx5IGluY2x1ZGluZyBpdHMgYW5jaG9yIG9yIHRhZy5cbiAqICAgICAtIGBrZXk/OiBUb2tlbiB8IG51bGxgIFx1MjAxMyBTZXQgZm9yIHBhaXIgdmFsdWVzLiBNYXkgdGhlbiBiZSBgbnVsbGAsIGlmXG4gKiAgICAgICB0aGUga2V5IGJlZm9yZSB0aGUgYDpgIHNlcGFyYXRvciBpcyBlbXB0eS5cbiAqICAgICAtIGBzZXA/OiBTb3VyY2VUb2tlbltdYCBcdTIwMTMgU291cmNlIHRva2VucyBiZXR3ZWVuIHRoZSBrZXkgYW5kIHRoZSB2YWx1ZSxcbiAqICAgICAgIHdoaWNoIHNob3VsZCBpbmNsdWRlIHRoZSBgOmAgbWFwIHZhbHVlIGluZGljYXRvciBpZiBgdmFsdWVgIGlzIHNldC5cbiAqICAgICAtIGB2YWx1ZT86IFRva2VuYCBcdTIwMTMgVGhlIHZhbHVlIG9mIGEgc2VxdWVuY2UgaXRlbSwgb3Igb2YgYSBtYXAgcGFpci5cbiAqICAgLSBgcGF0aGA6IFRoZSBzdGVwcyBmcm9tIHRoZSByb290IHRvIHRoZSBjdXJyZW50IG5vZGUsIGFzIGFuIGFycmF5IG9mXG4gKiAgICAgYFsna2V5JyB8ICd2YWx1ZScsIG51bWJlcl1gIHR1cGxlcy5cbiAqXG4gKiBUaGUgcmV0dXJuIHZhbHVlIG9mIHRoZSB2aXNpdG9yIG1heSBiZSB1c2VkIHRvIGNvbnRyb2wgdGhlIHRyYXZlcnNhbDpcbiAqICAgLSBgdW5kZWZpbmVkYCAoZGVmYXVsdCk6IERvIG5vdGhpbmcgYW5kIGNvbnRpbnVlXG4gKiAgIC0gYHZpc2l0LlNLSVBgOiBEbyBub3QgdmlzaXQgdGhlIGNoaWxkcmVuIG9mIHRoaXMgdG9rZW4sIGNvbnRpbnVlIHdpdGhcbiAqICAgICAgbmV4dCBzaWJsaW5nXG4gKiAgIC0gYHZpc2l0LkJSRUFLYDogVGVybWluYXRlIHRyYXZlcnNhbCBjb21wbGV0ZWx5XG4gKiAgIC0gYHZpc2l0LlJFTU9WRWA6IFJlbW92ZSB0aGUgY3VycmVudCBpdGVtLCB0aGVuIGNvbnRpbnVlIHdpdGggdGhlIG5leHQgb25lXG4gKiAgIC0gYG51bWJlcmA6IFNldCB0aGUgaW5kZXggb2YgdGhlIG5leHQgc3RlcC4gVGhpcyBpcyB1c2VmdWwgZXNwZWNpYWxseSBpZlxuICogICAgIHRoZSBpbmRleCBvZiB0aGUgY3VycmVudCB0b2tlbiBoYXMgY2hhbmdlZC5cbiAqICAgLSBgZnVuY3Rpb25gOiBEZWZpbmUgdGhlIG5leHQgdmlzaXRvciBmb3IgdGhpcyBpdGVtLiBBZnRlciB0aGUgb3JpZ2luYWxcbiAqICAgICB2aXNpdG9yIGlzIGNhbGxlZCBvbiBpdGVtIGVudHJ5LCBuZXh0IHZpc2l0b3JzIGFyZSBjYWxsZWQgYWZ0ZXIgaGFuZGxpbmdcbiAqICAgICBhIG5vbi1lbXB0eSBga2V5YCBhbmQgd2hlbiBleGl0aW5nIHRoZSBpdGVtLlxuICovXG5mdW5jdGlvbiB2aXNpdChjc3QsIHZpc2l0b3IpIHtcbiAgICBpZiAoJ3R5cGUnIGluIGNzdCAmJiBjc3QudHlwZSA9PT0gJ2RvY3VtZW50JylcbiAgICAgICAgY3N0ID0geyBzdGFydDogY3N0LnN0YXJ0LCB2YWx1ZTogY3N0LnZhbHVlIH07XG4gICAgX3Zpc2l0KE9iamVjdC5mcmVlemUoW10pLCBjc3QsIHZpc2l0b3IpO1xufVxuLy8gV2l0aG91dCB0aGUgYGFzIHN5bWJvbGAgY2FzdHMsIFRTIGRlY2xhcmVzIHRoZXNlIGluIHRoZSBgdmlzaXRgXG4vLyBuYW1lc3BhY2UgdXNpbmcgYHZhcmAsIGJ1dCB0aGVuIGNvbXBsYWlucyBhYm91dCB0aGF0IGJlY2F1c2Vcbi8vIGB1bmlxdWUgc3ltYm9sYCBtdXN0IGJlIGBjb25zdGAuXG4vKiogVGVybWluYXRlIHZpc2l0IHRyYXZlcnNhbCBjb21wbGV0ZWx5ICovXG52aXNpdC5CUkVBSyA9IEJSRUFLO1xuLyoqIERvIG5vdCB2aXNpdCB0aGUgY2hpbGRyZW4gb2YgdGhlIGN1cnJlbnQgaXRlbSAqL1xudmlzaXQuU0tJUCA9IFNLSVA7XG4vKiogUmVtb3ZlIHRoZSBjdXJyZW50IGl0ZW0gKi9cbnZpc2l0LlJFTU9WRSA9IFJFTU9WRTtcbi8qKiBGaW5kIHRoZSBpdGVtIGF0IGBwYXRoYCBmcm9tIGBjc3RgIGFzIHRoZSByb290ICovXG52aXNpdC5pdGVtQXRQYXRoID0gKGNzdCwgcGF0aCkgPT4ge1xuICAgIGxldCBpdGVtID0gY3N0O1xuICAgIGZvciAoY29uc3QgW2ZpZWxkLCBpbmRleF0gb2YgcGF0aCkge1xuICAgICAgICBjb25zdCB0b2sgPSBpdGVtPy5bZmllbGRdO1xuICAgICAgICBpZiAodG9rICYmICdpdGVtcycgaW4gdG9rKSB7XG4gICAgICAgICAgICBpdGVtID0gdG9rLml0ZW1zW2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbTtcbn07XG4vKipcbiAqIEdldCB0aGUgaW1tZWRpYXRlIHBhcmVudCBjb2xsZWN0aW9uIG9mIHRoZSBpdGVtIGF0IGBwYXRoYCBmcm9tIGBjc3RgIGFzIHRoZSByb290LlxuICpcbiAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgY29sbGVjdGlvbiBpcyBub3QgZm91bmQsIHdoaWNoIHNob3VsZCBuZXZlciBoYXBwZW4gaWYgdGhlIGl0ZW0gaXRzZWxmIGV4aXN0cy5cbiAqL1xudmlzaXQucGFyZW50Q29sbGVjdGlvbiA9IChjc3QsIHBhdGgpID0+IHtcbiAgICBjb25zdCBwYXJlbnQgPSB2aXNpdC5pdGVtQXRQYXRoKGNzdCwgcGF0aC5zbGljZSgwLCAtMSkpO1xuICAgIGNvbnN0IGZpZWxkID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdWzBdO1xuICAgIGNvbnN0IGNvbGwgPSBwYXJlbnQ/LltmaWVsZF07XG4gICAgaWYgKGNvbGwgJiYgJ2l0ZW1zJyBpbiBjb2xsKVxuICAgICAgICByZXR1cm4gY29sbDtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmVudCBjb2xsZWN0aW9uIG5vdCBmb3VuZCcpO1xufTtcbmZ1bmN0aW9uIF92aXNpdChwYXRoLCBpdGVtLCB2aXNpdG9yKSB7XG4gICAgbGV0IGN0cmwgPSB2aXNpdG9yKGl0ZW0sIHBhdGgpO1xuICAgIGlmICh0eXBlb2YgY3RybCA9PT0gJ3N5bWJvbCcpXG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgIGZvciAoY29uc3QgZmllbGQgb2YgWydrZXknLCAndmFsdWUnXSkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IGl0ZW1bZmllbGRdO1xuICAgICAgICBpZiAodG9rZW4gJiYgJ2l0ZW1zJyBpbiB0b2tlbikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbi5pdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNpID0gX3Zpc2l0KE9iamVjdC5mcmVlemUocGF0aC5jb25jYXQoW1tmaWVsZCwgaV1dKSksIHRva2VuLml0ZW1zW2ldLCB2aXNpdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNpID09PSAnbnVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgaSA9IGNpIC0gMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaSA9PT0gQlJFQUspXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCUkVBSztcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaSA9PT0gUkVNT1ZFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuLml0ZW1zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3RybCA9PT0gJ2Z1bmN0aW9uJyAmJiBmaWVsZCA9PT0gJ2tleScpXG4gICAgICAgICAgICAgICAgY3RybCA9IGN0cmwoaXRlbSwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiBjdHJsID09PSAnZnVuY3Rpb24nID8gY3RybChpdGVtLCBwYXRoKSA6IGN0cmw7XG59XG5cbmV4cG9ydCB7IHZpc2l0IH07XG4iLCAiZXhwb3J0IHsgY3JlYXRlU2NhbGFyVG9rZW4sIHJlc29sdmVBc1NjYWxhciwgc2V0U2NhbGFyVmFsdWUgfSBmcm9tICcuL2NzdC1zY2FsYXIuanMnO1xuZXhwb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSAnLi9jc3Qtc3RyaW5naWZ5LmpzJztcbmV4cG9ydCB7IHZpc2l0IH0gZnJvbSAnLi9jc3QtdmlzaXQuanMnO1xuXG4vKiogVGhlIGJ5dGUgb3JkZXIgbWFyayAqL1xuY29uc3QgQk9NID0gJ1xcdXtGRUZGfSc7XG4vKiogU3RhcnQgb2YgZG9jLW1vZGUgKi9cbmNvbnN0IERPQ1VNRU5UID0gJ1xceDAyJzsgLy8gQzA6IFN0YXJ0IG9mIFRleHRcbi8qKiBVbmV4cGVjdGVkIGVuZCBvZiBmbG93LW1vZGUgKi9cbmNvbnN0IEZMT1dfRU5EID0gJ1xceDE4JzsgLy8gQzA6IENhbmNlbFxuLyoqIE5leHQgdG9rZW4gaXMgYSBzY2FsYXIgdmFsdWUgKi9cbmNvbnN0IFNDQUxBUiA9ICdcXHgxZic7IC8vIEMwOiBVbml0IFNlcGFyYXRvclxuLyoqIEByZXR1cm5zIGB0cnVlYCBpZiBgdG9rZW5gIGlzIGEgZmxvdyBvciBibG9jayBjb2xsZWN0aW9uICovXG5jb25zdCBpc0NvbGxlY3Rpb24gPSAodG9rZW4pID0+ICEhdG9rZW4gJiYgJ2l0ZW1zJyBpbiB0b2tlbjtcbi8qKiBAcmV0dXJucyBgdHJ1ZWAgaWYgYHRva2VuYCBpcyBhIGZsb3cgb3IgYmxvY2sgc2NhbGFyOyBub3QgYW4gYWxpYXMgKi9cbmNvbnN0IGlzU2NhbGFyID0gKHRva2VuKSA9PiAhIXRva2VuICYmXG4gICAgKHRva2VuLnR5cGUgPT09ICdzY2FsYXInIHx8XG4gICAgICAgIHRva2VuLnR5cGUgPT09ICdzaW5nbGUtcXVvdGVkLXNjYWxhcicgfHxcbiAgICAgICAgdG9rZW4udHlwZSA9PT0gJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJyB8fFxuICAgICAgICB0b2tlbi50eXBlID09PSAnYmxvY2stc2NhbGFyJyk7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuLyoqIEdldCBhIHByaW50YWJsZSByZXByZXNlbnRhdGlvbiBvZiBhIGxleGVyIHRva2VuICovXG5mdW5jdGlvbiBwcmV0dHlUb2tlbih0b2tlbikge1xuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgY2FzZSBCT006XG4gICAgICAgICAgICByZXR1cm4gJzxCT00+JztcbiAgICAgICAgY2FzZSBET0NVTUVOVDpcbiAgICAgICAgICAgIHJldHVybiAnPERPQz4nO1xuICAgICAgICBjYXNlIEZMT1dfRU5EOlxuICAgICAgICAgICAgcmV0dXJuICc8RkxPV19FTkQ+JztcbiAgICAgICAgY2FzZSBTQ0FMQVI6XG4gICAgICAgICAgICByZXR1cm4gJzxTQ0FMQVI+JztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0b2tlbik7XG4gICAgfVxufVxuLyoqIElkZW50aWZ5IHRoZSB0eXBlIG9mIGEgbGV4ZXIgdG9rZW4uIE1heSByZXR1cm4gYG51bGxgIGZvciB1bmtub3duIHRva2Vucy4gKi9cbmZ1bmN0aW9uIHRva2VuVHlwZShzb3VyY2UpIHtcbiAgICBzd2l0Y2ggKHNvdXJjZSkge1xuICAgICAgICBjYXNlIEJPTTpcbiAgICAgICAgICAgIHJldHVybiAnYnl0ZS1vcmRlci1tYXJrJztcbiAgICAgICAgY2FzZSBET0NVTUVOVDpcbiAgICAgICAgICAgIHJldHVybiAnZG9jLW1vZGUnO1xuICAgICAgICBjYXNlIEZMT1dfRU5EOlxuICAgICAgICAgICAgcmV0dXJuICdmbG93LWVycm9yLWVuZCc7XG4gICAgICAgIGNhc2UgU0NBTEFSOlxuICAgICAgICAgICAgcmV0dXJuICdzY2FsYXInO1xuICAgICAgICBjYXNlICctLS0nOlxuICAgICAgICAgICAgcmV0dXJuICdkb2Mtc3RhcnQnO1xuICAgICAgICBjYXNlICcuLi4nOlxuICAgICAgICAgICAgcmV0dXJuICdkb2MtZW5kJztcbiAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgY2FzZSAnXFxuJzpcbiAgICAgICAgY2FzZSAnXFxyXFxuJzpcbiAgICAgICAgICAgIHJldHVybiAnbmV3bGluZSc7XG4gICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgcmV0dXJuICdzZXEtaXRlbS1pbmQnO1xuICAgICAgICBjYXNlICc/JzpcbiAgICAgICAgICAgIHJldHVybiAnZXhwbGljaXQta2V5LWluZCc7XG4gICAgICAgIGNhc2UgJzonOlxuICAgICAgICAgICAgcmV0dXJuICdtYXAtdmFsdWUtaW5kJztcbiAgICAgICAgY2FzZSAneyc6XG4gICAgICAgICAgICByZXR1cm4gJ2Zsb3ctbWFwLXN0YXJ0JztcbiAgICAgICAgY2FzZSAnfSc6XG4gICAgICAgICAgICByZXR1cm4gJ2Zsb3ctbWFwLWVuZCc7XG4gICAgICAgIGNhc2UgJ1snOlxuICAgICAgICAgICAgcmV0dXJuICdmbG93LXNlcS1zdGFydCc7XG4gICAgICAgIGNhc2UgJ10nOlxuICAgICAgICAgICAgcmV0dXJuICdmbG93LXNlcS1lbmQnO1xuICAgICAgICBjYXNlICcsJzpcbiAgICAgICAgICAgIHJldHVybiAnY29tbWEnO1xuICAgIH1cbiAgICBzd2l0Y2ggKHNvdXJjZVswXSkge1xuICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgY2FzZSAnXFx0JzpcbiAgICAgICAgICAgIHJldHVybiAnc3BhY2UnO1xuICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgICAgIHJldHVybiAnY29tbWVudCc7XG4gICAgICAgIGNhc2UgJyUnOlxuICAgICAgICAgICAgcmV0dXJuICdkaXJlY3RpdmUtbGluZSc7XG4gICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgcmV0dXJuICdhbGlhcyc7XG4gICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgcmV0dXJuICdhbmNob3InO1xuICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICAgIHJldHVybiAndGFnJztcbiAgICAgICAgY2FzZSBcIidcIjpcbiAgICAgICAgICAgIHJldHVybiAnc2luZ2xlLXF1b3RlZC1zY2FsYXInO1xuICAgICAgICBjYXNlICdcIic6XG4gICAgICAgICAgICByZXR1cm4gJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJztcbiAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgIGNhc2UgJz4nOlxuICAgICAgICAgICAgcmV0dXJuICdibG9jay1zY2FsYXItaGVhZGVyJztcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCB7IEJPTSwgRE9DVU1FTlQsIEZMT1dfRU5ELCBTQ0FMQVIsIGlzQ29sbGVjdGlvbiwgaXNTY2FsYXIsIHByZXR0eVRva2VuLCB0b2tlblR5cGUgfTtcbiIsICJpbXBvcnQgeyBCT00sIERPQ1VNRU5ULCBGTE9XX0VORCwgU0NBTEFSIH0gZnJvbSAnLi9jc3QuanMnO1xuXG4vKlxuU1RBUlQgLT4gc3RyZWFtXG5cbnN0cmVhbVxuICBkaXJlY3RpdmUgLT4gbGluZS1lbmQgLT4gc3RyZWFtXG4gIGluZGVudCArIGxpbmUtZW5kIC0+IHN0cmVhbVxuICBbZWxzZV0gLT4gbGluZS1zdGFydFxuXG5saW5lLWVuZFxuICBjb21tZW50IC0+IGxpbmUtZW5kXG4gIG5ld2xpbmUgLT4gLlxuICBpbnB1dC1lbmQgLT4gRU5EXG5cbmxpbmUtc3RhcnRcbiAgZG9jLXN0YXJ0IC0+IGRvY1xuICBkb2MtZW5kIC0+IHN0cmVhbVxuICBbZWxzZV0gLT4gaW5kZW50IC0+IGJsb2NrLXN0YXJ0XG5cbmJsb2NrLXN0YXJ0XG4gIHNlcS1pdGVtLXN0YXJ0IC0+IGJsb2NrLXN0YXJ0XG4gIGV4cGxpY2l0LWtleS1zdGFydCAtPiBibG9jay1zdGFydFxuICBtYXAtdmFsdWUtc3RhcnQgLT4gYmxvY2stc3RhcnRcbiAgW2Vsc2VdIC0+IGRvY1xuXG5kb2NcbiAgbGluZS1lbmQgLT4gbGluZS1zdGFydFxuICBzcGFjZXMgLT4gZG9jXG4gIGFuY2hvciAtPiBkb2NcbiAgdGFnIC0+IGRvY1xuICBmbG93LXN0YXJ0IC0+IGZsb3cgLT4gZG9jXG4gIGZsb3ctZW5kIC0+IGVycm9yIC0+IGRvY1xuICBzZXEtaXRlbS1zdGFydCAtPiBlcnJvciAtPiBkb2NcbiAgZXhwbGljaXQta2V5LXN0YXJ0IC0+IGVycm9yIC0+IGRvY1xuICBtYXAtdmFsdWUtc3RhcnQgLT4gZG9jXG4gIGFsaWFzIC0+IGRvY1xuICBxdW90ZS1zdGFydCAtPiBxdW90ZWQtc2NhbGFyIC0+IGRvY1xuICBibG9jay1zY2FsYXItaGVhZGVyIC0+IGxpbmUtZW5kIC0+IGJsb2NrLXNjYWxhcihtaW4pIC0+IGxpbmUtc3RhcnRcbiAgW2Vsc2VdIC0+IHBsYWluLXNjYWxhcihmYWxzZSwgbWluKSAtPiBkb2NcblxuZmxvd1xuICBsaW5lLWVuZCAtPiBmbG93XG4gIHNwYWNlcyAtPiBmbG93XG4gIGFuY2hvciAtPiBmbG93XG4gIHRhZyAtPiBmbG93XG4gIGZsb3ctc3RhcnQgLT4gZmxvdyAtPiBmbG93XG4gIGZsb3ctZW5kIC0+IC5cbiAgc2VxLWl0ZW0tc3RhcnQgLT4gZXJyb3IgLT4gZmxvd1xuICBleHBsaWNpdC1rZXktc3RhcnQgLT4gZmxvd1xuICBtYXAtdmFsdWUtc3RhcnQgLT4gZmxvd1xuICBhbGlhcyAtPiBmbG93XG4gIHF1b3RlLXN0YXJ0IC0+IHF1b3RlZC1zY2FsYXIgLT4gZmxvd1xuICBjb21tYSAtPiBmbG93XG4gIFtlbHNlXSAtPiBwbGFpbi1zY2FsYXIodHJ1ZSwgMCkgLT4gZmxvd1xuXG5xdW90ZWQtc2NhbGFyXG4gIHF1b3RlLWVuZCAtPiAuXG4gIFtlbHNlXSAtPiBxdW90ZWQtc2NhbGFyXG5cbmJsb2NrLXNjYWxhcihtaW4pXG4gIG5ld2xpbmUgKyBwZWVrKGluZGVudCA8IG1pbikgLT4gLlxuICBbZWxzZV0gLT4gYmxvY2stc2NhbGFyKG1pbilcblxucGxhaW4tc2NhbGFyKGlzLWZsb3csIG1pbilcbiAgc2NhbGFyLWVuZChpcy1mbG93KSAtPiAuXG4gIHBlZWsobmV3bGluZSArIChpbmRlbnQgPCBtaW4pKSAtPiAuXG4gIFtlbHNlXSAtPiBwbGFpbi1zY2FsYXIobWluKVxuKi9cbmZ1bmN0aW9uIGlzRW1wdHkoY2gpIHtcbiAgICBzd2l0Y2ggKGNoKSB7XG4gICAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgY2FzZSAnXFxuJzpcbiAgICAgICAgY2FzZSAnXFxyJzpcbiAgICAgICAgY2FzZSAnXFx0JzpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmNvbnN0IGhleERpZ2l0cyA9IG5ldyBTZXQoJzAxMjM0NTY3ODlBQkNERUZhYmNkZWYnKTtcbmNvbnN0IHRhZ0NoYXJzID0gbmV3IFNldChcIjAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6LSM7Lz86QCY9KyRfLiF+KicoKVwiKTtcbmNvbnN0IGZsb3dJbmRpY2F0b3JDaGFycyA9IG5ldyBTZXQoJyxbXXt9Jyk7XG5jb25zdCBpbnZhbGlkQW5jaG9yQ2hhcnMgPSBuZXcgU2V0KCcgLFtde31cXG5cXHJcXHQnKTtcbmNvbnN0IGlzTm90QW5jaG9yQ2hhciA9IChjaCkgPT4gIWNoIHx8IGludmFsaWRBbmNob3JDaGFycy5oYXMoY2gpO1xuLyoqXG4gKiBTcGxpdHMgYW4gaW5wdXQgc3RyaW5nIGludG8gbGV4aWNhbCB0b2tlbnMsIGkuZS4gc21hbGxlciBzdHJpbmdzIHRoYXQgYXJlXG4gKiBlYXNpbHkgaWRlbnRpZmlhYmxlIGJ5IGB0b2tlbnMudG9rZW5UeXBlKClgLlxuICpcbiAqIExleGluZyBzdGFydHMgYWx3YXlzIGluIGEgXCJzdHJlYW1cIiBjb250ZXh0LiBJbmNvbXBsZXRlIGlucHV0IG1heSBiZSBidWZmZXJlZFxuICogdW50aWwgYSBjb21wbGV0ZSB0b2tlbiBjYW4gYmUgZW1pdHRlZC5cbiAqXG4gKiBJbiBhZGRpdGlvbiB0byBzbGljZXMgb2YgdGhlIG9yaWdpbmFsIGlucHV0LCB0aGUgZm9sbG93aW5nIGNvbnRyb2wgY2hhcmFjdGVyc1xuICogbWF5IGFsc28gYmUgZW1pdHRlZDpcbiAqXG4gKiAtIGBcXHgwMmAgKFN0YXJ0IG9mIFRleHQpOiBBIGRvY3VtZW50IHN0YXJ0cyB3aXRoIHRoZSBuZXh0IHRva2VuXG4gKiAtIGBcXHgxOGAgKENhbmNlbCk6IFVuZXhwZWN0ZWQgZW5kIG9mIGZsb3ctbW9kZSAoaW5kaWNhdGVzIGFuIGVycm9yKVxuICogLSBgXFx4MWZgIChVbml0IFNlcGFyYXRvcik6IE5leHQgdG9rZW4gaXMgYSBzY2FsYXIgdmFsdWVcbiAqIC0gYFxcdXtGRUZGfWAgKEJ5dGUgb3JkZXIgbWFyayk6IEVtaXR0ZWQgc2VwYXJhdGVseSBvdXRzaWRlIGRvY3VtZW50c1xuICovXG5jbGFzcyBMZXhlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGbGFnIGluZGljYXRpbmcgd2hldGhlciB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IGJ1ZmZlciBtYXJrcyB0aGUgZW5kIG9mXG4gICAgICAgICAqIGFsbCBpbnB1dFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hdEVuZCA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogRXhwbGljaXQgaW5kZW50IHNldCBpbiBibG9jayBzY2FsYXIgaGVhZGVyLCBhcyBhbiBvZmZzZXQgZnJvbSB0aGUgY3VycmVudFxuICAgICAgICAgKiBtaW5pbXVtIGluZGVudCwgc28gZS5nLiBzZXQgdG8gMSBmcm9tIGEgaGVhZGVyIGB8MitgLiBTZXQgdG8gLTEgaWYgbm90XG4gICAgICAgICAqIGV4cGxpY2l0bHkgc2V0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ibG9ja1NjYWxhckluZGVudCA9IC0xO1xuICAgICAgICAvKipcbiAgICAgICAgICogQmxvY2sgc2NhbGFycyB0aGF0IGluY2x1ZGUgYSArIChrZWVwKSBjaG9tcGluZyBpbmRpY2F0b3IgaW4gdGhlaXIgaGVhZGVyXG4gICAgICAgICAqIGluY2x1ZGUgdHJhaWxpbmcgZW1wdHkgbGluZXMsIHdoaWNoIGFyZSBvdGhlcndpc2UgZXhjbHVkZWQgZnJvbSB0aGVcbiAgICAgICAgICogc2NhbGFyJ3MgY29udGVudHMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmJsb2NrU2NhbGFyS2VlcCA9IGZhbHNlO1xuICAgICAgICAvKiogQ3VycmVudCBpbnB1dCAqL1xuICAgICAgICB0aGlzLmJ1ZmZlciA9ICcnO1xuICAgICAgICAvKipcbiAgICAgICAgICogRmxhZyBub3Rpbmcgd2hldGhlciB0aGUgbWFwIHZhbHVlIGluZGljYXRvciA6IGNhbiBpbW1lZGlhdGVseSBmb2xsb3cgdGhpc1xuICAgICAgICAgKiBub2RlIHdpdGhpbiBhIGZsb3cgY29udGV4dC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZmxvd0tleSA9IGZhbHNlO1xuICAgICAgICAvKiogQ291bnQgb2Ygc3Vycm91bmRpbmcgZmxvdyBjb2xsZWN0aW9uIGxldmVscy4gKi9cbiAgICAgICAgdGhpcy5mbG93TGV2ZWwgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogTWluaW11bSBsZXZlbCBvZiBpbmRlbnRhdGlvbiByZXF1aXJlZCBmb3IgbmV4dCBsaW5lcyB0byBiZSBwYXJzZWQgYXMgYVxuICAgICAgICAgKiBwYXJ0IG9mIHRoZSBjdXJyZW50IHNjYWxhciB2YWx1ZS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaW5kZW50TmV4dCA9IDA7XG4gICAgICAgIC8qKiBJbmRlbnRhdGlvbiBsZXZlbCBvZiB0aGUgY3VycmVudCBsaW5lLiAqL1xuICAgICAgICB0aGlzLmluZGVudFZhbHVlID0gMDtcbiAgICAgICAgLyoqIFBvc2l0aW9uIG9mIHRoZSBuZXh0IFxcbiBjaGFyYWN0ZXIuICovXG4gICAgICAgIHRoaXMubGluZUVuZFBvcyA9IG51bGw7XG4gICAgICAgIC8qKiBTdG9yZXMgdGhlIHN0YXRlIG9mIHRoZSBsZXhlciBpZiByZWFjaGluZyB0aGUgZW5kIG9mIGluY3BvbXBsZXRlIGlucHV0ICovXG4gICAgICAgIHRoaXMubmV4dCA9IG51bGw7XG4gICAgICAgIC8qKiBBIHBvaW50ZXIgdG8gYGJ1ZmZlcmA7IHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBsZXhlci4gKi9cbiAgICAgICAgdGhpcy5wb3MgPSAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBZQU1MIHRva2VucyBmcm9tIHRoZSBgc291cmNlYCBzdHJpbmcuIElmIGBpbmNvbXBsZXRlYCxcbiAgICAgKiBhIHBhcnQgb2YgdGhlIGxhc3QgbGluZSBtYXkgYmUgbGVmdCBhcyBhIGJ1ZmZlciBmb3IgdGhlIG5leHQgY2FsbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgZ2VuZXJhdG9yIG9mIGxleGljYWwgdG9rZW5zXG4gICAgICovXG4gICAgKmxleChzb3VyY2UsIGluY29tcGxldGUgPSBmYWxzZSkge1xuICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdzb3VyY2UgaXMgbm90IGEgc3RyaW5nJyk7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IHRoaXMuYnVmZmVyID8gdGhpcy5idWZmZXIgKyBzb3VyY2UgOiBzb3VyY2U7XG4gICAgICAgICAgICB0aGlzLmxpbmVFbmRQb3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXRFbmQgPSAhaW5jb21wbGV0ZTtcbiAgICAgICAgbGV0IG5leHQgPSB0aGlzLm5leHQgPz8gJ3N0cmVhbSc7XG4gICAgICAgIHdoaWxlIChuZXh0ICYmIChpbmNvbXBsZXRlIHx8IHRoaXMuaGFzQ2hhcnMoMSkpKVxuICAgICAgICAgICAgbmV4dCA9IHlpZWxkKiB0aGlzLnBhcnNlTmV4dChuZXh0KTtcbiAgICB9XG4gICAgYXRMaW5lRW5kKCkge1xuICAgICAgICBsZXQgaSA9IHRoaXMucG9zO1xuICAgICAgICBsZXQgY2ggPSB0aGlzLmJ1ZmZlcltpXTtcbiAgICAgICAgd2hpbGUgKGNoID09PSAnICcgfHwgY2ggPT09ICdcXHQnKVxuICAgICAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlclsrK2ldO1xuICAgICAgICBpZiAoIWNoIHx8IGNoID09PSAnIycgfHwgY2ggPT09ICdcXG4nKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChjaCA9PT0gJ1xccicpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5idWZmZXJbaSArIDFdID09PSAnXFxuJztcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjaGFyQXQobikge1xuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5wb3MgKyBuXTtcbiAgICB9XG4gICAgY29udGludWVTY2FsYXIob2Zmc2V0KSB7XG4gICAgICAgIGxldCBjaCA9IHRoaXMuYnVmZmVyW29mZnNldF07XG4gICAgICAgIGlmICh0aGlzLmluZGVudE5leHQgPiAwKSB7XG4gICAgICAgICAgICBsZXQgaW5kZW50ID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChjaCA9PT0gJyAnKVxuICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbKytpbmRlbnQgKyBvZmZzZXRdO1xuICAgICAgICAgICAgaWYgKGNoID09PSAnXFxyJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB0aGlzLmJ1ZmZlcltpbmRlbnQgKyBvZmZzZXQgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCA9PT0gJ1xcbicgfHwgKCFuZXh0ICYmICF0aGlzLmF0RW5kKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldCArIGluZGVudCArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2ggPT09ICdcXG4nIHx8IGluZGVudCA+PSB0aGlzLmluZGVudE5leHQgfHwgKCFjaCAmJiAhdGhpcy5hdEVuZClcbiAgICAgICAgICAgICAgICA/IG9mZnNldCArIGluZGVudFxuICAgICAgICAgICAgICAgIDogLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoID09PSAnLScgfHwgY2ggPT09ICcuJykge1xuICAgICAgICAgICAgY29uc3QgZHQgPSB0aGlzLmJ1ZmZlci5zdWJzdHIob2Zmc2V0LCAzKTtcbiAgICAgICAgICAgIGlmICgoZHQgPT09ICctLS0nIHx8IGR0ID09PSAnLi4uJykgJiYgaXNFbXB0eSh0aGlzLmJ1ZmZlcltvZmZzZXQgKyAzXSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvZmZzZXQ7XG4gICAgfVxuICAgIGdldExpbmUoKSB7XG4gICAgICAgIGxldCBlbmQgPSB0aGlzLmxpbmVFbmRQb3M7XG4gICAgICAgIGlmICh0eXBlb2YgZW5kICE9PSAnbnVtYmVyJyB8fCAoZW5kICE9PSAtMSAmJiBlbmQgPCB0aGlzLnBvcykpIHtcbiAgICAgICAgICAgIGVuZCA9IHRoaXMuYnVmZmVyLmluZGV4T2YoJ1xcbicsIHRoaXMucG9zKTtcbiAgICAgICAgICAgIHRoaXMubGluZUVuZFBvcyA9IGVuZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kID09PSAtMSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0RW5kID8gdGhpcy5idWZmZXIuc3Vic3RyaW5nKHRoaXMucG9zKSA6IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmJ1ZmZlcltlbmQgLSAxXSA9PT0gJ1xccicpXG4gICAgICAgICAgICBlbmQgLT0gMTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyLnN1YnN0cmluZyh0aGlzLnBvcywgZW5kKTtcbiAgICB9XG4gICAgaGFzQ2hhcnMobikge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgKyBuIDw9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgICB9XG4gICAgc2V0TmV4dChzdGF0ZSkge1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IHRoaXMuYnVmZmVyLnN1YnN0cmluZyh0aGlzLnBvcyk7XG4gICAgICAgIHRoaXMucG9zID0gMDtcbiAgICAgICAgdGhpcy5saW5lRW5kUG9zID0gbnVsbDtcbiAgICAgICAgdGhpcy5uZXh0ID0gc3RhdGU7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBwZWVrKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyLnN1YnN0cih0aGlzLnBvcywgbik7XG4gICAgfVxuICAgICpwYXJzZU5leHQobmV4dCkge1xuICAgICAgICBzd2l0Y2ggKG5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgJ3N0cmVhbSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlU3RyZWFtKCk7XG4gICAgICAgICAgICBjYXNlICdsaW5lLXN0YXJ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VMaW5lU3RhcnQoKTtcbiAgICAgICAgICAgIGNhc2UgJ2Jsb2NrLXN0YXJ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VCbG9ja1N0YXJ0KCk7XG4gICAgICAgICAgICBjYXNlICdkb2MnOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZURvY3VtZW50KCk7XG4gICAgICAgICAgICBjYXNlICdmbG93JzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VGbG93Q29sbGVjdGlvbigpO1xuICAgICAgICAgICAgY2FzZSAncXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlUXVvdGVkU2NhbGFyKCk7XG4gICAgICAgICAgICBjYXNlICdibG9jay1zY2FsYXInOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZUJsb2NrU2NhbGFyKCk7XG4gICAgICAgICAgICBjYXNlICdwbGFpbi1zY2FsYXInOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZVBsYWluU2NhbGFyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKnBhcnNlU3RyZWFtKCkge1xuICAgICAgICBsZXQgbGluZSA9IHRoaXMuZ2V0TGluZSgpO1xuICAgICAgICBpZiAobGluZSA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5leHQoJ3N0cmVhbScpO1xuICAgICAgICBpZiAobGluZVswXSA9PT0gQk9NKSB7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQoMSk7XG4gICAgICAgICAgICBsaW5lID0gbGluZS5zdWJzdHJpbmcoMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbmVbMF0gPT09ICclJykge1xuICAgICAgICAgICAgbGV0IGRpckVuZCA9IGxpbmUubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGNzID0gbGluZS5pbmRleE9mKCcjJyk7XG4gICAgICAgICAgICB3aGlsZSAoY3MgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2ggPSBsaW5lW2NzIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAnICcgfHwgY2ggPT09ICdcXHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpckVuZCA9IGNzIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjcyA9IGxpbmUuaW5kZXhPZignIycsIGNzICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaCA9IGxpbmVbZGlyRW5kIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAnICcgfHwgY2ggPT09ICdcXHQnKVxuICAgICAgICAgICAgICAgICAgICBkaXJFbmQgLT0gMTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbiA9ICh5aWVsZCogdGhpcy5wdXNoQ291bnQoZGlyRW5kKSkgKyAoeWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKSk7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQobGluZS5sZW5ndGggLSBuKTsgLy8gcG9zc2libGUgY29tbWVudFxuICAgICAgICAgICAgdGhpcy5wdXNoTmV3bGluZSgpO1xuICAgICAgICAgICAgcmV0dXJuICdzdHJlYW0nO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmF0TGluZUVuZCgpKSB7XG4gICAgICAgICAgICBjb25zdCBzcCA9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQobGluZS5sZW5ndGggLSBzcCk7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoTmV3bGluZSgpO1xuICAgICAgICAgICAgcmV0dXJuICdzdHJlYW0nO1xuICAgICAgICB9XG4gICAgICAgIHlpZWxkIERPQ1VNRU5UO1xuICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VMaW5lU3RhcnQoKTtcbiAgICB9XG4gICAgKnBhcnNlTGluZVN0YXJ0KCkge1xuICAgICAgICBjb25zdCBjaCA9IHRoaXMuY2hhckF0KDApO1xuICAgICAgICBpZiAoIWNoICYmICF0aGlzLmF0RW5kKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgnbGluZS1zdGFydCcpO1xuICAgICAgICBpZiAoY2ggPT09ICctJyB8fCBjaCA9PT0gJy4nKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYXRFbmQgJiYgIXRoaXMuaGFzQ2hhcnMoNCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgnbGluZS1zdGFydCcpO1xuICAgICAgICAgICAgY29uc3QgcyA9IHRoaXMucGVlaygzKTtcbiAgICAgICAgICAgIGlmICgocyA9PT0gJy0tLScgfHwgcyA9PT0gJy4uLicpICYmIGlzRW1wdHkodGhpcy5jaGFyQXQoMykpKSB7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KDMpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50VmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50TmV4dCA9IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHMgPT09ICctLS0nID8gJ2RvYycgOiAnc3RyZWFtJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGVudFZhbHVlID0geWllbGQqIHRoaXMucHVzaFNwYWNlcyhmYWxzZSk7XG4gICAgICAgIGlmICh0aGlzLmluZGVudE5leHQgPiB0aGlzLmluZGVudFZhbHVlICYmICFpc0VtcHR5KHRoaXMuY2hhckF0KDEpKSlcbiAgICAgICAgICAgIHRoaXMuaW5kZW50TmV4dCA9IHRoaXMuaW5kZW50VmFsdWU7XG4gICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZUJsb2NrU3RhcnQoKTtcbiAgICB9XG4gICAgKnBhcnNlQmxvY2tTdGFydCgpIHtcbiAgICAgICAgY29uc3QgW2NoMCwgY2gxXSA9IHRoaXMucGVlaygyKTtcbiAgICAgICAgaWYgKCFjaDEgJiYgIXRoaXMuYXRFbmQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXh0KCdibG9jay1zdGFydCcpO1xuICAgICAgICBpZiAoKGNoMCA9PT0gJy0nIHx8IGNoMCA9PT0gJz8nIHx8IGNoMCA9PT0gJzonKSAmJiBpc0VtcHR5KGNoMSkpIHtcbiAgICAgICAgICAgIGNvbnN0IG4gPSAoeWllbGQqIHRoaXMucHVzaENvdW50KDEpKSArICh5aWVsZCogdGhpcy5wdXNoU3BhY2VzKHRydWUpKTtcbiAgICAgICAgICAgIHRoaXMuaW5kZW50TmV4dCA9IHRoaXMuaW5kZW50VmFsdWUgKyAxO1xuICAgICAgICAgICAgdGhpcy5pbmRlbnRWYWx1ZSArPSBuO1xuICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlQmxvY2tTdGFydCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnZG9jJztcbiAgICB9XG4gICAgKnBhcnNlRG9jdW1lbnQoKSB7XG4gICAgICAgIHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdldExpbmUoKTtcbiAgICAgICAgaWYgKGxpbmUgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXh0KCdkb2MnKTtcbiAgICAgICAgbGV0IG4gPSB5aWVsZCogdGhpcy5wdXNoSW5kaWNhdG9ycygpO1xuICAgICAgICBzd2l0Y2ggKGxpbmVbbl0pIHtcbiAgICAgICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudChsaW5lLmxlbmd0aCAtIG4pO1xuICAgICAgICAgICAgLy8gZmFsbHRocm91Z2hcbiAgICAgICAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hOZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlTGluZVN0YXJ0KCk7XG4gICAgICAgICAgICBjYXNlICd7JzpcbiAgICAgICAgICAgIGNhc2UgJ1snOlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgxKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dLZXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dMZXZlbCA9IDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdmbG93JztcbiAgICAgICAgICAgIGNhc2UgJ30nOlxuICAgICAgICAgICAgY2FzZSAnXSc6XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBhbiBlcnJvclxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgxKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2RvYyc7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoVW50aWwoaXNOb3RBbmNob3JDaGFyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2RvYyc7XG4gICAgICAgICAgICBjYXNlICdcIic6XG4gICAgICAgICAgICBjYXNlIFwiJ1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZVF1b3RlZFNjYWxhcigpO1xuICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnBhcnNlQmxvY2tTY2FsYXJIZWFkZXIoKTtcbiAgICAgICAgICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KGxpbmUubGVuZ3RoIC0gbik7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaE5ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VCbG9ja1NjYWxhcigpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VQbGFpblNjYWxhcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgICpwYXJzZUZsb3dDb2xsZWN0aW9uKCkge1xuICAgICAgICBsZXQgbmwsIHNwO1xuICAgICAgICBsZXQgaW5kZW50ID0gLTE7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIG5sID0geWllbGQqIHRoaXMucHVzaE5ld2xpbmUoKTtcbiAgICAgICAgICAgIGlmIChubCA+IDApIHtcbiAgICAgICAgICAgICAgICBzcCA9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXMoZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50VmFsdWUgPSBpbmRlbnQgPSBzcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNwID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNwICs9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgIH0gd2hpbGUgKG5sICsgc3AgPiAwKTtcbiAgICAgICAgY29uc3QgbGluZSA9IHRoaXMuZ2V0TGluZSgpO1xuICAgICAgICBpZiAobGluZSA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5leHQoJ2Zsb3cnKTtcbiAgICAgICAgaWYgKChpbmRlbnQgIT09IC0xICYmIGluZGVudCA8IHRoaXMuaW5kZW50TmV4dCAmJiBsaW5lWzBdICE9PSAnIycpIHx8XG4gICAgICAgICAgICAoaW5kZW50ID09PSAwICYmXG4gICAgICAgICAgICAgICAgKGxpbmUuc3RhcnRzV2l0aCgnLS0tJykgfHwgbGluZS5zdGFydHNXaXRoKCcuLi4nKSkgJiZcbiAgICAgICAgICAgICAgICBpc0VtcHR5KGxpbmVbM10pKSkge1xuICAgICAgICAgICAgLy8gQWxsb3dpbmcgZm9yIHRoZSB0ZXJtaW5hbCBdIG9yIH0gYXQgdGhlIHNhbWUgKHJhdGhlciB0aGFuIGdyZWF0ZXIpXG4gICAgICAgICAgICAvLyBpbmRlbnQgbGV2ZWwgYXMgdGhlIGluaXRpYWwgWyBvciB7IGlzIHRlY2huaWNhbGx5IGludmFsaWQsIGJ1dFxuICAgICAgICAgICAgLy8gZmFpbGluZyBoZXJlIHdvdWxkIGJlIHN1cnByaXNpbmcgdG8gdXNlcnMuXG4gICAgICAgICAgICBjb25zdCBhdEZsb3dFbmRNYXJrZXIgPSBpbmRlbnQgPT09IHRoaXMuaW5kZW50TmV4dCAtIDEgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dMZXZlbCA9PT0gMSAmJlxuICAgICAgICAgICAgICAgIChsaW5lWzBdID09PSAnXScgfHwgbGluZVswXSA9PT0gJ30nKTtcbiAgICAgICAgICAgIGlmICghYXRGbG93RW5kTWFya2VyKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBhbiBlcnJvclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvd0xldmVsID0gMDtcbiAgICAgICAgICAgICAgICB5aWVsZCBGTE9XX0VORDtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VMaW5lU3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgIHdoaWxlIChsaW5lW25dID09PSAnLCcpIHtcbiAgICAgICAgICAgIG4gKz0geWllbGQqIHRoaXMucHVzaENvdW50KDEpO1xuICAgICAgICAgICAgbiArPSB5aWVsZCogdGhpcy5wdXNoU3BhY2VzKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbiArPSB5aWVsZCogdGhpcy5wdXNoSW5kaWNhdG9ycygpO1xuICAgICAgICBzd2l0Y2ggKGxpbmVbbl0pIHtcbiAgICAgICAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICAgICAgICAgIHJldHVybiAnZmxvdyc7XG4gICAgICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQobGluZS5sZW5ndGggLSBuKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Zsb3cnO1xuICAgICAgICAgICAgY2FzZSAneyc6XG4gICAgICAgICAgICBjYXNlICdbJzpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQoMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5mbG93TGV2ZWwgKz0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Zsb3cnO1xuICAgICAgICAgICAgY2FzZSAnfSc6XG4gICAgICAgICAgICBjYXNlICddJzpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQoMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dMZXZlbCAtPSAxO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZsb3dMZXZlbCA/ICdmbG93JyA6ICdkb2MnO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaFVudGlsKGlzTm90QW5jaG9yQ2hhcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdmbG93JztcbiAgICAgICAgICAgIGNhc2UgJ1wiJzpcbiAgICAgICAgICAgIGNhc2UgXCInXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VRdW90ZWRTY2FsYXIoKTtcbiAgICAgICAgICAgIGNhc2UgJzonOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHRoaXMuY2hhckF0KDEpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZsb3dLZXkgfHwgaXNFbXB0eShuZXh0KSB8fCBuZXh0ID09PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgxKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdmbG93JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBmYWxsdGhyb3VnaFxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dLZXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VQbGFpblNjYWxhcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgICpwYXJzZVF1b3RlZFNjYWxhcigpIHtcbiAgICAgICAgY29uc3QgcXVvdGUgPSB0aGlzLmNoYXJBdCgwKTtcbiAgICAgICAgbGV0IGVuZCA9IHRoaXMuYnVmZmVyLmluZGV4T2YocXVvdGUsIHRoaXMucG9zICsgMSk7XG4gICAgICAgIGlmIChxdW90ZSA9PT0gXCInXCIpIHtcbiAgICAgICAgICAgIHdoaWxlIChlbmQgIT09IC0xICYmIHRoaXMuYnVmZmVyW2VuZCArIDFdID09PSBcIidcIilcbiAgICAgICAgICAgICAgICBlbmQgPSB0aGlzLmJ1ZmZlci5pbmRleE9mKFwiJ1wiLCBlbmQgKyAyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRvdWJsZS1xdW90ZVxuICAgICAgICAgICAgd2hpbGUgKGVuZCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuYnVmZmVyW2VuZCAtIDEgLSBuXSA9PT0gJ1xcXFwnKVxuICAgICAgICAgICAgICAgICAgICBuICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKG4gJSAyID09PSAwKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBlbmQgPSB0aGlzLmJ1ZmZlci5pbmRleE9mKCdcIicsIGVuZCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE9ubHkgbG9va2luZyBmb3IgbmV3bGluZXMgd2l0aGluIHRoZSBxdW90ZXNcbiAgICAgICAgY29uc3QgcWIgPSB0aGlzLmJ1ZmZlci5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICAgICAgbGV0IG5sID0gcWIuaW5kZXhPZignXFxuJywgdGhpcy5wb3MpO1xuICAgICAgICBpZiAobmwgIT09IC0xKSB7XG4gICAgICAgICAgICB3aGlsZSAobmwgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3MgPSB0aGlzLmNvbnRpbnVlU2NhbGFyKG5sICsgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGNzID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgbmwgPSBxYi5pbmRleE9mKCdcXG4nLCBjcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmwgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBhbiBlcnJvciBjYXVzZWQgYnkgYW4gdW5leHBlY3RlZCB1bmluZGVudFxuICAgICAgICAgICAgICAgIGVuZCA9IG5sIC0gKHFiW25sIC0gMV0gPT09ICdcXHInID8gMiA6IDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYXRFbmQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgncXVvdGVkLXNjYWxhcicpO1xuICAgICAgICAgICAgZW5kID0gdGhpcy5idWZmZXIubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHlpZWxkKiB0aGlzLnB1c2hUb0luZGV4KGVuZCArIDEsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxvd0xldmVsID8gJ2Zsb3cnIDogJ2RvYyc7XG4gICAgfVxuICAgICpwYXJzZUJsb2NrU2NhbGFySGVhZGVyKCkge1xuICAgICAgICB0aGlzLmJsb2NrU2NhbGFySW5kZW50ID0gLTE7XG4gICAgICAgIHRoaXMuYmxvY2tTY2FsYXJLZWVwID0gZmFsc2U7XG4gICAgICAgIGxldCBpID0gdGhpcy5wb3M7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBjaCA9IHRoaXMuYnVmZmVyWysraV07XG4gICAgICAgICAgICBpZiAoY2ggPT09ICcrJylcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrU2NhbGFyS2VlcCA9IHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmIChjaCA+ICcwJyAmJiBjaCA8PSAnOScpXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja1NjYWxhckluZGVudCA9IE51bWJlcihjaCkgLSAxO1xuICAgICAgICAgICAgZWxzZSBpZiAoY2ggIT09ICctJylcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucHVzaFVudGlsKGNoID0+IGlzRW1wdHkoY2gpIHx8IGNoID09PSAnIycpO1xuICAgIH1cbiAgICAqcGFyc2VCbG9ja1NjYWxhcigpIHtcbiAgICAgICAgbGV0IG5sID0gdGhpcy5wb3MgLSAxOyAvLyBtYXkgYmUgLTEgaWYgdGhpcy5wb3MgPT09IDBcbiAgICAgICAgbGV0IGluZGVudCA9IDA7XG4gICAgICAgIGxldCBjaDtcbiAgICAgICAgbG9vcDogZm9yIChsZXQgaSA9IHRoaXMucG9zOyAoY2ggPSB0aGlzLmJ1ZmZlcltpXSk7ICsraSkge1xuICAgICAgICAgICAgc3dpdGNoIChjaCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnXFxuJzpcbiAgICAgICAgICAgICAgICAgICAgbmwgPSBpO1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdcXHInOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB0aGlzLmJ1ZmZlcltpICsgMV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghbmV4dCAmJiAhdGhpcy5hdEVuZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5leHQoJ2Jsb2NrLXNjYWxhcicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCA9PT0gJ1xcbicpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IC8vIGZhbGx0aHJvdWdoXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoICYmICF0aGlzLmF0RW5kKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgnYmxvY2stc2NhbGFyJyk7XG4gICAgICAgIGlmIChpbmRlbnQgPj0gdGhpcy5pbmRlbnROZXh0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ibG9ja1NjYWxhckluZGVudCA9PT0gLTEpXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnROZXh0ID0gaW5kZW50O1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnROZXh0ID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibG9ja1NjYWxhckluZGVudCArICh0aGlzLmluZGVudE5leHQgPT09IDAgPyAxIDogdGhpcy5pbmRlbnROZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjcyA9IHRoaXMuY29udGludWVTY2FsYXIobmwgKyAxKTtcbiAgICAgICAgICAgICAgICBpZiAoY3MgPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBubCA9IHRoaXMuYnVmZmVyLmluZGV4T2YoJ1xcbicsIGNzKTtcbiAgICAgICAgICAgIH0gd2hpbGUgKG5sICE9PSAtMSk7XG4gICAgICAgICAgICBpZiAobmwgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmF0RW5kKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXh0KCdibG9jay1zY2FsYXInKTtcbiAgICAgICAgICAgICAgICBubCA9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUcmFpbGluZyBpbnN1ZmZpY2llbnRseSBpbmRlbnRlZCB0YWJzIGFyZSBpbnZhbGlkLlxuICAgICAgICAvLyBUbyBjYXRjaCB0aGF0IGR1cmluZyBwYXJzaW5nLCB3ZSBpbmNsdWRlIHRoZW0gaW4gdGhlIGJsb2NrIHNjYWxhciB2YWx1ZS5cbiAgICAgICAgbGV0IGkgPSBubCArIDE7XG4gICAgICAgIGNoID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgIHdoaWxlIChjaCA9PT0gJyAnKVxuICAgICAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlclsrK2ldO1xuICAgICAgICBpZiAoY2ggPT09ICdcXHQnKSB7XG4gICAgICAgICAgICB3aGlsZSAoY2ggPT09ICdcXHQnIHx8IGNoID09PSAnICcgfHwgY2ggPT09ICdcXHInIHx8IGNoID09PSAnXFxuJylcbiAgICAgICAgICAgICAgICBjaCA9IHRoaXMuYnVmZmVyWysraV07XG4gICAgICAgICAgICBubCA9IGkgLSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF0aGlzLmJsb2NrU2NhbGFyS2VlcCkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGxldCBpID0gbmwgLSAxO1xuICAgICAgICAgICAgICAgIGxldCBjaCA9IHRoaXMuYnVmZmVyW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xccicpXG4gICAgICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbLS1pXTtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0Q2hhciA9IGk7IC8vIERyb3AgdGhlIGxpbmUgaWYgbGFzdCBjaGFyIG5vdCBtb3JlIGluZGVudGVkXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNoID09PSAnICcpXG4gICAgICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbLS1pXTtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcXG4nICYmIGkgPj0gdGhpcy5wb3MgJiYgaSArIDEgKyBpbmRlbnQgPiBsYXN0Q2hhcilcbiAgICAgICAgICAgICAgICAgICAgbmwgPSBpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB5aWVsZCBTQ0FMQVI7XG4gICAgICAgIHlpZWxkKiB0aGlzLnB1c2hUb0luZGV4KG5sICsgMSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZUxpbmVTdGFydCgpO1xuICAgIH1cbiAgICAqcGFyc2VQbGFpblNjYWxhcigpIHtcbiAgICAgICAgY29uc3QgaW5GbG93ID0gdGhpcy5mbG93TGV2ZWwgPiAwO1xuICAgICAgICBsZXQgZW5kID0gdGhpcy5wb3MgLSAxO1xuICAgICAgICBsZXQgaSA9IHRoaXMucG9zIC0gMTtcbiAgICAgICAgbGV0IGNoO1xuICAgICAgICB3aGlsZSAoKGNoID0gdGhpcy5idWZmZXJbKytpXSkpIHtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHRoaXMuYnVmZmVyW2kgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eShuZXh0KSB8fCAoaW5GbG93ICYmIGZsb3dJbmRpY2F0b3JDaGFycy5oYXMobmV4dCkpKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNFbXB0eShjaCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dCA9IHRoaXMuYnVmZmVyW2kgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcXHInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0ID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSAnXFxuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQgPSB0aGlzLmJ1ZmZlcltpICsgMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgPT09ICcjJyB8fCAoaW5GbG93ICYmIGZsb3dJbmRpY2F0b3JDaGFycy5oYXMobmV4dCkpKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNzID0gdGhpcy5jb250aW51ZVNjYWxhcihpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjcyA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgaSA9IE1hdGgubWF4KGksIGNzIC0gMik7IC8vIHRvIGFkdmFuY2UsIGJ1dCBzdGlsbCBhY2NvdW50IGZvciAnICMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGluRmxvdyAmJiBmbG93SW5kaWNhdG9yQ2hhcnMuaGFzKGNoKSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoICYmICF0aGlzLmF0RW5kKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgncGxhaW4tc2NhbGFyJyk7XG4gICAgICAgIHlpZWxkIFNDQUxBUjtcbiAgICAgICAgeWllbGQqIHRoaXMucHVzaFRvSW5kZXgoZW5kICsgMSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBpbkZsb3cgPyAnZmxvdycgOiAnZG9jJztcbiAgICB9XG4gICAgKnB1c2hDb3VudChuKSB7XG4gICAgICAgIGlmIChuID4gMCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5idWZmZXIuc3Vic3RyKHRoaXMucG9zLCBuKTtcbiAgICAgICAgICAgIHRoaXMucG9zICs9IG47XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgKnB1c2hUb0luZGV4KGksIGFsbG93RW1wdHkpIHtcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zLCBpKTtcbiAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICAgIHlpZWxkIHM7XG4gICAgICAgICAgICB0aGlzLnBvcyArPSBzLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhbGxvd0VtcHR5KVxuICAgICAgICAgICAgeWllbGQgJyc7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICAqcHVzaEluZGljYXRvcnMoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgICAgIHJldHVybiAoKHlpZWxkKiB0aGlzLnB1c2hUYWcoKSkgK1xuICAgICAgICAgICAgICAgICAgICAoeWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKSkgK1xuICAgICAgICAgICAgICAgICAgICAoeWllbGQqIHRoaXMucHVzaEluZGljYXRvcnMoKSkpO1xuICAgICAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICgoeWllbGQqIHRoaXMucHVzaFVudGlsKGlzTm90QW5jaG9yQ2hhcikpICtcbiAgICAgICAgICAgICAgICAgICAgKHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSkpICtcbiAgICAgICAgICAgICAgICAgICAgKHlpZWxkKiB0aGlzLnB1c2hJbmRpY2F0b3JzKCkpKTtcbiAgICAgICAgICAgIGNhc2UgJy0nOiAvLyB0aGlzIGlzIGFuIGVycm9yXG4gICAgICAgICAgICBjYXNlICc/JzogLy8gdGhpcyBpcyBhbiBlcnJvciBvdXRzaWRlIGZsb3cgY29sbGVjdGlvbnNcbiAgICAgICAgICAgIGNhc2UgJzonOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5GbG93ID0gdGhpcy5mbG93TGV2ZWwgPiAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoMSA9IHRoaXMuY2hhckF0KDEpO1xuICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5KGNoMSkgfHwgKGluRmxvdyAmJiBmbG93SW5kaWNhdG9yQ2hhcnMuaGFzKGNoMSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaW5GbG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnROZXh0ID0gdGhpcy5pbmRlbnRWYWx1ZSArIDE7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZmxvd0tleSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxvd0tleSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCh5aWVsZCogdGhpcy5wdXNoQ291bnQoMSkpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICh5aWVsZCogdGhpcy5wdXNoU3BhY2VzKHRydWUpKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAoeWllbGQqIHRoaXMucHVzaEluZGljYXRvcnMoKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgKnB1c2hUYWcoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoYXJBdCgxKSA9PT0gJzwnKSB7XG4gICAgICAgICAgICBsZXQgaSA9IHRoaXMucG9zICsgMjtcbiAgICAgICAgICAgIGxldCBjaCA9IHRoaXMuYnVmZmVyW2ldO1xuICAgICAgICAgICAgd2hpbGUgKCFpc0VtcHR5KGNoKSAmJiBjaCAhPT0gJz4nKVxuICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbKytpXTtcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wdXNoVG9JbmRleChjaCA9PT0gJz4nID8gaSArIDEgOiBpLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgaSA9IHRoaXMucG9zICsgMTtcbiAgICAgICAgICAgIGxldCBjaCA9IHRoaXMuYnVmZmVyW2ldO1xuICAgICAgICAgICAgd2hpbGUgKGNoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhZ0NoYXJzLmhhcyhjaCkpXG4gICAgICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbKytpXTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaCA9PT0gJyUnICYmXG4gICAgICAgICAgICAgICAgICAgIGhleERpZ2l0cy5oYXModGhpcy5idWZmZXJbaSArIDFdKSAmJlxuICAgICAgICAgICAgICAgICAgICBoZXhEaWdpdHMuaGFzKHRoaXMuYnVmZmVyW2kgKyAyXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlclsoaSArPSAzKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucHVzaFRvSW5kZXgoaSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgICpwdXNoTmV3bGluZSgpIHtcbiAgICAgICAgY29uc3QgY2ggPSB0aGlzLmJ1ZmZlclt0aGlzLnBvc107XG4gICAgICAgIGlmIChjaCA9PT0gJ1xcbicpXG4gICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucHVzaENvdW50KDEpO1xuICAgICAgICBlbHNlIGlmIChjaCA9PT0gJ1xccicgJiYgdGhpcy5jaGFyQXQoMSkgPT09ICdcXG4nKVxuICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgICpwdXNoU3BhY2VzKGFsbG93VGFicykge1xuICAgICAgICBsZXQgaSA9IHRoaXMucG9zIC0gMTtcbiAgICAgICAgbGV0IGNoO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjaCA9IHRoaXMuYnVmZmVyWysraV07XG4gICAgICAgIH0gd2hpbGUgKGNoID09PSAnICcgfHwgKGFsbG93VGFicyAmJiBjaCA9PT0gJ1xcdCcpKTtcbiAgICAgICAgY29uc3QgbiA9IGkgLSB0aGlzLnBvcztcbiAgICAgICAgaWYgKG4gPiAwKSB7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLmJ1ZmZlci5zdWJzdHIodGhpcy5wb3MsIG4pO1xuICAgICAgICAgICAgdGhpcy5wb3MgPSBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgIH1cbiAgICAqcHVzaFVudGlsKHRlc3QpIHtcbiAgICAgICAgbGV0IGkgPSB0aGlzLnBvcztcbiAgICAgICAgbGV0IGNoID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgIHdoaWxlICghdGVzdChjaCkpXG4gICAgICAgICAgICBjaCA9IHRoaXMuYnVmZmVyWysraV07XG4gICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wdXNoVG9JbmRleChpLCBmYWxzZSk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBMZXhlciB9O1xuIiwgIi8qKlxuICogVHJhY2tzIG5ld2xpbmVzIGR1cmluZyBwYXJzaW5nIGluIG9yZGVyIHRvIHByb3ZpZGUgYW4gZWZmaWNpZW50IEFQSSBmb3JcbiAqIGRldGVybWluaW5nIHRoZSBvbmUtaW5kZXhlZCBgeyBsaW5lLCBjb2wgfWAgcG9zaXRpb24gZm9yIGFueSBvZmZzZXRcbiAqIHdpdGhpbiB0aGUgaW5wdXQuXG4gKi9cbmNsYXNzIExpbmVDb3VudGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5saW5lU3RhcnRzID0gW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaG91bGQgYmUgY2FsbGVkIGluIGFzY2VuZGluZyBvcmRlci4gT3RoZXJ3aXNlLCBjYWxsXG4gICAgICAgICAqIGBsaW5lQ291bnRlci5saW5lU3RhcnRzLnNvcnQoKWAgYmVmb3JlIGNhbGxpbmcgYGxpbmVQb3MoKWAuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFkZE5ld0xpbmUgPSAob2Zmc2V0KSA9PiB0aGlzLmxpbmVTdGFydHMucHVzaChvZmZzZXQpO1xuICAgICAgICAvKipcbiAgICAgICAgICogUGVyZm9ybXMgYSBiaW5hcnkgc2VhcmNoIGFuZCByZXR1cm5zIHRoZSAxLWluZGV4ZWQgeyBsaW5lLCBjb2wgfVxuICAgICAgICAgKiBwb3NpdGlvbiBvZiBgb2Zmc2V0YC4gSWYgYGxpbmUgPT09IDBgLCBgYWRkTmV3TGluZWAgaGFzIG5ldmVyIGJlZW5cbiAgICAgICAgICogY2FsbGVkIG9yIGBvZmZzZXRgIGlzIGJlZm9yZSB0aGUgZmlyc3Qga25vd24gbmV3bGluZS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubGluZVBvcyA9IChvZmZzZXQpID0+IHtcbiAgICAgICAgICAgIGxldCBsb3cgPSAwO1xuICAgICAgICAgICAgbGV0IGhpZ2ggPSB0aGlzLmxpbmVTdGFydHMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtaWQgPSAobG93ICsgaGlnaCkgPj4gMTsgLy8gTWF0aC5mbG9vcigobG93ICsgaGlnaCkgLyAyKVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmVTdGFydHNbbWlkXSA8IG9mZnNldClcbiAgICAgICAgICAgICAgICAgICAgbG93ID0gbWlkICsgMTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGhpZ2ggPSBtaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5saW5lU3RhcnRzW2xvd10gPT09IG9mZnNldClcbiAgICAgICAgICAgICAgICByZXR1cm4geyBsaW5lOiBsb3cgKyAxLCBjb2w6IDEgfTtcbiAgICAgICAgICAgIGlmIChsb3cgPT09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbGluZTogMCwgY29sOiBvZmZzZXQgfTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5saW5lU3RhcnRzW2xvdyAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuIHsgbGluZTogbG93LCBjb2w6IG9mZnNldCAtIHN0YXJ0ICsgMSB9O1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IHsgTGluZUNvdW50ZXIgfTtcbiIsICJpbXBvcnQgeyB0b2tlblR5cGUgfSBmcm9tICcuL2NzdC5qcyc7XG5pbXBvcnQgeyBMZXhlciB9IGZyb20gJy4vbGV4ZXIuanMnO1xuXG5mdW5jdGlvbiBpbmNsdWRlc1Rva2VuKGxpc3QsIHR5cGUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpXG4gICAgICAgIGlmIChsaXN0W2ldLnR5cGUgPT09IHR5cGUpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBmaW5kTm9uRW1wdHlJbmRleChsaXN0KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN3aXRjaCAobGlzdFtpXS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5mdW5jdGlvbiBpc0Zsb3dUb2tlbih0b2tlbikge1xuICAgIHN3aXRjaCAodG9rZW4/LnR5cGUpIHtcbiAgICAgICAgY2FzZSAnYWxpYXMnOlxuICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICBjYXNlICdzaW5nbGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgIGNhc2UgJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgY2FzZSAnZmxvdy1jb2xsZWN0aW9uJzpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldFByZXZQcm9wcyhwYXJlbnQpIHtcbiAgICBzd2l0Y2ggKHBhcmVudC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2RvY3VtZW50JzpcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuc3RhcnQ7XG4gICAgICAgIGNhc2UgJ2Jsb2NrLW1hcCc6IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ID0gcGFyZW50Lml0ZW1zW3BhcmVudC5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiBpdC5zZXAgPz8gaXQuc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnYmxvY2stc2VxJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuaXRlbXNbcGFyZW50Lml0ZW1zLmxlbmd0aCAtIDFdLnN0YXJ0O1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbn1cbi8qKiBOb3RlOiBNYXkgbW9kaWZ5IGlucHV0IGFycmF5ICovXG5mdW5jdGlvbiBnZXRGaXJzdEtleVN0YXJ0UHJvcHMocHJldikge1xuICAgIGlmIChwcmV2Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIGxldCBpID0gcHJldi5sZW5ndGg7XG4gICAgbG9vcDogd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgIHN3aXRjaCAocHJldltpXS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdkb2Mtc3RhcnQnOlxuICAgICAgICAgICAgY2FzZSAnZXhwbGljaXQta2V5LWluZCc6XG4gICAgICAgICAgICBjYXNlICdtYXAtdmFsdWUtaW5kJzpcbiAgICAgICAgICAgIGNhc2UgJ3NlcS1pdGVtLWluZCc6XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChwcmV2WysraV0/LnR5cGUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgLyogbG9vcCAqL1xuICAgIH1cbiAgICByZXR1cm4gcHJldi5zcGxpY2UoaSwgcHJldi5sZW5ndGgpO1xufVxuZnVuY3Rpb24gZml4Rmxvd1NlcUl0ZW1zKGZjKSB7XG4gICAgaWYgKGZjLnN0YXJ0LnR5cGUgPT09ICdmbG93LXNlcS1zdGFydCcpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdCBvZiBmYy5pdGVtcykge1xuICAgICAgICAgICAgaWYgKGl0LnNlcCAmJlxuICAgICAgICAgICAgICAgICFpdC52YWx1ZSAmJlxuICAgICAgICAgICAgICAgICFpbmNsdWRlc1Rva2VuKGl0LnN0YXJ0LCAnZXhwbGljaXQta2V5LWluZCcpICYmXG4gICAgICAgICAgICAgICAgIWluY2x1ZGVzVG9rZW4oaXQuc2VwLCAnbWFwLXZhbHVlLWluZCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0LmtleSlcbiAgICAgICAgICAgICAgICAgICAgaXQudmFsdWUgPSBpdC5rZXk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0LmtleTtcbiAgICAgICAgICAgICAgICBpZiAoaXNGbG93VG9rZW4oaXQudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdC52YWx1ZS5lbmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShpdC52YWx1ZS5lbmQsIGl0LnNlcCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnZhbHVlLmVuZCA9IGl0LnNlcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShpdC5zdGFydCwgaXQuc2VwKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgaXQuc2VwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBBIFlBTUwgY29uY3JldGUgc3ludGF4IHRyZWUgKENTVCkgcGFyc2VyXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IHNyYzogc3RyaW5nID0gLi4uXG4gKiBmb3IgKGNvbnN0IHRva2VuIG9mIG5ldyBQYXJzZXIoKS5wYXJzZShzcmMpKSB7XG4gKiAgIC8vIHRva2VuOiBUb2tlblxuICogfVxuICogYGBgXG4gKlxuICogVG8gdXNlIHRoZSBwYXJzZXIgd2l0aCBhIHVzZXItcHJvdmlkZWQgbGV4ZXI6XG4gKlxuICogYGBgdHNcbiAqIGZ1bmN0aW9uKiBwYXJzZShzb3VyY2U6IHN0cmluZywgbGV4ZXI6IExleGVyKSB7XG4gKiAgIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIoKVxuICogICBmb3IgKGNvbnN0IGxleGVtZSBvZiBsZXhlci5sZXgoc291cmNlKSlcbiAqICAgICB5aWVsZCogcGFyc2VyLm5leHQobGV4ZW1lKVxuICogICB5aWVsZCogcGFyc2VyLmVuZCgpXG4gKiB9XG4gKlxuICogY29uc3Qgc3JjOiBzdHJpbmcgPSAuLi5cbiAqIGNvbnN0IGxleGVyID0gbmV3IExleGVyKClcbiAqIGZvciAoY29uc3QgdG9rZW4gb2YgcGFyc2Uoc3JjLCBsZXhlcikpIHtcbiAqICAgLy8gdG9rZW46IFRva2VuXG4gKiB9XG4gKiBgYGBcbiAqL1xuY2xhc3MgUGFyc2VyIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb25OZXdMaW5lIC0gSWYgZGVmaW5lZCwgY2FsbGVkIHNlcGFyYXRlbHkgd2l0aCB0aGUgc3RhcnQgcG9zaXRpb24gb2ZcbiAgICAgKiAgIGVhY2ggbmV3IGxpbmUgKGluIGBwYXJzZSgpYCwgaW5jbHVkaW5nIHRoZSBzdGFydCBvZiBpbnB1dCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob25OZXdMaW5lKSB7XG4gICAgICAgIC8qKiBJZiB0cnVlLCBzcGFjZSBhbmQgc2VxdWVuY2UgaW5kaWNhdG9ycyBjb3VudCBhcyBpbmRlbnRhdGlvbiAqL1xuICAgICAgICB0aGlzLmF0TmV3TGluZSA9IHRydWU7XG4gICAgICAgIC8qKiBJZiB0cnVlLCBuZXh0IHRva2VuIGlzIGEgc2NhbGFyIHZhbHVlICovXG4gICAgICAgIHRoaXMuYXRTY2FsYXIgPSBmYWxzZTtcbiAgICAgICAgLyoqIEN1cnJlbnQgaW5kZW50YXRpb24gbGV2ZWwgKi9cbiAgICAgICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgICAgICAvKiogQ3VycmVudCBvZmZzZXQgc2luY2UgdGhlIHN0YXJ0IG9mIHBhcnNpbmcgKi9cbiAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgICAgICAvKiogT24gdGhlIHNhbWUgbGluZSB3aXRoIGEgYmxvY2sgbWFwIGtleSAqL1xuICAgICAgICB0aGlzLm9uS2V5TGluZSA9IGZhbHNlO1xuICAgICAgICAvKiogVG9wIGluZGljYXRlcyB0aGUgbm9kZSB0aGF0J3MgY3VycmVudGx5IGJlaW5nIGJ1aWx0ICovXG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICAgICAgLyoqIFRoZSBzb3VyY2Ugb2YgdGhlIGN1cnJlbnQgdG9rZW4sIHNldCBpbiBwYXJzZSgpICovXG4gICAgICAgIHRoaXMuc291cmNlID0gJyc7XG4gICAgICAgIC8qKiBUaGUgdHlwZSBvZiB0aGUgY3VycmVudCB0b2tlbiwgc2V0IGluIHBhcnNlKCkgKi9cbiAgICAgICAgdGhpcy50eXBlID0gJyc7XG4gICAgICAgIC8vIE11c3QgYmUgZGVmaW5lZCBhZnRlciBgbmV4dCgpYFxuICAgICAgICB0aGlzLmxleGVyID0gbmV3IExleGVyKCk7XG4gICAgICAgIHRoaXMub25OZXdMaW5lID0gb25OZXdMaW5lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQYXJzZSBgc291cmNlYCBhcyBhIFlBTUwgc3RyZWFtLlxuICAgICAqIElmIGBpbmNvbXBsZXRlYCwgYSBwYXJ0IG9mIHRoZSBsYXN0IGxpbmUgbWF5IGJlIGxlZnQgYXMgYSBidWZmZXIgZm9yIHRoZSBuZXh0IGNhbGwuXG4gICAgICpcbiAgICAgKiBFcnJvcnMgYXJlIG5vdCB0aHJvd24sIGJ1dCB5aWVsZGVkIGFzIGB7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UgfWAgdG9rZW5zLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSBnZW5lcmF0b3Igb2YgdG9rZW5zIHJlcHJlc2VudGluZyBlYWNoIGRpcmVjdGl2ZSwgZG9jdW1lbnQsIGFuZCBvdGhlciBzdHJ1Y3R1cmUuXG4gICAgICovXG4gICAgKnBhcnNlKHNvdXJjZSwgaW5jb21wbGV0ZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLm9uTmV3TGluZSAmJiB0aGlzLm9mZnNldCA9PT0gMClcbiAgICAgICAgICAgIHRoaXMub25OZXdMaW5lKDApO1xuICAgICAgICBmb3IgKGNvbnN0IGxleGVtZSBvZiB0aGlzLmxleGVyLmxleChzb3VyY2UsIGluY29tcGxldGUpKVxuICAgICAgICAgICAgeWllbGQqIHRoaXMubmV4dChsZXhlbWUpO1xuICAgICAgICBpZiAoIWluY29tcGxldGUpXG4gICAgICAgICAgICB5aWVsZCogdGhpcy5lbmQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWR2YW5jZSB0aGUgcGFyc2VyIGJ5IHRoZSBgc291cmNlYCBvZiBvbmUgbGV4aWNhbCB0b2tlbi5cbiAgICAgKi9cbiAgICAqbmV4dChzb3VyY2UpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIGlmICh0aGlzLmF0U2NhbGFyKSB7XG4gICAgICAgICAgICB0aGlzLmF0U2NhbGFyID0gZmFsc2U7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCArPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHR5cGUgPSB0b2tlblR5cGUoc291cmNlKTtcbiAgICAgICAgaWYgKCF0eXBlKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYE5vdCBhIFlBTUwgdG9rZW46ICR7c291cmNlfWA7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoeyB0eXBlOiAnZXJyb3InLCBvZmZzZXQ6IHRoaXMub2Zmc2V0LCBtZXNzYWdlLCBzb3VyY2UgfSk7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCArPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdzY2FsYXInKSB7XG4gICAgICAgICAgICB0aGlzLmF0TmV3TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5hdFNjYWxhciA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSAnc2NhbGFyJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdE5ld0xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uTmV3TGluZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25OZXdMaW5lKHRoaXMub2Zmc2V0ICsgc291cmNlLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYXROZXdMaW5lICYmIHNvdXJjZVswXSA9PT0gJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgKz0gc291cmNlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZXhwbGljaXQta2V5LWluZCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnbWFwLXZhbHVlLWluZCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnc2VxLWl0ZW0taW5kJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYXROZXdMaW5lKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgKz0gc291cmNlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZG9jLW1vZGUnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zsb3ctZXJyb3ItZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXROZXdMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9mZnNldCArPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKiBDYWxsIGF0IGVuZCBvZiBpbnB1dCB0byBwdXNoIG91dCBhbnkgcmVtYWluaW5nIGNvbnN0cnVjdGlvbnMgKi9cbiAgICAqZW5kKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5zdGFjay5sZW5ndGggPiAwKVxuICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgfVxuICAgIGdldCBzb3VyY2VUb2tlbigpIHtcbiAgICAgICAgY29uc3Qgc3QgPSB7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2VcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHN0O1xuICAgIH1cbiAgICAqc3RlcCgpIHtcbiAgICAgICAgY29uc3QgdG9wID0gdGhpcy5wZWVrKDEpO1xuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnZG9jLWVuZCcgJiYgdG9wPy50eXBlICE9PSAnZG9jLWVuZCcpIHtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLnN0YWNrLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdkb2MtZW5kJyxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdG9wKVxuICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnN0cmVhbSgpO1xuICAgICAgICBzd2l0Y2ggKHRvcC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdkb2N1bWVudCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLmRvY3VtZW50KHRvcCk7XG4gICAgICAgICAgICBjYXNlICdhbGlhcyc6XG4gICAgICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICAgICAgY2FzZSAnc2luZ2xlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICAgICAgY2FzZSAnZG91YmxlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5zY2FsYXIodG9wKTtcbiAgICAgICAgICAgIGNhc2UgJ2Jsb2NrLXNjYWxhcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLmJsb2NrU2NhbGFyKHRvcCk7XG4gICAgICAgICAgICBjYXNlICdibG9jay1tYXAnOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5ibG9ja01hcCh0b3ApO1xuICAgICAgICAgICAgY2FzZSAnYmxvY2stc2VxJzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMuYmxvY2tTZXF1ZW5jZSh0b3ApO1xuICAgICAgICAgICAgY2FzZSAnZmxvdy1jb2xsZWN0aW9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMuZmxvd0NvbGxlY3Rpb24odG9wKTtcbiAgICAgICAgICAgIGNhc2UgJ2RvYy1lbmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5kb2N1bWVudEVuZCh0b3ApO1xuICAgICAgICB9XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgIH1cbiAgICBwZWVrKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSBuXTtcbiAgICB9XG4gICAgKnBvcChlcnJvcikge1xuICAgICAgICBjb25zdCB0b2tlbiA9IGVycm9yID8/IHRoaXMuc3RhY2sucG9wKCk7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJ1RyaWVkIHRvIHBvcCBhbiBlbXB0eSBzdGFjayc7XG4gICAgICAgICAgICB5aWVsZCB7IHR5cGU6ICdlcnJvcicsIG9mZnNldDogdGhpcy5vZmZzZXQsIHNvdXJjZTogJycsIG1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgeWllbGQgdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB0b3AgPSB0aGlzLnBlZWsoMSk7XG4gICAgICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gJ2Jsb2NrLXNjYWxhcicpIHtcbiAgICAgICAgICAgICAgICAvLyBCbG9jayBzY2FsYXJzIHVzZSB0aGVpciBwYXJlbnQgcmF0aGVyIHRoYW4gaGVhZGVyIGluZGVudFxuICAgICAgICAgICAgICAgIHRva2VuLmluZGVudCA9ICdpbmRlbnQnIGluIHRvcCA/IHRvcC5pbmRlbnQgOiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gJ2Zsb3ctY29sbGVjdGlvbicgJiYgdG9wLnR5cGUgPT09ICdkb2N1bWVudCcpIHtcbiAgICAgICAgICAgICAgICAvLyBJZ25vcmUgYWxsIGluZGVudCBmb3IgdG9wLWxldmVsIGZsb3cgY29sbGVjdGlvbnNcbiAgICAgICAgICAgICAgICB0b2tlbi5pbmRlbnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICdmbG93LWNvbGxlY3Rpb24nKVxuICAgICAgICAgICAgICAgIGZpeEZsb3dTZXFJdGVtcyh0b2tlbik7XG4gICAgICAgICAgICBzd2l0Y2ggKHRvcC50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZG9jdW1lbnQnOlxuICAgICAgICAgICAgICAgICAgICB0b3AudmFsdWUgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYmxvY2stc2NhbGFyJzpcbiAgICAgICAgICAgICAgICAgICAgdG9wLnByb3BzLnB1c2godG9rZW4pOyAvLyBlcnJvclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdibG9jay1tYXAnOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ID0gdG9wLml0ZW1zW3RvcC5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AuaXRlbXMucHVzaCh7IHN0YXJ0OiBbXSwga2V5OiB0b2tlbiwgc2VwOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25LZXlMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC5zZXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnZhbHVlID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGl0LCB7IGtleTogdG9rZW4sIHNlcDogW10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9ICFpdC5leHBsaWNpdEtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnYmxvY2stc2VxJzoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdCA9IHRvcC5pdGVtc1t0b3AuaXRlbXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcC5pdGVtcy5wdXNoKHsgc3RhcnQ6IFtdLCB2YWx1ZTogdG9rZW4gfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnZhbHVlID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdmbG93LWNvbGxlY3Rpb24nOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ID0gdG9wLml0ZW1zW3RvcC5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdCB8fCBpdC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcC5pdGVtcy5wdXNoKHsgc3RhcnQ6IFtdLCBrZXk6IHRva2VuLCBzZXA6IFtdIH0pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC5zZXApXG4gICAgICAgICAgICAgICAgICAgICAgICBpdC52YWx1ZSA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGl0LCB7IGtleTogdG9rZW4sIHNlcDogW10gfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgc2hvdWxkIG5vdCBoYXBwZW4gKi9cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgodG9wLnR5cGUgPT09ICdkb2N1bWVudCcgfHxcbiAgICAgICAgICAgICAgICB0b3AudHlwZSA9PT0gJ2Jsb2NrLW1hcCcgfHxcbiAgICAgICAgICAgICAgICB0b3AudHlwZSA9PT0gJ2Jsb2NrLXNlcScpICYmXG4gICAgICAgICAgICAgICAgKHRva2VuLnR5cGUgPT09ICdibG9jay1tYXAnIHx8IHRva2VuLnR5cGUgPT09ICdibG9jay1zZXEnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3QgPSB0b2tlbi5pdGVtc1t0b2tlbi5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdCAmJlxuICAgICAgICAgICAgICAgICAgICAhbGFzdC5zZXAgJiZcbiAgICAgICAgICAgICAgICAgICAgIWxhc3QudmFsdWUgJiZcbiAgICAgICAgICAgICAgICAgICAgbGFzdC5zdGFydC5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZpbmROb25FbXB0eUluZGV4KGxhc3Quc3RhcnQpID09PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICAodG9rZW4uaW5kZW50ID09PSAwIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0LnN0YXJ0LmV2ZXJ5KHN0ID0+IHN0LnR5cGUgIT09ICdjb21tZW50JyB8fCBzdC5pbmRlbnQgPCB0b2tlbi5pbmRlbnQpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9wLnR5cGUgPT09ICdkb2N1bWVudCcpXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AuZW5kID0gbGFzdC5zdGFydDtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wLml0ZW1zLnB1c2goeyBzdGFydDogbGFzdC5zdGFydCB9KTtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4uaXRlbXMuc3BsaWNlKC0xLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgKnN0cmVhbSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGl2ZS1saW5lJzpcbiAgICAgICAgICAgICAgICB5aWVsZCB7IHR5cGU6ICdkaXJlY3RpdmUnLCBvZmZzZXQ6IHRoaXMub2Zmc2V0LCBzb3VyY2U6IHRoaXMuc291cmNlIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnYnl0ZS1vcmRlci1tYXJrJzpcbiAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5zb3VyY2VUb2tlbjtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdkb2MtbW9kZSc6XG4gICAgICAgICAgICBjYXNlICdkb2Mtc3RhcnQnOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZG9jID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZG9jdW1lbnQnLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBzdGFydDogW11cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdkb2Mtc3RhcnQnKVxuICAgICAgICAgICAgICAgICAgICBkb2Muc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goZG9jKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgeWllbGQge1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICBtZXNzYWdlOiBgVW5leHBlY3RlZCAke3RoaXMudHlwZX0gdG9rZW4gaW4gWUFNTCBzdHJlYW1gLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZVxuICAgICAgICB9O1xuICAgIH1cbiAgICAqZG9jdW1lbnQoZG9jKSB7XG4gICAgICAgIGlmIChkb2MudmFsdWUpXG4gICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMubGluZUVuZChkb2MpO1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnZG9jLXN0YXJ0Jzoge1xuICAgICAgICAgICAgICAgIGlmIChmaW5kTm9uRW1wdHlJbmRleChkb2Muc3RhcnQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQqIHRoaXMuc3RlcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGRvYy5zdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvcic6XG4gICAgICAgICAgICBjYXNlICd0YWcnOlxuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICBkb2Muc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYnYgPSB0aGlzLnN0YXJ0QmxvY2tWYWx1ZShkb2MpO1xuICAgICAgICBpZiAoYnYpXG4gICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goYnYpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHlpZWxkIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYFVuZXhwZWN0ZWQgJHt0aGlzLnR5cGV9IHRva2VuIGluIFlBTUwgZG9jdW1lbnRgLFxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgKnNjYWxhcihzY2FsYXIpIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21hcC12YWx1ZS1pbmQnKSB7XG4gICAgICAgICAgICBjb25zdCBwcmV2ID0gZ2V0UHJldlByb3BzKHRoaXMucGVlaygyKSk7XG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IGdldEZpcnN0S2V5U3RhcnRQcm9wcyhwcmV2KTtcbiAgICAgICAgICAgIGxldCBzZXA7XG4gICAgICAgICAgICBpZiAoc2NhbGFyLmVuZCkge1xuICAgICAgICAgICAgICAgIHNlcCA9IHNjYWxhci5lbmQ7XG4gICAgICAgICAgICAgICAgc2VwLnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHNjYWxhci5lbmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2VwID0gW3RoaXMuc291cmNlVG9rZW5dO1xuICAgICAgICAgICAgY29uc3QgbWFwID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgIG9mZnNldDogc2NhbGFyLm9mZnNldCxcbiAgICAgICAgICAgICAgICBpbmRlbnQ6IHNjYWxhci5pbmRlbnQsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFt7IHN0YXJ0LCBrZXk6IHNjYWxhciwgc2VwIH1dXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdID0gbWFwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHlpZWxkKiB0aGlzLmxpbmVFbmQoc2NhbGFyKTtcbiAgICB9XG4gICAgKmJsb2NrU2NhbGFyKHNjYWxhcikge1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICBzY2FsYXIucHJvcHMucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICAgICAgICAgIHNjYWxhci5zb3VyY2UgPSB0aGlzLnNvdXJjZTtcbiAgICAgICAgICAgICAgICAvLyBibG9jay1zY2FsYXIgc291cmNlIGluY2x1ZGVzIHRyYWlsaW5nIG5ld2xpbmVcbiAgICAgICAgICAgICAgICB0aGlzLmF0TmV3TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uTmV3TGluZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmwgPSB0aGlzLnNvdXJjZS5pbmRleE9mKCdcXG4nKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChubCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk5ld0xpbmUodGhpcy5vZmZzZXQgKyBubCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBubCA9IHRoaXMuc291cmNlLmluZGV4T2YoJ1xcbicsIG5sKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKmJsb2NrTWFwKG1hcCkge1xuICAgICAgICBjb25zdCBpdCA9IG1hcC5pdGVtc1ttYXAuaXRlbXMubGVuZ3RoIC0gMV07XG4gICAgICAgIC8vIGl0LnNlcCBpcyB0cnVlLWlzaCBpZiBwYWlyIGFscmVhZHkgaGFzIGtleSBvciA6IHNlcGFyYXRvclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoaXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kID0gJ2VuZCcgaW4gaXQudmFsdWUgPyBpdC52YWx1ZS5lbmQgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBBcnJheS5pc0FycmF5KGVuZCkgPyBlbmRbZW5kLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdD8udHlwZSA9PT0gJ2NvbW1lbnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kPy5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaCh7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcCkge1xuICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgIGlmIChpdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaCh7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcCkge1xuICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0SW5kZW50ZWRDb21tZW50KGl0LnN0YXJ0LCBtYXAuaW5kZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IG1hcC5pdGVtc1ttYXAuaXRlbXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBwcmV2Py52YWx1ZT8uZW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZW5kKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGVuZCwgaXQuc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmluZGVudCA+PSBtYXAuaW5kZW50KSB7XG4gICAgICAgICAgICBjb25zdCBhdE1hcEluZGVudCA9ICF0aGlzLm9uS2V5TGluZSAmJiB0aGlzLmluZGVudCA9PT0gbWFwLmluZGVudDtcbiAgICAgICAgICAgIGNvbnN0IGF0TmV4dEl0ZW0gPSBhdE1hcEluZGVudCAmJlxuICAgICAgICAgICAgICAgIChpdC5zZXAgfHwgaXQuZXhwbGljaXRLZXkpICYmXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlICE9PSAnc2VxLWl0ZW0taW5kJztcbiAgICAgICAgICAgIC8vIEZvciBlbXB0eSBub2RlcywgYXNzaWduIG5ld2xpbmUtc2VwYXJhdGVkIG5vdCBpbmRlbnRlZCBlbXB0eSB0b2tlbnMgdG8gZm9sbG93aW5nIG5vZGVcbiAgICAgICAgICAgIGxldCBzdGFydCA9IFtdO1xuICAgICAgICAgICAgaWYgKGF0TmV4dEl0ZW0gJiYgaXQuc2VwICYmICFpdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5sID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdC5zZXAubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3QgPSBpdC5zZXBbaV07XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoc3QudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmwucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdC5pbmRlbnQgPiBtYXAuaW5kZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBubC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBubC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChubC5sZW5ndGggPj0gMilcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBpdC5zZXAuc3BsaWNlKG5sWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYW5jaG9yJzpcbiAgICAgICAgICAgICAgICBjYXNlICd0YWcnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoYXROZXh0SXRlbSB8fCBpdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXQuc2VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2V4cGxpY2l0LWtleS1pbmQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0LnNlcCAmJiAhaXQuZXhwbGljaXRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5leHBsaWNpdEtleSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYXROZXh0SXRlbSB8fCBpdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQsIGV4cGxpY2l0S2V5OiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYmxvY2stbWFwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0sIGV4cGxpY2l0S2V5OiB0cnVlIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjYXNlICdtYXAtdmFsdWUtaW5kJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0LmV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0LnNlcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNsdWRlc1Rva2VuKGl0LnN0YXJ0LCAnbmV3bGluZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaXQsIHsga2V5OiBudWxsLCBzZXA6IFt0aGlzLnNvdXJjZVRva2VuXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gZ2V0Rmlyc3RLZXlTdGFydFByb3BzKGl0LnN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW3sgc3RhcnQsIGtleTogbnVsbCwgc2VwOiBbdGhpcy5zb3VyY2VUb2tlbl0gfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaCh7IHN0YXJ0OiBbXSwga2V5OiBudWxsLCBzZXA6IFt0aGlzLnNvdXJjZVRva2VuXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGluY2x1ZGVzVG9rZW4oaXQuc2VwLCAnbWFwLXZhbHVlLWluZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLW1hcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydCwga2V5OiBudWxsLCBzZXA6IFt0aGlzLnNvdXJjZVRva2VuXSB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNGbG93VG9rZW4oaXQua2V5KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpbmNsdWRlc1Rva2VuKGl0LnNlcCwgJ25ld2xpbmUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gZ2V0Rmlyc3RLZXlTdGFydFByb3BzKGl0LnN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBpdC5rZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VwID0gaXQuc2VwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgdHlwZSBndWFyZCBpcyB3cm9uZyBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGl0LmtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHR5cGUgZ3VhcmQgaXMgd3JvbmcgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpdC5zZXA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLW1hcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydCwga2V5LCBzZXAgfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHN0YXJ0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3QgYWN0dWFsbHkgYXQgbmV4dCBpdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXQuc2VwID0gaXQuc2VwLmNvbmNhdChzdGFydCwgdGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXQuc2VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihpdCwgeyBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXQudmFsdWUgfHwgYXROZXh0SXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQsIGtleTogbnVsbCwgc2VwOiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpbmNsdWRlc1Rva2VuKGl0LnNlcCwgJ21hcC12YWx1ZS1pbmQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6IHRoaXMuaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW3sgc3RhcnQ6IFtdLCBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjYXNlICdhbGlhcyc6XG4gICAgICAgICAgICAgICAgY2FzZSAnc2NhbGFyJzpcbiAgICAgICAgICAgICAgICBjYXNlICdzaW5nbGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICAgICAgY2FzZSAnZG91YmxlLXF1b3RlZC1zY2FsYXInOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZzID0gdGhpcy5mbG93U2NhbGFyKHRoaXMudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdE5leHRJdGVtIHx8IGl0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaCh7IHN0YXJ0LCBrZXk6IGZzLCBzZXA6IFtdIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKGZzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaXQsIHsga2V5OiBmcywgc2VwOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25LZXlMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnYgPSB0aGlzLnN0YXJ0QmxvY2tWYWx1ZShtYXApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidi50eXBlID09PSAnYmxvY2stc2VxJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXQuZXhwbGljaXRLZXkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXQuc2VwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpbmNsdWRlc1Rva2VuKGl0LnNlcCwgJ25ld2xpbmUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3Aoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5leHBlY3RlZCBibG9jay1zZXEtaW5kIG9uIHNhbWUgbGluZSB3aXRoIGtleScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYXRNYXBJbmRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaCh7IHN0YXJ0IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKGJ2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgeWllbGQqIHRoaXMuc3RlcCgpO1xuICAgIH1cbiAgICAqYmxvY2tTZXF1ZW5jZShzZXEpIHtcbiAgICAgICAgY29uc3QgaXQgPSBzZXEuaXRlbXNbc2VxLml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZCA9ICdlbmQnIGluIGl0LnZhbHVlID8gaXQudmFsdWUuZW5kIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0ID0gQXJyYXkuaXNBcnJheShlbmQpID8gZW5kW2VuZC5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3Q/LnR5cGUgPT09ICdjb21tZW50JylcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZD8ucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VxLml0ZW1zLnB1c2goeyBzdGFydDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICBzZXEuaXRlbXMucHVzaCh7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0SW5kZW50ZWRDb21tZW50KGl0LnN0YXJ0LCBzZXEuaW5kZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IHNlcS5pdGVtc1tzZXEuaXRlbXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBwcmV2Py52YWx1ZT8uZW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZW5kKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGVuZCwgaXQuc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcS5pdGVtcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnYW5jaG9yJzpcbiAgICAgICAgICAgIGNhc2UgJ3RhZyc6XG4gICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlIHx8IHRoaXMuaW5kZW50IDw9IHNlcS5pbmRlbnQpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnc2VxLWl0ZW0taW5kJzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmRlbnQgIT09IHNlcS5pbmRlbnQpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGlmIChpdC52YWx1ZSB8fCBpbmNsdWRlc1Rva2VuKGl0LnN0YXJ0LCAnc2VxLWl0ZW0taW5kJykpXG4gICAgICAgICAgICAgICAgICAgIHNlcS5pdGVtcy5wdXNoKHsgc3RhcnQ6IFt0aGlzLnNvdXJjZVRva2VuXSB9KTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmluZGVudCA+IHNlcS5pbmRlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ2ID0gdGhpcy5zdGFydEJsb2NrVmFsdWUoc2VxKTtcbiAgICAgICAgICAgIGlmIChidikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaChidik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgfVxuICAgICpmbG93Q29sbGVjdGlvbihmYykge1xuICAgICAgICBjb25zdCBpdCA9IGZjLml0ZW1zW2ZjLml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnZmxvdy1lcnJvci1lbmQnKSB7XG4gICAgICAgICAgICBsZXQgdG9wO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHRvcCA9IHRoaXMucGVlaygxKTtcbiAgICAgICAgICAgIH0gd2hpbGUgKHRvcD8udHlwZSA9PT0gJ2Zsb3ctY29sbGVjdGlvbicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZjLmVuZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29tbWEnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2V4cGxpY2l0LWtleS1pbmQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0IHx8IGl0LnNlcClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZjLml0ZW1zLnB1c2goeyBzdGFydDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5zdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY2FzZSAnbWFwLXZhbHVlLWluZCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXQgfHwgaXQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBmYy5pdGVtcy5wdXNoKHsgc3RhcnQ6IFtdLCBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC5zZXApXG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihpdCwgeyBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2FuY2hvcic6XG4gICAgICAgICAgICAgICAgY2FzZSAndGFnJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdCB8fCBpdC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGZjLml0ZW1zLnB1c2goeyBzdGFydDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC5zZXApXG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FsaWFzJzpcbiAgICAgICAgICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3NpbmdsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgICAgICAgICBjYXNlICdkb3VibGUtcXVvdGVkLXNjYWxhcic6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnMgPSB0aGlzLmZsb3dTY2FsYXIodGhpcy50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdCB8fCBpdC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGZjLml0ZW1zLnB1c2goeyBzdGFydDogW10sIGtleTogZnMsIHNlcDogW10gfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaChmcyk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaXQsIHsga2V5OiBmcywgc2VwOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdmbG93LW1hcC1lbmQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zsb3ctc2VxLWVuZCc6XG4gICAgICAgICAgICAgICAgICAgIGZjLmVuZC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBidiA9IHRoaXMuc3RhcnRCbG9ja1ZhbHVlKGZjKTtcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlIHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgICAgICAgICBpZiAoYnYpXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKGJ2KTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnN0ZXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMucGVlaygyKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnQudHlwZSA9PT0gJ2Jsb2NrLW1hcCcgJiZcbiAgICAgICAgICAgICAgICAoKHRoaXMudHlwZSA9PT0gJ21hcC12YWx1ZS1pbmQnICYmIHBhcmVudC5pbmRlbnQgPT09IGZjLmluZGVudCkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMudHlwZSA9PT0gJ25ld2xpbmUnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhcGFyZW50Lml0ZW1zW3BhcmVudC5pdGVtcy5sZW5ndGggLSAxXS5zZXApKSkge1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnN0ZXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ21hcC12YWx1ZS1pbmQnICYmXG4gICAgICAgICAgICAgICAgcGFyZW50LnR5cGUgIT09ICdmbG93LWNvbGxlY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IGdldFByZXZQcm9wcyhwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gZ2V0Rmlyc3RLZXlTdGFydFByb3BzKHByZXYpO1xuICAgICAgICAgICAgICAgIGZpeEZsb3dTZXFJdGVtcyhmYyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VwID0gZmMuZW5kLnNwbGljZSgxLCBmYy5lbmQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBzZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IGZjLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50OiBmYy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydCwga2V5OiBmYywgc2VwIH1dXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdID0gbWFwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMubGluZUVuZChmYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmxvd1NjYWxhcih0eXBlKSB7XG4gICAgICAgIGlmICh0aGlzLm9uTmV3TGluZSkge1xuICAgICAgICAgICAgbGV0IG5sID0gdGhpcy5zb3VyY2UuaW5kZXhPZignXFxuJykgKyAxO1xuICAgICAgICAgICAgd2hpbGUgKG5sICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk5ld0xpbmUodGhpcy5vZmZzZXQgKyBubCk7XG4gICAgICAgICAgICAgICAgbmwgPSB0aGlzLnNvdXJjZS5pbmRleE9mKCdcXG4nLCBubCkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlXG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXJ0QmxvY2tWYWx1ZShwYXJlbnQpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2FsaWFzJzpcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgICAgICBjYXNlICdzaW5nbGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICBjYXNlICdkb3VibGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1NjYWxhcih0aGlzLnR5cGUpO1xuICAgICAgICAgICAgY2FzZSAnYmxvY2stc2NhbGFyLWhlYWRlcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLXNjYWxhcicsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiBbdGhpcy5zb3VyY2VUb2tlbl0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogJydcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2FzZSAnZmxvdy1tYXAtc3RhcnQnOlxuICAgICAgICAgICAgY2FzZSAnZmxvdy1zZXEtc3RhcnQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdmbG93LWNvbGxlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6IHRoaXMuaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICBzdGFydDogdGhpcy5zb3VyY2VUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBlbmQ6IFtdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhc2UgJ3NlcS1pdGVtLWluZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLXNlcScsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydDogW3RoaXMuc291cmNlVG9rZW5dIH1dXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhc2UgJ2V4cGxpY2l0LWtleS1pbmQnOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXYgPSBnZXRQcmV2UHJvcHMocGFyZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IGdldEZpcnN0S2V5U3RhcnRQcm9wcyhwcmV2KTtcbiAgICAgICAgICAgICAgICBzdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6IHRoaXMuaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW3sgc3RhcnQsIGV4cGxpY2l0S2V5OiB0cnVlIH1dXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ21hcC12YWx1ZS1pbmQnOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXYgPSBnZXRQcmV2UHJvcHMocGFyZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IGdldEZpcnN0S2V5U3RhcnRQcm9wcyhwcmV2KTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYmxvY2stbWFwJyxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7IHN0YXJ0LCBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH1dXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgYXRJbmRlbnRlZENvbW1lbnQoc3RhcnQsIGluZGVudCkge1xuICAgICAgICBpZiAodGhpcy50eXBlICE9PSAnY29tbWVudCcpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmluZGVudCA8PSBpbmRlbnQpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBzdGFydC5ldmVyeShzdCA9PiBzdC50eXBlID09PSAnbmV3bGluZScgfHwgc3QudHlwZSA9PT0gJ3NwYWNlJyk7XG4gICAgfVxuICAgICpkb2N1bWVudEVuZChkb2NFbmQpIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gJ2RvYy1tb2RlJykge1xuICAgICAgICAgICAgaWYgKGRvY0VuZC5lbmQpXG4gICAgICAgICAgICAgICAgZG9jRW5kLmVuZC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRvY0VuZC5lbmQgPSBbdGhpcy5zb3VyY2VUb2tlbl07XG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnbmV3bGluZScpXG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKmxpbmVFbmQodG9rZW4pIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1hJzpcbiAgICAgICAgICAgIGNhc2UgJ2RvYy1zdGFydCc6XG4gICAgICAgICAgICBjYXNlICdkb2MtZW5kJzpcbiAgICAgICAgICAgIGNhc2UgJ2Zsb3ctc2VxLWVuZCc6XG4gICAgICAgICAgICBjYXNlICdmbG93LW1hcC1lbmQnOlxuICAgICAgICAgICAgY2FzZSAnbWFwLXZhbHVlLWluZCc6XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMuc3RlcCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIGZhbGx0aHJvdWdoXG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gYWxsIG90aGVyIHZhbHVlcyBhcmUgZXJyb3JzXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLmVuZClcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4uZW5kLnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0b2tlbi5lbmQgPSBbdGhpcy5zb3VyY2VUb2tlbl07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ25ld2xpbmUnKVxuICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgUGFyc2VyIH07XG4iLCAiaW1wb3J0IHsgQ29tcG9zZXIgfSBmcm9tICcuL2NvbXBvc2UvY29tcG9zZXIuanMnO1xuaW1wb3J0IHsgRG9jdW1lbnQgfSBmcm9tICcuL2RvYy9Eb2N1bWVudC5qcyc7XG5pbXBvcnQgeyBwcmV0dGlmeUVycm9yLCBZQU1MUGFyc2VFcnJvciB9IGZyb20gJy4vZXJyb3JzLmpzJztcbmltcG9ydCB7IHdhcm4gfSBmcm9tICcuL2xvZy5qcyc7XG5pbXBvcnQgeyBpc0RvY3VtZW50IH0gZnJvbSAnLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBMaW5lQ291bnRlciB9IGZyb20gJy4vcGFyc2UvbGluZS1jb3VudGVyLmpzJztcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gJy4vcGFyc2UvcGFyc2VyLmpzJztcblxuZnVuY3Rpb24gcGFyc2VPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBjb25zdCBwcmV0dHlFcnJvcnMgPSBvcHRpb25zLnByZXR0eUVycm9ycyAhPT0gZmFsc2U7XG4gICAgY29uc3QgbGluZUNvdW50ZXIgPSBvcHRpb25zLmxpbmVDb3VudGVyIHx8IChwcmV0dHlFcnJvcnMgJiYgbmV3IExpbmVDb3VudGVyKCkpIHx8IG51bGw7XG4gICAgcmV0dXJuIHsgbGluZUNvdW50ZXIsIHByZXR0eUVycm9ycyB9O1xufVxuLyoqXG4gKiBQYXJzZSB0aGUgaW5wdXQgYXMgYSBzdHJlYW0gb2YgWUFNTCBkb2N1bWVudHMuXG4gKlxuICogRG9jdW1lbnRzIHNob3VsZCBiZSBzZXBhcmF0ZWQgZnJvbSBlYWNoIG90aGVyIGJ5IGAuLi5gIG9yIGAtLS1gIG1hcmtlciBsaW5lcy5cbiAqXG4gKiBAcmV0dXJucyBJZiBhbiBlbXB0eSBgZG9jc2AgYXJyYXkgaXMgcmV0dXJuZWQsIGl0IHdpbGwgYmUgb2YgdHlwZVxuICogICBFbXB0eVN0cmVhbSBhbmQgY29udGFpbiBhZGRpdGlvbmFsIHN0cmVhbSBpbmZvcm1hdGlvbi4gSW5cbiAqICAgVHlwZVNjcmlwdCwgeW91IHNob3VsZCB1c2UgYCdlbXB0eScgaW4gZG9jc2AgYXMgYSB0eXBlIGd1YXJkIGZvciBpdC5cbiAqL1xuZnVuY3Rpb24gcGFyc2VBbGxEb2N1bWVudHMoc291cmNlLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGxpbmVDb3VudGVyLCBwcmV0dHlFcnJvcnMgfSA9IHBhcnNlT3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKGxpbmVDb3VudGVyPy5hZGROZXdMaW5lKTtcbiAgICBjb25zdCBjb21wb3NlciA9IG5ldyBDb21wb3NlcihvcHRpb25zKTtcbiAgICBjb25zdCBkb2NzID0gQXJyYXkuZnJvbShjb21wb3Nlci5jb21wb3NlKHBhcnNlci5wYXJzZShzb3VyY2UpKSk7XG4gICAgaWYgKHByZXR0eUVycm9ycyAmJiBsaW5lQ291bnRlcilcbiAgICAgICAgZm9yIChjb25zdCBkb2Mgb2YgZG9jcykge1xuICAgICAgICAgICAgZG9jLmVycm9ycy5mb3JFYWNoKHByZXR0aWZ5RXJyb3Ioc291cmNlLCBsaW5lQ291bnRlcikpO1xuICAgICAgICAgICAgZG9jLndhcm5pbmdzLmZvckVhY2gocHJldHRpZnlFcnJvcihzb3VyY2UsIGxpbmVDb3VudGVyKSk7XG4gICAgICAgIH1cbiAgICBpZiAoZG9jcy5sZW5ndGggPiAwKVxuICAgICAgICByZXR1cm4gZG9jcztcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihbXSwgeyBlbXB0eTogdHJ1ZSB9LCBjb21wb3Nlci5zdHJlYW1JbmZvKCkpO1xufVxuLyoqIFBhcnNlIGFuIGlucHV0IHN0cmluZyBpbnRvIGEgc2luZ2xlIFlBTUwuRG9jdW1lbnQgKi9cbmZ1bmN0aW9uIHBhcnNlRG9jdW1lbnQoc291cmNlLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGxpbmVDb3VudGVyLCBwcmV0dHlFcnJvcnMgfSA9IHBhcnNlT3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKGxpbmVDb3VudGVyPy5hZGROZXdMaW5lKTtcbiAgICBjb25zdCBjb21wb3NlciA9IG5ldyBDb21wb3NlcihvcHRpb25zKTtcbiAgICAvLyBgZG9jYCBpcyBhbHdheXMgc2V0IGJ5IGNvbXBvc2UuZW5kKHRydWUpIGF0IHRoZSB2ZXJ5IGxhdGVzdFxuICAgIGxldCBkb2MgPSBudWxsO1xuICAgIGZvciAoY29uc3QgX2RvYyBvZiBjb21wb3Nlci5jb21wb3NlKHBhcnNlci5wYXJzZShzb3VyY2UpLCB0cnVlLCBzb3VyY2UubGVuZ3RoKSkge1xuICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgIGRvYyA9IF9kb2M7XG4gICAgICAgIGVsc2UgaWYgKGRvYy5vcHRpb25zLmxvZ0xldmVsICE9PSAnc2lsZW50Jykge1xuICAgICAgICAgICAgZG9jLmVycm9ycy5wdXNoKG5ldyBZQU1MUGFyc2VFcnJvcihfZG9jLnJhbmdlLnNsaWNlKDAsIDIpLCAnTVVMVElQTEVfRE9DUycsICdTb3VyY2UgY29udGFpbnMgbXVsdGlwbGUgZG9jdW1lbnRzOyBwbGVhc2UgdXNlIFlBTUwucGFyc2VBbGxEb2N1bWVudHMoKScpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcmV0dHlFcnJvcnMgJiYgbGluZUNvdW50ZXIpIHtcbiAgICAgICAgZG9jLmVycm9ycy5mb3JFYWNoKHByZXR0aWZ5RXJyb3Ioc291cmNlLCBsaW5lQ291bnRlcikpO1xuICAgICAgICBkb2Mud2FybmluZ3MuZm9yRWFjaChwcmV0dGlmeUVycm9yKHNvdXJjZSwgbGluZUNvdW50ZXIpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRvYztcbn1cbmZ1bmN0aW9uIHBhcnNlKHNyYywgcmV2aXZlciwgb3B0aW9ucykge1xuICAgIGxldCBfcmV2aXZlciA9IHVuZGVmaW5lZDtcbiAgICBpZiAodHlwZW9mIHJldml2ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgX3Jldml2ZXIgPSByZXZpdmVyO1xuICAgIH1cbiAgICBlbHNlIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgJiYgcmV2aXZlciAmJiB0eXBlb2YgcmV2aXZlciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgb3B0aW9ucyA9IHJldml2ZXI7XG4gICAgfVxuICAgIGNvbnN0IGRvYyA9IHBhcnNlRG9jdW1lbnQoc3JjLCBvcHRpb25zKTtcbiAgICBpZiAoIWRvYylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgZG9jLndhcm5pbmdzLmZvckVhY2god2FybmluZyA9PiB3YXJuKGRvYy5vcHRpb25zLmxvZ0xldmVsLCB3YXJuaW5nKSk7XG4gICAgaWYgKGRvYy5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoZG9jLm9wdGlvbnMubG9nTGV2ZWwgIT09ICdzaWxlbnQnKVxuICAgICAgICAgICAgdGhyb3cgZG9jLmVycm9yc1swXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZG9jLmVycm9ycyA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gZG9jLnRvSlMoT2JqZWN0LmFzc2lnbih7IHJldml2ZXI6IF9yZXZpdmVyIH0sIG9wdGlvbnMpKTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeSh2YWx1ZSwgcmVwbGFjZXIsIG9wdGlvbnMpIHtcbiAgICBsZXQgX3JlcGxhY2VyID0gbnVsbDtcbiAgICBpZiAodHlwZW9mIHJlcGxhY2VyID09PSAnZnVuY3Rpb24nIHx8IEFycmF5LmlzQXJyYXkocmVwbGFjZXIpKSB7XG4gICAgICAgIF9yZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgIH1cbiAgICBlbHNlIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgJiYgcmVwbGFjZXIpIHtcbiAgICAgICAgb3B0aW9ucyA9IHJlcGxhY2VyO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKVxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucy5sZW5ndGg7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJykge1xuICAgICAgICBjb25zdCBpbmRlbnQgPSBNYXRoLnJvdW5kKG9wdGlvbnMpO1xuICAgICAgICBvcHRpb25zID0gaW5kZW50IDwgMSA/IHVuZGVmaW5lZCA6IGluZGVudCA+IDggPyB7IGluZGVudDogOCB9IDogeyBpbmRlbnQgfTtcbiAgICB9XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgeyBrZWVwVW5kZWZpbmVkIH0gPSBvcHRpb25zID8/IHJlcGxhY2VyID8/IHt9O1xuICAgICAgICBpZiAoIWtlZXBVbmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoaXNEb2N1bWVudCh2YWx1ZSkgJiYgIV9yZXBsYWNlcilcbiAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKG9wdGlvbnMpO1xuICAgIHJldHVybiBuZXcgRG9jdW1lbnQodmFsdWUsIF9yZXBsYWNlciwgb3B0aW9ucykudG9TdHJpbmcob3B0aW9ucyk7XG59XG5cbmV4cG9ydCB7IHBhcnNlLCBwYXJzZUFsbERvY3VtZW50cywgcGFyc2VEb2N1bWVudCwgc3RyaW5naWZ5IH07XG4iLCAiaW1wb3J0IHsgcGFyc2UgfSBmcm9tIFwieWFtbFwiO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnlTY2VuZSxcbiAgQ29uc3RydWN0aW9uU3RlcCxcbiAgQ29uZmlnRGVmLFxuICBTdHlsZURlZixcbiAgVmVjMixcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuY29uc3QgREVGQVVMVF9DT05GSUc6IENvbmZpZ0RlZiA9IHtcbiAgZ3JpZDogZmFsc2UsXG4gIGF4ZXM6IGZhbHNlLFxuICB3aWR0aDogNjAwLFxuICBoZWlnaHQ6IDQwMCxcbiAgc2NhbGU6IDUwLFxuICBpbnRlcmFjdGl2ZTogdHJ1ZSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUdlb21ldHJ5KHNvdXJjZTogc3RyaW5nKTogR2VvbWV0cnlTY2VuZSB7XG4gIGNvbnN0IHRyaW1tZWQgPSBzb3VyY2UudHJpbSgpO1xuICBpZiAoIXRyaW1tZWQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcG9pbnRzOiB7fSxcbiAgICAgIGNvbnN0cnVjdGlvbnM6IFtdLFxuICAgICAgc3R5bGU6IHt9LFxuICAgICAgY29uZmlnOiB7IC4uLkRFRkFVTFRfQ09ORklHIH0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHJhdyA9IHBhcnNlKHRyaW1tZWQpO1xuICBpZiAoIXJhdyB8fCB0eXBlb2YgcmF3ICE9PSBcIm9iamVjdFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvaW50czoge30sXG4gICAgICBjb25zdHJ1Y3Rpb25zOiBbXSxcbiAgICAgIHN0eWxlOiB7fSxcbiAgICAgIGNvbmZpZzogeyAuLi5ERUZBVUxUX0NPTkZJRyB9LFxuICAgIH07XG4gIH1cblxuICBjb25zdCBwb2ludHMgPSBwYXJzZVBvaW50cyhyYXcucG9pbnRzKTtcbiAgY29uc3QgY29uc3RydWN0aW9ucyA9IHBhcnNlQ29uc3RydWN0aW9ucyhyYXcuY29uc3RydWN0aW9ucyk7XG4gIGNvbnN0IHN0eWxlID0gcGFyc2VTdHlsZXMocmF3LnN0eWxlKTtcbiAgY29uc3QgY29uZmlnID0geyAuLi5ERUZBVUxUX0NPTkZJRywgLi4uKHJhdy5jb25maWcgPz8ge30pIH07XG5cbiAgcmV0dXJuIHtcbiAgICB0aXRsZTogcmF3LnRpdGxlID8/IHVuZGVmaW5lZCxcbiAgICBwb2ludHMsXG4gICAgY29uc3RydWN0aW9ucyxcbiAgICBzdHlsZSxcbiAgICBjb25maWcsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlUG9pbnRzKHJhdzogdW5rbm93bik6IFJlY29yZDxzdHJpbmcsIFZlYzI+IHtcbiAgaWYgKCFyYXcpIHJldHVybiB7fTtcbiAgaWYgKHR5cGVvZiByYXcgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIidwb2ludHMnIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIFZlYzI+ID0ge307XG4gIGZvciAoY29uc3QgW2lkLCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKHJhdyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsKSB8fCB2YWwubGVuZ3RoICE9PSAyIHx8IHR5cGVvZiB2YWxbMF0gIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHZhbFsxXSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQb2ludCAnJHtpZH0nIG11c3QgYmUgW3gsIHldIHdpdGggbnVtZXJpYyBjb29yZGluYXRlc2ApO1xuICAgIH1cbiAgICByZXN1bHRbaWRdID0gW3ZhbFswXSwgdmFsWzFdXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBwYXJzZUNvbnN0cnVjdGlvbnMocmF3OiB1bmtub3duKTogQ29uc3RydWN0aW9uU3RlcFtdIHtcbiAgaWYgKCFyYXcpIHJldHVybiBbXTtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHJhdykpIHRocm93IG5ldyBFcnJvcihcIidjb25zdHJ1Y3Rpb25zJyBtdXN0IGJlIGEgbGlzdFwiKTtcbiAgcmV0dXJuIHJhdy5tYXAoKGl0ZW0sIGkpID0+IHBhcnNlT25lQ29uc3RydWN0aW9uKGl0ZW0sIGkpKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VPbmVDb25zdHJ1Y3Rpb24oaXRlbTogdW5rbm93biwgaW5kZXg6IG51bWJlcik6IENvbnN0cnVjdGlvblN0ZXAge1xuICBpZiAoIWl0ZW0gfHwgdHlwZW9mIGl0ZW0gIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvbnN0cnVjdGlvbiAjJHtpbmRleCArIDF9OiBleHBlY3RlZCBhbiBvYmplY3RgKTtcbiAgfVxuICBjb25zdCBvYmogPSBpdGVtIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXG4gIGlmIChvYmoubGluZSkgcmV0dXJuIHBhcnNlTGluZVN0ZXAob2JqLmxpbmUpO1xuICBpZiAob2JqLnNlZ21lbnQpIHJldHVybiBwYXJzZVNlZ21lbnRTdGVwKG9iai5zZWdtZW50KTtcbiAgaWYgKG9iai5yYXkpIHJldHVybiBwYXJzZVJheVN0ZXAob2JqLnJheSk7XG4gIGlmIChvYmouY2lyY2xlKSByZXR1cm4gcGFyc2VDaXJjbGVTdGVwKG9iai5jaXJjbGUpO1xuICBpZiAob2JqLmludGVyc2VjdCkgcmV0dXJuIHBhcnNlSW50ZXJzZWN0U3RlcChvYmouaW50ZXJzZWN0KTtcbiAgaWYgKG9iai5taWRwb2ludCkgcmV0dXJuIHBhcnNlTWlkcG9pbnRTdGVwKG9iai5taWRwb2ludCk7XG4gIGlmIChvYmoucGVycGVuZGljdWxhcikgcmV0dXJuIHBhcnNlUGVycGVuZGljdWxhclN0ZXAob2JqLnBlcnBlbmRpY3VsYXIpO1xuICBpZiAob2JqLnBhcmFsbGVsKSByZXR1cm4gcGFyc2VQYXJhbGxlbFN0ZXAob2JqLnBhcmFsbGVsKTtcbiAgaWYgKG9iai5hbmdsZV9iaXNlY3RvcikgcmV0dXJuIHBhcnNlQW5nbGVCaXNlY3RvclN0ZXAob2JqLmFuZ2xlX2Jpc2VjdG9yKTtcbiAgaWYgKG9iai5wb2x5Z29uKSByZXR1cm4gcGFyc2VQb2x5Z29uU3RlcChvYmoucG9seWdvbik7XG5cbiAgdGhyb3cgbmV3IEVycm9yKGBDb25zdHJ1Y3Rpb24gIyR7aW5kZXggKyAxfTogdW5rbm93biB0eXBlLiBLZXlzOiAke09iamVjdC5rZXlzKG9iaikuam9pbihcIiwgXCIpfWApO1xufVxuXG5mdW5jdGlvbiBwYXJzZUxpbmVTdGVwKHJhdzogdW5rbm93bik6IENvbnN0cnVjdGlvblN0ZXAge1xuICBjb25zdCBvID0gcmF3IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBjb25zdCB0aHJvdWdoID0gby50aHJvdWdoIGFzIHN0cmluZ1tdO1xuICBpZiAoIUFycmF5LmlzQXJyYXkodGhyb3VnaCkgfHwgdGhyb3VnaC5sZW5ndGggIT09IDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJsaW5lOiAndGhyb3VnaCcgbXVzdCBiZSBbcG9pbnRBLCBwb2ludEJdXCIpO1xuICB9XG4gIHJldHVybiB7IHR5cGU6IFwibGluZVwiLCB0aHJvdWdoOiBbdGhyb3VnaFswXSwgdGhyb3VnaFsxXV0sIGlkOiBzdHIoby5pZCkgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VTZWdtZW50U3RlcChyYXc6IHVua25vd24pOiBDb25zdHJ1Y3Rpb25TdGVwIHtcbiAgY29uc3QgbyA9IHJhdyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgcmV0dXJuIHsgdHlwZTogXCJzZWdtZW50XCIsIGZyb206IHN0cihvLmZyb20pLCB0bzogc3RyKG8udG8pLCBpZDogc3RyKG8uaWQpIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlUmF5U3RlcChyYXc6IHVua25vd24pOiBDb25zdHJ1Y3Rpb25TdGVwIHtcbiAgY29uc3QgbyA9IHJhdyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgcmV0dXJuIHsgdHlwZTogXCJyYXlcIiwgZnJvbTogc3RyKG8uZnJvbSksIHRocm91Z2g6IHN0cihvLnRocm91Z2gpLCBpZDogc3RyKG8uaWQpIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ2lyY2xlU3RlcChyYXc6IHVua25vd24pOiBDb25zdHJ1Y3Rpb25TdGVwIHtcbiAgY29uc3QgbyA9IHJhdyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgY29uc3Qgc3RlcDogQ29uc3RydWN0aW9uU3RlcCA9IHtcbiAgICB0eXBlOiBcImNpcmNsZVwiLFxuICAgIGNlbnRlcjogc3RyKG8uY2VudGVyKSxcbiAgICBpZDogc3RyKG8uaWQpLFxuICB9O1xuICBpZiAoby50aHJvdWdoICE9PSB1bmRlZmluZWQpIChzdGVwIGFzIGFueSkudGhyb3VnaCA9IHN0cihvLnRocm91Z2gpO1xuICBpZiAoby5yYWRpdXMgIT09IHVuZGVmaW5lZCkgKHN0ZXAgYXMgYW55KS5yYWRpdXMgPSBvLnJhZGl1cyBhcyBudW1iZXIgfCBzdHJpbmc7XG4gIHJldHVybiBzdGVwO1xufVxuXG5mdW5jdGlvbiBwYXJzZUludGVyc2VjdFN0ZXAocmF3OiB1bmtub3duKTogQ29uc3RydWN0aW9uU3RlcCB7XG4gIGNvbnN0IG8gPSByYXcgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIGNvbnN0IG9mXyA9IG8ub2YgYXMgc3RyaW5nW107XG4gIGlmICghQXJyYXkuaXNBcnJheShvZl8pIHx8IG9mXy5sZW5ndGggIT09IDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnRlcnNlY3Q6ICdvZicgbXVzdCBiZSBbb2JqQSwgb2JqQl1cIik7XG4gIH1cbiAgY29uc3QgaWQgPSBvLmlkO1xuICBjb25zdCBzdGVwOiBDb25zdHJ1Y3Rpb25TdGVwID0ge1xuICAgIHR5cGU6IFwiaW50ZXJzZWN0XCIsXG4gICAgb2Y6IFtvZl9bMF0sIG9mX1sxXV0sXG4gICAgaWQ6IEFycmF5LmlzQXJyYXkoaWQpID8gW3N0cihpZFswXSksIHN0cihpZFsxXSldIDogc3RyKGlkKSxcbiAgfTtcbiAgaWYgKG8ud2hpY2ggIT09IHVuZGVmaW5lZCkgKHN0ZXAgYXMgYW55KS53aGljaCA9IG8ud2hpY2ggYXMgbnVtYmVyO1xuICByZXR1cm4gc3RlcDtcbn1cblxuZnVuY3Rpb24gcGFyc2VNaWRwb2ludFN0ZXAocmF3OiB1bmtub3duKTogQ29uc3RydWN0aW9uU3RlcCB7XG4gIGNvbnN0IG8gPSByYXcgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIGNvbnN0IG9mXyA9IG8ub2YgYXMgc3RyaW5nW107XG4gIGlmICghQXJyYXkuaXNBcnJheShvZl8pIHx8IG9mXy5sZW5ndGggIT09IDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJtaWRwb2ludDogJ29mJyBtdXN0IGJlIFtwb2ludEEsIHBvaW50Ql1cIik7XG4gIH1cbiAgcmV0dXJuIHsgdHlwZTogXCJtaWRwb2ludFwiLCBvZjogW29mX1swXSwgb2ZfWzFdXSwgaWQ6IHN0cihvLmlkKSB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVBlcnBlbmRpY3VsYXJTdGVwKHJhdzogdW5rbm93bik6IENvbnN0cnVjdGlvblN0ZXAge1xuICBjb25zdCBvID0gcmF3IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICByZXR1cm4geyB0eXBlOiBcInBlcnBlbmRpY3VsYXJcIiwgdG86IHN0cihvLnRvKSwgdGhyb3VnaDogc3RyKG8udGhyb3VnaCksIGlkOiBzdHIoby5pZCkgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VQYXJhbGxlbFN0ZXAocmF3OiB1bmtub3duKTogQ29uc3RydWN0aW9uU3RlcCB7XG4gIGNvbnN0IG8gPSByYXcgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIHJldHVybiB7IHR5cGU6IFwicGFyYWxsZWxcIiwgdG86IHN0cihvLnRvKSwgdGhyb3VnaDogc3RyKG8udGhyb3VnaCksIGlkOiBzdHIoby5pZCkgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VBbmdsZUJpc2VjdG9yU3RlcChyYXc6IHVua25vd24pOiBDb25zdHJ1Y3Rpb25TdGVwIHtcbiAgY29uc3QgbyA9IHJhdyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgY29uc3QgcHRzID0gby5wb2ludHMgYXMgc3RyaW5nW107XG4gIGlmICghQXJyYXkuaXNBcnJheShwdHMpIHx8IHB0cy5sZW5ndGggIT09IDMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJhbmdsZV9iaXNlY3RvcjogJ3BvaW50cycgbXVzdCBiZSBbQSwgdmVydGV4LCBCXVwiKTtcbiAgfVxuICByZXR1cm4geyB0eXBlOiBcImFuZ2xlX2Jpc2VjdG9yXCIsIHBvaW50czogW3B0c1swXSwgcHRzWzFdLCBwdHNbMl1dLCBpZDogc3RyKG8uaWQpIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlUG9seWdvblN0ZXAocmF3OiB1bmtub3duKTogQ29uc3RydWN0aW9uU3RlcCB7XG4gIGNvbnN0IG8gPSByYXcgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIGNvbnN0IHZlcnRpY2VzID0gby52ZXJ0aWNlcyBhcyBzdHJpbmdbXTtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHZlcnRpY2VzKSB8fCB2ZXJ0aWNlcy5sZW5ndGggPCAzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwicG9seWdvbjogJ3ZlcnRpY2VzJyBtdXN0IGhhdmUgYXQgbGVhc3QgMyBwb2ludHNcIik7XG4gIH1cbiAgcmV0dXJuIHsgdHlwZTogXCJwb2x5Z29uXCIsIHZlcnRpY2VzLCBpZDogc3RyKG8uaWQpIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlU3R5bGVzKHJhdzogdW5rbm93bik6IFJlY29yZDxzdHJpbmcsIFN0eWxlRGVmPiB7XG4gIGlmICghcmF3KSByZXR1cm4ge307XG4gIGlmICh0eXBlb2YgcmF3ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCInc3R5bGUnIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIFN0eWxlRGVmPiA9IHt9O1xuICBmb3IgKGNvbnN0IFtpZCwgdmFsXSBvZiBPYmplY3QuZW50cmllcyhyYXcgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pKSB7XG4gICAgcmVzdWx0W2lkXSA9IHZhbCBhcyBTdHlsZURlZjtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHIodmFsOiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCIpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcIm51bWJlclwiKSByZXR1cm4gU3RyaW5nKHZhbCk7XG4gIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYSBzdHJpbmcsIGdvdCAke3R5cGVvZiB2YWx9OiAke0pTT04uc3RyaW5naWZ5KHZhbCl9YCk7XG59XG4iLCAiaW1wb3J0IHsgVmVjMiB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5jb25zdCBFUFNJTE9OID0gMWUtMTA7XG5cbi8vIFx1MjUwMFx1MjUwMCBWZWN0b3Igb3BlcmF0aW9ucyBcdTI1MDBcdTI1MDBcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZChhOiBWZWMyLCBiOiBWZWMyKTogVmVjMiB7XG4gIHJldHVybiBbYVswXSArIGJbMF0sIGFbMV0gKyBiWzFdXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YihhOiBWZWMyLCBiOiBWZWMyKTogVmVjMiB7XG4gIHJldHVybiBbYVswXSAtIGJbMF0sIGFbMV0gLSBiWzFdXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlKHY6IFZlYzIsIHM6IG51bWJlcik6IFZlYzIge1xuICByZXR1cm4gW3ZbMF0gKiBzLCB2WzFdICogc107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb3QoYTogVmVjMiwgYjogVmVjMik6IG51bWJlciB7XG4gIHJldHVybiBhWzBdICogYlswXSArIGFbMV0gKiBiWzFdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3Jvc3MoYTogVmVjMiwgYjogVmVjMik6IG51bWJlciB7XG4gIHJldHVybiBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGVuZ3RoKHY6IFZlYzIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5zcXJ0KHZbMF0gKiB2WzBdICsgdlsxXSAqIHZbMV0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzdChhOiBWZWMyLCBiOiBWZWMyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGxlbmd0aChzdWIoYiwgYSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKHY6IFZlYzIpOiBWZWMyIHtcbiAgY29uc3QgbGVuID0gbGVuZ3RoKHYpO1xuICBpZiAobGVuIDwgRVBTSUxPTikgcmV0dXJuIFswLCAwXTtcbiAgcmV0dXJuIFt2WzBdIC8gbGVuLCB2WzFdIC8gbGVuXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBlcnBWZWModjogVmVjMik6IFZlYzIge1xuICByZXR1cm4gWy12WzFdLCB2WzBdXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pZHBvaW50KGE6IFZlYzIsIGI6IFZlYzIpOiBWZWMyIHtcbiAgcmV0dXJuIFsoYVswXSArIGJbMF0pIC8gMiwgKGFbMV0gKyBiWzFdKSAvIDJdO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTGluZSByZXByZXNlbnRhdGlvbjogcG9pbnQgKyBkaXJlY3Rpb24gXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZSB7XG4gIHBvaW50OiBWZWMyO1xuICBkaXI6IFZlYzI7IC8vIHVuaXQgZGlyZWN0aW9uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaW5lRnJvbVR3b1BvaW50cyhwMTogVmVjMiwgcDI6IFZlYzIpOiBMaW5lIHtcbiAgcmV0dXJuIHsgcG9pbnQ6IHAxLCBkaXI6IG5vcm1hbGl6ZShzdWIocDIsIHAxKSkgfTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEludGVyc2VjdGlvbnMgXHUyNTAwXHUyNTAwXG5cbmV4cG9ydCBmdW5jdGlvbiBsaW5lTGluZUludGVyc2VjdGlvbihsMTogTGluZSwgbDI6IExpbmUpOiBWZWMyIHwgbnVsbCB7XG4gIGNvbnN0IGQgPSBjcm9zcyhsMS5kaXIsIGwyLmRpcik7XG4gIGlmIChNYXRoLmFicyhkKSA8IEVQU0lMT04pIHJldHVybiBudWxsOyAvLyBwYXJhbGxlbFxuICBjb25zdCBkaWZmID0gc3ViKGwyLnBvaW50LCBsMS5wb2ludCk7XG4gIGNvbnN0IHQgPSBjcm9zcyhkaWZmLCBsMi5kaXIpIC8gZDtcbiAgcmV0dXJuIGFkZChsMS5wb2ludCwgc2NhbGUobDEuZGlyLCB0KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaW5lQ2lyY2xlSW50ZXJzZWN0aW9uKFxuICBsaW5lOiBMaW5lLFxuICBjZW50ZXI6IFZlYzIsXG4gIHJhZGl1czogbnVtYmVyXG4pOiBWZWMyW10ge1xuICAvLyBTb2x2ZSB8bGluZS5wb2ludCArIHQgKiBsaW5lLmRpciAtIGNlbnRlcnxeMiA9IHJhZGl1c14yXG4gIGNvbnN0IG9jID0gc3ViKGxpbmUucG9pbnQsIGNlbnRlcik7XG4gIGNvbnN0IGEgPSBkb3QobGluZS5kaXIsIGxpbmUuZGlyKTsgLy8gc2hvdWxkIGJlIDEgaWYgbm9ybWFsaXplZFxuICBjb25zdCBiID0gMiAqIGRvdChvYywgbGluZS5kaXIpO1xuICBjb25zdCBjID0gZG90KG9jLCBvYykgLSByYWRpdXMgKiByYWRpdXM7XG4gIGNvbnN0IGRpc2MgPSBiICogYiAtIDQgKiBhICogYztcblxuICBpZiAoZGlzYyA8IC1FUFNJTE9OKSByZXR1cm4gW107XG4gIGlmIChkaXNjIDwgRVBTSUxPTikge1xuICAgIGNvbnN0IHQgPSAtYiAvICgyICogYSk7XG4gICAgcmV0dXJuIFthZGQobGluZS5wb2ludCwgc2NhbGUobGluZS5kaXIsIHQpKV07XG4gIH1cblxuICBjb25zdCBzcXJ0RGlzYyA9IE1hdGguc3FydChkaXNjKTtcbiAgY29uc3QgdDEgPSAoLWIgLSBzcXJ0RGlzYykgLyAoMiAqIGEpO1xuICBjb25zdCB0MiA9ICgtYiArIHNxcnREaXNjKSAvICgyICogYSk7XG4gIHJldHVybiBbXG4gICAgYWRkKGxpbmUucG9pbnQsIHNjYWxlKGxpbmUuZGlyLCB0MSkpLFxuICAgIGFkZChsaW5lLnBvaW50LCBzY2FsZShsaW5lLmRpciwgdDIpKSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNpcmNsZUNpcmNsZUludGVyc2VjdGlvbihcbiAgYzE6IFZlYzIsXG4gIHIxOiBudW1iZXIsXG4gIGMyOiBWZWMyLFxuICByMjogbnVtYmVyXG4pOiBWZWMyW10ge1xuICBjb25zdCBkID0gZGlzdChjMSwgYzIpO1xuICBpZiAoZCA8IEVQU0lMT04pIHJldHVybiBbXTsgLy8gY29uY2VudHJpY1xuICBpZiAoZCA+IHIxICsgcjIgKyBFUFNJTE9OKSByZXR1cm4gW107IC8vIHRvbyBmYXIgYXBhcnRcbiAgaWYgKGQgPCBNYXRoLmFicyhyMSAtIHIyKSAtIEVQU0lMT04pIHJldHVybiBbXTsgLy8gb25lIGluc2lkZSB0aGUgb3RoZXJcblxuICBjb25zdCBhID0gKHIxICogcjEgLSByMiAqIHIyICsgZCAqIGQpIC8gKDIgKiBkKTtcbiAgY29uc3QgaFNxID0gcjEgKiByMSAtIGEgKiBhO1xuICBpZiAoaFNxIDwgLUVQU0lMT04pIHJldHVybiBbXTtcblxuICBjb25zdCBoID0gaFNxIDwgMCA/IDAgOiBNYXRoLnNxcnQoaFNxKTtcbiAgY29uc3QgZGlyID0gbm9ybWFsaXplKHN1YihjMiwgYzEpKTtcbiAgY29uc3QgcCA9IGFkZChjMSwgc2NhbGUoZGlyLCBhKSk7XG5cbiAgaWYgKGggPCBFUFNJTE9OKSByZXR1cm4gW3BdOyAvLyB0YW5nZW50XG5cbiAgY29uc3QgcGVycCA9IHBlcnBWZWMoZGlyKTtcbiAgcmV0dXJuIFtcbiAgICBhZGQocCwgc2NhbGUocGVycCwgaCkpLFxuICAgIGFkZChwLCBzY2FsZShwZXJwLCAtaCkpLFxuICBdO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgUGFyYW1ldGVyIHV0aWxpdGllcyAoZm9yIGZpbHRlcmluZyBzZWdtZW50L3JheSBpbnRlcnNlY3Rpb25zKSBcdTI1MDBcdTI1MDBcblxuLyoqIEdldCB0aGUgcGFyYW1ldGVyIHQgZm9yIGEgcG9pbnQgYWxvbmcgYSBsaW5lOiBwID0gbGluZS5wb2ludCArIHQgKiBsaW5lLmRpciAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcmFtT25MaW5lKGxpbmU6IExpbmUsIHBvaW50OiBWZWMyKTogbnVtYmVyIHtcbiAgY29uc3QgZGlmZiA9IHN1Yihwb2ludCwgbGluZS5wb2ludCk7XG4gIC8vIFByb2plY3Qgb250byBkaXJlY3Rpb25cbiAgcmV0dXJuIGRvdChkaWZmLCBsaW5lLmRpcik7XG59XG5cbi8qKiBGaWx0ZXIgaW50ZXJzZWN0aW9uIHBvaW50cyB0byB0aG9zZSB3aXRoaW4gYSBzZWdtZW50ICh0IGluIFswLCBzZWdtZW50TGVuZ3RoXSkgKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJTZWdtZW50KFxuICBwb2ludHM6IFZlYzJbXSxcbiAgZnJvbTogVmVjMixcbiAgdG86IFZlYzJcbik6IFZlYzJbXSB7XG4gIGNvbnN0IGxpbmUgPSBsaW5lRnJvbVR3b1BvaW50cyhmcm9tLCB0byk7XG4gIGNvbnN0IGxlbiA9IGRpc3QoZnJvbSwgdG8pO1xuICByZXR1cm4gcG9pbnRzLmZpbHRlcigocCkgPT4ge1xuICAgIGNvbnN0IHQgPSBwYXJhbU9uTGluZShsaW5lLCBwKTtcbiAgICByZXR1cm4gdCA+PSAtRVBTSUxPTiAmJiB0IDw9IGxlbiArIEVQU0lMT047XG4gIH0pO1xufVxuXG4vKiogRmlsdGVyIGludGVyc2VjdGlvbiBwb2ludHMgdG8gdGhvc2Ugb24gYSByYXkgKHQgPj0gMCkgKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJSYXkoXG4gIHBvaW50czogVmVjMltdLFxuICBvcmlnaW46IFZlYzIsXG4gIGRpcjogVmVjMlxuKTogVmVjMltdIHtcbiAgY29uc3QgbGluZTogTGluZSA9IHsgcG9pbnQ6IG9yaWdpbiwgZGlyOiBub3JtYWxpemUoZGlyKSB9O1xuICByZXR1cm4gcG9pbnRzLmZpbHRlcigocCkgPT4gcGFyYW1PbkxpbmUobGluZSwgcCkgPj0gLUVQU0lMT04pO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU29ydGluZyBjb252ZW50aW9uIGZvciBpbnRlcnNlY3Rpb24gcG9pbnRzIFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgZnVuY3Rpb24gc29ydEludGVyc2VjdGlvbnMocG9pbnRzOiBWZWMyW10pOiBWZWMyW10ge1xuICByZXR1cm4gWy4uLnBvaW50c10uc29ydCgoYSwgYikgPT4ge1xuICAgIGlmIChNYXRoLmFicyhhWzBdIC0gYlswXSkgPiBFUFNJTE9OKSByZXR1cm4gYVswXSAtIGJbMF07XG4gICAgcmV0dXJuIGFbMV0gLSBiWzFdO1xuICB9KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENvbnN0cnVjdGlvbiBoZWxwZXJzIFx1MjUwMFx1MjUwMFxuXG5leHBvcnQgZnVuY3Rpb24gcGVycGVuZGljdWxhclRocm91Z2gobGluZTogTGluZSwgcG9pbnQ6IFZlYzIpOiBMaW5lIHtcbiAgcmV0dXJuIHsgcG9pbnQsIGRpcjogbm9ybWFsaXplKHBlcnBWZWMobGluZS5kaXIpKSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxUaHJvdWdoKGxpbmU6IExpbmUsIHBvaW50OiBWZWMyKTogTGluZSB7XG4gIHJldHVybiB7IHBvaW50LCBkaXI6IGxpbmUuZGlyIH07XG59XG5cbi8qKiBBbmdsZSBiaXNlY3RvcjogZ2l2ZW4gcG9pbnRzIEEsIFYgKHZlcnRleCksIEIsIHJldHVybnMgYSBsaW5lIHRocm91Z2ggVlxuICogIHRoYXQgYmlzZWN0cyB0aGUgYW5nbGUgQVZCLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFuZ2xlQmlzZWN0b3JUaHJvdWdoKGE6IFZlYzIsIHZlcnRleDogVmVjMiwgYjogVmVjMik6IExpbmUge1xuICBjb25zdCBkYSA9IG5vcm1hbGl6ZShzdWIoYSwgdmVydGV4KSk7XG4gIGNvbnN0IGRiID0gbm9ybWFsaXplKHN1YihiLCB2ZXJ0ZXgpKTtcbiAgLy8gQmlzZWN0b3IgZGlyZWN0aW9uIGlzIHRoZSBzdW0gb2YgdW5pdCB2ZWN0b3JzIGZyb20gdmVydGV4IHRvIEEgYW5kIEJcbiAgbGV0IGJpc0RpciA9IGFkZChkYSwgZGIpO1xuICAvLyBJZiBkYSArIGRiIFx1MjI0OCB6ZXJvIChhbmdsZSBpcyB+MTgwXHUwMEIwKSwgdXNlIHBlcnBlbmRpY3VsYXIgb2YgZGFcbiAgaWYgKGxlbmd0aChiaXNEaXIpIDwgMWUtMTApIHtcbiAgICBiaXNEaXIgPSBwZXJwVmVjKGRhKTtcbiAgfVxuICByZXR1cm4geyBwb2ludDogdmVydGV4LCBkaXI6IG5vcm1hbGl6ZShiaXNEaXIpIH07XG59XG4iLCAiaW1wb3J0IHsgVmVjMiB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZGlzdCB9IGZyb20gXCIuL2dlb1wiO1xuXG4vKipcbiAqIEV2YWx1YXRlIGEgcmFkaXVzIGV4cHJlc3Npb24uIENhbiBiZTpcbiAqIC0gQSBudW1iZXIgbGl0ZXJhbCAocmV0dXJuZWQgYXMtaXMpXG4gKiAtIEEgc3RyaW5nIGxpa2UgXCJkaXN0YW5jZShBLCBCKVwiXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBldmFsdWF0ZUV4cHJlc3Npb24oXG4gIGV4cHI6IG51bWJlciB8IHN0cmluZyxcbiAgcmVzb2x2ZWRQb2ludHM6IE1hcDxzdHJpbmcsIFZlYzI+XG4pOiBudW1iZXIge1xuICBpZiAodHlwZW9mIGV4cHIgPT09IFwibnVtYmVyXCIpIHJldHVybiBleHByO1xuXG4gIGNvbnN0IG1hdGNoID0gZXhwci5tYXRjaCgvXmRpc3RhbmNlXFwoXFxzKihcXHcrKVxccyosXFxzKihcXHcrKVxccypcXCkkLyk7XG4gIGlmIChtYXRjaCkge1xuICAgIGNvbnN0IHAxID0gcmVzb2x2ZWRQb2ludHMuZ2V0KG1hdGNoWzFdKTtcbiAgICBjb25zdCBwMiA9IHJlc29sdmVkUG9pbnRzLmdldChtYXRjaFsyXSk7XG4gICAgaWYgKCFwMSkgdGhyb3cgbmV3IEVycm9yKGBkaXN0YW5jZSgpOiB1bmtub3duIHBvaW50ICcke21hdGNoWzFdfSdgKTtcbiAgICBpZiAoIXAyKSB0aHJvdyBuZXcgRXJyb3IoYGRpc3RhbmNlKCk6IHVua25vd24gcG9pbnQgJyR7bWF0Y2hbMl19J2ApO1xuICAgIHJldHVybiBkaXN0KHAxLCBwMik7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZXhwcmVzc2lvbjogJyR7ZXhwcn0nYCk7XG59XG4iLCAiaW1wb3J0IHtcbiAgR2VvbWV0cnlTY2VuZSxcbiAgQ29uc3RydWN0aW9uU3RlcCxcbiAgUmVzb2x2ZWRPYmplY3QsXG4gIFJlc29sdmVkU2NlbmUsXG4gIFJlc29sdmVkUG9pbnQsXG4gIFJlc29sdmVkTGluZSxcbiAgUmVzb2x2ZWRTZWdtZW50LFxuICBSZXNvbHZlZFJheSxcbiAgUmVzb2x2ZWRDaXJjbGUsXG4gIFZlYzIsXG59IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0ICogYXMgZ2VvIGZyb20gXCIuL2dlb1wiO1xuaW1wb3J0IHsgZXZhbHVhdGVFeHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbnNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNvbHZlKFxuICBzY2VuZTogR2VvbWV0cnlTY2VuZSxcbiAgcG9pbnRPdmVycmlkZXM/OiBNYXA8c3RyaW5nLCBWZWMyPlxuKTogUmVzb2x2ZWRTY2VuZSB7XG4gIGNvbnN0IG9iamVjdHMgPSBuZXcgTWFwPHN0cmluZywgUmVzb2x2ZWRPYmplY3Q+KCk7XG5cbiAgLy8gSGVscGVyOiBnZXQgYWxsIHJlc29sdmVkIHBvaW50IHBvc2l0aW9ucyBmb3IgZXhwcmVzc2lvbiBldmFsdWF0aW9uXG4gIGNvbnN0IHJlc29sdmVkUG9pbnRzID0gbmV3IE1hcDxzdHJpbmcsIFZlYzI+KCk7XG5cbiAgLy8gU2VlZCBleHBsaWNpdCBwb2ludHNcbiAgZm9yIChjb25zdCBbaWQsIGNvb3Jkc10gb2YgT2JqZWN0LmVudHJpZXMoc2NlbmUucG9pbnRzKSkge1xuICAgIGNvbnN0IHBvcyA9IHBvaW50T3ZlcnJpZGVzPy5nZXQoaWQpID8/IGNvb3JkcztcbiAgICBjb25zdCBwb2ludDogUmVzb2x2ZWRQb2ludCA9IHsgdHlwZTogXCJwb2ludFwiLCBpZCwgcG9zLCBkcmFnZ2FibGU6IHRydWUgfTtcbiAgICBvYmplY3RzLnNldChpZCwgcG9pbnQpO1xuICAgIHJlc29sdmVkUG9pbnRzLnNldChpZCwgcG9zKTtcbiAgfVxuXG4gIC8vIFByb2Nlc3MgY29uc3RydWN0aW9ucyBpbiBvcmRlclxuICBmb3IgKGNvbnN0IHN0ZXAgb2Ygc2NlbmUuY29uc3RydWN0aW9ucykge1xuICAgIHJlc29sdmVTdGVwKHN0ZXAsIG9iamVjdHMsIHJlc29sdmVkUG9pbnRzKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb2JqZWN0cyxcbiAgICBjb25maWc6IHNjZW5lLmNvbmZpZyxcbiAgICBzdHlsZTogc2NlbmUuc3R5bGUsXG4gICAgdGl0bGU6IHNjZW5lLnRpdGxlLFxuICB9O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlU3RlcChcbiAgc3RlcDogQ29uc3RydWN0aW9uU3RlcCxcbiAgb2JqZWN0czogTWFwPHN0cmluZywgUmVzb2x2ZWRPYmplY3Q+LFxuICBwb2ludHM6IE1hcDxzdHJpbmcsIFZlYzI+XG4pOiB2b2lkIHtcbiAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICBjYXNlIFwibGluZVwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVMaW5lKHN0ZXAsIG9iamVjdHMsIHBvaW50cyk7XG4gICAgY2FzZSBcInNlZ21lbnRcIjpcbiAgICAgIHJldHVybiByZXNvbHZlU2VnbWVudChzdGVwLCBvYmplY3RzLCBwb2ludHMpO1xuICAgIGNhc2UgXCJyYXlcIjpcbiAgICAgIHJldHVybiByZXNvbHZlUmF5KHN0ZXAsIG9iamVjdHMsIHBvaW50cyk7XG4gICAgY2FzZSBcImNpcmNsZVwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVDaXJjbGUoc3RlcCwgb2JqZWN0cywgcG9pbnRzKTtcbiAgICBjYXNlIFwiaW50ZXJzZWN0XCI6XG4gICAgICByZXR1cm4gcmVzb2x2ZUludGVyc2VjdChzdGVwLCBvYmplY3RzLCBwb2ludHMpO1xuICAgIGNhc2UgXCJtaWRwb2ludFwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVNaWRwb2ludChzdGVwLCBvYmplY3RzLCBwb2ludHMpO1xuICAgIGNhc2UgXCJwZXJwZW5kaWN1bGFyXCI6XG4gICAgICByZXR1cm4gcmVzb2x2ZVBlcnBlbmRpY3VsYXIoc3RlcCwgb2JqZWN0cywgcG9pbnRzKTtcbiAgICBjYXNlIFwicGFyYWxsZWxcIjpcbiAgICAgIHJldHVybiByZXNvbHZlUGFyYWxsZWwoc3RlcCwgb2JqZWN0cywgcG9pbnRzKTtcbiAgICBjYXNlIFwiYW5nbGVfYmlzZWN0b3JcIjpcbiAgICAgIHJldHVybiByZXNvbHZlQW5nbGVCaXNlY3RvcihzdGVwLCBvYmplY3RzLCBwb2ludHMpO1xuICAgIGNhc2UgXCJwb2x5Z29uXCI6XG4gICAgICByZXR1cm4gcmVzb2x2ZVBvbHlnb24oc3RlcCwgb2JqZWN0cywgcG9pbnRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRQb2ludChpZDogc3RyaW5nLCBwb2ludHM6IE1hcDxzdHJpbmcsIFZlYzI+KTogVmVjMiB7XG4gIGNvbnN0IHAgPSBwb2ludHMuZ2V0KGlkKTtcbiAgaWYgKCFwKSB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcG9pbnQgJyR7aWR9J2ApO1xuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gZ2V0T2JqZWN0KGlkOiBzdHJpbmcsIG9iamVjdHM6IE1hcDxzdHJpbmcsIFJlc29sdmVkT2JqZWN0Pik6IFJlc29sdmVkT2JqZWN0IHtcbiAgY29uc3Qgb2JqID0gb2JqZWN0cy5nZXQoaWQpO1xuICBpZiAoIW9iaikgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIG9iamVjdCAnJHtpZH0nYCk7XG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVMaW5lKFxuICBzdGVwOiB7IHRocm91Z2g6IFtzdHJpbmcsIHN0cmluZ107IGlkOiBzdHJpbmcgfSxcbiAgb2JqZWN0czogTWFwPHN0cmluZywgUmVzb2x2ZWRPYmplY3Q+LFxuICBwb2ludHM6IE1hcDxzdHJpbmcsIFZlYzI+XG4pOiB2b2lkIHtcbiAgY29uc3QgcDEgPSBnZXRQb2ludChzdGVwLnRocm91Z2hbMF0sIHBvaW50cyk7XG4gIGNvbnN0IHAyID0gZ2V0UG9pbnQoc3RlcC50aHJvdWdoWzFdLCBwb2ludHMpO1xuICBjb25zdCBsaW5lID0gZ2VvLmxpbmVGcm9tVHdvUG9pbnRzKHAxLCBwMik7XG4gIG9iamVjdHMuc2V0KHN0ZXAuaWQsIHtcbiAgICB0eXBlOiBcImxpbmVcIixcbiAgICBpZDogc3RlcC5pZCxcbiAgICBwb2ludDogbGluZS5wb2ludCxcbiAgICBkaXI6IGxpbmUuZGlyLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVNlZ21lbnQoXG4gIHN0ZXA6IHsgZnJvbTogc3RyaW5nOyB0bzogc3RyaW5nOyBpZDogc3RyaW5nIH0sXG4gIG9iamVjdHM6IE1hcDxzdHJpbmcsIFJlc29sdmVkT2JqZWN0PixcbiAgcG9pbnRzOiBNYXA8c3RyaW5nLCBWZWMyPlxuKTogdm9pZCB7XG4gIG9iamVjdHMuc2V0KHN0ZXAuaWQsIHtcbiAgICB0eXBlOiBcInNlZ21lbnRcIixcbiAgICBpZDogc3RlcC5pZCxcbiAgICBmcm9tOiBnZXRQb2ludChzdGVwLmZyb20sIHBvaW50cyksXG4gICAgdG86IGdldFBvaW50KHN0ZXAudG8sIHBvaW50cyksXG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlUmF5KFxuICBzdGVwOiB7IGZyb206IHN0cmluZzsgdGhyb3VnaDogc3RyaW5nOyBpZDogc3RyaW5nIH0sXG4gIG9iamVjdHM6IE1hcDxzdHJpbmcsIFJlc29sdmVkT2JqZWN0PixcbiAgcG9pbnRzOiBNYXA8c3RyaW5nLCBWZWMyPlxuKTogdm9pZCB7XG4gIGNvbnN0IG9yaWdpbiA9IGdldFBvaW50KHN0ZXAuZnJvbSwgcG9pbnRzKTtcbiAgY29uc3QgdGhyb3VnaCA9IGdldFBvaW50KHN0ZXAudGhyb3VnaCwgcG9pbnRzKTtcbiAgb2JqZWN0cy5zZXQoc3RlcC5pZCwge1xuICAgIHR5cGU6IFwicmF5XCIsXG4gICAgaWQ6IHN0ZXAuaWQsXG4gICAgb3JpZ2luLFxuICAgIGRpcjogZ2VvLm5vcm1hbGl6ZShnZW8uc3ViKHRocm91Z2gsIG9yaWdpbikpLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUNpcmNsZShcbiAgc3RlcDogeyBjZW50ZXI6IHN0cmluZzsgdGhyb3VnaD86IHN0cmluZzsgcmFkaXVzPzogbnVtYmVyIHwgc3RyaW5nOyBpZDogc3RyaW5nIH0sXG4gIG9iamVjdHM6IE1hcDxzdHJpbmcsIFJlc29sdmVkT2JqZWN0PixcbiAgcG9pbnRzOiBNYXA8c3RyaW5nLCBWZWMyPlxuKTogdm9pZCB7XG4gIGNvbnN0IGNlbnRlciA9IGdldFBvaW50KHN0ZXAuY2VudGVyLCBwb2ludHMpO1xuICBsZXQgcmFkaXVzOiBudW1iZXI7XG5cbiAgaWYgKHN0ZXAudGhyb3VnaCkge1xuICAgIHJhZGl1cyA9IGdlby5kaXN0KGNlbnRlciwgZ2V0UG9pbnQoc3RlcC50aHJvdWdoLCBwb2ludHMpKTtcbiAgfSBlbHNlIGlmIChzdGVwLnJhZGl1cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmFkaXVzID0gZXZhbHVhdGVFeHByZXNzaW9uKHN0ZXAucmFkaXVzLCBwb2ludHMpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2lyY2xlICcke3N0ZXAuaWR9JzogbmVlZCAndGhyb3VnaCcgb3IgJ3JhZGl1cydgKTtcbiAgfVxuXG4gIG9iamVjdHMuc2V0KHN0ZXAuaWQsIHsgdHlwZTogXCJjaXJjbGVcIiwgaWQ6IHN0ZXAuaWQsIGNlbnRlciwgcmFkaXVzIH0pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlSW50ZXJzZWN0KFxuICBzdGVwOiB7IG9mOiBbc3RyaW5nLCBzdHJpbmddOyBpZDogc3RyaW5nIHwgW3N0cmluZywgc3RyaW5nXTsgd2hpY2g/OiBudW1iZXIgfSxcbiAgb2JqZWN0czogTWFwPHN0cmluZywgUmVzb2x2ZWRPYmplY3Q+LFxuICBwb2ludHM6IE1hcDxzdHJpbmcsIFZlYzI+XG4pOiB2b2lkIHtcbiAgY29uc3Qgb2JqMSA9IGdldE9iamVjdChzdGVwLm9mWzBdLCBvYmplY3RzKTtcbiAgY29uc3Qgb2JqMiA9IGdldE9iamVjdChzdGVwLm9mWzFdLCBvYmplY3RzKTtcblxuICBsZXQgcmF3UG9pbnRzID0gY29tcHV0ZUludGVyc2VjdGlvbihvYmoxLCBvYmoyKTtcbiAgcmF3UG9pbnRzID0gZ2VvLnNvcnRJbnRlcnNlY3Rpb25zKHJhd1BvaW50cyk7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoc3RlcC5pZCkpIHtcbiAgICAvLyBUd28gSURzOiBhc3NpZ24gYm90aCBpbnRlcnNlY3Rpb24gcG9pbnRzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwLmlkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwb3M6IFZlYzIgPSBpIDwgcmF3UG9pbnRzLmxlbmd0aCA/IHJhd1BvaW50c1tpXSA6IFtOYU4sIE5hTl07XG4gICAgICBjb25zdCBwdDogUmVzb2x2ZWRQb2ludCA9IHsgdHlwZTogXCJwb2ludFwiLCBpZDogc3RlcC5pZFtpXSwgcG9zLCBkcmFnZ2FibGU6IGZhbHNlIH07XG4gICAgICBvYmplY3RzLnNldChzdGVwLmlkW2ldLCBwdCk7XG4gICAgICBwb2ludHMuc2V0KHN0ZXAuaWRbaV0sIHBvcyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFNpbmdsZSBJRCB3aXRoIG9wdGlvbmFsICd3aGljaCdcbiAgICBjb25zdCBpZHggPSAoc3RlcC53aGljaCA/PyAxKSAtIDE7XG4gICAgY29uc3QgcG9zOiBWZWMyID0gaWR4IDwgcmF3UG9pbnRzLmxlbmd0aCA/IHJhd1BvaW50c1tpZHhdIDogW05hTiwgTmFOXTtcbiAgICBjb25zdCBwdDogUmVzb2x2ZWRQb2ludCA9IHsgdHlwZTogXCJwb2ludFwiLCBpZDogc3RlcC5pZCwgcG9zLCBkcmFnZ2FibGU6IGZhbHNlIH07XG4gICAgb2JqZWN0cy5zZXQoc3RlcC5pZCwgcHQpO1xuICAgIHBvaW50cy5zZXQoc3RlcC5pZCwgcG9zKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21wdXRlSW50ZXJzZWN0aW9uKGE6IFJlc29sdmVkT2JqZWN0LCBiOiBSZXNvbHZlZE9iamVjdCk6IFZlYzJbXSB7XG4gIGNvbnN0IGFMaW5lID0gdG9MaW5lSW5mbyhhKTtcbiAgY29uc3QgYkxpbmUgPSB0b0xpbmVJbmZvKGIpO1xuICBjb25zdCBhQ2lyY2xlID0gYS50eXBlID09PSBcImNpcmNsZVwiID8gYSA6IG51bGw7XG4gIGNvbnN0IGJDaXJjbGUgPSBiLnR5cGUgPT09IFwiY2lyY2xlXCIgPyBiIDogbnVsbDtcblxuICBpZiAoYUxpbmUgJiYgYkxpbmUpIHtcbiAgICBjb25zdCBwID0gZ2VvLmxpbmVMaW5lSW50ZXJzZWN0aW9uKGFMaW5lLmxpbmUsIGJMaW5lLmxpbmUpO1xuICAgIGlmICghcCkgcmV0dXJuIFtdO1xuICAgIGxldCBwdHMgPSBbcF07XG4gICAgcHRzID0gZmlsdGVyQnlLaW5kKHB0cywgYSwgYUxpbmUpO1xuICAgIHB0cyA9IGZpbHRlckJ5S2luZChwdHMsIGIsIGJMaW5lKTtcbiAgICByZXR1cm4gcHRzO1xuICB9XG5cbiAgaWYgKGFMaW5lICYmIGJDaXJjbGUpIHtcbiAgICBsZXQgcHRzID0gZ2VvLmxpbmVDaXJjbGVJbnRlcnNlY3Rpb24oYUxpbmUubGluZSwgYkNpcmNsZS5jZW50ZXIsIGJDaXJjbGUucmFkaXVzKTtcbiAgICBwdHMgPSBmaWx0ZXJCeUtpbmQocHRzLCBhLCBhTGluZSk7XG4gICAgcmV0dXJuIHB0cztcbiAgfVxuXG4gIGlmIChhQ2lyY2xlICYmIGJMaW5lKSB7XG4gICAgbGV0IHB0cyA9IGdlby5saW5lQ2lyY2xlSW50ZXJzZWN0aW9uKGJMaW5lLmxpbmUsIGFDaXJjbGUuY2VudGVyLCBhQ2lyY2xlLnJhZGl1cyk7XG4gICAgcHRzID0gZmlsdGVyQnlLaW5kKHB0cywgYiwgYkxpbmUpO1xuICAgIHJldHVybiBwdHM7XG4gIH1cblxuICBpZiAoYUNpcmNsZSAmJiBiQ2lyY2xlKSB7XG4gICAgcmV0dXJuIGdlby5jaXJjbGVDaXJjbGVJbnRlcnNlY3Rpb24oYUNpcmNsZS5jZW50ZXIsIGFDaXJjbGUucmFkaXVzLCBiQ2lyY2xlLmNlbnRlciwgYkNpcmNsZS5yYWRpdXMpO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgaW50ZXJzZWN0ICcke2EudHlwZX0nIHdpdGggJyR7Yi50eXBlfSdgKTtcbn1cblxuaW50ZXJmYWNlIExpbmVJbmZvIHtcbiAgbGluZTogZ2VvLkxpbmU7XG59XG5cbmZ1bmN0aW9uIHRvTGluZUluZm8ob2JqOiBSZXNvbHZlZE9iamVjdCk6IExpbmVJbmZvIHwgbnVsbCB7XG4gIHN3aXRjaCAob2JqLnR5cGUpIHtcbiAgICBjYXNlIFwibGluZVwiOlxuICAgICAgcmV0dXJuIHsgbGluZTogeyBwb2ludDogb2JqLnBvaW50LCBkaXI6IG9iai5kaXIgfSB9O1xuICAgIGNhc2UgXCJzZWdtZW50XCI6XG4gICAgICByZXR1cm4geyBsaW5lOiBnZW8ubGluZUZyb21Ud29Qb2ludHMob2JqLmZyb20sIG9iai50bykgfTtcbiAgICBjYXNlIFwicmF5XCI6XG4gICAgICByZXR1cm4geyBsaW5lOiB7IHBvaW50OiBvYmoub3JpZ2luLCBkaXI6IG9iai5kaXIgfSB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJCeUtpbmQocHRzOiBWZWMyW10sIG9iajogUmVzb2x2ZWRPYmplY3QsIF9pbmZvOiBMaW5lSW5mbyk6IFZlYzJbXSB7XG4gIGlmIChvYmoudHlwZSA9PT0gXCJzZWdtZW50XCIpIHtcbiAgICByZXR1cm4gZ2VvLmZpbHRlclNlZ21lbnQocHRzLCAob2JqIGFzIFJlc29sdmVkU2VnbWVudCkuZnJvbSwgKG9iaiBhcyBSZXNvbHZlZFNlZ21lbnQpLnRvKTtcbiAgfVxuICBpZiAob2JqLnR5cGUgPT09IFwicmF5XCIpIHtcbiAgICByZXR1cm4gZ2VvLmZpbHRlclJheShwdHMsIChvYmogYXMgUmVzb2x2ZWRSYXkpLm9yaWdpbiwgKG9iaiBhcyBSZXNvbHZlZFJheSkuZGlyKTtcbiAgfVxuICByZXR1cm4gcHRzOyAvLyBpbmZpbml0ZSBsaW5lIFx1MjAxNCBubyBmaWx0ZXJpbmdcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZU1pZHBvaW50KFxuICBzdGVwOiB7IG9mOiBbc3RyaW5nLCBzdHJpbmddOyBpZDogc3RyaW5nIH0sXG4gIG9iamVjdHM6IE1hcDxzdHJpbmcsIFJlc29sdmVkT2JqZWN0PixcbiAgcG9pbnRzOiBNYXA8c3RyaW5nLCBWZWMyPlxuKTogdm9pZCB7XG4gIGNvbnN0IHAxID0gZ2V0UG9pbnQoc3RlcC5vZlswXSwgcG9pbnRzKTtcbiAgY29uc3QgcDIgPSBnZXRQb2ludChzdGVwLm9mWzFdLCBwb2ludHMpO1xuICBjb25zdCBwb3MgPSBnZW8ubWlkcG9pbnQocDEsIHAyKTtcbiAgb2JqZWN0cy5zZXQoc3RlcC5pZCwgeyB0eXBlOiBcInBvaW50XCIsIGlkOiBzdGVwLmlkLCBwb3MsIGRyYWdnYWJsZTogZmFsc2UgfSk7XG4gIHBvaW50cy5zZXQoc3RlcC5pZCwgcG9zKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVBlcnBlbmRpY3VsYXIoXG4gIHN0ZXA6IHsgdG86IHN0cmluZzsgdGhyb3VnaDogc3RyaW5nOyBpZDogc3RyaW5nIH0sXG4gIG9iamVjdHM6IE1hcDxzdHJpbmcsIFJlc29sdmVkT2JqZWN0PixcbiAgcG9pbnRzOiBNYXA8c3RyaW5nLCBWZWMyPlxuKTogdm9pZCB7XG4gIGNvbnN0IGxpbmVPYmogPSBnZXRPYmplY3Qoc3RlcC50bywgb2JqZWN0cyk7XG4gIGNvbnN0IGxpbmVJbmZvID0gdG9MaW5lSW5mbyhsaW5lT2JqKTtcbiAgaWYgKCFsaW5lSW5mbykgdGhyb3cgbmV3IEVycm9yKGAnJHtzdGVwLnRvfScgaXMgbm90IGEgbGluZS1saWtlIG9iamVjdGApO1xuICBjb25zdCB0aHJvdWdoUHQgPSBnZXRQb2ludChzdGVwLnRocm91Z2gsIHBvaW50cyk7XG4gIGNvbnN0IHJlc3VsdCA9IGdlby5wZXJwZW5kaWN1bGFyVGhyb3VnaChsaW5lSW5mby5saW5lLCB0aHJvdWdoUHQpO1xuICBvYmplY3RzLnNldChzdGVwLmlkLCB7IHR5cGU6IFwibGluZVwiLCBpZDogc3RlcC5pZCwgcG9pbnQ6IHJlc3VsdC5wb2ludCwgZGlyOiByZXN1bHQuZGlyIH0pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlUGFyYWxsZWwoXG4gIHN0ZXA6IHsgdG86IHN0cmluZzsgdGhyb3VnaDogc3RyaW5nOyBpZDogc3RyaW5nIH0sXG4gIG9iamVjdHM6IE1hcDxzdHJpbmcsIFJlc29sdmVkT2JqZWN0PixcbiAgcG9pbnRzOiBNYXA8c3RyaW5nLCBWZWMyPlxuKTogdm9pZCB7XG4gIGNvbnN0IGxpbmVPYmogPSBnZXRPYmplY3Qoc3RlcC50bywgb2JqZWN0cyk7XG4gIGNvbnN0IGxpbmVJbmZvID0gdG9MaW5lSW5mbyhsaW5lT2JqKTtcbiAgaWYgKCFsaW5lSW5mbykgdGhyb3cgbmV3IEVycm9yKGAnJHtzdGVwLnRvfScgaXMgbm90IGEgbGluZS1saWtlIG9iamVjdGApO1xuICBjb25zdCB0aHJvdWdoUHQgPSBnZXRQb2ludChzdGVwLnRocm91Z2gsIHBvaW50cyk7XG4gIGNvbnN0IHJlc3VsdCA9IGdlby5wYXJhbGxlbFRocm91Z2gobGluZUluZm8ubGluZSwgdGhyb3VnaFB0KTtcbiAgb2JqZWN0cy5zZXQoc3RlcC5pZCwgeyB0eXBlOiBcImxpbmVcIiwgaWQ6IHN0ZXAuaWQsIHBvaW50OiByZXN1bHQucG9pbnQsIGRpcjogcmVzdWx0LmRpciB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUFuZ2xlQmlzZWN0b3IoXG4gIHN0ZXA6IHsgcG9pbnRzOiBbc3RyaW5nLCBzdHJpbmcsIHN0cmluZ107IGlkOiBzdHJpbmcgfSxcbiAgb2JqZWN0czogTWFwPHN0cmluZywgUmVzb2x2ZWRPYmplY3Q+LFxuICBwb2ludHM6IE1hcDxzdHJpbmcsIFZlYzI+XG4pOiB2b2lkIHtcbiAgY29uc3QgYSA9IGdldFBvaW50KHN0ZXAucG9pbnRzWzBdLCBwb2ludHMpO1xuICBjb25zdCB2ZXJ0ZXggPSBnZXRQb2ludChzdGVwLnBvaW50c1sxXSwgcG9pbnRzKTtcbiAgY29uc3QgYiA9IGdldFBvaW50KHN0ZXAucG9pbnRzWzJdLCBwb2ludHMpO1xuICBjb25zdCByZXN1bHQgPSBnZW8uYW5nbGVCaXNlY3RvclRocm91Z2goYSwgdmVydGV4LCBiKTtcbiAgb2JqZWN0cy5zZXQoc3RlcC5pZCwgeyB0eXBlOiBcImxpbmVcIiwgaWQ6IHN0ZXAuaWQsIHBvaW50OiByZXN1bHQucG9pbnQsIGRpcjogcmVzdWx0LmRpciB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVBvbHlnb24oXG4gIHN0ZXA6IHsgdmVydGljZXM6IHN0cmluZ1tdOyBpZDogc3RyaW5nIH0sXG4gIG9iamVjdHM6IE1hcDxzdHJpbmcsIFJlc29sdmVkT2JqZWN0PixcbiAgcG9pbnRzOiBNYXA8c3RyaW5nLCBWZWMyPlxuKTogdm9pZCB7XG4gIGNvbnN0IHZlcnRzID0gc3RlcC52ZXJ0aWNlcy5tYXAoKGlkKSA9PiBnZXRQb2ludChpZCwgcG9pbnRzKSk7XG4gIG9iamVjdHMuc2V0KHN0ZXAuaWQsIHsgdHlwZTogXCJwb2x5Z29uXCIsIGlkOiBzdGVwLmlkLCB2ZXJ0aWNlczogdmVydHMgfSk7XG59XG4iLCAiaW1wb3J0IHsgQ29uZmlnRGVmLCBWZWMyIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xuICBjb25maWc6IENvbmZpZ0RlZjtcbiAgc2NhbGU6IG51bWJlcjtcbiAgLyoqIENhbWVyYSBvZmZzZXQgaW4gbWF0aC1zcGFjZSBjb29yZGluYXRlcyAqL1xuICBwYW5YOiBudW1iZXIgPSAwO1xuICBwYW5ZOiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnRGVmKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5zY2FsZSA9IGNvbmZpZy5zY2FsZTtcbiAgfVxuXG4gIGdldCBib3VuZHMoKSB7XG4gICAgY29uc3QgY3ggPSB0aGlzLmNvbmZpZy53aWR0aCAvIDI7XG4gICAgY29uc3QgY3kgPSB0aGlzLmNvbmZpZy5oZWlnaHQgLyAyO1xuICAgIHJldHVybiB7XG4gICAgICBtaW5YOiB0aGlzLnBhblggLSBjeCAvIHRoaXMuc2NhbGUsXG4gICAgICBtYXhYOiB0aGlzLnBhblggKyBjeCAvIHRoaXMuc2NhbGUsXG4gICAgICBtaW5ZOiB0aGlzLnBhblkgLSBjeSAvIHRoaXMuc2NhbGUsXG4gICAgICBtYXhZOiB0aGlzLnBhblkgKyBjeSAvIHRoaXMuc2NhbGUsXG4gICAgfTtcbiAgfVxuXG4gIHRvUGl4ZWwoW3gsIHldOiBWZWMyKTogVmVjMiB7XG4gICAgY29uc3QgY3ggPSB0aGlzLmNvbmZpZy53aWR0aCAvIDI7XG4gICAgY29uc3QgY3kgPSB0aGlzLmNvbmZpZy5oZWlnaHQgLyAyO1xuICAgIHJldHVybiBbXG4gICAgICBjeCArICh4IC0gdGhpcy5wYW5YKSAqIHRoaXMuc2NhbGUsXG4gICAgICBjeSAtICh5IC0gdGhpcy5wYW5ZKSAqIHRoaXMuc2NhbGUsXG4gICAgXTtcbiAgfVxuXG4gIHRvTWF0aChbcHgsIHB5XTogVmVjMik6IFZlYzIge1xuICAgIGNvbnN0IGN4ID0gdGhpcy5jb25maWcud2lkdGggLyAyO1xuICAgIGNvbnN0IGN5ID0gdGhpcy5jb25maWcuaGVpZ2h0IC8gMjtcbiAgICByZXR1cm4gW1xuICAgICAgKHB4IC0gY3gpIC8gdGhpcy5zY2FsZSArIHRoaXMucGFuWCxcbiAgICAgIChjeSAtIHB5KSAvIHRoaXMuc2NhbGUgKyB0aGlzLnBhblksXG4gICAgXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2FudmFzKFxuICBjb250YWluZXI6IEhUTUxFbGVtZW50LFxuICBjb25maWc6IENvbmZpZ0RlZlxuKTogeyBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50OyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDsgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gfSB7XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gIGNhbnZhcy53aWR0aCA9IGNvbmZpZy53aWR0aDtcbiAgY2FudmFzLmhlaWdodCA9IGNvbmZpZy5oZWlnaHQ7XG4gIGNhbnZhcy5jbGFzc0xpc3QuYWRkKFwiZ2VvbWV0cnktY2FudmFzXCIpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpITtcbiAgY29uc3QgdHJhbnNmb3JtID0gbmV3IFRyYW5zZm9ybShjb25maWcpO1xuXG4gIHJldHVybiB7IGNhbnZhcywgY3R4LCB0cmFuc2Zvcm0gfTtcbn1cbiIsICJpbXBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9jYW52YXNcIjtcbmltcG9ydCB7IFRoZW1lQ29sb3JzIH0gZnJvbSBcIi4vdGhlbWVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdHcmlkKFxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgdHJhbnNmb3JtOiBUcmFuc2Zvcm0sXG4gIHRoZW1lOiBUaGVtZUNvbG9yc1xuKTogdm9pZCB7XG4gIGNvbnN0IHsgYm91bmRzLCBjb25maWcgfSA9IHRyYW5zZm9ybTtcblxuICBjdHguc2F2ZSgpO1xuXG4gIGlmIChjb25maWcuZ3JpZCkge1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoZW1lLmdyaWRMaW5lO1xuICAgIGN0eC5saW5lV2lkdGggPSAwLjU7XG5cbiAgICBjb25zdCBzdGFydFggPSBNYXRoLmNlaWwoYm91bmRzLm1pblgpO1xuICAgIGNvbnN0IGVuZFggPSBNYXRoLmZsb29yKGJvdW5kcy5tYXhYKTtcbiAgICBjb25zdCBzdGFydFkgPSBNYXRoLmNlaWwoYm91bmRzLm1pblkpO1xuICAgIGNvbnN0IGVuZFkgPSBNYXRoLmZsb29yKGJvdW5kcy5tYXhZKTtcblxuICAgIGZvciAobGV0IHggPSBzdGFydFg7IHggPD0gZW5kWDsgeCsrKSB7XG4gICAgICBjb25zdCBbcHhdID0gdHJhbnNmb3JtLnRvUGl4ZWwoW3gsIDBdKTtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8ocHgsIDApO1xuICAgICAgY3R4LmxpbmVUbyhweCwgY29uZmlnLmhlaWdodCk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgeSA9IHN0YXJ0WTsgeSA8PSBlbmRZOyB5KyspIHtcbiAgICAgIGNvbnN0IFssIHB5XSA9IHRyYW5zZm9ybS50b1BpeGVsKFswLCB5XSk7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDAsIHB5KTtcbiAgICAgIGN0eC5saW5lVG8oY29uZmlnLndpZHRoLCBweSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbmZpZy5heGVzKSB7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gdGhlbWUuYXhpcztcbiAgICBjdHgubGluZVdpZHRoID0gMS41O1xuXG4gICAgY29uc3QgWywgeUF4aXNQeF0gPSB0cmFuc2Zvcm0udG9QaXhlbChbMCwgMF0pO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKDAsIHlBeGlzUHgpO1xuICAgIGN0eC5saW5lVG8oY29uZmlnLndpZHRoLCB5QXhpc1B4KTtcbiAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICBjb25zdCBbeEF4aXNQeF0gPSB0cmFuc2Zvcm0udG9QaXhlbChbMCwgMF0pO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKHhBeGlzUHgsIDApO1xuICAgIGN0eC5saW5lVG8oeEF4aXNQeCwgY29uZmlnLmhlaWdodCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoZW1lLnRpY2tMYWJlbDtcbiAgICBjdHguZm9udCA9IFwiMTBweCBzYW5zLXNlcmlmXCI7XG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XG5cbiAgICBjb25zdCBzdGFydFggPSBNYXRoLmNlaWwoYm91bmRzLm1pblgpO1xuICAgIGNvbnN0IGVuZFggPSBNYXRoLmZsb29yKGJvdW5kcy5tYXhYKTtcbiAgICBmb3IgKGxldCB4ID0gc3RhcnRYOyB4IDw9IGVuZFg7IHgrKykge1xuICAgICAgaWYgKHggPT09IDApIGNvbnRpbnVlO1xuICAgICAgY29uc3QgW3B4XSA9IHRyYW5zZm9ybS50b1BpeGVsKFt4LCAwXSk7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKHB4LCB5QXhpc1B4IC0gMyk7XG4gICAgICBjdHgubGluZVRvKHB4LCB5QXhpc1B4ICsgMyk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBjdHguZmlsbFRleHQoU3RyaW5nKHgpLCBweCwgeUF4aXNQeCArIDUpO1xuICAgIH1cblxuICAgIGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCI7XG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG4gICAgY29uc3Qgc3RhcnRZID0gTWF0aC5jZWlsKGJvdW5kcy5taW5ZKTtcbiAgICBjb25zdCBlbmRZID0gTWF0aC5mbG9vcihib3VuZHMubWF4WSk7XG4gICAgZm9yIChsZXQgeSA9IHN0YXJ0WTsgeSA8PSBlbmRZOyB5KyspIHtcbiAgICAgIGlmICh5ID09PSAwKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IFssIHB5XSA9IHRyYW5zZm9ybS50b1BpeGVsKFswLCB5XSk7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKHhBeGlzUHggLSAzLCBweSk7XG4gICAgICBjdHgubGluZVRvKHhBeGlzUHggKyAzLCBweSk7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBjdHguZmlsbFRleHQoU3RyaW5nKHkpLCB4QXhpc1B4IC0gNiwgcHkpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5yZXN0b3JlKCk7XG59XG4iLCAiaW1wb3J0IHtcbiAgUmVzb2x2ZWRPYmplY3QsXG4gIFJlc29sdmVkU2NlbmUsXG4gIFN0eWxlRGVmLFxuICBWZWMyLFxufSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL2NhbnZhc1wiO1xuaW1wb3J0IHsgZHJhd0dyaWQgfSBmcm9tIFwiLi9ncmlkXCI7XG5pbXBvcnQgeyBUaGVtZUNvbG9ycyB9IGZyb20gXCIuL3RoZW1lXCI7XG5cbmNvbnN0IERFRkFVTFRfUE9JTlRfU0laRSA9IDQ7XG5jb25zdCBERUZBVUxUX0xJTkVfV0lEVEggPSAxLjU7XG5jb25zdCBMQUJFTF9PRkZTRVQgPSAxMDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclNjZW5lKFxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgc2NlbmU6IFJlc29sdmVkU2NlbmUsXG4gIHRyYW5zZm9ybTogVHJhbnNmb3JtLFxuICB0aGVtZTogVGhlbWVDb2xvcnNcbik6IHZvaWQge1xuICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHNjZW5lLmNvbmZpZztcblxuICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gIGN0eC5maWxsU3R5bGUgPSB0aGVtZS5iZztcbiAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gIGRyYXdHcmlkKGN0eCwgdHJhbnNmb3JtLCB0aGVtZSk7XG5cbiAgaWYgKHNjZW5lLnRpdGxlKSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguZmlsbFN0eWxlID0gdGhlbWUudGV4dDtcbiAgICBjdHguZm9udCA9IFwiYm9sZCAxNHB4IHNhbnMtc2VyaWZcIjtcbiAgICBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCI7XG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XG4gICAgY3R4LmZpbGxUZXh0KHNjZW5lLnRpdGxlLCA4LCA4KTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgY29uc3Qgb3JkZXJlZCA9IHNvcnRCeVpPcmRlcihbLi4uc2NlbmUub2JqZWN0cy52YWx1ZXMoKV0pO1xuXG4gIGZvciAoY29uc3Qgb2JqIG9mIG9yZGVyZWQpIHtcbiAgICBjb25zdCBzdHlsZSA9IHNjZW5lLnN0eWxlW29iai5pZF0gPz8ge307XG4gICAgZHJhd09iamVjdChjdHgsIG9iaiwgc3R5bGUsIHRyYW5zZm9ybSwgdGhlbWUpO1xuICB9XG59XG5cbmNvbnN0IFpfT1JERVI6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7XG4gIHBvbHlnb246IDAsXG4gIGNpcmNsZTogMSxcbiAgbGluZTogMixcbiAgc2VnbWVudDogMixcbiAgcmF5OiAyLFxuICBwb2ludDogMyxcbn07XG5cbmZ1bmN0aW9uIHNvcnRCeVpPcmRlcihvYmplY3RzOiBSZXNvbHZlZE9iamVjdFtdKTogUmVzb2x2ZWRPYmplY3RbXSB7XG4gIHJldHVybiBvYmplY3RzLnNvcnQoKGEsIGIpID0+IChaX09SREVSW2EudHlwZV0gPz8gMikgLSAoWl9PUkRFUltiLnR5cGVdID8/IDIpKTtcbn1cblxuZnVuY3Rpb24gZHJhd09iamVjdChcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gIG9iajogUmVzb2x2ZWRPYmplY3QsXG4gIHN0eWxlOiBTdHlsZURlZixcbiAgdHJhbnNmb3JtOiBUcmFuc2Zvcm0sXG4gIHRoZW1lOiBUaGVtZUNvbG9yc1xuKTogdm9pZCB7XG4gIHN3aXRjaCAob2JqLnR5cGUpIHtcbiAgICBjYXNlIFwicG9pbnRcIjpcbiAgICAgIHJldHVybiBkcmF3UG9pbnQoY3R4LCBvYmoucG9zLCBvYmouaWQsIHN0eWxlLCB0cmFuc2Zvcm0sIHRoZW1lKTtcbiAgICBjYXNlIFwic2VnbWVudFwiOlxuICAgICAgcmV0dXJuIGRyYXdTZWdtZW50KGN0eCwgb2JqLmZyb20sIG9iai50bywgc3R5bGUsIHRyYW5zZm9ybSwgdGhlbWUpO1xuICAgIGNhc2UgXCJsaW5lXCI6XG4gICAgICByZXR1cm4gZHJhd0xpbmUoY3R4LCBvYmoucG9pbnQsIG9iai5kaXIsIHN0eWxlLCB0cmFuc2Zvcm0sIHRoZW1lKTtcbiAgICBjYXNlIFwicmF5XCI6XG4gICAgICByZXR1cm4gZHJhd1JheShjdHgsIG9iai5vcmlnaW4sIG9iai5kaXIsIHN0eWxlLCB0cmFuc2Zvcm0sIHRoZW1lKTtcbiAgICBjYXNlIFwiY2lyY2xlXCI6XG4gICAgICByZXR1cm4gZHJhd0NpcmNsZShjdHgsIG9iai5jZW50ZXIsIG9iai5yYWRpdXMsIHN0eWxlLCB0cmFuc2Zvcm0sIHRoZW1lKTtcbiAgICBjYXNlIFwicG9seWdvblwiOlxuICAgICAgcmV0dXJuIGRyYXdQb2x5Z29uKGN0eCwgb2JqLnZlcnRpY2VzLCBzdHlsZSwgdHJhbnNmb3JtLCB0aGVtZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlTdHJva2UoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHN0eWxlOiBTdHlsZURlZiwgdGhlbWU6IFRoZW1lQ29sb3JzKTogdm9pZCB7XG4gIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLmNvbG9yID8/IHRoZW1lLnRleHQ7XG4gIGN0eC5saW5lV2lkdGggPSBzdHlsZS53aWR0aCA/PyBERUZBVUxUX0xJTkVfV0lEVEg7XG4gIGN0eC5zZXRMaW5lRGFzaChzdHlsZS5kYXNoID8gWzYsIDRdIDogW10pO1xufVxuXG5mdW5jdGlvbiBkcmF3UG9pbnQoXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICBwb3M6IFZlYzIsXG4gIGlkOiBzdHJpbmcsXG4gIHN0eWxlOiBTdHlsZURlZixcbiAgdHJhbnNmb3JtOiBUcmFuc2Zvcm0sXG4gIHRoZW1lOiBUaGVtZUNvbG9yc1xuKTogdm9pZCB7XG4gIGlmIChpc05hTihwb3NbMF0pIHx8IGlzTmFOKHBvc1sxXSkpIHJldHVybjtcblxuICBjb25zdCBbcHgsIHB5XSA9IHRyYW5zZm9ybS50b1BpeGVsKHBvcyk7XG4gIGNvbnN0IHIgPSBzdHlsZS5zaXplID8/IERFRkFVTFRfUE9JTlRfU0laRTtcblxuICBjdHguc2F2ZSgpO1xuICBjdHguZmlsbFN0eWxlID0gc3R5bGUuY29sb3IgPz8gdGhlbWUudGV4dDtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHguYXJjKHB4LCBweSwgciwgMCwgTWF0aC5QSSAqIDIpO1xuICBjdHguZmlsbCgpO1xuXG4gIGNvbnN0IGxhYmVsID0gc3R5bGUubGFiZWwgPz8gaWQ7XG4gIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5jb2xvciA/PyB0aGVtZS50ZXh0O1xuICBjdHguZm9udCA9IFwiMTJweCBzYW5zLXNlcmlmXCI7XG4gIGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIjtcbiAgY3R4LnRleHRCYXNlbGluZSA9IFwiYm90dG9tXCI7XG4gIGN0eC5maWxsVGV4dChsYWJlbCwgcHggKyBMQUJFTF9PRkZTRVQsIHB5IC0gTEFCRUxfT0ZGU0VUIC8gMik7XG5cbiAgY3R4LnJlc3RvcmUoKTtcbn1cblxuZnVuY3Rpb24gZHJhd1NlZ21lbnQoXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICBmcm9tOiBWZWMyLFxuICB0bzogVmVjMixcbiAgc3R5bGU6IFN0eWxlRGVmLFxuICB0cmFuc2Zvcm06IFRyYW5zZm9ybSxcbiAgdGhlbWU6IFRoZW1lQ29sb3JzXG4pOiB2b2lkIHtcbiAgY29uc3QgW3gxLCB5MV0gPSB0cmFuc2Zvcm0udG9QaXhlbChmcm9tKTtcbiAgY29uc3QgW3gyLCB5Ml0gPSB0cmFuc2Zvcm0udG9QaXhlbCh0byk7XG5cbiAgY3R4LnNhdmUoKTtcbiAgYXBwbHlTdHJva2UoY3R4LCBzdHlsZSwgdGhlbWUpO1xuICBjdHguYmVnaW5QYXRoKCk7XG4gIGN0eC5tb3ZlVG8oeDEsIHkxKTtcbiAgY3R4LmxpbmVUbyh4MiwgeTIpO1xuICBjdHguc3Ryb2tlKCk7XG4gIGN0eC5yZXN0b3JlKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdMaW5lKFxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgcG9pbnQ6IFZlYzIsXG4gIGRpcjogVmVjMixcbiAgc3R5bGU6IFN0eWxlRGVmLFxuICB0cmFuc2Zvcm06IFRyYW5zZm9ybSxcbiAgdGhlbWU6IFRoZW1lQ29sb3JzXG4pOiB2b2lkIHtcbiAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0cmFuc2Zvcm0uY29uZmlnO1xuICBjb25zdCBkaWFnb25hbCA9IE1hdGguc3FydCh3aWR0aCAqIHdpZHRoICsgaGVpZ2h0ICogaGVpZ2h0KSAvIHRyYW5zZm9ybS5zY2FsZTtcbiAgY29uc3QgdDEgPSAtZGlhZ29uYWwgKiAyO1xuICBjb25zdCB0MiA9IGRpYWdvbmFsICogMjtcblxuICBjb25zdCBwMTogVmVjMiA9IFtwb2ludFswXSArIGRpclswXSAqIHQxLCBwb2ludFsxXSArIGRpclsxXSAqIHQxXTtcbiAgY29uc3QgcDI6IFZlYzIgPSBbcG9pbnRbMF0gKyBkaXJbMF0gKiB0MiwgcG9pbnRbMV0gKyBkaXJbMV0gKiB0Ml07XG5cbiAgY29uc3QgW3gxLCB5MV0gPSB0cmFuc2Zvcm0udG9QaXhlbChwMSk7XG4gIGNvbnN0IFt4MiwgeTJdID0gdHJhbnNmb3JtLnRvUGl4ZWwocDIpO1xuXG4gIGN0eC5zYXZlKCk7XG4gIGFwcGx5U3Ryb2tlKGN0eCwgc3R5bGUsIHRoZW1lKTtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHgubW92ZVRvKHgxLCB5MSk7XG4gIGN0eC5saW5lVG8oeDIsIHkyKTtcbiAgY3R4LnN0cm9rZSgpO1xuICBjdHgucmVzdG9yZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3UmF5KFxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgb3JpZ2luOiBWZWMyLFxuICBkaXI6IFZlYzIsXG4gIHN0eWxlOiBTdHlsZURlZixcbiAgdHJhbnNmb3JtOiBUcmFuc2Zvcm0sXG4gIHRoZW1lOiBUaGVtZUNvbG9yc1xuKTogdm9pZCB7XG4gIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdHJhbnNmb3JtLmNvbmZpZztcbiAgY29uc3QgZGlhZ29uYWwgPSBNYXRoLnNxcnQod2lkdGggKiB3aWR0aCArIGhlaWdodCAqIGhlaWdodCkgLyB0cmFuc2Zvcm0uc2NhbGU7XG4gIGNvbnN0IGZhclBvaW50OiBWZWMyID0gW29yaWdpblswXSArIGRpclswXSAqIGRpYWdvbmFsICogMiwgb3JpZ2luWzFdICsgZGlyWzFdICogZGlhZ29uYWwgKiAyXTtcblxuICBjb25zdCBbeDEsIHkxXSA9IHRyYW5zZm9ybS50b1BpeGVsKG9yaWdpbik7XG4gIGNvbnN0IFt4MiwgeTJdID0gdHJhbnNmb3JtLnRvUGl4ZWwoZmFyUG9pbnQpO1xuXG4gIGN0eC5zYXZlKCk7XG4gIGFwcGx5U3Ryb2tlKGN0eCwgc3R5bGUsIHRoZW1lKTtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHgubW92ZVRvKHgxLCB5MSk7XG4gIGN0eC5saW5lVG8oeDIsIHkyKTtcbiAgY3R4LnN0cm9rZSgpO1xuICBjdHgucmVzdG9yZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3Q2lyY2xlKFxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgY2VudGVyOiBWZWMyLFxuICByYWRpdXM6IG51bWJlcixcbiAgc3R5bGU6IFN0eWxlRGVmLFxuICB0cmFuc2Zvcm06IFRyYW5zZm9ybSxcbiAgdGhlbWU6IFRoZW1lQ29sb3JzXG4pOiB2b2lkIHtcbiAgY29uc3QgW2N4LCBjeV0gPSB0cmFuc2Zvcm0udG9QaXhlbChjZW50ZXIpO1xuICBjb25zdCByUHggPSByYWRpdXMgKiB0cmFuc2Zvcm0uc2NhbGU7XG5cbiAgY3R4LnNhdmUoKTtcblxuICBpZiAoc3R5bGUuZmlsbCkge1xuICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5maWxsO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKGN4LCBjeSwgclB4LCAwLCBNYXRoLlBJICogMik7XG4gICAgY3R4LmZpbGwoKTtcbiAgfVxuXG4gIGFwcGx5U3Ryb2tlKGN0eCwgc3R5bGUsIHRoZW1lKTtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHguYXJjKGN4LCBjeSwgclB4LCAwLCBNYXRoLlBJICogMik7XG4gIGN0eC5zdHJva2UoKTtcblxuICBjdHgucmVzdG9yZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3UG9seWdvbihcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gIHZlcnRpY2VzOiBWZWMyW10sXG4gIHN0eWxlOiBTdHlsZURlZixcbiAgdHJhbnNmb3JtOiBUcmFuc2Zvcm0sXG4gIHRoZW1lOiBUaGVtZUNvbG9yc1xuKTogdm9pZCB7XG4gIGlmICh2ZXJ0aWNlcy5sZW5ndGggPCAzKSByZXR1cm47XG5cbiAgY29uc3QgcGl4ZWxWZXJ0cyA9IHZlcnRpY2VzLm1hcCgodikgPT4gdHJhbnNmb3JtLnRvUGl4ZWwodikpO1xuXG4gIGN0eC5zYXZlKCk7XG5cbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHgubW92ZVRvKHBpeGVsVmVydHNbMF1bMF0sIHBpeGVsVmVydHNbMF1bMV0pO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IHBpeGVsVmVydHMubGVuZ3RoOyBpKyspIHtcbiAgICBjdHgubGluZVRvKHBpeGVsVmVydHNbaV1bMF0sIHBpeGVsVmVydHNbaV1bMV0pO1xuICB9XG4gIGN0eC5jbG9zZVBhdGgoKTtcblxuICBpZiAoc3R5bGUuZmlsbCkge1xuICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5maWxsO1xuICAgIGN0eC5maWxsKCk7XG4gIH1cblxuICBhcHBseVN0cm9rZShjdHgsIHN0eWxlLCB0aGVtZSk7XG4gIGN0eC5zdHJva2UoKTtcblxuICBjdHgucmVzdG9yZSgpO1xufVxuIiwgImV4cG9ydCBpbnRlcmZhY2UgVGhlbWVDb2xvcnMge1xuICBiZzogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIHRleHRNdXRlZDogc3RyaW5nO1xuICBncmlkTGluZTogc3RyaW5nO1xuICBheGlzOiBzdHJpbmc7XG4gIHRpY2tMYWJlbDogc3RyaW5nO1xufVxuXG5jb25zdCBGQUxMQkFDS19MSUdIVDogVGhlbWVDb2xvcnMgPSB7XG4gIGJnOiBcIiNmZmZmZmZcIixcbiAgdGV4dDogXCIjMzMzMzMzXCIsXG4gIHRleHRNdXRlZDogXCIjNjY2NjY2XCIsXG4gIGdyaWRMaW5lOiBcIiNlMGUwZTBcIixcbiAgYXhpczogXCIjOTk5OTk5XCIsXG4gIHRpY2tMYWJlbDogXCIjNjY2NjY2XCIsXG59O1xuXG5jb25zdCBGQUxMQkFDS19EQVJLOiBUaGVtZUNvbG9ycyA9IHtcbiAgYmc6IFwiIzFlMWUxZVwiLFxuICB0ZXh0OiBcIiNkY2RkZGVcIixcbiAgdGV4dE11dGVkOiBcIiM5OTk5OTlcIixcbiAgZ3JpZExpbmU6IFwiIzMzMzMzM1wiLFxuICBheGlzOiBcIiM1NTU1NTVcIixcbiAgdGlja0xhYmVsOiBcIiM4ODg4ODhcIixcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaGVtZUNvbG9ycygpOiBUaGVtZUNvbG9ycyB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuYm9keTtcbiAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgY29uc3QgaXNEYXJrID0gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwidGhlbWUtZGFya1wiKTtcblxuICBjb25zdCBmYWxsYmFjayA9IGlzRGFyayA/IEZBTExCQUNLX0RBUksgOiBGQUxMQkFDS19MSUdIVDtcblxuICByZXR1cm4ge1xuICAgIGJnOiByZWFkVmFyKHN0eWxlLCBcIi0tYmFja2dyb3VuZC1wcmltYXJ5XCIpIHx8IGZhbGxiYWNrLmJnLFxuICAgIHRleHQ6IHJlYWRWYXIoc3R5bGUsIFwiLS10ZXh0LW5vcm1hbFwiKSB8fCBmYWxsYmFjay50ZXh0LFxuICAgIHRleHRNdXRlZDogcmVhZFZhcihzdHlsZSwgXCItLXRleHQtbXV0ZWRcIikgfHwgZmFsbGJhY2sudGV4dE11dGVkLFxuICAgIGdyaWRMaW5lOiBpc0RhcmsgPyBmYWxsYmFjay5ncmlkTGluZSA6IGZhbGxiYWNrLmdyaWRMaW5lLFxuICAgIGF4aXM6IHJlYWRWYXIoc3R5bGUsIFwiLS10ZXh0LW11dGVkXCIpIHx8IGZhbGxiYWNrLmF4aXMsXG4gICAgdGlja0xhYmVsOiByZWFkVmFyKHN0eWxlLCBcIi0tdGV4dC1tdXRlZFwiKSB8fCBmYWxsYmFjay50aWNrTGFiZWwsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlYWRWYXIoc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24sIHZhck5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHZhck5hbWUpLnRyaW0oKTtcbn1cbiIsICJpbXBvcnQgeyBDb25zdHJ1Y3Rpb25TdGVwLCBHZW9tZXRyeVNjZW5lLCBSZXNvbHZlZE9iamVjdCwgUmVzb2x2ZWRTY2VuZSwgVmVjMiB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgc29sdmUgfSBmcm9tIFwiLi4vZW5naW5lL3NvbHZlclwiO1xuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSBcIi4uL3JlbmRlcmVyL2NhbnZhc1wiO1xuaW1wb3J0IHsgcmVuZGVyU2NlbmUgfSBmcm9tIFwiLi4vcmVuZGVyZXIvZHJhd1wiO1xuaW1wb3J0IHsgVGhlbWVDb2xvcnMsIGdldFRoZW1lQ29sb3JzIH0gZnJvbSBcIi4uL3JlbmRlcmVyL3RoZW1lXCI7XG5pbXBvcnQgKiBhcyBnZW8gZnJvbSBcIi4uL2VuZ2luZS9nZW9cIjtcblxuY29uc3QgSElUX1JBRElVU19QWCA9IDEwO1xuY29uc3QgWk9PTV9GQUNUT1IgPSAxLjE7XG5jb25zdCBNSU5fU0NBTEUgPSA1O1xuY29uc3QgTUFYX1NDQUxFID0gNTAwO1xuY29uc3QgU05BUF9SQURJVVNfUFggPSAxNDtcbmNvbnN0IFNOQVBfUklOR19SQURJVVMgPSA4O1xuY29uc3QgTElORV9ISVRfUFggPSA4O1xuY29uc3QgTUFYX1VORE8gPSAxMDA7XG5cbmV4cG9ydCB0eXBlIFRvb2xUeXBlID1cbiAgfCBcInBvaW50ZXJcIiB8IFwicG9pbnRcIiB8IFwibGluZVwiIHwgXCJzZWdtZW50XCIgfCBcImNpcmNsZVwiXG4gIHwgXCJtaWRwb2ludFwiIHwgXCJwZXJwX2Jpc2VjdG9yXCIgfCBcInBlcnBlbmRpY3VsYXJcIiB8IFwicGFyYWxsZWxcIlxuICB8IFwiYW5nbGVfYmlzZWN0b3JcIiB8IFwiY29tcGFzc1wiO1xuXG50eXBlIERyYWdNb2RlID1cbiAgfCB7IGtpbmQ6IFwicG9pbnRcIjsgaWQ6IHN0cmluZyB9XG4gIHwgeyBraW5kOiBcInBhblwiOyBsYXN0UHg6IFZlYzIgfVxuICB8IG51bGw7XG5cbmludGVyZmFjZSBTbmFwVGFyZ2V0IHtcbiAgcG9zOiBWZWMyO1xuICBwb2ludElkOiBzdHJpbmcgfCBudWxsO1xufVxuXG5pbnRlcmZhY2UgU2NlbmVTbmFwc2hvdCB7XG4gIHBvaW50czogUmVjb3JkPHN0cmluZywgVmVjMj47XG4gIGNvbnN0cnVjdGlvbnM6IENvbnN0cnVjdGlvblN0ZXBbXTtcbn1cblxuLyoqIEZsZXhpYmxlIHBlbmRpbmcgc3RhdGUgZm9yIG11bHRpLWNsaWNrIHRvb2xzICovXG5pbnRlcmZhY2UgUGVuZGluZ1N0YXRlIHtcbiAgcG9pbnRJZHM6IHN0cmluZ1tdOyAgICAgIC8vIGFjY3VtdWxhdGVkIHBvaW50IGNsaWNrc1xuICBsaW5lSWQ6IHN0cmluZyB8IG51bGw7ICAgLy8gYWNjdW11bGF0ZWQgbGluZSBjbGljayAoZm9yIHBlcnAvcGFyYWxsZWwpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cEludGVyYWN0aW9uKFxuICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgc2NlbmU6IEdlb21ldHJ5U2NlbmUsXG4gIHRyYW5zZm9ybTogVHJhbnNmb3JtLFxuICBpbml0aWFsVGhlbWU6IFRoZW1lQ29sb3JzLFxuICBvblRvb2xDaGFuZ2U/OiAodG9vbDogVG9vbFR5cGUpID0+IHZvaWQsXG4gIG9uU2NlbmVDaGFuZ2U/OiAoKSA9PiB2b2lkXG4pOiB7IHNldFRvb2w6ICh0OiBUb29sVHlwZSkgPT4gdm9pZCB9IHtcbiAgY29uc3QgcG9pbnRPdmVycmlkZXMgPSBuZXcgTWFwPHN0cmluZywgVmVjMj4oKTtcbiAgbGV0IGRyYWc6IERyYWdNb2RlID0gbnVsbDtcbiAgbGV0IGFjdGl2ZVRvb2w6IFRvb2xUeXBlID0gXCJwb2ludGVyXCI7XG4gIGxldCBwZW5kaW5nOiBQZW5kaW5nU3RhdGUgPSB7IHBvaW50SWRzOiBbXSwgbGluZUlkOiBudWxsIH07XG4gIGxldCBjb3VudGVycyA9IHJlY2FsY0NvdW50ZXJzKHNjZW5lKTtcbiAgbGV0IHJlc29sdmVkOiBSZXNvbHZlZFNjZW5lID0gc29sdmUoc2NlbmUsIHBvaW50T3ZlcnJpZGVzKTtcbiAgbGV0IHRoZW1lID0gaW5pdGlhbFRoZW1lO1xuXG4gIGxldCBnaG9zdFBvczogVmVjMiB8IG51bGwgPSBudWxsO1xuICBsZXQgY3VycmVudFNuYXA6IFNuYXBUYXJnZXQgfCBudWxsID0gbnVsbDtcbiAgbGV0IGhpZ2hsaWdodExpbmVJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7IC8vIGxpbmUgaGlnaGxpZ2h0ZWQgZm9yIHBlcnAvcGFyYWxsZWxcblxuICAvLyBcdTI1MDBcdTI1MDAgVW5kbyAvIFJlZG8gc3RhY2sgXHUyNTAwXHUyNTAwXG4gIGNvbnN0IHVuZG9TdGFjazogU2NlbmVTbmFwc2hvdFtdID0gW107XG4gIGNvbnN0IHJlZG9TdGFjazogU2NlbmVTbmFwc2hvdFtdID0gW107XG5cbiAgZnVuY3Rpb24gdGFrZVNuYXBzaG90KCk6IFNjZW5lU25hcHNob3Qge1xuICAgIHJldHVybiB7XG4gICAgICBwb2ludHM6IHsgLi4uc2NlbmUucG9pbnRzIH0sXG4gICAgICBjb25zdHJ1Y3Rpb25zOiBzY2VuZS5jb25zdHJ1Y3Rpb25zLm1hcCgoYykgPT4gKHsgLi4uYyB9KSksXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2hVbmRvKCk6IHZvaWQge1xuICAgIHVuZG9TdGFjay5wdXNoKHRha2VTbmFwc2hvdCgpKTtcbiAgICBpZiAodW5kb1N0YWNrLmxlbmd0aCA+IE1BWF9VTkRPKSB1bmRvU3RhY2suc2hpZnQoKTtcbiAgICByZWRvU3RhY2subGVuZ3RoID0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3RvcmVTbmFwc2hvdChzbmFwOiBTY2VuZVNuYXBzaG90KTogdm9pZCB7XG4gICAgc2NlbmUucG9pbnRzID0geyAuLi5zbmFwLnBvaW50cyB9O1xuICAgIHNjZW5lLmNvbnN0cnVjdGlvbnMgPSBzbmFwLmNvbnN0cnVjdGlvbnMubWFwKChjKSA9PiAoeyAuLi5jIH0pKTtcbiAgICBjb3VudGVycyA9IHJlY2FsY0NvdW50ZXJzKHNjZW5lKTtcbiAgICBwb2ludE92ZXJyaWRlcy5jbGVhcigpO1xuICAgIHJlc2V0UGVuZGluZygpO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5kbygpOiB2b2lkIHtcbiAgICBpZiAodW5kb1N0YWNrLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIHJlZG9TdGFjay5wdXNoKHRha2VTbmFwc2hvdCgpKTtcbiAgICByZXN0b3JlU25hcHNob3QodW5kb1N0YWNrLnBvcCgpISk7XG4gICAgcmVyZW5kZXIoKTtcbiAgICBub3RpZnlDaGFuZ2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZG8oKTogdm9pZCB7XG4gICAgaWYgKHJlZG9TdGFjay5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICB1bmRvU3RhY2sucHVzaCh0YWtlU25hcHNob3QoKSk7XG4gICAgcmVzdG9yZVNuYXBzaG90KHJlZG9TdGFjay5wb3AoKSEpO1xuICAgIHJlcmVuZGVyKCk7XG4gICAgbm90aWZ5Q2hhbmdlKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFBlbmRpbmcoKTogdm9pZCB7XG4gICAgcGVuZGluZyA9IHsgcG9pbnRJZHM6IFtdLCBsaW5lSWQ6IG51bGwgfTtcbiAgICBnaG9zdFBvcyA9IG51bGw7XG4gICAgY3VycmVudFNuYXAgPSBudWxsO1xuICAgIGhpZ2hsaWdodExpbmVJZCA9IG51bGw7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgUmVuZGVyaW5nIFx1MjUwMFx1MjUwMFxuXG4gIGZ1bmN0aW9uIHJlZnJlc2hUaGVtZSgpOiB2b2lkIHtcbiAgICB0aGVtZSA9IGdldFRoZW1lQ29sb3JzKCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXJlbmRlcigpOiB2b2lkIHtcbiAgICByZXNvbHZlZCA9IHNvbHZlKHNjZW5lLCBwb2ludE92ZXJyaWRlcyk7XG4gICAgcmVuZGVyU2NlbmUoY3R4LCByZXNvbHZlZCwgdHJhbnNmb3JtLCB0aGVtZSk7XG5cbiAgICAvLyBEcmF3IGhpZ2hsaWdodGVkIGxpbmVcbiAgICBpZiAoaGlnaGxpZ2h0TGluZUlkKSB7XG4gICAgICBkcmF3TGluZUhpZ2hsaWdodChjdHgsIHRyYW5zZm9ybSwgcmVzb2x2ZWQsIGhpZ2hsaWdodExpbmVJZCk7XG4gICAgfVxuXG4gICAgLy8gRHJhdyBzbmFwIHJpbmdcbiAgICBpZiAoY3VycmVudFNuYXAgJiYgYWN0aXZlVG9vbCAhPT0gXCJwb2ludGVyXCIpIHtcbiAgICAgIGRyYXdTbmFwUmluZyhjdHgsIHRyYW5zZm9ybSwgY3VycmVudFNuYXAucG9zKTtcbiAgICB9XG5cbiAgICAvLyBEcmF3IGdob3N0IHByZXZpZXdcbiAgICBkcmF3R2hvc3RGb3JUb29sKGN0eCwgdHJhbnNmb3JtLCByZXNvbHZlZCwgYWN0aXZlVG9vbCwgcGVuZGluZywgZ2hvc3RQb3MsIGN1cnJlbnRTbmFwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFRvb2wodDogVG9vbFR5cGUpOiB2b2lkIHtcbiAgICBhY3RpdmVUb29sID0gdDtcbiAgICByZXNldFBlbmRpbmcoKTtcbiAgICByZWZyZXNoVGhlbWUoKTtcbiAgICByZXJlbmRlcigpO1xuICAgIG9uVG9vbENoYW5nZT8uKHQpO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFNuYXA6IHBvaW50cyArIGltcGxpY2l0IGludGVyc2VjdGlvbnMgXHUyNTAwXHUyNTAwXG5cbiAgZnVuY3Rpb24gZmluZFNuYXBUYXJnZXQocHhQb3M6IFZlYzIpOiBTbmFwVGFyZ2V0IHwgbnVsbCB7XG4gICAgY29uc3QgbWF0aFBvcyA9IHRyYW5zZm9ybS50b01hdGgocHhQb3MpO1xuICAgIGNvbnN0IHNuYXBSYWRpdXMgPSBTTkFQX1JBRElVU19QWCAvIHRyYW5zZm9ybS5zY2FsZTtcbiAgICBsZXQgYmVzdDogU25hcFRhcmdldCB8IG51bGwgPSBudWxsO1xuICAgIGxldCBiZXN0RGlzdCA9IEluZmluaXR5O1xuXG4gICAgZm9yIChjb25zdCBbLCBvYmpdIG9mIHJlc29sdmVkLm9iamVjdHMpIHtcbiAgICAgIGlmIChvYmoudHlwZSAhPT0gXCJwb2ludFwiKSBjb250aW51ZTtcbiAgICAgIGNvbnN0IGQgPSBnZW8uZGlzdChtYXRoUG9zLCBvYmoucG9zKTtcbiAgICAgIGlmIChkIDwgc25hcFJhZGl1cyAmJiBkIDwgYmVzdERpc3QpIHtcbiAgICAgICAgYmVzdCA9IHsgcG9zOiBvYmoucG9zLCBwb2ludElkOiBvYmouaWQgfTtcbiAgICAgICAgYmVzdERpc3QgPSBkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiZXN0ICYmIGJlc3REaXN0IDwgc25hcFJhZGl1cyAqIDAuNikgcmV0dXJuIGJlc3Q7XG5cbiAgICBjb25zdCBpbnRlcnNlY3Rpb25zID0gY29tcHV0ZUFsbEludGVyc2VjdGlvbnMocmVzb2x2ZWQpO1xuICAgIGZvciAoY29uc3QgcG9zIG9mIGludGVyc2VjdGlvbnMpIHtcbiAgICAgIGNvbnN0IGQgPSBnZW8uZGlzdChtYXRoUG9zLCBwb3MpO1xuICAgICAgaWYgKGQgPCBzbmFwUmFkaXVzICYmIGQgPCBiZXN0RGlzdCkge1xuICAgICAgICBiZXN0ID0geyBwb3MsIHBvaW50SWQ6IG51bGwgfTtcbiAgICAgICAgYmVzdERpc3QgPSBkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBiZXN0O1xuICB9XG5cbiAgLyoqIEhpdC10ZXN0IGZvciBsaW5lLWxpa2Ugb2JqZWN0cyAobGluZSwgc2VnbWVudCwgcmF5KS4gUmV0dXJucyBvYmplY3QgaWQuICovXG4gIGZ1bmN0aW9uIGhpdFRlc3RMaW5lKHB4UG9zOiBWZWMyKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgY29uc3QgbWF0aFBvcyA9IHRyYW5zZm9ybS50b01hdGgocHhQb3MpO1xuICAgIGNvbnN0IGhpdFJhZGl1cyA9IExJTkVfSElUX1BYIC8gdHJhbnNmb3JtLnNjYWxlO1xuICAgIGxldCBjbG9zZXN0OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgY2xvc2VzdERpc3QgPSBJbmZpbml0eTtcblxuICAgIGZvciAoY29uc3QgWywgb2JqXSBvZiByZXNvbHZlZC5vYmplY3RzKSB7XG4gICAgICBjb25zdCBkID0gZGlzdFRvT2JqZWN0KG1hdGhQb3MsIG9iaik7XG4gICAgICBpZiAoZCAhPT0gbnVsbCAmJiBkIDwgaGl0UmFkaXVzICYmIGQgPCBjbG9zZXN0RGlzdCkge1xuICAgICAgICBjbG9zZXN0ID0gb2JqLmlkO1xuICAgICAgICBjbG9zZXN0RGlzdCA9IGQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjbG9zZXN0O1xuICB9XG5cbiAgZnVuY3Rpb24gaGl0VGVzdERyYWdnYWJsZShweDogVmVjMik6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IG1hdGhQb3MgPSB0cmFuc2Zvcm0udG9NYXRoKHB4KTtcbiAgICBjb25zdCBoaXRSYWRpdXMgPSBISVRfUkFESVVTX1BYIC8gdHJhbnNmb3JtLnNjYWxlO1xuICAgIGxldCBjbG9zZXN0OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgY2xvc2VzdERpc3QgPSBJbmZpbml0eTtcblxuICAgIGZvciAoY29uc3QgWywgb2JqXSBvZiByZXNvbHZlZC5vYmplY3RzKSB7XG4gICAgICBpZiAob2JqLnR5cGUgIT09IFwicG9pbnRcIiB8fCAhb2JqLmRyYWdnYWJsZSkgY29udGludWU7XG4gICAgICBjb25zdCBkID0gZ2VvLmRpc3QobWF0aFBvcywgb2JqLnBvcyk7XG4gICAgICBpZiAoZCA8IGhpdFJhZGl1cyAmJiBkIDwgY2xvc2VzdERpc3QpIHtcbiAgICAgICAgY2xvc2VzdCA9IG9iai5pZDtcbiAgICAgICAgY2xvc2VzdERpc3QgPSBkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2xvc2VzdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEV2ZW50UG9zKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50IHwgV2hlZWxFdmVudCk6IFZlYzIge1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgaWYgKFwidG91Y2hlc1wiIGluIGUpIHtcbiAgICAgIGNvbnN0IHRvdWNoID0gKGUgYXMgVG91Y2hFdmVudCkudG91Y2hlc1swXSA/PyAoZSBhcyBUb3VjaEV2ZW50KS5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgICAgIHJldHVybiBbdG91Y2guY2xpZW50WCAtIHJlY3QubGVmdCwgdG91Y2guY2xpZW50WSAtIHJlY3QudG9wXTtcbiAgICB9XG4gICAgcmV0dXJuIFsoZSBhcyBNb3VzZUV2ZW50KS5jbGllbnRYIC0gcmVjdC5sZWZ0LCAoZSBhcyBNb3VzZUV2ZW50KS5jbGllbnRZIC0gcmVjdC50b3BdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0T3JDcmVhdGVQb2ludChweFBvczogVmVjMik6IHN0cmluZyB7XG4gICAgY29uc3Qgc25hcCA9IGZpbmRTbmFwVGFyZ2V0KHB4UG9zKTtcbiAgICBpZiAoc25hcCkge1xuICAgICAgaWYgKHNuYXAucG9pbnRJZCkgcmV0dXJuIHNuYXAucG9pbnRJZDtcbiAgICAgIGNvbnN0IGlkID0gYFAke2NvdW50ZXJzLnBvaW50Kyt9YDtcbiAgICAgIHNjZW5lLnBvaW50c1tpZF0gPSBzbmFwLnBvcztcbiAgICAgIHJldHVybiBpZDtcbiAgICB9XG4gICAgY29uc3QgbWF0aFBvcyA9IHRyYW5zZm9ybS50b01hdGgocHhQb3MpO1xuICAgIGNvbnN0IGlkID0gYFAke2NvdW50ZXJzLnBvaW50Kyt9YDtcbiAgICBzY2VuZS5wb2ludHNbaWRdID0gbWF0aFBvcztcbiAgICByZXR1cm4gaWQ7XG4gIH1cblxuICBmdW5jdGlvbiBub3RpZnlDaGFuZ2UoKTogdm9pZCB7XG4gICAgb25TY2VuZUNoYW5nZT8uKCk7XG4gIH1cblxuICAvKiogQ2hlY2sgaWYgdG9vbCBleHBlY3RzIGEgbGluZSBjbGljayBhcyBpdHMgbmV4dCBpbnB1dCAqL1xuICBmdW5jdGlvbiB0b29sTmVlZHNMaW5lTmV4dCgpOiBib29sZWFuIHtcbiAgICBpZiAoYWN0aXZlVG9vbCA9PT0gXCJwZXJwZW5kaWN1bGFyXCIgfHwgYWN0aXZlVG9vbCA9PT0gXCJwYXJhbGxlbFwiKSB7XG4gICAgICByZXR1cm4gcGVuZGluZy5saW5lSWQgPT09IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBIb3cgbWFueSBwb2ludCBjbGlja3MgZG9lcyB0aGlzIHRvb2wgbmVlZCB0b3RhbD8gKi9cbiAgZnVuY3Rpb24gdG9vbFBvaW50Q291bnQoKTogbnVtYmVyIHtcbiAgICBzd2l0Y2ggKGFjdGl2ZVRvb2wpIHtcbiAgICAgIGNhc2UgXCJwb2ludFwiOiByZXR1cm4gMTtcbiAgICAgIGNhc2UgXCJsaW5lXCI6IGNhc2UgXCJzZWdtZW50XCI6IGNhc2UgXCJjaXJjbGVcIjogY2FzZSBcIm1pZHBvaW50XCI6IGNhc2UgXCJwZXJwX2Jpc2VjdG9yXCI6IHJldHVybiAyO1xuICAgICAgY2FzZSBcInBlcnBlbmRpY3VsYXJcIjogY2FzZSBcInBhcmFsbGVsXCI6IHJldHVybiAxOyAvLyAxIHBvaW50IChhZnRlciBsaW5lIGNsaWNrKVxuICAgICAgY2FzZSBcImFuZ2xlX2Jpc2VjdG9yXCI6IHJldHVybiAzO1xuICAgICAgY2FzZSBcImNvbXBhc3NcIjogcmV0dXJuIDM7XG4gICAgICBkZWZhdWx0OiByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgR2VuZXJpYyB0b29sIGNsaWNrIGRpc3BhdGNoIFx1MjUwMFx1MjUwMFxuXG4gIGZ1bmN0aW9uIGhhbmRsZVRvb2xDbGljayhweFBvczogVmVjMik6IHZvaWQge1xuICAgIC8vIFRvb2xzIHRoYXQgbmVlZCBhIGxpbmUgZmlyc3RcbiAgICBpZiAodG9vbE5lZWRzTGluZU5leHQoKSkge1xuICAgICAgY29uc3QgbGluZUlkID0gaGl0VGVzdExpbmUocHhQb3MpO1xuICAgICAgaWYgKCFsaW5lSWQpIHJldHVybjsgLy8gbXVzdCBjbGljayBhIGxpbmVcbiAgICAgIHB1c2hVbmRvKCk7XG4gICAgICBwZW5kaW5nLmxpbmVJZCA9IGxpbmVJZDtcbiAgICAgIHJlcmVuZGVyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUG9pbnQtY29sbGVjdGluZyB0b29sc1xuICAgIGNvbnN0IG5lZWRlZCA9IHRvb2xQb2ludENvdW50KCk7XG4gICAgY29uc3QgaGF2ZSA9IHBlbmRpbmcucG9pbnRJZHMubGVuZ3RoO1xuXG4gICAgaWYgKGhhdmUgPT09IDApIHB1c2hVbmRvKCk7XG5cbiAgICBjb25zdCBwdElkID0gZ2V0T3JDcmVhdGVQb2ludChweFBvcyk7XG5cbiAgICAvLyBEb24ndCBhbGxvdyBzYW1lIHBvaW50IHR3aWNlIGluIGEgcm93XG4gICAgaWYgKHBlbmRpbmcucG9pbnRJZHMubGVuZ3RoID4gMCAmJiBwZW5kaW5nLnBvaW50SWRzW3BlbmRpbmcucG9pbnRJZHMubGVuZ3RoIC0gMV0gPT09IHB0SWQpIHJldHVybjtcblxuICAgIHBlbmRpbmcucG9pbnRJZHMucHVzaChwdElkKTtcblxuICAgIGlmIChwZW5kaW5nLnBvaW50SWRzLmxlbmd0aCA8IG5lZWRlZCkge1xuICAgICAgLy8gU3RpbGwgY29sbGVjdGluZ1xuICAgICAgcmVyZW5kZXIoKTtcbiAgICAgIG5vdGlmeUNoYW5nZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFsbCBwb2ludHMgY29sbGVjdGVkIFx1MjAxNCBleGVjdXRlIHRoZSBjb25zdHJ1Y3Rpb25cbiAgICBleGVjdXRlQ29uc3RydWN0aW9uKCk7XG4gICAgcmVzZXRQZW5kaW5nKCk7XG4gICAgcmVyZW5kZXIoKTtcbiAgICBub3RpZnlDaGFuZ2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4ZWN1dGVDb25zdHJ1Y3Rpb24oKTogdm9pZCB7XG4gICAgY29uc3QgcHRzID0gcGVuZGluZy5wb2ludElkcztcblxuICAgIHN3aXRjaCAoYWN0aXZlVG9vbCkge1xuICAgICAgY2FzZSBcInBvaW50XCI6XG4gICAgICAgIC8vIFBvaW50IHdhcyBhbHJlYWR5IGNyZWF0ZWQgYnkgZ2V0T3JDcmVhdGVQb2ludFxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcImxpbmVcIjpcbiAgICAgICAgc2NlbmUuY29uc3RydWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBcImxpbmVcIixcbiAgICAgICAgICB0aHJvdWdoOiBbcHRzWzBdLCBwdHNbMV1dLFxuICAgICAgICAgIGlkOiBgTCR7Y291bnRlcnMubGluZSsrfWAsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcInNlZ21lbnRcIjpcbiAgICAgICAgc2NlbmUuY29uc3RydWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBcInNlZ21lbnRcIixcbiAgICAgICAgICBmcm9tOiBwdHNbMF0sXG4gICAgICAgICAgdG86IHB0c1sxXSxcbiAgICAgICAgICBpZDogYFMke2NvdW50ZXJzLnNlZ21lbnQrK31gLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJjaXJjbGVcIjpcbiAgICAgICAgc2NlbmUuY29uc3RydWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBcImNpcmNsZVwiLFxuICAgICAgICAgIGNlbnRlcjogcHRzWzBdLFxuICAgICAgICAgIHRocm91Z2g6IHB0c1sxXSxcbiAgICAgICAgICBpZDogYEMke2NvdW50ZXJzLmNpcmNsZSsrfWAsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIm1pZHBvaW50XCI6XG4gICAgICAgIHNjZW5lLmNvbnN0cnVjdGlvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogXCJtaWRwb2ludFwiLFxuICAgICAgICAgIG9mOiBbcHRzWzBdLCBwdHNbMV1dLFxuICAgICAgICAgIGlkOiBgTSR7Y291bnRlcnMubWlkcG9pbnQrK31gLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJwZXJwX2Jpc2VjdG9yXCI6IHtcbiAgICAgICAgLy8gQ3JlYXRlIG1pZHBvaW50ICsgcGVycGVuZGljdWxhciBiaXNlY3RvciBsaW5lXG4gICAgICAgIGNvbnN0IG1pZElkID0gYE0ke2NvdW50ZXJzLm1pZHBvaW50Kyt9YDtcbiAgICAgICAgY29uc3QgbGluZUlkID0gYFBCJHtjb3VudGVycy5wZXJwQmlzZWN0b3IrK31gO1xuICAgICAgICBzY2VuZS5jb25zdHJ1Y3Rpb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IFwibWlkcG9pbnRcIixcbiAgICAgICAgICBvZjogW3B0c1swXSwgcHRzWzFdXSxcbiAgICAgICAgICBpZDogbWlkSWQsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBUaGUgcGVycCBiaXNlY3RvciBpcyBhIGxpbmUgcGVycGVuZGljdWxhciB0byB0aGUgc2VnbWVudCB0aHJvdWdoIHRoZSBtaWRwb2ludFxuICAgICAgICAvLyBXZSBuZWVkIGEgdGVtcCBzZWdtZW50IHRvIHJlZmVyZW5jZS4gQ3JlYXRlIGEgaGlkZGVuIGxpbmUsIHRoZW4gcGVycGVuZGljdWxhciB0byBpdC5cbiAgICAgICAgLy8gU2ltcGxlcjogYWRkIHRoZSBzZWdtZW50LCB0aGVuIHBlcnBlbmRpY3VsYXIgdGhyb3VnaCBtaWRwb2ludFxuICAgICAgICBjb25zdCB0ZW1wTGluZUlkID0gYF9wYl9yZWZfJHtsaW5lSWR9YDtcbiAgICAgICAgc2NlbmUuY29uc3RydWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBcImxpbmVcIixcbiAgICAgICAgICB0aHJvdWdoOiBbcHRzWzBdLCBwdHNbMV1dLFxuICAgICAgICAgIGlkOiB0ZW1wTGluZUlkLFxuICAgICAgICB9KTtcbiAgICAgICAgc2NlbmUuY29uc3RydWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBcInBlcnBlbmRpY3VsYXJcIixcbiAgICAgICAgICB0bzogdGVtcExpbmVJZCxcbiAgICAgICAgICB0aHJvdWdoOiBtaWRJZCxcbiAgICAgICAgICBpZDogbGluZUlkLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gSGlkZSB0aGUgcmVmZXJlbmNlIGxpbmVcbiAgICAgICAgc2NlbmUuc3R5bGVbdGVtcExpbmVJZF0gPSB7IGNvbG9yOiBcInRyYW5zcGFyZW50XCIsIHdpZHRoOiAwIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwicGVycGVuZGljdWxhclwiOlxuICAgICAgICBzY2VuZS5jb25zdHJ1Y3Rpb25zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IFwicGVycGVuZGljdWxhclwiLFxuICAgICAgICAgIHRvOiBwZW5kaW5nLmxpbmVJZCEsXG4gICAgICAgICAgdGhyb3VnaDogcHRzWzBdLFxuICAgICAgICAgIGlkOiBgUGVycCR7Y291bnRlcnMucGVycGVuZGljdWxhcisrfWAsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcInBhcmFsbGVsXCI6XG4gICAgICAgIHNjZW5lLmNvbnN0cnVjdGlvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogXCJwYXJhbGxlbFwiLFxuICAgICAgICAgIHRvOiBwZW5kaW5nLmxpbmVJZCEsXG4gICAgICAgICAgdGhyb3VnaDogcHRzWzBdLFxuICAgICAgICAgIGlkOiBgUGFyJHtjb3VudGVycy5wYXJhbGxlbCsrfWAsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcImFuZ2xlX2Jpc2VjdG9yXCI6XG4gICAgICAgIHNjZW5lLmNvbnN0cnVjdGlvbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogXCJhbmdsZV9iaXNlY3RvclwiLFxuICAgICAgICAgIHBvaW50czogW3B0c1swXSwgcHRzWzFdLCBwdHNbMl1dLFxuICAgICAgICAgIGlkOiBgQUIke2NvdW50ZXJzLmFuZ2xlQmlzZWN0b3IrK31gLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJjb21wYXNzXCI6IHtcbiAgICAgICAgLy8gcHRzWzBdLCBwdHNbMV0gZGVmaW5lIHRoZSByYWRpdXM7IHB0c1syXSBpcyB0aGUgY2VudGVyXG4gICAgICAgIGNvbnN0IHJhZGl1c0V4cHIgPSBgZGlzdGFuY2UoJHtwdHNbMF19LCAke3B0c1sxXX0pYDtcbiAgICAgICAgc2NlbmUuY29uc3RydWN0aW9ucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBcImNpcmNsZVwiLFxuICAgICAgICAgIGNlbnRlcjogcHRzWzJdLFxuICAgICAgICAgIHJhZGl1czogcmFkaXVzRXhwcixcbiAgICAgICAgICBpZDogYEMke2NvdW50ZXJzLmNpcmNsZSsrfWAsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgRXZlbnQgaGFuZGxlcnMgXHUyNTAwXHUyNTAwXG5cbiAgZnVuY3Rpb24gb25Eb3duKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgcG9zID0gZ2V0RXZlbnRQb3MoZSk7XG5cbiAgICBpZiAoYWN0aXZlVG9vbCA9PT0gXCJwb2ludGVyXCIpIHtcbiAgICAgIGNvbnN0IHBvaW50SWQgPSBoaXRUZXN0RHJhZ2dhYmxlKHBvcyk7XG4gICAgICBpZiAocG9pbnRJZCkge1xuICAgICAgICBwdXNoVW5kbygpO1xuICAgICAgICBkcmFnID0geyBraW5kOiBcInBvaW50XCIsIGlkOiBwb2ludElkIH07XG4gICAgICAgIGNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImdyYWJiaW5nXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcmFnID0geyBraW5kOiBcInBhblwiLCBsYXN0UHg6IHBvcyB9O1xuICAgICAgICBjYW52YXMuc3R5bGUuY3Vyc29yID0gXCJtb3ZlXCI7XG4gICAgICB9XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaGFuZGxlVG9vbENsaWNrKHBvcyk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25Nb3ZlKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgcG9zID0gZ2V0RXZlbnRQb3MoZSk7XG5cbiAgICBpZiAoYWN0aXZlVG9vbCA9PT0gXCJwb2ludGVyXCIpIHtcbiAgICAgIGlmICghZHJhZykge1xuICAgICAgICBjb25zdCBob3ZlcklkID0gaGl0VGVzdERyYWdnYWJsZShwb3MpO1xuICAgICAgICBjYW52YXMuc3R5bGUuY3Vyc29yID0gaG92ZXJJZCA/IFwiZ3JhYlwiIDogXCJkZWZhdWx0XCI7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRyYWcua2luZCA9PT0gXCJwb2ludFwiKSB7XG4gICAgICAgIGNvbnN0IG1hdGhQb3MgPSB0cmFuc2Zvcm0udG9NYXRoKHBvcyk7XG4gICAgICAgIHBvaW50T3ZlcnJpZGVzLnNldChkcmFnLmlkLCBtYXRoUG9zKTtcbiAgICAgICAgcmVyZW5kZXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGR4ID0gKHBvc1swXSAtIGRyYWcubGFzdFB4WzBdKSAvIHRyYW5zZm9ybS5zY2FsZTtcbiAgICAgICAgY29uc3QgZHkgPSAocG9zWzFdIC0gZHJhZy5sYXN0UHhbMV0pIC8gdHJhbnNmb3JtLnNjYWxlO1xuICAgICAgICB0cmFuc2Zvcm0ucGFuWCAtPSBkeDtcbiAgICAgICAgdHJhbnNmb3JtLnBhblkgKz0gZHk7XG4gICAgICAgIGRyYWcubGFzdFB4ID0gcG9zO1xuICAgICAgICByZXJlbmRlcigpO1xuICAgICAgfVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImNyb3NzaGFpclwiO1xuXG4gICAgLy8gVXBkYXRlIGhpZ2hsaWdodHMgYmFzZWQgb24gd2hhdCB0b29sIGV4cGVjdHMgbmV4dFxuICAgIGlmICh0b29sTmVlZHNMaW5lTmV4dCgpKSB7XG4gICAgICBoaWdobGlnaHRMaW5lSWQgPSBoaXRUZXN0TGluZShwb3MpO1xuICAgICAgY3VycmVudFNuYXAgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBoaWdobGlnaHRMaW5lSWQgPSBudWxsO1xuICAgICAgY3VycmVudFNuYXAgPSBmaW5kU25hcFRhcmdldChwb3MpO1xuICAgIH1cblxuICAgIGdob3N0UG9zID0gdHJhbnNmb3JtLnRvTWF0aChwb3MpO1xuICAgIHJlcmVuZGVyKCk7XG4gIH1cblxuICBmdW5jdGlvbiBvblVwKCk6IHZvaWQge1xuICAgIGlmIChkcmFnKSB7XG4gICAgICBpZiAoZHJhZy5raW5kID09PSBcInBvaW50XCIpIHtcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGUgPSBwb2ludE92ZXJyaWRlcy5nZXQoZHJhZy5pZCk7XG4gICAgICAgIGlmIChvdmVycmlkZSkge1xuICAgICAgICAgIHNjZW5lLnBvaW50c1tkcmFnLmlkXSA9IG92ZXJyaWRlO1xuICAgICAgICAgIHBvaW50T3ZlcnJpZGVzLmRlbGV0ZShkcmFnLmlkKTtcbiAgICAgICAgICBub3RpZnlDaGFuZ2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1bmRvU3RhY2sucG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNhbnZhcy5zdHlsZS5jdXJzb3IgPSBkcmFnLmtpbmQgPT09IFwicG9pbnRcIiA/IFwiZ3JhYlwiIDogXCJkZWZhdWx0XCI7XG4gICAgICBkcmFnID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbldoZWVsKGU6IFdoZWVsRXZlbnQpOiB2b2lkIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gZS5kZWx0YVkgPCAwID8gMSA6IC0xO1xuICAgIGNvbnN0IGZhY3RvciA9IGRpcmVjdGlvbiA+IDAgPyBaT09NX0ZBQ1RPUiA6IDEgLyBaT09NX0ZBQ1RPUjtcbiAgICBjb25zdCBuZXdTY2FsZSA9IE1hdGgubWluKE1BWF9TQ0FMRSwgTWF0aC5tYXgoTUlOX1NDQUxFLCB0cmFuc2Zvcm0uc2NhbGUgKiBmYWN0b3IpKTtcblxuICAgIGNvbnN0IHBvcyA9IGdldEV2ZW50UG9zKGUpO1xuICAgIGNvbnN0IG1hdGhCZWZvcmUgPSB0cmFuc2Zvcm0udG9NYXRoKHBvcyk7XG4gICAgdHJhbnNmb3JtLnNjYWxlID0gbmV3U2NhbGU7XG4gICAgY29uc3QgbWF0aEFmdGVyID0gdHJhbnNmb3JtLnRvTWF0aChwb3MpO1xuXG4gICAgdHJhbnNmb3JtLnBhblggLT0gbWF0aEFmdGVyWzBdIC0gbWF0aEJlZm9yZVswXTtcbiAgICB0cmFuc2Zvcm0ucGFuWSAtPSBtYXRoQWZ0ZXJbMV0gLSBtYXRoQmVmb3JlWzFdO1xuXG4gICAgcmVyZW5kZXIoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uS2V5RG93bihlOiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGUua2V5ID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICBpZiAocGVuZGluZy5wb2ludElkcy5sZW5ndGggPiAwIHx8IHBlbmRpbmcubGluZUlkKSB7XG4gICAgICAgIC8vIENhbmNlbCBwYXJ0aWFsIGNvbnN0cnVjdGlvbiBcdTIwMTQgdW5kbyB0aGUgc25hcHNob3Qgd2UgcHVzaGVkXG4gICAgICAgIGlmICh1bmRvU3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJlc3RvcmVTbmFwc2hvdCh1bmRvU3RhY2sucG9wKCkhKTtcbiAgICAgICAgfVxuICAgICAgICByZXNldFBlbmRpbmcoKTtcbiAgICAgICAgcmVyZW5kZXIoKTtcbiAgICAgICAgbm90aWZ5Q2hhbmdlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUb29sKFwicG9pbnRlclwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoKGUuY3RybEtleSB8fCBlLm1ldGFLZXkpICYmICFlLnNoaWZ0S2V5ICYmIGUua2V5ID09PSBcInpcIikge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHVuZG8oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoKChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5KSAmJiBlLnNoaWZ0S2V5ICYmIGUua2V5ID09PSBcInpcIikgfHxcbiAgICAgICAgKChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5KSAmJiBlLmtleSA9PT0gXCJ5XCIpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgcmVkbygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG9uRG93bik7XG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW92ZSk7XG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvblVwKTtcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHtcbiAgICBvblVwKCk7XG4gICAgY3VycmVudFNuYXAgPSBudWxsO1xuICAgIGdob3N0UG9zID0gbnVsbDtcbiAgICBoaWdobGlnaHRMaW5lSWQgPSBudWxsO1xuICAgIGlmIChhY3RpdmVUb29sICE9PSBcInBvaW50ZXJcIikgcmVyZW5kZXIoKTtcbiAgfSk7XG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgb25XaGVlbCwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIG9uRG93biwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgb25Nb3ZlLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIG9uVXApO1xuXG4gIGNhbnZhcy50YWJJbmRleCA9IDA7XG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbktleURvd24pO1xuXG4gIHJldHVybiB7IHNldFRvb2wgfTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIERpc3RhbmNlIGZyb20gYSBwb2ludCB0byBhIHJlc29sdmVkIG9iamVjdCAoZm9yIGxpbmUgaGl0LXRlc3RpbmcpIFx1MjUwMFx1MjUwMFxuXG5mdW5jdGlvbiBkaXN0VG9PYmplY3QocDogVmVjMiwgb2JqOiBSZXNvbHZlZE9iamVjdCk6IG51bWJlciB8IG51bGwge1xuICBzd2l0Y2ggKG9iai50eXBlKSB7XG4gICAgY2FzZSBcImxpbmVcIjoge1xuICAgICAgY29uc3QgbGluZTogZ2VvLkxpbmUgPSB7IHBvaW50OiBvYmoucG9pbnQsIGRpcjogb2JqLmRpciB9O1xuICAgICAgcmV0dXJuIGRpc3RQb2ludFRvTGluZShwLCBsaW5lKTtcbiAgICB9XG4gICAgY2FzZSBcInNlZ21lbnRcIjoge1xuICAgICAgcmV0dXJuIGRpc3RQb2ludFRvU2VnbWVudChwLCBvYmouZnJvbSwgb2JqLnRvKTtcbiAgICB9XG4gICAgY2FzZSBcInJheVwiOiB7XG4gICAgICByZXR1cm4gZGlzdFBvaW50VG9SYXkocCwgb2JqLm9yaWdpbiwgb2JqLmRpcik7XG4gICAgfVxuICAgIGNhc2UgXCJjaXJjbGVcIjoge1xuICAgICAgLy8gRGlzdGFuY2UgdG8gdGhlIGNpcmNsZSdzIGVkZ2VcbiAgICAgIGNvbnN0IGRDZW50ZXIgPSBnZW8uZGlzdChwLCBvYmouY2VudGVyKTtcbiAgICAgIHJldHVybiBNYXRoLmFicyhkQ2VudGVyIC0gb2JqLnJhZGl1cyk7XG4gICAgfVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBkaXN0UG9pbnRUb0xpbmUocDogVmVjMiwgbGluZTogZ2VvLkxpbmUpOiBudW1iZXIge1xuICBjb25zdCB2ID0gZ2VvLnN1YihwLCBsaW5lLnBvaW50KTtcbiAgY29uc3QgcHJvaiA9IGdlby5kb3QodiwgbGluZS5kaXIpO1xuICBjb25zdCBjbG9zZXN0ID0gZ2VvLmFkZChsaW5lLnBvaW50LCBnZW8uc2NhbGUobGluZS5kaXIsIHByb2opKTtcbiAgcmV0dXJuIGdlby5kaXN0KHAsIGNsb3Nlc3QpO1xufVxuXG5mdW5jdGlvbiBkaXN0UG9pbnRUb1NlZ21lbnQocDogVmVjMiwgYTogVmVjMiwgYjogVmVjMik6IG51bWJlciB7XG4gIGNvbnN0IGxpbmUgPSBnZW8ubGluZUZyb21Ud29Qb2ludHMoYSwgYik7XG4gIGNvbnN0IGxlbiA9IGdlby5kaXN0KGEsIGIpO1xuICBjb25zdCB2ID0gZ2VvLnN1YihwLCBhKTtcbiAgY29uc3QgdCA9IE1hdGgubWF4KDAsIE1hdGgubWluKGxlbiwgZ2VvLmRvdCh2LCBsaW5lLmRpcikpKTtcbiAgY29uc3QgY2xvc2VzdCA9IGdlby5hZGQoYSwgZ2VvLnNjYWxlKGxpbmUuZGlyLCB0KSk7XG4gIHJldHVybiBnZW8uZGlzdChwLCBjbG9zZXN0KTtcbn1cblxuZnVuY3Rpb24gZGlzdFBvaW50VG9SYXkocDogVmVjMiwgb3JpZ2luOiBWZWMyLCBkaXI6IFZlYzIpOiBudW1iZXIge1xuICBjb25zdCBub3JtRGlyID0gZ2VvLm5vcm1hbGl6ZShkaXIpO1xuICBjb25zdCB2ID0gZ2VvLnN1YihwLCBvcmlnaW4pO1xuICBjb25zdCB0ID0gTWF0aC5tYXgoMCwgZ2VvLmRvdCh2LCBub3JtRGlyKSk7XG4gIGNvbnN0IGNsb3Nlc3QgPSBnZW8uYWRkKG9yaWdpbiwgZ2VvLnNjYWxlKG5vcm1EaXIsIHQpKTtcbiAgcmV0dXJuIGdlby5kaXN0KHAsIGNsb3Nlc3QpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ29tcHV0ZSBhbGwgaW1wbGljaXQgaW50ZXJzZWN0aW9ucyBcdTI1MDBcdTI1MDBcblxuZnVuY3Rpb24gY29tcHV0ZUFsbEludGVyc2VjdGlvbnMocmVzb2x2ZWQ6IFJlc29sdmVkU2NlbmUpOiBWZWMyW10ge1xuICBjb25zdCBpbnRlcnNlY3RhYmxlczogUmVzb2x2ZWRPYmplY3RbXSA9IFtdO1xuICBmb3IgKGNvbnN0IFssIG9ial0gb2YgcmVzb2x2ZWQub2JqZWN0cykge1xuICAgIGlmIChvYmoudHlwZSA9PT0gXCJsaW5lXCIgfHwgb2JqLnR5cGUgPT09IFwic2VnbWVudFwiIHx8IG9iai50eXBlID09PSBcInJheVwiIHx8IG9iai50eXBlID09PSBcImNpcmNsZVwiKSB7XG4gICAgICBpbnRlcnNlY3RhYmxlcy5wdXNoKG9iaik7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVzdWx0czogVmVjMltdID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnRlcnNlY3RhYmxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IGludGVyc2VjdGFibGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBwdHMgPSBpbnRlcnNlY3RQYWlyKGludGVyc2VjdGFibGVzW2ldLCBpbnRlcnNlY3RhYmxlc1tqXSk7XG4gICAgICBmb3IgKGNvbnN0IHAgb2YgcHRzKSB7XG4gICAgICAgIGlmICghaXNOYU4ocFswXSkgJiYgIWlzTmFOKHBbMV0pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKHApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIHRvR2VvTGluZShvYmo6IFJlc29sdmVkT2JqZWN0KTogZ2VvLkxpbmUgfCBudWxsIHtcbiAgc3dpdGNoIChvYmoudHlwZSkge1xuICAgIGNhc2UgXCJsaW5lXCI6IHJldHVybiB7IHBvaW50OiBvYmoucG9pbnQsIGRpcjogb2JqLmRpciB9O1xuICAgIGNhc2UgXCJzZWdtZW50XCI6IHJldHVybiBnZW8ubGluZUZyb21Ud29Qb2ludHMob2JqLmZyb20sIG9iai50byk7XG4gICAgY2FzZSBcInJheVwiOiByZXR1cm4geyBwb2ludDogb2JqLm9yaWdpbiwgZGlyOiBvYmouZGlyIH07XG4gICAgZGVmYXVsdDogcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW50ZXJzZWN0UGFpcihhOiBSZXNvbHZlZE9iamVjdCwgYjogUmVzb2x2ZWRPYmplY3QpOiBWZWMyW10ge1xuICBjb25zdCBhTGluZSA9IHRvR2VvTGluZShhKTtcbiAgY29uc3QgYkxpbmUgPSB0b0dlb0xpbmUoYik7XG4gIGNvbnN0IGFDaXJjbGUgPSBhLnR5cGUgPT09IFwiY2lyY2xlXCIgPyBhIDogbnVsbDtcbiAgY29uc3QgYkNpcmNsZSA9IGIudHlwZSA9PT0gXCJjaXJjbGVcIiA/IGIgOiBudWxsO1xuXG4gIGxldCBwdHM6IFZlYzJbXSA9IFtdO1xuXG4gIGlmIChhTGluZSAmJiBiTGluZSkge1xuICAgIGNvbnN0IHAgPSBnZW8ubGluZUxpbmVJbnRlcnNlY3Rpb24oYUxpbmUsIGJMaW5lKTtcbiAgICBpZiAocCkgcHRzID0gW3BdO1xuICB9IGVsc2UgaWYgKGFMaW5lICYmIGJDaXJjbGUpIHtcbiAgICBwdHMgPSBnZW8ubGluZUNpcmNsZUludGVyc2VjdGlvbihhTGluZSwgYkNpcmNsZS5jZW50ZXIsIGJDaXJjbGUucmFkaXVzKTtcbiAgfSBlbHNlIGlmIChhQ2lyY2xlICYmIGJMaW5lKSB7XG4gICAgcHRzID0gZ2VvLmxpbmVDaXJjbGVJbnRlcnNlY3Rpb24oYkxpbmUsIGFDaXJjbGUuY2VudGVyLCBhQ2lyY2xlLnJhZGl1cyk7XG4gIH0gZWxzZSBpZiAoYUNpcmNsZSAmJiBiQ2lyY2xlKSB7XG4gICAgcHRzID0gZ2VvLmNpcmNsZUNpcmNsZUludGVyc2VjdGlvbihhQ2lyY2xlLmNlbnRlciwgYUNpcmNsZS5yYWRpdXMsIGJDaXJjbGUuY2VudGVyLCBiQ2lyY2xlLnJhZGl1cyk7XG4gIH1cblxuICBwdHMgPSBmaWx0ZXJCeUJvdW5kcyhwdHMsIGEpO1xuICBwdHMgPSBmaWx0ZXJCeUJvdW5kcyhwdHMsIGIpO1xuICByZXR1cm4gcHRzO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJCeUJvdW5kcyhwdHM6IFZlYzJbXSwgb2JqOiBSZXNvbHZlZE9iamVjdCk6IFZlYzJbXSB7XG4gIGlmIChvYmoudHlwZSA9PT0gXCJzZWdtZW50XCIpIHJldHVybiBnZW8uZmlsdGVyU2VnbWVudChwdHMsIG9iai5mcm9tLCBvYmoudG8pO1xuICBpZiAob2JqLnR5cGUgPT09IFwicmF5XCIpIHJldHVybiBnZW8uZmlsdGVyUmF5KHB0cywgb2JqLm9yaWdpbiwgb2JqLmRpcik7XG4gIHJldHVybiBwdHM7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBEcmF3aW5nIGhlbHBlcnMgXHUyNTAwXHUyNTAwXG5cbmZ1bmN0aW9uIGRyYXdTbmFwUmluZyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgdHJhbnNmb3JtOiBUcmFuc2Zvcm0sIHBvczogVmVjMik6IHZvaWQge1xuICBjb25zdCBbcHgsIHB5XSA9IHRyYW5zZm9ybS50b1BpeGVsKHBvcyk7XG4gIGN0eC5zYXZlKCk7XG4gIGN0eC5zdHJva2VTdHlsZSA9IFwicmdiYSg3MCwgMTMwLCAyNDAsIDAuOClcIjtcbiAgY3R4LmxpbmVXaWR0aCA9IDI7XG4gIGN0eC5zZXRMaW5lRGFzaChbXSk7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4LmFyYyhweCwgcHksIFNOQVBfUklOR19SQURJVVMsIDAsIE1hdGguUEkgKiAyKTtcbiAgY3R4LnN0cm9rZSgpO1xuICBjdHguZmlsbFN0eWxlID0gXCJyZ2JhKDcwLCAxMzAsIDI0MCwgMC4xMilcIjtcbiAgY3R4LmZpbGwoKTtcbiAgY3R4LnJlc3RvcmUoKTtcbn1cblxuZnVuY3Rpb24gZHJhd0xpbmVIaWdobGlnaHQoXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICB0cmFuc2Zvcm06IFRyYW5zZm9ybSxcbiAgcmVzb2x2ZWQ6IFJlc29sdmVkU2NlbmUsXG4gIGxpbmVJZDogc3RyaW5nXG4pOiB2b2lkIHtcbiAgY29uc3Qgb2JqID0gcmVzb2x2ZWQub2JqZWN0cy5nZXQobGluZUlkKTtcbiAgaWYgKCFvYmopIHJldHVybjtcblxuICBjdHguc2F2ZSgpO1xuICBjdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoNzAsIDEzMCwgMjQwLCAwLjQpXCI7XG4gIGN0eC5saW5lV2lkdGggPSA2O1xuICBjdHguc2V0TGluZURhc2goW10pO1xuXG4gIGlmIChvYmoudHlwZSA9PT0gXCJsaW5lXCIpIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRyYW5zZm9ybS5jb25maWc7XG4gICAgY29uc3QgZGlhZyA9IE1hdGguc3FydCh3aWR0aCAqIHdpZHRoICsgaGVpZ2h0ICogaGVpZ2h0KSAvIHRyYW5zZm9ybS5zY2FsZSAqIDI7XG4gICAgY29uc3QgcDEgPSB0cmFuc2Zvcm0udG9QaXhlbChbb2JqLnBvaW50WzBdICsgb2JqLmRpclswXSAqIC1kaWFnLCBvYmoucG9pbnRbMV0gKyBvYmouZGlyWzFdICogLWRpYWddKTtcbiAgICBjb25zdCBwMiA9IHRyYW5zZm9ybS50b1BpeGVsKFtvYmoucG9pbnRbMF0gKyBvYmouZGlyWzBdICogZGlhZywgb2JqLnBvaW50WzFdICsgb2JqLmRpclsxXSAqIGRpYWddKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyhwMVswXSwgcDFbMV0pO1xuICAgIGN0eC5saW5lVG8ocDJbMF0sIHAyWzFdKTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH0gZWxzZSBpZiAob2JqLnR5cGUgPT09IFwic2VnbWVudFwiKSB7XG4gICAgY29uc3QgcDEgPSB0cmFuc2Zvcm0udG9QaXhlbChvYmouZnJvbSk7XG4gICAgY29uc3QgcDIgPSB0cmFuc2Zvcm0udG9QaXhlbChvYmoudG8pO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKHAxWzBdLCBwMVsxXSk7XG4gICAgY3R4LmxpbmVUbyhwMlswXSwgcDJbMV0pO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgfSBlbHNlIGlmIChvYmoudHlwZSA9PT0gXCJyYXlcIikge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdHJhbnNmb3JtLmNvbmZpZztcbiAgICBjb25zdCBkaWFnID0gTWF0aC5zcXJ0KHdpZHRoICogd2lkdGggKyBoZWlnaHQgKiBoZWlnaHQpIC8gdHJhbnNmb3JtLnNjYWxlICogMjtcbiAgICBjb25zdCBwMSA9IHRyYW5zZm9ybS50b1BpeGVsKG9iai5vcmlnaW4pO1xuICAgIGNvbnN0IHAyID0gdHJhbnNmb3JtLnRvUGl4ZWwoW29iai5vcmlnaW5bMF0gKyBvYmouZGlyWzBdICogZGlhZywgb2JqLm9yaWdpblsxXSArIG9iai5kaXJbMV0gKiBkaWFnXSk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8ocDFbMF0sIHAxWzFdKTtcbiAgICBjdHgubGluZVRvKHAyWzBdLCBwMlsxXSk7XG4gICAgY3R4LnN0cm9rZSgpO1xuICB9IGVsc2UgaWYgKG9iai50eXBlID09PSBcImNpcmNsZVwiKSB7XG4gICAgY29uc3QgW2N4LCBjeV0gPSB0cmFuc2Zvcm0udG9QaXhlbChvYmouY2VudGVyKTtcbiAgICBjb25zdCByUHggPSBvYmoucmFkaXVzICogdHJhbnNmb3JtLnNjYWxlO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKGN4LCBjeSwgclB4LCAwLCBNYXRoLlBJICogMik7XG4gICAgY3R4LnN0cm9rZSgpO1xuICB9XG5cbiAgY3R4LnJlc3RvcmUoKTtcbn1cblxuZnVuY3Rpb24gZHJhd0dob3N0Rm9yVG9vbChcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gIHRyYW5zZm9ybTogVHJhbnNmb3JtLFxuICByZXNvbHZlZDogUmVzb2x2ZWRTY2VuZSxcbiAgdG9vbDogVG9vbFR5cGUsXG4gIHBlbmRpbmc6IFBlbmRpbmdTdGF0ZSxcbiAgZ2hvc3RQb3M6IFZlYzIgfCBudWxsLFxuICBzbmFwOiBTbmFwVGFyZ2V0IHwgbnVsbFxuKTogdm9pZCB7XG4gIGlmICghZ2hvc3RQb3MgfHwgcGVuZGluZy5wb2ludElkcy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICBjb25zdCB0YXJnZXRQb3MgPSBzbmFwID8gc25hcC5wb3MgOiBnaG9zdFBvcztcblxuICBjdHguc2F2ZSgpO1xuICBjdHguc3Ryb2tlU3R5bGUgPSBcInJnYmEoNzAsIDEzMCwgMjQwLCAwLjUpXCI7XG4gIGN0eC5saW5lV2lkdGggPSAxLjU7XG4gIGN0eC5zZXRMaW5lRGFzaChbNiwgNF0pO1xuXG4gIGNvbnN0IGZpcnN0UHQgPSBnZXRSZXNvbHZlZFBvcyhyZXNvbHZlZCwgcGVuZGluZy5wb2ludElkc1swXSk7XG4gIGlmICghZmlyc3RQdCkgeyBjdHgucmVzdG9yZSgpOyByZXR1cm47IH1cblxuICBjb25zdCBbeDEsIHkxXSA9IHRyYW5zZm9ybS50b1BpeGVsKGZpcnN0UHQpO1xuICBjb25zdCBbeDIsIHkyXSA9IHRyYW5zZm9ybS50b1BpeGVsKHRhcmdldFBvcyk7XG5cbiAgc3dpdGNoICh0b29sKSB7XG4gICAgY2FzZSBcImxpbmVcIjpcbiAgICBjYXNlIFwic2VnbWVudFwiOlxuICAgIGNhc2UgXCJwZXJwX2Jpc2VjdG9yXCI6IHtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcbiAgICAgIGN0eC5saW5lVG8oeDIsIHkyKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgIGlmICh0b29sID09PSBcInBlcnBfYmlzZWN0b3JcIikge1xuICAgICAgICAvLyBTaG93IG1pZHBvaW50IGluZGljYXRvclxuICAgICAgICBjb25zdCBtaWQgPSB0cmFuc2Zvcm0udG9QaXhlbChnZW8ubWlkcG9pbnQoZmlyc3RQdCwgdGFyZ2V0UG9zKSk7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYyhtaWRbMF0sIG1pZFsxXSwgMywgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2JhKDcwLCAxMzAsIDI0MCwgMC42KVwiO1xuICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJjaXJjbGVcIjoge1xuICAgICAgY29uc3QgciA9IE1hdGguc3FydCgoeDIgLSB4MSkgKiogMiArICh5MiAtIHkxKSAqKiAyKTtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5hcmMoeDEsIHkxLCByLCAwLCBNYXRoLlBJICogMik7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcIm1pZHBvaW50XCI6IHtcbiAgICAgIC8vIFNob3cgbGluZSBiZXR3ZWVuIHBvaW50cyBhbmQgbWlkcG9pbnQgZG90XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKHgxLCB5MSk7XG4gICAgICBjdHgubGluZVRvKHgyLCB5Mik7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICBjb25zdCBtaWQgPSB0cmFuc2Zvcm0udG9QaXhlbChnZW8ubWlkcG9pbnQoZmlyc3RQdCwgdGFyZ2V0UG9zKSk7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHguYXJjKG1pZFswXSwgbWlkWzFdLCA0LCAwLCBNYXRoLlBJICogMik7XG4gICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2JhKDcwLCAxMzAsIDI0MCwgMC42KVwiO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiY29tcGFzc1wiOiB7XG4gICAgICBpZiAocGVuZGluZy5wb2ludElkcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgLy8gU2hvd2luZyB0aGUgcmFkaXVzIGxpbmVcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKHgxLCB5MSk7XG4gICAgICAgIGN0eC5saW5lVG8oeDIsIHkyKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfSBlbHNlIGlmIChwZW5kaW5nLnBvaW50SWRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAvLyBTaG93aW5nIHRoZSBjaXJjbGUgYXQgY3Vyc29yIHdpdGggY2FwdHVyZWQgcmFkaXVzXG4gICAgICAgIGNvbnN0IHAwID0gZ2V0UmVzb2x2ZWRQb3MocmVzb2x2ZWQsIHBlbmRpbmcucG9pbnRJZHNbMF0pO1xuICAgICAgICBjb25zdCBwMSA9IGdldFJlc29sdmVkUG9zKHJlc29sdmVkLCBwZW5kaW5nLnBvaW50SWRzWzFdKTtcbiAgICAgICAgaWYgKHAwICYmIHAxKSB7XG4gICAgICAgICAgY29uc3QgciA9IGdlby5kaXN0KHAwLCBwMSkgKiB0cmFuc2Zvcm0uc2NhbGU7XG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgIGN0eC5hcmMoeDIsIHkyLCByLCAwLCBNYXRoLlBJICogMik7XG4gICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcImFuZ2xlX2Jpc2VjdG9yXCI6IHtcbiAgICAgIGlmIChwZW5kaW5nLnBvaW50SWRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8oeDEsIHkxKTtcbiAgICAgICAgY3R4LmxpbmVUbyh4MiwgeTIpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9IGVsc2UgaWYgKHBlbmRpbmcucG9pbnRJZHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIGNvbnN0IHNlY29uZFB0ID0gZ2V0UmVzb2x2ZWRQb3MocmVzb2x2ZWQsIHBlbmRpbmcucG9pbnRJZHNbMV0pO1xuICAgICAgICBpZiAoc2Vjb25kUHQpIHtcbiAgICAgICAgICBjb25zdCBbc3gsIHN5XSA9IHRyYW5zZm9ybS50b1BpeGVsKHNlY29uZFB0KTtcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgY3R4Lm1vdmVUbyh4MSwgeTEpO1xuICAgICAgICAgIGN0eC5saW5lVG8oc3gsIHN5KTtcbiAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgIGN0eC5tb3ZlVG8oc3gsIHN5KTtcbiAgICAgICAgICBjdHgubGluZVRvKHgyLCB5Mik7XG4gICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcInBlcnBlbmRpY3VsYXJcIjpcbiAgICBjYXNlIFwicGFyYWxsZWxcIjoge1xuICAgICAgLy8gR2hvc3QgaXMganVzdCBhIGRvdCBhdCB0aGUgcG9pbnQgXHUyMDE0IHRoZSBsaW5lIGZyb20gY29uc3RydWN0aW9uIHdpbGwgc2hvdyBhZnRlclxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4LmFyYyh4MiwgeTIsIDQsIDAsIE1hdGguUEkgKiAyKTtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYmEoNzAsIDEzMCwgMjQwLCAwLjYpXCI7XG4gICAgICBjdHguZmlsbCgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgY3R4LnJlc3RvcmUoKTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVzb2x2ZWRQb3MocmVzb2x2ZWQ6IFJlc29sdmVkU2NlbmUsIGlkOiBzdHJpbmcpOiBWZWMyIHwgbnVsbCB7XG4gIGNvbnN0IG9iaiA9IHJlc29sdmVkLm9iamVjdHMuZ2V0KGlkKTtcbiAgaWYgKCFvYmogfHwgb2JqLnR5cGUgIT09IFwicG9pbnRcIikgcmV0dXJuIG51bGw7XG4gIHJldHVybiBvYmoucG9zO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ291bnRlcnMgXHUyNTAwXHUyNTAwXG5cbmludGVyZmFjZSBDb3VudGVycyB7XG4gIHBvaW50OiBudW1iZXI7XG4gIGxpbmU6IG51bWJlcjtcbiAgc2VnbWVudDogbnVtYmVyO1xuICBjaXJjbGU6IG51bWJlcjtcbiAgbWlkcG9pbnQ6IG51bWJlcjtcbiAgcGVycEJpc2VjdG9yOiBudW1iZXI7XG4gIHBlcnBlbmRpY3VsYXI6IG51bWJlcjtcbiAgcGFyYWxsZWw6IG51bWJlcjtcbiAgYW5nbGVCaXNlY3RvcjogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiByZWNhbGNDb3VudGVycyhzY2VuZTogR2VvbWV0cnlTY2VuZSk6IENvdW50ZXJzIHtcbiAgcmV0dXJuIHtcbiAgICBwb2ludDogT2JqZWN0LmtleXMoc2NlbmUucG9pbnRzKS5sZW5ndGggKyAxLFxuICAgIGxpbmU6IHNjZW5lLmNvbnN0cnVjdGlvbnMuZmlsdGVyKChjKSA9PiBjLnR5cGUgPT09IFwibGluZVwiKS5sZW5ndGggKyAxLFxuICAgIHNlZ21lbnQ6IHNjZW5lLmNvbnN0cnVjdGlvbnMuZmlsdGVyKChjKSA9PiBjLnR5cGUgPT09IFwic2VnbWVudFwiKS5sZW5ndGggKyAxLFxuICAgIGNpcmNsZTogc2NlbmUuY29uc3RydWN0aW9ucy5maWx0ZXIoKGMpID0+IGMudHlwZSA9PT0gXCJjaXJjbGVcIikubGVuZ3RoICsgMSxcbiAgICBtaWRwb2ludDogc2NlbmUuY29uc3RydWN0aW9ucy5maWx0ZXIoKGMpID0+IGMudHlwZSA9PT0gXCJtaWRwb2ludFwiKS5sZW5ndGggKyAxLFxuICAgIHBlcnBCaXNlY3Rvcjogc2NlbmUuY29uc3RydWN0aW9ucy5maWx0ZXIoKGMpID0+IGMudHlwZSA9PT0gXCJwZXJwZW5kaWN1bGFyXCIpLmxlbmd0aCArIDEsXG4gICAgcGVycGVuZGljdWxhcjogc2NlbmUuY29uc3RydWN0aW9ucy5maWx0ZXIoKGMpID0+IGMudHlwZSA9PT0gXCJwZXJwZW5kaWN1bGFyXCIpLmxlbmd0aCArIDEsXG4gICAgcGFyYWxsZWw6IHNjZW5lLmNvbnN0cnVjdGlvbnMuZmlsdGVyKChjKSA9PiBjLnR5cGUgPT09IFwicGFyYWxsZWxcIikubGVuZ3RoICsgMSxcbiAgICBhbmdsZUJpc2VjdG9yOiBzY2VuZS5jb25zdHJ1Y3Rpb25zLmZpbHRlcigoYykgPT4gYy50eXBlID09PSBcImFuZ2xlX2Jpc2VjdG9yXCIpLmxlbmd0aCArIDEsXG4gIH07XG59XG4iLCAiaW1wb3J0IHsgR2VvbWV0cnlTY2VuZSwgQ29uc3RydWN0aW9uU3RlcCwgVmVjMiB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKiBSb3VuZCB0byAyIGRlY2ltYWwgcGxhY2VzIHRvIGtlZXAgWUFNTCBjbGVhbiAqL1xuZnVuY3Rpb24gcihuOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5yb3VuZChuICogMTAwKSAvIDEwMDtcbn1cblxuZnVuY3Rpb24gdmVjKHY6IFZlYzIpOiBzdHJpbmcge1xuICByZXR1cm4gYFske3IodlswXSl9LCAke3IodlsxXSl9XWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVTY2VuZShzY2VuZTogR2VvbWV0cnlTY2VuZSk6IHN0cmluZyB7XG4gIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGlmIChzY2VuZS50aXRsZSkge1xuICAgIGxpbmVzLnB1c2goYHRpdGxlOiAke3NjZW5lLnRpdGxlfWApO1xuICB9XG5cbiAgLy8gUG9pbnRzXG4gIGNvbnN0IHBvaW50RW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHNjZW5lLnBvaW50cyk7XG4gIGlmIChwb2ludEVudHJpZXMubGVuZ3RoID4gMCkge1xuICAgIGxpbmVzLnB1c2goXCJwb2ludHM6XCIpO1xuICAgIGZvciAoY29uc3QgW2lkLCBjb29yZHNdIG9mIHBvaW50RW50cmllcykge1xuICAgICAgbGluZXMucHVzaChgICAke2lkfTogJHt2ZWMoY29vcmRzKX1gKTtcbiAgICB9XG4gIH1cblxuICAvLyBDb25zdHJ1Y3Rpb25zXG4gIGlmIChzY2VuZS5jb25zdHJ1Y3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICBsaW5lcy5wdXNoKFwiY29uc3RydWN0aW9uczpcIik7XG4gICAgZm9yIChjb25zdCBzdGVwIG9mIHNjZW5lLmNvbnN0cnVjdGlvbnMpIHtcbiAgICAgIGxpbmVzLnB1c2goYCAgLSAke3NlcmlhbGl6ZVN0ZXAoc3RlcCl9YCk7XG4gICAgfVxuICB9XG5cbiAgLy8gU3R5bGVcbiAgY29uc3Qgc3R5bGVFbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoc2NlbmUuc3R5bGUpO1xuICBpZiAoc3R5bGVFbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICBsaW5lcy5wdXNoKFwic3R5bGU6XCIpO1xuICAgIGZvciAoY29uc3QgW2lkLCBzXSBvZiBzdHlsZUVudHJpZXMpIHtcbiAgICAgIGNvbnN0IHByb3BzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgaWYgKHMuY29sb3IpIHByb3BzLnB1c2goYGNvbG9yOiAke3MuY29sb3J9YCk7XG4gICAgICBpZiAocy53aWR0aCAhPT0gdW5kZWZpbmVkKSBwcm9wcy5wdXNoKGB3aWR0aDogJHtzLndpZHRofWApO1xuICAgICAgaWYgKHMuZGFzaCkgcHJvcHMucHVzaChgZGFzaDogdHJ1ZWApO1xuICAgICAgaWYgKHMuZmlsbCkgcHJvcHMucHVzaChgZmlsbDogXCIke3MuZmlsbH1cImApO1xuICAgICAgaWYgKHMuc2l6ZSAhPT0gdW5kZWZpbmVkKSBwcm9wcy5wdXNoKGBzaXplOiAke3Muc2l6ZX1gKTtcbiAgICAgIGlmIChzLmxhYmVsKSBwcm9wcy5wdXNoKGBsYWJlbDogXCIke3MubGFiZWx9XCJgKTtcbiAgICAgIGxpbmVzLnB1c2goYCAgJHtpZH06IHske3Byb3BzLmpvaW4oXCIsIFwiKX19YCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ29uZmlnIChvbmx5IG5vbi1kZWZhdWx0IHZhbHVlcylcbiAgY29uc3QgY2ZnUGFydHM6IHN0cmluZ1tdID0gW107XG4gIGlmIChzY2VuZS5jb25maWcuZ3JpZCkgY2ZnUGFydHMucHVzaChcImdyaWQ6IHRydWVcIik7XG4gIGlmIChzY2VuZS5jb25maWcuYXhlcykgY2ZnUGFydHMucHVzaChcImF4ZXM6IHRydWVcIik7XG4gIGlmIChzY2VuZS5jb25maWcud2lkdGggIT09IDYwMCkgY2ZnUGFydHMucHVzaChgd2lkdGg6ICR7c2NlbmUuY29uZmlnLndpZHRofWApO1xuICBpZiAoc2NlbmUuY29uZmlnLmhlaWdodCAhPT0gNDAwKSBjZmdQYXJ0cy5wdXNoKGBoZWlnaHQ6ICR7c2NlbmUuY29uZmlnLmhlaWdodH1gKTtcbiAgaWYgKHNjZW5lLmNvbmZpZy5zY2FsZSAhPT0gNTApIGNmZ1BhcnRzLnB1c2goYHNjYWxlOiAke3NjZW5lLmNvbmZpZy5zY2FsZX1gKTtcbiAgaWYgKCFzY2VuZS5jb25maWcuaW50ZXJhY3RpdmUpIGNmZ1BhcnRzLnB1c2goXCJpbnRlcmFjdGl2ZTogZmFsc2VcIik7XG5cbiAgaWYgKGNmZ1BhcnRzLmxlbmd0aCA+IDApIHtcbiAgICBsaW5lcy5wdXNoKFwiY29uZmlnOlwiKTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgY2ZnUGFydHMpIHtcbiAgICAgIGxpbmVzLnB1c2goYCAgJHtwfWApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsaW5lcy5qb2luKFwiXFxuXCIpICsgXCJcXG5cIjtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplU3RlcChzdGVwOiBDb25zdHJ1Y3Rpb25TdGVwKTogc3RyaW5nIHtcbiAgc3dpdGNoIChzdGVwLnR5cGUpIHtcbiAgICBjYXNlIFwibGluZVwiOlxuICAgICAgcmV0dXJuIGBsaW5lOiB7dGhyb3VnaDogWyR7c3RlcC50aHJvdWdoWzBdfSwgJHtzdGVwLnRocm91Z2hbMV19XSwgaWQ6ICR7c3RlcC5pZH19YDtcbiAgICBjYXNlIFwic2VnbWVudFwiOlxuICAgICAgcmV0dXJuIGBzZWdtZW50OiB7ZnJvbTogJHtzdGVwLmZyb219LCB0bzogJHtzdGVwLnRvfSwgaWQ6ICR7c3RlcC5pZH19YDtcbiAgICBjYXNlIFwicmF5XCI6XG4gICAgICByZXR1cm4gYHJheToge2Zyb206ICR7c3RlcC5mcm9tfSwgdGhyb3VnaDogJHtzdGVwLnRocm91Z2h9LCBpZDogJHtzdGVwLmlkfX1gO1xuICAgIGNhc2UgXCJjaXJjbGVcIjoge1xuICAgICAgY29uc3QgcGFydHMgPSBbYGNlbnRlcjogJHtzdGVwLmNlbnRlcn1gXTtcbiAgICAgIGlmIChzdGVwLnRocm91Z2gpIHBhcnRzLnB1c2goYHRocm91Z2g6ICR7c3RlcC50aHJvdWdofWApO1xuICAgICAgaWYgKHN0ZXAucmFkaXVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGFydHMucHVzaChgcmFkaXVzOiAke3R5cGVvZiBzdGVwLnJhZGl1cyA9PT0gXCJzdHJpbmdcIiA/IGBcIiR7c3RlcC5yYWRpdXN9XCJgIDogc3RlcC5yYWRpdXN9YCk7XG4gICAgICB9XG4gICAgICBwYXJ0cy5wdXNoKGBpZDogJHtzdGVwLmlkfWApO1xuICAgICAgcmV0dXJuIGBjaXJjbGU6IHske3BhcnRzLmpvaW4oXCIsIFwiKX19YDtcbiAgICB9XG4gICAgY2FzZSBcImludGVyc2VjdFwiOiB7XG4gICAgICBjb25zdCBpZFN0ciA9IEFycmF5LmlzQXJyYXkoc3RlcC5pZClcbiAgICAgICAgPyBgWyR7c3RlcC5pZFswXX0sICR7c3RlcC5pZFsxXX1dYFxuICAgICAgICA6IHN0ZXAuaWQ7XG4gICAgICBjb25zdCBwYXJ0cyA9IFtgb2Y6IFske3N0ZXAub2ZbMF19LCAke3N0ZXAub2ZbMV19XWAsIGBpZDogJHtpZFN0cn1gXTtcbiAgICAgIGlmIChzdGVwLndoaWNoICE9PSB1bmRlZmluZWQpIHBhcnRzLnB1c2goYHdoaWNoOiAke3N0ZXAud2hpY2h9YCk7XG4gICAgICByZXR1cm4gYGludGVyc2VjdDogeyR7cGFydHMuam9pbihcIiwgXCIpfX1gO1xuICAgIH1cbiAgICBjYXNlIFwibWlkcG9pbnRcIjpcbiAgICAgIHJldHVybiBgbWlkcG9pbnQ6IHtvZjogWyR7c3RlcC5vZlswXX0sICR7c3RlcC5vZlsxXX1dLCBpZDogJHtzdGVwLmlkfX1gO1xuICAgIGNhc2UgXCJwZXJwZW5kaWN1bGFyXCI6XG4gICAgICByZXR1cm4gYHBlcnBlbmRpY3VsYXI6IHt0bzogJHtzdGVwLnRvfSwgdGhyb3VnaDogJHtzdGVwLnRocm91Z2h9LCBpZDogJHtzdGVwLmlkfX1gO1xuICAgIGNhc2UgXCJwYXJhbGxlbFwiOlxuICAgICAgcmV0dXJuIGBwYXJhbGxlbDoge3RvOiAke3N0ZXAudG99LCB0aHJvdWdoOiAke3N0ZXAudGhyb3VnaH0sIGlkOiAke3N0ZXAuaWR9fWA7XG4gICAgY2FzZSBcImFuZ2xlX2Jpc2VjdG9yXCI6XG4gICAgICByZXR1cm4gYGFuZ2xlX2Jpc2VjdG9yOiB7cG9pbnRzOiBbJHtzdGVwLnBvaW50c1swXX0sICR7c3RlcC5wb2ludHNbMV19LCAke3N0ZXAucG9pbnRzWzJdfV0sIGlkOiAke3N0ZXAuaWR9fWA7XG4gICAgY2FzZSBcInBvbHlnb25cIjpcbiAgICAgIHJldHVybiBgcG9seWdvbjoge3ZlcnRpY2VzOiBbJHtzdGVwLnZlcnRpY2VzLmpvaW4oXCIsIFwiKX1dLCBpZDogJHtzdGVwLmlkfX1gO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFBbUU7OztBQ0FuRSxJQUFNLFFBQVEsT0FBTyxJQUFJLFlBQVk7QUFDckMsSUFBTSxNQUFNLE9BQU8sSUFBSSxlQUFlO0FBQ3RDLElBQU0sTUFBTSxPQUFPLElBQUksVUFBVTtBQUNqQyxJQUFNLE9BQU8sT0FBTyxJQUFJLFdBQVc7QUFDbkMsSUFBTSxTQUFTLE9B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TUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBLENBQUMsTUFBTTtBQUNMLG1CQUFXLENBQUMsSUFBSSxHQUFHLEtBQUssU0FBUztBQUMvQixjQUFJLFVBQVUsT0FBTyxhQUFhLE9BQU8sQ0FBQztBQUFBLFFBQzVDO0FBQUEsTUFDRjtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBRUEsZUFBVyxDQUFDLElBQUksR0FBRyxLQUFLLFNBQVM7QUFDL0IsVUFBSSxpQkFBaUIsU0FBUyxNQUFNLFFBQVEsRUFBRSxDQUFDO0FBQUEsSUFDakQ7QUFBQSxFQUNGO0FBQUEsRUFFUSxnQkFDTixPQUNBLElBQ0EsT0FDTTtBQUNOLFVBQU0sY0FBYyxNQUFNLGVBQWUsRUFBRTtBQUMzQyxRQUFJLENBQUM7QUFBYTtBQUVsQixVQUFNLE9BQU8sS0FBSyxJQUFJLFVBQVUsb0JBQW9CLDRCQUFZO0FBQ2hFLFFBQUksQ0FBQztBQUFNO0FBRVgsVUFBTSxTQUFTLEtBQUs7QUFDcEIsVUFBTSxFQUFFLFdBQVcsUUFBUSxJQUFJO0FBRS9CLFVBQU0sVUFBVSxlQUFlLEtBQUs7QUFDcEMsVUFBTSxPQUFPLEVBQUUsTUFBTSxZQUFZLEdBQUcsSUFBSSxFQUFFO0FBQzFDLFVBQU0sS0FBSyxFQUFFLE1BQU0sU0FBUyxJQUFJLEVBQUU7QUFDbEMsV0FBTyxhQUFhLFNBQVMsTUFBTSxFQUFFO0FBQUEsRUFDdkM7QUFBQSxFQUVRLFlBQVksSUFBaUIsS0FBb0I7QUFDdkQsVUFBTSxNQUFNLGVBQWUsUUFBUSxJQUFJLFVBQVUsT0FBTyxHQUFHO0FBQzNELFVBQU0sTUFBTSxHQUFHLFNBQVMsT0FBTyxFQUFFLEtBQUssaUJBQWlCLENBQUM7QUFDeEQsUUFBSSxRQUFRLG1CQUFtQixHQUFHLEVBQUU7QUFBQSxFQUN0QztBQUNGOyIsCiAgIm5hbWVzIjogWyJyZXMiLCAicmVzIiwgIm1hcCIsICJzY2hlbWEiLCAibm9kZSIsICJzY2hlbWEiLCAic3RyIiwgImkiLCAiZW5kIiwgImlzQmxvY2siLCAic3RyIiwgInN0ciIsICJzdHIiLCAibWFwIiwgInZhbHVlIiwgIm1hcCIsICJzY2hlbWEiLCAic3RyaW5naWZ5IiwgImNvbW1lbnQiLCAic3RyIiwgInNjaGVtYSIsICJtYXAiLCAiYWRkIiwgIm1hcCIsICJzY2hlbWEiLCAic2NoZW1hIiwgInNlcSIsICJzZXEiLCAic2NoZW1hIiwgInN0ciIsICJzdHIiLCAic3RyIiwgImRvdCIsICJzdHIiLCAiaW50SWRlbnRpZnkiLCAic3RyIiwgInNjaGVtYSIsICJzdHIiLCAic2VxIiwgInNjaGVtYSIsICJwYWlycyIsICJtYXAiLCAic2NoZW1hIiwgInBhaXJzIiwgIm9tYXAiLCAic2VxIiwgImZsb2F0TmFOIiwgInN0ciIsICJmbG9hdEV4cCIsICJmbG9hdCIsICJkb3QiLCAiaW50SWRlbnRpZnkiLCAiaW50UmVzb2x2ZSIsICJzdHIiLCAibiIsICJpbnRTdHJpbmdpZnkiLCAiaW50T2N0IiwgImludCIsICJpbnRIZXgiLCAic2NoZW1hIiwgInNldCIsICJtYXAiLCAic3RyIiwgInJlcyIsICJzY2hlbWEiLCAiaW50T2N0IiwgImludCIsICJpbnRIZXgiLCAiZmxvYXROYU4iLCAiZmxvYXRFeHAiLCAiZmxvYXQiLCAic2NoZW1hIiwgInRhZ3MiLCAibWVyZ2UiLCAic2NoZW1hIiwgInJlcyIsICJjb21wb3NlTm9kZSIsICJjb21wb3NlRW1wdHlOb2RlIiwgIm1hcCIsICJjb21wb3NlTm9kZSIsICJjb21wb3NlRW1wdHlOb2RlIiwgInNlcSIsICJjb21wb3NlTm9kZSIsICJjb21wb3NlRW1wdHlOb2RlIiwgImlzTWFwIiwgIm1hcCIsICJDTiIsICJ2YWx1ZSIsICJlbmQiLCAibGVuZ3RoIiwgImxlbmd0aCIsICJzY2hlbWEiLCAidGFnIiwgIkJSRUFLIiwgIlNLSVAiLCAiUkVNT1ZFIiwgInZpc2l0IiwgIlNDQUxBUiIsICJTQ0FMQVIiLCAiaSIsICJjaCIsICJTQ0FMQVIiLCAibWFwIiwgInN0YXJ0IiwgInNlcSIsICJyIiwgImlkIiwgInIiXQp9Cg==
