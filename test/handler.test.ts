'use strict';
const test               = require('tape');
const utils              = require('aws-lambda-test-utils')
const mockContextCreator = utils.mockContextCreator;
import { wikiPageHandler } from "../src/handler";

test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
/*
test("Missing page_tag query param", () => {
  const event = {
    queryStringParameters: {
      language: "en"
    }
  };
  

  expect(wikiPageHandler(event, context, {}).to);
});
*/