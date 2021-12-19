import * as assert from "@eeue56/ts-assert";
import { Ok } from "@eeue56/ts-core/build/main/lib/result";
import {
    ArrowToken,
    AssignToken,
    BaseTypeToken,
    CloseBracketToken,
    CloseCurlyBracesToken,
    ColonToken,
    CommaToken,
    FunctionTypeToken,
    IdentifierToken,
    KeywordToken,
    LiteralToken,
    OpenBracketToken,
    OpenCurlyBracesToken,
    OperatorToken,
    PipeToken,
    StringToken,
    tokenize,
    tokenizeType,
    tokensToString,
    WhitespaceToken,
} from "../tokens";

export function testString() {
    const str = `"hello"`;
    assert.deepStrictEqual(tokenize(str), [ StringToken(`"hello"`) ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testNestedString() {
    const str = `"\\"hello\\""`;
    assert.deepStrictEqual(tokenize(str), [ StringToken(`"\\"hello\\""`) ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testInt() {
    const str = `1`;
    assert.deepStrictEqual(tokenize(str), [ LiteralToken(`1`) ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testFloat() {
    const str = `3.14`;
    assert.deepStrictEqual(tokenize(str), [ LiteralToken(`3.14`) ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testArray() {
    const str = `[ 1, 2 ]`;
    assert.deepStrictEqual(tokenize(str), [ LiteralToken("[ 1, 2 ]") ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testNestedArray() {
    const str = `[ [ 1, 2 ], [ 3, 4 ] ]`;
    assert.deepStrictEqual(tokenize(str), [
        LiteralToken("[ [ 1, 2 ], [ 3, 4 ] ]"),
    ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testRange() {
    const str = `[ 1..2 ]`;
    assert.deepStrictEqual(tokenize(str), [ LiteralToken("[ 1..2 ]") ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testTrue() {
    const str = `true`;
    assert.deepStrictEqual(tokenize(str), [ LiteralToken("true") ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testFalse() {
    const str = `false`;
    assert.deepStrictEqual(tokenize(str), [ LiteralToken("false") ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testBrackets() {
    const str = `( x + y ) + z`;
    assert.deepStrictEqual(tokenize(str), [
        OpenBracketToken(),
        WhitespaceToken(" "),
        IdentifierToken("x"),
        WhitespaceToken(" "),
        OperatorToken("+"),
        WhitespaceToken(" "),
        IdentifierToken("y"),
        WhitespaceToken(" "),
        CloseBracketToken(),
        WhitespaceToken(" "),
        OperatorToken("+"),
        WhitespaceToken(" "),
        IdentifierToken("z"),
    ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testOperators() {
    [
        "<",
        "<=",
        ">",
        ">=",
        "==",
        "!=",
        "-",
        "+",
        "*",
        "/",
        "|>",
        "<|",
        "&&",
        "||",
    ].forEach((op) => {
        const str = `x ${op} y`;
        assert.deepStrictEqual(tokenize(str), [
            IdentifierToken("x"),
            WhitespaceToken(" "),
            OperatorToken(op),
            WhitespaceToken(" "),
            IdentifierToken("y"),
        ]);
        assert.deepStrictEqual(tokensToString(tokenize(str)), str);
    });
}

export function testIf() {
    const str = `
if true == true then
    x
else
    y
            `.trim();
    assert.deepStrictEqual(tokenize(str), [
        KeywordToken("if"),
        WhitespaceToken(" "),
        LiteralToken("true"),
        WhitespaceToken(" "),
        OperatorToken("=="),
        WhitespaceToken(" "),
        LiteralToken("true"),
        WhitespaceToken(" "),
        KeywordToken("then"),
        WhitespaceToken("\n    "),
        IdentifierToken("x"),
        WhitespaceToken("\n"),
        KeywordToken("else"),
        WhitespaceToken("\n    "),
        IdentifierToken("y"),
    ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testFunction() {
    const str = `
isTrue: boolean -> boolean
isTrue x =
    if x == x then
        true
    else
        false
`.trim();

    assert.deepStrictEqual(tokenize(str), [
        IdentifierToken("isTrue"),
        ColonToken(),
        WhitespaceToken(" "),
        IdentifierToken("boolean"),
        WhitespaceToken(" "),
        ArrowToken(),
        WhitespaceToken(" "),
        IdentifierToken("boolean"),
        WhitespaceToken("\n"),
        IdentifierToken("isTrue"),
        WhitespaceToken(" "),
        IdentifierToken("x"),
        WhitespaceToken(" "),
        AssignToken(),
        WhitespaceToken("\n    "),
        KeywordToken("if"),
        WhitespaceToken(" "),
        IdentifierToken("x"),
        WhitespaceToken(" "),
        OperatorToken("=="),
        WhitespaceToken(" "),
        IdentifierToken("x"),
        WhitespaceToken(" "),
        KeywordToken("then"),
        WhitespaceToken("\n        "),
        LiteralToken("true"),
        WhitespaceToken("\n    "),
        KeywordToken("else"),
        WhitespaceToken("\n        "),
        LiteralToken("false"),
    ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testUnionType() {
    const str = `
type Result a e =
    Ok { value: a }
    | Err { error: e }
`.trim();

    assert.deepStrictEqual(tokenize(str), [
        KeywordToken("type"),
        WhitespaceToken(" "),
        IdentifierToken("Result"),
        WhitespaceToken(" "),
        IdentifierToken("a"),
        WhitespaceToken(" "),
        IdentifierToken("e"),
        WhitespaceToken(" "),
        AssignToken(),
        WhitespaceToken("\n    "),
        IdentifierToken("Ok"),
        WhitespaceToken(" "),
        OpenCurlyBracesToken(),
        WhitespaceToken(" "),
        IdentifierToken("value"),
        ColonToken(),
        WhitespaceToken(" "),
        IdentifierToken("a"),
        WhitespaceToken(" "),
        CloseCurlyBracesToken(),
        WhitespaceToken("\n    "),
        PipeToken(),
        WhitespaceToken(" "),
        IdentifierToken("Err"),
        WhitespaceToken(" "),
        OpenCurlyBracesToken(),
        WhitespaceToken(" "),
        IdentifierToken("error"),
        ColonToken(),
        WhitespaceToken(" "),
        IdentifierToken("e"),
        WhitespaceToken(" "),
        CloseCurlyBracesToken(),
    ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testTypeAlias() {
    const str = `
type alias Person = {
    name: string,
    age: number
}
`.trim();

    assert.deepStrictEqual(tokenize(str), [
        KeywordToken("type"),
        WhitespaceToken(" "),
        KeywordToken("alias"),
        WhitespaceToken(" "),
        IdentifierToken("Person"),
        WhitespaceToken(" "),
        AssignToken(),
        WhitespaceToken(" "),
        OpenCurlyBracesToken(),
        WhitespaceToken("\n    "),
        IdentifierToken("name"),
        ColonToken(),
        WhitespaceToken(" "),
        IdentifierToken("string"),
        CommaToken(),
        WhitespaceToken("\n    "),
        IdentifierToken("age"),
        ColonToken(),
        WhitespaceToken(" "),
        IdentifierToken("number"),
        WhitespaceToken("\n"),
        CloseCurlyBracesToken(),
    ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testImport() {
    const str = `
import fs
`.trim();

    assert.deepStrictEqual(tokenize(str), [
        KeywordToken("import"),
        WhitespaceToken(" "),
        IdentifierToken("fs"),
    ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testExport() {
    const str = `
exposing (isTrue, isFalse)
`.trim();

    assert.deepStrictEqual(tokenize(str), [
        KeywordToken("exposing"),
        WhitespaceToken(" "),
        OpenBracketToken(),
        IdentifierToken("isTrue"),
        CommaToken(),
        WhitespaceToken(" "),
        IdentifierToken("isFalse"),
        CloseBracketToken(),
    ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testConst() {
    const str = `
names: List (List string)
names =
    [ ["noah"], ["david"] ]
`.trim();

    assert.deepStrictEqual(tokenize(str), [
        IdentifierToken("names"),
        ColonToken(),
        WhitespaceToken(" "),
        IdentifierToken("List"),
        WhitespaceToken(" "),
        OpenBracketToken(),
        IdentifierToken("List"),
        WhitespaceToken(" "),
        IdentifierToken("string"),
        CloseBracketToken(),
        WhitespaceToken("\n"),
        IdentifierToken("names"),
        WhitespaceToken(" "),
        AssignToken(),
        WhitespaceToken("\n    "),
        LiteralToken(`[ ["noah"], ["david"] ]`),
    ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);
}

export function testFunctionArg() {
    const str = `
map: (a -> b) -> a -> b
map fn x =
    fn x
`.trim();

    assert.deepStrictEqual(tokenize(str), [
        IdentifierToken("map"),
        ColonToken(),
        WhitespaceToken(" "),
        OpenBracketToken(),
        IdentifierToken("a"),
        WhitespaceToken(" "),
        ArrowToken(),
        WhitespaceToken(" "),
        IdentifierToken("b"),
        CloseBracketToken(),
        WhitespaceToken(" "),
        ArrowToken(),
        WhitespaceToken(" "),
        IdentifierToken("a"),
        WhitespaceToken(" "),
        ArrowToken(),
        WhitespaceToken(" "),
        IdentifierToken("b"),
        WhitespaceToken("\n"),
        IdentifierToken("map"),
        WhitespaceToken(" "),
        IdentifierToken("fn"),
        WhitespaceToken(" "),
        IdentifierToken("x"),
        WhitespaceToken(" "),
        AssignToken(),
        WhitespaceToken("\n    "),
        IdentifierToken("fn"),
        WhitespaceToken(" "),
        IdentifierToken("x"),
    ]);
    assert.deepStrictEqual(tokensToString(tokenize(str)), str);

    const typeParts = tokenize(str).slice(3, 18);
    assert.deepStrictEqual(
        tokenizeType(typeParts),
        Ok([
            FunctionTypeToken([
                IdentifierToken("a"),
                ArrowToken(),
                IdentifierToken("b"),
            ]),
            BaseTypeToken([ IdentifierToken("a") ]),
            BaseTypeToken([ IdentifierToken("b") ]),
        ])
    );
}
