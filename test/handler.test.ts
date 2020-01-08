import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";
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