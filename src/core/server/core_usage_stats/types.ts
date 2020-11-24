/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @internal
 *
 * CoreUsageStats are collected over time while Kibana is running. This is related to CoreUsageData, which is a superset of this that also
 * includes point-in-time configuration information.
 * */
export interface CoreUsageStats {
  apiCalls?: {
    savedObjectsImport?: {
      total: number;
      kibanaRequest: {
        yes: number;
        no: number;
      };
      createNewCopiesEnabled: {
        yes: number;
        no: number;
      };
      overwriteEnabled: {
        yes: number;
        no: number;
      };
    };
    savedObjectsResolveImportErrors?: {
      total: number;
      kibanaRequest: {
        yes: number;
        no: number;
      };
      createNewCopiesEnabled: {
        yes: number;
        no: number;
      };
    };
    savedObjectsExport?: {
      total: number;
      kibanaRequest: {
        yes: number;
        no: number;
      };
      allTypesSelected: {
        yes: number;
        no: number;
      };
    };
  };
}
