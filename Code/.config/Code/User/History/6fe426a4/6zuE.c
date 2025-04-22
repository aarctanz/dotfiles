#include <stdio.h>
#define MAX 5

typedef struct
{
    int id;
    int arrival;
    int waiting;
    int burst;
    int comp;
    int tat;
    int exec;
} process;

int fcfs(process arr[], int len)
{
    int time = 0;
    int current = 0;
    while (1)
    {
        if (current == MAX)
        {
            break;
        }
        if (time < arr[current].arrival)
        {
            time = arr[current].arrival;
        }

        arr[current].comp = arr[current].burst + time;
        time += arr[current].burst;
        arr[current].tat = arr[current].comp - arr[current].arrival;
        arr[current].waiting = arr[current].tat - arr[current].burst;
        current++;
    }
    return time;
}




int main()
{

    process p[] = {{.id = 0,.arrival = 0, .burst = 5}, {.id = 1,.arrival = 2, .burst = 3}, {.id = 2,.arrival = 3, .burst = 13}, {.id = 3,.arrival = 15, .burst = 3}, {.id = 4,.arrival = 7, .burst = 6}};
    int time = fcfs(p, MAX);
    printf("First come first serve: \n");
    for (int i = 0; i < MAX; i++)
    {
        printf("\nProcess %d\n", i);
        printf("Arrival time: %d\n", p[i].arrival);
        printf("Burst time: %d\n", p[i].burst);
        printf("Completion time: %d\n", p[i].comp);
        printf("Turn around time: %d\n", p[i].tat);
        printf("Waiting time: %d\n", p[i].waiting);
    }

    printf("\nThroughput: %.2f\n", (float)MAX / time);

   return 0;
}
