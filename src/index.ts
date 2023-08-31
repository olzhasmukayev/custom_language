import Lexer from "./Lexer/Lexer";
import Parser from "./Parser/Parser";

const code = `
    nurali EQUALS 10;
    yalaman EQUALS 15;
    PRINT nurali PLUS yalaman;
    `;

const lexer = new Lexer(code);

lexer.lexAnalysis();

const parser = new Parser(lexer.tokenList);

const rootNode = parser.parseCode();

parser.run(rootNode);
