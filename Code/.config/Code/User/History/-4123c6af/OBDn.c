#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include<stdio.h>
int main() {
    char buf[32];  
    size_t count = 16;  
    ssize_t c = read(0, buf, count);  

    if (c == -1) {
        perror("Error reading from stdin");
        return 1;
    }

    buf[c] = '\0'; 

    memmove(buf + 7, buf, c + 1);  
    memcpy(buf, "Hello, ", 7); 

    write(1, buf, c + 7); 
    return 0;
}
