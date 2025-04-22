#include <stdio.h> 
#include <stdlib.h> 
#include <string.h>

#define MAX_FILES 100
#define MAX_NAME_LENGTH 50

typedef struct
{
    char name[MAX_NAME_LENGTH];
    int size;
    char content[1024];
} File;

typedef struct
{
    File files[MAX_FILES];
    int file_count;
    char name[MAX_NAME_LENGTH];
} SingleLevelDirectory;

SingleLevelDirectory *create_directory(char *name)
{
    SingleLevelDirectory *dir = (SingleLevelDirectory *)malloc(sizeof(SingleLevelDirectory));
    if (dir)
    {
        dir->file_count = 0;
        strncpy(dir->name, name, MAX_NAME_LENGTH - 1);
        dir->name[MAX_NAME_LENGTH - 1] = '\0';
    }
    else
    {
        printf("Memory allocation failed\n");
    }
    return dir;
}

int create_file(SingleLevelDirectory *dir, char *filename, char *content)
{
    if (dir->file_count >= MAX_FILES)
        return -1;
    for (int i = 0; i < dir->file_count; i++)
    {
        if (strcmp(dir->files[i].name, filename) == 0)

            return -1;
    }
    File *new_file = &dir->files[dir->file_count++];
    strncpy(new_file->name, filename, MAX_NAME_LENGTH - 1);
    strncpy(new_file->content, content, sizeof(new_file->content) - 1);
    new_file->size = strlen(content);
    return 0;
}

void list_files(SingleLevelDirectory *dir)
{
    printf("Directory: %s (%d files)\n", dir->name, dir->file_count);
    printf("	\n");
    for (int i = 0; i < dir->file_count; i++)
    {
        printf("File: %s, Size: %d bytes\n", dir->files[i].name, dir->files[i].size);
    }
}

File *find_file(SingleLevelDirectory *dir, char *filename)
{
    for (int i = 0; i < dir->file_count; i++)
    {
        if (strcmp(dir->files[i].name, filename) == 0)
            return &dir->files[i];
    }
    return NULL;
}

int delete_file(SingleLevelDirectory *dir, char *filename)
{
    for (int i = 0; i < dir->file_count; i++)
    {
        if (strcmp(dir->files[i].name, filename) == 0)
        {
            for (; i < dir->file_count - 1; i++)
                dir->files[i] = dir->files[i + 1];
            dir->file_count--;
            return 0;
        }
    }
    return -1;
}

void free_directory(SingleLevelDirectory *dir)
{
    free(dir);
}

int main()
{
    SingleLevelDirectory *root = create_directory("system");
    create_file(root, "file1.txt", "This is file 1");
    create_file(root, "file2.txt", "This is file 2");
    create_file(root, "file3.txt", "This is file 3");
    list_files(root);

    File *found = find_file(root, "file2.txt");
    if (found)
    {
        printf("\nFound file: %s\nContent: %s\n", found->name, found->content);
    }

    printf("\nDeleting file2.txt...\n");
    delete_file(root, "file2.txt");
    list_files(root);
    free_directory(root);

    return 0;
}
