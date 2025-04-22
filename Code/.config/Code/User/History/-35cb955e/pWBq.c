#include <stdio.h>
#define MAX 10

struct Process {
    int pid, bt, wt, tat, queue;
};

// Function to calculate waiting and turnaround time
void calculateTimes(struct Process proc[], int n) {
    int total_wt = 0, total_tat = 0;

    printf("\nProcess  Queue  Burst Time  Waiting Time  Turnaround Time\n");
    for (int i = 0; i < n; i++) {
        proc[i].tat = proc[i].bt + proc[i].wt;
        total_wt += proc[i].wt;
        total_tat += proc[i].tat;
        printf("  %d\t%d\t%d\t\t%d\t\t%d\n", proc[i].pid, proc[i].queue, proc[i].bt, proc[i].wt, proc[i].tat);
    }

    printf("\nAverage Waiting Time = %.2f", (float)total_wt / n);
    printf("\nAverage Turnaround Time = %.2f\n", (float)total_tat / n);
}

int main() {
    int n, tq, time = 0;
    printf("Enter the number of processes: ");
    scanf("%d", &n);
    
    struct Process proc[n];
    int queue1[MAX], queue2[MAX], q1_size = 0, q2_size = 0;

    // Input burst time and queue type
    for (int i = 0; i < n; i++) {
        proc[i].pid = i + 1;
        printf("Enter Burst Time and Queue (1 for RR, 2 for FCFS) of Process %d: ", i + 1);
        scanf("%d %d", &proc[i].bt, &proc[i].queue);

        if (proc[i].queue == 1)
            queue1[q1_size++] = i;
        else
            queue2[q2_size++] = i;
    }

    // Round Robin for Queue 1
    printf("Enter Time Quantum for Round Robin: ");
    scanf("%d", &tq);

    int rem_bt[MAX];
    for (int i = 0; i < q1_size; i++)
        rem_bt[queue1[i]] = proc[queue1[i]].bt;

    while (1) {
        int done = 1;
        for (int i = 0; i < q1_size; i++) {
            int index = queue1[i];
            if (rem_bt[index] > 0) {
                done = 0;
                if (rem_bt[index] > tq) {
                    time += tq;
                    rem_bt[index] -= tq;
                } else {
                    time += rem_bt[index];
                    proc[index].wt = time - proc[index].bt;
                    rem_bt[index] = 0;
                }
            }
        }
        if (done) break;
    }

    // FCFS for Queue 2
    for (int i = 0; i < q2_size; i++) {
        int index = queue2[i];
        proc[index].wt = time;
        time += proc[index].bt;
    }

    // Calculate turnaround times and display results
    calculateTimes(proc, n);
    
    return 0;
}
