#include <stdio.h>
void main() {
    char filename[10];
    int startBlock, fileLength, i;
    int blocks[50] = {0}; // 0 = Free, 1 = Occupied

    printf("\nEnter the file name: ");
    scanf("%s", filename);
    printf("\nEnter the starting block: ");
    scanf("%d", &startBlock);
    printf("\nEnter the length of the file: ");
    scanf("%d", &fileLength);
    printf("\nFile Name\tStart Block\tAllocated Blocks\n");
    printf("%s\t\t%d\t\t", filename, startBlock);
    for (i = startBlock; i < startBlock + fileLength; i++) {
        blocks[i] = 1;  // Mark block as filled
        printf("%d ", i);
    }
    printf("\n\nBlock Status Table (Block Number : Status):\n");
    for (i = 0; i < 50; i++) {
        printf("[%d:%d] ", i, blocks[i]);
    }
    printf("\n");
}
