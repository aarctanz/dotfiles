x = int(input())

for i in range(x):
    lis = []
    for j in range(4):
        lis.append(int(input()))
    
    mx = 0
    posb = [lis[0]+lis[1], lis[2]-lis[1]]

    for k in posb:
        l = lis[:]
        l.insert(2, k)
        print(l)