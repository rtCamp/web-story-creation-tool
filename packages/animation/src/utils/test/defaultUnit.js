/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { defaultUnit } from '../defaultUnit';

describe('defaultUnit(input, unit)', () => {
  it('appends the default unit if the input value ends in a digit', () => {
    const input = 123456;
    const unit = 'px';
    expect(defaultUnit(input, unit)).toBe(`${input}${unit}`);
  });

  it('doesnt append the default unit if the input value ends in a non-digit', () => {
    const input = '123456%';
    const unit = 'px';
    expect(defaultUnit(input, unit)).toStrictEqual(input);
  });
});
