#include <stdio.h>
struct Process { int pid, bt, rem_bt, wt, tat; };

void roundRobin(struct Process p[], int n, int q) {
    int time = 0, remaining = n, total_wt = 0, total_tat = 0;
    while (remaining > 0) {
        for (int i = 0; i < n; i++) {
            if (p[i].rem_bt > 0) {
                if (p[i].rem_bt > q) {
                    time += q;
                    p[i].rem_bt -= q;
                } else {
                    time += p[i].rem_bt;
                    p[i].wt = time - p[i].bt;
                    p[i].tat = time;
                    total_wt += p[i].wt;
                    total_tat += p[i].tat;
                    p[i].rem_bt = 0;
                    remaining--;
                }
            }
        }
    }

    printf("\nPID  BT  WT  TAT\n");
    for (int i = 0; i < n; i++)
        printf("%d    %d   %d   %d\n", p[i].pid, p[i].bt, p[i].wt, p[i].tat);

    printf("\nAvg WT: %.2f | Avg TAT: %.2f\n", (float)total_wt / n, (float)total_tat / n);
}

int main() {
    int n, q;
    printf("Enter process count & time quantum: ");
    scanf("%d %d", &n, &q);
    struct Process p[n];
    for (int i = 0; i < n; i++) {
        p[i].pid = i + 1;
        printf("Enter Burst Time for P%d: ", i + 1);
        scanf("%d", &p[i].bt);
        p[i].rem_bt = p[i].bt;
    }
    roundRobin(p, n, q);
}
