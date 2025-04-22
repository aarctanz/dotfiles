#include <stdio.h>
#include <stdlib.h>

typedef struct
{
    int size;
    int lineNo;
    char *text;
} Line;

void freeLines(int n, Line *lines);
void freeText(Text *text);

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

    char *line = (char *)malloc(1 * sizeof(char));
    size_t len;
    int currentLineNo = 1;

    Line *lines = (Line *)malloc(4 * sizeof(Line));
    Text text = {
        .capacity = 4,
        .lines = 0,
        .currentLineNo = 0,
        .lines = lines};

    while ((getline(&line, &len, fp)) != -1)
    {
        Line l = {.size = len, .lineNo = currentLineNo, .text = line};
        if (currentLineNo == text.capacity)
        {
            text.capacity *= 2;
            Line *new = realloc(text.lines, text.capacity);
            if (new == NULL)
            {
                fprintf(stderr, "Failed to allocate memeory.\n");
                //  Free all the memory
                exit(EXIT_FAILURE);
            }

            text.lines = new;
        }
        text.lines[currentLineNo - 1] = l;
        currentLineNo++;
        line = (char *)malloc(1 * sizeof(char));
    }
    text.totalLines = currentLineNo - 1;
    free(line);

    // print all lines from text
    for (int i = 0; i < text.totalLines; i++)
    {
        printf("Line %d: %s", text.lines[i].lineNo, text.lines[i].text);
    }
    
    freeText(&text);
    fclose(fp);
    return 0;
}

void freeLines

void freeText(Text *text)
{
    freeLines(text->totalLines, text->lines);
    free(text->lines);
}