const { describe, expect, test } = require('@jest/globals');

const {
    mapApiRunToRun
} = require('../run-snapshot');

const ArrayOfRuns = require('./__fixtures__/array-of-runs.json');

describe('transformers', () => {
    test('mapApiRunToRun', () => {
        const actual = ArrayOfRuns.map(mapApiRunToRun(123, 456));
        expect(actual).toMatchSnapshot();
    });
});