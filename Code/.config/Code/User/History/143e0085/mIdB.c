#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdint.h>
#include <signal.h>
#include <errno.h>
#include <stdio.h>  // Add this for perror

#define BUF_SIZE 128  // Use a constant buffer size

int main() {
    int fd = open("hello.txt", O_RDONLY);
    if (fd < 0) {
        perror("Error opening file");
        exit(1);
    }

    char buffer[BUF_SIZE];
    ssize_t bytesRead = read(fd, buffer, BUF_SIZE);
    if (bytesRead < 0) {
        perror("Error reading file");
        close(fd);
        exit(1);
    }

    write(1, buffer, bytesRead);  // Use bytesRead instead of BUF_SIZE
    write(1, "\n", 1);
    close(fd);

    int x = open("qbc.txt", O_APPEND | O_CREAT | O_WRONLY, 0644);
    if (x < 0) {
        perror("Error opening file");
        exit(1);
    }

    if (write(x, "Hello, world\n", 13) == -1) {
        perror("Error writing to file");
        close(x);
        return 1;
    }

    close(x);
    return 0;
}
