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

void cscan(int requests[], int n, int head, int disk_size) {
    int seek = 0;
    int left[100], right[100], l = 0, r = 0;
    for (int i = 0; i < n; i++) {
        if (requests[i] < head) left[l++] = requests[i];
        else right[r++] = requests[i];
    }
    left[l++] = 0;
    right[r++] = disk_size - 1;
    for (int i = 0; i < r - 1; i++)
        for (int j = 0; j < r - i - 1; j++)
            if (right[j] > right[j + 1]) {
                int temp = right[j]; right[j] = right[j + 1]; right[j + 1] = temp;
            }
    for (int i = 0; i < l - 1; i++)
        for (int j = 0; j < l - i - 1; j++)
            if (left[j] > left[j + 1]) {
                int temp = left[j]; left[j] = left[j + 1]; left[j + 1] = temp;
            }
    for (int i = 0; i < r; i++) {
        seek += abs(right[i] - head);
        head = right[i];
    }
    head = 0;
    seek += disk_size - 1;
    for (int i = 0; i < l; i++) {
        seek += abs(left[i] - head);
        head = left[i];
    }
    printf("C-SCAN Total Seek Time: %d\n", seek);
}

void look(int requests[], int n, int head) {
    int seek = 0;
    int left[100], right[100], l = 0, r = 0;
    for (int i = 0; i < n; i++) {
        if (requests[i] < head) left[l++] = requests[i];
        else right[r++] = requests[i];
    }
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
    printf("LOOK Total Seek Time: %d\n", seek);
}

void clook(int requests[], int n, int head) {
    int seek = 0;
    int left[100], right[100], l = 0, r = 0;
    for (int i = 0; i < n; i++) {
        if (requests[i] < head) left[l++] = requests[i];
        else right[r++] = requests[i];
    }
    for (int i = 0; i < r - 1; i++)
        for (int j = 0; j < r - i - 1; j++)
            if (right[j] > right[j + 1]) {
                int temp = right[j]; right[j] = right[j + 1]; right[j + 1] = temp;
            }
    for (int i = 0; i < l - 1; i++)
        for (int j = 0; j < l - i - 1; j++)
            if (left[j] > left[j + 1]) {
                int temp = left[j]; left[j] = left[j + 1]; left[j + 1] = temp;
            }
    for (int i = 0; i < r; i++) {
        seek += abs(right[i] - head);
        head = right[i];
    }
    if (l > 0) {
        seek += abs(head - left[0]);
        head = left[0];
    }
    for (int i = 0; i < l; i++) {
        seek += abs(left[i] - head);
        head = left[i];
    }
    printf("C-LOOK Total Seek Time: %d\n", seek);
}
