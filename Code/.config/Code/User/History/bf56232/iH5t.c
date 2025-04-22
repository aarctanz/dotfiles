#include<stdio.h>
#include<stdlib.h>
#include<math.h>

void sstf(int requests[], int n, int head) {
    int seek = 0, done[n], count = 0;
    for (int i = 0; i < n; i++) done[i] = 0;
    while (count < n) {
        int min = 1e9, index = -1;
        for (int i = 0; i < n; i++) {
            if (!done[i] && abs(requests[i] - head) < min) {
                min = abs(requests[i] - head);
                index = i;
            }
        }
        printf("Head moving from %d to %d\n", head, requests[index]);
        seek += abs(requests[index] - head);
        head = requests[index];
        done[index] = 1;
        count++;
    }
    printf("SSTF Total Seek Time: %d\n", seek);
}

int main() {
    int requests[] = {98, 183, 37, 122, 14, 124, 65, 67};
    int n = sizeof(requests) / sizeof(requests[0]);
    int head = 53;
    sstf(requests, n, head);
    return 0;
}