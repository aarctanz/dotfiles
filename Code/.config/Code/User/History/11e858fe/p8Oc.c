#include <stdio.h>
#include <stdlib.h>

#define MAX 10

struct Process
{
    int pid;
    int burst_time;
    int arrival_time;
    int completion_time;
    int turnaround_time;
    int waiting_time;
    int priority;
    int completed;
    int remaining;
};

void sortProcess(struct Process p[], int n, int current_time)
{
    int min_priority = __INT_MAX__;
    int idx = -1;
    for (int i = 0; i < n; i++)
    {
        if (p[i].completed == 0 && p[i].arrival_time <= current_time && p[i].priority < min_priority)
        {
            min_priority = p[i].priority;
            idx = i;
        }
    }
    if (idx != -1)
    {
        struct Process temp = p[0];
        p[0] = p[idx];
        p[idx] = temp;
    }
}

int srtf(struct Process p[], int n)
{
    int current_time = 0;
    int remaining_processes = n;

    while (remaining_processes > 0)
    {
        sortProcess(p, n, current_time);  

        if (p[0].remaining > 0)
        {
            p[0].remaining--; 
            current_time++;       

            if (p[0].remaining == 0)
            {
                p[0].completed = 1;
                p[0].completion_time = current_time;

                p[0].turnaround_time = p[0].completion_time - p[0].arrival_time;
                p[0].waiting_time = p[0].turnaround_time - p[0].burst_time;

                remaining_processes--; 
            }
        }
        else
        {
            current_time++;
        }
    }

    return current_time;
}

void displayProcesses(struct Process proc[], int n)
{
    printf("PID\tArrival Time\tBurst Time\tCompletion Time\tTurnaround Time\tWaiting Time\tPriority\n");
    for (int i = 0; i < n; i++)
    {
        printf("%d\t%d\t\t%d\t\t%d\t\t%d\t\t%d\t\t%d\n", proc[i].pid, proc[i].arrival_time, proc[i].burst_time, proc[i].completion_time, proc[i].turnaround_time, proc[i].waiting_time, proc[i].priority);
    }
}

int main()
{
    struct Process proc[MAX];
    int n = 5;

    struct Process p[] = {
        {.pid = 0, .arrival_time = 0, .burst_time = 5, .priority = 1, .completed = 0, .remaining=5},
        {.pid = 1, .arrival_time = 3, .burst_time = 3, .priority = 0, .completed = 0, .remaining=3},
        {.pid = 2, .arrival_time = 3, .burst_time = 13, .priority = 3, .completed = 0, .remaining=13},
        {.pid = 3, .arrival_time = 1, .burst_time = 3, .priority = 3, .completed = 0, .remaining=3},
        {.pid = 4, .arrival_time = 7, .burst_time = 6, .priority = 2, .completed = 0, .remaining=6}};

    int time = srtf(p, n);

    displayProcesses(p, n);

    printf("Throughput = %f\n", (float)n / time); 

    return 0;
}