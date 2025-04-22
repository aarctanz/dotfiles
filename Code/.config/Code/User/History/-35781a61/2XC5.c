#include <stdio.h>
#include <stdlib.h>

#define MAX 10

struct Process {
    int pid;           // Process ID
    int burst_time;    // Burst Time
    int arrival_time;  // Arrival Time
    int completion_time; // Completion Time
    int turnaround_time; // Turnaround Time
    int waiting_time;    // Waiting Time
};

int compare(const void *a, const void *b) {
    return ((struct Process*)a)->burst_time - ((struct Process*)b)->burst_time;
}

int sjf(struct Process proc[], int n) {
    int current_time = 0;

    for (int i = 0; i < n; i++) {
        if (proc[i].arrival_time > current_time) {
            current_time = proc[i].arrival_time;
        }

        proc[i].completion_time = current_time + proc[i].burst_time;
        
        proc[i].turnaround_time = proc[i].completion_time - proc[i].arrival_time;
        
        proc[i].waiting_time = proc[i].turnaround_time - proc[i].burst_time;

        current_time = proc[i].completion_time;
    }
    return current_time;
}

void displayProcesses(struct Process proc[], int n) {
    printf("PID\tArrival Time\tBurst Time\tCompletion Time\tTurnaround Time\tWaiting Time\n");
    for (int i = 0; i < n; i++) {
        printf("%d\t%d\t\t%d\t\t%d\t\t%d\t\t%d\n", proc[i].pid, proc[i].arrival_time, proc[i].burst_time, proc[i].completion_time, proc[i].turnaround_time, proc[i].waiting_time);
    }
}

int main() {
    struct Process proc[MAX];
    int n = 5;

    struct Process p[] = {{.pid = 0,.arrival_time = 0, .burst_time = 5}, {.pid = 1,.arrival_time = 2, .burst_time = 3}, {.pid = 2,.arrival_time = 3, .burst_time = 13}, {.pid = 3,.arrival_time = 1, .burst_time = 3}, {.pid = 4,.arrival_time = 7, .burst_time = 6}};
    
    qsort(p, n, sizeof(struct Process), compare);

    int time = sjf(p, n);

    displayProcesses(p, n);
    printf("Throughput = %f\n",(float)n/time);

    return 0;
}