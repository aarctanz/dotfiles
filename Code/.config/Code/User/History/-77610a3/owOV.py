n = int(input())

for i in range(n):

    n,m  = [ int(x) for x in input().split(" ")]
    a = [ int(x) for x in input().split(" ")]
    b = [ int(x) for x in input().split(" ")]
    # print(a,b)
    for i in range(n-1):
        if(a[i]>a[i+1]):
            if(b[0]-a[i]>a[i+1]):
                print("NO")
                break
    else:
        print("YES")
