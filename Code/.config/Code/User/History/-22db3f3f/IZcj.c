#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAX_CHILDREN 10
#define MAX_NAME_LENGTH 256

typedef struct DirectoryEntry
{
    char name[MAX_NAME_LENGTH];
    struct DirectoryNode *target;
    int isFile;

} DirectoryEntry;

typedef struct DirectoryNode
{
    char name[MAX_NAME_LENGTH];
    DirectoryEntry *entries[MAX_CHILDREN];
    int entryCount;
} DirectoryNode;

DirectoryNode *createDirectory(const char *name)
{
    DirectoryNode *dir = (DirectoryNode *)malloc(sizeof(DirectoryNode));
    strncpy(dir->name, name, MAX_NAME_LENGTH - 1);
    dir->entryCount = 0;
    return dir;
}

void addEntryToDirectory(DirectoryNode *parent, DirectoryNode *child, const char *name, int isFile)
{
    if (!parent || (!child && !isFile))
        return;
    DirectoryEntry *entry = (DirectoryEntry *)malloc(sizeof(DirectoryEntry));
    strncpy(entry->name, name, MAX_NAME_LENGTH - 1);
    entry->target = child;
    entry->isFile = isFile;
    parent->entries[parent->entryCount++] = entry;
}

void printDirectory(DirectoryNode *dir, int depth)
{
    if (!dir)
        return;
    for (int i = 0; i < depth; i++)
        printf(" ");

    printf("%s/\n", dir->name);
    for (int i = 0; i < dir->entryCount; i++)
    {
        DirectoryEntry *entry = dir->entries[i];
        for (int j = 0; j < depth + 1; j++)
            printf(" ");
        printf("%s%s\n", entry->name, entry->isFile ? "" : "/");
        if (!entry->isFile)
            printDirectory(entry->target, depth + 1);
    }
}

void listAllPaths(DirectoryNode *dir, const char *currentPath)
{
    char newPath[1024];
    for (int i = 0; i < dir->entryCount; i++)
    {
        DirectoryEntry *entry = dir->entries[i];
        sprintf(newPath, "%s/%s", currentPath, entry->name);
        if (entry->isFile)
        {
            printf("%s\n", newPath);
        }
        else
        {
            listAllPaths(entry->target, newPath);
        }
    }
}

int main()
{
    // Create root directory
    DirectoryNode *root = createDirectory("root");
    // Create some directories
    DirectoryNode *home = createDirectory("home");
    DirectoryNode *user1 = createDirectory("rishabh");
    DirectoryNode *user2 = createDirectory("user2");
    DirectoryNode *shared = createDirectory("shared");
    // Add directories to the hierarchy

    addEntryToDirectory(root, home, "home", 0);
    addEntryToDirectory(home, user1, "user1", 0);
    addEntryToDirectory(home, user2, "user2", 0);
    // Shared directories addEntryToDirectory(user1, shared, "shared", 0); addEntryToDirectory(user2, shared, "shared", 0);
    // Add some files
    addEntryToDirectory(user1, NULL, "file1.txt", 1);
    addEntryToDirectory(user2, NULL, "file2.txt", 1);
    // Shared files
    addEntryToDirectory(shared, NULL, "sharedFile.txt", 1);
    // Print the directory structure printf("Directory Structure:\n"); printDirectory(root, 0);
    // List all paths to files printf("\nAll paths to files:\n"); listAllPaths(root, "root");

    return 0;
}
