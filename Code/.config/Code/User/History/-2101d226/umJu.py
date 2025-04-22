n = int(input())

for i in range(n):

    n,m  = [ int(x) for x in input().split(" ")]
    a = [ int(x) for x in input().split(" ")]
    b = [ int(x) for x in input().split(" ")]
    print(a,b)
    if(a[0]<min(b)-a[0]):
        a[0] = min(b)-a[0]
    b.sort()
    for i in range(1,n):
        for j in b:
            if j-a[i]>=a[i-1] and a[i]<:
                a[i] = j-a[i]
                break
    print(a)
    for i in range(n-1):
        if(a[i]>a[i+1]):
            print("NO")
            break
    else:
        print("YES")