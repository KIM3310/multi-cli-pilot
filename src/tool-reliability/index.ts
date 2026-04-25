/**
 * Tool Reliability Module
 *
 * Improves tool-call success rates through robust JSON parsing,
 * schema coercion, and bounded retry with error context.
 *
 * @module tool-reliability
 */

export {
  BENCHMARK_CASES,
  type BenchmarkCase,
  formatBenchmarkTable,
  runToolBenchmark,
  type ToolBenchmarkResult,
  type ToolReliabilityCaseResult,
} from "./benchmark.js";
export {
  createToolReliabilityMiddleware,
  DEFAULT_TOOL_RELIABILITY_CONFIG,
  executeWithToolReliability,
  type ToolCallResult,
  type ToolReliabilityConfig,
} from "./middleware.js";
export {
  type ParseResult,
  parseToolCalls,
  type ToolCall,
  type ToolDefinition,
} from "./parser.js";
export {
  buildRetryPrompt,
  createMetricsTracker,
  DEFAULT_RETRY_CONFIG,
  type ModelCaller,
  parseWithRetry,
  type RetryAggregateMetrics,
  type RetryConfig,
  type RetryMetrics,
  type RetryResult,
} from "./retry.js";
export { type RJsonResult, rjsonParse } from "./rjson.js";
export {
  type CoerceResult,
  camelToSnake,
  coerceToSchema,
  snakeToCamel,
} from "./schema-coerce.js";
