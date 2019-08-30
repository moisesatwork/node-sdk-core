/**
 * Copyright 2019 IBM Corp. All Rights Reserved.
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

import { OutgoingHttpHeaders } from 'http';
import { getMissingParams } from '../../lib/helper';
import { checkCredentials } from '../utils/helpers'; // just using '../utils' here leads to a test failure. need to open an issue against typescript
import { AuthenticateCallback, AuthenticateOptions, AuthenticatorInterface } from './authenticator-interface';

export class Authenticator implements AuthenticatorInterface {
  /**
   * Base Authenticator Class
   *
   * Provides the Base Authenticator class for others to extend.
   */
  constructor() {
    if (!(this instanceof Authenticator)) {
      throw new Error(
        'the "new" keyword is required to create authenticator instances'
      );
    }
  }

  public authenticate(options: AuthenticateOptions, callback: AuthenticateCallback): void {
    throw new Error('Should be implemented by subclass!');
  }

  protected validate(options: any, requiredOptions: string[]): void {
    // check for required params
    const missingParamsError = getMissingParams(options, requiredOptions);
    if (missingParamsError) {
      throw missingParamsError;
    }

    // check certain credentials for common user errors: username, password, and apikey
    // note: will only apply to certain authenticators
    const credsToCheck = ['username', 'password', 'apikey']
    const credentialProblems = checkCredentials(options, credsToCheck);
    if (credentialProblems) {
      throw new Error(credentialProblems);
    }
  }
}