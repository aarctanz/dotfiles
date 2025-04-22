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
    # Build the tree
    root = buildTree(sorted_chars)
    # Generate the codes
    codes = {}
    def generate_codes(node, code):
        if node is not None:
            if node.c is not None:
                codes[node.c] = code
            generate_codes(node.left, code + "0")
            generate_codes(node.right, code + "1")
    generate_codes(root, "")
    print(codes)
    # Encode the string
    encoded_string = ""



def buildTree(sorted_chars: list):
    root = None
    while sorted_chars:
        if root is None:
            c1 = sorted_chars.pop(0)
            c2 = sorted_chars.pop(0)
            root = Node(c1[1] + c2[1], None, Node(c1[0]), Node(c2[0]))
        else:
            c1 = sorted_chars.pop(0)
            c2 = sorted_chars.pop(0)
            root = Node(c1[1] + c2[1], None, Node(c1[0]), Node(c2[0]), root)
    return root

        

encoder(s)