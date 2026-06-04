export interface LabExperiment {
  id: string;
  num: string;
  title: string;
  cmd: string;
  lang: string;
  fileName: string;
  code: string;
  description: string;
}

export const labData: LabExperiment[] = [
  {
    id: 'q1',
    num: '01',
    title: 'Construction of DFA from NFA',
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
