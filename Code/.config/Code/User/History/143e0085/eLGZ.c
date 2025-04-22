#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdio.h>
#include <errno.h>



int main(){
    int fd = open("hello.txt", O_RDONLY);
    if (fd<0)
    {
        perror("Error opening file.");
        exit(1);
    }
    size_t buf = 128;

    char buffer[buf];
    read(fd, buffer, buf);
    write(1, buffer, buf);
    write(1, "\n", 1);
    close(fd);

    int x = open("qbc.txt", O_APPEND | O_CREAT | O_WRONLY, 0644);
    if ( x<0)
    {
        perror("Error opening file.");
        exit(1);
    }
    if (write( x, "Hello, world\n", 13) == -1) {
        perror("Error writing to file");
        return 1;
    }

}