#include <stdio.h>
#include <stdlib.h>

struct tree
{
    int data;
    struct tree *right;
    struct tree *left;
    int bl;
};

int height(struct tree *root)
{
    if (root == NULL)
    {
        return 0;
    }

    int l = 1 + height(root->left);
    int r = 1 + height(root->right);

    return l >= r ? l : r;
}

void pr(struct tree *root)
{
    if (root == NULL)
    {
        return;
    }
    printf("%d -> %d ", root->data, root->bl);
    pr(root->left);
    pr(root->right);
}

// struct tree* insert(struct tree* root, int data){
//     if(root==NULL){
//         struct tree* new = (struct tree *)malloc(sizeof(struct tree));
//         new->data = data;
//         new->left = NULL;
//         new->right = NULL;
//         return new;
//     }
//     if(data == root->data){
//         printf("Insertion not allowed.");
//         return NULL;
//     }

//     if(data > root->data){
//         if(root->right)
//             insert(root->right, data);
//         else
//             root->right = insert(root->right, data);
//     } else{
//         if (root->left)
//         {
//             insert(root->left, data);
//         }
//         else{
//             root->left = insert(root->left,data);
//         }
//     }
//     return NULL;
// }

int bl(struct tree *root)
{
    int lh = height(root->left);
    int rh = height(root->right);

    return lh - rh;
}

void fiximb(struct tree **root)
{
    int bl = (*root)->bl;

    if (bl >= 3)
    {
        int lbl = (*root)->left->bl;
        if (lbl <= -2)
        {
            // LR imbalance
            struct tree *temp = *root;
            *root = (*root)->left->right;
            struct tree *t1 = (*root)->left;
            temp->left = (*root)->right;
            (*root)->left->right = t1;
        }
        else
        {
            // LL Imbalance
            struct tree *temp = *root;
            *root = (*root)->left;
            temp->left = (*root)->right;
            (*root)->right = temp;
        }
    }
    else if (bl <= -3)
    {
        int rbl = (*root)->left->bl;
        if (rbl >= 2)
        {
            // RL imbalance
            struct tree *temp = *root;
            *root = (*root)->right->left;
            struct tree *t1 = (*root)->right;
            temp->right = (*root)->left;
            (*root)->right->left = t1;
        }
        else
        {
            // RR Imbalance
            struct tree *temp = *root;
            *root = (*root)->right;
            temp->right = (*root)->left;
            (*root)->left = temp;
        }
    }
    return;
}

void updateBl(struct tree *root)
{
    if (root == NULL)
    {
        return;
    }
    int b = bl(root);
    root->bl = b;
    updateBl(root->left);
    updateBl(root->right);
}

void checkImbalance(struct tree **root)
{
    if (*root == NULL)
    {
        return;
    }
    checkImbalance(&((*root)->left));
    checkImbalance(&((*root)->right));

    if ((*root)->bl != 1 && (*root)->bl != 0 &&  )
    {
        fiximb((root));
        return;
    }
}

void insert(struct tree **root, int data)
{
    if (*root == NULL)
    {
        struct tree *new = (struct tree *)malloc(sizeof(struct tree));
        new->data = data;
        new->left = NULL;
        new->right = NULL;
        new->bl = 0;
        *root = new;
        return;
    }
    if (data == (*root)->data)
    {
        printf("Insertion not allowed. %d %d\n", data, (*root)->data);
        return;
    }
    struct tree *temp = *root;
    if (data > temp->data)
    {

        insert(&((*root)->right), data);
    }
    else
    {
        insert(&((*root)->left), data);
    }
}

void balanceInsert(struct tree **root, int data)
{
    insert(root, data);
    updateBl(*root);
    checkImbalance(root);
    updateBl(*root);
}

void inorder(struct tree *root){
    if (root==NULL)
    {
        return; 
    }
    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
    
}
void preorder(struct tree *root){
    if (root==NULL)
    {
        return; 
    }
    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
    
}

int main()
{
    struct tree *root = NULL;
    balanceInsert(&root, 48);
    balanceInsert(&root, 32);
    balanceInsert(&root, 72);
    balanceInsert(&root, 19);
    balanceInsert(&root, 14);
    balanceInsert(&root, 17);
    // balanceInsert(&root, 40);
    
    pr(root);
    printf("\n%d\n", height(root));
    inorder(root);
    printf("\n");
    preorder(root);
}