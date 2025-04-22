n = int(input())

for i in range(n):

    n,m  = [ int(x) for x in input().split(" ")]
    a = [ int(x) for x in input().split(" ")]
    b = [ int(x) for x in input().split(" ")]

    a[0] = min(b)-a[0]
    b.sort()
    for i in range(1,n):
        for j in b:
            if b-a[i]>a[i-1]:
                a[i] = b-a[i]
        