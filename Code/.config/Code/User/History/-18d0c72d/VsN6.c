#include <stdio.h>
void main() {
    char filename[10];
    int i, n, blocks[50] = {0}; // 0 = Free, 1 = Occupied
    int allocated[10];

    printf("\nEnter the file name: ");
    scanf("%s", filename);
    printf("\nEnter the number of blocks needed: ");
    scanf("%d", &n);

    printf("\nEnter block numbers:\n");
    for (i = 0; i < n; i++) {
        scanf("%d", &allocated[i]);
        blocks[allocated[i]] = 1; // Mark block as filled
    }
    printf("\nFile Name\tAllocated Blocks (Linked List)\n");
    printf("%s\t\t", filename);

    for (i = 0; i < n; i++) {
        printf("%d -> ", allocated[i]);
    }
    printf("NULL\n");
    printf("\nBlock Status Table (Block Number : Status):\n");
    for (i = 0; i < 50; i++) {
        printf("[%d:%d] ", i, blocks[i]);
    }
    printf("\n");
}
