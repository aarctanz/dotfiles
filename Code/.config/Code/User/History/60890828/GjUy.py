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
    nodes = [Node(p, c) for c, p in sorted_chars]
    while len(nodes) > 1:
        left = nodes.pop(0)
        right = nodes.pop(0)
        new_node = Node(left.p + right.p, None, left, right)
        nodes.append(new_node)
        nodes.sort(key=lambda x: x.p)
    return nodes[0]  # Return the root of the tree

        

encoder(s)