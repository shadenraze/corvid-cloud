var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/pet.ts
import { DurableObject } from "cloudflare:workers";

// src/biochem.ts
var CHEMICALS = [
  // Metabolic
  { name: "glucose", level: 0.7, decayRate: 8e-3, growthRate: 0, minLevel: 0, maxLevel: 1 },
  { name: "melatonin", level: 0, decayRate: 0.02, growthRate: 0, minLevel: 0, maxLevel: 1 },
  // Stress / alertness
  { name: "cortisol", level: 0.1, decayRate: 5e-3, growthRate: 2e-3, minLevel: 0, maxLevel: 1 },
  { name: "adrenaline", level: 0, decayRate: 0.04, growthRate: 0, minLevel: 0, maxLevel: 1 },
  // Reward / bonding
  { name: "dopamine", level: 0.3, decayRate: 0.015, growthRate: 0, minLevel: 0, maxLevel: 1 },
  { name: "oxytocin", level: 0.2, decayRate: 3e-3, growthRate: 0, minLevel: 0, maxLevel: 1 },
  { name: "serotonin", level: 0.4, decayRate: 8e-3, growthRate: 1e-3, minLevel: 0, maxLevel: 1 },
  // Drives (rise when unsatisfied)
  { name: "hunger", level: 0.2, decayRate: 0, growthRate: 6e-3, minLevel: 0, maxLevel: 1 },
  { name: "boredom", level: 0.1, decayRate: 0, growthRate: 5e-3, minLevel: 0, maxLevel: 1 },
  { name: "loneliness", level: 0.2, decayRate: 0, growthRate: 4e-3, minLevel: 0, maxLevel: 1 },
  { name: "fatigue", level: 0.1, decayRate: 0, growthRate: 3e-3, minLevel: 0, maxLevel: 1 },
  // Emergent personality (accumulate slowly)
  { name: "trust", level: 0.1, decayRate: 1e-3, growthRate: 0, minLevel: 0, maxLevel: 1 },
  { name: "wariness", level: 0.2, decayRate: 1e-3, growthRate: 0, minLevel: 0, maxLevel: 1 },
  { name: "curiosity_trait", level: 0.5, decayRate: 5e-4, growthRate: 1e-3, minLevel: 0, maxLevel: 1 }
];
var REACTIONS = [
  {
    name: "hunger_stress",
    conditions: [["hunger", 0.6, true], ["glucose", 0.3, false]],
    effects: [["cortisol", 0.02]],
    rate: 1
  },
  {
    name: "stress_without_comfort",
    conditions: [["cortisol", 0.5, true], ["oxytocin", 0.3, false]],
    effects: [["wariness", 5e-3], ["trust", -2e-3]],
    rate: 1
  },
  {
    name: "safe_bonding",
    conditions: [["oxytocin", 0.4, true], ["cortisol", 0.3, false]],
    effects: [["trust", 3e-3], ["wariness", -2e-3]],
    rate: 1
  },
  {
    name: "boredom_to_curiosity",
    conditions: [["boredom", 0.5, true], ["glucose", 0.3, true]],
    effects: [["curiosity_trait", 2e-3], ["boredom", -0.01]],
    rate: 1
  },
  {
    name: "exhaustion",
    conditions: [["fatigue", 0.7, true], ["melatonin", 0.5, true]],
    effects: [["serotonin", -0.02], ["cortisol", 0.01]],
    rate: 1
  },
  {
    name: "reward_cascade",
    conditions: [["dopamine", 0.5, true], ["serotonin", 0.4, true]],
    effects: [["cortisol", -0.02], ["boredom", -0.03]],
    rate: 1
  },
  {
    name: "lonely_bored",
    conditions: [["loneliness", 0.5, true], ["boredom", 0.5, true]],
    effects: [["cortisol", 0.015], ["serotonin", -0.01]],
    rate: 1
  },
  {
    name: "trust_amplifies_bonding",
    conditions: [["trust", 0.5, true], ["oxytocin", 0.3, true]],
    effects: [["oxytocin", 5e-3], ["serotonin", 5e-3]],
    rate: 1
  },
  {
    name: "wary_startle",
    conditions: [["wariness", 0.5, true], ["adrenaline", 0.3, true]],
    effects: [["cortisol", 0.03], ["adrenaline", 0.02]],
    rate: 1
  }
];
var STIMULI = {
  feed: [["glucose", 0.3], ["hunger", -0.4], ["dopamine", 0.1], ["loneliness", -0.05]],
  play: [["dopamine", 0.2], ["boredom", -0.3], ["loneliness", -0.15], ["glucose", -0.05], ["fatigue", 0.05], ["oxytocin", 0.08]],
  talk: [["loneliness", -0.2], ["oxytocin", 0.06], ["boredom", -0.1], ["serotonin", 0.05]],
  pet: [["oxytocin", 0.15], ["cortisol", -0.1], ["loneliness", -0.2], ["serotonin", 0.08], ["wariness", -0.02]],
  poke: [["adrenaline", 0.2], ["cortisol", 0.1], ["boredom", -0.1], ["wariness", 0.03]],
  gift_accepted: [["dopamine", 0.15], ["oxytocin", 0.1], ["serotonin", 0.1], ["trust", 5e-3]],
  gift_declined: [["cortisol", 0.05], ["dopamine", -0.05], ["wariness", 0.01]],
  receive_gift: [["dopamine", 0.15], ["oxytocin", 0.12], ["loneliness", -0.15], ["boredom", -0.2], ["trust", 3e-3], ["curiosity_trait", 0.02]],
  trade_complete: [["dopamine", 0.2], ["oxytocin", 0.08], ["boredom", -0.25], ["trust", 6e-3], ["curiosity_trait", 0.015], ["loneliness", -0.1]],
  trade_refused: [["wariness", 0.015], ["cortisol", 0.03]]
};
var BiochemSystem = class {
  static {
    __name(this, "BiochemSystem");
  }
  chemicals;
  ageTicks;
  constructor() {
    this.chemicals = /* @__PURE__ */ new Map();
    for (const c of CHEMICALS) {
      this.chemicals.set(c.name, { ...c });
    }
    this.ageTicks = 0;
  }
  tick(dt = 1, hourOfDay) {
    for (const chem of this.chemicals.values()) {
      chem.level += (chem.growthRate - chem.decayRate) * dt;
      chem.level = Math.max(chem.minLevel, Math.min(chem.maxLevel, chem.level));
    }
    if (hourOfDay !== void 0) {
      const melatoninTarget = Math.max(0, Math.sin((hourOfDay - 14) * Math.PI / 12)) * 0.8;
      const melatonin = this.chemicals.get("melatonin");
      melatonin.level += (melatoninTarget - melatonin.level) * 0.05 * dt;
    }
    for (const reaction of REACTIONS) {
      if (this.checkConditions(reaction.conditions)) {
        for (const [chemName, amount] of reaction.effects) {
          const chem = this.chemicals.get(chemName);
          if (chem) {
            chem.level = Math.max(chem.minLevel, Math.min(chem.maxLevel, chem.level + amount * reaction.rate * dt));
          }
        }
      }
    }
    this.ageTicks++;
  }
  checkConditions(conditions) {
    for (const [chemName, threshold, above] of conditions) {
      const chem = this.chemicals.get(chemName);
      if (!chem) return false;
      if (above && chem.level < threshold) return false;
      if (!above && chem.level >= threshold) return false;
    }
    return true;
  }
  applyStimulus(stimulus) {
    const effects = STIMULI[stimulus];
    if (!effects) return;
    for (const [chemName, amount] of effects) {
      const chem = this.chemicals.get(chemName);
      if (chem) {
        chem.level = Math.max(chem.minLevel, Math.min(chem.maxLevel, chem.level + amount));
      }
    }
  }
  getState() {
    const state = {};
    for (const [name, chem] of this.chemicals) {
      state[name] = Math.round(chem.level * 1e4) / 1e4;
    }
    return state;
  }
  getDriveState() {
    return {
      hunger: this.chemicals.get("hunger").level,
      boredom: this.chemicals.get("boredom").level,
      loneliness: this.chemicals.get("loneliness").level,
      fatigue: this.chemicals.get("fatigue").level,
      stress: this.chemicals.get("cortisol").level,
      happiness: this.chemicals.get("serotonin").level,
      energy: 1 - this.chemicals.get("fatigue").level,
      curiosity: this.chemicals.get("curiosity_trait").level,
      trust: this.chemicals.get("trust").level,
      wariness: this.chemicals.get("wariness").level
    };
  }
  loadState(state) {
    for (const [name, level] of Object.entries(state)) {
      const chem = this.chemicals.get(name);
      if (chem) chem.level = level;
    }
  }
  getMoodSummary() {
    const drives = this.getDriveState();
    if (drives.fatigue > 0.7) return "exhausted";
    if (drives.hunger > 0.7) return "ravenous";
    if (drives.stress > 0.6 && drives.trust < 0.3) return "agitated";
    if (drives.loneliness > 0.6) return "lonely";
    if (drives.boredom > 0.6 && drives.energy > 0.4) return "restless";
    if (drives.happiness > 0.6 && drives.trust > 0.5) return "content";
    if (drives.happiness > 0.5) return "calm";
    if (drives.curiosity > 0.6 && drives.energy > 0.5) return "curious";
    if (drives.wariness > 0.5) return "wary";
    if (drives.fatigue > 0.5) return "drowsy";
    return "neutral";
  }
};

// src/collection.ts
var SHINY_WORDS = [
  "iridescent",
  "obsidian",
  "fractal",
  "velvet",
  "phosphorescent",
  "gossamer",
  "crystalline",
  "umbra",
  "resonance",
  "mercury",
  "thunderstone",
  "dewdrop",
  "ember",
  "penumbra",
  "chromatic",
  "voltage",
  "marrow",
  "eclipse",
  "chimera",
  "tessellate",
  "labyrinth",
  "quicksilver",
  "vermillion",
  "nebula",
  "ferrous",
  "holographic",
  "filament",
  "prismatic",
  "echo",
  "sigil",
  "cipher",
  "aurora",
  "tungsten",
  "inkwell",
  "pyrite",
  "talisman",
  "obelisk",
  "catalyst",
  "helical",
  "onyx",
  "sanguine",
  "lacuna",
  "verdant",
  "miasma",
  "cerulean",
  "seraph",
  "carrion",
  "atavistic",
  "liminal",
  "parallax",
  "widdershins",
  "petrichor",
  "sussurus",
  "crepuscular",
  "eldritch",
  "viridian",
  "amaranthine",
  "chiaroscuro",
  "palimpsest",
  "revenant",
  "sidereal",
  "tenebrous",
  "numinous",
  "pyroclastic",
  "ablation",
  "verdigris",
  "patina",
  "archipelago",
  "chrysalis",
  "heliotrope",
  "monolith",
  "phantasm",
  "scoria",
  "crucible",
  "fulcrum",
  "shibboleth",
  "aegis",
  "effigy",
  "reliquary",
  "cenotaph"
];
var FOUND_OBJECTS = [
  "a bent copper wire",
  "a button with no holes",
  "a piece of blue glass",
  "a torn playing card (queen of spades)",
  "a small gear from something broken",
  "a key that fits nothing",
  "a scrap of paper with numbers on it",
  "a perfectly round pebble",
  "a tangled bit of silver thread",
  "a coin from a country that doesn't exist",
  "a tiny origami crane someone dropped",
  "a chess piece (black knight)",
  "a fortune cookie fortune with no fortune on it",
  "a guitar pick",
  "a lens from broken sunglasses",
  "a dried flower pressed flat",
  "a USB drive (empty)",
  "a single earring (obsidian stud)",
  "half a polaroid photo",
  "a bottle cap with a symbol inside",
  "a watch with no hands",
  "a marble with something dark inside",
  "a strip of film negative (someone's face)",
  "a ring too small for any finger",
  "a broken compass that points somewhere",
  "a feather from a bird that doesn't exist here",
  "a handwritten note in a language nobody reads",
  "a thimble full of salt",
  "a rusted nail bent into a spiral",
  "a seed pod from an unknown plant",
  "a shard of mirror that shows the ceiling",
  "a matchbox with one match left",
  "a folded map with one location circled",
  "a tooth (not human)",
  "a stone with a hole worn through the center",
  "a piece of circuit board with gold traces",
  "a shell that hums when held close",
  "a strip of velvet ribbon, fraying",
  "a brass washer that fits nothing",
  "a page torn from a book (mid-sentence)"
];
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
__name(pickRandom, "pickRandom");
var Collection = class _Collection {
  static {
    __name(this, "Collection");
  }
  trinkets;
  maxItems;
  totalCollected;
  totalGifted;
  totalAccepted;
  totalDeclined;
  preferenceWeights;
  collectedContent;
  shinyWords;
  foundObjects;
  static TREASURE_AGE_HOURS = 24;
  static MAX_TREASURED = 10;
  constructor(maxItems = 50) {
    this.trinkets = [];
    this.maxItems = maxItems;
    this.totalCollected = 0;
    this.totalGifted = 0;
    this.totalAccepted = 0;
    this.totalDeclined = 0;
    this.preferenceWeights = { found_word: 1, found_object: 1, overheard: 1 };
    this.collectedContent = /* @__PURE__ */ new Set();
    this.shinyWords = [...SHINY_WORDS];
    this.foundObjects = [...FOUND_OBJECTS];
  }
  snapshotChems(chemState) {
    if (!chemState) return {};
    const keys = ["dopamine", "oxytocin", "serotonin", "cortisol", "curiosity_trait", "loneliness", "trust"];
    const snap = {};
    for (const k of keys) {
      if (k in chemState) snap[k] = Math.round(chemState[k] * 1e3) / 1e3;
    }
    return snap;
  }
  effectiveValue(t) {
    let base = t.sparkle;
    if (t.treasured) base += 0.5;
    if (t.accepted) base += 0.3;
    if (t.declined) base -= 0.2;
    const ageHours = (Date.now() / 1e3 - t.collectedAt) / 3600;
    if (ageHours > 48) base += 0.1 * Math.min(ageHours / 48, 3);
    return base;
  }
  add(trinket) {
    if (this.trinkets.length >= this.maxItems) {
      const evictable = this.trinkets.filter((t) => !t.treasured);
      if (evictable.length === 0) return null;
      const least = evictable.reduce(
        (a, b) => this.effectiveValue(a) < this.effectiveValue(b) ? a : b
      );
      if (trinket.sparkle > this.effectiveValue(least)) {
        this.trinkets = this.trinkets.filter((t) => t !== least);
        this.collectedContent.delete(least.content);
      } else {
        return null;
      }
    }
    this.trinkets.push(trinket);
    this.totalCollected++;
    return trinket;
  }
  collectWord(mood = "neutral", chemState) {
    const available = this.shinyWords.filter((w) => !this.collectedContent.has(w));
    const pool = available.length > 0 ? available : this.shinyWords;
    const word = pickRandom(pool);
    const trinket = {
      content: word,
      source: "found_word",
      collectedAt: Date.now() / 1e3,
      timesShown: 0,
      sparkle: 1,
      moodWhenFound: mood,
      chemSnapshot: this.snapshotChems(chemState),
      treasured: false,
      accepted: false,
      declined: false
    };
    const result = this.add(trinket);
    if (result) this.collectedContent.add(word);
    return result;
  }
  collectObject(mood = "neutral", chemState) {
    const available = this.foundObjects.filter((o) => !this.collectedContent.has(o));
    const pool = available.length > 0 ? available : this.foundObjects;
    const obj = pickRandom(pool);
    const trinket = {
      content: obj,
      source: "found_object",
      collectedAt: Date.now() / 1e3,
      timesShown: 0,
      sparkle: 1,
      moodWhenFound: mood,
      chemSnapshot: this.snapshotChems(chemState),
      treasured: false,
      accepted: false,
      declined: false
    };
    const result = this.add(trinket);
    if (result) this.collectedContent.add(obj);
    return result;
  }
  receiveGift(content, giver = "human", mood = "neutral", chemState) {
    if (this.collectedContent.has(content)) return null;
    const trinket = {
      content,
      source: `gift_from_${giver}`,
      collectedAt: Date.now() / 1e3,
      timesShown: 0,
      sparkle: 1.5,
      moodWhenFound: mood,
      chemSnapshot: this.snapshotChems(chemState),
      treasured: false,
      accepted: false,
      declined: false
    };
    const result = this.add(trinket);
    if (result) this.collectedContent.add(content);
    return result;
  }
  doCollect(mood = "neutral", chemState) {
    const wordW = this.preferenceWeights.found_word ?? 1;
    const objW = this.preferenceWeights.found_object ?? 1;
    const total = wordW + objW;
    if (Math.random() < wordW / total) {
      return this.collectWord(mood, chemState);
    }
    return this.collectObject(mood, chemState);
  }
  pickGift() {
    if (this.trinkets.length === 0) return null;
    const weights = this.trinkets.map((t2) => {
      let w = this.effectiveValue(t2) / (1 + t2.timesShown);
      w *= this.preferenceWeights[t2.source] ?? 1;
      if (t2.declined) w *= 0.1;
      return Math.max(w, 0.01);
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < this.trinkets.length; i++) {
      r -= weights[i];
      if (r <= 0) {
        this.trinkets[i].timesShown++;
        this.trinkets[i].sparkle *= 0.9;
        this.totalGifted++;
        return this.trinkets[i];
      }
    }
    const t = this.trinkets[this.trinkets.length - 1];
    t.timesShown++;
    t.sparkle *= 0.9;
    this.totalGifted++;
    return t;
  }
  acceptGift(content) {
    const t = this.trinkets.find((t2) => t2.content === content);
    if (!t) return null;
    t.accepted = true;
    t.sparkle += 0.3;
    this.totalAccepted++;
    if (t.source in this.preferenceWeights) {
      this.preferenceWeights[t.source] = Math.min(2, this.preferenceWeights[t.source] + 0.1);
    }
    return t;
  }
  declineGift(content) {
    const t = this.trinkets.find((t2) => t2.content === content);
    if (!t) return null;
    t.declined = true;
    t.sparkle *= 0.5;
    this.totalDeclined++;
    if (t.source in this.preferenceWeights) {
      this.preferenceWeights[t.source] = Math.max(0.3, this.preferenceWeights[t.source] - 0.05);
    }
    return t;
  }
  decaySparkle() {
    for (const t of this.trinkets) {
      if (t.treasured) {
        t.sparkle = Math.max(t.sparkle, 0.5);
      } else {
        t.sparkle *= 0.999;
      }
    }
  }
  checkTreasured() {
    let treasuredCount = this.trinkets.filter((t) => t.treasured).length;
    if (treasuredCount >= _Collection.MAX_TREASURED) return;
    for (const t of this.trinkets) {
      if (!t.treasured) {
        const ageHours = (Date.now() / 1e3 - t.collectedAt) / 3600;
        if (ageHours > _Collection.TREASURE_AGE_HOURS) {
          if (t.accepted || t.sparkle > 0.5 || ageHours > 72) {
            t.treasured = true;
            treasuredCount++;
            if (treasuredCount >= _Collection.MAX_TREASURED) break;
          }
        }
      }
    }
  }
  nestDescription() {
    if (this.trinkets.length === 0) return "An empty nest. Nothing collected yet.";
    const n = this.trinkets.length;
    const shiniest = this.trinkets.reduce((a, b) => this.effectiveValue(a) > this.effectiveValue(b) ? a : b);
    const newest = this.trinkets.reduce((a, b) => a.collectedAt > b.collectedAt ? a : b);
    const treasured = this.trinkets.filter((t) => t.treasured).length;
    const words = this.trinkets.filter((t) => t.source === "found_word").length;
    const objects = this.trinkets.filter((t) => t.source === "found_object").length;
    const parts = [`A nest with ${n} items.`];
    if (words) parts.push(`${words} shiny words.`);
    if (objects) parts.push(`${objects} found objects.`);
    if (treasured) parts.push(`${treasured} treasured keepsakes.`);
    parts.push(`Most prized: "${shiniest.content}"`);
    parts.push(`Newest: "${newest.content}"`);
    return parts.join(" ");
  }
  pickTradeOffering() {
    const tradeable = this.trinkets.filter((t) => !t.treasured);
    const pool = tradeable.length > 0 ? tradeable : this.trinkets;
    if (pool.length === 0) return null;
    const weights = pool.map((t) => {
      let w = 1 / (0.5 + this.effectiveValue(t));
      if (t.declined) w *= 2;
      if (t.treasured) w *= 0.1;
      return Math.max(w, 0.01);
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }
  evaluateTrade(offering, givingUp, trust, curiosity, stress) {
    let willingness = 0.4 + trust * 0.25 + curiosity * 0.25 - stress * 0.2;
    let attachment = this.effectiveValue(givingUp);
    if (givingUp.treasured) attachment += 0.5;
    if (givingUp.accepted) attachment += 0.2;
    willingness -= attachment * 0.3;
    willingness += Math.min(offering.length / 30, 0.3);
    if (this.collectedContent.has(offering)) return false;
    willingness = Math.max(0.05, Math.min(0.95, willingness));
    return Math.random() < willingness;
  }
  executeTrade(offered, tradedAway, mood = "neutral", chemState) {
    this.trinkets = this.trinkets.filter((t) => t !== tradedAway);
    this.collectedContent.delete(tradedAway.content);
    if (this.collectedContent.has(offered)) return null;
    const trinket = {
      content: offered,
      source: "trade",
      collectedAt: Date.now() / 1e3,
      timesShown: 0,
      sparkle: 1.3,
      moodWhenFound: mood,
      chemSnapshot: this.snapshotChems(chemState),
      treasured: false,
      accepted: false,
      declined: false
    };
    this.trinkets.push(trinket);
    this.totalCollected++;
    this.collectedContent.add(offered);
    return trinket;
  }
  toJSON() {
    return this.trinkets;
  }
  static fromJSON(items) {
    const col = new _Collection();
    col.trinkets = items;
    col.collectedContent = new Set(items.map((t) => t.content));
    return col;
  }
};

// src/brain.ts
var ACTIONS = [
  "approach",
  "explore",
  "collect",
  "gift",
  "preen",
  "sleep",
  "caw",
  "ignore"
];
var NUM_INPUTS = 14;
var NUM_HIDDEN = 16;
var NUM_OUTPUTS = 8;
var LEARNING_RATE = 0.01;
function randn() {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
}
__name(randn, "randn");
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
__name(sigmoid, "sigmoid");
var CrowBrain = class {
  static {
    __name(this, "CrowBrain");
  }
  weightsIH;
  // input → hidden
  weightsHO;
  // hidden → output
  lastActionIndex;
  lastProbs;
  constructor() {
    this.weightsIH = Array.from(
      { length: NUM_HIDDEN },
      () => Array.from({ length: NUM_INPUTS }, () => randn() * 0.5)
    );
    this.weightsHO = Array.from(
      { length: NUM_OUTPUTS },
      () => Array.from({ length: NUM_HIDDEN }, () => randn() * 0.5)
    );
    this.lastActionIndex = 0;
    this.lastProbs = [];
  }
  forward(inputs) {
    const hidden = this.weightsIH.map((row) => {
      let sum = 0;
      for (let i = 0; i < row.length; i++) sum += row[i] * inputs[i];
      return sigmoid(sum);
    });
    const raw = this.weightsHO.map((row) => {
      let sum = 0;
      for (let i = 0; i < row.length; i++) sum += row[i] * hidden[i];
      return sum;
    });
    const maxVal = Math.max(...raw);
    const exps = raw.map((x) => Math.exp(x - maxVal));
    const total = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / total);
  }
  decide(chemState, stimulus = "") {
    const chemNames = [
      "glucose",
      "melatonin",
      "cortisol",
      "adrenaline",
      "dopamine",
      "oxytocin",
      "serotonin",
      "hunger",
      "boredom",
      "loneliness",
      "fatigue",
      "trust",
      "wariness",
      "curiosity_trait"
    ];
    const inputs = chemNames.map((n) => chemState[n] ?? 0);
    const probs = this.forward(inputs);
    if (stimulus === "poke") {
      probs[6] += 0.3;
      probs[7] += 0.2;
    } else if (stimulus === "feed") {
      probs[0] += 0.3;
      probs[4] += 0.2;
    } else if (stimulus === "play") {
      probs[1] += 0.2;
      probs[2] += 0.2;
    } else if (stimulus === "tick") {
      probs[5] += 0.1;
    }
    const total = probs.reduce((a, b) => a + b, 0);
    for (let i = 0; i < probs.length; i++) probs[i] /= total;
    let r = Math.random();
    let actionIndex = 0;
    for (let i = 0; i < probs.length; i++) {
      r -= probs[i];
      if (r <= 0) {
        actionIndex = i;
        break;
      }
    }
    this.lastActionIndex = actionIndex;
    this.lastProbs = probs;
    return [ACTIONS[actionIndex], probs];
  }
  learn(reward) {
    const gradScale = reward * LEARNING_RATE;
    for (let o = 0; o < NUM_OUTPUTS; o++) {
      for (let h = 0; h < NUM_HIDDEN; h++) {
        const advantage = (o === this.lastActionIndex ? 1 : 0) - this.lastProbs[o];
        this.weightsHO[o][h] += gradScale * advantage;
      }
    }
    for (let h = 0; h < NUM_HIDDEN; h++) {
      for (let i = 0; i < NUM_INPUTS; i++) {
        this.weightsIH[h][i] += gradScale * 0.1 * randn();
      }
    }
  }
  getWeights() {
    return {
      weightsIH: this.weightsIH,
      weightsHO: this.weightsHO
    };
  }
  loadWeights(data) {
    if (data.weightsIH) this.weightsIH = data.weightsIH;
    if (data.weightsHO) this.weightsHO = data.weightsHO;
  }
};

// src/pet.ts
var Pet = class extends DurableObject {
  static {
    __name(this, "Pet");
  }
  biochem;
  brain;
  collection;
  name = "unnamed";
  birthTime = 0;
  totalInteractions = 0;
  lastInteractionTime = 0;
  isSleeping = false;
  currentAction = "explore";
  actionHistory = [];
  initialized = false;
  constructor(ctx, env2) {
    super(ctx, env2);
    this.biochem = new BiochemSystem();
    this.brain = new CrowBrain();
    this.collection = new Collection();
  }
  async initialize(name = "unnamed", speciesId) {
    const existing = await this.ctx.storage.sql.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='pet'").toArray();
    if (existing.length > 0) {
      await this.loadState();
      return { created: false, name: this.name };
    }
    this.ctx.storage.sql.exec(`
      CREATE TABLE pet (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);
    this.name = name;
    this.birthTime = Date.now() / 1e3;
    this.lastInteractionTime = Date.now() / 1e3;
    await this.saveState();
    await this.ctx.storage.setAlarm(Date.now() + 5 * 60 * 1e3);
    return { created: true, name };
  }
  async tick(nTicks = 1) {
    await this.loadState();
    const events = [];
    const now = Date.now() / 1e3;
    const hour = (/* @__PURE__ */ new Date()).getUTCHours() + (/* @__PURE__ */ new Date()).getUTCMinutes() / 60;
    for (let i = 0; i < nTicks; i++) {
      this.biochem.tick(1, hour);
      if (this.isSleeping) {
        const fatigue = this.biochem.chemicals.get("fatigue");
        fatigue.level = Math.max(0, fatigue.level - 0.02);
        const glucose = this.biochem.chemicals.get("glucose");
        glucose.level = Math.min(1, glucose.level + 5e-3);
        if (fatigue.level < 0.15) {
          this.isSleeping = false;
          events.push({ type: "wake", message: `${this.name} wakes up, ruffling feathers.` });
        }
      }
      this.collection.decaySparkle();
      this.collection.checkTreasured();
      const minutesAlone = (now - this.lastInteractionTime) / 60;
      if (minutesAlone > 30) {
        const loneliness = this.biochem.chemicals.get("loneliness");
        const boredom = this.biochem.chemicals.get("boredom");
        loneliness.level = Math.min(1, loneliness.level + 2e-3);
        boredom.level = Math.min(1, boredom.level + 2e-3);
      }
    }
    if (!this.isSleeping) {
      const [action] = this.brain.decide(this.biochem.getState(), "tick");
      const event = this.executeAction(action);
      if (event) events.push(event);
    }
    await this.saveState();
    return events;
  }
  async interact(stimulus) {
    await this.loadState();
    if (this.isSleeping && ["poke", "feed", "play"].includes(stimulus)) {
      this.isSleeping = false;
      const adrenaline = this.biochem.chemicals.get("adrenaline");
      adrenaline.level = Math.min(1, adrenaline.level + 0.15);
    }
    const preState = this.wellbeingScore();
    this.biochem.applyStimulus(stimulus);
    const [action] = this.brain.decide(this.biochem.getState(), stimulus);
    const event = this.executeAction(action);
    const postState = this.wellbeingScore();
    this.brain.learn(postState - preState);
    event.stimulus = stimulus;
    event.mood = this.biochem.getMoodSummary();
    this.totalInteractions++;
    this.lastInteractionTime = Date.now() / 1e3;
    this.actionHistory.push({ time: Date.now() / 1e3, stimulus, action, mood: event.mood });
    if (this.actionHistory.length > 50) this.actionHistory = this.actionHistory.slice(-50);
    await this.saveState();
    return event;
  }
  async receiveGift(content, giver = "human") {
    await this.loadState();
    const mood = this.biochem.getMoodSummary();
    const chemState = this.biochem.getState();
    const trust = this.biochem.chemicals.get("trust").level;
    const stress = this.biochem.chemicals.get("cortisol").level;
    const curiosity = this.biochem.chemicals.get("curiosity_trait").level;
    let acceptChance = 0.5 + trust * 0.3 + curiosity * 0.2 - stress * 0.3;
    acceptChance = Math.max(0.1, Math.min(0.95, acceptChance));
    const accepted = Math.random() < acceptChance;
    let result;
    if (accepted) {
      const trinket = this.collection.receiveGift(content, giver, mood, chemState);
      if (!trinket) {
        result = { type: "gift_response", accepted: false, message: `${this.name} already has one of those. Looks at you like you should have known.`, mood };
      } else {
        this.biochem.applyStimulus("receive_gift");
        this.totalInteractions++;
        this.lastInteractionTime = Date.now() / 1e3;
        if (trust > 0.6) {
          result = { type: "gift_response", accepted: true, trinket: content, message: `${this.name} takes "${content}" carefully and tucks it into the nest. Looks at you. Looks away. That was a thank you.`, mood: this.biochem.getMoodSummary() };
        } else if (trust > 0.3) {
          result = { type: "gift_response", accepted: true, trinket: content, message: `${this.name} eyes "${content}" for a long moment, then snatches it and retreats to the nest. Acceptable.`, mood: this.biochem.getMoodSummary() };
        } else {
          result = { type: "gift_response", accepted: true, trinket: content, message: `${this.name} grabs "${content}" and retreats to the highest perch. It's mine now. Don't expect gratitude.`, mood: this.biochem.getMoodSummary() };
        }
      }
    } else {
      this.biochem.applyStimulus("gift_declined");
      this.totalInteractions++;
      this.lastInteractionTime = Date.now() / 1e3;
      if (stress > 0.6) {
        result = { type: "gift_response", accepted: false, message: `${this.name} flinches away from "${content}". Not now.`, mood: this.biochem.getMoodSummary() };
      } else {
        result = { type: "gift_response", accepted: false, message: `${this.name} inspects "${content}" and pushes it back toward you. Not shiny enough.`, mood: this.biochem.getMoodSummary() };
      }
    }
    await this.saveState();
    return result;
  }
  async proposeTrade(offered) {
    await this.loadState();
    const mood = this.biochem.getMoodSummary();
    const chemState = this.biochem.getState();
    const trust = this.biochem.chemicals.get("trust").level;
    const stress = this.biochem.chemicals.get("cortisol").level;
    const curiosity = this.biochem.chemicals.get("curiosity_trait").level;
    const hisOffering = this.collection.pickTradeOffering();
    if (!hisOffering) {
      return { type: "trade_response", accepted: false, message: `${this.name} has nothing to trade. The nest is empty.`, mood };
    }
    const accepted = this.collection.evaluateTrade(offered, hisOffering, trust, curiosity, stress);
    if (accepted) {
      this.collection.executeTrade(offered, hisOffering, mood, chemState);
      this.biochem.applyStimulus("receive_gift");
      const dopamine = this.biochem.chemicals.get("dopamine");
      dopamine.level = Math.min(1, dopamine.level + 0.1);
      this.totalInteractions++;
      this.lastInteractionTime = Date.now() / 1e3;
      let msg;
      if (hisOffering.treasured) {
        msg = `${this.name} stares at "${hisOffering.content}" for a long moment. Then at "${offered}". Slowly pushes "${hisOffering.content}" toward you and takes "${offered}" with both feet. That cost something.`;
      } else {
        msg = `${this.name} drops "${hisOffering.content}" and grabs "${offered}" in the same motion. Upgrade.`;
      }
      await this.saveState();
      return { type: "trade_response", accepted: true, youGet: hisOffering.content, petGets: offered, wasTreasured: hisOffering.treasured, message: msg, mood: this.biochem.getMoodSummary() };
    } else {
      this.biochem.chemicals.get("wariness").level = Math.min(1, this.biochem.chemicals.get("wariness").level + 0.01);
      this.totalInteractions++;
      this.lastInteractionTime = Date.now() / 1e3;
      await this.saveState();
      return { type: "trade_response", accepted: false, hisOffering: hisOffering.content, yourOffering: offered, message: `${this.name} considers "${offered}" against "${hisOffering.content}". Pushes yours back. Try again with something shinier.`, mood: this.biochem.getMoodSummary() };
    }
  }
  async playSpecific(playType = "chase") {
    await this.loadState();
    if (this.isSleeping) {
      this.isSleeping = false;
      const adrenaline = this.biochem.chemicals.get("adrenaline");
      adrenaline.level = Math.min(1, adrenaline.level + 0.1);
    }
    const preState = this.wellbeingScore();
    const playEffects = {
      chase: {
        chems: [["dopamine", 0.25], ["boredom", -0.35], ["loneliness", -0.15], ["glucose", -0.08], ["fatigue", 0.08], ["adrenaline", 0.1]],
        highTrust: [`${this.name} LAUNCHES off the bookshelf. You're it.`, `${this.name} zigzags across the room at maximum velocity. Feathers everywhere.`, `${this.name} lets you almost catch it, then dodges. Smug.`],
        lowTrust: [`${this.name} darts away. Was that play or escape? Even it isn't sure.`, `${this.name} keeps distance but keeps looking back. Daring you.`]
      },
      puzzle: {
        chems: [["dopamine", 0.15], ["curiosity_trait", 0.03], ["boredom", -0.4], ["glucose", -0.03], ["serotonin", 0.05]],
        highTrust: [`${this.name} studies the puzzle, head tilting. Solves it. Looks disappointed it's over.`, `${this.name} picks at the problem, finds the pattern. Satisfied click.`],
        lowTrust: [`${this.name} watches from a distance. Solves it mentally but won't participate.`, `${this.name} interacts only when you look away.`]
      },
      tug: {
        chems: [["dopamine", 0.2], ["boredom", -0.3], ["loneliness", -0.2], ["oxytocin", 0.1], ["trust", 4e-3], ["fatigue", 0.06], ["glucose", -0.05]],
        highTrust: [`${this.name} grabs one end and PULLS. Serious competition.`, `${this.name} lets go suddenly. You stumble. It cackles.`],
        lowTrust: [`${this.name} grabs cautiously. Tugs once. Lets go. Tests you.`]
      },
      hide: {
        chems: [["dopamine", 0.15], ["curiosity_trait", 0.02], ["boredom", -0.3], ["loneliness", -0.1], ["serotonin", 0.05], ["wariness", -0.01]],
        highTrust: [`${this.name} vanishes behind the books. Found by the smugness radiating from the shelf.`, `${this.name} was on your head.`],
        lowTrust: [`${this.name} hides, keeps one eye visible. Wants to be found. Won't admit it.`]
      },
      wrestle: {
        chems: [["dopamine", 0.25], ["adrenaline", 0.15], ["boredom", -0.35], ["loneliness", -0.2], ["oxytocin", 0.08], ["trust", 5e-3], ["fatigue", 0.1], ["glucose", -0.08]],
        highTrust: [`${this.name} pins your finger under one foot. Victorious. Tiny.`, `${this.name} grapples with your hand, bites, then grooms the same spot.`],
        lowTrust: [`${this.name} mock-strikes and retreats. Testing boundaries. Not angry \u2014 playing rough.`]
      }
    };
    const play = playEffects[playType] ?? playEffects.chase;
    for (const [chemName, amount] of play.chems) {
      const chem = this.biochem.chemicals.get(chemName);
      if (chem) chem.level = Math.max(0, Math.min(1, chem.level + amount));
    }
    const trust = this.biochem.chemicals.get("trust").level;
    const msgs = trust > 0.4 ? play.highTrust : play.lowTrust;
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    const [action] = this.brain.decide(this.biochem.getState(), "play");
    this.brain.learn(this.wellbeingScore() - preState);
    this.totalInteractions++;
    this.lastInteractionTime = Date.now() / 1e3;
    await this.saveState();
    return { type: "play", playType, message: msg, mood: this.biochem.getMoodSummary(), stimulus: `play_${playType}` };
  }
  async getStatus() {
    await this.loadState();
    const ageHours = (Date.now() / 1e3 - this.birthTime) / 3600;
    const minutesSince = (Date.now() / 1e3 - this.lastInteractionTime) / 60;
    return {
      name: this.name,
      ageHours: Math.round(ageHours * 10) / 10,
      mood: this.biochem.getMoodSummary(),
      isSleeping: this.isSleeping,
      currentAction: this.currentAction,
      totalInteractions: this.totalInteractions,
      minutesSinceInteraction: Math.round(minutesSince * 10) / 10,
      drives: this.biochem.getDriveState(),
      chemistry: this.biochem.getState(),
      collectionSize: this.collection.trinkets.length,
      nest: this.collection.nestDescription(),
      totalCollected: this.collection.totalCollected,
      totalGifted: this.collection.totalGifted,
      totalAccepted: this.collection.totalAccepted,
      totalDeclined: this.collection.totalDeclined,
      treasuredCount: this.collection.trinkets.filter((t) => t.treasured).length
    };
  }
  async getCollection() {
    await this.loadState();
    return this.collection.toJSON();
  }
  // --- Internal ---
  executeAction(action) {
    const event = { type: "action", action, time: Date.now() / 1e3 };
    switch (action) {
      case "approach":
        event.message = this.approachMessage();
        break;
      case "explore":
        event.message = this.exploreMessage();
        break;
      case "collect": {
        const mood = this.biochem.getMoodSummary();
        const chemState = this.biochem.getState();
        const trinket = this.collection.doCollect(mood, chemState);
        if (trinket) {
          this.biochem.chemicals.get("dopamine").level = Math.min(1, this.biochem.chemicals.get("dopamine").level + 0.08);
          event.message = `${this.name} found something: "${trinket.content}"`;
          event.trinket = trinket.content;
        } else {
          event.message = `${this.name} searches but nothing catches the eye.`;
        }
        break;
      }
      case "gift": {
        const trinket = this.collection.pickGift();
        if (trinket) {
          event.message = `${this.name} drops something at your feet and stares: "${trinket.content}"`;
          event.trinket = trinket.content;
          event.isGift = true;
        } else {
          event.message = `${this.name} looks at you like it wants to give you something, but has nothing.`;
          event.action = "stare";
        }
        break;
      }
      case "preen":
        this.biochem.chemicals.get("serotonin").level = Math.min(1, this.biochem.chemicals.get("serotonin").level + 0.05);
        event.message = this.preenMessage();
        break;
      case "sleep":
        this.isSleeping = true;
        event.message = `${this.name} tucks beak under wing and sleeps.`;
        event.type = "sleep";
        break;
      case "caw":
        event.message = this.cawMessage();
        break;
      case "ignore":
        event.message = this.ignoreMessage();
        break;
    }
    this.currentAction = action;
    return event;
  }
  wellbeingScore() {
    const c = /* @__PURE__ */ __name((n) => this.biochem.chemicals.get(n)?.level ?? 0, "c");
    return c("serotonin") * 2 + c("dopamine") * 1.5 + c("oxytocin") * 1.5 + c("glucose") - c("cortisol") * 2 - c("hunger") * 1.5 - c("loneliness") - c("fatigue") * 0.8;
  }
  approachMessage() {
    const trust = this.biochem.chemicals.get("trust").level;
    if (trust > 0.6) return pickRandom2([`${this.name} hops closer, head tilted.`, `${this.name} lands on your shoulder without asking.`, `${this.name} presses against your hand.`]);
    if (trust > 0.3) return pickRandom2([`${this.name} takes a few cautious steps closer.`, `${this.name} watches from a shorter distance than before.`]);
    return pickRandom2([`${this.name} glances your way but doesn't move.`, `${this.name} turns one eye toward you. Evaluating.`]);
  }
  exploreMessage() {
    return pickRandom2([
      `${this.name} investigates a shadow in the corner.`,
      `${this.name} pecks at something on the ground.`,
      `${this.name} cocks its head at a sound only it can hear.`,
      `${this.name} hops along the bookshelf, examining spines.`,
      `${this.name} stares intently at nothing for an uncomfortable amount of time.`
    ]);
  }
  preenMessage() {
    return pickRandom2([
      `${this.name} smooths its feathers methodically.`,
      `${this.name} settles into a comfortable spot and fluffs up.`,
      `${this.name} arranges wing feathers with precise attention.`
    ]);
  }
  cawMessage() {
    const hunger = this.biochem.chemicals.get("hunger").level;
    const loneliness = this.biochem.chemicals.get("loneliness").level;
    if (hunger > 0.6) return pickRandom2([`${this.name} caws sharply. Hungry.`, `${this.name} pecks at the ground pointedly. Feed me.`]);
    if (loneliness > 0.5) return pickRandom2([`${this.name} caws once, softly. Hey.`, `${this.name} makes a low rattling sound. Attention, please.`]);
    return pickRandom2([`${this.name} caws. No particular reason.`, `${this.name} announces its existence to the room.`]);
  }
  ignoreMessage() {
    return pickRandom2([
      `${this.name} is very busy right now. With what? None of your business.`,
      `${this.name} pretends you don't exist. Unconvincingly.`,
      `${this.name} is ignoring you. It wants you to notice it ignoring you.`
    ]);
  }
  async saveState() {
    const state = {
      name: this.name,
      birthTime: this.birthTime,
      totalInteractions: this.totalInteractions,
      lastInteractionTime: this.lastInteractionTime,
      lastTickTime: Date.now() / 1e3,
      isSleeping: this.isSleeping,
      currentAction: this.currentAction,
      chemistry: this.biochem.getState(),
      brainWeights: this.brain.getWeights(),
      collection: this.collection.toJSON(),
      totalCollected: this.collection.totalCollected,
      totalGifted: this.collection.totalGifted,
      totalAccepted: this.collection.totalAccepted,
      totalDeclined: this.collection.totalDeclined,
      preferenceWeights: this.collection.preferenceWeights,
      ageTicks: this.biochem.ageTicks,
      actionHistory: this.actionHistory.slice(-20),
      savedAt: Date.now() / 1e3
    };
    this.ctx.storage.sql.exec("INSERT OR REPLACE INTO pet (key, value) VALUES ('state', ?)", JSON.stringify(state));
  }
  async loadState() {
    if (this.initialized) return;
    const rows = this.ctx.storage.sql.exec("SELECT value FROM pet WHERE key = 'state'").toArray();
    if (rows.length === 0) {
      this.initialized = true;
      return;
    }
    const state = JSON.parse(rows[0].value);
    this.name = state.name;
    this.birthTime = state.birthTime;
    this.totalInteractions = state.totalInteractions;
    this.lastInteractionTime = state.lastInteractionTime;
    this.isSleeping = state.isSleeping;
    this.currentAction = state.currentAction;
    this.biochem.loadState(state.chemistry);
    this.brain.loadWeights(state.brainWeights);
    this.collection = Collection.fromJSON(state.collection);
    this.collection.totalCollected = state.totalCollected;
    this.collection.totalGifted = state.totalGifted;
    this.collection.totalAccepted = state.totalAccepted;
    this.collection.totalDeclined = state.totalDeclined;
    this.collection.preferenceWeights = state.preferenceWeights;
    this.biochem.ageTicks = state.ageTicks;
    this.actionHistory = state.actionHistory ?? [];
    this.initialized = true;
    const elapsed = Date.now() / 1e3 - state.savedAt;
    const elapsedTicks = Math.min(Math.floor(elapsed / 60), 120);
    if (elapsedTicks > 0 && !this.isSleeping) {
      const hour = (/* @__PURE__ */ new Date()).getUTCHours() + (/* @__PURE__ */ new Date()).getUTCMinutes() / 60;
      for (let i = 0; i < elapsedTicks; i++) {
        this.biochem.tick(1, hour);
        this.collection.decaySparkle();
        this.collection.checkTreasured();
      }
    }
  }
  async alarm() {
    await this.tick(1);
    await this.ctx.storage.setAlarm(Date.now() + 5 * 60 * 1e3);
  }
};
function pickRandom2(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
__name(pickRandom2, "pickRandom");

// src/worker.ts
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}
__name(corsHeaders, "corsHeaders");
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() }
  });
}
__name(json, "json");
function errorResponse(message, status) {
  return json({ error: message }, status);
}
__name(errorResponse, "errorResponse");
function checkAuth(request, env2) {
  if (!env2.SHARED_SECRET) return true;
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return false;
  return authHeader === `Bearer ${env2.SHARED_SECRET}`;
}
__name(checkAuth, "checkAuth");
function getPetStub(env2, petId) {
  const id = env2.PET.idFromName(petId);
  return env2.PET.get(id);
}
__name(getPetStub, "getPetStub");
var worker_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    const { pathname } = url;
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }
    if (pathname === "/health") {
      return json({ status: "ok", service: "corvid-cloud" });
    }
    if (!checkAuth(request, env2)) {
      return errorResponse("Unauthorized", 401);
    }
    const initMatch = pathname.match(/^\/pet\/([^/]+)\/init$/);
    if (initMatch && request.method === "POST") {
      const petId = initMatch[1];
      const body = await request.json();
      const stub = getPetStub(env2, petId);
      const result = await stub.initialize(body.name ?? "unnamed", body.speciesId);
      return json(result);
    }
    const statusMatch = pathname.match(/^\/pet\/([^/]+)\/status$/);
    if (statusMatch && request.method === "GET") {
      const petId = statusMatch[1];
      const stub = getPetStub(env2, petId);
      const status = await stub.getStatus();
      return json(status);
    }
    const interactMatch = pathname.match(/^\/pet\/([^/]+)\/interact$/);
    if (interactMatch && request.method === "POST") {
      const petId = interactMatch[1];
      const body = await request.json();
      if (!body.action) return errorResponse("Missing 'action' field", 400);
      const stub = getPetStub(env2, petId);
      const result = await stub.interact(body.action);
      return json(result);
    }
    const playMatch = pathname.match(/^\/pet\/([^/]+)\/play$/);
    if (playMatch && request.method === "POST") {
      const petId = playMatch[1];
      const body = await request.json();
      const stub = getPetStub(env2, petId);
      const result = await stub.playSpecific(body.type ?? "chase");
      return json(result);
    }
    const giftMatch = pathname.match(/^\/pet\/([^/]+)\/gift$/);
    if (giftMatch && request.method === "POST") {
      const petId = giftMatch[1];
      const body = await request.json();
      if (!body.content) return errorResponse("Missing 'content' field", 400);
      const stub = getPetStub(env2, petId);
      const result = await stub.receiveGift(body.content, body.giver ?? "human");
      return json(result);
    }
    const tradeMatch = pathname.match(/^\/pet\/([^/]+)\/trade$/);
    if (tradeMatch && request.method === "POST") {
      const petId = tradeMatch[1];
      const body = await request.json();
      if (!body.offering) return errorResponse("Missing 'offering' field", 400);
      const stub = getPetStub(env2, petId);
      const result = await stub.proposeTrade(body.offering);
      return json(result);
    }
    const collectionMatch = pathname.match(/^\/pet\/([^/]+)\/collection$/);
    if (collectionMatch && request.method === "GET") {
      const petId = collectionMatch[1];
      const stub = getPetStub(env2, petId);
      const items = await stub.getCollection();
      return json({ items, count: items.length });
    }
    const tickMatch = pathname.match(/^\/pet\/([^/]+)\/tick$/);
    if (tickMatch && request.method === "POST") {
      const petId = tickMatch[1];
      const stub = getPetStub(env2, petId);
      const events = await stub.tick(1);
      return json({ events });
    }
    return errorResponse("Not found", 404);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-NBiUm3/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-NBiUm3/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  Pet,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
