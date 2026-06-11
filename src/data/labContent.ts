export interface LabExperiment {
  id: string;
  num: string;
  title: string;
  folderName: string;
  cmd: string;
  lang: string;
  fileName: string;
  code: string;
  description: string;
}

export const cdLabData: LabExperiment[] = [
  {
    "id": "cd-q01",
    "num": "01",
    "title": "Design and implement a program that accepts an NFA (with \u03b5-transitions) and outputs its  equivalent DFA.",
    "folderName": "q01_nfa_to_dfa",
    "cmd": "cat nfadfa.cpp",
    "lang": "C++",
    "fileName": "nfadfa.cpp",
    "description": "Design and implement a program that accepts an NFA (with \u03b5-transitions) and outputs its  equivalent DFA.",
    "code": "/*\nfilename : nfadfa.cpp\ng++ nfadfa.cpp -o nfadfa\n./nfadfa\n*/\n#include <iostream>\n#include <set>\n#include <map>\n#include <queue>\n\nusing namespace std;\nmap<pair<int,char>, set<int>> trans;\nmap<int,set<int>> eclose;\nset<int> move(set<int> states, char sym) {\n    set<int> res;\n    for(int s : states)\n    {\n        for(int nxt : trans[{s,sym}])\n        res.insert(nxt);\n    }\n\n    return res;\n}\n\nset<int> closure(set<int> states) {\n    set<int> res;\n    for(int s : states) {\n        for(int x : eclose[s])\n        res.insert(x);\n    }\n\n    return res;\n}\n\nint main()\n{\n    int n,t;\n    cout<<\"States: \";\n    cin>>n;\n    cout<<\"Transitions: \";\n    cin>>t;\n    cout<<\"Enter (from symbol to)\\n\";\n    for(int i=0;i<t;i++)\n    {\n        int from,to;\n        char sym;\n        cin>>from>>sym>>to;\n        if(sym=='e')\n        {\n            eclose[from].insert(from);\n            eclose[from].insert(to);\n        }\n        else\n        trans[{from,sym}].insert(to);\n    }\n\n    for(int i=0;i<n;i++)\n    eclose[i].insert(i);\n\n    vector<char> alpha = {'a','b'};\n    map<set<int>,int> dfa;\n    queue<set<int>> q;\n    set<int> start=eclose[0];\n\n    dfa[start]=0;\n    q.push(start);\n\n    while(!q.empty())\n    {\n        set<int> cur=q.front();\n        q.pop();\n        cout<<\"D\"<<dfa[cur]<<\" : \";\n        for(char c:alpha)\n        {\n            set<int> nxt=closure(move(cur,c));\n            if(!dfa.count(nxt))\n            {\n                dfa[nxt]=dfa.size();\n                q.push(nxt);\n            }\n\n            cout<<c<<\"->D\"<<dfa[nxt]<<\" \";\n        }\n\n        cout<<endl;\n    }\n\n    return 0;}\n/* Input - output States: 3\nTransitions: 5\nEnter (from symbol to)\n0 e 1\n0 a 0\n1 b 2\n1 a 1\n2 b 2\nD0 : a->D0 b->D1\nD1 : a->D2 b->D1\nD2 : a->D2 b\u2192D2\n*/"
  },
  {
    "id": "cd-q02",
    "num": "02",
    "title": "Implement a LEX scanner to detect and count keywords, identifiers, and numeric constants in a C-like program.",
    "folderName": "q02_count_key",
    "cmd": "cat q02.l",
    "lang": "Lex",
    "fileName": "q02.l",
    "description": "Implement a LEX scanner to detect and count keywords, identifiers, and numeric constants in a C-like program.",
    "code": "/* lex countkey.lex\ngcc lex.yy.c\n./a.out */\n\n%{\n    #include <stdio.h>\n    int keywords = 0, identifiers = 0, numbers = 0;\n    %}\n\n%%\n\nint|float|char|if|else|while|return { printf(\"Keyword: %s\\n\", yytext); keywords++; }\n[0-9]+ { printf(\"Number: %s\\n\", yytext); numbers++; }\n[a-zA-Z_][a-zA-Z0-9_]* { printf(\"Identifier: %s\\n\", yytext); identifiers++; }\n[ \\t\\n]+ ;\n. ;\n\n%%\n\nint main() {\n    yylex();\n    printf(\"\\nKeywords = %d\\n\", keywords);\n    printf(\"Identifiers = %d\\n\", identifiers);\n    printf(\"Numbers = %d\\n\", numbers);\n    return 0;\n}\n\nint yywrap() { return 1; }"
  },
  {
    "id": "cd-q03",
    "num": "03",
    "title": "Construct an NFA from the regular expression (a|b)abb and convert it into an equivalent DFA",
    "folderName": "q03_nfa_from_(a|b)abb",
    "cmd": "cat q03.cpp",
    "lang": "C++",
    "fileName": "q03.cpp",
    "description": "Construct an NFA from the regular expression (a|b)abb and convert it into an equivalent DFA",
    "code": "#include <iostream>\nusing namespace std;\nint main()\n{\n    string s;\n    cin >> s;\n    int state = 0;\n    for(char c : s) {\n        if(state == 0 &amp;&amp; (c == 'a' || c == 'b'))\n        state = 1;\n        else if(state == 1 &amp;&amp; c == 'a')\n        state = 2;\n        else if(state == 2 &amp;&amp; c == 'b')\n        state = 3;\n        else if(state == 3 &amp;&amp; c == 'b')\n        state = 4;\n        else {\n            state = -1;\n            break;\n        }\n    }\n    if(state == 4)\n    cout << \"Accepted\";\n    else\n    cout << \"Rejected\";\n}"
  },
  {
    "id": "cd-q04",
    "num": "04",
    "title": "Write a YACC program to parse arithmetic expressions with proper operator precedence and associativity.",
    "folderName": "q04_YACC_parser",
    "cmd": "cat q04.l",
    "lang": "Lex",
    "fileName": "q04.l",
    "description": "Write a YACC program to parse arithmetic expressions with proper operator precedence and associativity.",
    "code": "/*\nyacc -d expr.y\nlex expr.l\ngcc y.tab.c lex.yy.c -ll -ly                                 or                          gcc y.tab.c lex.yy.c -lfl\n./a.out\n*/\n\n// expr.l\n%{\n    #include \"y.tab.h\"\n    #include <stdlib.h>\n    %}\n\n%%\n\n[0-9]+      { yylval = atoi(yytext); return NUM; }\n[ \\t]          ;\n\\n            return '\\n';\n.              return yytext[0];\n\n%%\n\nint yywrap\n() {\n    return 1;\n}\n\n// expr.y\n%{\n    #include <stdio.h>\n    #include <stdlib.h>\n\n    void yyerror(char *s);\n    int yylex();\n    %}\n\n%token NUM\n\n%left '+' '-'\n%left '*' '/'\n%right '^'\n\n%%\n\ninput:\ninput line\n|\n;\n\nline:\nexpr '\\n' { printf(\"Valid Expression\\n\"); }\n;\n\n\nexpr:\nexpr '+' expr\n| expr '-' expr\n| expr '*' expr\n| expr '/' expr\n| expr '^' expr\n| '(' expr ')'\n| NUM\n;\n\n%%\n\nvoid yyerror(char *s)\n{\n    printf(\"Invalid Expression\\n\");\n}\n\nint main()\n{\n    printf(\"Enter Arithmetic Expression:\\n\");\n    yyparse();\n    return 0;\n}\n/* Enter Arithmetic Expression:\n2+3\nValid Expression\n*/"
  },
  {
    "id": "cd-q05",
    "num": "05",
    "title": "Write a program to construct the LL(1) parsing table for a user-defined grammar and parse input strings",
    "folderName": "q05_LL(1)_parser",
    "cmd": "cat q05.cpp",
    "lang": "C++",
    "fileName": "q05.cpp",
    "description": "Write a program to construct the LL(1) parsing table for a user-defined grammar and parse input strings",
    "code": "/*\nS \u2192 aA\nA \u2192 b\n*/\n#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main()\n{\n    string input;\n    cout << \"Enter string (end with $): \";\n    cin >> input;\n\n    stack<char> st;\n    st.push('$');\n    st.push('S');\n\n    int i = 0;\n\n    while(!st.empty())\n    {\n        char top = st.top();\n        char cur = input[i];\n\n        if(top == cur)\n        {\n            st.pop();\n            i++;\n        }\n        else if(top == 'S' &amp;&amp; cur == 'a')\n        {\n            st.pop();\n            st.push('A');\n            st.push('a');\n        }\n        else if(top == 'A' &amp;&amp; cur == 'b')\n        {\n            st.pop();\n            st.push('b');\n        }\n        else\n        {\n            cout << \"Rejected\";\n            return 0;\n        }\n    }\n\n    if(input[i] == '\\0')\n    cout << \"Accepted\";\n    else\n    cout << \"Rejected\";\n\n    return 0; }"
  },
  {
    "id": "cd-q06",
    "num": "06",
    "title": "Write a LEX program to recognize and print tokens for arithmetic expressions involving +, \u2013, *, / and integers.",
    "folderName": "q06_tokens_for_arithm",
    "cmd": "cat q06.l",
    "lang": "Lex",
    "fileName": "q06.l",
    "description": "Write a LEX program to recognize and print tokens for arithmetic expressions involving +, \u2013, *, / and integers.",
    "code": "/* lex arith.l\ngcc lex.yy.c -o arith\n./arith */%{\n    #include <stdio.h>\n    %}\n\n%%\n\n[0-9]+          { printf(\"%s\\tINTEGER\\n\", yytext); }\n\n\"+\"             { printf(\"%s\\tPLUS OPERATOR\\n\", yytext); }\n\"-\"             { printf(\"%s\\tMINUS OPERATOR\\n\", yytext); }\n\"*\"             { printf(\"%s\\tMULTIPLY OPERATOR\\n\", yytext); }\n\"/\"             { printf(\"%s\\tDIVIDE OPERATOR\\n\", yytext); }\n\n\"(\"             { printf(\"%s\\tLEFT PARENTHESIS\\n\", yytext); }\n\")\"             { printf(\"%s\\tRIGHT PARENTHESIS\\n\", yytext); }\n\n[ \\t\\n]         { /* ignore spaces, tabs, newlines */ }\n\n.               { printf(\"%s\\tINVALID CHARACTER\\n\", yytext); }\n\n%%\n\nint main() {\n    printf(\"Enter arithmetic expression:\\n\");\n    yylex();\n    return 0;\n}\n\nint yywrap() {\n    return 1;\n}"
  },
  {
    "id": "cd-q07",
    "num": "07",
    "title": "For a given LL(1) grammar, compute the FIRST and FOLLOW sets and construct the  predictive parsing table.",
    "folderName": "q07_first_and_follow",
    "cmd": "cat q07.cpp",
    "lang": "C++",
    "fileName": "q07.cpp",
    "description": "For a given LL(1) grammar, compute the FIRST and FOLLOW sets and construct the  predictive parsing table.",
    "code": "#include <iostream>\n#include <cstring>\n#include <cctype>\n\nusing namespace std;\n\nchar production[10][10];\nchar first[10], follow[10];\n\nint countFirst = 0, countFollow = 0;\nint n;\n\nvoid findFirst(char, int, int);\nvoid findFollow(char);\nvoid followFirst(char, int, int);\n\nint main()\n{\n    int i, j;\n    char c;\n\n    cout << \"Enter number of productions: \";\n    cin >> n;\n\n    cout << \"Enter productions (Example: E=TR)\\n\";\n    for (i = 0; i < n; i++)\n    cin >> production[i];\n\n    cout << \"\\nFIRST Sets:\\n\";\n\n    for (i = 0; i < n; i++)\n    {\n        c = production[i][0];\n        countFirst = 0;\n\n        findFirst(c, 0, 0);\n\n        cout << \"FIRST(\" << c << \") = { \";\n            for (j = 0; j < countFirst; j++)\n            cout << first[j] << \" \";\n            cout << \"}\\n\";\n    }\n\n    cout << \"\\nFOLLOW Sets:\\n\";\n\n    for (i = 0; i < n; i++)\n    {\n        c = production[i][0];\n        countFollow = 0;\n\n        findFollow(c);\n\n        cout << \"FOLLOW(\" << c << \") = { \";\n            for (j = 0; j < countFollow; j++)\n            cout << follow[j] << \" \";\n            cout << \"}\\n\";\n    }\n\n    return 0;\n}\n\nvoid findFirst(char c, int q1, int q2)\n{\n    if (!isupper(c))\n    {\n        first[countFirst++] = c;\n        return;\n    }\n\n    for (int j = 0; j < n; j++)\n    {\n        if (production[j][0] == c)\n        {\n            if (production[j][2] == '#')\n            {\n                if (production[q1][q2] == '\\0')\n                first[countFirst++] = '#';\n                else\n                findFirst(production[q1][q2], q1, q2 + 1);\n            }\n            else if (!isupper(production[j][2]))\n            {\n                first[countFirst++] = production[j][2];\n            }\n            else\n            {\n                findFirst(production[j][2], j, 3);\n            }\n        }\n    }\n}\n\nvoid findFollow(char c)\n{\n    if (production[0][0] == c)\n    follow[countFollow++] = '$';\n\n    for (int i = 0; i < n; i++)\n    {\n        for (int j = 2; j < strlen(production[i]); j++)\n        {\n            if (production[i][j] == c)\n            {\n                if (production[i][j + 1] != '\\0')\n                followFirst(production[i][j + 1], i, j + 2);\n\n                if (production[i][j + 1] == '\\0' &amp;&amp;\n                c != production[i][0])\n                {\n                    findFollow(production[i][0]);\n                }\n            }\n        }\n    }\n}\n\nvoid followFirst(char c, int c1, int c2)\n{\n    if (!isupper(c))\n    {\n        follow[countFollow++] = c;\n    }\n    else\n    {\n        countFirst = 0;\n        findFirst(c, c1, c2);\n\n        for (int i = 0; i < countFirst; i++)\n        {\n            if (first[i] == '#')\n            {\n                if (production[c1][c2] == '\\0')\n                findFollow(production[c1][0]);\n                else\n                followFirst(production[c1][c2], c1, c2 + 1);\n            }\n            else\n            {\n                follow[countFollow++] = first[i];\n            }\n        }\n    }\n}\n/*\nProgram: FIRST and FOLLOW Set Computation\n\nCompilation:\ng++ firstfollow.cpp -o firstfollow\n\nExecution:\n./firstfollow\n\nSample Input:\n5\nE=TR\nR=+TR\nT=FY\nY=*FY\nF=i\n\n*/"
  },
  {
    "id": "cd-q08",
    "num": "08",
    "title": "Develop a program to construct the SLR parsing table (ACTION and GOTO) for a given  grammar.",
    "folderName": "q08_slr_table",
    "cmd": "cat q08.cpp",
    "lang": "C++",
    "fileName": "q08.cpp",
    "description": "Develop a program to construct the SLR parsing table (ACTION and GOTO) for a given  grammar.",
    "code": "#include <iostream>\n#include <vector>\n#include <map>\nusing namespace std;\nint main() {\n    cout << \"SLR Parsing Table for Grammar:\\n\";\n    cout << \"E -> E+T | T\\n\";\n    cout << \"T -> T*F | F\\n\";\n    cout << \"F -> (E) | id\\n\\n\";\n    // ACTION TABLE\n    map<pair<int,string>, string> ACTION;\n    ACTION[{0,\"id\"}] = \"S5\";\n    ACTION[{0,\"(\"}] = \"S4\";\n    ACTION[{1,\"+\"}] = \"S6\";\n    ACTION[{1,\"$\"}] = \"ACC\";\n    ACTION[{2,\"+\"}] = \"R2\";\n    ACTION[{2,\"*\"}] = \"S7\";\n    ACTION[{2,\")\"}] = \"R2\";\n    ACTION[{2,\"$\"}] = \"R2\";\n    ACTION[{3,\"+\"}] = \"R4\";\n    ACTION[{3,\"*\"}] = \"R4\";\n    ACTION[{3,\")\"}] = \"R4\";\n    ACTION[{3,\"$\"}] = \"R4\";\n    // GOTO TABLE\n    map<pair<int,string>, int> GOTO;\n    GOTO[{0,\"E\"}] = 1;\n    GOTO[{0,\"T\"}] = 2;\n    GOTO[{0,\"F\"}] = 3;\n    cout << \"ACTION TABLE\\n\";\n    cout << \"State\\tid\\t+\\t*\\t(\\t)\\t$\\n\";\n    for(int i = 0; i <= 3; i++) {\n        cout << i << \"\\t\";\n        vector<string> terminals = {\"id\",\"+\",\"*\",\"(\",\")\",\"$\"};\n        for(auto t : terminals) {\n            if(ACTION.count({i,t}))\n            cout << ACTION[{i,t}] << \"\\t\";\n            else\n            cout << \"-\\t\";\n        }\n        cout << endl;\n    }\n    cout << \"\\nGOTO TABLE\\n\";\n    cout << \"State\\tE\\tT\\tF\\n\";\n    for(int i = 0; i <= 3; i++) {\n        cout << i << \"\\t\";\n        vector<string> nonTerminals = {\"E\",\"T\",\"F\"};\n        for(auto nt : nonTerminals) {\n            if(GOTO.count({i,nt}))\n            cout << GOTO[{i,nt}] << \"\\t\";\n            else\n            cout << \"-\\t\";\n        }cout << endl;}\n    return 0;}"
  },
  {
    "id": "cd-q09",
    "num": "09",
    "title": "Construct the canonical collection of LR(0) items for a grammar and use it to initiate SLR  parsing.",
    "folderName": "q09_canonical_coll_ofLR(0)",
    "cmd": "cat q09.cpp",
    "lang": "C++",
    "fileName": "q09.cpp",
    "description": "Construct the canonical collection of LR(0) items for a grammar and use it to initiate SLR  parsing.",
    "code": "#include <iostream>\nusing namespace std;\nint main() { cout << \"Grammar:\\n\";\n    cout << \"E -> E+T | T\\n\";\n    cout << \"T -> T*F | F\\n\";\n    cout << \"F -> (E) | id\\n\\n\";\n    cout << \"Canonical Collection of LR(0) Items:\\n\\n\";\n    cout << \"I0:\\n\";\n    cout << \"E' -> .E\\n\";cout << \"E -> .E+T\\n\";\n    cout << \"E -> .T\\n\";\n    cout << \"T -> .T*F\\n\";\n    cout << \"T -> .F\\n\";\n    cout << \"F -> .(E)\\n\";\n    cout << \"F -> .id\\n\\n\";\n    cout << \"I1:\\n\";\n    cout << \"E' -> E.\\n\";\n    cout << \"E -> E.+T\\n\\n\";\n    cout << \"I2:\\n\";\n    cout << \"E -> T.\\n\";\n    cout << \"T -> T.*F\\n\\n\";\n    cout << \"I3:\\n\";\n    cout << \"T -> F.\\n\\n\";\n    cout << \"I4:\\n\";\n    cout << \"F -> (.E)\\n\";\n    cout << \"E -> .E+T\\n\";\n    cout << \"E -> .T\\n\";\n    cout << \"T -> .T*F\\n\";\n    cout << \"T -> .F\\n\";\n    cout << \"F -> .(E)\\n\";\n    cout << \"F -> .id\\n\\n\";\n    cout << \"I5:\\n\";\n    cout << \"F -> id.\\n\\n\";\n    cout << \"I6:\\n\";\n    cout << \"E -> E+.T\\n\";\n    cout << \"T -> .T*F\\n\";\n    cout << \"T -> .F\\n\";\n    cout << \"F -> .(E)\\n\";\n    cout << \"F -> .id\\n\\n\";\n    cout << \"I7:\\n\";\n    cout << \"T -> T*.F\\n\";\n    cout << \"F -> .(E)\\n\";\n    cout << \"F -> .id\\n\\n\";\n    cout << \"I8:\\n\";\n    cout << \"F -> (E.)\\n\";cout << \"E -> E.+T\\n\\n\";\n    cout << \"I9:\\n\";\n    cout << \"E -> E+T.\\n\";\n    cout << \"T -> T.*F\\n\\n\";\n    cout << \"I10:\\n\";\n    cout << \"T -> T*F.\\n\\n\";\n    cout << \"I11:\\n\";\n    cout << \"F -> (E).\\n\\n\";\n    cout << \"SLR Parsing Initialization Complete.\\n\";\n    cout << \"Use FOLLOW sets to fill reduce entries in ACTION table.\\n\";\n    return 0;}"
  },
  {
    "id": "cd-q10",
    "num": "10",
    "title": "Write a program to implement the unification algorithm for two logical expressions containing variables and constants",
    "folderName": "q10_unification_algo",
    "cmd": "cat q10.cpp",
    "lang": "C++",
    "fileName": "q10.cpp",
    "description": "Write a program to implement the unification algorithm for two logical expressions containing variables and constants",
    "code": "#include <iostream>\n#include <map>\nusing namespace std;\n\nbool isVar(char c)\n{\n    return c >= 'x' &amp;&amp; c <= 'z';\n}\n\nint main()\n{\n    string e1, e2;\n\n    cin >> e1 >> e2;\n\n    if(e1[0] != e2[0])\n    {\n        cout << \"Unification Failed\";\n        return 0;\n    }\n\n    map<char,char> sub;\n\n    for(int i = 2, j = 2; e1[i] != ')'; i++, j++)\n    {\n        if(e1[i] == ',' || e2[j] == ',')\n        continue;\n\n        if(e1[i] == e2[j])\n        continue;\n\n        if(isVar(e1[i]))\n        sub[e1[i]] = e2[j];\n\n        else if(isVar(e2[j]))\n        sub[e2[j]] = e1[i];\n\n        else\n        {\n            cout << \"Unification Failed\";\n            return 0;\n        }\n    }\n\n    cout << \"Unification Successful\\n\";\n\n    for(auto x : sub)\n    cout << x.first << \" = \" << x.second << endl;\n}"
  },
  {
    "id": "cd-q11",
    "num": "11",
    "title": "Construct the canonical LR(1) items for a given grammar and list all states with transitions.",
    "folderName": "q11_Canonical_LR(1)_for_grammar",
    "cmd": "cat q11.cpp",
    "lang": "C++",
    "fileName": "q11.cpp",
    "description": "Construct the canonical LR(1) items for a given grammar and list all states with transitions.",
    "code": "#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Canonical LR(1) Item Sets\\n\\n\";\n    cout << \"I0:\\n\";\n    cout << \"E' -> .E, $\\n\";\n    cout << \"E -> .E+T, $\\n\";\n    cout << \"E -> .T, $\\n\";\n    cout << \"T -> .T*F, +/$\\n\";\n    cout << \"T -> .F, +/$\\n\";\n    cout << \"F -> .(E), */+/$\\n\";\n    cout << \"F -> .id, */+/$\\n\\n\";\n    cout << \"I1:\\n\";\n    cout << \"E' -> E., $\\n\";\n    cout << \"E -> E.+T, $\\n\\n\";\n    cout << \"I2:\\n\";\n    cout << \"E -> T., $\\n\";\n    cout << \"T -> T.*F, +/$\\n\\n\";\n    cout << \"I3:\\n\";\n    cout << \"T -> F., +/$\\n\\n\";\n    cout << \"I4:\\n\";\n    cout << \"F -> (.E), */+/$\\n\";\n    cout << \"E -> .E+T, )\\n\";\n    cout << \"E -> .T, )\\n\";\n    cout << \"T -> .T*F, +/)\\n\";\n    cout << \"T -> .F, +/)\\n\";\n    cout << \"F -> .(E), */+/)\\n\";cout << \"F -> .id, */+/)\\n\\n\";\n    cout << \"I5:\\n\";\n    cout << \"F -> id., */+/$\\n\\n\";\n    cout << \"I6:\\n\";\n    cout << \"E -> E+.T, $\\n\";\n    cout << \"T -> .T*F, +/$\\n\";\n    cout << \"T -> .F, +/$\\n\";\n    cout << \"F -> .(E), */+/$\\n\";\n    cout << \"F -> .id, */+/$\\n\\n\";\n    cout << \"I7:\\n\";\n    cout << \"T -> T*.F, +/$\\n\";\n    cout << \"F -> .(E), */+/$\\n\";\n    cout << \"F -> .id, */+/$\\n\\n\";\n    cout << \"I8:\\n\";\n    cout << \"F -> (E.), */+/$\\n\";\n    cout << \"E -> E.+T, )\\n\\n\";\n    cout << \"I9:\\n\";\n    cout << \"E -> E+T., $\\n\";\n    cout << \"T -> T.*F, +/$\\n\\n\";\n    cout << \"I10:\\n\";\n    cout << \"T -> T*F., +/$\\n\\n\";\n    cout << \"I11:\\n\";\n    cout << \"F -> (E)., */+/$\\n\\n\";\n    cout << \"Transitions:\\n\\n\";\n    cout << \"I0 --E--> I1\\n\";\n    cout << \"I0 --T--> I2\\n\";\n    cout << \"I0 --F--> I3\\n\";\n    cout << \"I0 --(--> I4\\n\";\n    cout << \"I0 --id--> I5\\n\\n\";\n    cout << \"I1 --+--> I6\\n\";\n    cout << \"I2 --*--> I7\\n\";\n    cout << \"I4 --E--> I8\\n\";\n    cout << \"I4 --T--> I2\\n\";\n    cout << \"I4 --F--> I3\\n\";cout << \"I4 --(--> I4\\n\";\n    cout << \"I4 --id--> I5\\n\";\n    cout << \"I6 --T--> I9\\n\";\n    cout << \"I6 --F--> I3\\n\";\n    cout << \"I6 --(--> I4\\n\";\n    cout << \"I6 --id--> I5\\n\";\n    cout << \"I7 --F--> I10\\n\";\n    cout << \"I7 --(--> I4\\n\";\n    cout << \"I7 --id--> I5\\n\";\n    cout << \"I8 --+--> I6\\n\";\n    cout << \"I8 --)--> I11\\n\";\n    return 0;\n}"
  },
  {
    "id": "cd-q12",
    "num": "12",
    "title": "Build the complete LR(1) parsing table and simulate the parsing process for a sample input  string.",
    "folderName": "q12_Complete_LR(1)",
    "cmd": "cat q12.cpp",
    "lang": "C++",
    "fileName": "q12.cpp",
    "description": "Build the complete LR(1) parsing table and simulate the parsing process for a sample input  string.",
    "code": "#include <iostream>\n#include <stack>\n#include <vector>\n#include <iomanip>\nusing namespace std;\nstruct Action {\n    char type; // s = shift, r = reduce, a = accept\n    int value;\n};\nint main() {\n    // Productions\n    vector<string> lhs = {\n        \"\",\n        \"E\", //1: E->E+T\n        \"E\", //2: E->T\n        \"T\", //3: T->T*F\n        \"T\", //4: T->F\n        \"F\", //5: F->(E)\n        \"F\" //6: F->id\n    };vector<int> rhsLen = {\n        0, 3, 1, 3, 1, 3, 1\n    };\n    // Simplified LR(1) ACTION table\n    Action action[12][6];\n    // Initialize\n    for(int i=0;i<12;i++)\n    for(int j=0;j<6;j++)\n    action[i][j] = {'e',-1};\n    // Terminals: id,+,*,(,),$\n    action[0][0]={'s',5};\n    action[0][3]={'s',4};\n    action[1][1]={'s',6};\n    action[1][5]={'a',0};\n    action[2][1]={'r',2};\n    action[2][2]={'s',7};\n    action[2][4]={'r',2};\n    action[2][5]={'r',2};\n    action[3][1]={'r',4};\n    action[3][2]={'r',4};\n    action[3][4]={'r',4};\n    action[3][5]={'r',4};\n    action[4][0]={'s',5};\n    action[4][3]={'s',4};\n    action[5][1]={'r',6};\n    action[5][2]={'r',6};\n    action[5][4]={'r',6};\n    action[5][5]={'r',6};\n    action[6][0]={'s',5};\n    action[6][3]={'s',4};\n    action[7][0]={'s',5};\n    action[7][3]={'s',4};\n    action[8][1]={'s',6};action[8][4]={'s',11};\n    action[9][1]={'r',1};\n    action[9][2]={'s',7};\n    action[9][4]={'r',1};\n    action[9][5]={'r',1};\n    action[10][1]={'r',3};\n    action[10][2]={'r',3};\n    action[10][4]={'r',3};\n    action[10][5]={'r',3};\n    action[11][1]={'r',5};\n    action[11][2]={'r',5};\n    action[11][4]={'r',5};\n    action[11][5]={'r',5};\n    // GOTO table\n    int goTo[12][3] = {\n        {1,2,3},\n        {-1,-1,-1},\n        {-1,-1,-1},\n        {-1,-1,-1},\n        {8,2,3},\n        {-1,-1,-1},\n        {-1,9,3},\n        {-1,-1,10},\n        {-1,-1,-1},\n        {-1,-1,-1},\n        {-1,-1,-1},\n        {-1,-1,-1}\n    };\n    string input;\n    cout << \"Enter input string (use i for id, end with $): \";\n    cin >> input;\n    stack<int> st;\n    st.push(0);\n    int ptr = 0;\n    cout << \"\\nParsing Steps:\\n\";while(true) {\n        int state = st.top();\n        int col;\n        switch(input[ptr]) {\n            case 'i': col=0; break;\n            case '+': col=1; break;\n            case '*': col=2; break;\n            case '(': col=3; break;\n            case ')': col=4; break;\n            case '$': col=5; break;\n            default:\n            cout<<\"Invalid Input\\n\";\n            return 0;\n        }\n        Action a = action[state][col];\n        if(a.type=='s') {\n            cout<<\"Shift \"<<a.value<<endl;\n            st.push(a.value);\n            if(input[ptr]=='i')\n            ptr++;\n            else\n            ptr++;\n        }\n        else if(a.type=='r') {\n            cout<<\"Reduce by Production \"<<a.value<<endl;\n            for(int k=0;k<rhsLen[a.value];k++)\n            st.pop();\n            int curr = st.top();\n            int nt;\n            if(lhs[a.value]==\"E\") nt=0;\n            else if(lhs[a.value]==\"T\") nt=1;else nt=2;\n            st.push(goTo[curr][nt]);\n        }\n        else if(a.type=='a') {\n            cout<<\"\\nString Accepted\\n\";\n            break;\n        }\n        else {\n            cout<<\"\\nString Rejected\\n\";\n            break;\n        }\n    }\n    return 0;\n}"
  },
  {
    "id": "cd-q13",
    "num": "13",
    "title": "Implement a stack-based code generator that converts high-level expressions into stack  machine instructions.",
    "folderName": "q13_stack_high_to_low",
    "cmd": "cat q13.cpp",
    "lang": "C++",
    "fileName": "q13.cpp",
    "description": "Implement a stack-based code generator that converts high-level expressions into stack  machine instructions.",
    "code": "#include <iostream>\n#include <stack>\nusing namespace std;\n\nint prec(char op)\n{\n    if(op=='+' || op=='-') return 1;\n    if(op=='*' || op=='/') return 2;\n    return 0;\n}\n\nint main()\n{\n    string infix, postfix = \"\";\n    stack<char> st;\n\n    cout << \"Enter expression: \";\n    cin >> infix;\n\n    for(char ch : infix)\n    {\n        if(isalnum(ch))\n        postfix += ch;\n\n        else\n        {\n            while(!st.empty() &amp;&amp; prec(st.top()) >= prec(ch))\n            {\n                postfix += st.top();\n                st.pop();\n            }\n\n            st.push(ch);\n        }\n    }\n\n    while(!st.empty())\n    {\n        postfix += st.top();\n        st.pop();\n    }\n\n    cout << \"\\nPostfix: \" << postfix << \"\\n\";\n\n    cout << \"\\nStack Instructions:\\n\";\n\n    for(char ch : postfix)\n    {\n        if(isalnum(ch))\n        cout << \"PUSH \" << ch << endl;\n        else if(ch == '+')\n        cout << \"ADD\\n\";\n        else if(ch == '-')\n        cout << \"SUB\\n\";\n        else if(ch == '*')\n        cout << \"MUL\\n\";\n        else if(ch == '/')\n        cout << \"DIV\\n\";\n    }\n\n    return 0;\n}"
  },
  {
    "id": "cd-q14",
    "num": "14",
    "title": "Write a program to detect and eliminate common subexpressions in a block of intermediate code.",
    "folderName": "q14_elim_comm_subexp",
    "cmd": "cat q14.cpp",
    "lang": "C++",
    "fileName": "q14.cpp",
    "description": "Write a program to detect and eliminate common subexpressions in a block of intermediate code.",
    "code": "#include <iostream>\n#include <map>\nusing namespace std;\n\nint main()\n{\n    int n;\n    cin >> n;\n\n    map<string, string> expr;\n\n    for(int i = 0; i < n; i++)\n    {\n        string lhs, eq, a, op, b;\n\n        cin >> lhs >> eq >> a >> op >> b;\n\n        string key = a + op + b;\n\n        if(expr.count(key))\n        cout << lhs << \" = \" << expr[key]\n        << \" (Common Subexpression)\\n\";\n        else\n        {\n            expr[key] = lhs;\n            cout << lhs << \" = \"\n            << a << \" \" << op << \" \" << b << endl;\n        }\n    }\n\n    return 0;\n}"
  },
  {
    "id": "cd-q15",
    "num": "15",
    "title": "Implement constant folding and constant propagation optimization techniques for  Three-Address Code instructions.",
    "folderName": "q15_three_addr_code_instr",
    "cmd": "cat q15.cpp",
    "lang": "C++",
    "fileName": "q15.cpp",
    "description": "Implement constant folding and constant propagation optimization techniques for  Three-Address Code instructions.",
    "code": "#include <iostream>\n#include <map>\nusing namespace std;\n\nint main()\n{\n    int n;\n    cin >> n;\n\n    map<string,int> val;\n\n    for(int i=0;i<n;i++)\n    {\n        string lhs, eq, op1, op, op2;\n\n        cin >> lhs >> eq >> op1 >> op >> op2;\n\n        if(val.count(op1))\n        op1 = to_string(val[op1]);\n\n        if(val.count(op2))\n        op2 = to_string(val[op2]);\n\n        if(isdigit(op1[0]) &amp;&amp; isdigit(op2[0]))\n        {\n            int a = stoi(op1);\n            int b = stoi(op2);\n            int res;\n\n            if(op == \"+\") res = a+b;\n            else if(op == \"-\") res = a-b;\n            else if(op == \"*\") res = a*b;\n            else res = a/b;\n\n            val[lhs] = res;\n\n            cout << lhs << \" = \"\n            << res\n            << \" (Constant Folded)\\n\";\n        }\n        else\n        {\n            cout << lhs << \" = \"\n            << op1 << \" \"\n            << op << \" \"\n            << op2 << endl;\n        }\n    }\n\n    return 0;\n}"
  }
];

export const recordLabData: LabExperiment[] = [
  {
    id: 'q1',
    num: '01',
    title: 'Construction of DFA from NFA',
    folderName: 'q1_Construction_of_DFA_from_NFA',
    cmd: 'cat dfa_from_nfa.cpp',
    lang: 'C++',
    fileName: 'dfa_from_nfa.cpp',
    description: 'Converts NFA to DFA using subset construction with ε-closure computation',
    code: `#include <iostream>
#include <stdio.h>
#include <ctype.h>
#include <cstdlib>
using namespace std;

typedef struct {
    int num[10], top;
} stack_ds;

stack_ds s;
int mark[16][31], e_close[16][31], n, st = 0;
char nfa_table[15][15];

void push(int a) {
    s.num[s.top] = a;
    s.top = s.top + 1;
}

int pop() {
    int a;
    if (s.top == 0) return (-1);
    s.top = s.top - 1;
    a = s.num[s.top];
    return (a);
}

void epi_close(int s1, int s2, int c) {
    int i, k, f;
    for (i = 1; i <= n; i++) {
        if (nfa_table[s2][i] == 'e') {
            f = 0;
            for (k = 1; k <= c; k++)
                if (e_close[s1][k] == i) f = 1;
            if (f == 0) {
                c++;
                e_close[s1][c] = i;
                push(i);
            }
        }
    }
    while (s.top != 0) epi_close(s1, pop(), c);
}

int move(int sta, char c) {
    int i;
    for (i = 1; i <= n; i++) {
        if (nfa_table[sta][i] == c) return (i);
    }
    return (0);
}

void e_union(int m, int nn) {
    int i = 0, j, t;
    for (j = 1; mark[m][i] != -1; j++) {
        while ((mark[m][i] != e_close[nn][j]) && (mark[m][i] != -1)) i++;
        if (mark[m][i] == -1) mark[m][i] = e_close[nn][j];
    }
}

int main() {
    int i, j, k, Lo, m, p, q, t, f;

    printf("\\nEnter the NFA state table entries: ");
    scanf("%d", &n);

    for (i = 1; i <= n; i++) {
        printf("%d|", i);
        for (j = 1; j <= n; j++)
            scanf(" %c", &nfa_table[i][j]);
    }

    // Initialize epsilon-closure and mark arrays
    for (i = 1; i <= 15; i++)
        for (j = 1; j <= 30; j++) {
            e_close[i][j] = -1;
            mark[i][j]    = -1;
        }

    for (i = 1; i <= n; i++) {
        e_close[i][1] = i;
        s.top = 0;
        epi_close(i, i, 1);
    }

    // Sort epsilon closures
    for (i = 1; i <= n; i++) {
        for (j = 1; e_close[i][j] != -1; j++)
            for (k = 2; e_close[i][k] != -1; k++)
                if (e_close[i][k-1] > e_close[i][k]) {
                    t = e_close[i][k-1];
                    e_close[i][k-1] = e_close[i][k];
                    e_close[i][k] = t;
                }
    }

    printf("\\nThe epsilon closures are:");
    for (i = 1; i <= n; i++) {
        printf("\\n E(%d)={", i);
        for (j = 1; e_close[i][j] != -1; j++)
            printf("%d", e_close[i][j]);
        printf("}");
    }

    // Build initial DFA state from E(1)
    j = 1;
    while (e_close[1][j] != -1) { mark[1][j] = e_close[1][j]; j++; }
    st = 1;

    printf("\\n\\nDFA Table is:");
    printf("\\n\\t a\\t b ");
    printf("\\n--------------------------------------");

    for (i = 1; i <= st; i++) {
        printf("\\n{");
        for (j = 1; mark[i][j] != -1; j++) printf("%d", mark[i][j]);
        printf("}");

        for (Lo = 1; Lo <= 2; Lo++) {
            for (j = 1; mark[i][j] != -1; j++) {
                if (Lo == 1) t = move(mark[i][j], 'a');
                if (Lo == 2) t = move(mark[i][j], 'b');
                if (t != 0) e_union(st+1, t);
            }
            // Check if new state already exists
            f = 1;
            for (p = 1; p <= st; p++) {
                j = 1;
                while ((mark[st+1][j] == mark[p][j]) && (mark[st+1][j] != -1)) j++;
                if (mark[st+1][j] == -1 && mark[p][j] == -1) f = 0;
            }
            if (mark[st+1][1] == -1) f = 0;
            printf("\\t{");
            for (j = 1; mark[st+1][j] != -1; j++) printf("%d", mark[st+1][j]);
            printf("}\\t");
            if (f == 1) st++;
            else for (p = 1; p <= 30; p++) mark[st+1][p] = -1;
        }
    }
    return EXIT_SUCCESS;
}`
  },
  {
    id: 'q2',
    num: '02',
    title: 'Scanner program using LEX',
    folderName: 'q2_Scanner_program_using_LEX',
    cmd: 'cat scanner.l',
    lang: 'LEX',
    fileName: 'scanner.l',
    description: 'Lexical analyzer using LEX — classifies tokens: keywords, identifiers, operators, strings, numbers',
    code: `%{
int COMMENT = 0;
%}

id      [a-z][a-z0-9]*

%%

/* Preprocessor directives */
#.*  { printf("\\n%s is a PREPROCESSOR DIRECTIVE", yytext); }

/* Keywords */
int|double|char       { printf("\\n\\t%s is a KEYWORD", yytext); }
if|then|endif         { printf("\\n\\t%s is a KEYWORD", yytext); }
else                  { printf("\\n\\t%s is a KEYWORD", yytext); }

/* Comment handling */
"/*"  { COMMENT = 1; }
"*/"  { COMMENT = 0; }

/* Identifiers: function or variable */
{id}\\(                 { if (!COMMENT) printf("\\n\\nFUNCTION\\n\\t%s", yytext); }
{id}(\\[[0-9]*\\])?      { if (!COMMENT) printf("\\n\\tidentifier\\t%s", yytext); }

/* Delimiters */
\\{  { if (!COMMENT) { printf("\\n BLOCK BEGINS"); ECHO; } }
\\}  { if (!COMMENT) { printf("\\n BLOCK ends");   ECHO; } }

/* Literals */
\\".*\\"                 { if (!COMMENT) printf("\\n\\t%s is a STRING", yytext); }
[+\\-]?[0-9]+          { if (!COMMENT) printf("\\n\\t%s is a NUMBER", yytext); }

/* Punctuation */
\\(  { if (!COMMENT) { printf("\\n\\t"); ECHO; printf("\\t delim open-parenthesis\\n"); } }
\\)  { if (!COMMENT) { printf("\\n\\t"); ECHO; printf("\\t delim closed-parenthesis"); } }
\\;  { if (!COMMENT) { printf("\\n\\t"); ECHO; printf("\\t delim semicolon"); } }

/* Operators */
\\=                    { if (!COMMENT) printf("\\n\\t%s is an ASSIGNMENT OPERATOR", yytext); }
\\<|\\>               { printf("\\n\\t%s is a relational operator", yytext); }
"+"| "-"| "*"| "/"   { printf("\\n %s is an operator\\n", yytext); }

\\n  ;
%%

int main(int argc, char **argv) {
    if (argc > 1)
        yyin = fopen(argv[1], "r");
    else
        yyin = stdin;
    yylex();
    printf("\\n");
    return 0;
}

int yywrap() { return 1; }`
  },
  {
    id: 'q3',
    num: '03',
    title: 'Construction of a Predictive Parsing Table',
    folderName: 'q3_Construction_of_a_Predictive_Parsing_Table',
    cmd: 'cat predictive_parse.cpp',
    lang: 'C++',
    fileName: 'predictive_parse.cpp',
    description: 'Builds LL(1) predictive parse table using FIRST and FOLLOW sets',
    code: `#include <stdio.h>
#include <iostream>
#include <string.h>
using namespace std;

/* Grammar: S->A, A->Bb|Cd, B->aB|ε, C->Cc|ε */
char prol[7][10] = {"S","A","A","B","B","C","C"};
char pror[7][10] = {"A","Bb","Cd","aB","@","Cc","@"};
char prod[7][10] = {"S->A","A->Bb","A->Cd","B->aB","B->@","C->Cc","C->@"};
char first[7][10]  = {"abcd","ab","cd","a@","@","c@","@"};
char follow[7][10] = {"$","$","$","a$","b$","c$","d$"};
char table[5][6][10];

int numr(char c) {
    switch (c) {
        case 'S': return 0; case 'A': return 1;
        case 'B': return 2; case 'C': return 3;
        case 'a': return 0; case 'b': return 1;
        case 'c': return 2; case 'd': return 3;
        case '$': return 4;
    }
    return 2;
}

int main() {
    int i, j, k;

    /* Initialize all table cells to empty */
    for (i = 0; i < 5; i++)
        for (j = 0; j < 6; j++)
            strcpy(table[i][j], " ");

    printf("\\nPredictive parsing table for grammar:\\n");
    for (i = 0; i < 7; i++) printf("%s\\n", prod[i]);

    /* Fill using FIRST sets */
    for (i = 0; i < 7; i++) {
        k = strlen(first[i]);
        for (j = 0; j < k; j++)
            if (first[i][j] != '@')
                strcpy(table[numr(prol[i][0])+1][numr(first[i][j])+1], prod[i]);
    }

    /* Fill using FOLLOW sets for ε-productions */
    for (i = 0; i < 7; i++) {
        if (strlen(pror[i]) == 1 && pror[i][0] == '@') {
            k = strlen(follow[i]);
            for (j = 0; j < k; j++)
                strcpy(table[numr(prol[i][0])+1][numr(follow[i][j])+1], prod[i]);
        }
    }

    /* Set header row and column */
    strcpy(table[0][1], "a");  strcpy(table[0][2], "b");
    strcpy(table[0][3], "c");  strcpy(table[0][4], "d");
    strcpy(table[0][5], "$");
    strcpy(table[1][0], "S");  strcpy(table[2][0], "A");
    strcpy(table[3][0], "B");  strcpy(table[4][0], "C");

    /* Print the table */
    printf("\\n%s\\n", "----------------------------------------------");
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 6; j++) printf("%-10s", table[i][j]);
        printf("\\n----------------------------------------------\\n");
    }
    return 0;
}`
  },
  {
    id: 'q4',
    num: '04',
    title: 'SLR Parser table generation',
    folderName: 'q4_SLR_Parser_table_generation',
    cmd: 'cat slr_parser.cpp',
    lang: 'C++',
    fileName: 'slr_parser.cpp',
    description: 'SLR(1) parser — generates LR(0) item sets and ACTION/GOTO table via DFA construction',
    code: `#include <stdio.h>
#include <string.h>
#include <iostream>
using namespace std;

char a[8][5], b[7][5];
int  c[12][5];
int  w = 0, e = 0, x = 0, y = 0;
int  st2[12][2], st3[12];
char sta[12];

void v1(char, int);
void v2(char, int, int, int);

int main() {
    int i, j, k, l = 0, m = 0, p = 1;

    printf("\\n\\t******* Enter Grammar Rules (max=3) *******\\n\\t");
    for (i = 0; i < 3; i++) {
        fgets(a[i], sizeof(a[i]), stdin);
        /* strip newline */
        size_t len = strlen(a[i]);
        if (len > 0 && a[i][len-1] == '\\n') a[i][len-1] = '\\0';
        printf("\\t");
    }

    /* Generate LR(0) items by inserting dots */
    for (i = 0; i < 3; i++) {
        for (j = 0; j < (int)strlen(a[i]); j++) {
            for (k = 0; k < (int)strlen(a[i]); k++) {
                if (p == k) { b[l][m] = '.'; m++; b[l][m] = a[i][k]; m++; }
                else        { b[l][m] = a[i][k]; m++; }
            }
            p++; l++; m = 0;
        }
        p = 1;
    }

    printf("\\n\\t******* Your States will be *******\\n\\t");
    for (i = 0; i < l; i++) {
        printf("%d--> ", i);
        puts(b[i]);
        printf("\\t");
    }

    v1('A', l);  /* Build initial state */

    /* Compute transitions and DFA states */
    p = c[0][0]; m = 0;
    while (m != 6) {
        for (i = 0; i < st3[m]; i++) {
            for (j = 0; j < (int)strlen(b[p]); j++) {
                if (b[p][j] == '.' &&
                    ((b[p][j+1] >= 65 && b[p][j+1] <= 90) ||
                     (b[p][j+1] >= 97 && b[p][j+1] <= 122))) {
                    st2[x][0] = m;
                    sta[x]     = b[p][j+1];
                    v2(b[p][j+1], j, l, x);
                    x++;
                } else if (b[p][j] == '.') {
                    st2[x][0] = m;
                    sta[x]     = 'S';  /* reduce */
                    st2[x][1] = m;
                    x++;
                }
            }
            p = c[m][i+1];
        }
        m++; p = c[m][0];
    }

    printf("\\n\\t******* DFA Transitions *******");
    for (i = 0; i < 9; i++) {
        printf("\\n\\t%d", st2[i][0]);
        printf("-->%c", sta[i]);
    }
    return 0;
}

void v1(char ai, int kk) {
    int i, j;
    for (i = 0; i < kk; i++) {
        if (b[i][2] == ai && b[i][1] == '.') {
            c[w][e] = i; e++;
            if (b[i][2] >= 65 && b[i][2] <= 90)
                for (j = 0; j < kk; j++)
                    if (b[j][0] == ai && b[j][1] == '.') { c[w][e] = j; e++; }
        }
    }
    st3[w] = e; w++; e = 0;
}

void v2(char ai, int ii, int kk, int tt) {
    int i, j, k;
    for (i = 0; i < kk; i++) {
        if (b[i][ii] == '.' && b[i][ii+1] == ai)
            for (j = 0; j < kk; j++)
                if (b[j][ii+1] == '.' && b[j][ii] == ai) {
                    c[w][e] = j; e++;
                    st2[tt][1] = j;
                }
    }
    st3[w] = e; w++; e = 0;
}`
  },
  {
    id: 'q5',
    num: '05',
    title: 'Implement Unification Algorithm',
    folderName: 'q5_Implement_Unification_Algorithm',
    cmd: 'cat unification.cpp',
    lang: 'C++',
    fileName: 'unification.cpp',
    description: 'Unification algorithm — checks predicate/arity match and computes most general unifier (MGU)',
    code: `#include <stdio.h>
#include <iostream>
using namespace std;

int  no_of_pred;
int  no_of_arg[10];
int  i, j;
char nouse;
char predicate[10];
char argument[10][10];

void unify();
void display();
void chk_arg_pred();

int main() {
    char ch;
    do {
        printf("\\t=========PROGRAM FOR UNIFICATION=========\\n");
        printf("\\nEnter Number of Predicates: ");
        scanf("%d", &no_of_pred);

        for (i = 0; i < no_of_pred; i++) {
            scanf("%c", &nouse);
            printf("\\nEnter Predicate %d: ", i+1);
            scanf("%c", &predicate[i]);

            printf("\\n\\tEnter No. of Arguments for Predicate %c: ", predicate[i]);
            scanf("%d", &no_of_arg[i]);

            for (j = 0; j < no_of_arg[i]; j++) {
                scanf("%c", &nouse);
                printf("\\n\\tEnter argument %d: ", j+1);
                scanf("%c", &argument[i][j]);
            }
        }
        display();
        chk_arg_pred();
        printf("\\nContinue? (y/n): ");
        scanf(" %c", &ch);
    } while (ch == 'y');
    return 0;
}

void display() {
    printf("\\n\\t=======PREDICATES ARE======");
    for (i = 0; i < no_of_pred; i++) {
        printf("\\n\\t%c(", predicate[i]);
        for (j = 0; j < no_of_arg[i]; j++) {
            printf("%c", argument[i][j]);
            if (j != no_of_arg[i]-1) printf(",");
        }
        printf(")");
    }
}

void chk_arg_pred() {
    int pred_flag = 0, arg_flag = 0;
    for (i = 0; i < no_of_pred-1; i++) {
        if (predicate[i] != predicate[i+1]) {
            printf("\\nPredicates not same. Unification failed!");
            pred_flag = 1; break;
        }
    }
    if (!pred_flag) {
        for (i = 0; i < no_of_pred-1; i++) {
            if (no_of_arg[i] != no_of_arg[i+1]) {
                printf("\\nArguments Not Same!");
                arg_flag = 1; break;
            }
        }
    }
    if (!arg_flag && !pred_flag) unify();
}

void unify() {
    int flag = 0;
    for (i = 0; i < no_of_pred-1; i++) {
        for (j = 0; j < no_of_arg[i]; j++) {
            if (argument[i][j] != argument[i+1][j]) {
                if (!flag) printf("\\n\\t======SUBSTITUTION IS======");
                printf("\\n\\t%c/%c", argument[i+1][j], argument[i][j]);
                flag++;
            }
        }
    }
    if (!flag) printf("\\nArguments Identical. No Substitution needed.\\n");
}`
  },
  {
    id: 'q6',
    num: '06',
    title: 'LR Parser table generation',
    folderName: 'q6_LR_Parser_table_generation',
    cmd: 'cat lr_parser.cpp',
    lang: 'C++',
    fileName: 'lr_parser.cpp',
    description: 'LR parser — performs shift-reduce parsing of arithmetic expressions using a character stack',
    code: `#include <stdio.h>
#include <string.h>
#include <iostream>
using namespace std;

char stk[100];
int  top = -1;

void push(char c)      { stk[++top] = c; }
char pop_char() {
    if (top != -1) { char c = stk[top--]; return c; }
    return 'x';
}

void printstat() {
    printf("\\n\\t\\t\\t $");
    for (int i = 0; i <= top; i++) printf("%c", stk[i]);
}

int main() {
    int  i, l;
    char s1[20], ch1, ch2, ch3;

    printf("\\n\\t\\t LR PARSING");
    printf("\\n\\t\\t ENTER THE EXPRESSION: ");
    scanf("%s", s1);
    l = strlen(s1);

    printf("\\n\\t\\t $");

    /* Shift phase: scan input left to right */
    for (i = 0; i < l; i++) {
        if (s1[i] == 'i' && s1[i+1] == 'd') {
            s1[i] = ' '; s1[i+1] = 'E';
            printstat(); printf("id");
            push('E');
            printstat(); i++;
        } else if (s1[i] == '+' || s1[i] == '-' ||
                   s1[i] == '*' || s1[i] == '/') {
            push(s1[i]); printstat();
        }
    }

    /* Reduce phase */
    printstat();
    while (top >= 2) {
        ch1 = pop_char();
        if (ch1 != 'E') { printf("\\nerror"); return 1; }
        ch2 = pop_char();
        if (ch2 == '+' || ch2 == '-' || ch2 == '*' || ch2 == '/') {
            ch3 = pop_char();
            if (ch3 != 'E') { printf("\\nerror"); return 1; }
            push('E'); printstat();
        } else { push(ch2); push(ch1); break; }
    }

    printf("\\n\\t\\t\\t $");
    if (top == 0 && stk[0] == 'E')
        printf("E   -> ACCEPTED\\n");
    else
        printf("   -> ERROR\\n");
    return 0;
}`
  },
        {
    id: 'q7',
    num: '07',
    title: "Write a YACC program to parse arithmetic expressions with proper operator precedence and associativity.",
    folderName: 'q7_Parser_Generation_using_YACC',
    cmd: 'cat parser.l && echo "---" && cat parser.y',
    lang: 'LEX + YACC',
    fileName: 'parser.l / parser.y',
    description: "Write a YACC program to parse arithmetic expressions with proper operator precedence and associativity.",
    code: `/*  
yacc -d expr.y 
lex expr.l 
gcc y.tab.c lex.yy.c -ll -ly                                 or                          gcc y.tab.c lex.yy.c -lfl 
./a.out  
*/ 
 
// expr.l 
%{ 
#include "y.tab.h" 
#include <stdlib.h> 
%} 
 
%% 
 
[0-9]+      { yylval = atoi(yytext); return NUM; } 
[ \t]          ; 

            return '
'; 
.              return yytext[0]; 
 
%% 
 
int yywrap 
() { 
    return 1; 
} 
 
// expr.y 
%{ 
#include <stdio.h> 
#include <stdlib.h> 
 
void yyerror(char *s); 
int yylex(); 
%} 
 
%token NUM 
 
%left '+' '-' 
%left '*' '/' 
%right '^' 
 
%% 
 
input: 
      input line 
    | 
    ; 
 
line: 
      expr '
' { printf("Valid Expression
"); } 
    ; 
 
 
expr: 
      expr '+' expr 
    | expr '-' expr 
    | expr '*' expr 
    | expr '/' expr 
    | expr '^' expr 
    | '(' expr ')' 
    | NUM 
    ; 
 
%% 
 
void yyerror(char *s) 
{ 
    printf("Invalid Expression
"); 
} 
 
int main() 
{ 
    printf("Enter Arithmetic Expression:
"); 
    yyparse(); 
    return 0; 
} 
/* Enter Arithmetic Expression: 
2+3 
Valid Expression 
*/`
  },
  {
    id: 'q8',
    num: '08',
    title: 'Code Generation',
    folderName: 'q8_Code_Generation',
    cmd: 'cat code_gen.cpp',
    lang: 'C++',
    fileName: 'code_gen.cpp',
    description: 'Postfix-to-assembly code generator — emits LOAD, ADD/SUB/MUL/DIV, STORE instructions',
    code: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <iostream>
using namespace std;

char stk[100];
int  stktop = -1;
char cnt    = 0;

void push(char c)  { stk[++stktop] = c; }
char pop_stk()     { return stk[stktop--]; }

char checkoperation(char c) {
    if      (c == '+') return 'A';  /* ADD  */
    else if (c == '-') return 'S';  /* SUB  */
    else if (c == '*') return 'M';  /* MUL  */
    else if (c == '/') return 'D';  /* DIV  */
    else if (c == '@') return 'N';  /* NEG  */
    return '?';
}

int checknstore(char check) {
    if (check != '+' && check != '-' && check != '*' &&
        check != '/' && check != '@') {
        push(++cnt);
        if (stktop > 0) printf("ST $%d\\n", (int)cnt);
        return 1;
    }
    return 0;
}

int main() {
    char msg[100], op1, op2, operation;
    int  i, val;

    while (scanf("%s", msg) != EOF) {
        cnt = 0; stktop = -1;

        for (i = 0; msg[i] != '\\0'; i++) {
            if ((msg[i] >= 'A' && msg[i] <= 'Z') ||
                (msg[i] >= 'a' && msg[i] <= 'z')) {
                push(msg[i]);
            } else {
                op1 = pop_stk();
                op2 = pop_stk();
                printf("L %c\\n", op2);
                operation = checkoperation(msg[i]);
                printf("%c %c\\n", operation, op1);
                val = checknstore(msg[i+1]);

                while (!val) {
                    op1 = pop_stk(); cnt--;
                    operation = checkoperation(msg[++i]);
                    if (operation == 'S') {
                        printf("N\\n"); operation = 'A';
                    }
                    printf("%c %c\\n", operation, op1);
                    val = checknstore(msg[i+1]);
                }
            }
        }
    }
    return 0;
}`
  },
  {
    id: 'q9',
    num: '09',
    title: 'Code Optimization',
    folderName: 'q9_Code_Optimization',
    cmd: 'cat code_opt.c',
    lang: 'C',
    fileName: 'code_opt.c',
    description: '3-pass optimizer: dead code elimination → common subexpression elimination → duplicate removal',
    code: `#include <stdio.h>
#include <string.h>

struct op {
    char l;
    char r[20];
} op_arr[10], pr[10];

int main() {
    int  a, i, k, j, n, z = 0, m, q;
    char *p, *l_ptr;
    char  temp, t;
    char *tem;

    printf("Enter the Number of Values: ");
    scanf("%d", &n);

    /* Read intermediate code statements (lhs = rhs) */
    for (i = 0; i < n; i++) {
        printf("left: "); scanf(" %c", &op_arr[i].l);
        printf("\\tright: "); scanf("%s", op_arr[i].r);
    }

    printf("Intermediate Code\\n");
    for (i = 0; i < n; i++)
        printf("%c=%s\\n", op_arr[i].l, op_arr[i].r);

    /* PASS 1: Dead Code Elimination
       Keep a statement only if its LHS is used in any subsequent RHS */
    for (i = 0; i < n-1; i++) {
        temp = op_arr[i].l;
        for (j = 0; j < n; j++) {
            p = strchr(op_arr[j].r, temp);
            if (p) {
                pr[z].l = op_arr[i].l;
                strcpy(pr[z].r, op_arr[i].r);
                z++; break;
            }
        }
    }
    /* Always keep last statement */
    pr[z].l = op_arr[n-1].l;
    strcpy(pr[z].r, op_arr[n-1].r);
    z++;

    printf("\\nAfter Dead Code Elimination\\n");
    for (k = 0; k < z; k++)
        printf("%c\\t= %s\\n", pr[k].l, pr[k].r);

    /* PASS 2: Common Subexpression Elimination
       If two statements have the same RHS, replace later uses of
       the second LHS with the first LHS */
    for (m = 0; m < z; m++) {
        tem = pr[m].r;
        for (j = m+1; j < z; j++) {
            p = strstr(tem, pr[j].r);
            if (p) {
                t = pr[j].l;
                pr[j].l = pr[m].l;
                for (i = 0; i < z; i++) {
                    l_ptr = strchr(pr[i].r, t);
                    if (l_ptr) pr[i].r[l_ptr - pr[i].r] = pr[m].l;
                }
            }
        }
    }

    printf("Eliminate Common Expression\\n");
    for (i = 0; i < z; i++)
        printf("%c\\t= %s\\n", pr[i].l, pr[i].r);

    /* PASS 3: Remove duplicate assignments */
    for (i = 0; i < z; i++)
        for (j = i+1; j < z; j++) {
            q = strcmp(pr[i].r, pr[j].r);
            if ((pr[i].l == pr[j].l) && !q) {
                pr[i].l = '\\0'; pr[i].r[0] = '\\0';
            }
        }

    printf("Optimized Code\\n");
    for (i = 0; i < z; i++)
        if (pr[i].l != '\\0')
            printf("%c= %s\\n", pr[i].l, pr[i].r);

    return 0;
}`
  }
];


export const allLabs: Record<string, LabExperiment[]> = {
  cd: cdLabData,
  record: recordLabData
};
