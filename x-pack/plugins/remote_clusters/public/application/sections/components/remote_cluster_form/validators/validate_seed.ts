/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

import { isAddressValid, isPortValid } from './validate_address';

export function validateSeed(seed?: string): string[] {
  const errors: string[] = [];

  if (!seed) {
    return errors;
  }

  const isValid = isAddressValid(seed);

  if (!isValid) {
    errors.push(
      i18n.translate(
        'xpack.remoteClusters.remoteClusterForm.localSeedError.invalidCharactersMessage',
        {
          defaultMessage:
            'Seed node must use host:port format. Example: 127.0.0.1:9400, localhost:9400. ' +
            'Hosts can only consist of letters, numbers, and dashes.',
        }
      )
    );
  }

  if (!isPortValid(seed)) {
    errors.push(
      i18n.translate('xpack.remoteClusters.remoteClusterForm.localSeedError.invalidPortMessage', {
        defaultMessage: 'A port is required.',
      })
    );
  }

  return errors;
}
