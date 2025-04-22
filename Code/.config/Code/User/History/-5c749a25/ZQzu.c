#include <stdio.h> 
#include <stdlib.h> 
#include <string.h> 
#define MAX_USERS 10
#define MAX_FILES_PER_USER 20
#define MAX_NAME_LENGTH 50


typedef struct{
char name[MAX_NAME_LENGTH]; int size;
char content[1024];
} File;


typedef struct{
char username[MAX_NAME_LENGTH];

File files[MAX_FILES_PER_USER]; int file_count;
} UserDirectory;


typedef struct{
UserDirectory user_dirs[MAX_USERS]; int user_count;
} TwoLevelDirectory;


TwoLevelDirectory *create_two_level_directory(){
TwoLevelDirectory *dir_system = (TwoLevelDirectory *)malloc(sizeof(TwoLevelDirectory)); if (dir_system)
dir_system->user_count = 0; else
printf("Memory allocation failed\n"); return dir_system;
}


int add_user(TwoLevelDirectory *dir_system, char *username){ if (dir_system->user_count >= MAX_USERS)
return -1;
for (int i = 0; i < dir_system->user_count; i++){
if (strcmp(dir_system->user_dirs[i].username, username) == 0) return -1;
}
UserDirectory *new_user = &dir_system->user_dirs[dir_system->user_count++]; strncpy(new_user->username, username, MAX_NAME_LENGTH - 1);
new_user->file_count = 0;
return 0;
}

UserDirectory *get_user_directory(TwoLevelDirectory *dir_system, char *username){ for (int i = 0; i < dir_system->user_count; i++){
if (strcmp(dir_system->user_dirs[i].username, username) == 0) return &dir_system->user_dirs[i];
}
return NULL;
}


int create_file(TwoLevelDirectory *dir_system, char *username, char *filename, char *content){ UserDirectory *user_dir = get_user_directory(dir_system, username);
if (!user_dir || user_dir->file_count >= MAX_FILES_PER_USER) return -1;
for (int i = 0; i < user_dir->file_count; i++){
if (strcmp(user_dir->files[i].name, filename) == 0) return -1;
}
File *new_file = &user_dir->files[user_dir->file_count++]; strncpy(new_file->name, filename, MAX_NAME_LENGTH - 1); strncpy(new_file->content, content, sizeof(new_file->content) - 1); new_file->size = strlen(content);
return 0;
}


void list_user_files(TwoLevelDirectory *dir_system, char *username){ UserDirectory *user_dir = get_user_directory(dir_system, username); if (!user_dir)
return;
printf("User: %s (%d files)\n", user_dir->username, user_dir->file_count); printf("	\n");
for (int i = 0; i < user_dir->file_count; i++){
printf("File: %s, Size: %d bytes\n", user_dir->files[i].name, user_dir->files[i].size);

}}


void list_users(TwoLevelDirectory *dir_system){
printf("System Users (%d users)\n", dir_system->user_count); printf("	\n");
for (int i = 0; i < dir_system->user_count; i++){
printf("User: %s (%d files)\n", dir_system->user_dirs[i].username, dir_system->user_dirs[i].file_count);
}}


void free_two_level_directory(TwoLevelDirectory *dir_system){ free(dir_system);
}


int main(){
// Create the directory system
TwoLevelDirectory *system = create_two_level_directory();


 add_user(system, "user1"); add_user(system, "user2"); add_user(system, "user3");

// Create files for users
create_file(system, "user1", "notes.txt", "User1's notes"); create_file(system, "user1", "data.csv", "User1's data"); create_file(system, "user2", "notes.txt", "User2's notes"); create_file(system, "user3", "photo.jpg", "User3's photo content");

// List all users
list_users(system);

// List files for a specific user printf("\n"); list_user_files(system, "user1");

printf("\n"); list_user_files(system, "user2");

// Free memory
free_two_level_directory(system);


return 0;
}

