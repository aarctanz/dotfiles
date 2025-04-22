x = int(input())

for i in range(x):
    lis = []
    lis = input()
    lis = [int(x) for x in lis.split(" ")]
    mx = 0
    posb = [lis[0]+lis[1], lis[2]-lis[1]]

    for k in posb:
        l = lis[:]
        l.insert(2, k)
        c = 0
        for i in range(3):
            if(l[i]+l[i+1]==l[i+2]):
                c+=1
        mx = max(mx,c)
    print(mx)