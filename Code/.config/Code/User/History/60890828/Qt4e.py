s = "ebbceabbdddebabecabbbacddbeaecdaccddbbdaeaeaecababbcbaebcadbbbdecaeaaedbabdcbabcabbabdbebbabbdaabecc"

def encoder(s: str):
    l = len(s)
    count = {}
    for c in s:
        if c in count:
            count[c] += 1
        else:
            count[c] = 1
    
    