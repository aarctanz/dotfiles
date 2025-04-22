#include <signal.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void)
{
    pid_t pid;
    printf("Parent process id %d\n", getpid());
    pid = fork();
    if(pid<0){
        perror("Error creating a process.");
        exit(1);
    }

    if(pid==0){
        printf("Executing child process %d.\n", getpid());
        execl("./hello","", (char *)NULL);
    }else {
        int status;
        printf("Parent process: Waiting for child to finish...\n");
        
        wait(&status);
        if (WIFEXITED(status)) {
            printf("Parent process: Child exited with status %d\n", WEXITSTATUS(status));
        }
    }
}