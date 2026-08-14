// @ts-self-types="./parser.d.ts"

import factory, {jsonlParser} from '@yahyeapps/stream-chain/node/jsonl/parser.js';

const parser = options => factory(options);

parser.parser = parser;
parser.jsonlParser = jsonlParser;
parser.asStream = factory.asStream;
parser.asWebStream = factory.asWebStream;

export default parser;
export {parser, jsonlParser};
