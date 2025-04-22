#include<stdio.h>
#include<stdlib.h>
#include<math.h>

void scan(int requests[], int n, int head, int disk_size) {
    int seek = 0;
    int left[100], right[100], l = 0, r = 0;
    for (int i = 0; i < n; i++) {
        if (requests[i] < head) left[l++] = requests[i];
        else right[r++] = requests[i];
    }
    left[l++] = 0;
    for (int i = 0; i < r - 1; i++)
        for (int j = 0; j < r - i - 1; j++)
            if (right[j] > right[j + 1]) {
                int temp = right[j]; right[j] = right[j + 1]; right[j + 1] = temp;
            }
    for (int i = 0; i < l - 1; i++)
        for (int j = 0; j < l - i - 1; j++)
            if (left[j] < left[j + 1]) {
                int temp = left[j]; left[j] = left[j + 1]; left[j + 1] = temp;
            }
    for (int i = 0; i < r; i++) {
        seek += abs(right[i] - head);
        head = right[i];
    }
    for (int i = 0; i < l; i++) {
        seek += abs(left[i] - head);
        head = left[i];
    }
    printf("SCAN Total Seek Time: %d\n", seek);
}

int main() {
    int requests[] = {98, 183, 37, 122, 14, 124, 65, 67};
    int n = sizeof(requests) / sizeof(requests[0]);
    int head = 53;
    int disk_size = 200; 
    scan(requests, n, head, disk_size);
    return 0;
}