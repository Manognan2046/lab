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
    title: 'Parser Generation using YACC',
    folderName: 'q7_Parser_Generation_using_YACC',
    cmd: 'cat parser.l && echo "---" && cat parser.y',
    lang: 'LEX + YACC',
    fileName: 'parser.l / parser.y',
    description: 'Expression evaluator using LEX+YACC — handles +, -, *, / with correct operator precedence',
    code: `/* ===== parser.l (Lexer) ===== */
%{
#include "parser.tab.h"
extern int yylval;
%}

%%

[0-9]+      { yylval = atoi(yytext); return NUM; }
[ \\t]+      {  }          /* skip whitespace */
\\n          { return 0; }
.           { return yytext[0]; }

%%
int yywrap() { return 1; }


/* ===== parser.y (Parser) ===== */
%token NUM
%left  '+' '-'
%left  '*' '/'

%%

cmd : E         { printf("%d\\n", $1); }
    ;

E   : E '+' T  { $$ = $1 + $3; }
    | E '-' T  { $$ = $1 - $3; }
    | T         { $$ = $1; }
    ;

T   : T '*' F  { $$ = $1 * $3; }
    | T '/' F  { $$ = ($3 != 0) ? $1 / $3 : 0; }
    | F         { $$ = $1; }
    ;

F   : '(' E ')' { $$ = $2; }
    | NUM       { $$ = $1; }
    ;

%%

int main()  { yyparse(); return 0; }
void yyerror(char *s) { printf("%s\\n", s); }`
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

export const dlLabData: LabExperiment[] = [
  {
    id: 'dl-q1',
    num: '01',
    title: 'Basic Logic Gates',
    folderName: 'q1_Basic_Logic_Gates',
    cmd: 'cat logic_gates.v',
    lang: 'Verilog',
    fileName: 'logic_gates.v',
    description: 'Implementation of basic logic gates using Verilog',
    code: `// Verilog code for logic gates will go here`
  }
];

export const cnLabData: LabExperiment[] = [
  {
    "id": "cn-q1a",
    "num": "01",
    "title": "Write programs for a UDP Talker (Sender) and UDP Listener (Receiver) to demonstrate communication using the UDP protocol.",
    "folderName": "q1_Udp_Talker",
    "cmd": "cat 01_udp_talker.c",
    "lang": "C",
    "fileName": "01_udp_talker.c",
    "description": "UDP Talker (Sender)",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    printf(\"UDP Talker started. Type messages to send (type 'exit' to quit):\\n\");\n    while (1) {\n        printf(\"Enter message: \");\n        fgets(buffer, MAXLINE, stdin);\n        buffer[strcspn(buffer, \"\\n\")] = '\\0';  \n        if (strcmp(buffer, \"exit\") == 0)\n            break;\n        sendto(sockfd, buffer, strlen(buffer), 0,\n               (struct sockaddr *)&servaddr, sizeof(servaddr));\n        printf(\"Message sent: %s\\n\", buffer);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q1b",
    "num": "01",
    "title": "Write programs for a UDP Talker (Sender) and UDP Listener (Receiver) to demonstrate communication using the UDP protocol.",
    "folderName": "q1_Udp_Talker",
    "cmd": "cat 01_udp_listener.c",
    "lang": "C",
    "fileName": "01_udp_listener.c",
    "description": "UDP Listener (Receiver)",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t len;\n    int n;\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    printf(\"UDP Listener started. Waiting for messages on port %d...\\n\", PORT);\n    while (1) {\n        len = sizeof(cliaddr);\n        memset(buffer, 0, MAXLINE);\n        n = recvfrom(sockfd, buffer, MAXLINE, 0,\n                     (struct sockaddr *)&cliaddr, &len);\n        buffer[n] = '\\0';\n        printf(\"Received from %s:%d -> %s\\n\",\n               inet_ntoa(cliaddr.sin_addr), ntohs(cliaddr.sin_port), buffer);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q2a",
    "num": "02",
    "title": "Write a UDP Echo Server program that receives a message from a client and sends the same message back to the client.",
    "folderName": "q2_Udp_Echo",
    "cmd": "cat 02_udp_echo_server.c",
    "lang": "C",
    "fileName": "02_udp_echo_server.c",
    "description": "UDP Echo Server",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t len;\n    int n;\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    printf(\"UDP Echo Server started on port %d...\\n\", PORT);\n    while (1) {\n        len = sizeof(cliaddr);\n        memset(buffer, 0, MAXLINE);\n        n = recvfrom(sockfd, buffer, MAXLINE, 0,\n                     (struct sockaddr *)&cliaddr, &len);\n        buffer[n] = '\\0';\n        printf(\"Received: %s\\n\", buffer);\n        sendto(sockfd, buffer, n, 0,\n               (struct sockaddr *)&cliaddr, len);\n        printf(\"Echoed back: %s\\n\", buffer);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q2b",
    "num": "02",
    "title": "Write a UDP Echo Server program that receives a message from a client and sends the same message back to the client.",
    "folderName": "q2_Udp_Echo",
    "cmd": "cat 02_udp_echo_client.c",
    "lang": "C",
    "fileName": "02_udp_echo_client.c",
    "description": "UDP Echo Client",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    socklen_t len;\n    int n;\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    printf(\"UDP Echo Client started. Type messages (type 'exit' to quit):\\n\");\n    while (1) {\n        printf(\"Enter message: \");\n        fgets(buffer, MAXLINE, stdin);\n        buffer[strcspn(buffer, \"\\n\")] = '\\0';\n        if (strcmp(buffer, \"exit\") == 0)\n            break;\n        sendto(sockfd, buffer, strlen(buffer), 0,\n               (struct sockaddr *)&servaddr, sizeof(servaddr));\n        len = sizeof(servaddr);\n        memset(buffer, 0, MAXLINE);\n        n = recvfrom(sockfd, buffer, MAXLINE, 0,\n                     (struct sockaddr *)&servaddr, &len);\n        buffer[n] = '\\0';\n        printf(\"Echo from server: %s\\n\", buffer);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q3a",
    "num": "03",
    "title": "Write a TCP Echo Server program using the iterative server approach, where the server handles one client at a time.",
    "folderName": "q3_Tcp_Echo",
    "cmd": "cat 03_tcp_echo_server.c",
    "lang": "C",
    "fileName": "03_tcp_echo_server.c",
    "description": "TCP Iterative Echo Server",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int listenfd, connfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t clilen;\n    int n;\n    listenfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (listenfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    listen(listenfd, 5);\n    printf(\"TCP Iterative Echo Server started on port %d...\\n\", PORT);\n    while (1) {\n        clilen = sizeof(cliaddr);\n        connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &clilen);\n        if (connfd < 0) {\n            perror(\"Accept failed\");\n            continue;\n        }\n        printf(\"Client connected: %s:%d\\n\",\n               inet_ntoa(cliaddr.sin_addr), ntohs(cliaddr.sin_port));\n        while ((n = read(connfd, buffer, MAXLINE)) > 0) {\n            buffer[n] = '\\0';\n            printf(\"Received: %s\\n\", buffer);\n            write(connfd, buffer, n);  \n            printf(\"Echoed back: %s\\n\", buffer);\n        }\n        printf(\"Client disconnected.\\n\");\n        close(connfd);\n    }\n    close(listenfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q3b",
    "num": "03",
    "title": "Write a TCP Echo Server program using the iterative server approach, where the server handles one client at a time.",
    "folderName": "q3_Tcp_Echo",
    "cmd": "cat 03_tcp_echo_client.c",
    "lang": "C",
    "fileName": "03_tcp_echo_client.c",
    "description": "TCP Echo Client",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    int n;\n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    if (connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Connect failed\");\n        exit(1);\n    }\n    printf(\"Connected to TCP Echo Server. Type messages (type 'exit' to quit):\\n\");\n    while (1) {\n        printf(\"Enter message: \");\n        fgets(buffer, MAXLINE, stdin);\n        buffer[strcspn(buffer, \"\\n\")] = '\\0';\n        if (strcmp(buffer, \"exit\") == 0)\n            break;\n        write(sockfd, buffer, strlen(buffer));\n        memset(buffer, 0, MAXLINE);\n        n = read(sockfd, buffer, MAXLINE);\n        buffer[n] = '\\0';\n        printf(\"Echo from server: %s\\n\", buffer);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q4a",
    "num": "04",
    "title": "Write a TCP Concurrent Server program using socket programming that handles multiple clients simultaneously.",
    "folderName": "q4_Tcp_Concurrent",
    "cmd": "cat 04_tcp_concurrent_server.c",
    "lang": "C",
    "fileName": "04_tcp_concurrent_server.c",
    "description": "TCP Concurrent Server (using fork)",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#include <signal.h>\n#define PORT 8080\n#define MAXLINE 1024\nvoid sigchld_handler(int sig) {\n    while (waitpid(-1, NULL, WNOHANG) > 0);\n}\nint main() {\n    int listenfd, connfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t clilen;\n    pid_t pid;\n    int n;\n    signal(SIGCHLD, sigchld_handler);\n    listenfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (listenfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    int opt = 1;\n    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    listen(listenfd, 5);\n    printf(\"TCP Concurrent Server started on port %d...\\n\", PORT);\n    while (1) {\n        clilen = sizeof(cliaddr);\n        connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &clilen);\n        if (connfd < 0) {\n            perror(\"Accept failed\");\n            continue;\n        }\n        printf(\"Client connected: %s:%d\\n\",\n               inet_ntoa(cliaddr.sin_addr), ntohs(cliaddr.sin_port));\n        pid = fork();\n        if (pid < 0) {\n            perror(\"Fork failed\");\n            close(connfd);\n            continue;\n        }\n        if (pid == 0) {\n            close(listenfd);\n            while ((n = read(connfd, buffer, MAXLINE)) > 0) {\n                buffer[n] = '\\0';\n                printf(\"[Child %d] Received: %s\\n\", getpid(), buffer);\n                write(connfd, buffer, n);  \n            }\n            printf(\"[Child %d] Client disconnected.\\n\", getpid());\n            close(connfd);\n            exit(0);\n        } else {\n            close(connfd);\n        }\n    }\n    close(listenfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q4b",
    "num": "04",
    "title": "Write a TCP Concurrent Server program using socket programming that handles multiple clients simultaneously.",
    "folderName": "q4_Tcp_Concurrent",
    "cmd": "cat 04_tcp_client.c",
    "lang": "C",
    "fileName": "04_tcp_client.c",
    "description": "TCP Client (for concurrent server)",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    int n;\n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    if (connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Connect failed\");\n        exit(1);\n    }\n    printf(\"Connected to server. Type messages (type 'exit' to quit):\\n\");\n    while (1) {\n        printf(\"Enter message: \");\n        fgets(buffer, MAXLINE, stdin);\n        buffer[strcspn(buffer, \"\\n\")] = '\\0';\n        if (strcmp(buffer, \"exit\") == 0)\n            break;\n        write(sockfd, buffer, strlen(buffer));\n        memset(buffer, 0, MAXLINE);\n        n = read(sockfd, buffer, MAXLINE);\n        buffer[n] = '\\0';\n        printf(\"Server reply: %s\\n\", buffer);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q5a",
    "num": "05",
    "title": "Write programs for File Transfer using TCP, where the client sends a file and the server receives and stores it.",
    "folderName": "q5_Tcp_File_Transfer",
    "cmd": "cat 05_file_server.c",
    "lang": "C",
    "fileName": "05_file_server.c",
    "description": "TCP File Transfer - Server (Receiver)",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int listenfd, connfd;\n    char buffer[MAXLINE];\n    char filename[256];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t clilen;\n    FILE *fp;\n    int n;\n    listenfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (listenfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    int opt = 1;\n    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    listen(listenfd, 5);\n    printf(\"File Transfer Server started on port %d...\\n\", PORT);\n    clilen = sizeof(cliaddr);\n    connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &clilen);\n    if (connfd < 0) {\n        perror(\"Accept failed\");\n        exit(1);\n    }\n    printf(\"Client connected.\\n\");\n    memset(filename, 0, sizeof(filename));\n    n = read(connfd, filename, sizeof(filename));\n    filename[n] = '\\0';\n    printf(\"Receiving file: %s\\n\", filename);\n    write(connfd, \"OK\", 2);\n    char outfile[300];\n    sprintf(outfile, \"received_%s\", filename);\n    fp = fopen(outfile, \"w\");\n    if (fp == NULL) {\n        perror(\"File open failed\");\n        close(connfd);\n        exit(1);\n    }\n    while ((n = read(connfd, buffer, MAXLINE)) > 0) {\n        fwrite(buffer, 1, n, fp);\n    }\n    printf(\"File received and saved as: %s\\n\", outfile);\n    fclose(fp);\n    close(connfd);\n    close(listenfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q5b",
    "num": "05",
    "title": "Write programs for File Transfer using TCP, where the client sends a file and the server receives and stores it.",
    "folderName": "q5_Tcp_File_Transfer",
    "cmd": "cat 05_file_client.c",
    "lang": "C",
    "fileName": "05_file_client.c",
    "description": "TCP File Transfer - Client (Sender)",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    char filename[256];\n    struct sockaddr_in servaddr;\n    FILE *fp;\n    int n;\n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    if (connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Connect failed\");\n        exit(1);\n    }\n    printf(\"Enter filename to send: \");\n    scanf(\"%s\", filename);\n    fp = fopen(filename, \"r\");\n    if (fp == NULL) {\n        perror(\"File not found\");\n        close(sockfd);\n        exit(1);\n    }\n    write(sockfd, filename, strlen(filename));\n    memset(buffer, 0, MAXLINE);\n    read(sockfd, buffer, MAXLINE);\n    while ((n = fread(buffer, 1, MAXLINE, fp)) > 0) {\n        write(sockfd, buffer, n);\n    }\n    printf(\"File '%s' sent successfully.\\n\", filename);\n    fclose(fp);\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q6a",
    "num": "06",
    "title": "Write a TCP Chat Application that allows two-way communication between client and server.",
    "folderName": "q6_Tcp_Chat",
    "cmd": "cat 06_chat_server.c",
    "lang": "C",
    "fileName": "06_chat_server.c",
    "description": "TCP Chat Server",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int listenfd, connfd;\n    char send_buf[MAXLINE], recv_buf[MAXLINE];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t clilen;\n    int n;\n    listenfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (listenfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    int opt = 1;\n    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    listen(listenfd, 5);\n    printf(\"Chat Server started on port %d. Waiting for client...\\n\", PORT);\n    clilen = sizeof(cliaddr);\n    connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &clilen);\n    if (connfd < 0) {\n        perror(\"Accept failed\");\n        exit(1);\n    }\n    printf(\"Client connected! Start chatting (type 'exit' to quit):\\n\");\n    while (1) {\n        memset(recv_buf, 0, MAXLINE);\n        n = read(connfd, recv_buf, MAXLINE);\n        if (n <= 0) {\n            printf(\"Client disconnected.\\n\");\n            break;\n        }\n        recv_buf[n] = '\\0';\n        if (strcmp(recv_buf, \"exit\") == 0) {\n            printf(\"Client ended the chat.\\n\");\n            break;\n        }\n        printf(\"Client: %s\\n\", recv_buf);\n        printf(\"Server: \");\n        fgets(send_buf, MAXLINE, stdin);\n        send_buf[strcspn(send_buf, \"\\n\")] = '\\0';\n        write(connfd, send_buf, strlen(send_buf));\n        if (strcmp(send_buf, \"exit\") == 0) {\n            printf(\"Chat ended by server.\\n\");\n            break;\n        }\n    }\n    close(connfd);\n    close(listenfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q6b",
    "num": "06",
    "title": "Write a TCP Chat Application that allows two-way communication between client and server.",
    "folderName": "q6_Tcp_Chat",
    "cmd": "cat 06_chat_client.c",
    "lang": "C",
    "fileName": "06_chat_client.c",
    "description": "TCP Chat Client",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char send_buf[MAXLINE], recv_buf[MAXLINE];\n    struct sockaddr_in servaddr;\n    int n;\n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    if (connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Connect failed\");\n        exit(1);\n    }\n    printf(\"Connected to Chat Server! Start chatting (type 'exit' to quit):\\n\");\n    while (1) {\n        printf(\"Client: \");\n        fgets(send_buf, MAXLINE, stdin);\n        send_buf[strcspn(send_buf, \"\\n\")] = '\\0';\n        write(sockfd, send_buf, strlen(send_buf));\n        if (strcmp(send_buf, \"exit\") == 0) {\n            printf(\"Chat ended.\\n\");\n            break;\n        }\n        memset(recv_buf, 0, MAXLINE);\n        n = read(sockfd, recv_buf, MAXLINE);\n        if (n <= 0) {\n            printf(\"Server disconnected.\\n\");\n            break;\n        }\n        recv_buf[n] = '\\0';\n        if (strcmp(recv_buf, \"exit\") == 0) {\n            printf(\"Server ended the chat.\\n\");\n            break;\n        }\n        printf(\"Server: %s\\n\", recv_buf);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q7a",
    "num": "07",
    "title": "Write a UDP client-server program for performing arithmetic operations such as addition, subtraction, multiplication, and division.",
    "folderName": "q7_Udp_Arithmetic",
    "cmd": "cat 07_udp_arith_server.c",
    "lang": "C",
    "fileName": "07_udp_arith_server.c",
    "description": "UDP Arithmetic Server",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE], result[MAXLINE];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t len;\n    int n;\n    float num1, num2, res;\n    char op;\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    printf(\"UDP Arithmetic Server started on port %d...\\n\", PORT);\n    while (1) {\n        len = sizeof(cliaddr);\n        memset(buffer, 0, MAXLINE);\n        n = recvfrom(sockfd, buffer, MAXLINE, 0,\n                     (struct sockaddr *)&cliaddr, &len);\n        buffer[n] = '\\0';\n        printf(\"Received: %s\\n\", buffer);\n        sscanf(buffer, \"%f %c %f\", &num1, &op, &num2);\n        switch (op) {\n            case '+': res = num1 + num2;\n                      sprintf(result, \"%.2f + %.2f = %.2f\", num1, num2, res);\n                      break;\n            case '-': res = num1 - num2;\n                      sprintf(result, \"%.2f - %.2f = %.2f\", num1, num2, res);\n                      break;\n            case '*': res = num1 * num2;\n                      sprintf(result, \"%.2f * %.2f = %.2f\", num1, num2, res);\n                      break;\n            case '/': if (num2 == 0)\n                          sprintf(result, \"Error: Division by zero\");\n                      else {\n                          res = num1 / num2;\n                          sprintf(result, \"%.2f / %.2f = %.2f\", num1, num2, res);\n                      }\n                      break;\n            default:  sprintf(result, \"Error: Invalid operator '%c'\", op);\n        }\n        sendto(sockfd, result, strlen(result), 0,\n               (struct sockaddr *)&cliaddr, len);\n        printf(\"Result sent: %s\\n\", result);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q7b",
    "num": "07",
    "title": "Write a UDP client-server program for performing arithmetic operations such as addition, subtraction, multiplication, and division.",
    "folderName": "q7_Udp_Arithmetic",
    "cmd": "cat 07_udp_arith_client.c",
    "lang": "C",
    "fileName": "07_udp_arith_client.c",
    "description": "UDP Arithmetic Client",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    socklen_t len;\n    int n;\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    printf(\"UDP Arithmetic Client (format: num1 op num2, e.g., 10 + 5)\\n\");\n    printf(\"Operators: + - * /  (type 'exit' to quit)\\n\\n\");\n    while (1) {\n        printf(\"Enter expression: \");\n        fgets(buffer, MAXLINE, stdin);\n        buffer[strcspn(buffer, \"\\n\")] = '\\0';\n        if (strcmp(buffer, \"exit\") == 0)\n            break;\n        sendto(sockfd, buffer, strlen(buffer), 0,\n               (struct sockaddr *)&servaddr, sizeof(servaddr));\n        len = sizeof(servaddr);\n        memset(buffer, 0, MAXLINE);\n        n = recvfrom(sockfd, buffer, MAXLINE, 0,\n                     (struct sockaddr *)&servaddr, &len);\n        buffer[n] = '\\0';\n        printf(\"Result: %s\\n\\n\", buffer);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q8a",
    "num": "08",
    "title": "Write a TCP client-server program to convert a lowercase string received from the client into uppercase at the server.",
    "folderName": "q8_Tcp_Uppercase",
    "cmd": "cat 08_tcp_upper_server.c",
    "lang": "C",
    "fileName": "08_tcp_upper_server.c",
    "description": "TCP Uppercase Server",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <ctype.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int listenfd, connfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t clilen;\n    int n, i;\n    listenfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (listenfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    int opt = 1;\n    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    listen(listenfd, 5);\n    printf(\"TCP Uppercase Server started on port %d...\\n\", PORT);\n    while (1) {\n        clilen = sizeof(cliaddr);\n        connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &clilen);\n        if (connfd < 0) {\n            perror(\"Accept failed\");\n            continue;\n        }\n        printf(\"Client connected.\\n\");\n        while ((n = read(connfd, buffer, MAXLINE)) > 0) {\n            buffer[n] = '\\0';\n            printf(\"Received: %s\\n\", buffer);\n            for (i = 0; i < n; i++) {\n                buffer[i] = toupper(buffer[i]);\n            }\n            write(connfd, buffer, n);\n            printf(\"Sent (uppercase): %s\\n\", buffer);\n        }\n        printf(\"Client disconnected.\\n\");\n        close(connfd);\n    }\n    close(listenfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q8b",
    "num": "08",
    "title": "Write a TCP client-server program to convert a lowercase string received from the client into uppercase at the server.",
    "folderName": "q8_Tcp_Uppercase",
    "cmd": "cat 08_tcp_upper_client.c",
    "lang": "C",
    "fileName": "08_tcp_upper_client.c",
    "description": "TCP Uppercase Client",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    int n;\n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    if (connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Connect failed\");\n        exit(1);\n    }\n    printf(\"Connected to Uppercase Server. Enter lowercase strings (type 'exit' to quit):\\n\");\n    while (1) {\n        printf(\"Enter string: \");\n        fgets(buffer, MAXLINE, stdin);\n        buffer[strcspn(buffer, \"\\n\")] = '\\0';\n        if (strcmp(buffer, \"exit\") == 0)\n            break;\n        write(sockfd, buffer, strlen(buffer));\n        memset(buffer, 0, MAXLINE);\n        n = read(sockfd, buffer, MAXLINE);\n        buffer[n] = '\\0';\n        printf(\"Uppercase: %s\\n\", buffer);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q9a",
    "num": "09",
    "title": "Write a TCP client-server program for user login authentication using a username and password.",
    "folderName": "q9_Tcp_Auth",
    "cmd": "cat 09_tcp_login_server.c",
    "lang": "C",
    "fileName": "09_tcp_login_server.c",
    "description": "TCP Login Authentication Server",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\n#define MAX_USERS 3\nstruct User {\n    char username[50];\n    char password[50];\n};\nstruct User users[MAX_USERS] = {\n    {\"admin\", \"admin123\"},\n    {\"user1\", \"pass123\"},\n    {\"student\", \"student456\"}\n};\nint authenticate(char *username, char *password) {\n    int i;\n    for (i = 0; i < MAX_USERS; i++) {\n        if (strcmp(users[i].username, username) == 0 &&\n            strcmp(users[i].password, password) == 0) {\n            return 1;  \n        }\n    }\n    return 0;  \n}\nint main() {\n    int listenfd, connfd;\n    char buffer[MAXLINE];\n    char username[50], password[50];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t clilen;\n    int n;\n    listenfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (listenfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    int opt = 1;\n    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    listen(listenfd, 5);\n    printf(\"TCP Login Server started on port %d...\\n\", PORT);\n    printf(\"Valid users: admin/admin123, user1/pass123, student/student456\\n\\n\");\n    while (1) {\n        clilen = sizeof(cliaddr);\n        connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &clilen);\n        if (connfd < 0) {\n            perror(\"Accept failed\");\n            continue;\n        }\n        printf(\"Client connected from %s:%d\\n\",\n               inet_ntoa(cliaddr.sin_addr), ntohs(cliaddr.sin_port));\n        memset(username, 0, sizeof(username));\n        n = read(connfd, username, sizeof(username));\n        username[n] = '\\0';\n        printf(\"Username received: %s\\n\", username);\n        memset(password, 0, sizeof(password));\n        n = read(connfd, password, sizeof(password));\n        password[n] = '\\0';\n        printf(\"Password received: ****\\n\");\n        if (authenticate(username, password)) {\n            write(connfd, \"LOGIN SUCCESS\", 13);\n            printf(\"Result: Authentication successful!\\n\\n\");\n        } else {\n            write(connfd, \"LOGIN FAILED\", 12);\n            printf(\"Result: Authentication failed!\\n\\n\");\n        }\n        close(connfd);\n    }\n    close(listenfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q9b",
    "num": "09",
    "title": "Write a TCP client-server program for user login authentication using a username and password.",
    "folderName": "q9_Tcp_Auth",
    "cmd": "cat 09_tcp_login_client.c",
    "lang": "C",
    "fileName": "09_tcp_login_client.c",
    "description": "TCP Login Authentication Client",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    char username[50], password[50];\n    struct sockaddr_in servaddr;\n    int n;\n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    if (connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Connect failed\");\n        exit(1);\n    }\n    printf(\"=== Login Authentication ===\\n\");\n    printf(\"Enter username: \");\n    scanf(\"%s\", username);\n    write(sockfd, username, strlen(username));\n    usleep(100000); \n    printf(\"Enter password: \");\n    scanf(\"%s\", password);\n    write(sockfd, password, strlen(password));\n    memset(buffer, 0, MAXLINE);\n    n = read(sockfd, buffer, MAXLINE);\n    buffer[n] = '\\0';\n    printf(\"\\nServer Response: %s\\n\", buffer);\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q10a",
    "num": "10",
    "title": "Write a UDP client-server program to find the largest number among a set of numbers sent by the client.",
    "folderName": "q10_Udp_Largest",
    "cmd": "cat 10_udp_largest_server.c",
    "lang": "C",
    "fileName": "10_udp_largest_server.c",
    "description": "UDP Find Largest Number - Server",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE], result[MAXLINE];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t len;\n    int n, i, count;\n    int numbers[100], largest;\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    printf(\"UDP Largest Number Server started on port %d...\\n\", PORT);\n    while (1) {\n        len = sizeof(cliaddr);\n        memset(buffer, 0, MAXLINE);\n        n = recvfrom(sockfd, buffer, MAXLINE, 0,\n                     (struct sockaddr *)&cliaddr, &len);\n        buffer[n] = '\\0';\n        printf(\"Received numbers: %s\\n\", buffer);\n        count = 0;\n        char *token = strtok(buffer, \" \");\n        while (token != NULL) {\n            numbers[count++] = atoi(token);\n            token = strtok(NULL, \" \");\n        }\n        largest = numbers[0];\n        for (i = 1; i < count; i++) {\n            if (numbers[i] > largest)\n                largest = numbers[i];\n        }\n        sprintf(result, \"Largest number is: %d\", largest);\n        sendto(sockfd, result, strlen(result), 0,\n               (struct sockaddr *)&cliaddr, len);\n        printf(\"Result sent: %s\\n\\n\", result);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q10b",
    "num": "10",
    "title": "Write a UDP client-server program to find the largest number among a set of numbers sent by the client.",
    "folderName": "q10_Udp_Largest",
    "cmd": "cat 10_udp_largest_client.c",
    "lang": "C",
    "fileName": "10_udp_largest_client.c",
    "description": "UDP Find Largest Number - Client",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    socklen_t len;\n    int n, i, count, num;\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    printf(\"Enter how many numbers: \");\n    scanf(\"%d\", &count);\n    memset(buffer, 0, MAXLINE);\n    for (i = 0; i < count; i++) {\n        printf(\"Enter number %d: \", i + 1);\n        scanf(\"%d\", &num);\n        char temp[20];\n        sprintf(temp, \"%d \", num);\n        strcat(buffer, temp);\n    }\n    printf(\"Sending numbers: %s\\n\", buffer);\n    sendto(sockfd, buffer, strlen(buffer), 0,\n           (struct sockaddr *)&servaddr, sizeof(servaddr));\n    len = sizeof(servaddr);\n    memset(buffer, 0, MAXLINE);\n    n = recvfrom(sockfd, buffer, MAXLINE, 0,\n                 (struct sockaddr *)&servaddr, &len);\n    buffer[n] = '\\0';\n    printf(\"Server Response: %s\\n\", buffer);\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q11",
    "num": "11",
    "title": "write a c code for perform SELECT() system call",
    "folderName": "q11_Select_System",
    "cmd": "cat 11_select_demo.c",
    "lang": "C",
    "fileName": "11_select_demo.c",
    "description": "SELECT() System Call Demo",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <sys/select.h>\n#include <sys/time.h>\n#define MAXLINE 1024\nint main() {\n    fd_set readfds;           \n    struct timeval timeout;   \n    char buffer[MAXLINE];\n    int retval, n;\n    printf(\"=== SELECT() System Call Demo ===\\n\");\n    printf(\"select() allows a program to wait for I/O operations on\\n\");\n    printf(\"multiple file descriptors simultaneously and determine\\n\");\n    printf(\"which ones are ready for reading or writing.\\n\\n\");\n    printf(\"Waiting for input on STDIN (fd 0) with 5-second timeout...\\n\");\n    printf(\"Type something and press Enter, or wait 5 seconds:\\n\\n\");\n    FD_ZERO(&readfds);\n    FD_SET(0, &readfds);  \n    timeout.tv_sec = 5;   \n    timeout.tv_usec = 0;  \n    retval = select(1, &readfds, NULL, NULL, &timeout);\n    if (retval == -1) {\n        perror(\"select() error\");\n        exit(1);\n    } else if (retval == 0) {\n        printf(\"Time out\\n\");\n    } else {\n        if (FD_ISSET(0, &readfds)) {\n            memset(buffer, 0, MAXLINE);\n            n = read(0, buffer, MAXLINE);  \n            buffer[n] = '\\0';\n            printf(\"You typed: %s\", buffer);\n        }\n    }\n    printf(\"\\n=== select() Summary ===\\n\");\n    printf(\"select() returned: %d\\n\", retval);\n    printf(\"  -1 = error\\n\");\n    printf(\"   0 = timeout (no fd ready)\\n\");\n    printf(\"  >0 = number of ready file descriptors\\n\");\n    return 0;\n}"
  },
  {
    "id": "cn-q12",
    "num": "12",
    "title": "Write a C code snippet to set a receive timeout of 10 second on a socket using setssockopt()",
    "folderName": "q12_Snippet_Receive",
    "cmd": "cat 12_recv_timeout.c",
    "lang": "C",
    "fileName": "12_recv_timeout.c",
    "description": "setsockopt() - Set Receive Timeout of 10 seconds",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#include <sys/socket.h>\n#include <errno.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    struct timeval tv;\n    socklen_t len;\n    int n;\n    printf(\"=== setsockopt() - Receive Timeout Demo ===\\n\\n\");\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    printf(\"Socket created successfully (fd = %d)\\n\", sockfd);\n    tv.tv_sec = 10;   \n    tv.tv_usec = 0;   \n    if (setsockopt(sockfd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv)) < 0) {\n        perror(\"setsockopt SO_RCVTIMEO failed\");\n        exit(1);\n    }\n    printf(\"Receive timeout set to 10 seconds using setsockopt()\\n\");\n    len = sizeof(tv);\n    getsockopt(sockfd, SOL_SOCKET, SO_RCVTIMEO, &tv, &len);\n    printf(\"Verified: Receive timeout = %ld sec, %ld usec\\n\\n\",\n           tv.tv_sec, tv.tv_usec);\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    printf(\"Waiting for data (will timeout after 10 seconds)...\\n\");\n    struct sockaddr_in cliaddr;\n    len = sizeof(cliaddr);\n    n = recvfrom(sockfd, buffer, MAXLINE, 0,\n                 (struct sockaddr *)&cliaddr, &len);\n    if (n < 0) {\n        if (errno == EAGAIN || errno == EWOULDBLOCK) {\n            printf(\"Receive TIMED OUT after 10 seconds (as expected).\\n\");\n        } else {\n            perror(\"recvfrom error\");\n        }\n    } else {\n        buffer[n] = '\\0';\n        printf(\"Received: %s\\n\", buffer);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q13",
    "num": "13",
    "title": "write a  C code setsockopt() to increase send buffer size of a socket to 1024 bytes.",
    "folderName": "q13_Setsockopt_Increase",
    "cmd": "cat 13_send_buffer.c",
    "lang": "C",
    "fileName": "13_send_buffer.c",
    "description": "setsockopt() - Increase Send Buffer Size to 1024 bytes",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <sys/socket.h>\n#include <arpa/inet.h>\nint main() {\n    int sockfd;\n    int send_buf_size;\n    socklen_t optlen;\n    printf(\"=== setsockopt() - Send Buffer Size Demo ===\\n\\n\");\n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    printf(\"Socket created successfully (fd = %d)\\n\", sockfd);\n    optlen = sizeof(send_buf_size);\n    getsockopt(sockfd, SOL_SOCKET, SO_SNDBUF, &send_buf_size, &optlen);\n    printf(\"Default send buffer size: %d bytes\\n\", send_buf_size);\n    send_buf_size = 1024;\n    if (setsockopt(sockfd, SOL_SOCKET, SO_SNDBUF, &send_buf_size, sizeof(send_buf_size)) < 0) {\n        perror(\"setsockopt SO_SNDBUF failed\");\n        exit(1);\n    }\n    printf(\"Send buffer size set to 1024 bytes using setsockopt()\\n\");\n    optlen = sizeof(send_buf_size);\n    getsockopt(sockfd, SOL_SOCKET, SO_SNDBUF, &send_buf_size, &optlen);\n    printf(\"Verified send buffer size: %d bytes\\n\", send_buf_size);\n    printf(\"(Note: Kernel may double the requested value for internal use)\\n\");\n    close(sockfd);\n    printf(\"\\nSocket closed. Program completed.\\n\");\n    return 0;\n}"
  },
  {
    "id": "cn-q14",
    "num": "14",
    "title": "Write a code to differentiate readv() / writev() , to enable scatter read and gather write operations.",
    "folderName": "q14_Readv_Writev",
    "cmd": "cat 14_readv_writev.c",
    "lang": "C",
    "fileName": "14_readv_writev.c",
    "description": "readv() and writev() - Scatter Read and Gather Write",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <fcntl.h>\n#include <sys/uio.h>  \nint main() {\n    int fd;\n    ssize_t bytes_written, bytes_read;\n    printf(\"=== readv() / writev() - Scatter Read and Gather Write ===\\n\\n\");\n    printf(\"--- writev() (Gather Write) ---\\n\");\n    printf(\"Writes data from MULTIPLE buffers into a SINGLE file in one call.\\n\\n\");\n    char buf1[] = \"Hello, \";\n    char buf2[] = \"this is a \";\n    char buf3[] = \"gather write demo!\\n\";\n    struct iovec iov_write[3];\n    iov_write[0].iov_base = buf1;\n    iov_write[0].iov_len = strlen(buf1);\n    iov_write[1].iov_base = buf2;\n    iov_write[1].iov_len = strlen(buf2);\n    iov_write[2].iov_base = buf3;\n    iov_write[2].iov_len = strlen(buf3);\n    fd = open(\"test_writev.txt\", O_WRONLY | O_CREAT | O_TRUNC, 0644);\n    if (fd < 0) {\n        perror(\"open failed\");\n        exit(1);\n    }\n    bytes_written = writev(fd, iov_write, 3);\n    printf(\"writev(): Wrote %zd bytes from 3 buffers into file\\n\", bytes_written);\n    printf(\"  Buffer 1: \\\"%s\\\" (%zu bytes)\\n\", buf1, strlen(buf1));\n    printf(\"  Buffer 2: \\\"%s\\\" (%zu bytes)\\n\", buf2, strlen(buf2));\n    printf(\"  Buffer 3: \\\"%s\\\" (%zu bytes)\\n\", buf3, strlen(buf3));\n    close(fd);\n    printf(\"\\n--- readv() (Scatter Read) ---\\n\");\n    printf(\"Reads data from a SINGLE file into MULTIPLE buffers in one call.\\n\\n\");\n    char rbuf1[8];   \n    char rbuf2[11];  \n    char rbuf3[20];  \n    memset(rbuf1, 0, sizeof(rbuf1));\n    memset(rbuf2, 0, sizeof(rbuf2));\n    memset(rbuf3, 0, sizeof(rbuf3));\n    struct iovec iov_read[3];\n    iov_read[0].iov_base = rbuf1;\n    iov_read[0].iov_len = 7;   \n    iov_read[1].iov_base = rbuf2;\n    iov_read[1].iov_len = 10;  \n    iov_read[2].iov_base = rbuf3;\n    iov_read[2].iov_len = 19;  \n    fd = open(\"test_writev.txt\", O_RDONLY);\n    if (fd < 0) {\n        perror(\"open failed\");\n        exit(1);\n    }\n    bytes_read = readv(fd, iov_read, 3);\n    printf(\"readv(): Read %zd bytes into 3 buffers from file\\n\", bytes_read);\n    printf(\"  Buffer 1: \\\"%s\\\" (7 bytes)\\n\", rbuf1);\n    printf(\"  Buffer 2: \\\"%s\\\" (10 bytes)\\n\", rbuf2);\n    printf(\"  Buffer 3: \\\"%s\\\" (19 bytes)\\n\", rbuf3);\n    close(fd);\n    printf(\"\\n=== Comparison: readv/writev vs read/write ===\\n\");\n    printf(\"+-----------+----------------------------------+\\n\");\n    printf(\"| Function  | Description                      |\\n\");\n    printf(\"+-----------+----------------------------------+\\n\");\n    printf(\"| write()   | Writes from ONE buffer           |\\n\");\n    printf(\"| writev()  | Writes from MULTIPLE buffers     |\\n\");\n    printf(\"|           | (Gather Write - gathers data     |\\n\");\n    printf(\"|           |  from multiple sources)           |\\n\");\n    printf(\"+-----------+----------------------------------+\\n\");\n    printf(\"| read()    | Reads into ONE buffer            |\\n\");\n    printf(\"| readv()   | Reads into MULTIPLE buffers      |\\n\");\n    printf(\"|           | (Scatter Read - scatters data     |\\n\");\n    printf(\"|           |  into multiple destinations)      |\\n\");\n    printf(\"+-----------+----------------------------------+\\n\");\n    printf(\"\\nAdvantage: Fewer system calls = better performance!\\n\");\n    remove(\"test_writev.txt\");\n    return 0;\n}\n15 ) write Mini DNS"
  },
  {
    "id": "cn-q15",
    "num": "14",
    "title": "Write a code to differentiate readv() / writev() , to enable scatter read and gather write operations.",
    "folderName": "q14_Readv_Writev",
    "cmd": "cat 15_mini_dns.c",
    "lang": "C",
    "fileName": "15_mini_dns.c",
    "description": "Mini DNS Resolver",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <netdb.h>\n#include <arpa/inet.h>\n#include <sys/socket.h>\n#define MAX_HOSTNAME 256\nint main() {\n    char hostname[MAX_HOSTNAME];\n    struct addrinfo hints, *res, *p;\n    char ipstr[INET6_ADDRSTRLEN];\n    int status;\n    printf(\"=== Mini DNS Resolver ===\\n\");\n    printf(\"Resolves domain names to IP addresses.\\n\\n\");\n    printf(\"Enter domain name (e.g., www.google.com): \");\n    scanf(\"%s\", hostname);\n    memset(&hints, 0, sizeof(hints));\n    hints.ai_family = AF_UNSPEC;      \n    hints.ai_socktype = SOCK_STREAM;  \n    printf(\"\\nResolving '%s'...\\n\\n\", hostname);\n    status = getaddrinfo(hostname, NULL, &hints, &res);\n    if (status != 0) {\n        fprintf(stderr, \"DNS resolution failed: %s\\n\", gai_strerror(status));\n        exit(1);\n    }\n    printf(\"IP Addresses for %s:\\n\", hostname);\n    printf(\"------------------------------\\n\");\n    int count = 0;\n    for (p = res; p != NULL; p = p->ai_next) {\n        void *addr;\n        char *ipver;\n        if (p->ai_family == AF_INET) {\n            struct sockaddr_in *ipv4 = (struct sockaddr_in *)p->ai_addr;\n            addr = &(ipv4->sin_addr);\n            ipver = \"IPv4\";\n        } else {\n            struct sockaddr_in6 *ipv6 = (struct sockaddr_in6 *)p->ai_addr;\n            addr = &(ipv6->sin6_addr);\n            ipver = \"IPv6\";\n        }\n        inet_ntop(p->ai_family, addr, ipstr, sizeof(ipstr));\n        printf(\"  %s: %s\\n\", ipver, ipstr);\n        count++;\n    }\n    printf(\"------------------------------\\n\");\n    printf(\"Total addresses found: %d\\n\", count);\n    printf(\"\\n--- Reverse DNS Lookup ---\\n\");\n    if (res != NULL) {\n        char host[NI_MAXHOST];\n        status = getnameinfo(res->ai_addr, res->ai_addrlen,\n                             host, sizeof(host), NULL, 0, 0);\n        if (status == 0) {\n            printf(\"Reverse lookup: %s\\n\", host);\n        } else {\n            printf(\"Reverse lookup failed: %s\\n\", gai_strerror(status));\n        }\n    }\n    freeaddrinfo(res);\n    return 0;\n}"
  },
  {
    "id": "cn-q16",
    "num": "16",
    "title": "Write  Traceroute ( max 30 hops )",
    "folderName": "q16_Traceroute_Max_30_Hops",
    "cmd": "cat 16_traceroute.c",
    "lang": "C",
    "fileName": "16_traceroute.c",
    "description": "Mini Traceroute (Max 30 Hops)",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#include <netinet/ip.h>\n#include <netinet/ip_icmp.h>\n#include <netdb.h>\n#include <sys/time.h>\n#include <sys/socket.h>\n#include <errno.h>\n#define MAX_HOPS 30\n#define PACKET_SIZE 64\n#define TIMEOUT 3  \nunsigned short checksum(void *b, int len) {\n    unsigned short *buf = b;\n    unsigned int sum = 0;\n    unsigned short result;\n    for (sum = 0; len > 1; len -= 2)\n        sum += *buf++;\n    if (len == 1)\n        sum += *(unsigned char *)buf;\n    sum = (sum >> 16) + (sum & 0xFFFF);\n    sum += (sum >> 16);\n    result = ~sum;\n    return result;\n}\nint main() {\n    char hostname[256];\n    struct sockaddr_in dest, recv_addr;\n    struct hostent *host;\n    int send_sock, recv_sock;\n    int ttl, seq = 0;\n    char send_buf[PACKET_SIZE], recv_buf[512];\n    struct icmphdr *icmp_hdr;\n    struct timeval tv, start, end;\n    socklen_t addr_len;\n    int n;\n    fd_set fds;\n    printf(\"=== Mini Traceroute (Max %d Hops) ===\\n\\n\", MAX_HOPS);\n    printf(\"Enter destination (e.g., www.google.com): \");\n    scanf(\"%s\", hostname);\n    host = gethostbyname(hostname);\n    if (host == NULL) {\n        fprintf(stderr, \"Could not resolve hostname: %s\\n\", hostname);\n        exit(1);\n    }\n    memset(&dest, 0, sizeof(dest));\n    dest.sin_family = AF_INET;\n    memcpy(&dest.sin_addr, host->h_addr, host->h_length);\n    printf(\"Traceroute to %s (%s), %d hops max\\n\\n\",\n           hostname, inet_ntoa(dest.sin_addr), MAX_HOPS);\n    send_sock = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP);\n    if (send_sock < 0) {\n        perror(\"Socket creation failed (need root/sudo)\");\n        exit(1);\n    }\n    for (ttl = 1; ttl <= MAX_HOPS; ttl++) {\n        setsockopt(send_sock, IPPROTO_IP, IP_TTL, &ttl, sizeof(ttl));\n        memset(send_buf, 0, PACKET_SIZE);\n        icmp_hdr = (struct icmphdr *)send_buf;\n        icmp_hdr->type = ICMP_ECHO;\n        icmp_hdr->code = 0;\n        icmp_hdr->un.echo.id = getpid();\n        icmp_hdr->un.echo.sequence = seq++;\n        icmp_hdr->checksum = 0;\n        icmp_hdr->checksum = checksum(send_buf, PACKET_SIZE);\n        gettimeofday(&start, NULL);\n        if (sendto(send_sock, send_buf, PACKET_SIZE, 0,\n                   (struct sockaddr *)&dest, sizeof(dest)) < 0) {\n            perror(\"sendto failed\");\n            continue;\n        }\n        FD_ZERO(&fds);\n        FD_SET(send_sock, &fds);\n        tv.tv_sec = TIMEOUT;\n        tv.tv_usec = 0;\n        int ret = select(send_sock + 1, &fds, NULL, NULL, &tv);\n        if (ret == 0) {\n            printf(\"%2d  *  *  * (Request timed out)\\n\", ttl);\n            continue;\n        }\n        if (ret < 0) {\n            perror(\"select failed\");\n            continue;\n        }\n        addr_len = sizeof(recv_addr);\n        n = recvfrom(send_sock, recv_buf, sizeof(recv_buf), 0,\n                     (struct sockaddr *)&recv_addr, &addr_len);\n        gettimeofday(&end, NULL);\n        if (n < 0) {\n            printf(\"%2d  *  *  * (No reply)\\n\", ttl);\n            continue;\n        }\n        double rtt = (end.tv_sec - start.tv_sec) * 1000.0 +\n                     (end.tv_usec - start.tv_usec) / 1000.0;\n        char router_name[NI_MAXHOST];\n        int name_ret = getnameinfo((struct sockaddr *)&recv_addr, addr_len,\n                                   router_name, sizeof(router_name),\n                                   NULL, 0, 0);\n        if (name_ret == 0) {\n            printf(\"%2d  %s (%s)  %.3f ms\\n\", ttl,\n                   router_name, inet_ntoa(recv_addr.sin_addr), rtt);\n        } else {\n            printf(\"%2d  %s  %.3f ms\\n\", ttl,\n                   inet_ntoa(recv_addr.sin_addr), rtt);\n        }\n        if (recv_addr.sin_addr.s_addr == dest.sin_addr.s_addr) {\n            printf(\"\\nTrace complete. Destination reached!\\n\");\n            break;\n        }\n    }\n    if (ttl > MAX_HOPS)\n        printf(\"\\nMax hops (%d) reached. Destination not reached.\\n\", MAX_HOPS);\n    close(send_sock);\n    return 0;\n}"
  },
  {
    "id": "cn-q17",
    "num": "17",
    "title": "Write  PING routine( mini )",
    "folderName": "q17_Ping_Routine_Mini",
    "cmd": "cat 17_ping.c",
    "lang": "C",
    "fileName": "17_ping.c",
    "description": "Mini PING",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#include <netinet/ip.h>\n#include <netinet/ip_icmp.h>\n#include <netdb.h>\n#include <sys/time.h>\n#include <sys/socket.h>\n#include <signal.h>\n#define PACKET_SIZE 64\n#define PING_COUNT 5\nint ping_count = 0;\nint recv_count = 0;\nunsigned short checksum(void *b, int len) {\n    unsigned short *buf = b;\n    unsigned int sum = 0;\n    unsigned short result;\n    for (sum = 0; len > 1; len -= 2)\n        sum += *buf++;\n    if (len == 1)\n        sum += *(unsigned char *)buf;\n    sum = (sum >> 16) + (sum & 0xFFFF);\n    sum += (sum >> 16);\n    result = ~sum;\n    return result;\n}\nint main() {\n    char hostname[256];\n    struct sockaddr_in dest_addr, recv_addr;\n    struct hostent *host;\n    int sockfd;\n    char send_buf[PACKET_SIZE], recv_buf[512];\n    struct icmphdr *icmp_hdr;\n    struct timeval start, end, tv;\n    socklen_t addr_len;\n    int i, n;\n    printf(\"=== Mini PING ===\\n\\n\");\n    printf(\"Enter hostname or IP (e.g., www.google.com): \");\n    scanf(\"%s\", hostname);\n    host = gethostbyname(hostname);\n    if (host == NULL) {\n        fprintf(stderr, \"Could not resolve: %s\\n\", hostname);\n        exit(1);\n    }\n    memset(&dest_addr, 0, sizeof(dest_addr));\n    dest_addr.sin_family = AF_INET;\n    memcpy(&dest_addr.sin_addr, host->h_addr, host->h_length);\n    printf(\"PING %s (%s): %d bytes data\\n\\n\",\n           hostname, inet_ntoa(dest_addr.sin_addr), PACKET_SIZE);\n    sockfd = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed (need root/sudo)\");\n        exit(1);\n    }\n    tv.tv_sec = 2;\n    tv.tv_usec = 0;\n    setsockopt(sockfd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));\n    double total_rtt = 0, min_rtt = 99999, max_rtt = 0;\n    for (i = 0; i < PING_COUNT; i++) {\n        memset(send_buf, 0, PACKET_SIZE);\n        icmp_hdr = (struct icmphdr *)send_buf;\n        icmp_hdr->type = ICMP_ECHO;\n        icmp_hdr->code = 0;\n        icmp_hdr->un.echo.id = getpid();\n        icmp_hdr->un.echo.sequence = i;\n        icmp_hdr->checksum = 0;\n        icmp_hdr->checksum = checksum(send_buf, PACKET_SIZE);\n        gettimeofday(&start, NULL);\n        if (sendto(sockfd, send_buf, PACKET_SIZE, 0,\n                   (struct sockaddr *)&dest_addr, sizeof(dest_addr)) < 0) {\n            perror(\"sendto failed\");\n            continue;\n        }\n        ping_count++;\n        addr_len = sizeof(recv_addr);\n        n = recvfrom(sockfd, recv_buf, sizeof(recv_buf), 0,\n                     (struct sockaddr *)&recv_addr, &addr_len);\n        gettimeofday(&end, NULL);\n        if (n < 0) {\n            printf(\"Request timeout for icmp_seq %d\\n\", i);\n        } else {\n            recv_count++;\n            double rtt = (end.tv_sec - start.tv_sec) * 1000.0 +\n                         (end.tv_usec - start.tv_usec) / 1000.0;\n            total_rtt += rtt;\n            if (rtt < min_rtt) min_rtt = rtt;\n            if (rtt > max_rtt) max_rtt = rtt;\n            struct iphdr *ip_hdr = (struct iphdr *)recv_buf;\n            printf(\"%d bytes from %s: icmp_seq=%d ttl=%d time=%.3f ms\\n\",\n                   n, inet_ntoa(recv_addr.sin_addr), i,\n                   ip_hdr->ttl, rtt);\n        }\n        sleep(1);  \n    }\n    printf(\"\\n--- %s ping statistics ---\\n\", hostname);\n    printf(\"%d packets transmitted, %d received, %.0f%% packet loss\\n\",\n           ping_count, recv_count,\n           ((float)(ping_count - recv_count) / ping_count) * 100);\n    if (recv_count > 0) {\n        printf(\"rtt min/avg/max = %.3f/%.3f/%.3f ms\\n\",\n               min_rtt, total_rtt / recv_count, max_rtt);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q18a",
    "num": "18",
    "title": "input : unsorted elemetns : at client-side Output : sorted elements. : at server side",
    "folderName": "q18_Tcp_Input_Unsorted",
    "cmd": "cat 18_tcp_sort_server.c",
    "lang": "C",
    "fileName": "18_tcp_sort_server.c",
    "description": "TCP Sort Server (Iterative + Concurrent)",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#include <signal.h>\n#include <sys/wait.h>\n#define PORT 8080\n#define MAXLINE 1024\n#define MAX_ELEMENTS 100\nvoid bubble_sort(int arr[], int n) {\n    int i, j, temp;\n    for (i = 0; i < n - 1; i++) {\n        for (j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n}\nvoid handle_client(int connfd) {\n    char buffer[MAXLINE], result[MAXLINE];\n    int arr[MAX_ELEMENTS];\n    int n, count, i;\n    memset(buffer, 0, MAXLINE);\n    n = read(connfd, buffer, MAXLINE);\n    buffer[n] = '\\0';\n    printf(\"Received unsorted: %s\\n\", buffer);\n    count = 0;\n    char *token = strtok(buffer, \" \");\n    while (token != NULL && count < MAX_ELEMENTS) {\n        arr[count++] = atoi(token);\n        token = strtok(NULL, \" \");\n    }\n    bubble_sort(arr, count);\n    memset(result, 0, MAXLINE);\n    for (i = 0; i < count; i++) {\n        char temp[20];\n        sprintf(temp, \"%d \", arr[i]);\n        strcat(result, temp);\n    }\n    printf(\"Sorted result: %s\\n\", result);\n    write(connfd, result, strlen(result));\n}\nvoid sigchld_handler(int sig) {\n    while (waitpid(-1, NULL, WNOHANG) > 0);\n}\nint main() {\n    int listenfd, connfd;\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t clilen;\n    pid_t pid;\n    signal(SIGCHLD, sigchld_handler);\n    listenfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (listenfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    int opt = 1;\n    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    listen(listenfd, 5);\n    printf(\"TCP Sort Server (Concurrent) started on port %d...\\n\", PORT);\n    while (1) {\n        clilen = sizeof(cliaddr);\n        connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &clilen);\n        if (connfd < 0) {\n            perror(\"Accept failed\");\n            continue;\n        }\n        printf(\"Client connected: %s:%d\\n\",\n               inet_ntoa(cliaddr.sin_addr), ntohs(cliaddr.sin_port));\n        pid = fork();\n        if (pid == 0) {\n            close(listenfd);\n            handle_client(connfd);\n            close(connfd);\n            exit(0);\n        } else {\n            close(connfd);\n        }\n    }\n    close(listenfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q18b",
    "num": "18",
    "title": "input : unsorted elemetns : at client-side Output : sorted elements. : at server side",
    "folderName": "q18_Tcp_Input_Unsorted",
    "cmd": "cat 18_tcp_sort_client.c",
    "lang": "C",
    "fileName": "18_tcp_sort_client.c",
    "description": "TCP Sort Client",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    int n, i, count, num;\n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    if (connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Connect failed\");\n        exit(1);\n    }\n    printf(\"=== TCP Sort Client ===\\n\");\n    printf(\"Enter number of elements: \");\n    scanf(\"%d\", &count);\n    memset(buffer, 0, MAXLINE);\n    for (i = 0; i < count; i++) {\n        printf(\"Enter element %d: \", i + 1);\n        scanf(\"%d\", &num);\n        char temp[20];\n        sprintf(temp, \"%d \", num);\n        strcat(buffer, temp);\n    }\n    printf(\"\\nUnsorted elements sent: %s\\n\", buffer);\n    write(sockfd, buffer, strlen(buffer));\n    memset(buffer, 0, MAXLINE);\n    n = read(sockfd, buffer, MAXLINE);\n    buffer[n] = '\\0';\n    printf(\"Sorted elements from server: %s\\n\", buffer);\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q19a",
    "num": "19",
    "title": "input : unsorted elemetns : at client side Output : sorted elements. : at server side",
    "folderName": "q19_Udp_Input_Unsorted",
    "cmd": "cat 19_udp_sort_server.c",
    "lang": "C",
    "fileName": "19_udp_sort_server.c",
    "description": "UDP Sort Server",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\n#define MAX_ELEMENTS 100\nvoid bubble_sort(int arr[], int n) {\n    int i, j, temp;\n    for (i = 0; i < n - 1; i++) {\n        for (j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n}\nint main() {\n    int sockfd;\n    char buffer[MAXLINE], result[MAXLINE];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t len;\n    int n, count, i;\n    int arr[MAX_ELEMENTS];\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    printf(\"UDP Sort Server started on port %d...\\n\", PORT);\n    while (1) {\n        len = sizeof(cliaddr);\n        memset(buffer, 0, MAXLINE);\n        n = recvfrom(sockfd, buffer, MAXLINE, 0,\n                     (struct sockaddr *)&cliaddr, &len);\n        buffer[n] = '\\0';\n        printf(\"Received unsorted: %s\\n\", buffer);\n        count = 0;\n        char temp_buf[MAXLINE];\n        strcpy(temp_buf, buffer);\n        char *token = strtok(temp_buf, \" \");\n        while (token != NULL && count < MAX_ELEMENTS) {\n            arr[count++] = atoi(token);\n            token = strtok(NULL, \" \");\n        }\n        bubble_sort(arr, count);\n        memset(result, 0, MAXLINE);\n        for (i = 0; i < count; i++) {\n            char temp[20];\n            sprintf(temp, \"%d \", arr[i]);\n            strcat(result, temp);\n        }\n        printf(\"Sorted result: %s\\n\\n\", result);\n        sendto(sockfd, result, strlen(result), 0,\n               (struct sockaddr *)&cliaddr, len);\n    }\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q19b",
    "num": "19",
    "title": "input : unsorted elemetns : at client side Output : sorted elements. : at server side",
    "folderName": "q19_Udp_Input_Unsorted",
    "cmd": "cat 19_udp_sort_client.c",
    "lang": "C",
    "fileName": "19_udp_sort_client.c",
    "description": "UDP Sort Client",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    socklen_t len;\n    int n, i, count, num;\n    sockfd = socket(AF_INET, SOCK_DGRAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    printf(\"=== UDP Sort Client ===\\n\");\n    printf(\"Enter number of elements: \");\n    scanf(\"%d\", &count);\n    memset(buffer, 0, MAXLINE);\n    for (i = 0; i < count; i++) {\n        printf(\"Enter element %d: \", i + 1);\n        scanf(\"%d\", &num);\n        char temp[20];\n        sprintf(temp, \"%d \", num);\n        strcat(buffer, temp);\n    }\n    printf(\"\\nUnsorted elements sent: %s\\n\", buffer);\n    sendto(sockfd, buffer, strlen(buffer), 0,\n           (struct sockaddr *)&servaddr, sizeof(servaddr));\n    len = sizeof(servaddr);\n    memset(buffer, 0, MAXLINE);\n    n = recvfrom(sockfd, buffer, MAXLINE, 0,\n                 (struct sockaddr *)&servaddr, &len);\n    buffer[n] = '\\0';\n    printf(\"Sorted elements from server: %s\\n\", buffer);\n    close(sockfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q20a",
    "num": "20",
    "title": ".  Input : searching an element in a list of 10 sorted elements Output : set of 10 sorted elements Use either TCP / UDP system calls",
    "folderName": "q20_Input_Search",
    "cmd": "cat 20_tcp_search_server.c",
    "lang": "C",
    "fileName": "20_tcp_search_server.c",
    "description": "TCP Binary Search Server",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\nint binary_search(int arr[], int n, int key) {\n    int low = 0, high = n - 1, mid;\n    while (low <= high) {\n        mid = (low + high) / 2;\n        if (arr[mid] == key)\n            return mid;  \n        else if (arr[mid] < key)\n            low = mid + 1;\n        else\n            high = mid - 1;\n    }\n    return -1;  \n}\nint main() {\n    int listenfd, connfd;\n    char buffer[MAXLINE], result[MAXLINE];\n    struct sockaddr_in servaddr, cliaddr;\n    socklen_t clilen;\n    int n, i;\n    listenfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (listenfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    int opt = 1;\n    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_addr.s_addr = INADDR_ANY;\n    servaddr.sin_port = htons(PORT);\n    if (bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Bind failed\");\n        exit(1);\n    }\n    listen(listenfd, 5);\n    printf(\"TCP Binary Search Server started on port %d...\\n\", PORT);\n    while (1) {\n        clilen = sizeof(cliaddr);\n        connfd = accept(listenfd, (struct sockaddr *)&cliaddr, &clilen);\n        if (connfd < 0) {\n            perror(\"Accept failed\");\n            continue;\n        }\n        printf(\"Client connected.\\n\");\n        memset(buffer, 0, MAXLINE);\n        n = read(connfd, buffer, MAXLINE);\n        buffer[n] = '\\0';\n        printf(\"Received: %s\\n\", buffer);\n        int arr[100], count = 0, key;\n        char *token = strtok(buffer, \" \");\n        count = atoi(token);\n        for (i = 0; i < count; i++) {\n            token = strtok(NULL, \" \");\n            if (token)\n                arr[i] = atoi(token);\n        }\n        token = strtok(NULL, \" \");\n        if (token)\n            key = atoi(token);\n        printf(\"Sorted elements: \");\n        for (i = 0; i < count; i++)\n            printf(\"%d \", arr[i]);\n        printf(\"\\nSearching for: %d\\n\", key);\n        int pos = binary_search(arr, count, key);\n        if (pos != -1) {\n            sprintf(result, \"Element %d FOUND at position %d (0-indexed) in the sorted list.\", key, pos);\n        } else {\n            sprintf(result, \"Element %d NOT FOUND in the sorted list.\", key);\n        }\n        char sorted_str[MAXLINE];\n        memset(sorted_str, 0, MAXLINE);\n        strcat(sorted_str, \"Sorted elements: \");\n        for (i = 0; i < count; i++) {\n            char temp[20];\n            sprintf(temp, \"%d \", arr[i]);\n            strcat(sorted_str, temp);\n        }\n        strcat(sorted_str, \"\\n\");\n        strcat(sorted_str, result);\n        printf(\"Result: %s\\n\\n\", result);\n        write(connfd, sorted_str, strlen(sorted_str));\n        close(connfd);\n    }\n    close(listenfd);\n    return 0;\n}"
  },
  {
    "id": "cn-q20b",
    "num": "20",
    "title": ".  Input : searching an element in a list of 10 sorted elements Output : set of 10 sorted elements Use either TCP / UDP system calls",
    "folderName": "q20_Input_Search",
    "cmd": "cat 20_tcp_search_client.c",
    "lang": "C",
    "fileName": "20_tcp_search_client.c",
    "description": "TCP Binary Search Client",
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <arpa/inet.h>\n#define PORT 8080\n#define MAXLINE 1024\n#define NUM_ELEMENTS 10\nint main() {\n    int sockfd;\n    char buffer[MAXLINE];\n    struct sockaddr_in servaddr;\n    int n, i, key;\n    int arr[NUM_ELEMENTS];\n    sockfd = socket(AF_INET, SOCK_STREAM, 0);\n    if (sockfd < 0) {\n        perror(\"Socket creation failed\");\n        exit(1);\n    }\n    memset(&servaddr, 0, sizeof(servaddr));\n    servaddr.sin_family = AF_INET;\n    servaddr.sin_port = htons(PORT);\n    servaddr.sin_addr.s_addr = inet_addr(\"127.0.0.1\");\n    if (connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {\n        perror(\"Connect failed\");\n        exit(1);\n    }\n    printf(\"=== TCP Binary Search Client ===\\n\");\n    printf(\"Enter %d sorted elements:\\n\", NUM_ELEMENTS);\n    for (i = 0; i < NUM_ELEMENTS; i++) {\n        printf(\"Element %d: \", i + 1);\n        scanf(\"%d\", &arr[i]);\n    }\n    printf(\"Enter element to search: \");\n    scanf(\"%d\", &key);\n    memset(buffer, 0, MAXLINE);\n    sprintf(buffer, \"%d \", NUM_ELEMENTS);\n    for (i = 0; i < NUM_ELEMENTS; i++) {\n        char temp[20];\n        sprintf(temp, \"%d \", arr[i]);\n        strcat(buffer, temp);\n    }\n    char temp[20];\n    sprintf(temp, \"%d\", key);\n    strcat(buffer, temp);\n    printf(\"\\nSending to server: %s\\n\", buffer);\n    write(sockfd, buffer, strlen(buffer));\n    memset(buffer, 0, MAXLINE);\n    n = read(sockfd, buffer, MAXLINE);\n    buffer[n] = '\\0';\n    printf(\"\\nServer Response:\\n%s\\n\", buffer);\n    close(sockfd);\n    return 0;\n}"
  }
];

export const allLabs: Record<string, LabExperiment[]> = {
  cd: cdLabData,
  dl: dlLabData,
  cn: cnLabData
};
