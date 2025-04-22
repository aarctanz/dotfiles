n = int(input())
indexes = [(x,y) for y in range(n) for x in range(n)]

attacks = [(1,2), (2,1), (1,-2), (-2,1), (-1, -2), (-2,-1),(-1, 2), (2,-1)]

def getUnsafe(index):
    unsafe = []
    for i in attacks:
        x = index[0] + i[0]
        y = index[1] + i[1]

        if x<0 or y<0 or x>=n or y>=n:
            continue
        unsafe.append((x,y))
    return unsafe
  
for i in indexes:
    unsafes = getUnsafe(i)
    print(i, unsafes)