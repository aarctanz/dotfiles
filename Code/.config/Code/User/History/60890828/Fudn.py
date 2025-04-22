s = "abbbdbbbabbbeeaceabaccbcaebcbcbadbabebebbeabbadedabdcbabcbbabadbcbcedbbecaeeeecdcbabbbccbbeaeeebbbca"
class Node:
    def __init__(self, p, c=None, left=None, right=None):
        self.p = p
        self.c = c
        self.left = left
        self.right = right

def encoder(s: str):
    l = len(s)
    count = {}
    for c in s:
        if c in count:
            count[c] += 1
        else:
            count[c] = 1
    
    # Sort the characters by frequency
    sorted_chars = sorted(count.items(), key=lambda x: x[1])
    print(sorted_chars)


def buildTree(sorted_chars: list):
    root = None
    while sorted_chars:
        if root is None:
            c1 = sorted_chars.

encoder(s)