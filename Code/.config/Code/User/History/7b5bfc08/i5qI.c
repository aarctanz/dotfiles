#include <stdio.h>
void main() {
    char filename[10];
    int i, indexBlock, childIndexBlocks[10], blocks[50] = {0}; // 0 = Free, 1 = Occupied

    printf("\nEnter the file name: ");
    scanf("%s", filename);
    printf("\nEnter index block: ");
    scanf("%d", &indexBlock);
    blocks[indexBlock] = 1; // Mark index block as filled

    for (i = 0; i < 5; i++) {
        printf("\nEnter the child of index block %d: ", i + 1);
        scanf("%d", &childIndexBlocks[i]);
        blocks[childIndexBlocks[i]] = 1; // Mark allocated blocks as filled
    }

    printf("\nFile Name\tIndex Block\tAllocated Blocks\n");
    printf("%s\t\t%d\t\t", filename, indexBlock);

    for (i = 0; i < 5; i++) {
        printf("%d ", childIndexBlocks[i]);
    }
    printf("\n");

    printf("\nBlock Status Table (Block Number : Status):\n");
    for (i = 0; i < 50; i++) {
        printf("[%d:%d] ", i, blocks[i]);
    }
    printf("\n");
}
