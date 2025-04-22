#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NAME_LENGTH 256
#define MAX_CHILDREN 100

typedef struct File
{
    char name[MAX_NAME_LENGTH];
    size_t size;
} File;

typedef struct Directory
{
    char name[MAX_NAME_LENGTH];
    struct Directory *parent;
    struct Directory *children[MAX_CHILDREN];
    int numChildren;
    File *files[MAX_CHILDREN];
    int numFiles;
} Directory;

Directory *createDirectory(const char *name, Directory *parent)
{
    Directory *dir = (Directory *)malloc(sizeof(Directory));
    if (!dir)
        return NULL;
    strncpy(dir->name, name, MAX_NAME_LENGTH - 1);
    dir->parent = parent;
    dir->numChildren = 0;
    dir->numFiles = 0;
    if (parent && parent->numChildren < MAX_CHILDREN)
    {
        parent->children[parent->numChildren++] = dir;
    }
    return dir;
}

File *createFile(const char *name, size_t size, Directory *parent)
{
    if (!parent || parent->numFiles >= MAX_CHILDREN)
        return NULL;
    File *file = (File *)malloc(sizeof(File));
    if (!file)
        return NULL;
    strncpy(file->name, name, MAX_NAME_LENGTH - 1);
    file->size = size;
    parent->files[parent->numFiles++] = file;
    return file;
}

void printDirectoryTree(Directory *dir, int depth)
{
    if (!dir)
        return;
    for (int i = 0; i < depth; i++)
        printf(" ");
    printf("[D] %s/\n", dir->name);
    for (int i = 0; i < dir->numFiles; i++)
    {
        for (int j = 0; j < depth + 1; j++)
            printf(" ");
        printf("[F] %s (%zu bytes)\n", dir->files[i]->name, dir->files[i]->size);
    }
    for (int i = 0; i < dir->numChildren; i++)
    {
        printDirectoryTree(dir->children[i], depth + 1);
    }
}

void freeDirectory(Directory *dir)
{
    if (!dir)
        return;
    for (int i = 0; i < dir->numFiles; i++)
        free(dir->files[i]);
    for (int i = 0; i < dir->numChildren; i++)
        freeDirectory(dir->children[i]);
    free(dir);
}

int main()
{
    // Create root directory
    Directory *root = createDirectory("root", NULL);
    // Create subdirectories
    Directory *home = createDirectory("home", root);
    // Create user home directories
    Directory *user1 = createDirectory("adarsh", home);
    Directory *user2 = createDirectory("guest", home);
    // Create files in directories
    Directory *documents = createDirectory("Documents", user1);
    // Create files
    createFile("passwd", 1024, createDirectory("etc", root));
    createFile("welcome.txt", 128, user2);
    createFile("document.txt", 2048, user1);
    createFile("resume.docx", 15360, documents);
    printf("Directory Tree Structure:\n");
    printDirectoryTree(root, 0);
    freeDirectory(root);
    return 0;
}
