x = int(input())

for i in range(x):
    lis = []
    lis = input()
    lis = [int(x) for x in lis.split(" ")]
    print(lis)
    mx = 0
    posb = [lis[0]+lis[1], lis[2]-lis[1]]

    for k in posb:
        l = lis[:]
        l.insert(2, k)
        print(l)