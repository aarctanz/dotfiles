s = "ebbceabbdddebabecabbbacddbeaecdaccddbbdaeaeaecababbcbaebcadbbbdecaeaaedbabdcbabcabbabdbebbabbdaabecc"

class Node:
    def __init__(self, p, c=None):
        self.p = p
        self.c = c

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


def buildTree():
