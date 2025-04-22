#include <stdio.h>
#include <stdlib.h>

typedef struct
{
    int size;
    int lineNo;
    char *text;
} Line;

void freeLines(int n, Line *lines);

typedef struct
{
    int totalLines;
    int currentLineNo;
    Line *lines;
    int capacity;
} Text;

int main(int argc, char **argv)
{
    if (argc < 2)
    {
        printf("Handle empty buffer\n");
        exit(0);
    }
    FILE *fp = fopen(argv[1], "a+");
    if (fp == NULL)
    {
        perror("fopen");
        exit(EXIT_FAILURE);
    }
    
    // int c = 1;
    // char *line = NULL;
    // size_t len;
    // size_t n;
    // while ((n = getline(&line, &len, fp)) != -1){
    //     printf("Length: %zd, %d:", n,c);
    //     fwrite(line, n, 1, stdout);
    //     c++;
    // }
    // free(line);

    char *line = (char *)malloc(1*sizeof(char));
    size_t len;
    int lineNo = 1;

    Line *lines = (Line *)malloc(4 * sizeof(Line));
    

    while ((getline(&line, &len, fp)) != -1)
    {
        Line l = {.size=len, .lineNo=lineNo, .text=line};

    }
    

    fclose(fp);
    return 0;
}