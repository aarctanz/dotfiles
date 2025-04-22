n = int(input())

for i in range(n):

    n,m  = [ int(x) for x in input().split(" ")]
    a = [ int(x) for x in input().split(" ")]
    b = [ int(x) for x in input().split(" ")]
    # print(a,b)
    for i in range(1,n):
        if(a[i-1]>a[i]):
            a[i-1] = b[0] - a[i-1]
    print(a)
    
    # print("dfsgd")
