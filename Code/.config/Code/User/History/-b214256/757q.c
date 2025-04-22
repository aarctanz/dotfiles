#include <stdio.h>
#include <stdlib.h>
#include <math.h>

void fcfs(int requests[], int n, int head) {
    int seek = 0;
    for (int i = 0; i < n; i++) {
        seek += abs(requests[i] - head);
        head = requests[i];
    }
    printf("FCFS Total Seek Time: %d\n", seek);
}


