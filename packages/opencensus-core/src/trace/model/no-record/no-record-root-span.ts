/**
 * Copyright 2019, OpenCensus Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as logger from '../../../common/console-logger';
import * as types from '../types';
import {NoRecordSpan} from './no-record-span';
import {NoRecordSpanBase} from './no-record-span-base';

/** Implementation for the RootSpan class that does not record trace events. */
export class NoRecordRootSpan extends NoRecordSpanBase implements
    types.RootSpan {
  /** A tracer object */
  private tracer: types.Tracer;
  /** Its trace ID. */
  private traceIdLocal: string;
  /** Its trace state. */
  private traceStateLocal?: types.TraceState;
  /** set isRootSpan = true */
  readonly isRootSpan = true;

  /**
   * Constructs a new NoRecordRootSpanImpl instance.
   * @param tracer A tracer object.
   * @param name The displayed name for the new span.
   * @param kind The kind of new span.
   * @param traceId The trace Id.
   * @param parentSpanId The id of the parent span, or empty if the new span is
   *     a root span.
   * @param traceState Optional traceState.
   */
  constructor(
      tracer: types.Tracer, name: string, kind: types.SpanKind, traceId: string,
      parentSpanId: string, traceState?: types.TraceState) {
    super();
    this.tracer = tracer;
    this.traceIdLocal = traceId;
    this.name = name;
    this.kind = kind;
    this.parentSpanId = parentSpanId;
    if (traceState) {
      this.traceStateLocal = traceState;
    }
    this.logger = this.tracer.logger || logger.logger();
  }

  /** No-op implementation of this method. */
  get spans(): types.Span[] {
    return [];
  }

  /** No-op implementation of this method. */
  get traceId(): string {
    return this.traceIdLocal;
  }

  /** No-op implementation of this method. */
  get traceState(): types.TraceState|undefined {
    return this.traceStateLocal;
  }

  /** No-op implementation of this method. */
  get numberOfChildren(): number {
    return 0;
  }

  /** No-op implementation of this method. */
  start() {
    super.start();
  }

  /** No-op implementation of this method. */
  end() {
    super.end();
  }

  /**
   * Starts a new no record child span in the no record root span.
   * @param nameOrOptions Span name string or SpanOptions object.
   * @param kind Span kind if not using SpanOptions object.
   */
  startChildSpan(
      nameOrOptions?: string|types.SpanOptions,
      kind?: types.SpanKind): types.Span {
    const noRecordChild = new NoRecordSpan();

    const spanName =
        typeof nameOrOptions === 'object' ? nameOrOptions.name : nameOrOptions;
    const spanKind =
        typeof nameOrOptions === 'object' ? nameOrOptions.kind : kind;
    if (spanName) {
      noRecordChild.name = spanName;
    }
    if (spanKind) {
      noRecordChild.kind = spanKind;
    }

    noRecordChild.start();
    return noRecordChild;
  }
}
