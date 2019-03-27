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

import React from 'react';

import { EuiFlyout } from '@elastic/eui';
import ReactDOM from 'react-dom';
import { Observable, Subject } from 'rxjs';
import { I18nContext } from 'ui/i18n';

/**
 * A FlyoutRef references an opened flyout panel. It offers
 * methods to close the flyout panel again. If you open a flyout panel you should make
 * sure you call {@link FlyoutRef#close} when it should be closed.
 * Since a flyout could also be closed without calling this method (e.g. because
 * the user closes it), you must subscribe to the `onClose` observable.
 * It will be emitted whenever the flyout will be closed and you should throw
 * away your reference to this instance when the observable completes.
 */
export class FlyoutRef {
  private onClose$: Subject<void> = new Subject<void>();

  /**
   * Closes the referenced flyout if it's still open by emiting and completing
   * the `onClose()` Observable.
   * If the flyout had already been closed this method does nothing.
   */
  public close(): void {
    if (!this.onClose$.complete) {
      this.onClose$.next();
      this.onClose$.complete();
    }
  }

  public onClose(): Observable<void> {
    return this.onClose$.asObservable();
  }
}

// tslint:disable-next-line: max-classes-per-file
export class FlyoutService {
  private activeFlyout: FlyoutRef | null = null;
  private CONTAINER_ID = 'flyout-container';

  public setup(): FlyoutSetup {
    return { openFlyout: this.openFlyout.bind(this) };
  }
  public stop() {
    return { closeFlyout: this.unmountFlyout.bind(this) };
  }

  public unmountFlyout(): void {
    const container = document.getElementById(this.CONTAINER_ID);
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
    }
  }

  private getOrCreateContainerElement() {
    let container = document.getElementById(this.CONTAINER_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = this.CONTAINER_ID;
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Opens a flyout panel with the given component inside. You can use
   * {@link FlyoutRef#close} on the return value to close the flyout.
   *
   * @param flyoutChildren - Mounts the children inside a fly out panel
   * @return {FlyoutRef} A reference to the opened flyout panel.
   */
  private openFlyout(
    flyoutChildren: React.ReactNode,
    flyoutProps: {
      closeButtonAriaLabel?: string;
      'data-test-subj'?: string;
    } = {}
  ): FlyoutRef {
    // If there is an active flyout close it before opening a new one.
    if (this.activeFlyout) {
      this.activeFlyout.close();
    }
    const container = this.getOrCreateContainerElement();
    const flyout = (this.activeFlyout = new FlyoutRef());

    // If an active flyout closes
    flyout.onClose().subscribe({
      complete: () => {
        if (flyout === this.activeFlyout) {
          this.activeFlyout = null;
          this.unmountFlyout();
        }
      },
    });

    ReactDOM.render(
      <I18nContext>
        <EuiFlyout {...flyoutProps} onClose={flyout.close}>
          {flyoutChildren}
        </EuiFlyout>
      </I18nContext>,
      container
    );

    return flyout;
  }
}

// tslint:disable-next-line: interface-over-type-literal
export type FlyoutSetup = {
  openFlyout: (
    flyoutChildren: React.ReactNode,
    flyoutProps: {
      closeButtonAriaLabel?: string;
      'data-test-subj'?: string;
    }
  ) => FlyoutRef;
};
